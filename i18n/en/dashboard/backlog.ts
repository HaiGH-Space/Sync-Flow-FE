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
} as const;

export default backlog;
