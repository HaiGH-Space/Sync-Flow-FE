# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| None | - | - | - | - |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| None | - | - | - | - |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| None | - | - | - | - |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Bulk-fetching list views and sidebar controls | `queries/sprint.ts`, `queries/project.ts`, `queries/workspace.ts`, `queries/issue.ts` | Hardcoded `limit: 100` parameter in hook queries | Items beyond the 100-limit will be hidden in sidebars, backlog/planning columns, and workspace lists | Transition to infinite loading, virtualization, or scroll-based pagination |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `components/dashboard/layout/navigation-sidebar/*` | Structural refactor to presenter/hook split and collapsible/expandable sprint/channel sublists | Top churn files (13+ edits to `NavigationSidebar.tsx`, 11+ edits to `NavigationSidebarSprintList.tsx`) | Keep UI presentation clean; keep state modifications inside the `useNavigationSidebar` custom hook |

### 6) `[ASK USER]` Questions

None


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

