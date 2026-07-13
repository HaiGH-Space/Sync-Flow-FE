<div align="center">

# Sync Flow

_Sync anything, anywhere, with anyone._

[![Build Status](https://img.shields.io/github/actions/workflow/status/HaiGH-Space/Sync-Flow/react-doctor.yml?branch=master&style=flat-square&label=React%20Doctor)](https://github.com/HaiGH-Space/Sync-Flow/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square)](https://tailwindcss.com)

Sync Flow is a premium, real-time collaboration workspace designed for issue tracking, agile sprint planning, and team communication. Built using Next.js 16 (App Router), React 19, and Tailwind CSS v4.

</div>

---

## Features

- **Agile Kanban Board & Planning Views**: Drag-and-drop board layouts, interactive sprint backlogs, issue status columns, and timeline rails for progress visualization.
- **Bi-directional Real-time Collaboration**: Instant chat messaging channels and live workspace notification alerts powered by Socket.IO.
- **Multi-locale Gated Routing**: Inherent native localization support for English (`en`) and Vietnamese (`vi`) using `next-intl`.
- **Hybrid Security Model**: Protected routes gated via a hybrid JWT/Redis cookie authentication framework.
- **Sleek Workspace Navigation**: Expandable sidebars, active workspace rails, collapsible sublists, and zinc-scale responsive panels.

## Technology Stack

- **Framework**: Next.js `16.2.9` (App Router)
- **UI Library**: React `19.2.3`
- **State Management**: React Query `^5.90.20` (Server state) & Zustand `^5.0.11` (Persisted UI state)
- **Styling**: Tailwind CSS `v4` & Framer Motion `^12.40.0`
- **Form Handling**: `@tanstack/react-form` + `zod`
- **Real-time Networking**: `socket.io-client` `^4.8.1`
- **Internationalization**: `next-intl` `^4.8.2`
- **Test Runner**: Vitest `^4.1.9`

> [!NOTE]
> This repository contains the **Frontend** codebase. The corresponding **Backend** service code is situated in the adjacent `be/` workspace.

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (tested on v24.12.0)
- **pnpm** package manager
- A running Sync Flow backend instance (defaults to `http://localhost:8000`)

### Installation & Run

1. Clone the repository and navigate to the frontend directory:

   ```bash
   cd sync-flow/fe
   ```

2. Install the project dependencies:

   ```bash
   pnpm install
   ```

3. Configure your local environment variables:

   ```bash
   cp .env.example .env
   ```

4. Run the development server locally:
   ```bash
   pnpm dev
   ```

### Quality Assurance

Ensure type-safety, linting compliance, and component performance before submitting changes:

```bash
pnpm test     # Run Vitest test suite
pnpm lint     # Run ESLint validation
pnpm doctor   # Run React Doctor codebase audit
pnpm build    # Perform a full production Next.js build
```

---

## Directory Structure

```text
app/                      # Next.js App Router route tree & layout providers
components/               # UI components split by feature area
  ├── auth/               # Animated login layout and visual components
  ├── canvas/             # Board (Kanban), Backlog, Planning, and Timeline rails
  ├── dashboard/          # Chat channels, notification lists, and layouts
  │   ├── chat/           # Message lists and composer (includes useComposer hook)
  │   ├── comp/           # Dialogs (includes the modular issue-detail folder)
  │   ├── layout/         # Shell and sidebars (includes navigation-sidebar folder)
  │   └── notifications/  # Notification dropdown menus and settings
  ├── shared/             # Reusable UI widgets and layout animations
  └── ui/                 # Atomic design system tokens and Radix/shadcn primitives
hooks/                    # App-wide hooks and TanStack mutation hooks
i18n/                     # Modular translation bundles (en/vi) and routing configuration
lib/                      # API config/transport, Zustand state stores, and reordering helpers
queries/                  # TanStack Query keys and options factories
types/                    # Global TypeScript interfaces
```

---

## Architecture Flow

```
[Browser Client]
       │
       ▼ (Checks cookies & locale)
  [proxy.ts Middleware]
       │
       ▼ (Bootstraps layout contexts & providers)
  [app/[locale]/layout.tsx]
       │
       ├─► [queries/*] ───────► (React Query data fetching) ─► [lib/api/api-config.ts] ─► [/api-proxy Rewrite] ─► [Backend API]
       ├─► [hooks/mutations] ─► (Optimistic UI patches) ──────► [lib/api/api-config.ts] ─► [/api-proxy Rewrite] ─► [Backend API]
       └─► [lib/api/chat] ────► (Real-time WebSockets) ───────► [lib/api/api-config.ts] ──────────────────────► [Backend WebSockets]
```

- **Authentication**: Handled at the middleware layer (`proxy.ts`), which validates the `session_token` cookie and handles locale redirects.
- **WebSocket Auth**: Connections to `/chat` and `/notifications` are established with credentials using the client's `session_token` cookie.
- **State Flow & Board Ordering**: Midpoint insertion calculations are performed optimistically on the client using helpers in `lib/ordering.ts`. Fast mutations are managed through a "flush-and-sequence" queue hook pattern (`useColumnReorder` and `useIssueMove`) to prevent race conditions.
- **Presenter/Hook Pattern**: Complex features (such as `NavigationSidebar` and `IssueDetailDialog`) isolate UI rendering from state management using custom hooks (`useNavigationSidebar`, `useIssueDetail`).
- **Centralized API Gating**: Target URL resolution is managed dynamically by `lib/api/api-config.ts` (using client-side relative `/api-proxy` paths and direct backend endpoints on the server).

---

## Codebase Documentation

Detailed architecture blueprints, conventions, and integration maps are located under `docs/codebase/`:

- [**STACK.md**](docs/codebase/STACK.md) — Comprehensive dependency lists, tools, and commands.
- [**STRUCTURE.md**](docs/codebase/STRUCTURE.md) — Directory topology, entry points, and boundaries.
- [**ARCHITECTURE.md**](docs/codebase/ARCHITECTURE.md) — Data flow, layers, and re-order behaviors.
- [**CONVENTIONS.md**](docs/codebase/CONVENTIONS.md) — Coding styles, naming rules, and error handling.
- [**INTEGRATIONS.md**](docs/codebase/INTEGRATIONS.md) — Network endpoints, cookies, and reliability layers.
- [**TESTING.md**](docs/codebase/TESTING.md) — Automated testing matrix and mocking policies.
- [**CONCERNS.md**](docs/codebase/CONCERNS.md) — Outstanding technical debt, performance risks, and churn areas.
