import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Alert, View } from 'react-native';
import { Button, Surface, Text, IconButton, Menu } from 'react-native-paper';
import { useAuth } from '../stores/auth-store';
import { ProfileService, Profile } from '../services/ProfileService';
import { Box } from '../components/themed/Box';
import { FeedService } from '../services/FeedService';
import { FollowService } from '../services/FollowService';
import { LikeService } from '../services/LikeService';
import { useNavigation } from '@react-navigation/native';
import EditProfileModal from '../components/EditProfileModal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ProfileHeader } from '../components/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    totalLikes: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { user, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userId = user?.id;
  const isOwnProfile = true;

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const profileData = await ProfileService.getProfile(userId);
      setProfile(profileData);

      const { count: postsCount } = await FeedService.getUserPostsCount(userId);

      const [followers, following, likes] = await Promise.all([
        FollowService.getFollowers(userId),
        FollowService.getFollowing(userId),
        LikeService.getUserTotalLikes(userId)
      ]);

      setStats({
        posts: postsCount || 0,
        followers: followers.length,
        following: following.length,
        totalLikes: likes
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleEditProfile = async (updates: Partial<Profile>) => {
    try {
      if (!userId) return;
      await ProfileService.updateProfile(userId, updates);
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <Box style={styles.container}>
      {profile && (
        <>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal="m">
            <ProfileHeader
              username={profile.username} // Assuming profile has a username field
              isVerified={profile.isVerified} // Assuming profile has isVerified field
              stats={stats}
            />
            {isOwnProfile && (
              <View style={styles.actionsContainer}> {/* Added actions container */}
              <Button
                mode="contained"
                onPress={signOut}
                style={styles.button}
              >
                Sign Out
              </Button>
              <Menu
                visible={isMenuVisible}
                onDismiss={() => setIsMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => setIsMenuVisible(true)}
                  />
                }>
                <Menu.Item
                  leadingIcon="pencil"
                  onPress={() => {
                    setIsMenuVisible(false);
                    setIsEditing(true);
                  }}
                  title="Edit Profile"
                />
                <Menu.Item
                  leadingIcon="school"
                  onPress={() => {
                    setIsMenuVisible(false);
                    navigation.navigate('CollegeVerificationScreen');
                  }}
                  title="Verify College"
                />
                <Menu.Item
                  leadingIcon="cog"
                  onPress={() => {
                    setIsMenuVisible(false);
                    navigation.navigate('SettingsScreen');
                  }}
                  title="Settings"
                />
                <Menu.Item
                  leadingIcon="logout"
                  onPress={() => {
                    setIsMenuVisible(false);
                    handleLogout();
                  }}
                  title="Logout"
                  style={{ backgroundColor: '#ffeaea' }}
                  titleStyle={{ color: '#dc3545' }}
                />
              </Menu>
              </View>
            )}
          </Box>

          <Surface style={styles.statsContainer} elevation={1}>
            <Box
              flexDirection="row"
              justifyContent="space-around"
              padding="m"
            >
              <Box alignItems="center">
                <Text variant="titleLarge">{stats.posts}</Text>
                <Text variant="bodyMedium">Posts</Text>
              </Box>
              <Box alignItems="center">
                <Text variant="titleLarge">{stats.followers}</Text>
                <Text variant="bodyMedium">Followers</Text>
              </Box>
              <Box alignItems="center">
                <Text variant="titleLarge">{stats.following}</Text>
                <Text variant="bodyMedium">Following</Text>
              </Box>
              <Box alignItems="center">
                <Text variant="titleLarge">{stats.totalLikes}</Text>
                <Text variant="bodyMedium">Likes</Text>
              </Box>
            </Box>
          </Surface>

          <Box style={styles.tabsContainer}>
            <ProfileTabs
              profile={profile}
              isOwnProfile={isOwnProfile}
            />
          </Box>
        </>
      )}

      <EditProfileModal
        visible={isEditing}
        profile={profile}
        onDismiss={() => setIsEditing(false)}
        onSave={handleEditProfile}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 8,
  },
  logoutButton: {
    borderColor: '#dc3545',
  },
  tabsContainer: {
    flex: 1,
    marginTop: 8,
  },
  actionsContainer: {
    padding: 16,
  }
});