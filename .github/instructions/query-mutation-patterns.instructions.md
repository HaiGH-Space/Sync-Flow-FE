---
description: "Use when working on queries, mutations, API service wrappers, or cache invalidation in the React Query layer."
applyTo: "{queries/**/*.ts,hooks/mutations/**/*.ts,lib/api/**/*.ts}"
---

Use the existing React Query and API patterns in this repo.

- Keep query keys in `queries/*` as exported key objects, not raw strings.
- Keep query fetch/setup in `create*QueryOptions` helpers, including `staleTime` and any `select` logic.
- Keep writes in `hooks/mutations/*`; after a mutation, `await` cache invalidation before returning.
- Invalidate the broad resource key first, then any narrower detail keys that need a refresh.
- Keep HTTP transport and per-resource service objects in `lib/api/*`; do not call `fetch` directly from components.
- When a resource changes, update the service wrapper, query factory, and invalidation path together.

See [docs/codebase/ARCHITECTURE.md](docs/codebase/ARCHITECTURE.md), [docs/codebase/CONVENTIONS.md](docs/codebase/CONVENTIONS.md), and [docs/codebase/INTEGRATIONS.md](docs/codebase/INTEGRATIONS.md) for the deeper conventions.
