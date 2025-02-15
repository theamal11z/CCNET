import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { VerificationService } from '../services/VerificationService';
import { useAuth } from '../stores/auth-store';

export function VerificationScreen() {
  const [uploading, setUploading] = useState(false);
  const [document, setDocument] = useState<string | null>(null);
  const { user } = useAuth();

  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDocument(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!document || !user) return;

    setUploading(true);
    try {
      await VerificationService.uploadDocument(
        user.id,
        'student_id',
        document
      );
      // Navigate to success screen
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Verify Your Student Status</Text>
      
      {document && (
        <Image source={{ uri: document }} style={styles.preview} />
      )}

      <Button
        mode="contained"
        onPress={pickDocument}
        style={styles.button}
        disabled={uploading}
      >
        Select Student ID
      </Button>
      {document && (
        <Button
          mode="contained"
          onPress={handleUpload}
          style={styles.button}
          loading={uploading}
          disabled={uploading}
        >
          Upload for Verification
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  preview: {
    width: 300,
    height: 225,
    marginVertical: 20,
    borderRadius: 10,
  },
  button: {
    marginVertical: 10,
    width: '100%',
  }
});