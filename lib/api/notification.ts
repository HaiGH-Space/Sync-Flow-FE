import { io, type Socket } from "socket.io-client";

import { api } from "./api";
import { getWebSocketUrl } from "./api-config";

export type NotificationType = "WORKSPACE_INVITE";

export type WorkspaceInvite = {
  id: string;
  workspaceId: string;
  inviterId: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  workspace: Record<string, unknown>;
  inviter: Record<string, unknown>;
};

export type Notification = {
  id: string;
  userId: string;
  workspaceInviteId: string | null;
  type: NotificationType;
  title: string;
  message: string | null;
  workspaceInvite?: WorkspaceInvite | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationListResponse = {
  data: Notification[];
  nextPage: number | null;
};

export const NOTIFICATION_PAGE_SIZE = 10;

async function getNotifications(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? NOTIFICATION_PAGE_SIZE;
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined || params?.limit !== undefined) {
    searchParams.set("page", String(page));
    searchParams.set("limit", String(limit));
  }

  const query = searchParams.toString();
  const response = await api.get<Notification[]>(
    `/notifications/me${query ? `?${query}` : ""}`,
  );

  const data = response.data ?? [];
  const shouldPaginate =
    params?.page !== undefined || params?.limit !== undefined;
  const nextPage = shouldPaginate && data.length === limit ? page + 1 : null;

  return {
    data,
    nextPage,
  } satisfies NotificationListResponse;
}

async function getUnreadCount() {
  const response = await api.get<{ count: number }>(
    "/notifications/me/unread-count",
  );

  return response.data?.count ?? 0;
}

async function markAsRead(notificationId: string) {
  return api.patch<Notification>(`/notifications/${notificationId}/read`, {});
}

async function markAllAsRead() {
  return api.patch<Notification[]>("/notifications/me/read-all", {});
}

type NotificationServerEvents = {
  notification_created: (notification: Notification) => void;
  notification_updated: (notification: Notification) => void;
  error: (payload: { message: string }) => void;
};

type NotificationClientEvents = Record<string, never>;

let notificationSocket: Socket<
  NotificationServerEvents,
  NotificationClientEvents
> | null = null;

const getCookieValue = (name: string) => {
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

export const getNotificationSocket = () => {
  if (notificationSocket) {
    if (process.env.NODE_ENV !== "production") {
      const existingToken = getCookieValue("session_token");
      console.debug("[notifications] reuse socket", {
        id: notificationSocket.id,
        connected: notificationSocket.connected,
        hasSessionToken: !!existingToken,
      });
    }
    return notificationSocket;
  }

  const socketUrl = getWebSocketUrl("notifications");
  const sessionToken = getCookieValue("session_token");
  if (process.env.NODE_ENV !== "production") {
    console.debug("[notifications] create socket", {
      socketUrl,
      hasSessionToken: !!sessionToken,
    });
  }
  notificationSocket = io(socketUrl, {
    withCredentials: true,
    autoConnect: true,
    auth: sessionToken ? { session_token: sessionToken } : undefined,
  });

  if (process.env.NODE_ENV !== "production") {
    notificationSocket.on("connect", () => {
      const latestToken = getCookieValue("session_token");
      console.debug("[notifications] connected", {
        id: notificationSocket?.id,
        hasSessionToken: !!latestToken,
      });
    });
    notificationSocket.on("connect_error", (err) => {
      console.debug("[notifications] connect_error", {
        message: err?.message,
      });
    });
  }

  return notificationSocket;
};

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
