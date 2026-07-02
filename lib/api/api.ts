interface BaseResponse {
  statusCode: number;
  message: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data: T;
  error?: never;
}

export interface ApiError extends BaseResponse {
  error: string;
  data?: never;
}

export class ApiRequestError extends Error implements ApiError {
  statusCode: number;
  error: string;

  constructor(data: ApiError) {
    super(data.message);
    this.name = "ApiRequestError";
    this.statusCode = data.statusCode;
    this.error = data.error;
  }
}

import { resolveApiUrl } from "./api-config";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const fullUrl = resolveApiUrl(endpoint);
  const isFormDataBody =
    typeof FormData !== "undefined" &&
    typeof options.body !== "undefined" &&
    options.body instanceof FormData;

  const headers = new Headers(options.headers);
  if (!isFormDataBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const option: RequestInit = {
    ...options,
    credentials: "include", // Include cookies for cross-origin requests
    headers,
  };
  const response = await fetch(fullUrl, option);
  const responseText = await response.text();
  let responseData;
  try {
    responseData = responseText ? JSON.parse(responseText) : {};
  } catch {
    responseData = null;
  }
  if (!response.ok) {
    const errorDetail: ApiError = {
      statusCode: response.status,
      message: responseData?.message || "Request failed",
      error:
        responseData?.error ||
        responseText ||
        response.statusText ||
        "Internal Server Error",
    };
    throw new ApiRequestError(errorDetail);
  }
  return responseData as ApiResponse<T>;
}

export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, data: unknown, options?: RequestInit) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(data) }),
  postForm: <T>(url: string, data: FormData, options?: RequestInit) =>
    request<T>(url, { ...options, method: "POST", body: data }),
  patch: <T>(url: string, data: unknown, options?: RequestInit) =>
    request<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
