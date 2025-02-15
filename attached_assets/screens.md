# Screen Architecture

## Authentication Flow
| Screen | Tech Stack | State Management |
|--------|------------|-------------------|
| Login | React Native Paper | Formik |
| Register | Zod Validation | React Hook Form |
| Verification | Camera Kit | Reanimated |

## Core Application
```mermaid
graph LR
    A[Home] --> B[Posts]
    A --> C[Search]
    A --> D[Messages]
    B --> E[Create]
    C --> F[College Profile]
```

## Component Matrix
| Component | Tech | Purpose |
|-----------|------|---------|
| Post Card | FlashList | Virtualized feed |
| Map View | MapLibre | College locations |
| Editor | ProseMirror | Rich text input |
``` 