import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Box } from './themed/Box';
import { Profile } from '../services/ProfileService';

interface UserListItemProps {
  user: Profile;
  onPress?: () => void;
}

export default function UserListItem({ user, onPress }: UserListItemProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Profile', { userId: user.id });
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Box 
        flexDirection="row" 
        padding="m" 
        backgroundColor="surface"
        alignItems="center"
      >
        <Avatar.Icon
          size={40}
          icon="account"
          style={styles.avatar}
        />
        <Box marginLeft="m" flex={1}>
          <Text variant="bodyLarge" style={styles.username}>
            {user.username}
            {user.is_verified && ' ✓'}
          </Text>
          {user.display_name && (
            <Text variant="bodyMedium" style={styles.displayName}>
              {user.display_name}
            </Text>
          )}
        </Box>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#bdbdbd',
  },
  username: {
    fontWeight: 'bold',
  },
  displayName: {
    color: '#666',
  },
}); 