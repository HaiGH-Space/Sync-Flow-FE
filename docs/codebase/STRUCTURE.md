# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path             | Purpose                                                         | Evidence                                                                                |
| ---------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `app/`           | Next.js App Router route tree and root styles                   | `app/[locale]/layout.tsx`, `app/globals.css`                                            |
| `components/`    | Shared UI, auth, dashboard, and canvas feature components       | `components/auth/*`, `components/dashboard/*`, `components/canvas/*`                    |
| `hooks/`         | Client hooks and mutation wrappers                              | `hooks/*`                                                                               |
| `i18n/`          | Locale routing and translation bundles                          | `i18n/*`                                                                                |
| `lib/`           | API clients, utilities, ordering helpers, and client store code | `lib/*`                                                                                 |
| `queries/`       | React Query option factories and query keys                     | `queries/*`                                                                             |
| `types/`         | Shared TypeScript types                                         | `types/*`                                                                               |
| `docs/codebase/` | Generated repository documentation for this task                | `docs/codebase/STACK.md`, `docs/codebase/STRUCTURE.md`, `docs/codebase/ARCHITECTURE.md` |
| `next.config.ts` | Next.js runtime config and rewrite rules                        | `next.config.ts`                                                                        |
| `proxy.ts`       | Locale/auth request gate                                        | `proxy.ts`                                                                              |
| `package.json`   | Scripts and dependency manifest                                 | `package.json`                                                                          |

### 2) Entry Points

- Main runtime entry: `app/[locale]/layout.tsx`
- Route bootstrap: `proxy.ts` for locale/auth gating, `app/[locale]/(home)/page.tsx` for the `/dashboard` redirect, `app/[locale]/auth/page.tsx` for sign-in, `app/[locale]/(home)/dashboard/page.tsx` for dashboard view switching
- Secondary entry points: `app/[locale]/(home)/dashboard/[workspaceId]/page.tsx`, `app/[locale]/(home)/dashboard/[workspaceId]/[projectId]/page.tsx`, `app/[locale]/(home)/dashboard/[workspaceId]/[projectId]/[channelId]/page.tsx`
- How entry is selected: Next.js App Router resolves files under `app/[locale]`, and `proxy.ts` applies request-time locale/auth checks before routing continues

### 3) Module Boundaries

| Boundary                                         | What belongs here                                          | What must not be here                                      |
| ------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `app/` route layer                               | Layouts, redirects, page composition, locale bootstrapping | Shared business logic, API clients, store definitions      |
| `components/dashboard/` and `components/canvas/` | Feature UI, interaction logic, panel composition           | Direct backend URL construction or low-level rewrite rules |
| `queries/`                                       | React Query keys and query option factories                | Mutations or imperative side effects                       |
| `hooks/mutations/`                               | Mutation wrappers and cache invalidation                   | Shared fetch client setup                                  |
| `lib/api/`                                       | API request helpers and service wrappers                   | Presentation logic or route composition                    |
| `lib/store/`                                     | Persisted client UI state                                  | Data fetching and network writes                           |
| `i18n/`                                          | Locale routing and message bundles                         | Feature-specific UI state                                  |

### 4) Naming and Organization Rules

- File naming pattern: feature components use PascalCase (`BoardCanvas.tsx`, `NavigationSidebar.tsx`); utility modules and hooks use kebab or lowercase names (`format-date.ts`, `use-dashboard.ts`, `use-navigation-sidebar.ts`, `use-issue-detail.ts`)
- Directory organization pattern: feature-oriented folders under `components/`, with dashboard and canvas split by product area. High-traffic dashboard components (e.g. NavigationSidebar, IssueDetailDialog, Composer) are refactored into dedicated subdirectories (`components/dashboard/layout/navigation-sidebar/`, `components/dashboard/comp/issue-detail/`, `components/dashboard/chat/`) containing an orchestrator component, a custom hook for state management, and smaller, single-responsibility subcomponents. Localization translation files under `i18n/[locale]/dashboard/` are similarly modularized by dashboard feature (e.g., `backlog.ts`, `timeline.ts`, `chat.ts`) and aggregated via an `index.ts` file per locale.
- Import aliasing or path conventions: `@/*` maps to the repository root via `tsconfig.json`

### 5) Evidence

- `app/[locale]/layout.tsx`
- `app/[locale]/(home)/dashboard/[workspaceId]/[projectId]/[channelId]/page.tsx`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/dashboard/layout/navigation-sidebar/use-navigation-sidebar.ts`
- `components/dashboard/comp/IssueDetailDialog.tsx`
- `components/dashboard/comp/issue-detail/use-issue-detail.ts`
- `components/dashboard/chat/Composer.tsx`
- `components/dashboard/chat/use-composer.ts`
- `tsconfig.json`
- `package.json`
