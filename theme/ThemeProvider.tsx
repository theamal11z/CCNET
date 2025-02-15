
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A90E2',
    secondary: '#67B26F',
    accent: '#4A90E2',
    background: '#F5F6F8',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    placeholder: '#9CA3AF',
    border: '#E5E7EB',
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={DefaultTheme}>
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
}
