# Authentication Flow Implementation

## 1. Set up Authentication Screens Structure
First, create the necessary screen components in your project:

```typescript:src/screens/auth/LoginScreen.tsx
import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { useForm } from 'react-hook-form';

export const LoginScreen = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Will implement authentication logic here
    console.log(data);
  };

  return (
    <View>
      <TextInput 
        placeholder="Email"
        // Use React Native Paper components as specified in screens.md
      />
      <TextInput 
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
```

```typescript:src/screens/auth/VerificationScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export const VerificationScreen = () => {
  return (
    <View>
      <Text>Verification Screen</Text>
      {/* Camera component for live verification */}
    </View>
  );
};
```

## 2. Set up Navigation Flow
Create the authentication navigator as specified in screens.md:

```typescript:src/navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { VerificationScreen } from '../screens/auth/VerificationScreen';

const AuthStack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Verification" 
        component={VerificationScreen}
        options={{ title: 'Verify Identity' }}
      />
    </AuthStack.Navigator>
  );
}
```

## 3. Install Required Dependencies
```bash
# Install form handling and validation
npm install react-hook-form zod @hookform/resolvers/zod

# Install UI components
npm install react-native-paper

# Install camera for verification
npm install react-native-vision-camera
```

## 4. Set up Authentication Context
```typescript:src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    // Implement login logic here
    // This will connect with your security.md specifications
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 5. Implement Form Validation
```typescript:src/validation/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

## 6. Update App Entry Point
```typescript:App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { AuthNavigator } from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
```

## Next Steps:
1. Implement the login logic in AuthContext using security.md specifications
2. Add error handling and loading states
3. Connect verification flow with the college database
4. Add biometric authentication if specified in security.md

Would you like me to elaborate on any of these steps or show you how to implement a specific part?