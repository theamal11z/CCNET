import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { FeedService, FeedType } from '../services/FeedService';
import PostCard from '../components/PostCard';

interface FeedScreenProps {
  feedType: FeedType;
}

export default function FeedScreen({ feedType }: FeedScreenProps) {
  const [page, setPage] = React.useState(0);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['feed', feedType, page],
    queryFn: () => FeedService.getFeed(feedType, page)
  });

  const handleRefresh = () => {
    setPage(0);
    refetch();
  };

  const handleLoadMore = () => {
    if (data?.hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading && !data) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={data?.posts}
      renderItem={({ item }) => <PostCard post={item} />}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
} 