# CampusConnect Phase 1 Implementation Guide

## 1. Project Initialization
Run these commands in order:

```bash
# Create new Expo project
npx create-expo-app CampusConnect -t expo-template-blank-typescript
cd CampusConnect

# Install core dependencies
npm install @supabase/supabase-js @react-native-async-storage/async-storage \
react-native-paper react-query zustand @tanstack/react-query

# Initialize Git repository
git init
git add .
git commit -m "Initial commit: Base project setup"
```

## 2. Supabase Configuration
**Cursor AI Prompt:**
```plaintext
Create a Supabase client configuration file that:
1. Uses environment variables for URL and key
2. Exports auth and storage instances
3. Handles initialization errors
Save as lib/supabase.ts
```

**Follow-up:**
```plaintext
Generate a .env file template with Supabase credentials and add 
react-native-dotenv to babel.config.js
```

## 3. Authentication System Implementation

### 3.1 Social Login Setup
**Supabase Console Tasks:**
1. Enable Google/Facebook auth providers
2. Configure redirect URL: `my.app://redirect`

**Cursor AI Prompt:**
```plaintext
Create a login screen with:
- 
- Email/password form
- Error handling for auth failures
Use React Native Paper components and store session in Zustand
```

### 3.2 Username Reservation System
**Cursor AI Prompt:**
```plaintext
Create a username validation service that:
1. 
2. Enforces 3-20 character limit
3. Allows only letters, numbers, and underscores
4. Stores reserved usernames in 'profiles' table
Implement using Supabase RPC functions
```

**Table Schema Prompt:**
```plaintext
Generate SQL for 'profiles' table:
- user_id UUID references auth.users
- username VARCHAR(20) UNIQUE
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ
Add indexes for username search
```

## 4. Core Component Structure
Create directory structure:
```bash
mkdir -p app/{components,screens,services,stores,assets,navigation}
```

**Cursor AI Prompt:**
```plaintext
Create a root NavigationContainer with:
- Auth stack (Login, Register)
- Main stack (Home, Profile)
- Loading screen while checking auth state
Use React Navigation 6.x and TypeScript
```

## 5. State Management Setup
**Cursor AI Prompt:**
```plaintext
Create a Zustand store that:
1. Manages auth state (user, session, loading)
2. Handles session persistence via AsyncStorage
3. Exports useAuth hook with typed methods
Save as stores/auth-store.ts
```

## 6. Development Workflow
Add these scripts to package.json:
```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write .",
  "types": "tsc --noEmit"
}
```

**Cursor AI Prompt:**
```plaintext
Configure ESLint and Prettier for React Native TypeScript 
with following rules:
- Airbnb base
- React Hooks
- Import ordering
- TypeScript strict
```

## 7. Testing Setup
```bash
npm install -D jest @testing-library/react-native
```

**Cursor AI Prompt:**
```plaintext
Create basic smoke tests for:
- App component rendering
- Auth store initialization
- Navigation container existence
Save as __tests__/App.test.tsx
```

## Phase 1 Completion Checklist

- [ ] Project initialized with TypeScript
- [ ] Supabase client configured
- [ ] Auth store with session persistence
- [ ] Social login UI implemented
- [ ] Username validation service
- [ ] Basic navigation structure
- [ ] Linting/formatting setup
- [ ] CI pipeline foundation

```plaintext
Test Command Sequence:
npm run lint
npm run types
npm test
npx expo start --ios
```

**Troubleshooting Prompt:**
```plaintext
Help debug [ERROR] when Google OAuth redirects to undefined 
in Expo development build
```
