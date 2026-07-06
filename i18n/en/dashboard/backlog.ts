const backlog = {
  empty: "No backlog issues yet.",
  searchPlaceholder: "Search backlog...",
  countLabel: "issues",
  filters: {
    all: "All",
    priority: "Priority",
    status: "Status",
    reset: "Reset",
  },
  columns: {
    id: "ID",
    title: "Title",
    priority: "Priority",
    assignee: "Assignee",
    status: "Status",
    updatedAt: "Updated",
  },
  pagination: {
    previous: "Previous",
    next: "Next",
    showing: "Showing {start} to {end} of {total} {countLabel}",
    rowsPerPage: "Rows per page:",
  },
} as const;

export default backlog;
