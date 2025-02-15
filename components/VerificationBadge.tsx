
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface VerificationBadgeProps {
  style?: ViewStyle;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ style }) => {
  return (
    <Surface style={[styles.badge, style]} elevation={2}>
      <MaterialCommunityIcons name="check-decagram" size={16} color="#2196F3" />
    </Surface>
  );
};

const styles = StyleSheet.create({
  badge: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
});
