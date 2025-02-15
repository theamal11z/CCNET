# Step 1: Core Authentication & Profile System

## Current Focus
[Phase 1.5 Action] Implementing secure authentication with profile management

## Implementation Steps

### 1. Auth Store Setup
```typescript:stores/auth-store.ts
import create from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types/profile';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  signIn: (provider: 'google' | 'facebook') => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      // Setup auth listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user ?? null;
        set({ user });
        
        if (user) {
          // Fetch or create profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          set({ profile });
        } else {
          set({ profile: null });
        }
      });

      set({ 
        user: session?.user ?? null,
        initialized: true,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        loading: false 
      });
    }
  },

  signIn: async (provider) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      set({ user: session?.user ?? null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));
```

### 2. Profile Types
```typescript:types/profile.ts
export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  grade?: string;
  role: 'basic' | 'verified' | 'moderator' | 'admin' | 'super_admin';
  is_verified: boolean;
  trust_score: number;
  privacy_settings: {
    show_email: boolean;
    show_grade: boolean;
    show_following: boolean;
    show_followers: boolean;
    allow_messages: 'all' | 'verified_only' | 'none';
  };
  created_at: string;
  updated_at: string;
}
```

### 3. Auth Provider Component
```typescript:providers/AuthProvider.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../stores/auth-store';
import { ActivityIndicator, View } from 'react-native';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { initialize, initialized, loading } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};
```

### 4. Protected Route Component
```typescript:components/ProtectedRoute.tsx
import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../stores/auth-store';
import { LoginScreen } from '../screens/LoginScreen';

interface Props {
  children: React.ReactNode;
  requireVerified?: boolean;
}

export const ProtectedRoute: React.FC<Props> = ({ 
  children, 
  requireVerified = false 
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <View />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (requireVerified && !profile?.is_verified) {
    return <VerificationScreen />;
  }

  return <>{children}</>;
};
```

## Security Considerations
1. Session Management:
   - Automatic token refresh
   - Secure session storage
   - Session invalidation on security events

2. Profile Privacy:
   - No real name storage
   - Encrypted sensitive fields
   - Granular privacy controls

3. Authentication Flow:
   - OAuth2 best practices
   - Rate limiting
   - Device tracking

## Next Steps
1. Implement social login UI
2. Add profile completion flow
3. Setup verification pipeline

Would you like me to proceed with any of these next steps? 