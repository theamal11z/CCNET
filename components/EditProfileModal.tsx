import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Button, Modal, Portal, TextInput, Avatar, ActivityIndicator, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../lib/supabase';
import { Profile } from '../services/ProfileService';
import { useAuth } from '../stores/auth-store';
import { launchImageLibrary } from 'react-native-image-picker';

interface EditProfileModalProps {
  visible: boolean;
  profile: Profile | null;
  onDismiss: () => void;
  onSave: (updates: Partial<Profile>) => Promise<void>;
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Required')
    .min(3, 'Too short! (3-20 characters)')
    .max(20, 'Too long! (3-20 characters)')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
  display_name: Yup.string()
    .max(30, 'Too long! (Max 30 characters)'),
  bio: Yup.string()
    .max(150, 'Bio too long! (Max 150 characters)'),
  grade: Yup.string()
    .oneOf(['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'alumni'], 'Invalid grade'),
});

export default function EditProfileModal({ visible, profile, onDismiss, onSave }: EditProfileModalProps) {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });
      
      if (result.assets?.[0]?.uri) {
        setUploading(true);
        const file = result.assets[0];
        
        const fileExt = file.uri.split('.').pop();
        const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: fileName,
        } as any);

        const { error } = await supabase.storage
          .from('public-avatars')
          .upload(filePath, formData);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('public-avatars')
          .getPublicUrl(filePath);

        setAvatarUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!user || username === profile?.username) {
      setUsernameAvailable(true);
      return;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    setUsernameAvailable(!data);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Formik
            initialValues={{
              username: profile?.username || '',
              display_name: profile?.display_name || '',
              bio: profile?.bio || '',
              grade: profile?.grade || 'freshman',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await onSave({
                ...values,
                avatar_url: avatarUrl
              });
              onDismiss();
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <Text variant="titleLarge" style={styles.title}>Edit Profile</Text>

                {/* Profile Picture Section */}
                <View style={styles.avatarContainer}>
                  <Avatar.Image 
                    size={100}
                    source={{ uri: avatarUrl || 'https://place-holder.com/100' }}
                  />
                  <Button
                    mode="outlined"
                    style={styles.avatarButton}
                    onPress={handleImageUpload}
                    loading={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </View>

                {/* Username Field */}
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Username"
                    value={values.username}
                    onChangeText={async (text) => {
                      handleChange('username')(text);
                      await checkUsernameAvailability(text);
                    }}
                    onBlur={handleBlur('username')}
                    error={!!errors.username || !usernameAvailable}
                    mode="outlined"
                    left={<TextInput.Icon icon="account" />}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.error}>{errors.username}</Text>
                  )}
                  {!usernameAvailable && (
                    <Text style={styles.error}>Username is already taken</Text>
                  )}
                </View>

                {/* Display Name Field */}
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Display Name"
                    value={values.display_name}
                    onChangeText={handleChange('display_name')}
                    onBlur={handleBlur('display_name')}
                    error={!!errors.display_name}
                    mode="outlined"
                    left={<TextInput.Icon icon="card-account-details" />}
                  />
                  {touched.display_name && errors.display_name && (
                    <Text style={styles.error}>{errors.display_name}</Text>
                  )}
                </View>

                {/* Bio Field */}
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Bio"
                    value={values.bio}
                    onChangeText={handleChange('bio')}
                    onBlur={handleBlur('bio')}
                    error={!!errors.bio}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    left={<TextInput.Icon icon="pencil" />}
                  />
                  {touched.bio && errors.bio && (
                    <Text style={styles.error}>{errors.bio}</Text>
                  )}
                </View>

                {/* Grade Selection */}
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Grade"
                    value={values.grade}
                    onChangeText={handleChange('grade')}
                    onBlur={handleBlur('grade')}
                    error={!!errors.grade}
                    mode="outlined"
                    left={<TextInput.Icon icon="school" />}
                    right={<TextInput.Icon icon="menu-down" />}
                    editable={false}
                    onPressIn={() => {
                      // Implement grade picker modal here
                    }}
                  />
                  {touched.grade && errors.grade && (
                    <Text style={styles.error}>{errors.grade}</Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={onDismiss}
                    style={styles.button}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    loading={isSubmitting}
                    disabled={isSubmitting || !usernameAvailable}
                  >
                    Save Changes
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  container: {
    flexGrow: 1,
  },
  form: {
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatarButton: {
    borderRadius: 24,
  },
  inputContainer: {
    gap: 4,
  },
  error: {
    color: '#dc3545',
    fontSize: 12,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
}); 