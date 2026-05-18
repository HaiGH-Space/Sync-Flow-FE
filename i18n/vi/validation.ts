const validation = {
  auth: {
    email_invalid: "Email không hợp lệ",
    password_required: "Vui lòng nhập mật khẩu",
    password_min: "Mật khẩu phải có ít nhất 8 ký tự",
    name_min: "Tên phải có ít nhất 2 ký tự",
  },
  project: {
    name_required: "Tên dự án là bắt buộc",
    key_required: "Mã dự án là bắt buộc",
  },
  workspace: {
    name_required: "Tên workspace là bắt buộc",
    invite: {
      email_required: "Email là bắt buộc",
      role_required: "Vai trò là bắt buộc",
    },
  },
  issue: {
    title_required: "Tiêu đề issue là bắt buộc",
  },
  sprint: {
    name_required: "Tên sprint là bắt buộc",
    end_date_after_start: "Ngày kết thúc phải sau ngày bắt đầu",
  },
  channel: {
    members_required: "Vui lòng chọn ít nhất một thành viên",
  },
} as const;

export default validation;
