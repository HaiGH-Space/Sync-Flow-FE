import { api } from "./api";
import { UserProfile } from "./user";

const AUTH_BASE_URL = "/auth";
const SESSION_COOKIE_NAME = "session_token";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

async function login({ email, password }: LoginRequest) {
  return await api.post<UserProfile>(`${AUTH_BASE_URL}/login`, {
    email,
    password,
  });
}

async function register({ email, password, name }: RegisterRequest) {
  return await api.post<UserProfile>(`${AUTH_BASE_URL}/register`, {
    email,
    password,
    name,
  });
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;

  document.cookie = `${SESSION_COOKIE_NAME}=; Max-Age=0; path=/`;
}

async function logout() {
  clearSessionCookie();
}

export const authService = {
  login,
  register,
  logout,
};
