# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: [TODO] no test framework was found in `package.json` or the workspace tree
- Assertion/mocking tools: [TODO]
- Commands:

```bash
pnpm lint
pnpm build
[TODO] no test command is configured
```

### 2) Test Layout

- Test file placement pattern: [TODO] no test files or `tests`/`__tests__`/`spec` directories were found
- Naming convention: [TODO]
- Setup files and where they run: [TODO]

### 3) Test Scope Matrix

| Scope       | Covered?          | Typical target                        | Notes  |
| ----------- | ----------------- | ------------------------------------- | ------ |
| Unit        | No evidence found | Pure helpers and state logic          | [TODO] |
| Integration | No evidence found | API wrappers and query/mutation flows | [TODO] |
| E2E         | No evidence found | Route and dashboard interactions      | [TODO] |

### 4) Mocking and Isolation Strategy

- Main mocking approach: [TODO]
- Isolation guarantees: [TODO]
- Common failure mode in tests: [TODO]

### 5) Coverage and Quality Signals

- Coverage tool + threshold: [TODO]
- Current reported coverage: [TODO]
- Known gaps/flaky areas: [TODO]

### 6) Evidence

- `package.json`
- `eslint.config.mjs`
- `pnpm-lock.yaml`
