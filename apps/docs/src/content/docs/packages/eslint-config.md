---
title: ESLint Config Package
description: Shared ESLint configuration for the Comments platform.
---

# ESLint Config Package

The `eslint-config` package provides a shared ESLint configuration for linting JavaScript and TypeScript code across all projects in the Comments platform.

## Overview

- **Location:** `/packages/eslint-config`
- **Tech Stack:** ESLint
- **Consumers:** Used by [Web App](/apps/web), [UI Package](/packages/ui)

---

## Contents

- `library.js`
- `react-internal.js`
- `next.js`

---

## Usage Example

```js
// .eslintrc.js
module.exports = {
    extends: ['@repo/eslint-config/library'],
}
```

---

## Further Reading

- [ESLint Documentation](https://eslint.org/docs/)
