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

- Main mocking approach: Utilizes Vitest's built-in `vi.mock` to mock external API service modules (e.g., `@/lib/api/workspace`) and control their resolved/rejected promise responses.
- Isolation guarantees: Mocks are cleared before each test case run using `vi.clearAllMocks()` inside a `beforeEach` hook.
- Common failure mode in tests: Typing mismatch when mocking service responses (mitigated by using `vi.mocked` utility and casting mock responses to appropriate envelopes).

### 5) Coverage and Quality Signals

- Coverage tool + threshold: None configured.
- Current reported coverage: N/A
- Known gaps/flaky areas: No automated test pipeline runs on frontend code; visual regression and state edge-cases must be checked manually.

### 6) Evidence

- `package.json`
- `vitest.config.ts`
- `lib/ordering.test.ts`
- `queries/workspace.test.ts`
