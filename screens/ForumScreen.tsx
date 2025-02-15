
import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { FAB, Searchbar, Chip } from 'react-native-paper';
import { Box } from '../components/themed/Box';
import ForumPost from '../components/ForumPost';
import { useQuery } from '@tanstack/react-query';
import { PostService } from '../services/PostService';

const POST_TYPES = ['All', 'Questions', 'Experiences', 'Resources'];

export default function ForumScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts } = useQuery({
    queryKey: ['posts', selectedType, searchQuery],
    queryFn: () => PostService.getPosts({ type: selectedType, query: searchQuery }),
  });

  return (
    <Box flex={1} backgroundColor="background">
      <Searchbar
        placeholder="Search posts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <Box height={50} paddingHorizontal="m">
        <FlatList
          horizontal
          data={POST_TYPES}
          renderItem={({ item }) => (
            <Chip
              selected={selectedType === item}
              onPress={() => setSelectedType(item)}
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
        />
      </Box>

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <ForumPost
            post={item}
            onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
          />
        )}
        keyExtractor={item => item.id}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  chip: {
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
