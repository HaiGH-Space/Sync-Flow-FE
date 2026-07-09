# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| Medium | CI pipeline lacks automated test runner execution | `.github/workflows/react-doctor.yml` and `security.yml` do not run `pnpm test` | Core business logic regressions (e.g. workspace state, board ordering) could be merged without warning. | Add a workflow step to run `pnpm test` on PR/Push events. |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Direct use of `console.log` / `console.debug` | Quick implementation of rewrite and socket logs; lack of standard logger wrapper | `lib/api/api.ts`, `lib/api/chat.ts` | Sensitive information might be logged in production; logs cannot be filtered by environment. | Introduce a centralized logger with development-only levels. |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| CI Secret Scanner (Gitleaks) set to warn-only | A09:2021-Security Logging and Monitoring Failures | `.github/workflows/security.yml` uses `continue-on-error: true` | The scanner runs on pull request/push events. | Credentials leaks will not break the build, potentially going unnoticed. |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Rendering overhead in dense workspaces | `components/dashboard/layout/NavigationSidebar.tsx` rendering all sidebar item bindings | Minor lag in transitions when expanding project items | UI sluggishness for users belonging to many projects/channels | Implement virtualized rendering or strict client-side limit bounds for navigation sub-lists. |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `components/dashboard/layout/NavigationSidebar.tsx` | Manages nested sidebar routes, filters, and modal settings dialog toggles. | 12 modifications in the last 90 days | Keeps core data fetching in custom hook `useNavigationSidebar`. Ensure component is purely presentation-focused. |
| `components/dashboard/chat/Composer.tsx` | Intercepts keys, coordinates cursor offsets for emojis, and handles file attachments/previews. | 11 modifications in the last 90 days | Encapsulate state changes cleanly. Keep emoji insertion logic isolated from core file selection logic. |
| `components/dashboard/layout/DashboardContentLayout.tsx` | Manages responsive layouts and workspace-wide sidebars. | 9 modifications in the last 90 days | Rely on client-side state checks to prevent Next.js hydration mismatches. |

### 6) `[ASK USER]` Questions

1. `[ASK USER]` Should we configure a GitHub Action to automatically run `pnpm test` on every pull request, or keep test verification local/manual?

### 7) Evidence

- `.github/workflows/react-doctor.yml`
- `.github/workflows/security.yml`
- `package.json`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/dashboard/chat/Composer.tsx`
- `components/dashboard/layout/DashboardContentLayout.tsx`
