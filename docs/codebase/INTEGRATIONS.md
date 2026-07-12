# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System                  | Type (API/DB/Queue/etc)  | Purpose                                                                  | Auth model                                                             | Criticality | Evidence                                                       |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| Backend app API         | API                      | Workspaces, projects, issues, columns, sprints, comments, uploads, users | Cookie-based session via `session_token`; requests include credentials | High        | `lib/api/api.ts`, `next.config.ts`, `proxy.ts`, `lib/api/*.ts` |
| Socket.IO chat endpoint | API / realtime socket    | Channel joins and message delivery                                       | `session_token` cookie / socket auth payload                           | High        | `lib/api/chat.ts`                                              |
| Socket.IO notifications | API / realtime socket    | Realtime workspace invites and user notifications                        | `session_token` cookie / socket auth payload                           | High        | `lib/api/notification.ts`                                      |
| Locale message bundles  | Internal content loading | `en` and `vi` translation bundles loaded by `next-intl`                  | N/A                                                                    | Medium      | `i18n/request.ts`, `i18n/en/*`, `i18n/vi/*`                    |

### 2) Data Stores

| Store                             | Role                                                | Access layer                                                         | Key risk                                                           | Evidence                                                |
| --------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| Browser cookie `session_token`    | Session identity for protected routes, chat & notifications | `proxy.ts`, `lib/api/chat.ts`, `lib/api/notification.ts`        | If cookie handling changes, routing and socket auth can fail       | `proxy.ts`, `lib/api/chat.ts`, `lib/api/notification.ts`|
| React Query cache                 | Server-state cache for fetched resources            | `components/ui/query-provider.tsx`, `queries/*`, `hooks/mutations/*` | Stale cache after writes if invalidation paths drift. Parameterized paginated query keys (e.g. `['issues', projectId, { page, limit }]`) are correctly invalidated when the prefix `['issues', projectId]` is invalidated by mutations | `components/ui/query-provider.tsx`, `hooks/mutations/*` |
| Zustand persisted dashboard state | Client UI state across navigations                  | `lib/store/use-dashboard.ts`                                         | Persisted UI state can become stale after route or feature changes | `lib/store/use-dashboard.ts`                            |
| LocalStorage via Zustand persist  | Storage backend for dashboard state                 | `lib/store/use-dashboard.ts`                                         | Browser storage can be reset or blocked                            | `lib/store/use-dashboard.ts`                            |

### 3) Secrets and Credentials Handling

- Credential sources: `NEXT_PUBLIC_API_URL` is read from the environment and resolved centrally by `lib/api/api-config.ts`; `VERCEL_URL` is used when present on the server; `session_token` is read from cookies
- Hardcoding checks: no secret values were found in the scanned source; `.env.example` is provided in the workspace root
- Rotation or lifecycle notes: Session cookies are managed and rotated by the backend; the frontend reads the session token for WebSocket authentication and route protection but does not handle rotation directly

### 4) Reliability and Failure Behavior

- Retry/backoff behavior: React Query retries queries twice by default in `components/ui/query-provider.tsx`
- Timeout policy: No explicit request timeout is set in the client-side fetch wrapper (relies on browser default timeouts)
- Circuit-breaker or fallback behavior: None implemented in the client wrapper; relies on React Query query retries and cache fallbacks
- Failure handling: `lib/api/api.ts` parses non-OK responses and throws `ApiRequestError`; UI layers show toasts or empty/error states

### 5) Observability for Integrations

- Logging around external calls: `next.config.ts` logs API rewrite targets; `lib/api/chat.ts` and `lib/api/notification.ts` log socket state in development
- Metrics/tracing coverage: No client-side APM or tracing configured
- Missing visibility gaps: No dedicated metrics, tracing, or structured log pipeline was found in the workspace

### 6) Evidence

- `lib/api/api-config.ts`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `lib/api/notification.ts`
- `lib/api/workspace.ts`
- `lib/api/issue.ts`
- `lib/api/channel.ts`
- `next.config.ts`
- `proxy.ts`
- `components/ui/query-provider.tsx`
- `lib/store/use-dashboard.ts`
- `i18n/request.ts`
