import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export class LikeService {
  // Get total likes for a user (both posts and comments)
  static async getUserTotalLikes(userId: string): Promise<number> {
    try {
      // Get post likes count
      const { count: postLikes, error: postError } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_author_id', userId);

      if (postError) throw postError;

      // Get comment likes count
      const { count: commentLikes, error: commentError } = await supabase
        .from('comment_likes')
        .select('comments!inner(author_id)', { count: 'exact', head: true })
        .eq('comments.author_id', userId);

      if (commentError) throw commentError;

      return (postLikes || 0) + (commentLikes || 0);
    } catch (error) {
      console.error('Error getting user total likes:', error);
      return 0;
    }
  }

  // Like a post
  static async likePost(postId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: session.user.id,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  // Unlike a post
  static async unlikePost(postId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .match({
          post_id: postId,
          user_id: session.user.id,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  // Check if user has liked a post
  static async hasLiked(postId: string): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .match({
          post_id: postId,
          user_id: session.user.id,
        })
        .single();

      if (error) {
        if (error.code === 'PGRST116') return false; // No rows found
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }

  // Get likes count for a post
  static async getLikesCount(postId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data?.likes_count || 0;
    } catch (error) {
      console.error('Error getting likes count:', error);
      return 0;
    }
  }

  // Get users who liked a post
  static async getLikedUsers(postId: string) {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          user_id,
          profiles:user_id (
            username,
            avatar_url,
            is_verified
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting liked users:', error);
      throw error;
    }
  }

  // Get liked posts for a user
  static async getLikedPosts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select(`
          post_id,
          posts:posts (
            *,
            author:profiles!posts_author_id_fkey (
              username,
              avatar_url,
              is_verified
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(like => like.posts); // Return the posts associated with the likes
    } catch (error) {
      console.error('Error loading liked posts:', error);
      throw error; // Rethrow the error for handling in the component
    }
  }
} 