# Sync Flow Product & Engineering Roadmap (TASK.md)

This document establishes the comprehensive engineering roadmap for **Sync Flow**. It addresses all identified functional deficiencies, incomplete implementations, usability gaps, and redundant architectural patterns across the frontend application.

Each roadmap item details:
1. **Reason for the Deficiency**: The root architectural or implementation cause in the codebase.
2. **Rationale for Addressing It**: The operational impact on users and alignment with product goals.
3. **Expected Outcome of the Resolution**: The target end-state, including technical and UX behaviors.
4. **Essentiality**: The priority tier (**Essential [P0]**, **High [P1]**, **Medium [P2]**, or **Low [P3]**).

---

## Roadmap Phasing Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Critical Core & Real-Time Sync (Essential - P0)               │
│ • Real-time board WebSocket sync    • Add Column UI action             │
│ • Issue Detail status/sprint edits  • Backlog pagination fix           │
│ • Chat file upload pipeline & composer repair                          │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Workflow Completeness & Team Productivity (High - P1)         │
│ • Global "+ Create Issue" action    • Board search & quick filters     │
│ • Full sprint lifecycle (Start/End) • Actionable notifications engine  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Experience Modernization & Synthesis (Medium - P2)            │
│ • Unified Backlog & Sprint Planning • Markdown editor & issue metadata │
│ • Draggable PiP video call overlay  • Interactive Gantt roadmap        │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Power Tools & Quality Polish (Low - P3)                       │
│ • Global Command Palette (Cmd+K)    • Ghost UI & dead icon purge       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Critical Core & Real-Time Sync (Essential - P0)

### 1. Real-Time Kanban Board Synchronization

- **Reason for the Deficiency**:
  - WebSocket infrastructure in `lib/api/` currently only supports `/chat` (`lib/api/chat.ts`) and `/notifications` (`lib/api/notification.ts`).
  - The Kanban canvas (`components/canvas/board/BoardCanvas.tsx`), column queries (`queries/column.ts`), and issue queries (`queries/issue.ts`) rely exclusively on HTTP requests. If User A moves, edits, or adds an issue, User B's board never reflects the change until a full page reload or browser tab refocus occurs.
- **Rationale for Addressing It**:
  - The application's core brand promise is *"Sync anything, anywhere, with anyone."* A collaborative project management workspace without real-time board updates forces concurrent team members into race conditions, conflicting card moves, and out-of-sync sprint standups.
- **Expected Outcome of the Resolution**:
  - Establish a WebSocket channel for project canvas events (`issue_created`, `issue_moved`, `issue_updated`, `issue_deleted`, `column_created`, `column_updated`, `column_deleted`).
  - Incoming socket messages immediately patch the local TanStack Query cache without triggering jarring full-page refetches.
  - Implement smooth optimistic UI animations when remote card reorders are received.
- **Essentiality**: **Essential (P0)** — Fundamental to the product's identity and collaborative utility.

---

### 2. Missing Board Column Creation Action in UI

- **Reason for the Deficiency**:
  - The backend REST endpoint and client transport method `createColumn` exist in `lib/api/column.ts`, but there is **no mutation hook** in `hooks/mutations/column.ts` and **no button or modal** in `BoardCanvas.tsx` or `KanbanColumn.tsx`. Users can edit column names or delete columns, but cannot create new columns.
- **Rationale for Addressing It**:
  - Agile teams have varying workflows (e.g., "Backlog" -> "In Dev" -> "In QA" -> "Staging" -> "Done"). Forcing teams into a static, immutable set of columns severely impairs adoption for non-standard software workflows.
- **Expected Outcome of the Resolution**:
  - Implement `useCreateColumnMutation` under `hooks/mutations/column.ts` with cache invalidation for `columnKeys.list(projectId)`.
  - Add an "+ Add Column" card/button at the horizontal end of the column list in `BoardCanvas.tsx`.
  - Provide an inline input or modal calculating the next sparse midpoint order (`order = maxOrder + 1000`) and submitting the new column.
- **Essentiality**: **Essential (P0)** — Core CRUD capability missing from the primary interface.

---

### 3. Status and Sprint Transition Controls Inside Issue Detail Dialog

- **Reason for the Deficiency**:
  - In `components/dashboard/comp/issue-detail/IssueSidebarSection.tsx`, the issue's column is displayed as an immutable badge (`<Badge variant="secondary">{statusName}</Badge>`).
  - Furthermore, the issue's assigned `sprintId` is omitted from both the state model and presentation layer of `IssueDetailDialog.tsx`.
  - The only way to move an issue's column is dragging on the Kanban board; the only way to assign a sprint is dragging in the Planning canvas.
- **Rationale for Addressing It**:
  - When reviewing an issue's description, logs, or comments in the modal, team members frequently need to change its status (e.g., from "In Progress" to "In Review") or assign it to an upcoming sprint. Requiring the user to exit the modal, switch views, and hunt for the card is a major UX friction point.
- **Expected Outcome of the Resolution**:
  - Replace the static status badge with an interactive `<Select>` populated from project columns (`createColumnsQueryOptions`).
  - Add a Sprint `<Select>` dropdown in `IssueSidebarSection.tsx` populated with project sprints (`createSprintsQueryOptions`) including a "None / Backlog" option.
  - Dispatch updates via `useUpdateIssue` on selection change with optimistic UI feedback and toast confirmation.
- **Essentiality**: **Essential (P0)** — Primary ticket management requirement.

---

### 4. Backlog Canvas Server-Side Pagination & Filtering Mismatch

- **Reason for the Deficiency**:
  - In `components/canvas/backlog/index.tsx`, the query calls `createIssuesQueryOptions({ projectId, page, limit })` with page size 10, retrieving an arbitrary slice of project issues without passing `sprintId`.
  - The component then performs **client-side filtering** on that 10-item slice (`filteredBySprint`, `!doneColumnIds.has(...)`). If all 10 items on page 1 belong to other sprints or done columns, the table displays 0 items even when hundreds of matching issues exist on later pages.
- **Rationale for Addressing It**:
  - Completely breaks backlog management for any project containing more than 10 issues, making sprint planning, triage, and filtering unusable.
- **Expected Outcome of the Resolution**:
  - Update `createIssuesQueryOptions` and the backend service `getIssuesByProjectId` to accept `sprintId`, `columnId`, `excludeDone`, `priority`, and `search` query parameters.
  - Delegate filtering and pagination entirely to the server, ensuring table counts, pages, and pagination buttons accurately reflect true matching records.
- **Essentiality**: **Essential (P0)** — Critical functional bug in data retrieval.

---

### 5. Chat File/Image Upload Pipeline and Dead Composer Buttons

- **Reason for the Deficiency**:
  - In `components/dashboard/chat/Composer.tsx`, the image picker sets a local preview, but `useComposer`'s `handleSend` passes `(content, selectedImage)` to `useChatChannel`'s `sendMessage`, which signature-wise **only accepts `(content: string)`**, silently discarding the file.
  - `MessageBubble.tsx` only renders `<p>{message.content}</p>` and has no structure for attachments or images.
  - The Paperclip, Sticker, and Microphone icons in `Composer.tsx` have no click handlers or functionality.
- **Rationale for Addressing It**:
  - Engineering and design teams rely heavily on sharing screenshots, wireframes, and error logs directly in channel chats. Silently discarding a user's attached image after showing a preview creates user confusion and data loss.
- **Expected Outcome of the Resolution**:
  - Connect `uploadService.uploadFile` inside `useChatChannel.ts` when a file/image is present before emitting `send_message`.
  - Pass the returned media URL and file metadata in the socket payload.
  - Update `MessageBubble.tsx` to render responsive image previews with lightbox/zoom support and downloadable file attachments.
  - Remove dead buttons (Sticker, Mic) or mark them disabled with an informative tooltip until implemented. Wire the Paperclip button to the file input.
- **Essentiality**: **Essential (P0)** — Eliminates data-loss bug and fixes broken UI affordances.

---

## Phase 2: Workflow Completeness & Team Productivity (High - P1)

### 6. Global "+ Create Issue" Action in Dashboard Header

- **Reason for the Deficiency**:
  - Issue creation is currently bound exclusively to `KanbanColumn.tsx` through `CreateIssueModal.tsx`.
  - If a user is on the Backlog view, Timeline view, Channel chat, or Workspace settings, there is no way to create an issue without navigating to the Board view and locating a specific column.
- **Rationale for Addressing It**:
  - Capturing bugs, tasks, or user feedback should be immediate. Friction in task capture leads to forgotten tickets and disrupted focus.
- **Expected Outcome of the Resolution**:
  - Place a persistent "+ New Issue" button in the global dashboard header (`DashboardHeader.tsx`) and support a global keyboard shortcut (`C`).
  - Render a unified `CreateIssueModal` capable of selecting the target Project, Column, Sprint, Priority, and Assignee from any route.
- **Essentiality**: **High (P1)** — Standard core navigation requirement across all project management platforms.

---

### 7. Kanban Board Quick Filters and Search Toolbar

- **Reason for the Deficiency**:
  - `BoardCanvas.tsx` renders raw columns and cards without any search input, priority filter, or assignee filter.
  - While `BacklogTableToolbar.tsx` has filtering controls for the backlog table, the board has none.
- **Rationale for Addressing It**:
  - As projects grow past 20–30 cards, finding relevant tickets during daily standups becomes overwhelming without quick filtering options like "Assigned to Me".
- **Expected Outcome of the Resolution**:
  - Introduce a `BoardToolbar` component above the columns in `BoardCanvas.tsx`.
  - Include:
    - Text search input (matching issue titles and numbers).
    - "My Issues" quick toggle button.
    - Priority multiselect filter (High, Medium, Low).
    - Member avatar filter row.
  - Apply pure filtering logic without affecting drag-and-drop midpoint order integrity.
- **Essentiality**: **High (P1)** — Vital for board usability on production-scale projects.

---

### 8. Full Sprint Lifecycle Management (Start, Complete, Delete)

- **Reason for the Deficiency**:
  - In `lib/api/sprint.ts`, `Sprint` status can be `'PLANNED' | 'ACTIVE' | 'COMPLETED'`, but `CreateSprint` and `UpdateSprint` type definitions omit `status`.
  - Sprints remain permanently in the `PLANNED` state.
  - The API client exposes `deleteSprint`, but it is not wrapped in a mutation hook or exposed in any UI menu.
- **Rationale for Addressing It**:
  - Agile teams run in timeboxed iterations. Without starting a sprint (activating its scope) and completing a sprint (calculating velocity and rolling over unfinished work), sprint tracking is non-functional.
- **Expected Outcome of the Resolution**:
  - Add `startSprint` and `completeSprint` API endpoints and mutation hooks.
  - Provide a "Start Sprint" button that validates dates and sets `status: 'ACTIVE'`.
  - Provide a "Complete Sprint" dialog that summarizes completed vs. incomplete issues, prompting the user to move unfinished tasks to the Backlog or the next planned sprint.
  - Add a "Delete Sprint" option with a confirmation modal in `NavigationSidebarSprintList.tsx`.
- **Essentiality**: **High (P1)** — Required for genuine agile execution.

---

### 9. Actionable Multi-Type Notifications System

- **Reason for the Deficiency**:
  - In `lib/api/notification.ts`, the notification type is strictly typed as `export type NotificationType = "WORKSPACE_INVITE"`.
  - No notifications are generated or handled for ticket assignments, @mentions in messages/comments, or sprint status updates.
- **Rationale for Addressing It**:
  - Team members miss task assignments and critical discussions unless they manually check every ticket and channel.
- **Expected Outcome of the Resolution**:
  - Expand `NotificationType` to include:
    - `ISSUE_ASSIGNED`: Triggered when an issue is assigned to the current user.
    - `ISSUE_MENTIONED`: Triggered when `@username` is used in an issue description or comment.
    - `COMMENT_ADDED`: Triggered on new comments for issues the user created or is assigned to.
    - `SPRINT_STARTED`: Triggered when a new active sprint begins.
  - Display rich notification cards in `NotificationDropdown` with deep-links directly opening the referenced issue modal or chat channel.
- **Essentiality**: **High (P1)** — Essential for keeping distributed teams synchronized.

---

## Phase 3: Experience Modernization & Synthesis (Medium - P2)

### 10. Unified Backlog & Sprint Planning (Merge Standalone Planning Canvas)

- **Reason for the Deficiency**:
  - The app currently features two disconnected views: `BacklogCanvas` (a tabular list) and `PlanningCanvas` (a 2-column drag-and-drop between unassigned issues and one selected sprint).
  - The Planning canvas requires constantly toggling the global sprint dropdown in the sidebar to allocate issues to different sprints.
- **Rationale for Addressing It**:
  - Having two separate views for backlog triage and sprint planning is disjointed and confusing. Industry benchmarks (Jira, Linear) consolidate this into a single view containing collapsible Sprint containers above a Backlog pool.
- **Expected Outcome of the Resolution**:
  - Retire the standalone "Planning" view from `useDashboard` navigation items.
  - Modernize `BacklogCanvas` to display:
    - An "Active Sprint" collapsible card list.
    - "Upcoming Sprints" collapsible containers with sprint dates, story point sums, and "Start Sprint" triggers.
    - A "Backlog" unassigned pool at the bottom.
  - Enable direct drag-and-drop between sprint containers and the backlog pool.
- **Essentiality**: **Medium (P2)** — Significantly streamlines UX and removes redundant navigation paths.

---

### 11. Rich Text / Markdown Editor and Comprehensive Issue Metadata

- **Reason for the Deficiency**:
  - Issue descriptions and comments use basic `<Textarea>` elements (`IssueDescriptionSection.tsx`, `IssueCommentsSection.tsx`).
  - The `Issue` entity lacks essential delivery fields: `dueDate`, `labels`/`tags`, `storyPoints` estimation, and subtasks/checklists.
- **Rationale for Addressing It**:
  - Complex technical tasks require code formatting, numbered reproduction steps, acceptance criteria checklists, and clear categorization tags.
- **Expected Outcome of the Resolution**:
  - Integrate a lightweight Markdown/tiptap editor supporting code blocks, bold/italics, bullet lists, and task checkboxes.
  - Extend the `Issue` model and detail UI to support:
    - `dueDate`: Date picker with overdue highlighting.
    - `labels`: Color-coded tag chips with creation and filtering.
    - `storyPoints`: Numeric Fibonacci estimator.
    - `subtasks`: Inline checklist with completion progress bar.
- **Essentiality**: **Medium (P2)** — Transforms simple cards into fully expressive engineering specifications.

---

### 12. Draggable Floating Picture-in-Picture Video Call Overlay

- **Reason for the Deficiency**:
  - When a call is minimized (`isMinimized: true`), it is embedded in `SidebarCallWidget.tsx` inside the collapsible navigation sidebar.
  - If the user collapses the sidebar, uses a mobile viewport, or navigates away, controls are lost.
  - The minimized widget provides only audio icons without any participant video stream preview.
- **Rationale for Addressing It**:
  - During daily standups or design pair-programming, team members want to browse board tickets while keeping visual contact with the speaker's camera or screen share.
- **Expected Outcome of the Resolution**:
  - Move the minimized call container to a persistent, draggable floating Picture-in-Picture window rendered by `GlobalCallProvider.tsx` in the bottom-right viewport.
  - Render active speaker video track, participant count, mute/camera quick toggles, and an expand-to-fullscreen button.
- **Essentiality**: **Medium (P2)** — Delivers on the promised "floating overlay widget" design.

---

### 13. Interactive Gantt / Roadmap Timeline Evolution

- **Reason for the Deficiency**:
  - `TimelineCanvas.tsx` is currently a horizontal sprint card carousel showing progress percentages. It does not provide task Gantt scheduling, date-dragging, or dependency tracking.
- **Rationale for Addressing It**:
  - Teams expecting a "Timeline" view need roadmap visibility to forecast releases, coordinate cross-team dependencies, and adjust schedules visually.
- **Expected Outcome of the Resolution**:
  - Evolve `TimelineCanvas` into an interactive Gantt chart:
    - Horizontal time axis (Weeks / Months / Quarters).
    - Sprints and issues represented as draggable duration bars based on `startDate` and `dueDate`.
    - Visual dependency lines connecting predecessor and successor tasks.
- **Essentiality**: **Medium (P2)** — Strategic roadmap asset for project leads and managers.

---

## Phase 4: Power Tools & Quality Polish (Low - P3)

### 14. Global Command Palette (`Cmd+K` / `Ctrl+K`)

- **Reason for the Deficiency**:
  - Navigation requires mouse clicks through workspace rails, project accordions, and header dropdowns. No keyboard command palette exists.
- **Rationale for Addressing It**:
  - Power users, developers, and keyboard-centric users demand quick fuzzy-search access to jump between tickets, projects, channels, and commands.
- **Expected Outcome of the Resolution**:
  - Implement a global `CommandDialog` (using `cmdk` / shadcn `Command`) listening to `Cmd+K` / `Ctrl+K`.
  - Support instant fuzzy search across:
    - Issues by number (e.g. `#104`) or keyword.
    - Channels and direct messages.
    - Projects and workspaces.
    - Quick actions ("Create Issue", "Start Meeting", "Toggle Theme").
- **Essentiality**: **Low (P3)** — High-polish developer experience upgrade.

---

### 15. Removal or Implementation of Placeholder UI Elements

- **Reason for the Deficiency**:
  - The "Activity" tab in `ChatRightPanel.tsx:112` displays `"Activity feed coming soon"`.
  - Non-functional composer buttons (Stickers, Mic) create dead interactive targets.
- **Rationale for Addressing It**:
  - Dead ends and placeholder text degrade product credibility and make the app feel unfinished.
- **Expected Outcome of the Resolution**:
  - Either implement a live project activity audit log (tracking ticket creations, status changes, and sprint updates) in the "Activity" tab, or hide the tab until ready.
  - Remove or disable dead composer action icons.
- **Essentiality**: **Low (P3)** — UI cleanliness and polish.

---

## Comprehensive Issue Tracking Matrix

| # | Task / Issue | Target Layer | Expected Outcome | Essentiality | Phase |
|---|---|---|---|---|---|
| **1** | Real-Time Board WebSockets | `lib/api/`, `queries/`, `canvas/board` | Live synchronization of board card moves and column edits across all clients | **Essential** | **P0** |
| **2** | Add Column UI Action | `hooks/mutations/column.ts`, `board/` | "+ Add Column" button with sparse ordering insertion | **Essential** | **P0** |
| **3** | Status & Sprint in Issue Modal | `components/dashboard/comp/issue-detail/` | Interactive Status and Sprint dropdowns in ticket sidebar | **Essential** | **P0** |
| **4** | Server-Side Backlog Pagination | `queries/issue.ts`, `canvas/backlog/` | Server-driven filtering by sprint, status, and search query | **Essential** | **P0** |
| **5** | Chat Media Upload Pipeline | `hooks/chat/`, `Composer.tsx`, `MessageBubble.tsx` | Working file/image upload and rendering in chat bubbles | **Essential** | **P0** |
| **6** | Global "+ Create Issue" Button | `DashboardHeader.tsx`, `components/shared/` | Persistent ticket creation button from any dashboard view | **High** | **P1** |
| **7** | Board Search & Filter Toolbar | `components/canvas/board/` | Quick filters for "My Issues", priority, and member avatars | **High** | **P1** |
| **8** | Full Sprint Lifecycle | `lib/api/sprint.ts`, `layout/navigation-sidebar/` | Start, Complete (with task rollover), and Delete Sprint actions | **High** | **P1** |
| **9** | Multi-Type Notifications | `lib/api/notification.ts`, `header/` | Alerts for assignments, @mentions, comments, and sprint starts | **High** | **P1** |
| **10** | Unified Backlog & Sprint Planning | `components/canvas/backlog/` | Collapsible sprint containers and backlog pool on one screen | **Medium** | **P2** |
| **11** | Rich Markdown & Issue Metadata | `components/dashboard/comp/issue-detail/` | Markdown editor, due dates, label tags, and subtask checklists | **Medium** | **P2** |
| **12** | Draggable PiP Video Overlay | `components/call/`, `GlobalCallProvider.tsx` | True floating picture-in-picture widget with active video stream | **Medium** | **P2** |
| **13** | Interactive Gantt Roadmap | `components/canvas/timeline/` | Draggable timeline bars, dates, milestones, and dependencies | **Medium** | **P2** |
| **14** | Global Command Palette | `components/shared/`, root layout | `Cmd+K` / `Ctrl+K` fuzzy search across issues, channels, and actions | **Low** | **P3** |
| **15** | Ghost UI Cleanup | `ChatRightPanel.tsx`, `Composer.tsx` | Purge or complete activity feed stub and dead composer icons | **Low** | **P3** |
