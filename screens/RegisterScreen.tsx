import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Snackbar, Text } from 'react-native-paper';
import { useAuth } from '../stores/auth-store';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error, loading } = useAuth();
  const [visible, setVisible] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      await register(email, password);
      // If email confirmation is required
      setRegistered(true);
    } catch (error) {
      setVisible(true);
    }
  };

  if (registered) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Check Your Email
        </Text>
        <Text style={styles.message}>
          We've sent you an email to verify your account. Please check your inbox and follow the instructions.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
        >
          Go to Login
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
      >
        Create Account
      </Button>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {error || 'Registration failed'}
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
  message: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
}); 