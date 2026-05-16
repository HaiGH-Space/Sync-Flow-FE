import { ApiRequestError } from "@/lib/api/api";
import {
  notificationService,
  type NotificationListResponse,
  NOTIFICATION_PAGE_SIZE,
} from "@/lib/api/notification";
import { CustomInfiniteQueryOptions } from "@/types/query-option";
import {
  InfiniteData,
  infiniteQueryOptions,
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  listByLimit: (limit: number) => [...notificationKeys.list(), limit] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function createNotificationsInfiniteOptions<
  TData = InfiniteData<NotificationListResponse>,
>(
  params?: { limit?: number },
  options?: CustomInfiniteQueryOptions<NotificationListResponse, TData>,
) {
  const limit = params?.limit ?? NOTIFICATION_PAGE_SIZE;

  return infiniteQueryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: notificationKeys.listByLimit(limit),
    queryFn: ({ pageParam }) =>
      notificationService.getNotifications({
        page: (pageParam as number) ?? 1,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? null,
  });
}

export function createNotificationUnreadCountOptions<TData = number>(
  options?: Omit<
    UseQueryOptions<number, ApiRequestError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    staleTime: 1000 * 30,
    ...options,
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.getUnreadCount(),
  });
}
