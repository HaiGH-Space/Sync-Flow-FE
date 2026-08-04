import { describe, it, expect } from "vitest";
import { useCallStore } from "./use-call-store";

describe("useCallStore", () => {
  it("joins and leaves call correctly", () => {
    const { joinCall, leaveCall } = useCallStore.getState();
    joinCall({
      workspaceId: "ws-1",
      channelId: "ch-1",
      roomName: "channel:ch-1",
      token: "jwt-token",
      wsUrl: "wss://lk.test",
    });

    expect(useCallStore.getState().activeCall?.channelId).toBe("ch-1");

    leaveCall();
    expect(useCallStore.getState().activeCall).toBeNull();
  });
});
