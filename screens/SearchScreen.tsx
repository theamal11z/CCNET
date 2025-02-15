import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { SearchService } from '../services/SearchService';
import UserListItem from '../components/UserListItem';
import { Box } from '../components/themed/Box';
import { Text } from '../components/themed/Text';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => SearchService.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      refetch();
    }
  };

  return (
    <Box flex={1} backgroundColor="background">
      <Searchbar
        placeholder="Search users..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {isLoading && (
        <ActivityIndicator style={styles.loader} />
      )}

      {!searchQuery && (
        <Box padding="m" alignItems="center">
          <Text variant="body1" color="secondaryText">
            Search for users by username or name
          </Text>
        </Box>
      )}

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            onPress={() => {}}
          />
        )}
        ListEmptyComponent={() => (
          searchQuery.length >= 2 && !isLoading ? (
            <Box padding="m" alignItems="center">
              <Text variant="body1" color="secondaryText">
                No users found
              </Text>
            </Box>
          ) : null
        )}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  loader: {
    marginTop: 20,
  },
}); 