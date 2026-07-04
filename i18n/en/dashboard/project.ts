const project = {
  create: {
    title: "Create New Project",
    description: "Create a new project in {workspaceName}.",
    namePlaceholder: "Project Name",
    keyPlaceholder: "Project Key",
    descriptionPlaceholder: "Project Description (optional)",
    submit: "Create Project",
    submitting: "Creating...",
  },
  toast: {
    created: "Project created successfully",
    createFailed: "Failed to create project",
    deleted: "Project deleted successfully",
    deleteFailed: "Failed to delete project",
  },
  delete: {
    title: 'Delete project "{name}"?',
    description: "Are you sure you want to delete this project?",
    action: "Delete project {name}",
  },
  settings: {
    title: "Project Settings",
    description: "View and manage project settings.",
    action: "Settings for {name}",
    nameLabel: "Project name",
    keyLabel: "Project key",
    idLabel: "Project ID",
    descriptionLabel: "Description",
    manageHint: "You can add project management options here later.",
    dangerTitle: "Danger Zone",
    dangerDescription:
      "Actions here are irreversible. Please proceed with caution.",
    deleteWarning:
      "This action is permanent and cannot be undone. All data will be lost.",
    tabs: {
      general: "General",
      generalDescription: "Basic project info",
      dangerZone: "Danger Zone",
      dangerZoneDescription: "Irreversible actions",
    },
  },
} as const;

export default project;
