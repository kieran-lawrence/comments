---
title: Comments API
description: This document refers to the Comments API located in `/apps/api`
---

The Comments API is a RESTful service built with Express and Prisma, providing endpoints for managing articles, comments, users, moderation actions, and statistics. It is secured with API key authentication and supports CORS for local development.

- **Location:** `/apps/api`
- **Tech Stack:** Express, Prisma, Zod, TypeScript
- **Authentication:** API Key via `x-api-key` header
- **CORS:** Enabled for `http://localhost:5173` (TODO: Insert actual endpoints)

---

## Middleware

- **JSON Body Parser:** Parses incoming JSON requests.
- **CORS:** Allows requests from local dev origins.
- **API Key Auth:** Requires `x-api-key` matching `process.env.API_KEY`. Returns `401` if missing or invalid.

---

## Internal Packages

- [Shared Types](/packages/shared-types): Common types for API and frontend
- [TypeScript Config](/packages/typescript-config): Shared TypeScript configuration

---

## Endpoints

### `/comments`

- `GET /comments`  
  List all comments, optionally filtered by article, status, or user.

- `POST /comments`  
  Create a new comment. Requires comment body, article ID, and user info.

- `PATCH /comments/:id`  
  Update a comment's content or status.

---

### `/users`

- `GET /users`  
  List all users.

- `GET /users/:id`  
  Get details for a specific user.

---

### `/articles`

- `GET /articles`  
  List articles. Supports query params:

    - `searchTerm`: Filter by article title or author.
    - `status`: Filter by commenting status (`OPEN`, `CLOSED`).
    - `page`: Pagination.

- `PATCH /articles/:id`  
  Update article status (e.g., open/close commenting).

---

### `/status-changes`

- `GET /status-changes`  
  List all status change events for articles or comments.

---

### `/statistics`

- `GET /statistics`  
  Get platform statistics (e.g., comment counts, user activity).

---

## Error Handling

- Returns `401` for missing/invalid API key.
- Returns `400` for validation errors (Zod).
- Returns `500` for server errors.

---

## Example Request

```http
GET /articles?searchTerm=example&status=OPEN&page=1 HTTP/1.1
Host: localhost:80
x-api-key: YOUR_API_KEY
```

---

## Further Reading

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com/)
- [Zod Documentation](https://zod.dev/)
