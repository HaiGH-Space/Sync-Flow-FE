# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System                  | Type (API/DB/Queue/etc)  | Purpose                                                                  | Auth model                                                             | Criticality | Evidence                                                                            |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| Backend REST API        | HTTP API                 | Workspaces, projects, issues, columns, sprints, comments, uploads, users | Cookie-based session via `session_token`; requests include credentials | High        | `lib/api/api.ts`, `lib/api/api-config.ts`, `next.config.ts`, `proxy.ts`, `lib/api/*` |
| Socket.IO chat endpoint | Realtime WebSocket       | Realtime channel join, presence, and chat message delivery               | `session_token` cookie / explicit socket auth payload                  | High        | `lib/api/chat.ts`, `hooks/chat/use-chat-channel.ts`                                  |
| Socket.IO notifications | Realtime WebSocket       | Realtime workspace invites and user activity alerts                      | `session_token` cookie / explicit socket auth payload                  | High        | `lib/api/notification.ts`, `hooks/notifications/use-notification-channel.ts`        |
| LiveKit Cloud / WebRTC  | WebRTC / Audio-Video API | Realtime channel audio & video call sessions                             | LiveKit room JWT token retrieved via backend API (`session_token`)     | Medium      | `components/call/*`, `hooks/use-video-call.ts`, `lib/api/video.ts`                  |
| Locale message bundles  | Internal content loading | Bilingual translation bundles (`en` and `vi`) loaded via `next-intl`    | N/A                                                                    | Medium      | `i18n/request.ts`, `i18n/en/*`, `i18n/vi/*`                                         |

### 2) Data Stores

| Store                             | Role                                                        | Access layer                                                         | Key risk                                                           | Evidence                                                  |
| --------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| Browser cookie `session_token`    | Session identity for protected routes, chat & notifications | `proxy.ts`, `lib/api/chat.ts`, `lib/api/notification.ts`             | If cookie handling changes, routing and socket auth can fail       | `proxy.ts`, `lib/api/chat.ts`, `lib/cookies.ts`           |
| React Query cache                 | Server-state cache for fetched resources                    | `components/ui/query-provider.tsx`, `queries/*`, `hooks/mutations/*` | Stale cache after writes if invalidation keys drift                | `components/ui/query-provider.tsx`, `hooks/mutations/*`   |
| Zustand persisted dashboard state | Client UI state across navigations                          | `lib/store/use-dashboard.ts`                                         | Persisted UI state can become stale after route or feature changes | `lib/store/use-dashboard.ts`                              |
| Zustand persisted call state      | Active call state, participant status, room metadata        | `lib/store/use-call-store.ts`                                        | Call state out-of-sync if session terminates unexpectedly          | `lib/store/use-call-store.ts`, `hooks/use-video-call.ts`   |
| LocalStorage via Zustand persist  | Storage backend for dashboard and call state persistence    | `lib/store/use-dashboard.ts`, `use-call-store.ts`                     | Browser storage can be reset or blocked                            | `lib/store/use-dashboard.ts`, `lib/store/use-call-store.ts` |

### 3) Secrets and Credentials Handling

- Credential sources: `NEXT_PUBLIC_API_URL` is read from environment variables; `INTERNAL_API_URL` is used for SSR backend communication in internal networks; `VERCEL_URL` is used on Vercel deployments; `session_token` is read from browser cookies.
- Hardcoding verification: No static secrets, API tokens, or hardcoded passwords exist in git-tracked code. `.env.example` provides the environment configuration baseline.
- Automated secret scanning: GitHub Actions workflow `.github/workflows/security.yml` runs Gitleaks across full repository git history on pushes and pull requests to `master`.

### 4) Reliability and Failure Behavior

- Query retry policy: TanStack Query automatically retries failed queries twice by default in `components/ui/query-provider.tsx`.
- WebSocket reconnection: Socket.IO client handles reconnection attempts automatically with exponential backoff.
- Error handling: `lib/api/api.ts` parses non-OK responses and throws structured `ApiRequestError`; UI components present actionable toast notifications and error boundaries.

### 5) Observability and CI Workflows

- Logging: Centralized `lib/logger.ts` outputs debug information in development while suppressing credentials in production.
- CI automated testing: `.github/workflows/test.yml` executes `pnpm test` across all 22 test suites on pushes/PRs to `master`.
- Security auditing: `.github/workflows/security.yml` runs Gitleaks secret detection on all commits.
- Architecture auditing: `.github/workflows/react-doctor.yml` validates React performance patterns.

### 6) Evidence

- `lib/api/api-config.ts`
- `lib/api/api.ts`
- `lib/api/chat.ts`
- `lib/api/notification.ts`
- `lib/api/video.ts`
- `components/call/GlobalCallProvider.tsx`
- `hooks/use-video-call.ts`
- `.github/workflows/test.yml`
- `.github/workflows/security.yml`
- `.github/workflows/react-doctor.yml`
- `proxy.ts`
- `components/ui/query-provider.tsx`
- `lib/store/use-dashboard.ts`
- `lib/store/use-call-store.ts`
