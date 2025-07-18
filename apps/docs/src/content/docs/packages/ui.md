---
title: UI Package
description: Shared React UI components for the Comments platform.
---

The `@repo/ui` package is a component library of React components for use across the Comments platform.

- **Location:** `/packages/ui`
- **Tech Stack:** React, TypeScript, Tailwind CSS
- **Consumers:** Used by [Comments Dashboard](/apps/web)

---

## Folder Layout

- `components/`: Location of all UI components
- `components/public`: UI components that are exported and available for use outside the package
- `components/radix`: Base components provided by [@radix-ui](https://www.radix-ui.com/primitives/docs/overview/introduction)
- `icons/`: SVG icon components
- `lib/`: Shared UI utilities

---

## Usage Example

```tsx
import { Button, Modal } from '@repo/ui';

<Button onClick={...}>Click me</Button>
```

---

## Further Reading

- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/primitives/docs)
