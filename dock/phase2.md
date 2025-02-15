# CampusConnect Phase 2 Implementation Guide

## 1. Secure Identity Storage Setup
```bash
npm install react-native-sensitive-info @types/react-native-sensitive-info
```

**Cursor AI Prompt:**
```plaintext
Create an encryption service that:
1. Uses React Native's crypto library
2. Generates unique encryption keys per user
3. Provides methods for:
   - Encrypting/decoding sensitive data
   - Secure key storage using react-native-sensitive-info
Save as services/encryption-service.ts
```

## 2. Pseudonymous Profile System

### 2.1 Profile Store
**Cursor AI Prompt:**
```plaintext
Create a Zustand store for profile management that:
- Separates public (username, avatar) and private (real name, email) data
- Automatically encrypts private data before storage
- Integrates with Supabase profiles table
Save as stores/profile-store.ts
```

### 2.2 Profile UI Components
```bash
npm install react-native-avatar-generator
```

**Cursor AI Prompt:**
```plaintext
Create a ProfileHeader component with:
- Avatar generator based on username hash
- Display name with verification badge placeholder
- Stats preview (posts, followers)
- Edit profile button (hidden for pseudonymous users)
Use React Native Paper's Card and Avatar components
```

## 3. College Verification System

### 3.1 Document Upload Component
```bash
npm install react-native-document-picker react-native-image-crop-picker
```

**Cursor AI Prompt:**
```plaintext
Create a DocumentUpload component that:
1. Accepts PDF, JPG, PNG up to 5MB
2. Shows upload progress
3. Auto-crops ID documents to 3:2 aspect ratio
4. Stores temp files in app cache
Implement error handling for invalid file types
```

### 3.2 Live Photo Capture
**Cursor AI Prompt:**
```plaintext
Create a LivePhotoScreen with:
- Camera preview using expo-camera
- Face detection overlay
- Capture button with countdown
- Immediate upload to Supabase Storage
Save as screens/verification/LivePhotoScreen.tsx
```

### 3.3 Verification Backend Setup
**Supabase SQL Prompt:**
```plaintext
Create verification_submissions table with:
- user_id UUID (references auth.users)
- id_front_url TEXT
- id_back_url TEXT
- live_photo_url TEXT
- status VARCHAR(20) (pending/rejected/approved)
- reviewed_by UUID (nullable)
- submitted_at TIMESTAMPTZ
Create RPC function check_verification_status(uid UUID)
```

**Cursor AI Prompt:**
```plaintext
Create a verification service that:
1. Handles file uploads to Supabase Storage
2. Creates verification submission records
3. Triggers admin notifications via Supabase Edge Functions
Save as services/verification-service.ts
```

## 4. Admin Notifications
**Cursor AI Prompt:**
```plaintext
Create a Supabase Edge Function that:
- Listens for new verification submissions
- Sends email to admin group
- Creates notification in admin dashboard
Save as supabase/functions/notify-verification/index.ts
```

## 5. Testing & Validation

### 5.1 Test Cases
**Cursor AI Prompt:**
```plaintext
Generate Jest tests for:
1. Profile data encryption/decryption cycle
2. Document upload failure scenarios
3. Verification submission flow
Save as __tests__/verification.test.ts
```

### 5.2 Security Audit
```bash
npm install -D react-native-security-checklist
```

**Cursor AI Prompt:**
```plaintext
Create security audit script that checks:
- Secure Storage implementation
- Encryption key handling
- File upload TLS enforcement
Output results to security-audit.log
```

## Phase 2 Completion Checklist

- [ ] User profile encryption implemented
- [ ] Public profile UI components
- [ ] Document upload with validation
- [ ] Live photo capture flow
- [ ] Verification backend services
- [ ] Admin notification system
- [ ] Security audit passed

```plaintext
Test Command Sequence:
npm run test:verification
npx supabase functions serve --env-file ./supabase/.env
npm run security-audit
```

**Troubleshooting Prompts:**
```plaintext
1. "Fix 'Network request failed' on large file uploads"
2. "Resolve camera permissions crash on Android emulator"
3. "Debug encryption key mismatch after app restart"
```

## Implementation Strategy

1. **Progressive Verification**
   - Start with mock document upload
   - Gradually add real file processing
   ```plaintext
   Prompt: Create a mock verification service that simulates approval for testing
   ```

2. **Privacy Validation**
   - Ensure no PII leaks in network requests
   ```plaintext
   Prompt: Add network interceptor to redact sensitive fields
   ```

3. **Performance Optimization**
   - Implement background upload queue
   ```plaintext
   Prompt: Create a file upload queue with retry logic
   ```
