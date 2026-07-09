# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item               | Rule                                                                                             | Example                                                                                  | Evidence                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Files              | Feature components use PascalCase; utilities use lowercase or kebab-case                         | `BoardCanvas.tsx`, `format-date.ts`, `use-dashboard.ts`                                  | `components/canvas/board/BoardCanvas.tsx`, `lib/format-date.ts`, `lib/store/use-dashboard.ts` |
| Functions/methods  | Hooks use `use*`; query factories use `create*QueryOptions`; service methods describe the action | `useCurrentWorkspace`, `createWorkspaceDetailQueryOptions`, `getWorkspaceMembersProfile` | `hooks/use-current-workspace.ts`, `queries/workspace.ts`, `lib/api/member-workspace.ts`       |
| Types/interfaces   | PascalCase for exported types and interfaces                                                     | `Workspace`, `ApiResponse`, `BoardCanvasProps`                                           | `lib/api/workspace.ts`, `lib/api/api.ts`, `components/canvas/board/BoardCanvas.tsx`           |
| Constants/env vars | Uppercase constants, env vars use `NEXT_PUBLIC_*` or platform-provided names                     | `API_PREFIX`, `NEXT_PUBLIC_API_URL`, `VERCEL_URL`                                        | `lib/api/api.ts`, `next.config.ts`                                                            |

### 2) Formatting and Linting

- Formatter: no standalone formatter config was found in the workspace; Tailwind and component styling are driven by `app/globals.css` and `components.json`
- Linter: ESLint flat config in `eslint.config.mjs` using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Most relevant enforced rules: Next.js core-web-vitals defaults, TypeScript rules, `strict: true` in `tsconfig.json`
- Run commands: `pnpm lint`, `pnpm build`

### 3) Import and Module Conventions

- Import grouping/order: imports are generally grouped by package, then local aliases, though the workspace shows mixed formatting styles across files
- Alias vs relative import policy: `@/*` is the main alias for cross-root imports; relative imports are used inside feature folders
- Public exports/barrel policy: feature modules sometimes export a service or hook object directly (`workspaceService`, `columnKeys`, `useDashboard`); no repo-wide barrel export rule was found

### 4) Error and Logging Conventions

- Error strategy by layer: `lib/api/api.ts` throws `ApiRequestError` on non-OK responses; UI layers show errors with `toast.error`; route gating uses `notFound()` or `redirect()`; mutation hooks invalidate or restore cache on success/error
- Logging style and required context fields: `lib/api/api.ts` and `lib/api/chat.ts` use `console.log`/`console.debug` in runtime paths, mostly for rewrite and socket diagnostics
- Sensitive-data redaction rules: Sockets and API services avoid logging credentials or payload contents. Socket connection diagnostic logs are restricted to development mode and do not record raw token payloads.

### 5) Testing Conventions

- Test file naming/location rule: Test files are co-located with source files under test (e.g., `lib/ordering.test.ts`, `queries/workspace.test.ts`), following the `*.test.ts` naming convention. Runs via Vitest (`pnpm test`).
- Mocking strategy norm: Mocking API calls and services using Vitest's `vi.mock` utility (e.g., mocking `@/lib/api/workspace`).
- Coverage expectation: No coverage thresholds are currently enforced on the frontend; validation is driven by lint, build pipelines, and manual test execution.

### 6) Evidence

- `eslint.config.mjs`
- `tsconfig.json`
- `package.json`
- `components.json`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `proxy.ts`
- `app/[locale]/layout.tsx`
- `components/canvas/board/BoardCanvas.tsx`
- `hooks/use-current-workspace.ts`
- `vitest.config.ts`
