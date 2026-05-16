# AGENTS.md

This project is a Next.js 16 app with App Router, `next-intl`, React Query, Zustand, and feature-oriented UI layers. Keep changes narrow and follow the existing boundaries.

## Working Rules

- Prefer the existing app structure under [app/](app) and [components/](components); do not flatten or reorganize folders unless the task requires it.
- Use [lib/api/](lib/api) and the `/api-proxy` rewrite path from [next.config.ts](next.config.ts) for backend calls. Do not hardcode direct backend URLs in client code.
- Keep locale-aware work inside [app/[locale]/](app/%5Blocale%5D) and the matching [i18n/](i18n) files for `en` and `vi`.
- Treat [queries/](queries) as query-option factories and [hooks/mutations/](hooks/mutations) as the mutation layer. Invalidate the relevant query keys after mutations.
- Respect sparse ordering in dashboard board flows. The board uses 1000-step spacing and rebalancing rather than index-based order updates.
- Use the shared UI primitives in [components/ui/](components/ui) and existing feature components before introducing new abstractions.
- Keep form state in `@tanstack/react-form` + `zod`; do not introduce a second form library.
- Keep persisted dashboard UI state in [lib/store/](lib/store); do not move UI-only state into React Query.
- Keep realtime chat/socket behavior in [lib/api/chat.ts](lib/api/chat.ts); auth depends on the `session_token` cookie.
- Let API failures surface as `ApiRequestError` and handle them in the UI with the existing toast/error patterns.
- Prefer query-key objects and query-option factories in [queries/](queries); do not use raw string keys or ad hoc fetch logic.
- In mutations, invalidate the broad cache keys that own the resource, then any narrower keys that need a refresh.

## Implementation Patterns

- Query modules export `*Keys` objects and `create*QueryOptions` helpers; keep stale-time and `select` behavior inside those factories.
- Service modules in [lib/api/](lib/api) export a small service object per resource and share transport through [lib/api/api.ts](lib/api/api.ts).
- Board drag and reorder logic should stay optimistic and use [lib/ordering.ts](lib/ordering.ts) helpers rather than calculating order inline.
- Route files should stay thin: compose layouts and redirects in [app/](app), but keep data access in queries, mutations, and API modules.

## Validation

- `pnpm lint`
- `pnpm build`

Use `pnpm dev` for local runtime checks when a change affects routing, auth, i18n, or client-side behavior.

## Key Files

- [package.json](package.json) for scripts and package manager conventions.
- [next.config.ts](next.config.ts) for `next-intl`, React Compiler, and API rewrites.
- [components.json](components.json) for shadcn and styling defaults.
- [lib/ordering.ts](lib/ordering.ts) for sparse ordering helpers.
- [i18n/routing.ts](i18n/routing.ts) and [i18n/request.ts](i18n/request.ts) for locale routing.
- [docs/codebase/ARCHITECTURE.md](docs/codebase/ARCHITECTURE.md) for layer boundaries and request flow.
- [docs/codebase/CONVENTIONS.md](docs/codebase/CONVENTIONS.md) for naming, imports, and error conventions.
- [docs/codebase/STRUCTURE.md](docs/codebase/STRUCTURE.md) for top-level module organization.
- [docs/codebase/STACK.md](docs/codebase/STACK.md) for runtime and validation commands.
- [docs/codebase/INTEGRATIONS.md](docs/codebase/INTEGRATIONS.md) for backend, socket, and cache behavior.
- [docs/codebase/CONCERNS.md](docs/codebase/CONCERNS.md) for high-risk areas before touching board or auth flows.

## Notes For Agents

- Prefer linked docs and source files over repeating implementation details.
- If a task touches board ordering, chat, or query invalidation, check nearby existing patterns before editing.
- Keep edits aligned with the current React Compiler and Next.js conventions already used in the repo.
