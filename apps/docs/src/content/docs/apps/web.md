---
title: Comments Dashboard
description: Reference documentation for the Web frontend in `/apps/web`
---

The Web project contains the Comments moderation dashboard which is built with React, Vite, and TypeScript. It provides the means for staff to interact with articles, comments, users, and statistics. It connects to the [Comments API](/apps/api)

- **Location:** `/apps/web`
- **Tech Stack:** React, Vite, TypeScript, Tailwind CSS

---

## Routes & Structure

- `src/routes/`: Route modules for pages (e.g., articles, comments, auth).
- `src/services/`: API client logic for communicating with the Comments API.
- `src/utils/`: Shared frontend utilities.
- `src/index.tsx`: App entry point.
- `vite.config.ts`: Vite configuration.

### Route Overview

All routes prefixed with `/auth` require the user to be logged in, or they will be redirected to the login screen, as defined in `routes/_auth.tsx`

- `/auth/` — Landing page & dashboard showing relavent statistics for the moderators
- `/auth/articles` — List and search articles
- `/auth/moderate` — Main area for reviewing and moderation of comments in real time
- `/auth/users` — View and manage users
- `/auth/settings` — Not yet implemented: Will provide the ability to customise settings and preferences for each app
- `/auth/history` — Overview of changes to comment statuses

---

## Further Reading

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
