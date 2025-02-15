import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { ProfileService } from './ProfileService';

export type CreatePostDTO = {
  content: string;
  media_urls?: string[];
  location?: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  } | null;
  tags?: string[];
  campus_specific?: boolean;
  campus_id?: string;
};

export class PostService {
  // Create a new post
  static async createPost(postData: CreatePostDTO) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('User must be logged in to create posts');

    try {
      // Ensure profile exists before creating post
      await ProfileService.ensureProfileExists(user.id);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: postData.content,
          media_urls: postData.media_urls || [],
          location: postData.location ? JSON.stringify(postData.location) : null,
          tags: postData.tags || [],
          campus_specific: postData.campus_specific || false,
          campus_id: postData.campus_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
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