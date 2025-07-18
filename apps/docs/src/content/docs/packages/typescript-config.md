---
title: TypeScript Config Package
description: Shared TypeScript configuration for the Comments platform.
---

The `@repo/typescript-config` package provides a shared base TypeScript config for type checking across all projects in the monorepo.

- **Location:** `/packages/typescript-config`
- **Tech Stack:** TypeScript
- **Consumers:** Used by [Web App](/apps/web), [UI Package](/packages/ui), [API](/apps/api), [Infrastructure](/apps/infrastructure)

---

## Contents

- `base.json`: Baseline TypeScript config
- `react-library.json`: React TSconfig presets
- `nextjs.json`: NextJS TSconfig presets

---

## Usage Example

```json
// tsconfig.json
{
    "extends": "@repo/typescript-config/base.json"
}
```

---

## Further Reading

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
