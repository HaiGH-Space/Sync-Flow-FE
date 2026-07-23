# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| Low | Bulk-fetching limit of 100 on sidebar navigation lists | `queries/workspace.ts`, `queries/project.ts` | Navigation sidebars may truncate lists if a workspace has >100 projects | Implement infinite loading or paginated sidebars |
| Low | Direct backend URL resolution differences between server SSR & client proxy | `lib/api/api-config.ts`, `next.config.ts` | Misconfigurations could break backend API rewrites | Maintain `next.config.ts` rewrite alignment |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| E2E test suite missing | Rapid frontend prototyping prioritized unit tests | Workspace root | Potential regressions in complex drag-and-drop or socket interaction flows | Add Playwright / Cypress end-to-end integration tests |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| Authentication dependency on `session_token` cookie | A07:2021 Identification and Authentication Failures | `proxy.ts`, `lib/api/chat.ts` | HttpOnly session cookie validation at middleware & socket connection | Cross-subdomain cookie leakage if cookie scope is overbroad |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Board canvas canvas re-rendering during rapid drag operations | `components/canvas/board/BoardCanvas.tsx`, `useIssueMove.ts` | Slight frame drop on large board layouts | Performance hit with 100+ cards per column | Virtualize board columns / cards |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `components/dashboard/layout/DashboardContentLayout.tsx` | Central layout shell wrapping multiple dynamic sidebars and panels | 12 commits in 90 days | Maintain prop contracts and hook separation |
| `components/dashboard/layout/NavigationSidebar.tsx` | Orchestrates project lists, sprint items, channels, and active project selections | 11 commits in 90 days | Keep child lists stateless and delegate mutations to `useNavigationSidebar` |
| `components/canvas/board/useIssueMove.ts` | Manages complex sparse ordering calculations and optimistic position updates | 8 commits in 90 days | Verify with unit tests in `lib/ordering.test.ts` before modifying calculation logic |
| `components/dashboard/comp/IssueDetailDialog.tsx` | Combines issue metadata editing, comment threads, user assignees, and status select | 8 commits in 90 days | Keep sub-dialogs decoupled and use `@tanstack/react-form` |

### 6) `[ASK USER]` Questions

None

### 7) Evidence

- `.codebase-scan.txt` git churn analysis
- `components/dashboard/layout/DashboardContentLayout.tsx`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/canvas/board/useIssueMove.ts`
- `components/dashboard/comp/IssueDetailDialog.tsx`
- `.github/workflows/react-doctor.yml`
- `.github/workflows/security.yml`
- `.github/workflows/test.yml`
- `package.json`
- `lib/api/api.ts`
- `lib/api/chat.ts`


