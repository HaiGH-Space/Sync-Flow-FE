const timeline = {
  title: "Project timeline",
  subtitle:
    "Track sprint windows, progress, and how issues are distributed across the roadmap.",
  loading: "Loading timeline data...",
  error: "Failed to load timeline data.",
  retry: "Retry",
  emptyTitle: "No sprint timeline yet",
  emptyHint: "Create at least one sprint to visualize the project schedule.",
  summary: {
    totalSprints: "Total sprints",
    scheduledIssues: "Scheduled issues",
    unscheduledIssues: "Unscheduled issues",
    activeSprints: "Active sprints",
  },
  phase: {
    upcoming: "Upcoming",
    active: "Active",
    completed: "Completed",
    unscheduled: "Unscheduled",
  },
  status: {
    active: "Active",
    completed: "Completed",
    planned: "Planned",
  },
  card: {
    noDate: "No schedule yet",
    durationLabel: "Progress",
    issueCount: "{count} issues",
    overflow: "+{count} more",
    noIssues: "No issues assigned to this sprint yet.",
    statusLabel: "Phase",
  },
} as const;

export default timeline;
