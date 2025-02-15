import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl, View } from 'react-native';
import { Appbar, FAB, Portal, Surface, ActivityIndicator, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Post, FeedService, FeedType } from '../services/FeedService';
import PostCard from '../components/PostCard';
import FeedFilters from '../components/FeedFilters';
import { useAuth } from '../stores/auth-store';
import { ProfileService, Profile } from '../services/ProfileService';
import { Box } from '../components/themed/Box';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedType, setFeedType] = useState<FeedType>('all');
  const [timeRange, setTimeRange] = useState('week');
  const [fabOpen, setFabOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [feedType, timeRange, userProfile]);

  const loadUserProfile = async () => {
    try {
      if (!user?.id) return;
      const profile = await ProfileService.getProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        type: feedType,
        timeRange: timeRange as 'today' | 'week' | 'month' | 'all',
        collegeId: userProfile?.college_id
      };
      
      const feedPosts = await FeedService.getFeedPosts(filters);
      setPosts(feedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const renderEmptyState = () => (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      {error ? (
        <>
          <Text variant="titleMedium" style={styles.emptyText}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={loadPosts}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </>
      ) : (
        <>
          <Text variant="titleMedium" style={styles.emptyText}>
            {loading ? 'Loading posts...' : 'No posts found'}
          </Text>
          {!loading && (
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              {feedType === 'following' 
                ? 'Follow more people to see their posts'
                : feedType === 'college'
                ? 'Be the first to post in your college'
                : 'Start following people or create a post'}
            </Text>
          )}
        </>
      )}
    </Box>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Appbar.Header style={styles.appbar} mode="center-aligned">
          <Appbar.Content title="CampusConnect" />
          <Appbar.Action icon="account-circle" onPress={handleProfilePress} />
        </Appbar.Header>
        
        <FeedFilters
          selectedType={feedType}
          onTypeChange={setFeedType}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </Surface>

      {loading && !refreshing ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Box>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostCard 
              post={item}
              onRefresh={loadPosts}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <Portal>
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'pencil',
              label: 'Create Post',
              onPress: () => navigation.navigate('CreatePost'),
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          style={styles.fab}
        />
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
  },
  appbar: {
    backgroundColor: 'transparent',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80, // Space for FAB
  },
  separator: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    paddingBottom: 80, // Adjust for bottom tab bar
  },
  emptyText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
  },
  retryButton: {
    marginTop: 16,
  },
}); 