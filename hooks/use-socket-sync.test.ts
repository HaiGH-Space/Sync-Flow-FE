import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSocketSync } from "./use-socket-sync";
import { useUserStore } from "@/lib/store/use-user-profile";
import { disconnectChatSocket } from "@/lib/api/chat";
import { disconnectNotificationSocket } from "@/lib/api/notification";

let effectCallback: (() => void) | undefined;

vi.mock("react", () => {
  return {
    useEffect: vi.fn((cb) => {
      effectCallback = cb;
    }),
  };
});

vi.mock("@/lib/api/chat", () => ({
  disconnectChatSocket: vi.fn(),
}));

vi.mock("@/lib/api/notification", () => ({
  disconnectNotificationSocket: vi.fn(),
}));

describe("useSocketSync hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    effectCallback = undefined;
    useUserStore.setState({ userProfile: undefined });
  });

  it("should subscribe to useUserStore and disconnect sockets on logout or swap", () => {
    useSocketSync();

    expect(effectCallback).toBeDefined();
    const cleanup = (effectCallback as any)();

    // Trigger user profile transition to initialized
    useUserStore.setState({
      userProfile: {
        id: "user-1",
        name: "User 1",
        email: "u1@example.com",
        emailVerified: true,
        hasSeenWelcome: true,
      },
    });

    // No disconnect calls should have run for initial login/load
    expect(disconnectChatSocket).not.toHaveBeenCalled();
    expect(disconnectNotificationSocket).not.toHaveBeenCalled();

    // Transition: user profile swaps to another user ID
    useUserStore.setState({
      userProfile: {
        id: "user-2",
        name: "User 2",
        email: "u2@example.com",
        emailVerified: true,
        hasSeenWelcome: true,
      },
    });

    expect(disconnectChatSocket).toHaveBeenCalledTimes(1);
    expect(disconnectNotificationSocket).toHaveBeenCalledTimes(1);

    vi.clearAllMocks();

    // Transition: user profile becomes undefined (logout)
    useUserStore.setState({ userProfile: undefined });

    expect(disconnectChatSocket).toHaveBeenCalledTimes(1);
    expect(disconnectNotificationSocket).toHaveBeenCalledTimes(1);

    cleanup();
  });
});
