export const DEFAULT_API_URL = "http://localhost:8000";
export const API_PREFIX = "/api-proxy";

/**
 * Returns the backend API URL from the environment, falling back to the default local port.
 */
export function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
}

/**
 * Resolves the final API request URL based on execution context.
 * - On the client: returns a relative URL using the API_PREFIX (e.g., /api-proxy/endpoint).
 * - On the server: bypasses the proxy and fetches directly from the backend URL to optimize speed and avoid local port mismatches.
 */
export function resolveApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const cleanPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Server-side: fetch directly from the backend
  if (typeof window === "undefined") {
    const backendUrl = getBackendUrl().replace(/\/+$/, "");
    const pathWithoutPrefix = cleanPath.startsWith(API_PREFIX)
      ? cleanPath.slice(API_PREFIX.length)
      : cleanPath;
    return `${backendUrl}${pathWithoutPrefix}`;
  }

  // Client-side: use the proxy prefix
  const finalPath = cleanPath.startsWith(API_PREFIX)
    ? cleanPath
    : `${API_PREFIX}${cleanPath}`;
  return finalPath;
}

/**
 * Resolves the Socket.IO server connection URL for the given namespace.
 */
export function getWebSocketUrl(namespace: "chat" | "notifications"): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  let baseUrl = "";
  if (raw && raw.trim()) {
    baseUrl = raw.replace(/\/+$/, "").replace(new RegExp(`\\/${namespace}$`), "");
  } else if (typeof window !== "undefined") {
    baseUrl = window.location.origin;
  } else {
    baseUrl = DEFAULT_API_URL;
  }
  return `${baseUrl}/${namespace}`;
}
