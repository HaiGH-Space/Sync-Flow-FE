# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path             | Purpose                                                                 | Evidence                                                                                |
| ---------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `app/`           | Next.js App Router route tree, layout providers, and root styles        | `app/[locale]/layout.tsx`, `app/globals.css`                                            |
| `components/`    | Shared UI, auth, dashboard, canvas, video call, and channel components  | `components/auth/*`, `components/dashboard/*`, `components/canvas/*`, `components/call/*`, `components/channel/*` |
| `hooks/`         | Custom React hooks, mutation wrappers, and WebSocket listeners          | `hooks/*`, `hooks/mutations/*`, `hooks/notifications/*`, `hooks/chat/*`                 |
| `i18n/`          | Locale routing and modular translation message bundles                  | `i18n/routing.ts`, `i18n/request.ts`, `i18n/en/*`, `i18n/vi/*`                          |
| `lib/`           | API transport, Zustand stores, ordering math, cookies, and logger       | `lib/api/*`, `lib/store/*`, `lib/ordering.ts`, `lib/cookies.ts`, `lib/logger.ts`       |
| `queries/`       | TanStack Query option factories and query keys                          | `queries/*`                                                                             |
| `types/`         | Shared TypeScript interface and type declarations                       | `types/*`                                                                               |
| `docs/codebase/` | Structured repository documentation suite                               | `docs/codebase/STACK.md`, `docs/codebase/STRUCTURE.md`, `docs/codebase/ARCHITECTURE.md` |
| `.github/`       | GitHub Actions CI pipelines and repository security policies            | `.github/workflows/test.yml`, `.github/workflows/security.yml`, `.github/SECURITY.md`  |
| `next.config.ts` | Next.js runtime config, React Compiler flag, and API rewrite rules      | `next.config.ts`                                                                        |
| `proxy.ts`       | Locale routing, session token validation, and security header gate     | `proxy.ts`                                                                              |
| `package.json`   | Package scripts and dependency manifest                                 | `package.json`                                                                          |

### 2) Entry Points

- Main runtime entry: `app/[locale]/layout.tsx`
- Request bootstrap: `proxy.ts` applies locale resolution, validates `session_token` cookie hygiene, sets security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), and controls route redirects.
- Route endpoints:
  - `app/[locale]/(home)/page.tsx` — Redirects authenticated sessions to default dashboard view.
  - `app/[locale]/auth/page.tsx` — Authentication portal (sign-in / registration).
  - `app/[locale]/(home)/dashboard/page.tsx` — Root dashboard workspace view.
  - `app/[locale]/(home)/dashboard/[workspaceId]/page.tsx` — Workspace-scoped dashboard.
  - `app/[locale]/(home)/dashboard/[workspaceId]/[projectId]/page.tsx` — Project-scoped view (Kanban board, Backlog table, Planning view, Timeline rail).
  - `app/[locale]/(home)/dashboard/[workspaceId]/[projectId]/[channelId]/page.tsx` — Realtime channel chat and WebRTC call view.

### 3) Module Boundaries

| Boundary                                         | What belongs here                                          | What must not be here                                      |
| ------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `app/` route layer                               | Layouts, redirects, page composition, locale bootstrapping | Shared business logic, API clients, store definitions      |
| `components/dashboard/` and `components/canvas/` | Feature UI, interaction logic, panel composition           | Direct backend URL construction or low-level rewrite rules |
| `components/call/`                               | LiveKit WebRTC provider, floating widget, overlay views    | Backend URL hardcoding or unauthenticated tokens           |
| `queries/`                                       | React Query keys and query option factories                | Mutations or imperative side effects                       |
| `hooks/mutations/`                               | Mutation wrappers and cache invalidation                   | Shared fetch client setup                                  |
| `lib/api/`                                       | API request helpers and service wrappers                   | Presentation logic or route composition                    |
| `lib/store/`                                     | Persisted client UI state                                  | Data fetching and network writes                           |
| `i18n/`                                          | Locale routing and message bundles                         | Feature-specific UI state                                  |

### 4) Naming and Organization Rules

- File naming pattern: Feature components use PascalCase (`BoardCanvas.tsx`, `NavigationSidebar.tsx`); utility modules and hooks use kebab-case or lowercase names (`format-date.ts`, `use-dashboard.ts`, `use-navigation-sidebar.ts`, `use-issue-detail.ts`).
- Directory organization pattern: High-traffic components are modularized into dedicated subdirectories containing an orchestrator component, custom presenter hooks, and single-responsibility subcomponents:
  - `components/dashboard/layout/navigation-sidebar/` (Sidebar lists, role helpers, and presenter hooks)
  - `components/dashboard/comp/issue-detail/` (Issue detail modal, state hooks, comment thread)
  - `components/dashboard/chat/` (Composer, message list, emoji picker, and presenter hooks)
- Localization bundles: Translation files under `i18n/[locale]/dashboard/` are modularized by product feature (`backlog.ts`, `timeline.ts`, `chat.ts`, `issue.ts`) and aggregated via an `index.ts` file per locale.
- Import aliasing: `@/*` maps to the repository root via `tsconfig.json`.

### 5) Evidence

- `app/[locale]/layout.tsx`
- `app/[locale]/(home)/dashboard/[workspaceId]/[projectId]/[channelId]/page.tsx`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/dashboard/layout/navigation-sidebar/use-navigation-sidebar.ts`
- `components/dashboard/comp/IssueDetailDialog.tsx`
- `components/dashboard/comp/issue-detail/use-issue-detail-state.ts`
- `components/dashboard/chat/Composer.tsx`
- `components/dashboard/chat/use-composer.ts`
- `components/call/GlobalCallProvider.tsx`
- `hooks/use-video-call.ts`
- `tsconfig.json`
- `package.json`
- `.github/workflows/test.yml`
