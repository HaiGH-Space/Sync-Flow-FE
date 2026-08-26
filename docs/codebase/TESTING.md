# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: Vitest `^4.1.9`
- Assertion & mocking tools: Vitest (built-in assertions, `vi.mock`, `vi.fn`, `vi.mocked`)
- Commands:

```bash
pnpm test     # Run Vitest test suite in single-run mode (22 test suites, 83 tests)
pnpm lint     # Run ESLint static analysis across TS/TSX codebase
pnpm doctor   # Run React Doctor diagnostic analyzer
pnpm build    # Execute Next.js production build verification
```

### 2) Test Layout

- Test file placement pattern: Co-located directly alongside the target source file (e.g. `lib/ordering.test.ts`, `queries/workspace.test.ts`, `lib/cookies.test.ts`).
- Naming convention: `*.test.ts`
- Test runner configuration: Configured in `vitest.config.ts`.

### 3) Test Scope Matrix

| Scope       | Covered? | Typical target                                                                                                     | Status / Evidence                                                                                |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Unit        | Yes      | Pure helper functions, ordering math, cookie validation, URL resolution, role helpers, board task sorting selectors | 22 test files covering utilities, hooks, stores, and presenter state helpers (`pnpm test`).     |
| Integration | Yes      | API service wrappers, React Query options factories, WebSocket lifecycle hooks, Zustand store state transitions     | Query options and WebSocket hooks verified with Vitest mocks (`queries/*.test.ts`, `lib/api/*`). |
| E2E         | No       | End-to-end browser journeys across live authentication and real WebRTC sessions                                    | Validated via developer manual testing and production builds.                                    |

### 4) Mocking and Isolation Strategy

- Main mocking approach: Vitest's `vi.mock()` is used to mock external dependencies, HTTP service modules (e.g. `@/lib/api/workspace`, `@/lib/api/video`), and Socket.IO client instances.
- State isolation: Mocks and spies are reset before every test execution via `vi.clearAllMocks()` inside `beforeEach()` blocks.
- Type-safe mocks: Mock response structures utilize TypeScript types or mock envelopes to ensure full alignment with production API contracts.

### 5) Coverage and Quality Signals

- Automated CI pipeline: GitHub Actions workflow `.github/workflows/test.yml` triggers on every push and pull request targeting `master`, running `pnpm test`.
- Diagnostic quality checks: GitHub Actions workflow `.github/workflows/react-doctor.yml` runs automated diagnostics against React best practices.
- Security scans: GitHub Actions workflow `.github/workflows/security.yml` scans commit histories for credentials and secrets using Gitleaks.

### 6) Evidence

- `package.json`
- `vitest.config.ts`
- `.github/workflows/test.yml`
- `.github/workflows/security.yml`
- `.github/workflows/react-doctor.yml`
- `lib/ordering.test.ts`
- `lib/logger.test.ts`
- `lib/cookies.test.ts`
- `lib/api/api-config.test.ts`
- `lib/api/chat.test.ts`
- `lib/api/notification.test.ts`
- `lib/api/video.test.ts`
- `lib/board/issue-move-utils.test.ts`
- `lib/store/use-call-store.test.ts`
- `queries/workspace.test.ts`
- `queries/project.test.ts`
- `queries/sprint.test.ts`
- `queries/channel.test.ts`
- `hooks/use-current-workspace.test.ts`
- `hooks/use-socket-sync.test.ts`
- `hooks/notifications/use-notification-channel.test.ts`
- `components/dashboard/comp/issue-detail/use-issue-detail-state.test.ts`
- `components/dashboard/layout/navigation-sidebar/use-navigation-sidebar.test.ts`
- `components/dashboard/layout/DashboardContentLayout.test.ts`
- `components/canvas/board/KanbanColumn.test.ts`
- `components/canvas/board/useIssueMove.test.ts`
- `proxy.test.ts`
