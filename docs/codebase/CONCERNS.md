# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| None | - | - | - | - |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Duplicated cookie parser helper | Used in both socket connection modules to read `session_token` from cookies | `lib/api/chat.ts` and `lib/api/notification.ts` | Logic duplication; code becomes harder to maintain or harden if cookie name/parsing strategy changes | Extract `getCookieValue` into a shared utility file (e.g., `lib/cookies.ts` or `lib/utils.ts`) |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| Socket connection session token reuse / leakage | OWASP A01:2021-Broken Access Control | `lib/api/chat.ts` & `lib/api/notification.ts` | Sockets disconnect/reconnect on session changes via `useSocketSync` | None (Mitigated) |
| Shared global `QueryClient` singleton | OWASP A01:2021-Broken Access Control / Data Leakage | `components/ui/query-provider.tsx` | None (Instantiated as a global module-level singleton) | Next.js pre-renders client components on the server (SSR). The shared global `QueryClient` instance may leak query cache data across different requests/users |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Bulk-fetching list views and sidebar controls | `queries/sprint.ts`, `queries/project.ts`, `queries/workspace.ts`, `queries/issue.ts` | Hardcoded `limit: 100` parameter in hook queries | Items beyond the 100-limit will be hidden in sidebars, backlog/planning columns, and workspace lists | Transition to infinite loading, virtualization, or scroll-based pagination |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `components/dashboard/layout/navigation-sidebar/*` | Structural refactor to presenter/hook split and collapsible/expandable sprint/channel sublists | Top churn files (13+ edits to `NavigationSidebar.tsx`, 11+ edits to `NavigationSidebarSprintList.tsx`) | Keep UI presentation clean; keep state modifications inside the `useNavigationSidebar` custom hook |

### 6) `[ASK USER]` Questions

1. `[ASK USER]` Should we refactor the global `QueryClient` in `QueryProvider` to be instantiated inside the component scope (e.g., using `useState` or a ref) to prevent potential cross-request cache leaks during server pre-rendering (SSR)?
2. `[ASK USER]` Should we extract the duplicated `getCookieValue` helper from `lib/api/chat.ts` and `lib/api/notification.ts` into a shared utility file?


### 7) Evidence

- `.github/workflows/react-doctor.yml`
- `.github/workflows/security.yml`
- `.github/workflows/test.yml`
- `package.json`
- `queries/sprint.ts`
- `queries/project.ts`
- `queries/workspace.ts`
- `queries/issue.ts`
- `components/dashboard/layout/navigation-sidebar/`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `lib/api/notification.ts`
- `components/ui/query-provider.tsx`

