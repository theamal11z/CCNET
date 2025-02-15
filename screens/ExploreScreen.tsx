import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { SearchService } from '../services/SearchService';
import UserListItem from '../components/UserListItem';
import CollegeCard from '../components/CollegeCard';
import { Box } from '../components/themed/Box';
import { Text } from '../components/themed/Text';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: colleges, isLoading: loadingColleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => SearchService.getColleges(),
    enabled: !searchQuery,
  });

  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      // First try to find colleges
      const collegeResults = await SearchService.searchColleges(searchQuery);
      if (collegeResults.length > 0) return { type: 'colleges', data: collegeResults };
      
      // If no colleges found, search for users
      const userResults = await SearchService.searchUsers(searchQuery);
      return { type: 'users', data: userResults };
    },
    enabled: searchQuery.length >= 2,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderItem = ({ item }) => {
    if (searchResults?.type === 'users') {
      return <UserListItem user={item} />;
    }
    return <CollegeCard college={item} />;
  };

  const data = searchQuery ? searchResults?.data : colleges;
  const isLoading = searchQuery ? loadingSearch : loadingColleges;

  return (
    <Box flex={1} backgroundColor="background">
      <Searchbar
        placeholder="Search colleges or users..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {isLoading && (
        <ActivityIndicator style={styles.loader} />
      )}

      {!searchQuery && (
        <Box padding="m">
          <Text variant="headline3" color="foreground">
            Popular Colleges
          </Text>
        </Box>
      )}

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          searchQuery.length >= 2 && !isLoading ? (
            <Box padding="m" alignItems="center">
              <Text variant="body1" color="secondaryText">
                No results found
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
  list: {
    padding: 16,
  },
}); 