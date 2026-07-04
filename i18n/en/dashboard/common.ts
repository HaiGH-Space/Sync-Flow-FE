const common = {
  otherView: "Other view",
  selectWorkspace: {
    title: "Select a workspace to start working.",
  },
  selectProject: {
    title: "Select a project to start working.",
  },
  toast: {
    loadWorkspaceFailed: "Failed to load workspace list.",
  },
  navigation: {
    board: "Board",
    backlog: "Backlog",
    planning: "Planning",
    timeline: "Timeline",
  },
  header: {
    sprintLabel: "Sprint",
    sprintAll: "All sprints",
    sprintNoProject: "No project",
    sprintLoading: "Loading sprints...",
    sprintEmpty: "No sprints",
  },
  notifications: {
    title: "Notifications",
    markAll: "Mark all as read",
    empty: "No notifications yet",
    loadMore: "Load more",
    acceptWorkspace: "Accept workspace",
    workspaceAccepted: "Workspace invitation accepted",
    workspaceAcceptFailed: "Failed to accept workspace invitation",
  },
  board: {
    errorLoadingColumns: "Error loading columns",
    errorHint: "Please check your connection and try again.",
    empty: "No columns or issues found",
    column: {
      edit: {
        title: "Edit column",
        description: "Rename this column.",
        nameLabel: "Column name",
        namePlaceholder: "Enter a new column name",
        success: "Column updated successfully",
      },
      delete: {
        title: 'Delete column "{name}"?',
        description: "Are you sure you want to delete this column?",
        success: "Column deleted successfully",
      },
    },
  },
} as const;

export default common;
