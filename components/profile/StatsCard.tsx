import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface StatsCardProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  postsCount,
  followersCount,
  followingCount,
  likesReceived,
}) => (
  <View style={styles.container}>
    <StatItem label="Posts" value={postsCount} />
    <StatItem label="Followers" value={followersCount} />
    <StatItem label="Following" value={followingCount} />
    <StatItem label="Likes" value={likesReceived} />
  </View>
);

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
}); 