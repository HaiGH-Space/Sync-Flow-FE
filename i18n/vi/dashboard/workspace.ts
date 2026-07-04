const workspace = {
  create: {
    title: "Tạo workspace mới",
    description: "Tạo workspace để tổ chức các dự án của bạn.",
    nameLabel: "Tên workspace",
    namePlaceholder: "Workspace của tôi",
    submit: "Tạo workspace",
  },
  menu: {
    title: "Cài đặt workspace",
    openSettings: "Mở cài đặt",
    copyId: "Sao chép ID workspace",
  },
  tabs: {
    general: "Tổng quan",
    generalDescription: "Thông tin cơ bản",
    members: {
      title: "Thành viên",
      description: "Người trong workspace",
    },
    permissions: {
      title: "Phân quyền",
      description: "Quyền và vai trò",
    },
  },
  settings: {
    title: "Cài đặt workspace",
    description: "Nơi hiển thị và quản lý các cài đặt của workspace.",
    name: "Tên workspace",
    id: "ID workspace",
    slug: "URL slug",
    manageHint:
      "Bạn có thể thêm các tùy chọn quản lý workspace tại đây sau này.",
    memberHint:
      "Bạn đang ở vai trò thành viên. Một số cài đặt có thể bị giới hạn.",
    membersDescription: "Danh sách thành viên đang tham gia workspace này.",
    noMembers: "Chưa có thành viên nào.",
    permissionsAdminHint:
      "Bạn có thể quản lý một số cài đặt quan trọng của workspace.",
    permissionsMemberHint:
      "Một số quyền quản trị hiện không khả dụng với vai trò của bạn.",
    dangerTitle: "Khu vực nguy hiểm",
    dangerDescription:
      "Các hành động ở đây không thể hoàn tác. Vui lòng cẩn thận.",
    deleteWarning:
      "Hành động này là vĩnh viễn và không thể hoàn tác. Tất cả dữ liệu sẽ bị mất.",
    permissionAllowed: {
      label: "Được phép",
    },
    permissionRestricted: {
      label: "Bị giới hạn",
    },
    permissionItem: {
      manageProjects: "Quản lý dự án",
      manageMembers: "Quản lý thành viên",
    },
    tabs: {
      dangerZone: "Khu vực nguy hiểm",
      dangerZoneDescription: "Hành động không thể hoàn tác",
    },
    copied: "Đã sao chép ID workspace",
    copyFailed: "Không thể sao chép ID workspace",
  },
  invite: {
    title: "Mời thành viên",
    description: "Gửi lời mời tham gia workspace này.",
    emailLabel: "Địa chỉ email",
    emailPlaceholder: "ten@congty.com",
    roleLabel: "Vai trò",
    rolePlaceholder: "Chọn vai trò",
    submit: "Gửi lời mời",
    submitting: "Đang gửi...",
    toast: {
      sent: "Đã gửi lời mời",
      failed: "Gửi lời mời thất bại",
    },
  },
  toast: {
    created: "Tạo workspace thành công",
    createFailed: "Tạo workspace thất bại",
    deleted: "Xóa workspace thành công",
    deleteFailed: "Xóa workspace thất bại",
  },
  delete: {
    title: 'Xóa workspace "{name}"?',
  },
} as const;

export default workspace;
