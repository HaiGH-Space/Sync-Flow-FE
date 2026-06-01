const auth = {
	login: {
		title: "Chào mừng quay lại",
		subtitle: "Chào mừng quay lại! Vui lòng đăng nhập vào tài khoản của bạn.",
		submit: "Đăng nhập",
		email_placeholder: "Nhập email của bạn",
		password_placeholder: "Nhập mật khẩu của bạn",
		no_account: "Chưa có tài khoản?",
		go_to_register: "Đăng ký",
		have_account: "Đã có tài khoản?",
		go_to_login: "Đăng nhập",
		divider_text: "hoặc tiếp tục với"
	},
	register: {
		title: "Tạo tài khoản",
		subtitle: "Tạo tài khoản mới để bắt đầu.",
		submit: "Tạo tài khoản",
		name_placeholder: "Nhập họ tên của bạn",
		email_placeholder: "Nhập email của bạn",
		password_placeholder: "Nhập mật khẩu của bạn"
	},
	workspace_access: "Truy cập workspace an toàn",
	workspace_support: "Phiên đăng nhập được mã hóa, đồng bộ bảng công việc và quyền truy cập nhóm trong cùng một nơi.",
	success: {
		avatar: {
			label: "Ảnh đại diện",
			support: "Chạm vào ảnh đại diện để tải ảnh mới lên.",
			change: "Đổi ảnh đại diện",
			update_aria: "Cập nhật ảnh đại diện",
				alt: "Ảnh đại diện của {name}",
			continue: "Tiếp tục đến dashboard",
			skip: "Bỏ qua ảnh đại diện lúc này",
			uploading: "Đang cập nhật ảnh đại diện...",
			updated: "Đã cập nhật ảnh đại diện",
			update_failed: "Cập nhật ảnh đại diện thất bại"
		},
		created_title: "Tạo tài khoản thành công",
		created_subtitle: "Bạn sẽ được chuyển đến dashboard sau 3 giây...",
		welcome_back: "Chào mừng quay lại, {name}!",
		welcome_saved_error: "Không thể lưu trạng thái chào mừng",
		welcome_redirect: "Bạn đã hoàn tất bước chào mừng. Bạn sẽ được chuyển đến dashboard sau 3 giây...",
		loading: {
			login: "Đang đăng nhập...",
			register: "Đang đăng ký..."
		}
	},
	toast: {
		logging_in: "Đang đăng nhập...",
		registering: "Đang đăng ký...",
		register_success: "Đăng ký thành công! Bây giờ bạn có thể đăng nhập."
	}
} as const;

export default auth;

