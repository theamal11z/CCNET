import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, IconButton, Button } from 'react-native-paper';
import { Post } from '../services/FeedService';
import { LikeService } from '../services/LikeService';
import { FollowService } from '../services/FollowService';
import { useAuth } from '../stores/auth-store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface PostCardProps {
  post: Post;
  onComment?: () => void;
  onShare?: () => void;
}

export default function PostCard({ post, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  useEffect(() => {
    checkLikeStatus();
    checkFollowStatus();
  }, [post.id]);

  const checkLikeStatus = async () => {
    const hasLiked = await LikeService.hasLiked(post.id);
    setIsLiked(hasLiked);
  };

  const checkFollowStatus = async () => {
    if (user?.id === post.author_id) return; // Don't check if it's the user's own post
    const following = await FollowService.isFollowing(post.author_id);
    setIsFollowing(following);
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      if (isLiked) {
        await LikeService.unlikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await LikeService.likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (user?.id === post.author_id) return; // Can't follow yourself
    
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

  const handleComment = () => {
    navigation.navigate('Comments', { post });
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={post.author.username}
        subtitle={new Date(post.created_at).toLocaleDateString()}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="account"
            size={40}
            color="#fff"
            style={{ backgroundColor: '#bdbdbd' }}
          />
        )}
        right={(props) => (
          user?.id !== post.author_id && (
            <Button
              mode={isFollowing ? "outlined" : "contained"}
              onPress={handleFollow}
              loading={followLoading}
              disabled={followLoading}
              style={styles.followButton}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )
        )}
      />
      <Card.Content>
        <Text>{post.content}</Text>
        {post.media_urls && post.media_urls.length > 0 && (
          <Card.Cover source={{ uri: post.media_urls[0] }} />
        )}
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon={isLiked ? 'heart' : 'heart-outline'}
          onPress={handleLike}
          disabled={loading}
          loading={loading}
        />
        <Text>{likesCount}</Text>
        <IconButton icon="comment-outline" onPress={handleComment} />
        <Text>{post.comments_count || 0}</Text>
        <IconButton icon="share-outline" onPress={onShare} />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  followButton: {
    marginRight: 8,
  },
}); 