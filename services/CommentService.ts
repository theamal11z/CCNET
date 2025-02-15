import { supabase } from '../lib/supabase';
import { ProfileService } from './ProfileService';

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string | null;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
}

export class CommentService {
  // Create a comment
  static async createComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      // Ensure profile exists
      await ProfileService.ensureProfileExists(session.user.id);

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: session.user.id,
          content,
          parent_id: parentId,
        })
        .select(`
          *,
          author:profiles!comments_author_id_fkey (
            username,
            avatar_url,
            is_verified
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // Get comments for a post
  static async getComments(postId: string, parentId?: string | null): Promise<Comment[]> {
    try {
      const query = supabase
        .from('comments')
        .select(`
          *,
          author:profiles!comments_author_id_fkey (
            username,
            avatar_url,
            is_verified
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (parentId) {
        query.eq('parent_id', parentId);
      } else {
        query.is('parent_id', null); // Get top-level comments only
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Delete a comment
  static async deleteComment(commentId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Update a comment
  static async updateComment(commentId: string, content: string): Promise<Comment> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { data, error } = await supabase
        .from('comments')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .eq('author_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }
} 