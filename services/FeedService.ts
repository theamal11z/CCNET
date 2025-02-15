import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

export type Post = Database['public']['Tables']['posts']['Row'] & {
  author: {
    username: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
  likes: number;
  comments: number;
  has_liked?: boolean;
};

export type FeedType = 'all' | 'following' | 'trending' | 'college';

export interface FeedFilters {
  type: FeedType;
  collegeId?: string;
  timeRange?: 'today' | 'week' | 'month' | 'all';
}

interface UserPostsResult {
  data: Post[];
  hasMore: boolean;
}

export class FeedService {
  static async getFeed(
    type: FeedType,
    page: number = 0,
    limit: number = 10,
    campusId?: string
  ) {
    try {
      // First get the total count
      const { count: totalCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      // If no results or requested page is beyond available data, return empty result
      if (!totalCount || page * limit >= totalCount) {
        return {
          posts: [],
          count: totalCount,
          hasMore: false
        };
      }

      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            username,
            avatar_url,
            is_verified
          ),
          likes:likes_count,
          comments:comments_count
        `)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      // Apply filters based on feed type
      switch (type) {
        case 'campus':
          if (!campusId) throw new Error('Campus ID required for campus feed');
          query = query.eq('campus_specific', true).eq('campus_id', campusId);
          break;
        
        case 'trending':
          query = query.order('likes_count', { ascending: false });
          break;
        
        case 'following':
          const { data: following } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', supabase.auth.getUser()?.id);
          
          if (following?.length) {
            query = query.in('author_id', following.map(f => f.following_id));
          }
          break;
        
        // 'forYou' case - no additional filters, show all posts
        default:
          break;
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching feed:', error);
        throw error;
      }

      // Check if current user has liked each post
      if (data && supabase.auth.getUser()?.id) {
        const postsWithLikeStatus = await Promise.all(
          data.map(async post => {
            const { data: likeData } = await supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', supabase.auth.getUser()?.id)
              .single();

            return {
              ...post,
              has_liked: !!likeData
            };
          })
        );

        return {
          posts: postsWithLikeStatus as Post[],
          count,
          hasMore: count ? (page + 1) * limit < count : false
        };
      }

      return {
        posts: data as Post[],
        count,
        hasMore: count ? (page + 1) * limit < count : false
      };
    } catch (error) {
      console.error('Error fetching feed:', error);
      return {
        posts: [],
        count: 0,
        hasMore: false
      };
    }
  }

  static async likePost(postId: string) {
    const userId = supabase.auth.getUser()?.id;
    if (!userId) throw new Error('User must be logged in to like posts');

    const { error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId
      });

    if (error) {
      if (error.code === '23505') { // Unique violation
        // Unlike if already liked
        return this.unlikePost(postId);
      }
      throw error;
    }

    return true;
  }

  static async unlikePost(postId: string) {
    const userId = supabase.auth.getUser()?.id;
    if (!userId) throw new Error('User must be logged in to unlike posts');

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return false;
  }

  static async getPostComments(
    postId: string,
    page: number = 0,
    limit: number = 10
  ) {
    const { data, error, count } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!comments_author_id_fkey (
          username,
          avatar_url,
          is_verified
        )
      `, { count: 'exact' })
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;

    return {
      comments: data,
      count,
      hasMore: count ? (page + 1) * limit < count : false
    };
  }

  // Get user's posts count
  static async getUserPostsCount(userId: string): Promise<{ count: number }> {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

      if (error) throw error;
      return { count: count || 0 };
    } catch (error) {
      console.error('Error getting user posts count:', error);
      return { count: 0 };
    }
  }

  // Get filtered feed posts
  static async getFeedPosts(filters: FeedFilters): Promise<Post[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            id,
            username,
            avatar_url,
            is_verified,
            college_id
          )
        `);

      // Apply filters
      switch (filters.type) {
        case 'following':
          // First get following IDs
          const { data: followingData } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', session.user.id);
          
          const followingIds = followingData?.map(f => f.following_id) || [];
          
          // Then filter posts by those IDs
          if (followingIds.length > 0) {
            query = query.in('author_id', followingIds);
          } else {
            // Return empty array if not following anyone
            return [];
          }
          break;

        case 'trending':
          // Get posts with most engagement in time range
          const timeFilter = filters.timeRange || 'week';
          const timeRanges: Record<string, number> = {
            today: 1,
            week: 7,
            month: 30,
            all: 365
          };
          
          const daysAgo = timeRanges[timeFilter];
          const timestamp = new Date();
          timestamp.setDate(timestamp.getDate() - daysAgo);
          
          query = query
            .gte('created_at', timestamp.toISOString())
            .order('likes_count', { ascending: false })
            .order('comments_count', { ascending: false });
          break;

        case 'college':
          // Get posts from users in the same college
          if (filters.collegeId) {
            query = query.eq('profiles.college_id', filters.collegeId);
          }
          break;

        default:
          // All posts, just sort by recent
          break;
      }

      // Add common ordering and limits
      query = query.order('created_at', { ascending: false }).limit(20);

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting feed posts:', error);
      throw error;
    }
  }

  // Get user's posts
  static async getUserPosts(userId: string, page: number = 0): Promise<UserPostsResult> {
    if (!userId) {
      return { data: [], hasMore: false };
    }

    try {
      const limit = 10;
      
      // First get total count
      const { count: totalCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

      // If no results or requested page is beyond available data, return empty result
      if (!totalCount || page * limit >= totalCount) {
        return { 
          data: [], 
          hasMore: false 
        };
      }

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            id,
            username,
            avatar_url,
            is_verified
          )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) {
        console.error('Supabase error:', error);
        return { data: [], hasMore: false };
      }

      return {
        data: data || [],
        hasMore: totalCount > (page + 1) * limit
      };
    } catch (error) {
      console.error('Error getting user posts:', error);
      return { data: [], hasMore: false };
    }
  }

  // Create a post
  static async createPost(content: string, mediaUrls: string[] = []): Promise<Post> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content,
          author_id: session.user.id,
          media_urls: mediaUrls,
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            username,
            avatar_url,
            is_verified
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Delete a post
  static async deletePost(postId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
} 