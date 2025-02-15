import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../stores/auth-store';

type AppContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; username?: string } | null;
};

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: isLoading } = useAuth();

  return (
    <AppContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user: user ? { id: user.id } : null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext); 