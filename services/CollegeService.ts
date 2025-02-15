
import { supabase } from '../lib/supabase';
import { College } from '../types/supabase';

export class CollegeService {
  static async compareColleges(collegeIds: string[]) {
    const { data, error } = await supabase
      .from('colleges')
      .select(`
        *,
        reviews: college_reviews(avg_rating),
        programs(name, description)
      `)
      .in('id', collegeIds);

    return { data, error };
  }
}
