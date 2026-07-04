const planning = {
  loading: "Đang tải dữ liệu lập kế hoạch...",
  error: "Không thể tải dữ liệu lập kế hoạch.",
  unassignedTitle: "Issue chưa vào sprint",
  unassignedHint: "Các issue chưa được gán vào sprint",
  emptyUnassigned: "Không có issue chưa gán.",
  sprintTitle: "Sprint đã chọn",
  sprintNotSelected: "Hãy chọn sprint để lập kế hoạch",
  selectSprintHint: "Chọn sprint ở thanh tiêu đề để chuyển issue vào sprint.",
  emptySprint: "Sprint này chưa có issue nào.",
  moveToSprint: "Thêm vào sprint",
  removeFromSprint: "Bỏ khỏi sprint",
} as const;

export default planning;
