import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

export interface CreatePostDTO {
  content: string;
  tags?: string[];
  collegeId?: string;
  isAnonymous?: boolean;
  mediaUrls?: string[];
}

export class PostService {
  static async createPost(data: CreatePostDTO) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Authentication required');

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        content: data.content,
        tags: data.tags || [],
        college_id: data.collegeId,
        author_id: user.id,
        is_anonymous: data.isAnonymous || false,
        created_at: new Date().toISOString(),
      })
      .select('*, author:profiles!posts_author_id_fkey(*), college:colleges(*)')
      .single();

    if (error) throw error;
    return post;
  }

  static async getPostWithComments(postId: string) {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, avatar_url),
        college:colleges(*),
        comments:comments(
          *,
          author:profiles(*),
          replies:comments(*)
        )
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return post;
  }

  static async incrementViewCount(postId: string) {
    const { error } = await supabase.rpc('increment_view_count', { post_id: postId });
    if (error) throw error;
  }

  // Upload media for a post
  static async uploadMedia(file: File): Promise<string> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User must be logged in to upload media');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  // Delete a post
  static async deletePost(postId: string) {
    const user = supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to delete posts');

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Update a post
  static async updatePost(postId: string, updates: Partial<CreatePostDTO>) {
    const user = supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to update posts');

    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .eq('author_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Get a single post by ID
  static async getPost(postId: string) {
    try {
      const { data, error } = await supabase
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
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
}