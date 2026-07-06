const backlog = {
  empty: "Chưa có issue trong backlog.",
  searchPlaceholder: "Tìm trong backlog...",
  countLabel: "issue",
  filters: {
    all: "Tất cả",
    priority: "Ưu tiên",
    status: "Trạng thái",
    reset: "Đặt lại",
  },
  columns: {
    id: "ID",
    title: "Tiêu đề",
    priority: "Ưu tiên",
    assignee: "Người phụ trách",
    status: "Trạng thái",
    updatedAt: "Cập nhật",
  },
  pagination: {
    previous: "Trước",
    next: "Sau",
    showing: "Hiển thị {start} - {end} trong số {total} {countLabel}",
    rowsPerPage: "Số dòng mỗi trang:",
  },
} as const;

export default backlog;
