import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNotificationSocket, disconnectNotificationSocket } from "./notification";
import { io } from "socket.io-client";

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

    // This will fail initially because disconnectNotificationSocket is not exported or defined
    disconnectNotificationSocket();
    expect(socket1.disconnect).toHaveBeenCalledTimes(1);

    const socket3 = getNotificationSocket();
    expect(io).toHaveBeenCalledTimes(2);
    expect(socket3).not.toBe(socket1);
  });
});
