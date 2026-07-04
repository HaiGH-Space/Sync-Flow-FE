const planning = {
  loading: "Loading planning data...",
  error: "Failed to load planning data.",
  unassignedTitle: "Unassigned issues",
  unassignedHint: "Issues not yet assigned to a sprint",
  emptyUnassigned: "No unassigned issues.",
  sprintTitle: "Selected sprint",
  sprintNotSelected: "Select a sprint to plan",
  selectSprintHint: "Pick a sprint from the header to move issues into it.",
  emptySprint: "No issues in this sprint yet.",
  moveToSprint: "Add to sprint",
  removeFromSprint: "Remove from sprint",
} as const;

export default planning;
