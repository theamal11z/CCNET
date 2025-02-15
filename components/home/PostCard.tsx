import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar, Badge } from 'react-native-paper';
import { Box } from '../themed/Box';
import { Text as ThemedText } from '../themed/Text';
import { FollowService } from '../../services/FollowService';
import { useAuth } from '../../stores/auth-store';

interface PostCardProps {
  username: string;
  campusName: string;
  timeAgo: string;
  content: string;
  verified?: boolean;
  tags?: string[];
}

export default function PostCard({
  username,
  campusName,
  timeAgo,
  content,
  verified = false,
  tags = [],
}: PostCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkFollowStatus();
  }, []);

  const checkFollowStatus = async () => {
    if (user?.id === post.author_id) return;
    const following = await FollowService.isFollowing(post.author_id);
    setIsFollowing(following);
  };

  const handleFollow = async () => {
    if (user?.id === post.author_id) return;
    
    try {
      setFollowLoading(true);
      if (isFollowing) {
        await FollowService.unfollowUser(post.author_id);
      } else {
        await FollowService.followUser(post.author_id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <Box 
      backgroundColor="surface"
      padding="m"
      borderRadius={8}
      borderWidth={1}
      borderColor="border"
    >
      <View style={styles.header}>
        <Avatar.Icon
          size={40}
          icon="account"
          color="#fff"
          style={{ backgroundColor: '#bdbdbd' }}
        />
        <View style={styles.headerText}>
          <ThemedText variant="headline3" color="foreground">
            {username}
          </ThemedText>
          <ThemedText variant="body1" color="secondaryText">
            {campusName} • {timeAgo}
          </ThemedText>
        </View>
        {user?.id !== post.author_id && (
          <Button
            mode={isFollowing ? "outlined" : "contained"}
            onPress={handleFollow}
            loading={followLoading}
            disabled={followLoading}
            style={styles.followButton}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </View>
      <Text>{content}</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <ThemedText key={tag} variant="caption" color="secondaryText">#{tag}</ThemedText>
        ))}
      </View>
      <Card.Actions>
        <Button icon="comment">Comment</Button>
        <Button icon="share">Share</Button>
        <Button icon="heart">Like</Button>
      </Card.Actions>
    </Box>
  );
}

const styles = StyleSheet.create({
  verifiedBadge: {
    backgroundColor: '#34A853',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    color: '#1A73E8',
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    marginLeft: 8,
  },
  followButton: {
    marginLeft: 'auto',
  },
}); 