const workspace = {
  create: {
    title: "Create New Workspace",
    description: "Create a workspace to organize your projects.",
    nameLabel: "Workspace name",
    namePlaceholder: "My Workspace",
    submit: "Create Workspace",
  },
  menu: {
    title: "Workspace settings",
    openSettings: "Open settings",
    copyId: "Copy workspace ID",
  },
  tabs: {
    general: "General",
    generalDescription: "Basic workspace info",
    members: {
      title: "Members",
      description: "People in this workspace",
    },
    permissions: {
      title: "Permissions",
      description: "Roles and access",
    },
  },
  settings: {
    title: "Workspace settings",
    description: "This is where workspace settings can be shown and managed.",
    name: "Workspace name",
    id: "Workspace ID",
    slug: "URL slug",
    manageHint: "You can add workspace management options here later.",
    memberHint: "You are currently a member. Some settings may be limited.",
    membersDescription: "A list of members currently in this workspace.",
    noMembers: "No members yet.",
    permissionsAdminHint: "You can manage some important workspace settings.",
    permissionsMemberHint:
      "Some administrative permissions are not available for your role.",
    dangerTitle: "Danger Zone",
    dangerDescription:
      "Actions here are irreversible. Please proceed with caution.",
    deleteWarning:
      "This action is permanent and cannot be undone. All data will be lost.",
    permissionAllowed: {
      label: "Allowed",
    },
    permissionRestricted: {
      label: "Restricted",
    },
    permissionItem: {
      manageProjects: "Manage projects",
      manageMembers: "Manage members",
    },
    tabs: {
      dangerZone: "Danger Zone",
      dangerZoneDescription: "Irreversible actions",
    },
    copied: "Workspace ID copied",
    copyFailed: "Failed to copy workspace ID",
  },
  invite: {
    title: "Invite member",
    description: "Send an invitation to join this workspace.",
    emailLabel: "Email address",
    emailPlaceholder: "name@company.com",
    roleLabel: "Role",
    rolePlaceholder: "Select role",
    submit: "Send invite",
    submitting: "Sending...",
    toast: {
      sent: "Invitation sent",
      failed: "Failed to send invitation",
    },
  },
  toast: {
    created: "Workspace created successfully",
    createFailed: "Failed to create workspace",
    deleted: "Workspace deleted successfully",
    deleteFailed: "Failed to delete workspace",
  },
  delete: {
    title: 'Delete workspace "{name}"?',
  },
} as const;

export default workspace;
