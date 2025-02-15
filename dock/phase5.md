# CampusConnect Phase 5 Implementation Guide

## 1. Reward System Finalization
```bash
npm install react-native-chart-kit @react-native-community/slider \
react-native-purchases stripe-react-native
```

### 1.1 Reward Architecture
**Supabase SQL:**
```sql
-- Connect to Phase 4 engagement data
CREATE TYPE reward_tier AS ENUM ('bronze', 'silver', 'gold');
CREATE TABLE rewards (
    user_id UUID REFERENCES auth.users,
    points INT DEFAULT 0,
    tier reward_tier,
    last_reward_at TIMESTAMPTZ,
    CONSTRAINT valid_tier CHECK (
        (tier = 'bronze' AND points >= 100) OR
        (tier = 'silver' AND points >= 500) OR
        (tier = 'gold' AND points >= 2000)
    )
);

-- Link to Phase 2 verification
ALTER TABLE rewards ADD COLUMN requires_verification BOOLEAN 
GENERATED ALWAYS AS (
    EXISTS (SELECT 1 FROM verification_submissions 
           WHERE user_id = rewards.user_id)
) STORED;
```

### 1.2 Redemption System
**Cursor AI Prompt:**
```plaintext
Create RewardRedemptionFlow that:
1. Uses Phase 4 engagement data
2. Requires Phase 2 verification
3. Integrates Phase 1 auth for security
4. Connects to Phase 3 college context
Save as components/RewardRedemptionFlow.tsx
```

## 2. Super Admin System

### 2.1 Admin Dashboard
**Cursor AI Prompt:**
```plaintext
Create SuperAdminDashboard with:
- Phase 2 verification controls
- Phase 3 content moderation
- Phase 4 chat management
- Phase 5 reward oversight
Use React Admin framework with Phase 1 navigation
Save as screens/admin/SuperAdminDashboard.tsx
```

### 2.2 Global Moderation
**Supabase Edge Function:**
```typescript
// Combine moderation from all phases
const fullModeration = async (userId) => {
  await supabase.rpc('phase2_ban_user', { user_id: userId });
  await supabase.rpc('phase3_remove_content', { author_id: userId });
  await supabase.rpc('phase4_disable_chat', { user_id: userId });
  await supabase.rpc('phase5_reset_rewards', { user_id: userId });
};
```

## 3. Deployment Preparation

### 3.1 App Store Compliance
**Cursor AI Prompt:**
```plaintext
Create compliance checklist that verifies:
- Phase 1 data collection disclosures
- Phase 2 document storage policies
- Phase 3 user-generated content rules
- Phase 4 chat encryption standards
Output as docs/compliance-report.md
```

### 3.2 Monitoring Setup
```bash
npm install sentry-expo react-native-performance
```

**Cursor AI Prompt:**
```plaintext
Create GlobalMonitorService tracking:
- Phase 1 auth latency
- Phase 2 file processing times
- Phase 3 feed performance
- Phase 4 message delivery
- Phase 5 reward calculations
Save as services/MonitoringService.ts
```

## 4. Cross-Phase Optimization

### 4.1 Unified Search
**Cursor AI Prompt:**
```plaintext
Create GlobalSearch that indexes:
- Phase 3 colleges/posts
- Phase 4 chat history
- Phase 5 reward tiers
- Phase 2 verification status
Use Algolia with Supabase sync
Save as components/GlobalSearch.tsx
```

### 4.2 Performance Audit
**Cursor AI Prompt:**
```plaintext
Create cross-phase audit script checking:
- Phase 1 -> Phase 2 data encryption
- Phase 3 -> Phase 4 college references
- Phase 5 -> Phase 2 verification links
Save as scripts/phase-relations-audit.ts
```

## 5. Final Testing & Launch

### 5.1 Full Regression Suite
**Cursor AI Prompt:**
```plaintext
Generate test cases covering:
1. Phase 1 reg -> Phase 2 verify -> Phase 3 post
2. Phase 4 chat -> Phase 5 reward -> Phase 1 logout
3. Phase 5 admin -> Phase 2 revoke -> Phase 3/4 cleanup
Save as e2e/fullRegression.spec.js
```

### 5.2 Launch Checklist
```plaintext
- [ ] Phase 1-5 integration tests passed
- [ ] App Store metadata updated
- [ ] Supabase production optimized
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
```

## Phase 5 Completion Requirements

- [ ] Reward tier system operational
- [ ] Super admin controls implemented
- [ ] Cross-phase monitoring active
- [ ] Compliance documentation complete
- [ ] Final performance optimization

```plaintext
Validation Command Sequence:
npm run test:full-regression
npx supabase functions serve --env-file .env.prod
npm run build:production
```

## Cross-Phase Dependencies Map

1. **Reward Verification**
```plaintext
Prompt: Connect Phase 5 rewards to 
Phase 2 verification via Phase 3 college status
```

2. **Admin Action Logging**
```plaintext
Prompt: Create unified audit trail combining 
Phase 2/3/4/5 admin actions with Phase 1 auth
```

3. **User Deletion Flow**
```plaintext
Prompt: Implement GDPR delete that cleans 
data across all phases' storage systems
```

## Troubleshooting Complex Flows

1. **Reward Calculation Issues**
```plaintext
"Debug missing Phase 4 chat points in 
Phase 5 reward totals"
```

2. **Cross-Phase Search Failures**
```plaintext
"Fix Phase 3 college results missing from 
Phase 5 global search"
```

3. **Compliance Violations**
```plaintext
"Identify Phase 2 document retention 
conflicts with Phase 5 privacy policies"
```

## Finalization Strategy

1. **API Freeze**
```plaintext
Prompt: Generate OpenAPI spec covering 
all phases' endpoints
```

2. **Documentation Generation**
```plaintext
Prompt: Create unified documentation with 
typedoc + Phase 1-5 examples
```

3. **Long-term Support**
```plaintext
Prompt: Implement feature flags for 
phase-specific functionality
```

## Post-Launch Monitoring

1. **Real-time Dashboard**
```plaintext
Prompt: Create Grafana dashboard showing:
- Phase 1 auth attempts
- Phase 2 verifications
- Phase 3 posts/hour
- Phase 4 messages
- Phase 5 rewards
```

2. **Alert Configuration**
```plaintext
Prompt: Set up Sentry alerts for:
- Phase 1 auth failures
- Phase 2 document scan errors 
- Phase 3 content reports
- Phase 4 chat disruptions
- Phase 5 reward abuse
```

3. **Performance Baseline**
```plaintext
Prompt: Establish performance benchmarks 
across all phases for future comparison
```
