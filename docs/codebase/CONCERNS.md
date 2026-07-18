# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| None | - | - | - | - |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Redundant manual memoization | React Compiler is active and optimizes rendering automatically | 36 files (e.g., `components/canvas/timeline/*`, `components/dashboard/*`, `components/ui/*`) | Code clutter, overhead, and potential for stale manual dependencies | Delete redundant `useCallback`, `useMemo`, and `memo` wrappers |
| Boolean prop-heavy components | Components take 5+ boolean/toggle props, making them hard to combine and test | `components/dashboard/layout/navigation-sidebar/NavigationSidebarProjectItem.tsx:43`, `NavigationSidebarProjectList.tsx:50` | Maintenance complexity and poor testability | Split into smaller sub-components or distinct variants |
| Locale/timezone formatting during render | `toLocaleDateString()` is executed during render without fixed locale/timezone | `components/ui/calendar.tsx:208` | Client-side hydration mismatches on server-rendered pages | Format in a post-mount `useEffect` or pass explicit locale and timeZone parameters |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| None | - | - | - | - |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| None | - | - | - | - |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| None | - | - | - |

### 6) `[ASK USER]` Questions

None


### 7) Evidence

- `.github/workflows/react-doctor.yml`
- `.github/workflows/security.yml`
- `.github/workflows/test.yml`
- `package.json`
- `components/dashboard/layout/navigation-sidebar/`
- `components/ui/calendar.tsx`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `lib/api/notification.ts`
- `components/ui/query-provider.tsx`

