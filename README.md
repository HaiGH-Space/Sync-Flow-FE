<div align="center">

# Sync Flow

_Sync anything, anywhere, with anyone._

[![Test Suite](https://img.shields.io/github/actions/workflow/status/HaiGH-Space/Sync-Flow/test.yml?branch=master&style=flat-square&label=Tests)](https://github.com/HaiGH-Space/Sync-Flow/actions)
[![Security Audit](https://img.shields.io/github/actions/workflow/status/HaiGH-Space/Sync-Flow/security.yml?branch=master&style=flat-square&label=Security%20Audit)](https://github.com/HaiGH-Space/Sync-Flow/actions)
[![React Doctor](https://img.shields.io/github/actions/workflow/status/HaiGH-Space/Sync-Flow/react-doctor.yml?branch=master&style=flat-square&label=React%20Doctor)](https://github.com/HaiGH-Space/Sync-Flow/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square)](https://react.dev)
[![React Compiler](https://img.shields.io/badge/React%20Compiler-Enabled-blueviolet?style=flat-square)](https://react.dev/learn/react-compiler)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square)](https://tailwindcss.com)

Sync Flow is a high-performance, real-time collaboration workspace built for agile project planning, issue tracking, instant team messaging, and live video/audio conferencing.

</div>

---

## Features

- **Agile Board & Planning Canvas**: Interactive drag-and-drop Kanban board with midpoint ordering math, sprint backlogs with server-side pagination, planning views, and timeline progress rails.
- **Real-Time Communication**: Instant channel chat and workspace notification alerts powered by Socket.IO WebSockets.
- **Live Video & Audio Calling**: WebRTC channel calls powered by LiveKit Cloud integration, featuring persistent global call state, floating overlay widgets, participant menus, and fullscreen mode.
- **Native Localization**: Built-in multi-locale routing for English (`en`) and Vietnamese (`vi`) powered by `next-intl`.
- **Hybrid Security Model**: Session-token cookie validation, security response headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), and automated Gitleaks secret scanning.
- **Sleek Workspace Navigation**: Expandable sidebars, active workspace rails with infinite loading, and responsive Zinc theme styling.
- **Zero-Manual-Memoization Architecture**: Powered by the React 19 Compiler to automatically optimize component rendering performance without manual `useMemo` or `useCallback` hooks.

---

## Technology Stack

| Layer | Technology / Library | Version | Description |
|---|---|---|---|
| **Framework** | [Next.js](https://nextjs.org) (App Router) | `16.2.9` | React framework with server rendering & App Router |
| **UI Runtime** | [React](https://react.dev) + React Compiler | `19.2.3` | React with native auto-memoization enabled |
| **Server State** | [TanStack React Query](https://tanstack.com/query) | `^5.90.20` | Server state caching, query factories, and invalidations |
| **Client UI State** | [Zustand](https://zustand-demo.pmnd.rs) | `^5.0.11` | Persisted client state for dashboard and video call controls |
| **WebRTC Media** | [LiveKit](https://livekit.io) | `^2.21.0` | Cloud WebRTC video & audio call sessions |
| **Styling & Motion** | [Tailwind CSS](https://tailwindcss.com) & [Framer Motion](https://framer.com/motion) | `^4.0.0` / `^12.40.0` | Modern CSS styling tokens and fluid UI animations |
| **Form Validation** | [@tanstack/react-form](https://tanstack.com/form) & [Zod](https://zod.dev) | `^1.28.0` / `^4.3.6` | Type-safe form state and schema validation |
| **Realtime WebSockets** | [Socket.IO Client](https://socket.io) | `^4.8.1` | Realtime socket connections for chat & notifications |
| **Localization** | [next-intl](https://next-intl-docs.vercel.app) | `^4.8.2` | Locale-aware routing and modular translation bundles |
| **Test Runner** | [Vitest](https://vitest.dev) | `^4.1.9` | Fast unit and integration test runner (22 test suites) |

> [!NOTE]
> This repository contains the **Frontend** application. The corresponding **Backend** service is maintained in the companion `be/` workspace.

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (tested on v24.12.0)
- **pnpm** package manager
- Running Sync Flow backend service instance (defaults to `http://127.0.0.1:8000`)

### Installation & Local Setup

1. **Clone the repository and enter the frontend workspace:**

   ```bash
   cd sync-flow/fe
   ```

2. **Install project dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure local environment variables:**

   ```bash
   cp .env.example .env.local
   ```

4. **Launch the local development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Quality Assurance & Testing

Maintain code quality, linting standards, and compiler optimization rules with standard repository commands:

```bash
pnpm test     # Run Vitest unit & integration test suite (22 test suites, 83 tests)
pnpm lint     # Run ESLint static analysis
pnpm doctor   # Run React Doctor codebase diagnostic audit
pnpm build    # Execute production Next.js compilation
```

> [!TIP]
> **React Compiler & Memoization Policy**: React Compiler automatically analyzes components and memoizes calculations at build time. Manual memoization hooks (`useMemo`, `useCallback`, and `memo()`) are unnecessary and flagged by static analysis (`pnpm doctor`). Keep UI components purely presentational and avoid manual memoization wrappers.

---

## Directory Structure

```text
app/                      # Next.js App Router route tree & layout providers
components/               # UI components categorized by feature domain
  ├── auth/               # Animated auth card layouts and background animations
  ├── call/               # LiveKit video/audio call provider, floating widget, & overlay
  ├── canvas/             # Board (Kanban), Backlog table, Planning, & Timeline rails
  ├── channel/            # Channel header call controls & action buttons
  ├── dashboard/          # Chat channels, notification menus, and shell layouts
  │   ├── chat/           # Message list, composer, and useComposer hook
  │   ├── comp/           # Dialogs (includes modular issue-detail dialog)
  │   └── layout/         # Shell sidebars (includes navigation-sidebar module)
  ├── shared/             # Shared UI widgets and layout animations
  └── ui/                 # Atomic design system tokens and Radix/shadcn primitives
hooks/                    # Custom application hooks and TanStack mutation wrappers
i18n/                     # Modular translation message bundles (en/vi) and routing
lib/                      # API client transport, Zustand stores, and ordering helpers
queries/                  # TanStack Query keys and option factories
types/                    # Application TypeScript interface declarations
docs/codebase/            # Structured repository documentation suite
```

---

## Architecture Overview

```text
HTTP Request / Navigation
       │
       ▼
   [proxy.ts Middleware] ───► (Locale routing, session_token check, security headers)
       │
       ▼
 [app/[locale]/layout.tsx] ──► (ThemeProvider, QueryProvider, next-intl, GlobalCallProvider)
       │
       ├───► [queries/*] ───────► (TanStack Query fetching) ─► [/api-proxy Rewrite] ─► [Backend API]
       ├───► [hooks/mutations] ─► (Optimistic UI mutations) ──► [/api-proxy Rewrite] ─► [Backend API]
       ├───► [lib/api/chat] ────► (Real-time Socket.IO chat) ────────────────────────► [Backend WebSockets]
       ├───► [lib/api/video] ───► (LiveKit WebRTC token & room) ─────────────────────► [LiveKit Cloud]
       └───► [lib/store/*] ─────► (Persisted Zustand state in LocalStorage)
```

- **Authentication & Gated Routes**: Managed via `proxy.ts` middleware, verifying the HttpOnly `session_token` cookie and applying locale redirects.
- **Real-Time WebSockets**: WebSockets for `/chat` and `/notifications` authenticate using the client's `session_token` cookie.
- **Sparse Board Reordering**: Drag-and-drop operations compute midpoint values using `lib/ordering.ts` helpers. Rapid reorders run optimistically through flush-and-sequence queue hooks (`useColumnReorder`, `useIssueMove`).
- **Presenter/Hook Pattern**: Complex components separate UI layout from state logic via dedicated custom hooks (`useNavigationSidebar`, `useIssueDetailState`, `useComposer`).
- **Centralized API Proxying**: API endpoints resolve dynamically in `lib/api/api-config.ts` using client relative `/api-proxy` rewrites to prevent direct backend URL hardcoding, supporting `INTERNAL_API_URL` during SSR.

---

## Codebase Documentation Index

Detailed architectural specs and integration maps are maintained in [`docs/codebase/`](docs/codebase):

- [**STACK.md**](docs/codebase/STACK.md) — Tech stack, framework versions, dev tooling, CI workflows, and scripts.
- [**STRUCTURE.md**](docs/codebase/STRUCTURE.md) — Directory topology, entry points, and module boundaries.
- [**ARCHITECTURE.md**](docs/codebase/ARCHITECTURE.md) — System flow, layers, reordering strategies, and risks.
- [**CONVENTIONS.md**](docs/codebase/CONVENTIONS.md) — Naming rules, error handling, query factories, and Compiler rules.
- [**INTEGRATIONS.md**](docs/codebase/INTEGRATIONS.md) — Backend API rewrites, cookies, WebSockets, and data stores.
- [**TESTING.md**](docs/codebase/TESTING.md) — Vitest test patterns, setup configs, and quality assurance commands.
- [**CONCERNS.md**](docs/codebase/CONCERNS.md) — High-churn file analysis, technical debt tracking, and security notes.
