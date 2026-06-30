# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: feature-oriented Next.js App Router with a thin route shell, query/mutation separation, and client-side dashboard state
- Why this classification: route files own composition and redirects, `queries/` owns query keys/options, `hooks/mutations/` owns writes and invalidation, `lib/api/` owns service wrappers, and `lib/store/` owns persisted UI state
- Primary constraints: locale-aware routing, backend access through `/api-proxy`, and optimistic drag-and-drop updates for board interactions

### 2) System Flow

```text
request -> proxy.ts locale/auth gate -> app/[locale]/layout.tsx providers -> route page/layout -> query hooks or store state -> lib/api/* or socket.io-client -> UI update
```

1. `proxy.ts` inspects the request locale and the `session_token` cookie before allowing protected routes to continue.
2. `app/[locale]/layout.tsx` validates the locale, loads providers, and wraps the app with theme, React Query, and `next-intl` context.
3. Dashboard routes compose `WorkspaceRail`, `NavigationSidebar`, and `DashboardContentLayout` to establish the shell.
4. Query factories in `queries/*` fetch workspace, project, sprint, column, issue, and channel data through `lib/api/*` service wrappers.
5. Mutations in `hooks/mutations/*` invalidate or patch cached query data after writes.
6. Board drag handlers in `components/canvas/board/*` perform optimistic updates, then persist reorders through the API.

### 3) Layer/Module Responsibilities

| Layer or module                                | Owns                                                               | Must not own                   | Evidence                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------- |
| `app/[locale]`                                 | Route shell, locale validation, redirects, page composition        | Backend request logic          | `app/[locale]/layout.tsx`, `app/[locale]/(home)/page.tsx`, `proxy.ts`           |
| `components/dashboard` and `components/canvas` | UI composition, interaction handling, dialogs, drag-and-drop flows | API client construction        | `components/dashboard/layout/*`, `components/canvas/board/*`                    |
| `queries/`                                     | Query keys, stale times, query option factories                    | Writes or UI state             | `queries/workspace.ts`, `queries/issue.ts`, `queries/column.ts`                 |
| `hooks/mutations/`                             | API writes and cache invalidation                                  | Query key definitions          | `hooks/mutations/workspace.ts`, `hooks/mutations/column.ts`                     |
| `lib/api/`                                     | Request transport and service methods                              | Rendering or routing decisions | `lib/api/api.ts`, `lib/api/workspace.ts`, `lib/api/issue.ts`, `lib/api/chat.ts` |
| `lib/store/`                                   | Persisted client state for dashboard controls                      | Network access                 | `lib/store/use-dashboard.ts`                                                    |

### 4) Reused Patterns

| Pattern                            | Where found                                      | Why it exists                                            |
| ---------------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Query option factory               | `queries/*.ts`                                   | Keeps query keys, stale times, and fetchers centralized  |
| Service object wrapper             | `lib/api/*.ts`                                   | Normalizes HTTP access behind small per-resource modules |
| Zustand persisted store            | `lib/store/use-dashboard.ts`                     | Preserves dashboard UI state across navigations          |
| Optimistic mutation + invalidation | `hooks/mutations/*`, `components/canvas/board/*` | Keeps drag-and-drop and CRUD flows responsive            |
| Locale message bundles             | `i18n/en/*`, `i18n/vi/*`                         | Supports bilingual UI copy through `next-intl`           |

### 5) Known Architectural Risks

- Board ordering is implemented with optimistic updates, debounced writes, and sparse ordering helpers; this is the most fragile interaction path and can drift if server writes fail or arrive out of order
- Backend URL handling is split between `next.config.ts` rewrites and `lib/api/api.ts` server-side base URL resolution, so changes to deployment hosts can break requests if both paths are not kept aligned
- The repo does not include a documented backend contract or intent docs in the workspace; the backend API contract and codebase structure are documented in the backend repository at https://github.com/HaiGH-Space/Sync-Flow-BE (static PRD and ROADMAP documents do not exist in either repository)

### 6) Evidence

- `proxy.ts`
- `app/[locale]/layout.tsx`
- `app/[locale]/(home)/dashboard/layout.tsx`
- `components/dashboard/layout/DashboardContentLayout.tsx`
- `components/canvas/board/BoardCanvas.tsx`
- `components/canvas/board/useBoardDragHandlers.ts`
- `components/canvas/board/useColumnReorder.ts`
- `components/canvas/board/useIssueMove.ts`
- `lib/api/api.ts`
- `lib/store/use-dashboard.ts`
- `queries/workspace.ts`
- `hooks/mutations/column.ts`
