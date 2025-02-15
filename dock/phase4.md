# CampusConnect Phase 4 Implementation Guide

## 1. Real-time Chat System
```bash
npm install react-native-gifted-chat socket.io-client \
@react-native-community/netinfo react-native-flipper
```

### 1.1 Core Chat Architecture
**Supabase SQL:**
```sql
-- Connect to Phase 2 verification
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    content TEXT,
    sender_id UUID REFERENCES profiles(user_id),
    room_id UUID REFERENCES chat_rooms(id),
    is_verified_chat BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ,
    CONSTRAINT verified_room CHECK (
        NOT is_verified_chat OR EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = room_id 
            AND requires_verification = true
            AND verify_user_access(sender_id, room_id)
        )
    )
);

-- Reuse Phase 3's RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### 1.2 College-Specific Chat
**Cursor AI Prompt:**
```plaintext
Create VerifiedChatGate component that:
1. Checks Phase 2 verification status
2. Connects to Phase 3's college context
3. Enables college-specific chat rooms
4. Uses Phase 1's navigation for access denied
Save as components/VerifiedChatGate.tsx
```

## 2. Incentive System

### 2.1 Engagement Tracking
**Supabase Edge Function:**
```typescript
// Reuse Phase 3's post interactions
const calculateEngagement = (userId) => {
  return supabase.rpc('get_engagement_metrics', {
    user_id: userId,
    start_date: '30 days ago'
  });
};

// Connect to Phase 1's auth store
supabase.auth.onAuthStateChange((event, session) => {
  if(event === 'SIGNED_IN') {
    startMetricsCollection(session.user.id);
  }
});
```

### 2.2 Reward Distribution
**Cursor AI Prompt:**
```plaintext
Create RewardService that:
1. Tracks Phase 3 post interactions
2. Awards points using Phase 2's encryption
3. Syncs with Supabase credit system
4. Sends notifications via Phase 1's messaging
Save as services/RewardService.ts
```

## 3. Admin & Moderation

### 3.1 Moderation Dashboard
**Cursor AI Prompt:**
```plaintext
Create AdminDashboard that combines:
- Phase 2 verification queue
- Phase 3 reported content
- Phase 4 chat logs
- User analytics from Phase 1
Use React Native WebView with AdminJS
Save as screens/AdminDashboard.tsx
```

### 3.2 Audit System
**Supabase SQL:**
```sql
-- Extend Phase 2's audit logs
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY,
    admin_id UUID REFERENCES auth.users,
    action_type VARCHAR(50),
    target_id UUID,
    prev_state JSONB,
    new_state JSONB,
    created_at TIMESTAMPTZ
);

-- Reuse Phase 3's RPC functions
CREATE TRIGGER log_admin_actions
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_admin_action();
```

## 4. Cross-Phase Features

### 4.1 Unified Notifications
**Cursor AI Prompt:**
```plaintext
Create NotificationCenter that aggregates:
- Phase 1 friend requests
- Phase 2 verification status
- Phase 3 post interactions
- Phase 4 chat messages
Save as components/NotificationCenter.tsx
```

### 4.2 Performance Optimization
**Cursor AI Prompt:**
```plaintext
Create GlobalPerformanceMonitor that tracks:
- Phase 1 auth latency
- Phase 2 file upload times 
- Phase 3 feed render speed
- Phase 4 message delivery
Save as services/PerformanceService.ts
```

## 5. Testing & Deployment

### 5.1 End-to-End Flow
**Cursor AI Prompt:**
```plaintext
Create test script that:
1. Registers user (Phase 1)
2. Completes verification (Phase 2)
3. Posts college review (Phase 3)
4. Earns rewards (Phase 4)
5. Appears on leaderboard
Save as e2e/fullUserJourney.spec.js
```

### 5.2 Security Audit
```bash
npm run audit:full -- --phases=1-4
```

**Cursor AI Prompt:**
```plaintext
Create comprehensive security report covering:
- Phase 1 auth flows
- Phase 2 encryption
- Phase 3 content policies
- Phase 4 chat security
Output to security-audit-v2.log
```

## Phase 4 Completion Checklist

- [ ] Real-time chat implementation
- [ ] College-specific chat rooms
- [ ] Engagement tracking system
- [ ] Reward distribution mechanism
- [ ] Unified admin dashboard
- [ ] Cross-phase audit trails

```plaintext
Test Command Sequence:
npm run test:chat
npx supabase functions serve --env-file ./supabase/.env
npm run audit:full
```

## Cross-Phase Dependencies

1. **Verified Chat Access**
```plaintext
Prompt: Connect Phase 4 chat rooms to Phase 2's 
verification status via Phase 3's college context
```

2. **Reward Notifications**
```plaintext
Prompt: Modify Phase 1's notification system to 
handle Phase 4 reward achievements using 
Phase 3's interaction data
```

3. **Moderation Workflow**
```plaintext
Prompt: Create unified moderation action that 
updates Phase 2 verification status, Phase 3 posts,
and Phase 4 chat access simultaneously
```

## Troubleshooting Guide

1. **Message Sync Issues**
```plaintext
"Debug real-time chat messages not appearing 
across Phase 4 rooms and Phase 3 notifications"
```

2. **Reward Calculation Errors**
```plaintext
"Fix incorrect point calculations using 
Phase 3 engagement data in Phase 4"
```

3. **Performance Degradation**
```plaintext
"Resolve memory leaks when switching between 
Phase 3 feed and Phase 4 chat"
```

## Migration Strategy

1. **Data Relationships**
```plaintext
Prompt: Generate migration script connecting 
Phase 3 posts to Phase 4 chat rooms via 
college IDs
```

2. **Backward Compatibility**
```plaintext
Prompt: Create compatibility layer for old 
Phase 2 verification data in Phase 4 systems
```

3. **Feature Sunsetting**
```plaintext
Prompt: Implement deprecation warnings for 
Phase 1 features being replaced by Phase 4
```

## Finalization Steps

1. **Documentation Update**
```plaintext
Prompt: Generate API documentation covering 
all phases using TypeDoc
```

2. **App Store Prep**
```plaintext
Prompt: Create build script that bundles 
all phase assets and optimizes images
```

3. **Monitoring Setup**
```plaintext
Prompt: Implement Sentry monitoring covering 
all phase-specific error codes
```
