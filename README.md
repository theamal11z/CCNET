
# CampusConnect

A React Native application for connecting college students and building academic communities.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account and project

## Environment Setup

1. Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Initialize Supabase database by running the migrations:
```bash
cd supabase/migrations
# Run migrations in order:
# 001_initial_schema.sql
# 002_forum_schema.sql
# 003_moderation_schema.sql
```

## Project Structure

- `/assets` - Images and static assets
- `/components` - Reusable React components
- `/screens` - Application screens
- `/services` - Business logic and API services
- `/navigation` - Navigation configuration
- `/stores` - State management (Zustand)
- `/theme` - Theme configuration
- `/types` - TypeScript type definitions

## Running the App

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Choose your platform:
- Press `w` for web
- Press `a` for Android
- Press `i` for iOS

## Features

- Authentication system
- College verification
- Real-time messaging
- Forum discussions
- Profile management
- Content moderation
- Analytics tracking

## Tech Stack

- React Native
- Expo
- TypeScript
- Supabase
- React Navigation
- React Native Paper
- Socket.io Client
- Zustand

## Development Guidelines

1. Follow TypeScript best practices
2. Use the provided theme system for consistent styling
3. Implement error handling for all API calls
4. Write tests for critical services
5. Follow the modular architecture pattern

## Security Considerations

- All sensitive data is stored in Supabase
- User verification flow is secure
- Real-time communication is encrypted
- Content moderation is in place
- Profile data is pseudonymized

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run types` - Type check with TypeScript

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT License
