import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text, Surface } from 'react-native-paper';
import { Box } from './themed/Box';
import VerificationBadge from './VerificationBadge';
import { Profile } from '../services/ProfileService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

export default function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  return (
    <Surface style={styles.container} elevation={1}>
      <Box padding="m">
        <Box alignItems="center">
          <View style={styles.avatarContainer}>
            <Avatar.Icon 
              size={80} 
              icon="account"
              style={styles.avatar}
            />
            {profile.is_verified && (
              <VerificationBadge 
                size={24}
                style={styles.verificationBadge}
              />
            )}
          </View>

          <Box marginTop="m" alignItems="center">
            <Box flexDirection="row" alignItems="center" gap="xs">
              <Text variant="headlineSmall" style={styles.username}>
                {profile.username}
              </Text>
            </Box>

            {profile.display_name && (
              <Text variant="bodyLarge" style={styles.displayName}>
                {profile.display_name}
              </Text>
            )}

            {profile.college_name && profile.is_verified && (
              <Box 
                flexDirection="row" 
                alignItems="center" 
                marginTop="s"
                gap="xs"
              >
                <Icon name="school" size={16} color="#666" />
                <Text variant="bodyMedium" style={styles.collegeText}>
                  {profile.college_name}
                </Text>
              </Box>
            )}

            {profile.bio && (
              <Text 
                variant="bodyMedium" 
                style={styles.bio}
                numberOfLines={3}
              >
                {profile.bio}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#e0e0e0',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  username: {
    fontWeight: 'bold',
  },
  displayName: {
    color: '#666',
  },
  collegeText: {
    color: '#666',
  },
  bio: {
    textAlign: 'center',
    marginTop: 8,
    color: '#444',
  },
}); 