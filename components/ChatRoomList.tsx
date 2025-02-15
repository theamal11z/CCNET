
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { Box } from './themed/Box';
import VerificationBadge from './VerificationBadge';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isVerified: boolean;
}

interface ChatRoomListProps {
  rooms: ChatRoom[];
  onRoomPress: (roomId: string) => void;
}

export default function ChatRoomList({ rooms, onRoomPress }: ChatRoomListProps) {
  const renderItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity onPress={() => onRoomPress(item.id)}>
      <Box style={styles.roomItem} flexDirection="row" padding="m">
        <Avatar.Image source={{ uri: item.avatar }} size={50} />
        <Box flex={1} marginLeft="m">
          <Box flexDirection="row" alignItems="center">
            <Text variant="titleMedium">{item.name}</Text>
            {item.isVerified && <VerificationBadge style={styles.badge} />}
          </Box>
          <Text variant="bodyMedium" numberOfLines={1}>{item.lastMessage}</Text>
        </Box>
        <Text variant="bodySmall" style={styles.timestamp}>{item.timestamp}</Text>
      </Box>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={rooms}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  roomItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  badge: {
    marginLeft: 4,
  },
  timestamp: {
    color: '#666',
  },
});
