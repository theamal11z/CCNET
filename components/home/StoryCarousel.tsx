import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';

interface Story {
  id: string;
  username: string;
  avatar?: string;
  hasUnseenStory: boolean;
}

// Mock data - replace with real data from your backend
const mockStories: Story[] = [
  { id: '1', username: 'YourStory', hasUnseenStory: false },
  { id: '2', username: 'user1', hasUnseenStory: true },
  { id: '3', username: 'campus_life', hasUnseenStory: true },
  { id: '4', username: 'events', hasUnseenStory: true },
  { id: '5', username: 'clubs', hasUnseenStory: false },
];

export default function StoryCarousel() {
  const theme = useTheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {mockStories.map((story) => (
        <View key={story.id} style={styles.storyItem}>
          <View style={[
            styles.avatarContainer,
            story.hasUnseenStory && { borderColor: theme.colors.primary }
          ]}>
            <Avatar.Text
              size={50}
              label={story.username[0].toUpperCase()}
              style={styles.avatar}
            />
          </View>
          <Text variant="bodySmall" style={styles.username}>
            {story.username}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  avatarContainer: {
    padding: 2,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  avatar: {
    backgroundColor: '#1A73E8',
  },
  username: {
    marginTop: 4,
    maxWidth: 64,
    textAlign: 'center',
  },
}); 