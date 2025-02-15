
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { MessageService } from '../services/MessageService';
import { useRoute } from '@react-navigation/native';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const route = useRoute();
  const recipientId = route.params?.userId;

  useEffect(() => {
    MessageService.initialize().then(() => {
      loadMessages();
    });
  }, []);

  const loadMessages = async () => {
    const chatMessages = await MessageService.getMessages(recipientId);
    setMessages(chatMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await MessageService.sendMessage(recipientId, newMessage);
    setNewMessage('');
    await loadMessages();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, 
      item.sender === recipientId ? styles.received : styles.sent]}>
      <Text>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={styles.input}
        />
        <Button onPress={sendMessage} mode="contained">
          Send
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
});
