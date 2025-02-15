import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Box } from '../../themed/Box';
import PostCard from '../../PostCard';
import { FeedService, Post } from '../../../services/FeedService';

interface PostsTabProps {
  userId: string;
}

export default function PostsTab({ userId }: PostsTabProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadPosts = async (refresh = false) => {
    if (!userId) return;

    try {
      if (refresh) {
        setPage(0);
        setHasMore(true);
      }
      
      if (!hasMore && !refresh) return;

      const response = await FeedService.getUserPosts(userId, page);
      
      if (response && Array.isArray(response.data)) {
        setPosts(prev => refresh ? response.data : [...prev, ...response.data]);
        setHasMore(response.hasMore);
        if (!refresh) setPage(prev => prev + 1);
      } else {
        console.error('Invalid response format:', response);
        setPosts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadPosts();
    }
  }, [userId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts(true);
  };

  const renderEmptyState = () => (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      <Text variant="bodyLarge" style={styles.emptyText}>
        No posts yet
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
      renderItem={({ item }) => (
        <PostCard 
          post={item}
          onRefresh={handleRefresh}
        />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={[
        styles.listContent,
        posts.length === 0 && styles.emptyList
      ]}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={handleRefresh}
        />
      }
      onEndReached={() => !refreshing && loadPosts()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 