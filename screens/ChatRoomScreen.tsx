
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { Box } from '../components/themed/Box';
import { ChatService } from '../services/ChatService';

export default function ChatRoomScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const route = useRoute();
  const { roomId } = route.params;

  useEffect(() => {
    const loadMessages = async () => {
      const chatMessages = await ChatService.getChannelMessages(roomId);
      setMessages(chatMessages.map((msg) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.sender_id,
          name: msg.sender?.username,
          avatar: msg.sender?.avatar_url,
        },
      })));
    };

    loadMessages();
    const subscription = ChatService.subscribeToChannel(roomId, (newMessage) => {
      setMessages((prevMessages) => 
        GiftedChat.append(prevMessages, [{
          _id: newMessage.id,
          text: newMessage.content,
          createdAt: new Date(newMessage.created_at),
          user: {
            _id: newMessage.sender_id,
          },
        }])
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const [message] = newMessages;
    await ChatService.sendMessage(roomId, message.text);
  }, [roomId]);

  return (
    <Box style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderAvatar={null}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
