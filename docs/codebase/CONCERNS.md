# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern                                                                                      | Evidence                                                                                                    | Impact                                                                              | Suggested action                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| high     | No automated test suite or test config was found                                             | `package.json`, `eslint.config.mjs`, `pnpm-lock.yaml`                                                       | Regressions in routing, drag-and-drop, and API wrappers are likely to slip through  | Add at least one focused test layer for query/mutation and board ordering behavior                                                                               |
| high     | Board reorder logic relies on optimistic updates, debounced persistence, and sparse ordering | `components/canvas/board/useColumnReorder.ts`, `components/canvas/board/useIssueMove.ts`, `lib/ordering.ts` | Race conditions or backend order collisions can leave the UI and server out of sync | Add targeted tests for midpoint insertion, rebalance fallback, and rollback paths                                                                                |
| low      | Backend and intent docs referenced by the scan are absent from the workspace root            | `AGENTS.md`, file search results for `README`/`PRD`/`ROADMAP`/`DESIGN`                                      | Product intent and backend contract are defined externally                          | Reference the backend repository (https://github.com/HaiGH-Space/Sync-Flow-BE) for API contracts and codebase docs (static PRD and ROADMAP, DESIGN do not exist) |

### 2) Technical Debt

| Debt item                    | Why it exists                                                                                          | Where                              | Risk if ignored                                                   | Suggested fix                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Mixed request base URL logic | API routing is split between `next.config.ts` rewrites and `lib/api/api.ts` server-side URL resolution | `next.config.ts`, `lib/api/api.ts` | Environment changes can break requests in only one execution path | Consolidate the base URL contract and document it in one place |

### 3) Security Concerns

| Risk                                                                               | OWASP category (if applicable) | Evidence                                             | Current mitigation                                                                               | Gap                                                                                        |
| ---------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Session cookie is used for auth decisions in the client-side proxy and chat socket | N/A                            | `proxy.ts`, `lib/api/chat.ts`                        | Route gating and socket auth both read `session_token`                                           | No repo-local security policy, secret template, or redaction guidance was found            |
| No security/compliance config was detected                                         | N/A                            | `package.json`, `.github/workflows/react-doctor.yml` | React Doctor CI workflow audits pull requests; ESLint type-safety and syntax checks are enforced | No documented secret-scanning, dependency-audit, or security policy files in the workspace |

### 4) Performance and Scaling Concerns

| Concern                                                         | Evidence                                                                                            | Current symptom                                       | Scaling risk                                                      | Suggested improvement                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Optimistic board reorder is sensitive to timing and cache state | `components/canvas/board/useColumnReorder.ts`, `components/canvas/board/useIssueMove.ts`            | Temporary inconsistencies can appear during drag/drop | Higher interaction volume increases the chance of race conditions | Add focused tests and keep the sparse ordering helper as the single source of truth |
| High-churn dashboard and translation files                      | `i18n/en/dashboard.ts`, `i18n/vi/dashboard.ts`, `components/dashboard/layout/NavigationSidebar.tsx` | Frequent edits suggest hidden complexity              | Small changes can have wide UI impact                             | Treat these files as high-risk and change them with narrow diffs                    |

### 5) Fragile/High-Churn Areas

| Area                                                                  | Why fragile                                                            | Churn signal                     | Safe change strategy                                                       |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `i18n/en/dashboard.ts` and `i18n/vi/dashboard.ts`                     | Large translation surface for the dashboard shell                      | 21 recent changes each           | Update copy together and verify both locales                               |
| `components/dashboard/layout/NavigationSidebar.tsx` and subcomponents | Manages layout composition, delegating state to `useNavigationSidebar` | 17 recent changes                | Keep rendering logic simple and delegate state changes via the custom hook |
| `components/canvas/board/BoardCanvas.tsx` and board helpers           | Handles loading, error, and drag/drop interactions                     | 14 recent changes on board files | Keep reorder behavior centralized in helper hooks                          |
| `components/dashboard/layout/DashboardContentLayout.tsx`              | Owns tabs, sprint selection, and chat-panel toggling                   | 10 recent changes                | Preserve existing state flow and invalidate only the relevant query keys   |
| `lib/api/issue.ts` and `lib/store/use-dashboard.ts`                   | Shared backend and UI state used across several features               | Recent churn in both files       | Avoid cross-cutting edits unless a bug justifies them                      |

### 6) `[ASK USER]` Questions

1. `[ASK USER]` Is the lack of a frontend-specific test runner (e.g., Vitest or Cypress) permanent, or should a test framework be initialized in this repository?

### 7) Evidence

- `package.json`
- `components/canvas/board/useColumnReorder.ts`
- `components/canvas/board/useIssueMove.ts`
- `lib/ordering.ts`
- `next.config.ts`
- `lib/api/api.ts`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/dashboard/comp/IssueDetailDialog.tsx`
- `i18n/en/dashboard.ts`
- `i18n/vi/dashboard.ts`
