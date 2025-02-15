import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../stores/auth-store';
import { supabase } from '../lib/supabase';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SetupProfileScreen from '../screens/SetupProfileScreen';
import BottomTabs from './BottomTabs';
import CreatePostScreen from '../screens/CreatePostScreen';
import LoadingScreen from '../screens/LoadingScreen';
import CommentsScreen from '../screens/CommentsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading, setSession } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        // Authenticated stack
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="CreatePost" 
            component={CreatePostScreen}
            options={{ title: 'Create Post' }}
          />
          <Stack.Screen 
            name="Comments" 
            component={CommentsScreen}
            options={{ title: 'Comments' }}
          />
        </>
      ) : (
        // Auth stack
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="SetupProfile" 
            component={SetupProfileScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
} 