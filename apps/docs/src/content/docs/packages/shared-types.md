---
title: Shared Types Package
description: Common TypeScript types for the Comments platform.
---

The `@repo/shared-types` package provides common TypeScript types and interfaces used across the Comments platform, ensuring type safety and consistency between backend and frontend.

- **Location:** `/packages/shared-types`
- **Tech Stack:** TypeScript
- **Consumers:** Used by [API](/apps/api), [Web App](/apps/web), [Infrastructure](/apps/infrastructure)

---

## Contents

- `src/index.ts`: Exports all shared types
- Types for articles, comments, users, API payloads, and more

---

## Usage Example

```ts
import { Comment, Article } from '@repo/shared-types'
```

---

## Further Reading

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
