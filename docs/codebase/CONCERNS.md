# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern                                                                                      | Evidence                                                                                                    | Impact                                                                              | Suggested action                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| low      | Backend and intent docs referenced by the scan are absent from the workspace root            | `AGENTS.md`, file search results for `README`/`PRD`/`ROADMAP`/`DESIGN`                                      | Product intent and backend contract are defined externally                          | Reference the backend repository (https://github.com/HaiGH-Space/Sync-Flow-BE) for API contracts and codebase docs (static PRD and ROADMAP, DESIGN do not exist) |

### 2) Technical Debt

No active technical debt.

### 3) Security Concerns

No active security concerns.


### 4) Performance and Scaling Concerns

No active performance and scaling concerns.

### 5) Fragile/High-Churn Areas

No active fragile/high-churn concerns.

### 6) `[ASK USER]` Questions

1. `[ASK USER]` Is the lack of a frontend-specific test runner (e.g., Vitest or Cypress) permanent, or should a test framework be initialized in this repository? (Answered: Vitest has been initialized and configured with focused tests).

### 7) Evidence

- `package.json`
- `components/canvas/board/useColumnReorder.ts`
- `components/canvas/board/useIssueMove.ts`
- `lib/ordering.ts`
- `components/dashboard/layout/NavigationSidebar.tsx`
- `components/dashboard/comp/IssueDetailDialog.tsx`
- `i18n/en/dashboard/index.ts`
- `i18n/vi/dashboard/index.ts`
