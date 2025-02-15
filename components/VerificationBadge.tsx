
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface Props {
  size?: number;
  style?: any;
}

export function VerificationBadge({ size = 16, style }: Props) {
  const theme = useTheme();
  
  return (
    <View style={[styles.badge, style]}>
      <MaterialIcons 
        name="verified" 
        size={size} 
        color={theme.colors.primary} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 4,
  }
});
