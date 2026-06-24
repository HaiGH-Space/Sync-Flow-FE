# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: None configured for the frontend workspace. (Note: The adjacent `be` backend workspace uses NestJS and Jest).
- Assertion/mocking tools: None on the frontend.
- Commands:

```bash
pnpm lint
pnpm build
```

### 2) Test Layout

- Test file placement pattern: No test files or directories are present in the frontend workspace.
- Naming convention: N/A
- Setup files and where they run: N/A

### 3) Test Scope Matrix

| Scope       | Covered? | Typical target                        | Notes                                                              |
| ----------- | -------- | ------------------------------------- | ------------------------------------------------------------------ |
| Unit        | No       | Pure helpers and state logic          | No frontend suite; backend unit tests are run via `pnpm test` in the `be` directory. |
| Integration | No       | API wrappers and query/mutation flows | Verified via local run tests and manual staging checks.           |
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
