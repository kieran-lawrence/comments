# Comments Platform Monorepo

The Comments Platform is a scalable, full-stack solution for managing user-generated comments across any web application. It includes an IaC based backend built using AWS SDK via Pulumi, a robust API, a modern moderation dashboard, and shared libraries for UI and types, all organized in a monorepo for streamlined development and deployment.

## Overview

The repository is structured as a monorepo using [Turborepo](https://turborepo.org/), containing multiple apps and packages that together provide:

- A scalable comments API
- A modern web moderation dashboard
- Shared UI and type libraries
- Infrastructure-as-code for cloud deployment
- A documentation website outlining the platform capabilities and usages

## Apps and Packages

### Apps

- **api**: REST API built using Express for comments, articles, users, and moderation. Uses Prisma ORM and supports status changes, threading, and moderation actions. Deployed as a Docker container.
- **web**: React + Vite app for moderators and staff to review, approve, reject, and manage comments. Integrates with Auth0 for authentication and uses the API for all data.
- **WIP: docs**: Astro app using Starlight for documentation, guides, and onboarding for the platform.
- **infrastructure**: Pulumi-based infrastructure-as-code for deploying the API and related resources to AWS.

### Packages

- **@repo/ui**: Shared React component library (buttons, modals, comment cards, etc.) used by both `web` and `docs` apps.
- **@repo/shared-types**: TypeScript types and schemas shared across all apps (API, web, docs).
- **@repo/eslint-config**: Centralized ESLint configuration for consistent code quality across the monorepo.
- **@repo/typescript-config**: Shared `tsconfig` base for all TypeScript projects.
- **@repo/tailwind-config**: Shared Tailwind CSS and PostCSS configuration for consistent styling.

## Development

This mono repo uses yarn workspaces

### Build all apps and packages

- Running `yarn build` will build all required apps using turbo

### Local Dev

- **Comments Dashboard:** `yarn start:web`
- **API:** `yarn start:api` - you need to run `yarn build` before you can run this
- **Docs:** `yarn start:docs`

## Key Features

- **Type-safe, scalable API** with Prisma and Zod validation
- **Modern React UI** for moderation and management
- **Reusable UI components** and shared types
- **Infrastructure-as-code** for AWS deployment
- **Monorepo tooling** with Turborepo for fast, consistent builds

## Getting Started

TODO: Add doc site URL

- Check out the docs at [http://localhost:4321](http://localhost:4321) for a detailed breakdown of each app/package and how it's used
- See the individual app and package `README.md` files for more details on setup, configuration, and deployment.

---

For more information, see:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Astro Documentation](https://docs.astro.build/)
