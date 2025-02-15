# CampusConnect Next Action Plan

## Current Phase: 1.5 (Core Infrastructure ➔ Identity Transition)

### 🚀 Immediate Next Steps

**1. Complete Authentication Integration** *(Phase 1 - Critical Path)*
```plaintext
[ ] Implement social login callbacks
[ ] Connect Supabase auth to Zustand store
[ ] Add session persistence
Prompt: "Create unified auth service handling social logins, session management, and error recovery"
Relevant: services/AuthService.ts (needs creation)
```

**2. Profile System Completion** *(Phase 2 - High Priority)*
```plaintext
[ ] Finish EditProfileScreen (40% remaining)
[ ] Connect profile data to Supabase
[ ] Implement username validation
Prompt: "Build real-time username availability check with debounced Supabase query"
Relevant: screens/EditProfileScreen.tsx, services/ProfileService.ts
```

**3. College Verification MVP** *(Phase 2 - Blocked Feature)*
```plaintext
[ ] Add image upload to CollegeVerificationScreen
[ ] Implement file validation (≤5MB, JPG/PDF)
[ ] Create verification API endpoint
Prompt: "Develop file upload component with progress indicator and error states"
Relevant: screens/CollegeVerificationScreen.tsx, services/VerificationService.ts
```

### 🛠 Code Quality Priorities

**1. Type Safety Improvements**
```plaintext
[ ] Add strict null checks in ProfileScreen
[ ] Type API responses with Zod
[ ] Create shared types for post/user entities
Relevant: components/PostCard.tsx, screens/ProfileScreen.tsx
```

**2. Performance Fixes**
```plaintext
[ ] Implement FlatList virtualization
[ ] Add image caching with react-native-fast-image
[ ] Optimize post render cycles
Prompt: "Create memoized PostCard component with optimized image loading"
Relevant: components/PostCard.tsx, UserPostsList.tsx
```

### 🔄 Phase Progression Checklist

**Phase 1 Completion Requirements**
```plaintext
✅ Expo project setup
✅ Basic Supabase config
⬜ Full auth implementation (85%)
⬜ Zustand store integration (50%)
```

**Phase 2 Readiness**
```plaintext
⬜ Profile system API endpoints
⬜ Secure storage configuration
⬜ Verification service skeleton
```

### ⚡ Critical Path Focus
1. **Auth → Profile → Verification Chain**
```plaintext
User auth → Profile completion → Verification → Forum access
```
2. **Post List Optimization**
```plaintext
FlatList → Memoization → Caching → Load testing
```

### 🧪 Testing Strategy
```plaintext
[ ] Jest setup for core components
[ ] Mock Supabase endpoints
[ ] Add snapshot testing for ProfileScreen
Prompt: "Create test harness for authenticated user flows"
Relevant: components/__tests__/PostCard.test.tsx (new)
```

## 📌 Pending Dependencies
1. Supabase storage configuration for file uploads
2. College database schema finalization
3. Moderation service design (Phase 5 prep) 