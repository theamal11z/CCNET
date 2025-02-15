import React from 'react';
import { ThemeProvider as RestyleProvider } from '@shopify/restyle';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './index';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return <RestyleProvider theme={theme}>{children}</RestyleProvider>;
} 