# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: Vitest
- Assertion/mocking tools: Vitest (built-in assertions and mocking utilities)
- Commands:

```bash
pnpm test
pnpm lint
pnpm build
```

### 2) Test Layout

- Test file placement pattern: Co-located with the source files being tested (e.g. `lib/ordering.test.ts`, `queries/workspace.test.ts`).
- Naming convention: `*.test.ts`
- Setup files and where they run: Configured in `vitest.config.ts`.

### 3) Test Scope Matrix

| Scope       | Covered? | Typical target                        | Notes                                                              |
| ----------- | -------- | ------------------------------------- | ------------------------------------------------------------------ |
| Unit        | Yes      | Pure helpers and state logic          | Test suite configured using Vitest; unit tests run via `pnpm test`. |
| Integration | Yes      | API wrappers and query/mutation flows | Query options configured and verified by unit tests mocking the service layers. |
| E2E         | No       | Route and dashboard interactions      | Verified by developer manual testing of the Next.js routes.        |

### 4) Mocking and Isolation Strategy

- Main mocking approach: N/A
- Isolation guarantees: N/A
- Common failure mode in tests: N/A

### 5) Coverage and Quality Signals

- Coverage tool + threshold: None configured.
- Current reported coverage: N/A
- Known gaps/flaky areas: No automated test pipeline runs on frontend code; visual regression and state edge-cases must be checked manually.

### 6) Evidence

- `package.json`
- `eslint.config.mjs`
- `pnpm-lock.yaml`
