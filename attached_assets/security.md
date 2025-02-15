# Security Implementation

## Encryption Layers
| Layer | Tech | Purpose |
|-------|------|---------|
| Network | TLS 1.3 | Transit security |
| Storage | SQLCipher | At-rest encryption |
| Messaging | Olm/Megolm | E2EE |

## Compliance Measures
- GDPR right-to-erasure
- COPPA age gates
- Accessibility (WCAG 2.1 AA)

## Moderation Stack
1. **Automated**
   - TensorFlow NSFW detection
   - Perspective API toxicity
2. **Human**
   - Report triage system
   - Verified user flags 