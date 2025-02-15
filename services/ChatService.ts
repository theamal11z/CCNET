
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  channel_id: string;
  created_at: string;
}

export class ChatService {
  static async sendMessage(channelId: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to send messages');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        content,
        channel_id: channelId,
        sender_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static subscribeToChannel(channelId: string, onMessage: (message: Message) => void) {
    return supabase
      .channel(`chat:${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, payload => {
        onMessage(payload.new as Message);
      })
      .subscribe();
  }

  static async getChannelMessages(channelId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}
