import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Surface, Text, Avatar, IconButton } from 'react-native-paper';
import { Box } from './themed/Box';

export default function PostCard({ post }) {
  return (
    <Surface style={styles.card} elevation={1}>
      <Box flexDirection="row" padding="m" alignItems="center">
        <Avatar.Image 
          source={{ uri: post.author.avatar_url }} 
          size={40} 
        />
        <Box marginLeft="s">
          <Text variant="titleMedium">{post.author.name}</Text>
          <Text variant="bodySmall" style={styles.time}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </Box>
      </Box>

      <Text style={styles.content}>{post.content}</Text>

      {post.image_url && (
        <Image 
          source={{ uri: post.image_url }}
          style={styles.media}
        />
      )}

      <Box 
        flexDirection="row" 
        justifyContent="space-around"
        padding="s"
        borderTopWidth={1}
        borderTopColor="border"
      >
        <IconButton icon="heart-outline" />
        <IconButton icon="comment-outline" />
        <IconButton icon="share-outline" />
      </Box>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    lineHeight: 20,
  },
  time: {
    color: '#666',
  },
  media: {
    width: '100%',
    height: 200,
  },
});