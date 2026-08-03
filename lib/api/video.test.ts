import { describe, it, expect, vi } from "vitest";
import { api } from "./api";
import { videoService } from "./video";

vi.mock("./api", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("videoService", () => {
  it("getVideoToken calls POST video/token", async () => {
    const mockResponse = {
      statusCode: 200,
      message: "Success",
      data: { token: "test-token", roomName: "channel:123", wsUrl: "wss://lk.test" },
    };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse as never);
    const res = await videoService.getVideoToken("ws-1", "ch-1");
    expect(api.post).toHaveBeenCalledWith("workspaces/ws-1/channels/ch-1/video/token", {});
    expect(res.data.token).toBe("test-token");
  });
});
