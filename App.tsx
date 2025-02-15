
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './theme/ThemeProvider';
import RootNavigator from './navigation/RootNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MonitoringService } from './services/MonitoringService';

const queryClient = new QueryClient();

MonitoringService.initialize();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <ThemeProvider>
            <PaperProvider>
              <RootNavigator />
            </PaperProvider>
          </ThemeProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
