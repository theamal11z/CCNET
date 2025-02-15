import supabase from '../lib/supabase';

export interface UsernameValidationResult {
  valid: boolean;
  message?: string;
  available?: boolean;
}

export const validateUsername = async (
  username: string
): Promise<UsernameValidationResult> => {
  try {
    // Basic validation
    if (!username || username.length < 3) {
      return { 
        valid: false, 
        message: 'Username must be at least 3 characters' 
      };
    }

    if (username.length > 20) {
      return { 
        valid: false, 
        message: 'Username cannot exceed 20 characters' 
      };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return {
        valid: false,
        message: 'Only letters, numbers, and underscores allowed',
      };
    }

    // Check availability using direct query instead of RPC
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .maybeSingle();

    if (error) {
      console.error('Username validation error:', error);
      return {
        valid: false,
        message: 'Error checking username availability',
      };
    }

    const isAvailable = !data;
    return {
      valid: true,
      available: isAvailable,
      message: isAvailable ? 'Username available' : 'Username taken',
    };
  } catch (error) {
    console.error('Username validation error:', error);
    return {
      valid: false,
      message: 'Error checking username availability',
    };
  }
};

export const reserveUsername = async (
  userId: string,
  username: string
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      username: username.toLowerCase(),
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error reserving username:', error);
    throw new Error('Failed to reserve username');
  }
}; 