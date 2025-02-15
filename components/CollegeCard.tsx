import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Box } from './themed/Box';
import { College } from '../services/SearchService';

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const navigation = useNavigation();

  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: college.image_url }} />
      <Card.Content>
        <Box marginVertical="s">
          <Text variant="titleLarge">{college.name}</Text>
          <Text variant="bodyMedium" style={styles.location}>
            {college.location}
          </Text>
        </Box>
        
        <Box flexDirection="row" flexWrap="wrap">
          {college.programs.slice(0, 3).map((program, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={styles.chipText}
            >
              {program}
            </Chip>
          ))}
          {college.programs.length > 3 && (
            <Chip>+{college.programs.length - 3} more</Chip>
          )}
        </Box>

        <Box flexDirection="row" marginTop="m">
          <Box flex={1}>
            <Text variant="labelSmall">Student Count</Text>
            <Text variant="bodyLarge">{college.student_count}</Text>
          </Box>
          <Box flex={1}>
            <Text variant="labelSmall">Acceptance Rate</Text>
            <Text variant="bodyLarge">{college.acceptance_rate}%</Text>
          </Box>
        </Box>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  location: {
    color: '#666',
    marginTop: 4,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
}); 