---
name: Sync Flow
colors:
  surface: '#ffffff'
  surface-dim: '#f4f4f5'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fafafa'
  surface-container: '#f4f4f5'
  surface-container-high: '#e4e4e7'
  surface-container-highest: '#d4d4d8'
  on-surface: '#09090b'
  on-surface-variant: '#71717b'
  inverse-surface: '#18181b'
  inverse-on-surface: '#fafafa'
  outline: '#e4e4e7'
  outline-variant: '#9f9fa9'
  surface-tint: '#009869'
  primary: '#009869'
  on-primary: '#edfdf5'
  primary-container: '#edfdf5'
  on-primary-container: '#002c22'
  inverse-primary: '#15ba81'
  secondary: '#f4f4f5'
  on-secondary: '#18181b'
  secondary-container: '#e4e4e7'
  on-secondary-container: '#09090b'
  tertiary: '#14b8a6'
  on-tertiary: '#ffffff'
  tertiary-container: '#ccfbf1'
  on-tertiary-container: '#115e59'
  error: '#e7000b'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#991b1b'
  primary-fixed: '#70e9b9'
  primary-fixed-dim: '#3ad198'
  on-primary-fixed: '#002c22'
  on-primary-fixed-variant: '#009869'
  secondary-fixed: '#e4e4e7'
  secondary-fixed-dim: '#d4d4d8'
  on-secondary-fixed: '#18181b'
  on-secondary-fixed-variant: '#71717b'
  tertiary-fixed: '#99f6e4'
  tertiary-fixed-dim: '#5eead4'
  on-tertiary-fixed: '#134e4a'
  on-tertiary-fixed-variant: '#0f766e'
  background: '#ffffff'
  on-background: '#09090b'
  surface-variant: '#f4f4f5'
typography:
  display-lg:
    fontFamily: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-base:
    fontFamily: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-bold:
    fontFamily: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  stat-lg:
    fontFamily: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.375rem
  DEFAULT: 0.5rem
  md: 0.625rem
  lg: 0.75rem
  xl: 1rem
  2xl: 1.25rem
  3xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Design System: Sync Flow

Sync Flow is a unified team collaboration, project management, and realtime communication workspace ("Sync anything, anywhere, with anyone"). The design system marries Scandinavian precision engineering with modern developer tool ergonomics—characterized by strict monochromatic discipline, focused emerald/mint accents, and frictionless spatial transitions.

---

## 1. Visual Theme & Atmosphere

Sync Flow's visual language is engineered for deep focus, low cognitive fatigue, and high information throughput. The interface rejects gratuitous decoration in favor of structural clarity, crisp hairline divisions, and subtle ambient depth. Rooted in neutral Zinc foundations (`oklch(1 0 0)` / `#ffffff` light canvas and `oklch(0.141 0.005 285.823)` / `#09090b` obsidian dark canvas), the space feels architectural and deliberate. Light mode conveys an open, airy studio environment, while dark mode evokes a distraction-free IDE terminal.

A signature chromatic anchor—a luminous **Emerald Seafoam** (`oklch(0.60 0.13 163)` / `#009869` in light mode and `oklch(0.70 0.15 162)` / `#15ba81` in dark mode)—energizes the workspace. It is paired with delicate teal aura gradients and cyan light beams that glide across auth cards and focused states. The density is calibrated for complex productivity: multi-pane sidebars, drag-and-drop Kanban boards, dense backlog data tables, and integrated floating call overlays coexist harmoniously through collapsible panels, smooth spring animations, and strict 4px/8px modular rhythm.

---

## 2. Color Palette & Roles

The color architecture is built around OKLCH perceptual color space and implemented via Tailwind CSS v4 variables with full light/dark mode parity.

### Primary Foundation

| Token / Role | Light Mode Hex | Dark Mode Hex | Source Variable | Functional Purpose |
|:---|:---|:---|:---|:---|
| **Canvas Background** | `#ffffff` | `#09090b` | `--background` | Base canvas and outer application shell |
| **Foreground Text** | `#09090b` | `#fafafa` | `--foreground` | Primary text, high-contrast headings, active icons |
| **Card / Elevated Surface** | `#ffffff` | `#18181b` | `--card` | Task cards, modal windows, floating dropdown panels |
| **Card Foreground** | `#09090b` | `#fafafa` | `--card-foreground` | Content text inside cards and modal dialogs |
| **Sidebar Surface** | `#fafafa` | `#18181b` | `--sidebar` | Workspace rail and primary navigation sidebar |
| **Sidebar Foreground** | `#09090b` | `#fafafa` | `--sidebar-foreground` | Navigation links, workspace labels, team headings |
| **Subtle Muted Surface** | `#f4f4f5` | `#27272a` | `--muted` / `--secondary` | Column troughs, search inputs, inactive pill toggles |
| **Border & Divider** | `#e4e4e7` | `rgba(255,255,255,0.10)` | `--border` | 1px hairline panel separators, card outlines |

### Accent & Interactive

| Token / Role | Light Mode Hex | Dark Mode Hex | Source Variable | Functional Purpose |
|:---|:---|:---|:---|:---|
| **Primary Emerald** | `#009869` | `#15ba81` | `--primary` | Main CTA buttons, active sidebar indicator, drop targets |
| **Primary Foreground** | `#edfdf5` | `#002c22` | `--primary-foreground` | High-legibility text & icons on primary emerald fills |
| **Accent Glow / Tint** | `#14b8a6` | `#14b8a6` | Tailwind `teal-500` | Moving light beams, radial glow meshes, atmospheric aura |
| **Focus Ring** | `#9f9fa9` | `#71717a` | `--ring` | 3px accessible focus-visible halos on inputs & buttons |
| **Hover / Interaction** | `#f4f4f5` | `#27272a` | `--sidebar-accent` | List item hover, icon button hover backgrounds |

### Typography & Text Hierarchy

| Token / Role | Light Mode Hex | Dark Mode Hex | Source Variable | Functional Purpose |
|:---|:---|:---|:---|:---|
| **Primary Text** | `#09090b` | `#fafafa` | `--foreground` | Headings, card titles, table row primary text |
| **Muted Secondary** | `#71717b` | `#a1a1aa` | `--muted-foreground` | Metadata labels, timestamps, subheaders, descriptions |
| **Subtle Tertiary** | `#9f9fa9` | `#71717a` | Opacity / Zinc 400 | Drag handles, inactive icons, breadcrumb separators |
| **Inverse Text** | `#fafafa` | `#09090b` | `--background` | Tooltip copy, high-contrast dark pills |

### Functional States & Data Visualization

| Token / Role | Light Mode Hex | Dark Mode Hex | Usage | Context in UI |
|:---|:---|:---|:---|:---|
| **Destructive / High** | `#e7000b` | `#ff6467` | `--destructive` | High priority badge, delete modals, error toasts |
| **Warning / Medium** | `#d97706` | `#f59e0b` | Tailwind `amber-500` | Medium priority badge, sprint warning chips |
| **Success / Low** | `#009869` | `#15ba81` | Tailwind `emerald-500` | Low priority badge, completion states, active calls |
| **Chart Scale 1** | `#70e9b9` | `#70e9b9` | `--chart-1` | Light mint (Sprint completion, progress tracks) |
| **Chart Scale 2** | `#3ad198` | `#3ad198` | `--chart-2` | Vibrant jade (Active capacity, story point breakdown) |
| **Chart Scale 3** | `#15ba81` | `#15ba81` | `--chart-3` | Medium mint (Timeline sprint bars) |
| **Chart Scale 4** | `#009869` | `#009869` | `--chart-4` | Emerald anchor (Baseline velocity) |
| **Chart Scale 5** | `#147859` | `#147859` | `--chart-5` | Deep forest pine (Completed milestones) |

---

## 3. Typography Rules

The typography system is powered by **Geist Sans** and **Geist Mono** (via `next/font/google`), selected for optimal geometric legibility across dense user interfaces, code snippets, and numeric tracking.

### Hierarchy & Weights

| Level | Size | Weight | Line Height | Tracking | Application |
|:---|:---|:---|:---|:---|:---|
| **Display / Title** | 32px (`text-3xl`) | SemiBold (`600`) | 40px | `-0.025em` | Auth titles, hero welcome, animated logo |
| **Headline Large** | 24px (`text-2xl`) | SemiBold (`600`) | 32px | `-0.02em` | Dialog headers, major page views |
| **Headline Medium** | 18px (`text-lg`) | Medium (`500`) | 28px | `-0.015em` | Kanban column headers, navigation section titles |
| **Body Base** | 14px (`text-sm`) | Regular (`400`) | 20px | `0` | Default UI text, chat messages, input values |
| **Body Medium / Bold** | 14px (`text-sm`) | Medium (`500`) | 20px | `0` | Kanban task titles, button labels, active tab items |
| **Small / Meta** | 12px (`text-xs`) | Regular (`400`) | 16px | `0` | Secondary metadata, timestamps, story point counters |
| **Caps / Badges** | 11px (`text-[10px]`) | Medium / SemiBold | 14px | `+0.05em` | Priority badges, uppercase status pills, column tags |
| **Monospace** | 13px (`text-xs`) | Regular (`400`) | 18px | `0` | Code snippets, ID hashes, token keys, keyboard shortcuts |

### Spacing Principles

- **Heading Rhythm**: Headings sit tight to their subordinate copy (`mb-1` to `mb-2`) to visually couple content.
- **Micro-Copy Tracking**: Uppercase category tags and breadcrumbs use open letter tracking (`tracking-[0.24em]` or `tracking-wider`) to enhance legibility at 10px-12px sizes.
- **Line Length**: Body paragraphs and descriptions clamp at `line-clamp-2` in cards and `max-w-sm` in authentication flows for swift visual scanning.

---

## 4. Component Stylings

### Buttons (`components/ui/button.tsx`, `components/ui/button-variants.ts`)

Buttons feature precise corner geometry (`rounded-lg` / `0.5rem`, with compact variants scaling down to `rounded-[10px]`), clean focus rings, and zero-latency feedback:

- **Primary Variant**: Solid emerald background (`bg-primary text-primary-foreground`), hover brightness shift (`hover:bg-primary/90`), subtle lift on interactive cards (`hover:-translate-y-0.5`).
- **Outline Variant**: Transparent background with hairline border (`border-border bg-background hover:bg-muted dark:bg-input/30`), expanding to active states seamlessly.
- **Secondary Variant**: Soft neutral fill (`bg-secondary text-secondary-foreground hover:bg-secondary/80`).
- **Ghost Variant**: Pure text/icon presentation (`hover:bg-muted hover:text-foreground`), used in workspace rails, window toggles, and header controls.
- **Destructive Variant**: Tinted warning background (`bg-destructive/10 text-destructive hover:bg-destructive/20`).
- **Sizes**:
  - `default`: Height 32px (`h-8`), horizontal padding 10px (`px-2.5`), text 14px.
  - `sm`: Height 28px (`h-7`), padding 10px (`px-2.5`), text 13px (`text-[0.8rem]`).
  - `xs`: Height 24px (`h-6`), padding 8px (`px-2`), text 12px (`text-xs`).
  - `icon-sm`: Square 28px (`size-7`), `icon`: Square 32px (`size-8`).

### Cards & Containers

- **Kanban Task Cards (`KanbanCard.tsx`)**:
  - Background: Solid surface (`bg-card`), 1px border (`border-border/70`), border radius `rounded-lg` (8px).
  - Hover Behavior: Border sharpens to `hover:border-border`, elevated with `hover:shadow-xs`. Drag handle icon fades in on hover (`opacity-0 group-hover:opacity-100`).
  - Drag State: `opacity-30 border-dashed bg-muted/20 border-primary/30`.
  - Drop Target: Top accent line indicator `border-t-2 border-t-primary/70 pt-2.5`.
- **Kanban Column Trough (`KanbanColumn.tsx`)**:
  - Background: Recessed neutral tint `bg-muted/30` with `rounded-lg`.
  - Drop Over State: Brightens to `bg-muted/60` with primary halo `ring-2 ring-primary/40`.
- **Dialogs & Modals (`dialog.tsx`)**:
  - Overlay: Backdrop blur with subtle dimming (`bg-black/10 backdrop-blur-xs fixed inset-0 z-50`).
  - Content Shell: Solid card surface (`bg-background ring-1 ring-foreground/10 rounded-xl p-4 sm:max-w-sm`). Zoom spring animation (`data-open:zoom-in-95 data-closed:zoom-out-95`).

### Navigation

- **Workspace Rail (`WorkspaceRail.tsx`)**:
  - Fixed 80px (`w-20`) vertical strip on the extreme left. Border-r with `border-sidebar-border`.
  - Workspace Item: 40x40px (`size-10`) squircle with `rounded-xl`. Active state highlighted with primary fill (`bg-primary text-primary-foreground shadow-md`) and an absolute vertical left indicator pill (`w-1 h-8 bg-primary rounded-r-full`).
- **Navigation Sidebar (`NavigationSidebar.tsx`)**:
  - 250px width (`w-62.5`), collapsible via Framer Motion spring transition (`stiffness: 400, damping: 40`).
  - Contains workspace dropdown header, instant live search filter, expandable project trees with sprint sub-items, and footer user profile.
- **Top Header Bar (`DashboardContentLayout.tsx`)**:
  - 56px height (`h-14`) with translucent glass finish (`bg-white/90 dark:bg-background/90 backdrop-blur border-b border-zinc-200/80 dark:border-zinc-800/80`).
  - Hosts sidebar toggles (`PanelLeftClose` / `PanelLeftOpen`), tab switchers, sprint picker dropdown, notification bell, and chat drawer toggle.

### Inputs & Forms (`input.tsx`, `select.tsx`, `textarea.tsx`)

- **Field Base**: Height 32px (`h-8`), `rounded-lg`, border `border-input`, background `bg-transparent` (`dark:bg-input/30`).
- **Focus Transition**: Focused border rings with `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none`.
- **Validation State**: Invalid inputs trigger `aria-invalid:border-destructive aria-invalid:ring-destructive/20`.

### Domain-Specific Components

- **Chat Bubble (`MessageBubble.tsx`)**:
  - Incoming message: `border-border/70 bg-background` with rounded 16px bubble (`rounded-2xl`).
  - Outgoing message: Soft primary emerald tint `border-primary/30 bg-primary/10 text-foreground` reversed layout.
- **Priority Badges (`KanbanCard.tsx`, `badge.tsx`)**:
  - Pill-shaped (`rounded-4xl`), text 10px (`text-[10px]`), font normal.
  - High: Red tint `bg-destructive/15 text-destructive border-destructive/20`.
  - Medium: Amber tint `bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20`.
  - Low: Emerald tint `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`.
- **Animated Auth Card & LightBeam (`AuthCard.tsx`, `LightBeam.tsx`)**:
  - Card: Smooth corner curvature `rounded-[1.75rem]`, translucent frosted glass `bg-card/90 backdrop-blur-xl`, deep shadow `shadow-[0_28px_80px_-36px_rgba(15,23,42,0.55)]`.
  - Light Beam: An animated linear gradient ray (`bg-linear-to-r from-transparent via-primary/80 to-transparent`) traversing the border edges on an 8-second continuous loop.
- **Logo Gradient (`LogoAppAnimation.tsx`)**:
  - Shimmering gradient headline: `bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent`, animated across 200% background width.

---

## 5. Layout Principles

### Grid & Structure

Sync Flow uses a coordinated multi-pane layout model designed for high-density desktop workflows while gracefully adapting across viewport constraints:

```
+-----------+----------------------+-----------------------------------------------+----------------------+
| Workspace | Navigation Sidebar   | Main Content Canvas                           | Realtime Chat        |
| Rail      | (Collapsible, 250px) | (Kanban Board / Backlog Table / Timeline)     | Panel (Drawer, 320px)|
| (w-20)    |                      | [Header: Breadcrumbs + Sprint + Tabs (h-14)]  |                      |
| 80px      |                      |                                               |                      |
|           |                      |                                               |                      |
|           |                      |                                               |                      |
+-----------+----------------------+-----------------------------------------------+----------------------+
```

- **Workspace Rail**: Fixed 80px width, sticky vertical orientation.
- **Navigation Sidebar**: 250px default width with spring collapse animation to 0px.
- **Content Canvas**: Fluid flex area (`flex-1 min-w-0`), horizontal and vertical auto-overflows tailored per canvas mode (e.g. Kanban columns scroll horizontally; Backlogs scroll vertically with sticky table headers).
- **Chat Drawer**: Sliding right panel (320px-360px), accessible without obscuring main board workflows.

### Whitespace Strategy

- **Base Spacing Unit**: 4px baseline. Standard micro steps: 4px (`gap-1`), 8px (`gap-2`), 12px (`gap-3`), 16px (`p-4`), 24px (`p-6`).
- **Card Interior Padding**: Compact 12px (`p-3`) on Kanban task cards preserves vertical real estate while preventing visual crowding.
- **Section Margins**: 24px (`p-6`) around the main viewport canvas.

### Responsive Behavior & Touch

- **Sidebar Auto-Collapsing**: On narrower viewports, left and right sidebars convert into overlay sheets to keep the central workspace focused.
- **Touch Targets**: Minimum interactive targets remain at 28px-32px with ample hit padding (`hover:bg-muted/65 p-1` on micro icons).

---

## 6. Design System Notes for Stitch Generation

When generating new screens, dialogs, or workflow modules in Stitch for Sync Flow, adhere strictly to the following parameters:

### Language & Tone

- **Aesthetic Keywords**: "Clean Scandinavian SaaS", "precision engineering", "obsidian dark mode", "emerald seafoam accent", "hairline zinc borders", "smooth spring motion", "high-density productivity".
- **Avoid**: Heavy skeuomorphic drop shadows, saturated primary blues or purples, cluttered borders, rounded bubble shapes beyond standard token radii.

### Color References for Stitch Prompts

- **Primary Canvas**: `#ffffff` (light), `#09090b` (dark).
- **Surface / Cards**: `#ffffff` (light), `#18181b` (dark) with `1px border #e4e4e7` (light) or `1px border rgba(255,255,255,0.1)` (dark).
- **Accent Interactive**: `#009869` (light mode emerald), `#15ba81` (dark mode mint).
- **Gradients & Beams**: Teal-to-emerald light beams (`#14b8a6` to `#009869`).
- **Muted Elements**: `#71717b` (secondary text), `#f4f4f5` (light pill fill), `#27272a` (dark pill fill).

### Component Prompts for Stitch

- **Kanban Task Card Prompt**:
  > *"A minimalist task card in a dark mode productivity app. Surface `#18181b` with 1px border `#27272a` and 8px rounded corners. Contains a crisp title in Geist 14px `#fafafa`, two lines of muted description `#a1a1aa`, a pill badge for priority (`#ff6467` on red tint for High, `#f59e0b` for Medium, or `#15ba81` for Low), a small story point indicator 'SP: 5', a 20px user avatar on the right, and a subtle drag handle on hover."*

- **Sprint Planning Modal Prompt**:
  > *"A clean dialog modal for sprint planning. Dark obsidian background `#09090b` with a 1px border `rgba(255,255,255,0.1)` and 12px rounded corners. Includes an emerald primary action button (`#15ba81` background with `#002c22` dark forest text), secondary ghost buttons, a date-range input with calendar icon, and status dropdown in Zinc styling."*

- **Realtime Chat Panel Prompt**:
  > *"A docked right-hand collaboration panel. Frosted translucent header with active channel name and participant count. Chat list featuring alternating message bubbles: incoming messages in dark surface `#18181b` with 1px border, outgoing messages in subtle emerald tint `#15ba81/10` with `#15ba81/30` border. Includes a bottom composer with markdown support, attachment icon, and emoji trigger."*

### Incremental Iteration Guidance

- Always ensure color contrast ratios meet WCAG AA standards (especially primary foreground `#edfdf5` on `#009869` and `#002c22` on `#15ba81`).
- Keep UI components presentational: state management and side effects should follow Sync Flow's custom hook patterns.
- When introducing new status tags or categorical badges, use low-opacity tinted fills (`bg-*/15 text-* border-*/20`) rather than solid aggressive colors.
