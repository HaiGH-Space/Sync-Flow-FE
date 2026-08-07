import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, type InfiniteData } from "@tanstack/react-query";
import { useNotificationChannel } from "./use-notification-channel";
import { type NotificationListResponse } from "@/lib/api/notification";
import { notificationKeys } from "@/queries/notification";

let effectCallback: (() => void | (() => void)) | undefined;

vi.mock("react", () => {
  return {
    useEffect: vi.fn((cb: () => void | (() => void)) => {
      effectCallback = cb;
    }),
  };
});

vi.mock("@/lib/store/use-user-profile", () => ({
  useUserStore: vi.fn((selector) =>
    selector ? selector({ token: "test-token" }) : { token: "test-token" },
  ),
}));

const mockSocketOn = vi.fn();
const mockSocketOff = vi.fn();

vi.mock("@/lib/api/notification", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/notification")>();
  return {
    ...actual,
    getNotificationSocket: vi.fn(() => ({
      on: mockSocketOn,
      off: mockSocketOff,
    })),
  };
});

const mockUseQueryClient = vi.fn();
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: () => mockUseQueryClient(),
  };
});

describe("useNotificationChannel", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    effectCallback = undefined;
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockUseQueryClient.mockReturnValue(queryClient);
  });

  it("should register and deregister socket handlers on mount/unmount", () => {
    useNotificationChannel();

    expect(effectCallback).toBeDefined();
    const cleanup = effectCallback ? effectCallback() : undefined;

    expect(mockSocketOn).toHaveBeenCalledWith(
      "notifications_bulk_updated",
      expect.any(Function),
    );

    if (cleanup) cleanup();

    expect(mockSocketOff).toHaveBeenCalledWith(
      "notifications_bulk_updated",
      expect.any(Function),
    );
  });

  it("should update cached notifications and decrement unread count when all ids are found in cache", () => {
    useNotificationChannel();
    if (effectCallback) effectCallback();

    const bulkHandler = mockSocketOn.mock.calls.find(
      (call) => call[0] === "notifications_bulk_updated",
    )?.[1];

    expect(bulkHandler).toBeDefined();

    const initialCache: InfiniteData<NotificationListResponse> = {
      pageParams: [1],
      pages: [
        {
          data: [
            {
              id: "n1",
              userId: "u1",
              workspaceInviteId: null,
              type: "WORKSPACE_INVITE",
              title: "N1",
              message: null,
              isRead: false,
              readAt: null,
              createdAt: "2026-01-01",
              updatedAt: "2026-01-01",
            },
            {
              id: "n2",
              userId: "u1",
              workspaceInviteId: null,
              type: "WORKSPACE_INVITE",
              title: "N2",
              message: null,
              isRead: false,
              readAt: null,
              createdAt: "2026-01-01",
              updatedAt: "2026-01-01",
            },
          ],
          nextPage: null,
        },
      ],
    };

    queryClient.setQueryData(notificationKeys.list(), initialCache);
    queryClient.setQueryData(notificationKeys.unreadCount(), 5);

    bulkHandler({ ids: ["n1", "n2"], status: "READ" });

    const updatedCache = queryClient.getQueryData<InfiniteData<NotificationListResponse>>(
      notificationKeys.list(),
    );
    expect(updatedCache?.pages[0].data[0].isRead).toBe(true);
    expect(updatedCache?.pages[0].data[1].isRead).toBe(true);

    const unreadCount = queryClient.getQueryData<number>(
      notificationKeys.unreadCount(),
    );
    expect(unreadCount).toBe(3);
  });

  it("should invalidate unreadCount query when some affected ids are missing from cache", () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    useNotificationChannel();
    if (effectCallback) effectCallback();

    const bulkHandler = mockSocketOn.mock.calls.find(
      (call) => call[0] === "notifications_bulk_updated",
    )?.[1];

    expect(bulkHandler).toBeDefined();

    const initialCache: InfiniteData<NotificationListResponse> = {
      pageParams: [1],
      pages: [
        {
          data: [
            {
              id: "n1",
              userId: "u1",
              workspaceInviteId: null,
              type: "WORKSPACE_INVITE",
              title: "N1",
              message: null,
              isRead: false,
              readAt: null,
              createdAt: "2026-01-01",
              updatedAt: "2026-01-01",
            },
          ],
          nextPage: null,
        },
      ],
    };

    queryClient.setQueryData(notificationKeys.list(), initialCache);

    bulkHandler({ ids: ["n1", "n2-uncached"], status: "READ" });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationKeys.unreadCount(),
    });
  });
});
