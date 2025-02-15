
import { supabase } from '../lib/supabase';
import type { College } from '../types/supabase';

export interface CollegeSearchParams {
  query?: string;
  location?: { lat: number; lng: number; radius?: number };
  programs?: string[];
  filters?: {
    acceptanceRate?: [number, number];
    studentCount?: [number, number];
  };
}

export class CollegeService {
  static async searchColleges(params: CollegeSearchParams) {
    let query = supabase
      .from('colleges')
      .select(`
        *,
        reviews: college_reviews(avg_rating),
        programs(name, description)
      `);

    if (params.query) {
      query = query.textSearch('name', params.query);
    }

    if (params.location) {
      query = query.rpc('nearby_colleges', {
        lat: params.location.lat,
        lng: params.location.lng,
        radius: params.location.radius || 50
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async compareColleges(collegeIds: string[]) {
    const { data, error } = await supabase
      .from('colleges')
      .select(`
        *,
        reviews: college_reviews(avg_rating),
        programs(name, description)
      `)
      .in('id', collegeIds);

    if (error) throw error;
    return data;
  }
}
