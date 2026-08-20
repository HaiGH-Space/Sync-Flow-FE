export interface CookieOptions {
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  secure: boolean;
  path: string;
  domain?: string;
}

export const isValidSessionToken = (token: string | undefined): boolean => {
  if (!token || typeof token !== "string") {
    return false;
  }

  const trimmed = token.trim();
  if (!trimmed || trimmed !== token) {
    return false;
  }

  if (trimmed.length > 1024) {
    return false;
  }

  // Token must only contain valid token characters (alphanumeric, hyphens, underscores, dots, tildes, percent encoding)
  const tokenRegex = /^[A-Za-z0-9_\-.~%+]+$/;
  return tokenRegex.test(trimmed);
};

export const getSecureCookieOptions = (domain?: string): CookieOptions => {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(domain ? { domain } : {}),
  };
};

export const getCookieValue = (name: string): string | undefined => {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookies = document.cookie.split(";").map((item) => item.trim());
  for (const entry of cookies) {
    const [key, ...rest] = entry.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return undefined;
};

