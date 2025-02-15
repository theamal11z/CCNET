import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  grade?: string;
  privacy_level: 'public' | 'verified_only' | 'private';
  created_at: string;
  updated_at: string;
};

export interface VerificationStatus {
  isVerified: boolean;
  documentStatus: 'none' | 'pending' | 'approved' | 'rejected';
  lastUpdated: string;
}

export class ProfileService {
  static async getVerificationStatus(userId: string): Promise<VerificationStatus> {
    const { data, error } = await supabase
      .from('verification_documents')
      .select('status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return {
      isVerified: data?.[0]?.status === 'approved',
      documentStatus: data?.[0]?.status || 'none',
      lastUpdated: data?.[0]?.created_at || new Date().toISOString(),
    };
  }
  static async updatePrivacySettings(userId: string, privacyLevel: Profile['privacy_level']) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ privacy_level: privacyLevel })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  static async createProfile(userId: string, username: string): Promise<Profile> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          privacy_level: 'public', //Adding default privacy level
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  static async getProfile(userId: string): Promise<Profile> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!profile && !error) {
        // Only create profile if the user is authenticated and it's their own profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id === userId) {
          const tempUsername = `user_${userId.slice(0, 8)}`;
          return await this.createProfile(userId, tempUsername);
        }
        throw new Error('Profile not found');
      }

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  static async ensureProfileExists(userId: string): Promise<Profile> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        // Create profile if it doesn't exist
        return await this.createProfile(
          userId,
          `user_${userId.slice(0, 8)}`
        );
      }

      return profile;
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      throw error;
    }
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.id !== userId) {
      throw new Error('Not authorized to update this profile');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          display_name: updates.display_name,
          avatar_url: updates.avatar_url,
          bio: updates.bio,
          grade: updates.grade,
          privacy_level: updates.privacy_level, //Added privacy level update
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}