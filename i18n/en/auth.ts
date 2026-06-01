const auth = {
	login: {
		title: "Welcome back",
		subtitle: "Welcome back! Please sign in to your account.",
		submit: "Sign in",
		email_placeholder: "Enter your email",
		password_placeholder: "Enter your password",
		no_account: "Don't have an account?",
		go_to_register: "Sign up",
		have_account: "Already have an account?",
		go_to_login: "Sign in",
		divider_text: "or continue with"
	},
	register: {
		title: "Create account",
		subtitle: "Create a new account to get started.",
		submit: "Create account",
		name_placeholder: "Enter your full name",
		email_placeholder: "Enter your email",
		password_placeholder: "Enter your password"
	},
	workspace_access: "Secure workspace access",
	workspace_support: "Encrypted sessions, board sync, and team access in one place.",
	success: {
		avatar: {
			label: "Avatar",
			support: "Tap the avatar to upload a new photo.",
			change: "Change avatar",
			update_aria: "Update avatar",
				alt: "{name} avatar",
			continue: "Continue to dashboard",
			skip: "Skip avatar for now",
			uploading: "Updating avatar...",
			updated: "Avatar updated",
			update_failed: "Update avatar failed"
		},
		created_title: "Account created successfully",
		created_subtitle: "Redirecting you to the dashboard in 3 seconds...",
		welcome_back: "Welcome back, {name}!",
		welcome_saved_error: "Failed to save welcome state",
		welcome_redirect: "You have already completed the welcome step. Redirecting you to the dashboard in 3 seconds...",
		loading: {
			login: "Signing in...",
			register: "Signing up..."
		}
	},
	toast: {
		logging_in: "Signing in...",
		registering: "Signing up...",
		register_success: "Sign up successfully! You can sign in now."
	}
} as const;

export default auth;

