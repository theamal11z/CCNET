
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, TextInput, Text, Surface } from 'react-native-paper';
import { useAuth } from '../stores/auth-store';
import { Box } from '../components/themed/Box';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  return (
    <Box flex={1} backgroundColor="background" padding="xl">
      <Surface style={styles.container} elevation={2}>
        <Image 
          source={require('../assets/icon.png')} 
          style={styles.logo}
        />
        
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back!
        </Text>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={() => login(email, password)}
          loading={loading}
          style={styles.button}
        >
          Sign In
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={styles.link}
        >
          Don't have an account? Sign Up
        </Button>
      </Surface>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    marginBottom: 32,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 8,
    paddingVertical: 6,
  },
  link: {
    marginTop: 16,
  },
});
