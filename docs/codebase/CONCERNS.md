# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action | Status / Resolution |
|----------|---------|----------|--------|------------------|---------------------|
| Low | Bulk-fetching limit of 100 on sidebar navigation lists | `queries/workspace.ts`, `queries/project.ts`, `queries/sprint.ts` | Navigation sidebars may truncate lists if a workspace has >100 projects/sprints or user has >100 workspaces | Implement infinite loading or paginated sidebars | **Hardened:** Migrated projects, workspaces, and sprints queries to `useInfiniteQuery` with pagination handlers in `WorkspaceRail` and `NavigationSidebar`. |
| Low | Direct backend URL resolution differences between server SSR & client proxy | `lib/api/api-config.ts`, `next.config.ts` | Misconfigurations could break backend API rewrites in internal container networks | Support internal SSR URL while keeping client rewrites | **Hardened:** Supported `INTERNAL_API_URL` during SSR in `lib/api/api-config.ts` and `next.config.ts`, normalized trailing slashes, and added unit test coverage in `lib/api/api-config.test.ts`. |

### 2) Technical Debt

| Debt item              | Why it exists                                     | Where          | Risk if ignored                                                            | Suggested fix                                         | Status |
| ---------------------- | ------------------------------------------------- | -------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | --- |
| E2E test suite missing | Rapid frontend prototyping prioritized unit tests | Workspace root | Potential regressions in complex drag-and-drop or socket interaction flows | Add Playwright / Cypress end-to-end integration tests | Tracked for future testing milestones; unit/integration test coverage increased to 22 test suites with automated CI. |

### 3) Security Concerns

| Risk                                                | OWASP category (if applicable)                      | Evidence                      | Current mitigation                                                   | Gap                                                         | Status / Mitigation                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------- | --------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication dependency on `session_token` cookie | A07:2021 Identification and Authentication Failures | `proxy.ts`, `lib/api/chat.ts` | HttpOnly session cookie validation at middleware & socket connection | Cross-subdomain cookie leakage if cookie scope is overbroad | **Hardened:** Validated `session_token` format & hygiene in `proxy.ts` & `lib/cookies.ts`, enforced host-only cookie scope guidelines, set HTTP security response headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), and added unit test coverage in `proxy.test.ts` & `lib/cookies.test.ts`. |

### 4) Performance and Scaling Concerns

| Concern                                                | Evidence                                                                       | Current symptom                                          | Scaling risk                        | Suggested improvement                                         | Status / Resolution                                                                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Board canvas re-rendering during rapid drag operations | `components/canvas/board/BoardCanvas.tsx`, `useIssueMove.ts`, `KanbanCard.tsx` | Resolved (frame drops eliminated on large board layouts) | Low risk with 100+ cards per column | Virtualize board columns / cards & conditional modal mounting | Resolved: Conditionally mount `IssueDetailDialog` only on active view; added `content-visibility: auto` card containment; stabilized query selector task filtering. |

### 5) Fragile/High-Churn Areas

| Area / File                                                                           | Churn (Commits) | Risk / Reason                                                       | Suggested Handling                                                          | Status / Mitigation                                                                        |
| ------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `components/dashboard/layout/navigation-sidebar/use-navigation-sidebar.ts`           | 11              | Frequent UX iterations around workspace/project/sprint expansion    | Keep state logic encapsulated in `use-navigation-sidebar.ts`                | **Hardened:** Extracted `getWorkspaceRole` pure function with full unit test coverage.     |
| `components/canvas/board/KanbanColumn.tsx`                                            | 9               | Board rendering performance and dnd-kit integration                 | Maintain `content-visibility: auto` optimizations and memoization avoidance | **Hardened:** Extracted `filterAndSortColumnTasks` pure selector with unit tests.          |
| `components/canvas/board/useIssueMove.ts`                                             | 9               | Midpoint ordering, column transitions, and flush-and-sequence queue | Thoroughly test drag reordering logic with `lib/ordering.ts`                | **Hardened:** Added unmount timer/map cleanup and unit test coverage for drag hooks.       |
| `components/dashboard/layout/NavigationSidebar.tsx`                                   | 9               | Expandable project/sprint tree rendering and workspace selection    | Keep presentational and delegate data to custom hooks                       | **Hardened:** Modularized sprint list and project items into dedicated components.        |
| `components/dashboard/layout/navigation-sidebar/NavigationSidebarSprintList.tsx`      | 8               | Sprint listing and pagination triggers                              | Keep pagination logic pure and test query boundary                          | **Hardened:** Handled infinite query pagination trigger and empty state cleanly.           |
| `components/dashboard/layout/DashboardContentLayout.tsx`                              | 8               | Core layout wrapper composing header, rail, sidebar, and panels     | Ensure layout refactors do not break grid/flex responsiveness               | **Hardened:** Extracted `getSidebarActiveStates` for SSR hydration safety with unit tests. |
| `lib/api/notification.ts`                                                             | 8               | Real-time notification socket payload parsing & cache invalidation  | Maintain strict typing and session token pass-through                       | **Hardened:** Added comprehensive REST API unit tests and socket lifecycle test coverage.  |
| `components/dashboard/layout/navigation-sidebar/NavigationSidebarProjectItem.tsx`     | 7               | Project item rendering, channel listing, and sprint accordion       | Keep list items responsive and prevent unnecessary tree rerenders           | **Hardened:** Clean component boundary; state delegated to `useNavigationSidebar`.         |
| `lib/api/chat.ts`                                                                     | 7               | Chat WebSocket connection lifecycle and authentication              | Ensure proper session token propagation and cleanup on disconnect           | **Hardened:** Verified singleton lifecycle and explicit session token propagation in tests.|
| `components/canvas/timeline/useTimelineCanvasModel.ts`                                | 6               | Timeline calculations, zoom levels, and sprint duration rails       | Keep timeline model math isolated from presentation                         | **Hardened:** Pure model building helpers structured in `buildTimelineModel.ts`.           |
| `components/dashboard/layout/navigation-sidebar/NavigationSidebarChannelList.tsx`     | 6               | Channel navigation links and active state highlighting              | Presentational subcomponent driven by route params                          | **Hardened:** Isolated channel list rendering.                                             |

### 6) `[ASK USER]` Questions

None. All architectural patterns, dependencies, test suites, and risk mitigations are verifiable directly from current source files and git history.

### 7) Evidence

- `.codebase-scan.txt` git churn analysis
- `components/dashboard/layout/DashboardContentLayout.tsx`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/dashboard/layout/navigation-sidebar/use-navigation-sidebar.ts`
- `components/canvas/board/useIssueMove.ts`
- `components/canvas/board/KanbanColumn.tsx`
- `components/dashboard/comp/IssueDetailDialog.tsx`
- `.github/workflows/react-doctor.yml`
- `.github/workflows/security.yml`
- `.github/workflows/test.yml`
- `package.json`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `lib/api/notification.ts`
