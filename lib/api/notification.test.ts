import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getNotificationSocket,
  disconnectNotificationSocket,
  notificationService,
  type NotificationsBulkUpdatedPayload,
} from "./notification";
import { io } from "socket.io-client";
import { api } from "./api";

vi.mock("./api", () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock("socket.io-client", () => {
  return {
    io: vi.fn(() => ({
      disconnect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      id: "mock-notification-socket-id",
      connected: true,
    })),
  };
});

describe("notification socket lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create, disconnect, and recreate notification socket", () => {
    const socket1 = getNotificationSocket();
    expect(io).toHaveBeenCalledTimes(1);

    const socket2 = getNotificationSocket();
    expect(io).toHaveBeenCalledTimes(1);
    expect(socket1).toBe(socket2);

    disconnectNotificationSocket();
    expect(socket1.disconnect).toHaveBeenCalledTimes(1);

    const socket3 = getNotificationSocket();
    expect(io).toHaveBeenCalledTimes(2);
    expect(socket3).not.toBe(socket1);
  });
});

describe("notification types", () => {
  it("should have correct structure for NotificationsBulkUpdatedPayload", () => {
    const payload: NotificationsBulkUpdatedPayload = {
      ids: ["notif-1", "notif-2"],
      status: "READ",
    };
    expect(payload.ids).toEqual(["notif-1", "notif-2"]);
    expect(payload.status).toBe("READ");
  });
});

describe("notificationService REST API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch notifications with default parameters when none passed", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ statusCode: 200, message: "OK", data: [] });
    const res = await notificationService.getNotifications();
    expect(api.get).toHaveBeenCalledWith("/notifications/me");
    expect(res).toEqual({ data: [], nextPage: null });
  });

  it("should fetch notifications with explicit pagination params", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ statusCode: 200, message: "OK", data: [{ id: "n1" }] });
    const res = await notificationService.getNotifications({ page: 2, limit: 1 });
    expect(api.get).toHaveBeenCalledWith("/notifications/me?page=2&limit=1");
    expect(res).toEqual({ data: [{ id: "n1" }], nextPage: 3 });
  });

  it("should fetch unread notification count", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ statusCode: 200, message: "OK", data: { count: 5 } });
    const count = await notificationService.getUnreadCount();
    expect(api.get).toHaveBeenCalledWith("/notifications/me/unread-count");
    expect(count).toBe(5);
  });

  it("should mark a single notification as read", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ statusCode: 200, message: "OK", data: { id: "n-1", isRead: true } });
    await notificationService.markAsRead("n-1");
    expect(api.patch).toHaveBeenCalledWith("/notifications/n-1/read", {});
  });

  it("should mark all notifications as read", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ statusCode: 200, message: "OK", data: [] });
    await notificationService.markAllAsRead();
    expect(api.patch).toHaveBeenCalledWith("/notifications/me/read-all", {});
  });
});
