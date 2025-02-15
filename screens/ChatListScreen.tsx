
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Box } from '../components/themed/Box';
import ChatRoomList from '../components/ChatRoomList';
import { ChatService } from '../services/ChatService';

export default function ChatListScreen() {
  const [rooms, setRooms] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRooms = async () => {
      const chatRooms = await ChatService.getChatRooms();
      setRooms(chatRooms);
    };
    loadRooms();
  }, []);

  const handleRoomPress = (roomId: string, roomName: string) => {
    navigation.navigate('ChatRoom', { roomId, roomName });
  };

  return (
    <Box style={styles.container}>
      <ChatRoomList rooms={rooms} onRoomPress={handleRoomPress} />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
