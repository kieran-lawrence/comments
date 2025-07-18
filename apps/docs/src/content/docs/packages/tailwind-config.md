---
title: Tailwind Config Package
description: Shared Tailwind configuration for the Comments platform.
---

The `@repo/tailwind-config` package provides shared Tailwind CSS styling that can be used across all frontend projects.

- **Location:** `/packages/tailwind-config`
- **Tech Stack:** Tailwind CSS
- **Consumers:** Used by [Web App](/apps/web), [UI Package](/packages/ui)

---

## Contents

- `tailwind.config.ts`: Tailwind CSS config
- `postcss.config.js`: PostCSS config
- `shared-styles.css`: Shared CSS utilities

---

## Usage Example

```js
// tailwind.config.ts
module.exports = require('@comments/tailwind-config/tailwind.config')
```

---

## Further Reading

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostCSS Documentation](https://postcss.org/)
