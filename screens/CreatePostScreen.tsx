import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Chip, Portal, Modal } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { Box } from '../components/themed/Box';
import { Text } from '../components/themed/Text';
import PostCard from '../components/home/PostCard';
import { useAuth } from '../stores/auth-store';
import { supabase } from '../lib/supabase';
import { PostService } from '../services/PostService';

interface Location {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MediaAsset {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle media selection
  const handleAddMedia = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 1,
      selectionLimit: 4,
    });

    if (!result.didCancel && result.assets) {
      const newMedia = result.assets.map(asset => ({
        uri: asset.uri!,
        type: asset.type as 'image' | 'video',
        fileName: asset.fileName,
      }));
      setMedia([...media, ...newMedia].slice(0, 4));
    }
  };

  // Handle location selection
  const handleAddLocation = async () => {
    // Implement location picker
    // For now, using mock data
    setLocation({
      name: 'University Library',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
    });
  };

  // Handle tag input
  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Upload media files first
      const mediaUrls = await Promise.all(
        media.map(async (asset) => {
          const file = {
            name: asset.fileName || 'upload.jpg',
            type: asset.type,
            uri: asset.uri,
          };
          return await PostService.uploadMedia(file);
        })
      );

      // Create post
      await PostService.createPost({
        content,
        media_urls: mediaUrls,
        location,
        tags,
        campus_specific: false, // Add UI control for this if needed
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box flex={1} backgroundColor="background">
      <ScrollView style={styles.container}>
        <TextInput
          multiline
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          style={styles.input}
        />

        {/* Media Preview */}
        {media.length > 0 && (
          <View style={styles.mediaPreview}>
            {media.map((asset, index) => (
              <Image
                key={index}
                source={{ uri: asset.uri }}
                style={styles.mediaThumb}
              />
            ))}
          </View>
        )}

        {/* Tags */}
        <View style={styles.tags}>
          {tags.map(tag => (
            <Chip
              key={tag}
              onClose={() => setTags(tags.filter(t => t !== tag))}
              style={styles.chip}
            >
              {tag}
            </Chip>
          ))}
        </View>

        {/* Location */}
        {location && (
          <Chip
            icon="map-marker"
            onClose={() => setLocation(null)}
            style={styles.locationChip}
          >
            {location.name}
          </Chip>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            icon="image"
            mode="outlined"
            onPress={handleAddMedia}
            disabled={media.length >= 4}
          >
            Add Media
          </Button>
          <Button
            icon="map-marker"
            mode="outlined"
            onPress={handleAddLocation}
          >
            Add Location
          </Button>
          <Button
            icon="pound"
            mode="outlined"
            onPress={() => handleAddTag(prompt('Enter tag') || '')}
          >
            Add Tag
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={() => setShowPreview(true)}
          style={styles.previewButton}
        >
          Preview Post
        </Button>
      </ScrollView>

      {/* Preview Modal */}
      <Portal>
        <Modal
          visible={showPreview}
          onDismiss={() => setShowPreview(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <PostCard
              username="You"
              campusName="Your Campus"
              timeAgo="Just now"
              content={content}
              tags={tags}
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowPreview(false)}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || !content}
            >
              Post
            </Button>
          </View>
        </Modal>
      </Portal>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    minHeight: 120,
    backgroundColor: 'transparent',
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  mediaThumb: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    margin: 4,
  },
  locationChip: {
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  previewButton: {
    marginTop: 16,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
}); 