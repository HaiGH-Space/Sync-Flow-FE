const common = {
  otherView: "Chế độ xem khác",
  selectWorkspace: {
    title: "Hãy chọn workspace để bắt đầu làm việc.",
  },
  selectProject: {
    title: "Hãy chọn dự án để bắt đầu làm việc.",
  },
  toast: {
    loadWorkspaceFailed: "Không thể tải danh sách workspace.",
  },
  navigation: {
    board: "Bảng",
    backlog: "Backlog",
    planning: "Lập kế hoạch",
    timeline: "Dòng thời gian",
  },
  header: {
    sprintLabel: "Sprint",
    sprintAll: "Tất cả sprint",
    sprintNoProject: "Chưa chọn dự án",
    sprintLoading: "Đang tải sprint...",
    sprintEmpty: "Chưa có sprint",
  },
  notifications: {
    title: "Thông báo",
    markAll: "Đánh dấu tất cả đã đọc",
    empty: "Chưa có thông báo",
    loadMore: "Tải thêm",
    acceptWorkspace: "Chấp nhận workspace",
    workspaceAccepted: "Đã chấp nhận lời mời workspace",
    workspaceAcceptFailed: "Không thể chấp nhận lời mời workspace",
  },
  board: {
    errorLoadingColumns: "Lỗi tải cột",
    errorHint: "Vui lòng kiểm tra kết nối và thử lại.",
    empty: "Chưa có cột hoặc issue nào",
    column: {
      edit: {
        title: "Sửa cột",
        description: "Đổi tên cột này.",
        nameLabel: "Tên cột",
        namePlaceholder: "Nhập tên cột mới",
        success: "Cập nhật cột thành công",
      },
      delete: {
        title: 'Xóa cột "{name}"?',
        description: "Bạn có chắc muốn xóa cột này không?",
        success: "Xóa cột thành công",
      },
    },
  },
} as const;

export default common;
