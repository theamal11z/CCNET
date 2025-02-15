
import { supabase } from '../lib/supabase';

export interface MentorProfile {
  user_id: string;
  expertise: string[];
  availability: string;
  college_id: string;
  verified: boolean;
}

export class MentorshipService {
  static async registerAsMentor(profile: Partial<MentorProfile>) {
    const { data, error } = await supabase
      .from('mentor_profiles')
      .insert(profile)
      .select()
      .single();

    return { data, error };
  }

  static async findMentors(collegeId: string) {
    const { data, error } = await supabase
      .from('mentor_profiles')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('college_id', collegeId)
      .eq('verified', true);

    return { data, error };
  }

  static async requestMentorship(mentorId: string, message: string) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .insert({
        mentor_id: mentorId,
        message,
        status: 'pending'
      })
      .select()
      .single();

    return { data, error };
  }
}
