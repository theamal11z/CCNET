import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import { useAuth } from '../stores/auth-store';
import { updateUsername } from '../services/profile-service';

export default function SetupProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await updateUsername(user.id, username);
      navigation.replace('Home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Choose Your Username
      </Text>
      
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        autoCapitalize="none"
        maxLength={20}
        style={styles.input}
      />

      <Text variant="bodySmall" style={styles.hint}>
        Username must be between 3-20 characters and can only contain letters, numbers, and underscores.
      </Text>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !username}
        style={styles.button}
      >
        Continue
      </Button>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  hint: {
    color: '#666',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
}); 