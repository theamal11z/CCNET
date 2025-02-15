
import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Box } from '../components/themed/Box';
import CollegeCard from '../components/CollegeCard';
import { CollegeService, CollegeSearchParams } from '../services/CollegeService';
import { useQuery } from '@tanstack/react-query';

export default function CollegeSearchScreen() {
  const [searchParams, setSearchParams] = useState<CollegeSearchParams>({});

  const { data: colleges, isLoading } = useQuery({
    queryKey: ['colleges', searchParams],
    queryFn: () => CollegeService.searchColleges(searchParams),
  });

  return (
    <Box flex={1} backgroundColor="background">
      <Searchbar
        placeholder="Search colleges..."
        onChangeText={(query) => setSearchParams({ ...searchParams, query })}
        value={searchParams.query}
        style={styles.searchBar}
      />
      <FlatList
        data={colleges}
        renderItem={({ item }) => <CollegeCard college={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  list: {
    padding: 16,
  },
});
