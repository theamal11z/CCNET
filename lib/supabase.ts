import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { Database } from '../types/supabase';

// Create Supabase client
export const supabase = createClient<Database>(
  'https://dqtsxfqptauvorpjwgbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdHN4ZnFwdGF1dm9ycGp3Z2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNzU2MTUsImV4cCI6MjA1NDc1MTYxNX0.c-YQwhHpkRILV61KUO7kf-wx6_UuBfUXN4l0eznNrOo',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Validate client initialization
if (!supabase) {
  throw new Error(
    'Supabase client failed to initialize\n' +
    'Verify your Supabase URL and Key configuration'
  );
}

// Export core services
export const auth = supabase.auth;
export const storage = supabase.storage;

// Type definitions
export type SupabaseClient = ReturnType<typeof createClient<Database>>;
export default supabase; 