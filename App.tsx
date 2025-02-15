
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
        <ThemeProvider>
          <PaperProvider>
            <RootNavigator />
          </PaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
