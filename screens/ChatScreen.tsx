import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import { Box } from '../components/themed/Box';
import { MessageService } from '../services/MessageService';

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const route = useRoute();
  const recipientId = route.params?.userId;

  useEffect(() => {
    MessageService.initialize().then(() => {
      loadMessages();
    });

    const cleanup = MessageService.subscribeToMessages(recipientId, (newMessage) => {
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
    });

    return () => cleanup();
  }, []);

  const loadMessages = async () => {
    const chatMessages = await MessageService.getMessages(recipientId);
    setMessages(chatMessages.map((msg) => ({
      _id: msg.id,
      text: msg.content,
      createdAt: new Date(msg.timestamp),
      user: {
        _id: msg.sender,
      },
    })));
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const [message] = newMessages;
    await MessageService.sendMessage(recipientId, message.text);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, [recipientId]);

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