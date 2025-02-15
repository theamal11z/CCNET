import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { FeedType } from '../services/FeedService';
import { Box } from './themed/Box';

interface FeedFiltersProps {
  selectedType: FeedType;
  onTypeChange: (type: FeedType) => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export default function FeedFilters({
  selectedType,
  onTypeChange,
  timeRange,
  onTimeRangeChange,
}: FeedFiltersProps) {
  const theme = useTheme();

  return (
    <Box>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.container}
      >
        <Chip
          selected={selectedType === 'all'}
          onPress={() => onTypeChange('all')}
          style={styles.chip}
          mode="outlined"
          showSelectedOverlay
        >
          All Posts
        </Chip>
        <Chip
          selected={selectedType === 'following'}
          onPress={() => onTypeChange('following')}
          style={styles.chip}
          mode="outlined"
          showSelectedOverlay
          icon="account-group"
        >
          Following
        </Chip>
        <Chip
          selected={selectedType === 'trending'}
          onPress={() => onTypeChange('trending')}
          style={styles.chip}
          mode="outlined"
          showSelectedOverlay
          icon="trending-up"
        >
          Trending
        </Chip>
        <Chip
          selected={selectedType === 'college'}
          onPress={() => onTypeChange('college')}
          style={styles.chip}
          mode="outlined"
          showSelectedOverlay
          icon="school"
        >
          My College
        </Chip>
      </ScrollView>

      {selectedType === 'trending' && onTimeRangeChange && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={[styles.container, styles.timeFilters]}
        >
          <Chip
            selected={timeRange === 'today'}
            onPress={() => onTimeRangeChange('today')}
            style={styles.timeChip}
            mode="outlined"
            showSelectedOverlay
          >
            Today
          </Chip>
          <Chip
            selected={timeRange === 'week'}
            onPress={() => onTimeRangeChange('week')}
            style={styles.timeChip}
            mode="outlined"
            showSelectedOverlay
          >
            This Week
          </Chip>
          <Chip
            selected={timeRange === 'month'}
            onPress={() => onTimeRangeChange('month')}
            style={styles.timeChip}
            mode="outlined"
            showSelectedOverlay
          >
            This Month
          </Chip>
        </ScrollView>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  timeFilters: {
    paddingTop: 0,
  },
  timeChip: {
    marginRight: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
}); 