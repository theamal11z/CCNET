import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { ProfileService } from '../services/ProfileService';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

interface User {
  id: string;
  email?: string;
  created_at: string;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear auth state
      set({ 
        user: null, 
        session: null 
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    });
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      await AsyncStorage.setItem('session', JSON.stringify(data.session));
      set({ 
        user: data.user ?? null,
        session: data.session,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },
  register: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Create profile for new user
        await ProfileService.createProfile(
          data.user.id,
          `user_${data.user.id.slice(0, 8)}`
        );
      }

      if (data.session) {
        await AsyncStorage.setItem('session', JSON.stringify(data.session));
        set({ 
          user: data.user,
          session: data.session,
          loading: false 
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        loading: false 
      });
      throw error;
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuth.getState().setSession(session);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuth.getState().setSession(session);
}); 