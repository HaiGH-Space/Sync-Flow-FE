<div align="center">

# Sync Flow

_Sync anything, anywhere, with anyone._

[![Build Status](https://img.shields.io/github/actions/workflow/status/HaiGH-Space/Sync-Flow/react-doctor.yml?branch=master&style=flat-square&label=React%20Doctor)](https://github.com/HaiGH-Space/Sync-Flow/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square)](https://tailwindcss.com)

Sync Flow is a premium, real-time collaboration workspace designed for issue tracking, agile sprint planning, and team communication. Built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Architecture](#how-it-works) • [Documentation](#codebase-documentation)

</div>

---

## Features

- **Agile Boards & Planning Views** - Drag-and-drop kanban boards, issue backlogs, sprint management, and interactive timeline rails.
- **Bi-directional Real-time Collaboration** - Instant chat messages and live workspace notifications powered by Socket.IO.
- **Multi-locale Routing** - Built-in native support for English (`en`) and Vietnamese (`vi`) using `next-intl`.
- **Hybrid Security Model** - Seamless integration with a hybrid JWT/Redis cookie authentication framework.
- **Responsive Workspace Navigation** - Sidebar navigation, active workspace selectors, collapsible panels, and a sleek zinc-scale dark/light layout.

## Tech Stack

- **Framework**: Next.js `16.1.6` (App Router)
- **UI Library**: React `19.2.3`
- **State Management**: React Query `^5.90.20` (Server state) & Zustand `^5.0.11` (Persisted Client UI state)
- **Styling**: Tailwind CSS `v4` & Framer Motion `^12.40.0`
- **Form Handling**: `@tanstack/react-form` + `zod`
- **Real-time Networking**: `socket.io-client` `^4.8.1`
- **Internationalization**: `next-intl` `^4.8.2`

> [!NOTE]
> This repository contains the **Frontend** codebase. The corresponding **Backend** service code is situated in the adjacent `be/` workspace.

## Installation

### Prerequisites

- **Node.js** v18+ (tested on v24.12.0)
- **pnpm** package manager
- A running Sync Flow backend instance (defaults to `http://localhost:8000`)

### Setup & Run

1. Clone the repository and navigate to the frontend directory:

   ```bash
   cd sync-flow/fe
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

### Quality Assurance

Validate type safety and linting compliance before committing:

```bash
pnpm lint   # Run ESLint validation
pnpm build  # Perform a full production build
```

## How It Works

```
[Browser Client]
       │
       ▼ (Checks cookies & locale)
  [proxy.ts Middleware]
       │
       ▼ (Bootstraps layout contexts & providers)
  [app/[locale]/layout.tsx]
       │
       ├─► [queries/*] ───────► (React Query data fetching) ─► [/api-proxy Rewrite] ─► [Backend API]
       ├─► [hooks/mutations] ─► (Optimistic UI patches) ──────► [/api-proxy Rewrite] ─► [Backend API]
       └─► [lib/api/chat] ────► (Real-time WebSockets) ──────────────────────────────► [Backend WebSockets]
```

- **Authentication**: Gated at the middleware layer (`proxy.ts`) which validates the `session_token` cookie.
- **WebSocket Auth**: Sockets connect to `/chat` and `/notifications` using `withCredentials: true` and the client's `session_token` cookie.
- **State Flow**: The board reordering logic runs optimistically using midpoint insertion calculations (`lib/ordering.ts`) and is persisted asynchronously to prevent interface lag.

## Codebase Documentation

Detailed architecture blueprints and conventions are colocated within the project under `docs/codebase/`:

- [**STACK.md**](docs/codebase/STACK.md) — Comprehensive dependency lists, tools, and commands.
- [**STRUCTURE.md**](docs/codebase/STRUCTURE.md) — Directory topology, entry points, and boundaries.
- [**ARCHITECTURE.md**](docs/codebase/ARCHITECTURE.md) — Data flow, layers, and re-order behaviors.
- [**CONVENTIONS.md**](docs/codebase/CONVENTIONS.md) — Coding styles, naming rules, and error handling.
- [**INTEGRATIONS.md**](docs/codebase/INTEGRATIONS.md) — Network endpoints, cookies, and reliability layers.
- [**TESTING.md**](docs/codebase/TESTING.md) — Automated testing matrix and mocking policies.
- [**CONCERNS.md**](docs/codebase/CONCERNS.md) — Outstanding technical debt, performance risks, and churn areas.
