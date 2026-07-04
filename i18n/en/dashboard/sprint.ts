const sprint = {
  create: {
    action: "Create sprint",
    title: "Create Sprint",
    description: "Create a sprint for this project.",
    namePlaceholder: "Sprint name",
    goalPlaceholder: "Sprint goal (optional)",
    startDateLabel: "Start date",
    endDateLabel: "End date",
    submit: "Create sprint",
  },
  toast: {
    created: "Sprint created successfully",
    createFailed: "Failed to create sprint",
    updated: "Sprint updated successfully",
    updateFailed: "Failed to update sprint",
  },
  edit: {
    action: "Edit sprint",
    title: "Edit Sprint",
    description: 'Edit sprint "{name}".',
    namePlaceholder: "Sprint name",
    goalPlaceholder: "Sprint goal (optional)",
    startDateLabel: "Start date",
    endDateLabel: "End date",
    submit: "Save sprint",
  },
} as const;

export default sprint;
