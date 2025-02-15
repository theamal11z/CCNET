
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';
import { Box } from './themed/Box';
import { Text } from './themed/Text';
import VerificationBadge from './VerificationBadge';

interface ForumPostProps {
  post: {
    id: string;
    content: string;
    author: {
      username: string;
      avatarUrl: string;
      isVerified: boolean;
    };
    tags: string[];
    postType: 'question' | 'experience' | 'resource';
    college?: {
      name: string;
    };
    createdAt: string;
  };
  onPress: () => void;
}

export default function ForumPost({ post, onPress }: ForumPostProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Box flexDirection="row" alignItems="center" marginBottom="s">
          <Avatar.Image source={{ uri: post.author.avatarUrl }} size={40} />
          <Box marginLeft="s">
            <Box flexDirection="row" alignItems="center">
              <Text variant="titleMedium">{post.author.username}</Text>
              {post.author.isVerified && <VerificationBadge style={styles.badge} />}
            </Box>
            {post.college && (
              <Text variant="bodySmall" color="secondary">
                {post.college.name}
              </Text>
            )}
          </Box>
        </Box>
        
        <Text variant="bodyLarge" style={styles.content}>
          {post.content}
        </Text>

        <Box flexDirection="row" flexWrap="wrap" marginTop="s">
          <Chip style={styles.chip}>{post.postType}</Chip>
          {post.tags.map((tag, index) => (
            <Chip key={index} style={styles.chip}>
              {tag}
            </Chip>
          ))}
        </Box>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  badge: {
    marginLeft: 4,
  },
  content: {
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
    marginTop: 8,
  },
});
