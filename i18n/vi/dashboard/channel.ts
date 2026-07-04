const channel = {
  create: {
    action: "Tạo kênh",
    title: "Tạo kênh",
    description: "Tạo kênh cho dự án này.",
    namePlaceholder: "Tên kênh (tùy chọn)",
    typeLabel: "Loại kênh",
    typeGroup: "Nhóm",
    typeDirect: "Trực tiếp",
    membersLabel: "Thành viên",
    membersLoading: "Đang tải thành viên...",
    noMembers: "Chưa có thành viên",
    submit: "Tạo kênh",
  },
  toast: {
    created: "Tạo kênh thành công",
    createFailed: "Tạo kênh thất bại",
  },
} as const;

export default channel;
