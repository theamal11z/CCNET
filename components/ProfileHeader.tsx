import React from 'react';
import { images } from '../assets';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Surface } from 'react-native-paper';
import { VerificationBadge } from './VerificationBadge';
import { Box } from './themed/Box';

interface ProfileHeaderProps {
  username: string;
  avatarUrl?: string;
  isVerified: boolean;
  college?: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  avatarUrl,
  isVerified,
  college,
  stats
}) => {
  return (
    <Surface style={styles.container} elevation={1}>
      <Box flexDirection="row" alignItems="center" padding="m">
        <Avatar.Image 
          size={80} 
          source={avatarUrl ? { uri: avatarUrl } : images.defaultAvatar} 
        />
        <Box marginLeft="l">
          <Box flexDirection="row" alignItems="center">
            <Text variant="headlineSmall">{username}</Text>
            {isVerified && <VerificationBadge style={styles.badge} />}
          </Box>
          {college && (
            <Text variant="bodyMedium" style={styles.college}>{college}</Text>
          )}
        </Box>
      </Box>

      <View style={styles.statsContainer}>
        <StatItem label="Posts" value={stats.posts} />
        <StatItem label="Followers" value={stats.followers} />
        <StatItem label="Following" value={stats.following} />
      </View>
    </Surface>
  );
};

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statItem}>
    <Text variant="titleLarge">{value}</Text>
    <Text variant="bodyMedium">{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  badge: {
    marginLeft: 8,
  },
  college: {
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
});