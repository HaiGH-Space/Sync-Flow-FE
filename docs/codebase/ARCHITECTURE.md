# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: Feature-oriented Next.js App Router architecture with a thin routing shell, query/mutation separation, optimistic state flows, and client-side UI persistence.
- Why this classification: Route files strictly own layout composition and redirects, `queries/` owns query keys and options factories, `hooks/mutations/` owns mutations and cache invalidation, `lib/api/` encapsulates HTTP/WebSocket transport, and `lib/store/` manages persisted client state.
- Primary constraints: Locale-aware routing (`en` and `vi`), backend access through Next.js `/api-proxy` rewrites (and direct `INTERNAL_API_URL` during SSR), sparse ordering with midpoint math for Kanban drag operations, and zero-manual-memoization architecture powered by the React Compiler.

### 2) System Flow

```text
HTTP Request / Route Transition
       │
       ▼
   [proxy.ts Middleware] ───► (Validates locale, checks session_token hygiene, sets security headers)
       │
       ▼
 [app/[locale]/layout.tsx] ──► (Initializes Theme, QueryProvider, and next-intl context)
       │
       ▼
 [Dashboard Shell Layout] ───► (Composes WorkspaceRail, NavigationSidebar, and DashboardContentLayout)
       │
       ├───► [queries/*] ───────► (TanStack Query data fetching) ─► [/api-proxy Rewrite] ─► [Backend API]
       ├───► [hooks/mutations] ─► (Optimistic updates & invalidations) ─► [/api-proxy Rewrite] ─► [Backend API]
       ├───► [lib/api/chat] ────► (Real-time Socket.IO chat connection) ──────────────────► [Backend WebSockets]
       ├───► [lib/api/video] ───► (LiveKit WebRTC token & room connection) ───────────────► [LiveKit Cloud]
       └───► [lib/store/*] ─────► (Persisted Zustand state in LocalStorage)
```

1. **Gatekeeper**: `proxy.ts` middleware verifies the request locale, sanitizes and validates the `session_token` cookie, sets HTTP security response headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), and redirects unauthenticated users to `/auth`.
2. **Provider Root**: `app/[locale]/layout.tsx` hydrates the locale message bundle, wraps the application tree with `QueryProvider` and `ThemeProvider`, and mounts the `GlobalCallProvider`.
3. **Shell Composition**: Dashboard routes assemble the `WorkspaceRail` (paginated workspace switcher), `NavigationSidebar` (expandable project/sprint/channel trees), and `DashboardContentLayout`.
4. **Data Synchronization**: TanStack Query handles server state fetching, caching, and background refetches. Mutations apply optimistic UI updates immediately and invalidate matching query key prefixes.
5. **Real-time WebSockets & Media**: Socket.IO channels subscribe to `/chat` and `/notifications` feeds using authenticated cookie sessions. LiveKit WebRTC handles realtime channel video/audio sessions.

### 3) Layer/Module Responsibilities

| Layer or module                                | Owns                                                                         | Must not own                                      | Evidence                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `app/[locale]`                                 | Route shell, locale validation, redirects, layout composition                | Backend request logic                             | `app/[locale]/layout.tsx`, `app/[locale]/(home)/page.tsx`, `proxy.ts`                  |
| `components/dashboard` and `components/canvas` | Feature UI, interaction handling, dialogs, drag-and-drop flows               | API client construction                           | `components/dashboard/layout/*`, `components/canvas/board/*`, `components/canvas/backlog/*` |
| `components/call`                              | LiveKit WebRTC overlay, floating minimized call widget, participant controls | Direct backend URL resolution                     | `components/call/GlobalCallProvider.tsx`, `components/call/FullscreenCallOverlay.tsx` |
| `queries/`                                     | Query keys, stale times, query option factories, infinite queries            | Writes or UI state                                | `queries/workspace.ts`, `queries/issue.ts`, `queries/column.ts`, `queries/project.ts`   |
| `hooks/mutations/`                             | API writes, optimistic rollbacks, and cache invalidation                     | Query key definitions                             | `hooks/mutations/workspace.ts`, `hooks/mutations/column.ts`, `hooks/mutations/issue.ts` |
| `lib/api/`                                     | Request transport, URL resolution, and service wrappers                      | Presentation logic or route composition           | `lib/api/api-config.ts`, `lib/api/api.ts`, `lib/api/chat.ts`, `lib/api/video.ts`      |
| `lib/store/`                                   | Persisted client state for dashboard and video call controls                 | Network access                                    | `lib/store/use-dashboard.ts`, `lib/store/use-call-store.ts`                             |
| `lib/board/`                                   | Board card sorting and movement pure selectors                               | Network calls or component state                  | `lib/board/issue-move-utils.ts`                                                        |

### 4) Reused Patterns

| Pattern                            | Where found                                      | Why it exists                                                                                                         |
| ---------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Query option factory               | `queries/*.ts`                                   | Centralizes query keys, stale times, and fetcher invocations with typed options.                                      |
| Service object wrapper             | `lib/api/*.ts`                                   | Normalizes HTTP transport behind modular per-resource service modules (`workspaceService`, `issueService`, etc.).     |
| Zustand persisted store            | `lib/store/use-dashboard.ts`, `use-call-store.ts` | Preserves navigation sidebar states, panel sizes, and active call overlays across routes.                             |
| Optimistic mutation + invalidation | `hooks/mutations/*`, `components/canvas/board/*` | Delivers instant UI feedback during drag-and-drop actions and CRUD operations, synchronizing cache in the background. |
| Locale message bundles             | `i18n/en/*`, `i18n/vi/*`                         | Supports complete bilingual UI copy through `next-intl` feature sub-modules.                                          |
| LiveKit Call Provider              | `components/call/GlobalCallProvider.tsx`         | Maintains persistent WebRTC video/audio call sessions across client-side page transitions.                           |
| Infinite Query Sidebar Pagination  | `queries/workspace.ts`, `queries/project.ts`     | Fetches workspaces, projects, and sprints in paginated chunks to avoid list truncation on large datasets.             |
| Sparse Reordering Math             | `lib/ordering.ts`, `useIssueMove.ts`             | Computes midpoint order values with 1000-step spacing to prevent index rebalancing on every card move.               |
| Zero-memoization architecture      | Components under `components/`                   | Eliminates `useMemo`, `useCallback`, and `memo()` boilerplate by relying on the native React Compiler.                |

### 5) Known Architectural Risks and Hardening Status

- **Sparse Board Ordering**: Rapid card moves are managed via a flush-and-sequence optimistic mutation queue (`useColumnReorder`, `useIssueMove`) and validated with unit test coverage in `components/canvas/board/useIssueMove.test.ts` and `lib/board/issue-move-utils.test.ts`.
- **API URL Resolution**: Centralized in `lib/api/api-config.ts` supporting client-side `/api-proxy` rewrites and SSR direct backend communication via `INTERNAL_API_URL` (covered by unit tests in `lib/api/api-config.test.ts`).
- **Sidebar Scaling**: Mitigated potential 100-item truncation by upgrading project and workspace queries to TanStack `useInfiniteQuery` with pagination triggers.
- **Session Cookie Security**: Middleware in `proxy.ts` and cookie helpers in `lib/cookies.ts` enforce session token format hygiene and inject OWASP security response headers.

### 6) Evidence

- `proxy.ts`
- `app/[locale]/layout.tsx`
- `app/[locale]/(home)/dashboard/layout.tsx`
- `components/dashboard/layout/DashboardContentLayout.tsx`
- `components/canvas/board/BoardCanvas.tsx`
- `components/canvas/board/useIssueMove.ts`
- `components/call/GlobalCallProvider.tsx`
- `lib/api/api-config.ts`
- `lib/api/api.ts`
- `lib/board/issue-move-utils.ts`
- `lib/store/use-dashboard.ts`
- `lib/store/use-call-store.ts`
- `queries/workspace.ts`
- `queries/project.ts`
- `hooks/mutations/column.ts`
- `i18n/en/dashboard/index.ts`
