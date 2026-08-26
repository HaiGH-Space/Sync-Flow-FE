# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item               | Rule                                                                                             | Example                                                                                  | Evidence                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Files              | Feature components use PascalCase; utilities, hooks, and stores use lowercase or kebab-case      | `BoardCanvas.tsx`, `format-date.ts`, `use-dashboard.ts`, `use-call-store.ts`             | `components/canvas/board/BoardCanvas.tsx`, `lib/format-date.ts`, `lib/store/use-dashboard.ts` |
| Functions/methods  | Hooks use `use*`; query factories use `create*QueryOptions`; service methods describe the action | `useCurrentWorkspace`, `createWorkspaceDetailQueryOptions`, `getWorkspaceMembersProfile` | `hooks/use-current-workspace.ts`, `queries/workspace.ts`, `lib/api/member-workspace.ts`       |
| Types/interfaces   | PascalCase for exported types and interfaces                                                     | `Workspace`, `ApiResponse`, `BoardCanvasProps`, `CallState`                              | `lib/api/workspace.ts`, `lib/api/api.ts`, `lib/store/use-call-store.ts`                       |
| Constants/env vars | Uppercase constants, env vars use `NEXT_PUBLIC_*`, `INTERNAL_*`, or deployment names             | `API_PREFIX`, `NEXT_PUBLIC_API_URL`, `INTERNAL_API_URL`, `VERCEL_URL`                   | `lib/api/api.ts`, `next.config.ts`, `lib/api/api-config.ts`                                   |

### 2) Formatting and Linting

- Formatter: Tailwind CSS v4 and component styles are managed via `app/globals.css` and `components.json`.
- Linter: ESLint flat config in `eslint.config.mjs` extending `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, and `@tanstack/eslint-plugin-query`.
- TypeScript strictness: `strict: true` and strict type checking configured in `tsconfig.json`.
- React Compiler Rule: Never introduce manual memoization wrappers (`useCallback`, `useMemo`, or `memo()`) in new hooks or components. The React Compiler natively manages memoization at build time.
- Verification commands: `pnpm lint`, `pnpm doctor`, `pnpm build`.

### 3) Import and Module Conventions

- Import grouping/order: External packages first, followed by internal aliases (`@/components`, `@/lib`, `@/queries`, `@/hooks`), then relative imports.
- Path aliases: `@/*` is the root alias defined in `tsconfig.json`.
- Presenter/Hook Pattern: UI components should remain purely presentational. Complex interactions, form states, dialog toggles, and mutations are moved into dedicated custom hooks (`useNavigationSidebar`, `useIssueDetailState`, `useComposer`).
- Zustand SSR Hydration Safety: When consuming persisted Zustand stores, avoid hydration mismatches by tracking rehydration state (via local `hasHydrated` state in mounting components) and providing server-safe fallback defaults during initial render.

### 4) Error and Logging Conventions

- Error handling by layer:
  - Transport layer (`lib/api/api.ts`) raises typed `ApiRequestError` on non-2xx responses.
  - UI layer catches errors and triggers user feedback using Sonner toasts (`toast.error()`).
  - Gated routes invoke `notFound()` or Next.js `redirect()` from `proxy.ts`.
  - Mutation hooks implement `onError` rollbacks to restore optimistic cache states.
- Logging standards: Centralized logger in `lib/logger.ts` is used for application diagnostic logging. Sockets and API clients avoid logging sensitive tokens, credentials, or user payload data in production.

### 5) Testing Conventions

- Test file location & naming: Test files are co-located with their target source files following the `*.test.ts` naming format (e.g., `lib/ordering.test.ts`, `queries/workspace.test.ts`, `lib/cookies.test.ts`).
- Test runner: Vitest (`pnpm test`) executing 22 test suites and 83 unit/integration tests.
- Mocking strategy: Service APIs and external clients are mocked using Vitest's `vi.mock` utility (e.g. mocking `@/lib/api/workspace`), with `vi.clearAllMocks()` reset in `beforeEach` blocks.
- Type casting: Mocks utilize TypeScript typed casting or helper envelopes to prevent test runtime mismatches.

### 6) Evidence

- `eslint.config.mjs`
- `tsconfig.json`
- `package.json`
- `components.json`
- `vitest.config.ts`
- `lib/api/api.ts`
- `lib/api/api-config.ts`
- `lib/logger.ts`
- `lib/cookies.ts`
- `proxy.ts`
- `app/[locale]/layout.tsx`
- `components/canvas/board/BoardCanvas.tsx`
- `hooks/use-current-workspace.ts`
