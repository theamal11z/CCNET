import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VerificationBadgeProps {
  size?: number;
  style?: object;
}

export default function VerificationBadge({ size = 16, style }: VerificationBadgeProps) {
  return (
    <Badge
      size={size}
      style={[styles.badge, style]}
    >
      <Icon name="check-decagram" size={size * 0.8} color="#fff" />
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 