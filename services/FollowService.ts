import { supabase } from '../lib/supabase';
import { Profile } from './ProfileService';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export class FollowService {
  // Follow a user
  static async followUser(userId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: session.user.id,
          following_id: userId,
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          console.log('Already following this user');
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  // Unfollow a user
  static async unfollowUser(userId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .match({
          follower_id: session.user.id,
          following_id: userId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  // Check if following a user
  static async isFollowing(userId: string): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .match({
          follower_id: session.user.id,
          following_id: userId,
        })
        .single();

      if (error) {
        if (error.code === 'PGRST116') return false; // No rows found
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  // Get followers
  static async getFollowers(userId: string): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower:profiles!follows_follower_id_fkey (
            id,
            username,
            avatar_url,
            is_verified,
            followers_count,
            following_count
          )
        `)
        .eq('following_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => item.follower);
    } catch (error) {
      console.error('Error getting followers:', error);
      throw error;
    }
  }

  // Get following
  static async getFollowing(userId: string): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following:profiles!follows_following_id_fkey (
            id,
            username,
            avatar_url,
            is_verified,
            followers_count,
            following_count
          )
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => item.following);
    } catch (error) {
      console.error('Error getting following:', error);
      throw error;
    }
  }

  // Get suggested users to follow
  static async getSuggestedUsers(limit: number = 5): Promise<Profile[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      // Get users not being followed, ordered by follower count
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', (
          supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', session.user.id)
        ))
        .neq('id', session.user.id)
        .order('followers_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting suggested users:', error);
      throw error;
    }
  }
} 