import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function QuickActionBar() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Button
        icon="pencil"
        mode="contained-tonal"
        onPress={() => {}}
        style={styles.button}
      >
        Post
      </Button>
      <Button
        icon="help-circle"
        mode="contained-tonal"
        onPress={() => {}}
        style={styles.button}
      >
        Query
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
}); 