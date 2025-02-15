import { supabase } from '../lib/supabase';

export const updateUsername = async (userId: string, username: string): Promise<void> => {
  // Basic validation
  if (!username || username.length < 3 || username.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  try {
    // Check availability
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      throw new Error('Username already taken');
    }

    // Update username
    const { error } = await supabase
      .from('profiles')
      .update({ 
        username,
        temp_username: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
}; 