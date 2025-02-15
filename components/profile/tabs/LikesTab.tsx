import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Box } from '../../themed/Box';
import PostCard from '../../PostCard';
import { LikeService } from '../../../services/LikeService';
import { Post } from '../../../services/FeedService';

interface LikesTabProps {
  userId: string;
}

export default function LikesTab({ userId }: LikesTabProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLikedPosts = async () => {
    try {
      setLoading(true);
      const likedPosts = await LikeService.getLikedPosts(userId);
      setPosts(likedPosts);
    } catch (error) {
      console.error('Error loading liked posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLikedPosts();
  }, [userId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadLikedPosts();
  };

  const renderEmptyState = () => (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      <Text variant="bodyLarge" style={styles.emptyText}>
        No liked posts yet
      </Text>
    </Box>
  );

  if (loading && !refreshing) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 