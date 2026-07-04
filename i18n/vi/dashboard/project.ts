const project = {
  create: {
    title: "Tạo dự án mới",
    description: "Tạo dự án mới trong {workspaceName}.",
    namePlaceholder: "Tên dự án",
    keyPlaceholder: "Mã dự án",
    descriptionPlaceholder: "Mô tả dự án (tùy chọn)",
    submit: "Tạo dự án",
    submitting: "Đang tạo...",
  },
  toast: {
    created: "Tạo dự án thành công",
    createFailed: "Tạo dự án thất bại",
    deleted: "Xóa dự án thành công",
    deleteFailed: "Xóa dự án thất bại",
  },
  delete: {
    title: 'Xóa dự án "{name}"?',
    description: "Bạn có chắc chắn muốn xóa dự án này không?",
    action: "Xóa dự án {name}",
  },
  settings: {
    title: "Cài đặt dự án",
    description: "Xem và quản lý cài đặt dự án.",
    action: "Cài đặt {name}",
    nameLabel: "Tên dự án",
    keyLabel: "Mã dự án",
    idLabel: "ID dự án",
    descriptionLabel: "Mô tả",
    manageHint: "Bạn có thể thêm các tùy chọn quản lý dự án tại đây sau này.",
    dangerTitle: "Khu vực nguy hiểm",
    dangerDescription:
      "Các hành động ở đây không thể hoàn tác. Vui lòng cẩn thận.",
    deleteWarning:
      "Hành động này là vĩnh viễn và không thể hoàn tác. Tất cả dữ liệu sẽ bị mất.",
    tabs: {
      general: "Tổng quan",
      generalDescription: "Thông tin cơ bản",
      dangerZone: "Khu vực nguy hiểm",
      dangerZoneDescription: "Hành động không thể hoàn tác",
    },
  },
} as const;

export default project;
