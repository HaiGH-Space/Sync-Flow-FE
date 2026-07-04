const sprint = {
  create: {
    action: "Tạo sprint",
    title: "Tạo sprint",
    description: "Tạo sprint cho dự án này.",
    namePlaceholder: "Tên sprint",
    goalPlaceholder: "Mục tiêu sprint (tùy chọn)",
    startDateLabel: "Ngày bắt đầu",
    endDateLabel: "Ngày kết thúc",
    submit: "Tạo sprint",
  },
  toast: {
    created: "Tạo sprint thành công",
    createFailed: "Tạo sprint thất bại",
    updated: "Cập nhật sprint thành công",
    updateFailed: "Cập nhật sprint thất bại",
  },
  edit: {
    action: "Sửa sprint",
    title: "Sửa sprint",
    description: 'Chỉnh sửa sprint "{name}".',
    namePlaceholder: "Tên sprint",
    goalPlaceholder: "Mục tiêu sprint (tùy chọn)",
    startDateLabel: "Ngày bắt đầu",
    endDateLabel: "Ngày kết thúc",
    submit: "Lưu sprint",
  },
} as const;

export default sprint;
