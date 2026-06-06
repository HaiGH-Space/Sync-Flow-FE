# Sync Flow

> Sync anything, anywhere, with anyone.

Sync Flow is a Next.js 16 application for workspace collaboration, issue tracking, planning views, and realtime chat. The app uses locale-aware routing, React Query for server state, Zustand for client UI state, and Socket.IO for chat updates.

## What It Includes

- Dashboard flows for workspaces, projects, issues, sprints, backlog, planning, board, and timeline views
- Locale support for `en` and `vi` through `next-intl`
- API access through the `/api-proxy` rewrite path
- Realtime chat backed by Socket.IO
- Shared UI primitives and feature-oriented component folders

## Stack

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript
- pnpm
- TanStack Query, TanStack Form, TanStack Table
- Zustand
- `@dnd-kit/react`
- `socket.io-client`
- `zod`
- `sonner`
- Tailwind CSS v4

For a fuller breakdown of the repository, see [docs/codebase/STACK.md](docs/codebase/STACK.md) and [docs/codebase/ARCHITECTURE.md](docs/codebase/ARCHITECTURE.md).

## Project Structure

- [app/](app) - App Router pages, layouts, and locale routing
- [components/](components) - Shared UI and feature components
- [hooks/](hooks) - Client hooks and mutation wrappers
- [i18n/](i18n) - Routing and translation bundles
- [lib/](lib) - API clients, helpers, and client state
- [queries/](queries) - React Query option factories
- [types/](types) - Shared type definitions

## Getting Started

### Prerequisites

- Node.js [TODO]
- pnpm
- A backend that matches the API contract used by `lib/api/*`

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Quality Checks

```bash
pnpm lint
pnpm build
```

## Configuration

The app reads `NEXT_PUBLIC_API_URL` for backend access when available. If the variable is not set, the Next.js rewrite and API helpers fall back to local development defaults.

Other important runtime inputs:

- `session_token` cookie for protected routes and chat auth
- `VERCEL_URL` when deployed on Vercel

See [docs/codebase/INTEGRATIONS.md](docs/codebase/INTEGRATIONS.md) for the integration details and [docs/codebase/CONCERNS.md](docs/codebase/CONCERNS.md) for current risks.

## How The App Is Wired

1. `proxy.ts` gates protected routes and redirects unauthenticated users to `/auth`.
2. `app/[locale]/layout.tsx` validates locale and installs theme, motion, query, and i18n providers.
3. Route pages compose dashboard shells and feature views.
4. `queries/*` define cache keys and query options.
5. `hooks/mutations/*` perform writes and invalidate the relevant query keys.
6. `lib/api/*` wraps network access and raises `ApiRequestError` on failures.

## Notes

> [!IMPORTANT]
> This repository does not currently include a test runner or a documented `.env.example` file. Those gaps are tracked in [docs/codebase/TESTING.md](docs/codebase/TESTING.md) and [docs/codebase/CONCERNS.md](docs/codebase/CONCERNS.md).

> [!TIP]
> If you are working on board ordering, chat, or cache invalidation, read [docs/codebase/ARCHITECTURE.md](docs/codebase/ARCHITECTURE.md) first. Those flows are the most coupled parts of the app.

## Documentation

- [docs/codebase/STACK.md](docs/codebase/STACK.md)
- [docs/codebase/STRUCTURE.md](docs/codebase/STRUCTURE.md)
- [docs/codebase/ARCHITECTURE.md](docs/codebase/ARCHITECTURE.md)
- [docs/codebase/CONVENTIONS.md](docs/codebase/CONVENTIONS.md)
- [docs/codebase/INTEGRATIONS.md](docs/codebase/INTEGRATIONS.md)
- [docs/codebase/TESTING.md](docs/codebase/TESTING.md)
- [docs/codebase/CONCERNS.md](docs/codebase/CONCERNS.md)
