# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| Medium | CI pipeline lacks automated test runner execution | `.github/workflows/react-doctor.yml` and `security.yml` do not run `pnpm test` | Core business logic regressions (e.g. workspace state, board ordering) could be merged without warning. | Add a workflow step to run `pnpm test` on PR/Push events. |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| None | - | - | - | - |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| CI Secret Scanner (Gitleaks) set to warn-only | A09:2021-Security Logging and Monitoring Failures | `.github/workflows/security.yml` uses `continue-on-error: true` | The scanner runs on pull request/push events. | Credentials leaks will not break the build, potentially going unnoticed. |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Bulk-fetching sidebar lists and modals | `queries/sprint.ts`, `queries/channel.ts` query options specify static `limit: 100` | Truncated list if volume exceeds 100 items | Sidebars and select inputs will hide items beyond the limit | Add infinite loading or scroll-based pagination in sidebar panels |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `components/dashboard/layout/navigation-sidebar/*` | Structural refactor to presenter/hook split and collapsible/expandable sprint/channel sublists | Top churn files (13+ edits to `NavigationSidebar.tsx`, 11+ edits to `NavigationSidebarSprintList.tsx`) | Keep UI presentation clean; keep state modifications inside the `useNavigationSidebar` custom hook |

### 6) `[ASK USER]` Questions

1. `[ASK USER]` Should we configure a GitHub Action to automatically run `pnpm test` on every pull request, or keep test verification local/manual?

### 7) Evidence

- `.github/workflows/react-doctor.yml`
- `.github/workflows/security.yml`
- `package.json`
- `queries/sprint.ts`
- `queries/channel.ts`
- `components/dashboard/layout/navigation-sidebar/`
- `lib/api/api.ts`
- `lib/api/chat.ts`
