# CampusConnect Phase 3 Implementation Guide

## 1. Forum System Foundation
```bash
npm install react-native-reanimated react-native-gesture-handler \
@react-navigation/material-top-tabs react-native-fast-image
```

### 1.1 Post Architecture
**Supabase SQL:**
```sql
-- Connect to Phase 2 verification system
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    content TEXT,
    author_id UUID REFERENCES profiles(user_id),
    college_id UUID REFERENCES colleges(id) NULL,
    is_verified_post BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ
);

-- Add security policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verified college posts" ON posts 
  FOR INSERT WITH CHECK (
    (college_id IS NOT NULL AND is_verified_post) 
    AND verify_user_college(author_id, college_id)
  );
```

### 1.2 Feed Implementation
**Cursor AI Prompt:**
```plaintext
Create a ForumFeed component that:
1. Combines general and college-specific posts from verified users
2. Uses infinite scroll with React Query
3. Implements swipe gestures for quick actions
4. Integrates Phase 2's pseudonymous avatars
5. Enforces post type restrictions based on verification status
Save as components/ForumFeed.tsx
```

## 2. College Database System

### 2.1 Data Modeling
**Supabase SQL:**
```sql
CREATE TABLE colleges (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    location GEOGRAPHY(POINT),
    acceptance_rate NUMERIC,
    programs TEXT[],
    student_count INT
);

CREATE TABLE college_reviews (
    id UUID PRIMARY KEY,
    college_id UUID REFERENCES colleges(id),
    author_id UUID REFERENCES profiles(user_id),
    content TEXT,
    rating NUMERIC(2,1),
    created_at TIMESTAMPTZ,
    CONSTRAINT verified_author CHECK (
        EXISTS (
            SELECT 1 FROM verification_submissions 
            WHERE user_id = author_id 
            AND status = 'approved'
        )
    )
);
```

### 2.2 Search Implementation
**Cursor AI Prompt:**
```plaintext
Create a CollegeSearch component with:
- Geolocation-based sorting
- Program filter chips
- Fuzzy search using Fuse.js
- Paginated results from Supabase
- Integration with Phase 1's navigation
Save as components/CollegeSearch.tsx
```

## 3. Interaction System

### 3.1 State Management
**Cursor AI Prompt:**
```plaintext
Create a post interaction store (Zustand) that:
1. Tracks likes/comments/shares
2. Syncs with Supabase in background
3. Caches interactions locally
4. Integrates with Phase 2's encryption for sensitive actions
Save as stores/post-interactions-store.ts
```

### 3.2 Real-time Updates
**Supabase Trigger:**
```sql
-- Connect to Phase 1's auth system
CREATE TRIGGER post_notifications
AFTER INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION notify_new_post();
```

**Cursor AI Prompt:**
```plaintext
Create a Supabase Edge Function that:
- Pushes new post notifications to relevant users
- Filters college-specific posts to verified members
- Uses Phase 2's encryption for sensitive content
Save as supabase/functions/post-notifications/index.ts
```

## 4. Performance Optimization

### 4.1 Image Handling
**Cursor AI Prompt:**
```plaintext
Create an optimized ImageLoader component that:
1. Uses react-native-fast-image
2. Supports progressive JPEG loading
3. Caches images based on college ID
4. Falls back to Phase 2's avatar generator
Save as components/ImageLoader.tsx
```

### 4.2 Data Pagination
**Cursor AI Prompt:**
```plaintext
Implement cursor-based pagination for posts that:
1. Uses Supabase range queries
2. Integrates with React Query's infinite query
3. Respects user's current college filters
4. Reuses Phase 1's network error handling
Save as hooks/usePaginatedPosts.ts
```

## 5. Testing & Integration

### 5.1 Cross-Phase Tests
**Cursor AI Prompt:**
```plaintext
Create end-to-end tests that:
1. Submit verified college post using Phase 2 credentials
2. Search for college from Phase 3 database
3. Verify post appears in correct feeds
Use Detox testing framework
Save as e2e/collegeFlow.spec.js
```

### 5.2 Performance Audit
```bash
npm install -D react-native-performance
```

**Cursor AI Prompt:**
```plaintext
Create performance monitor that tracks:
- Feed scroll FPS
- College search response time
- Image load metrics
Output to performance.log with severity levels
```

## Phase 3 Completion Checklist

- [ ] Core forum feed with mixed content
- [ ] College search and detail pages
- [ ] Verified post creation flow
- [ ] Real-time interaction system
- [ ] Cross-phase integration tests
- [ ] Performance optimization passes

```plaintext
Test Command Sequence:
npm run test:forum
npx detox test -c ios.sim.release
npm run performance-audit
```

## Inter-Phase Dependencies

1. **Authentication Gate**
```plaintext
Prompt: Modify Phase 1's auth flow to redirect to 
Phase 3's main feed after login
```

2. **Verified Post Badges**
```plaintext
Prompt: Integrate Phase 2's verification status 
with Phase 3's post author displays
```

3. **College Context**
```plaintext
Prompt: Create React context that combines:
- Phase 2's user college verification
- Phase 3's current college filters
Save as context/CollegeContext.tsx
```

## Troubleshooting Guide

1. **Data Sync Issues**
```plaintext
"Debug missing verified posts between Phase 2 and 3 systems"
```

2. **Performance Problems** 
```plaintext
"Fix janky feed scroll when loading Phase 3 posts 
with Phase 2 avatars"
```

3. **Security Conflicts**
```plaintext
"Resolve college post visibility for users with 
multiple Phase 2 verifications"
```

## Upgrade Path from Previous Phases

1. **Schema Migrations**
```plaintext
Prompt: Generate migration script that connects 
Phase 2's verification_submissions to Phase 3's 
college_reviews table
```

2. **Data Backfilling**
```plaintext
Prompt: Create script to generate initial college 
data using Phase 1's user location analytics
```

3. **Feature Flags**
```plaintext
Prompt: Implement LaunchDarkly integration to 
gradually roll out Phase 3 features
```
