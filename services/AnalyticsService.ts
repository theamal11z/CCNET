
import { supabase } from '../lib/supabase';

export class AnalyticsService {
  static async trackEvent(eventName: string, properties: Record<string, any>) {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: eventName,
        properties,
        timestamp: new Date().toISOString()
      });
    
    return { data, error };
  }

  static async getDailyActiveUsers() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('distinct user_id')
      .gte('timestamp', date.toISOString());

    return { count: data?.length || 0, error };
  }
}
