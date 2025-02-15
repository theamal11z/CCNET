import { supabase } from '../lib/supabase';
import { Profile } from './ProfileService';

export interface College {
  id: string;
  name: string;
  location: string;
  image_url: string;
  programs: string[];
  student_count: number;
  acceptance_rate: number;
  created_at: string;
}

export class SearchService {
  static async searchUsers(query: string): Promise<Profile[]> {
    if (!query || query.length < 2) return [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .order('username')
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  static async searchByUsername(username: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error searching by username:', error);
      throw error;
    }
  }

  static async getColleges(): Promise<College[]> {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('student_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  }

  static async searchColleges(query: string): Promise<College[]> {
    if (!query || query.length < 2) return [];

    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
        .order('student_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching colleges:', error);
      throw error;
    }
  }
} 