# CampusConnect Development Guide

Welcome to the CampusConnect development guide! This document will help you navigate through the app's creation process using the provided modular files. Each section includes prompts and commands to guide you through specific tasks.

## 1. Initial Setup
Start by setting up your development environment and initializing the project.

### Commands:
```bash
# Create a new Expo project
npx create-expo-app campus-connect
cd campus-connect

# Install necessary libraries
npm install @react-navigation/native react-native-screens react-native-safe-area-context
```

### Related Files:
- [Technical Stack](core.md#technical-stack)
- [Phase 1: Foundation Setup](phase1.md)

## 2. Authentication System
Implement the authentication flow using the components and guidelines provided.

### Prompt:
```prompt
How do I set up the authentication flow using the components from screens.md?
```

### Commands:
```bash
# Install additional libraries for authentication
npm install @react-navigation/native-stack
```

### Related Files:
- [Authentication Flow](screens.md#authentication-flow)
- [Security Measures](security.md#encryption-layers)

## 3. College Verification
Integrate college verification features, including document scanning and liveness checks.

### Prompt:
```prompt
What steps are needed to implement college verification from phase2.md?
```

### Commands:
```bash
# Install document scanning SDK
npm install react-native-document-scanner-plugin
```

### Related Files:
- [Verification Workflow](phase2.md#verification-workflow)

## 4. Forum & Database
Develop the real-time forum and integrate the college database.

### Prompt:
```prompt
How do I implement the real-time forum and database features from phase3.md?
```

### Commands:
```bash
# Install forum dependencies
npm install @react-native-firebase/firestore react-native-markdown-display
```

### Related Files:
- [Academic Forum Implementation](phase3.md#academic-forum-implementation)

## 5. Secure Messaging
Set up secure messaging with end-to-end encryption.

### Prompt:
```prompt
What libraries and protocols should I use for secure messaging as described in phase4.md?
```

### Commands:
```bash
# Install encryption libraries
npm install @matrix-org/olm react-native-sensitive-info
```

### Related Files:
- [Secure Messaging Architecture](phase4.md#messaging-architecture)

## 6. Testing & Launch
Prepare for testing and launch, ensuring all systems are secure and compliant.

### Prompt:
```prompt
What are the key testing and launch steps outlined in phase5.md and phase6.md?
```

### Commands:
```bash
# Run security audit
npx @owasp/zap-cli quick-scan -t http://localhost:3000
```

### Related Files:
- [Moderation & Testing](phase5.md)
- [Launch & Iteration](phase6.md)

## 7. Monitoring & Iteration
Post-launch, monitor app performance and iterate based on user feedback.

### Prompt:
```prompt
How do I track success metrics and iterate on the app post-launch?
```

### Commands:
```bash
# Monitor performance
npx react-native-performance-logger analyze
```

### Related Files:
- [Success Metrics](success-metrics.md)

## FAQ & Troubleshooting
**Q: How do I handle college data updates?**  
➔ See [College Database](phase3.md#college-database) scraping workflow

**Q: Message encryption failing?**  
➔ Verify Olm lib initialization in [phase4.md](phase4.md#technical-components)

**Q: Slow feed performance?**  
➔ Implement virtualization from [screens.md](screens.md#component-matrix)

## Development Cheat Sheet
| Task                | Command                          | Reference File         |
|---------------------|----------------------------------|------------------------|
| New Screen          | `npx generate-react-native-screen` | [screens.md](screens.md) |
| API Endpoint        | `supabase functions new`         | [core.md](core.md)     |
| Security Audit      | `npx audit-ci`                   | [security.md](security.md) |
| Performance Test    | `expo run:android --profile`     | [phase1.md](phase1.md) |

This guide should help you connect each file's content and provide a clear path for developing the CampusConnect app. If you have any questions or need further assistance, feel free to ask! 