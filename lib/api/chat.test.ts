import { describe, it, expect, vi, beforeEach } from "vitest";
import { getChatSocket, disconnectChatSocket } from "./chat";
import { io } from "socket.io-client";

vi.mock("socket.io-client", () => {
  return {
    io: vi.fn(() => ({
      disconnect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      id: "mock-chat-socket-id",
      connected: true,
    })),
  };
});

describe("chat socket lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create, disconnect, and recreate chat socket", () => {
    const socket1 = getChatSocket();
    expect(io).toHaveBeenCalledTimes(1);

    const socket2 = getChatSocket();
    expect(io).toHaveBeenCalledTimes(1);
    expect(socket1).toBe(socket2);

    // This will fail initially because disconnectChatSocket is not exported or defined
    disconnectChatSocket();
    expect(socket1.disconnect).toHaveBeenCalledTimes(1);

    const socket3 = getChatSocket();
    expect(io).toHaveBeenCalledTimes(2);
    expect(socket3).not.toBe(socket1);
  });
});
