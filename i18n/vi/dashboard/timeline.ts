const timeline = {
  title: "Dòng thời gian dự án",
  subtitle:
    "Theo dõi các sprint, tiến độ và cách issue được phân bổ trên lộ trình.",
  loading: "Đang tải dữ liệu dòng thời gian...",
  error: "Không thể tải dữ liệu dòng thời gian.",
  retry: "Thử lại",
  emptyTitle: "Chưa có dòng thời gian sprint",
  emptyHint: "Tạo ít nhất một sprint để trực quan hóa lịch trình dự án.",
  summary: {
    totalSprints: "Tổng sprint",
    scheduledIssues: "Issue đã lên lịch",
    unscheduledIssues: "Issue chưa lên lịch",
    activeSprints: "Sprint đang chạy",
  },
  phase: {
    upcoming: "Sắp tới",
    active: "Đang chạy",
    completed: "Hoàn tất",
    unscheduled: "Chưa lên lịch",
  },
  status: {
    active: "Đang chạy",
    completed: "Hoàn tất",
    planned: "Dự kiến",
  },
  card: {
    noDate: "Chưa có lịch",
    durationLabel: "Tiến độ",
    issueCount: "{count} issue",
    overflow: "+{count} nữa",
    noIssues: "Chưa có issue nào được gán cho sprint này.",
    statusLabel: "Giai đoạn",
  },
} as const;

export default timeline;
