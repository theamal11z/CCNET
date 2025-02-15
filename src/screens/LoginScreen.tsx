import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../stores/auth-store';

export const LoginScreen = () => {
  const { signIn, loading } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to CampusConnect
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => signIn('google')}
          loading={loading}
          style={styles.button}
          icon="google"
        >
          Continue with Google
        </Button>

        <Button
          mode="contained"
          onPress={() => signIn('facebook')}
          loading={loading}
          style={styles.button}
          icon="facebook"
        >
          Continue with Facebook
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 8,
  },
}); 