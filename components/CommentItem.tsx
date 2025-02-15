import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton, Menu } from 'react-native-paper';
import { Comment, CommentService } from '../services/CommentService';
import { useAuth } from '../stores/auth-store';

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
  onRefresh: () => void;
}

export default function CommentItem({ comment, onReply, onRefresh }: CommentItemProps) {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await CommentService.deleteComment(comment.id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
      setMenuVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={40}
        icon="account"
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="bodyMedium" style={styles.username}>
            {comment.author?.username}
          </Text>
          <Text variant="bodySmall" style={styles.time}>
            {new Date(comment.created_at).toLocaleDateString()}
          </Text>
          {user?.id === comment.author_id && (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={20}
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item
                onPress={handleDelete}
                title="Delete"
                disabled={loading}
              />
            </Menu>
          )}
        </View>
        <Text style={styles.text}>{comment.content}</Text>
        <View style={styles.actions}>
          <IconButton
            icon="reply"
            size={20}
            onPress={onReply}
          />
          {comment.replies_count > 0 && (
            <Text variant="bodySmall">
              {comment.replies_count} replies
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#bdbdbd',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  time: {
    color: '#666',
  },
  text: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 