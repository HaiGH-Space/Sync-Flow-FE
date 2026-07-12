# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area                | Value                                                     | Evidence                                                       |
| ------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| Primary language    | TypeScript / TSX                                          | `package.json`, `tsconfig.json`, `app/`, `components/`         |
| Runtime + version   | Next.js 16.2.9 and React 19.2.3; Node.js v18+ (v24.12.0 in local dev) | `package.json`, `next.config.ts`                               |
| Package manager     | pnpm                                                      | `pnpm-lock.yaml`, `pnpm-workspace.yaml`                        |
| Module/build system | Next.js App Router with TypeScript and ESLint flat config | `app/`, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json` |

### 2) Production Frameworks and Dependencies

| Dependency              | Version    | Role in system                      | Evidence                                                                             |
| ----------------------- | ---------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| `next`                  | `16.2.9`   | App framework and routing           | `package.json`                                                                       |
| `react` / `react-dom`   | `19.2.3`   | UI runtime                          | `package.json`                                                                       |
| `next-intl`             | `^4.8.2`   | Locale routing and translations     | `package.json`, `i18n/*`, `app/[locale]/*`                                           |
| `@tanstack/react-query` | `^5.90.20` | Server state, caching, invalidation | `package.json`, `components/ui/query-provider.tsx`, `queries/*`, `hooks/mutations/*` |
| `@dnd-kit/react`        | `^0.3.2`   | Drag and drop UI react integration  | `package.json`, `components/canvas/board/*`                                          |
| `@dnd-kit/dom`          | `^0.3.2`   | Drag and drop DOM event handlers    | `package.json`, `components/canvas/board/*`                                          |
| `socket.io-client`      | `^4.8.1`   | Realtime chat connection            | `package.json`, `lib/api/chat.ts`                                                    |
| `zustand`               | `^5.0.11`  | Client UI state store               | `package.json`, `lib/store/use-dashboard.ts`                                         |
| `sonner`                | `^2.0.7`   | Toast notifications                 | `package.json`, `components/ui/sonner.tsx`, `components/dashboard/layout/*`          |
| `@tanstack/react-table` | `^8.21.3`  | Tabular UI data rendering           | `package.json`, `components/canvas/backlog/*`                                        |
| `@tanstack/react-form`  | `^1.28.0`  | Form state and validation           | `package.json`, `components/dashboard/comp/*`                                        |
| `zod`                   | `^4.3.6`   | Schema validation                   | `package.json`, `components/dashboard/comp/*`                                        |
| `framer-motion`         | `^12.40.0` | Motion animations                   | `package.json`, `components/dashboard/layout/NavigationSidebar.tsx`                  |
| `date-fns`              | `^4.1.0`   | Date formatting and manipulation    | `package.json`, `lib/format-date.ts`                                                 |
| `class-variance-authority`| `^0.7.1` | Component style variant management  | `package.json`, `components/ui/button-variants.ts`                                   |
| `clsx`                  | `^2.1.1`   | Conditional CSS class builders      | `package.json`, components under `components/`                                       |
| `emojilib`              | `^4.0.3`   | Emoji dictionary dataset           | `package.json`, `components/dashboard/chat/EmojiPicker.tsx`                          |
| `next-themes`           | `^0.4.6`   | Light/dark mode provider & hooks    | `package.json`, `components/ui/theme-provider.tsx`                                   |
| `radix-ui`              | `^1.4.3`   | Accessible UI primitives package    | `package.json`, components under `components/ui/`                                    |
| `react-day-picker`      | `^9.14.0`  | Date picking interface component    | `package.json`, `components/ui/calendar.tsx`                                         |
| `shadcn`                | `^3.8.2`   | CLI orchestrator metadata wrapper   | `package.json`, `components.json`                                                    |
| `tailwind-merge`        | `^3.4.0`   | Dynamic class conflict merging      | `package.json`, `lib/utils.ts`                                                       |
| `tw-animate-css`        | `^1.4.0`   | Standard CSS keyframe animation set | `package.json`, `app/globals.css`                                                    |

### 3) Development Toolchain

| Tool                            | Purpose                      | Evidence                             |
| ------------------------------- | ---------------------------- | ------------------------------------ |
| `eslint`                        | Linting                      | `package.json`, `eslint.config.mjs`  |
| `eslint-config-next`            | Next.js lint rules           | `package.json`, `eslint.config.mjs`  |
| `typescript`                    | Type checking                | `package.json`, `tsconfig.json`      |
| `@tanstack/eslint-plugin-query` | Query-specific lint rules    | `package.json`, `eslint.config.mjs`  |
| `@tailwindcss/postcss`          | Tailwind PostCSS integration | `package.json`, `postcss.config.mjs` |
| `tailwindcss`                   | Tailwind CSS v4 framework    | `package.json`, `postcss.config.mjs` |
| `babel-plugin-react-compiler`   | React Compiler support       | `package.json`, `next.config.ts`     |
| `vitest`                        | Unit/integration test runner | `package.json`, `vitest.config.ts`   |

### 4) Key Commands

```bash
pnpm dev      # Starts Next.js development server
pnpm build    # Compiles production Next.js build
pnpm start    # Starts compiled Next.js production server
pnpm lint     # Runs ESLint static analysis
pnpm test     # Runs Vitest unit and integration test suite
pnpm doctor   # Runs React Doctor codebase diagnostics
pnpm audit    # Runs production security vulnerability auditing
```

### 5) Environment and Config

- Config sources: `next.config.ts`, `proxy.ts`, `lib/api/api-config.ts`, `i18n/routing.ts`, `i18n/request.ts`, `tsconfig.json`, `components.json`, `eslint.config.mjs`, `vitest.config.ts`
- Required env vars: `NEXT_PUBLIC_API_URL` (backend API endpoint, defaults to `http://localhost:8000`), `VERCEL_URL` [provided by deployment environment]
- Runtime cookies: `session_token` is read by `proxy.ts`, `lib/api/chat.ts`, and `lib/api/notification.ts`
- Deployment/runtime constraints: locale-aware routing is active for `en` and `vi`; API requests are routed through `/api-proxy`
- The environment variable template is documented in `.env.example` at the workspace root.

### 6) Evidence

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `components.json`
- `vitest.config.ts`
- `i18n/routing.ts`
- `proxy.ts`
- `lib/api/api-config.ts`
- `lib/api/api.ts`
- `lib/api/chat.ts`
