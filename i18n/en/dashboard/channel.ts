const channel = {
  create: {
    action: "Create channel",
    title: "Create Channel",
    description: "Create a channel for this project.",
    namePlaceholder: "Channel name (optional)",
    typeLabel: "Channel type",
    typeGroup: "Group",
    typeDirect: "Direct",
    membersLabel: "Members",
    membersLoading: "Loading members...",
    noMembers: "No members yet",
    submit: "Create channel",
  },
  toast: {
    created: "Channel created successfully",
    createFailed: "Failed to create channel",
  },
} as const;

export default channel;
