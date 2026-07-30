"use client";

import { useEffect } from "react";
import {
  type InfiniteData,
  type QueryClient,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotificationSocket,
  type Notification,
  type NotificationListResponse,
  type NotificationsBulkUpdatedPayload,
} from "@/lib/api/notification";
import { notificationKeys } from "@/queries/notification";

const findNotificationInCache = (
  queryClient: QueryClient,
  notificationId: string,
) => {
  const cachedLists = queryClient.getQueriesData<
    InfiniteData<NotificationListResponse>
  >({ queryKey: notificationKeys.list() });
  const notificationsById = new Map<string, Notification>();

  for (const [, data] of cachedLists) {
    if (!data) {
      continue;
    }
    for (const page of data.pages) {
      for (const item of page.data) {
        notificationsById.set(item.id, item);
      }
    }
  }

  return notificationsById.get(notificationId) ?? null;
};

const findBulkNotificationsInCache = (
  queryClient: QueryClient,
  ids: string[],
) => {
  const cachedLists = queryClient.getQueriesData<
    InfiniteData<NotificationListResponse>
  >({ queryKey: notificationKeys.list() });

  const idSet = new Set(ids);
  const foundNotifications = new Map<string, Notification>();

  for (const [, data] of cachedLists) {
    if (!data) {
      continue;
    }
    for (const page of data.pages) {
      for (const item of page.data) {
        if (idSet.has(item.id)) {
          foundNotifications.set(item.id, item);
        }
      }
    }
  }

  let unreadCountBefore = 0;
  for (const notification of foundNotifications.values()) {
    if (!notification.isRead) {
      unreadCountBefore += 1;
    }
  }

  return {
    foundCount: foundNotifications.size,
    unreadCountBefore,
  };
};

const prependNotification = (
  previous: InfiniteData<NotificationListResponse>,
  notification: Notification,
): InfiniteData<NotificationListResponse> => {
  const alreadyExists = previous.pages.some((page) =>
    page.data.some((item) => item.id === notification.id),
  );
  if (alreadyExists) {
    return previous;
  }

  if (previous.pages.length === 0) {
    return previous;
  }

  const nextPages = [...previous.pages];
  const firstPage = nextPages[0];
  nextPages[0] = {
    ...firstPage,
    data: [notification, ...firstPage.data],
  };

  return {
    ...previous,
    pages: nextPages,
  };
};

const replaceNotification = (
  previous: InfiniteData<NotificationListResponse>,
  notification: Notification,
): InfiniteData<NotificationListResponse> => {
  const nextPages = previous.pages.map((page) => {
    const index = page.data.findIndex((item) => item.id === notification.id);
    if (index === -1) {
      return page;
    }

    const nextData = [...page.data];
    nextData[index] = notification;
    return {
      ...page,
      data: nextData,
    };
  });

  return {
    ...previous,
    pages: nextPages,
  };
};

const replaceBulkNotifications = (
  previous: InfiniteData<NotificationListResponse>,
  ids: string[],
  isRead: boolean,
): InfiniteData<NotificationListResponse> => {
  const idSet = new Set(ids);
  const now = isRead ? new Date().toISOString() : null;

  const nextPages = previous.pages.map((page) => {
    let hasMatch = false;
    const nextData = page.data.map((item) => {
      if (idSet.has(item.id)) {
        hasMatch = true;
        return {
          ...item,
          isRead,
          readAt: now,
        };
      }
      return item;
    });

    return hasMatch ? { ...page, data: nextData } : page;
  });

  return {
    ...previous,
    pages: nextPages,
  };
};

export function useNotificationChannel() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getNotificationSocket();

    const handleCreated = (notification: Notification) => {
      queryClient.setQueriesData<InfiniteData<NotificationListResponse>>(
        { queryKey: notificationKeys.list() },
        (old) => (old ? prependNotification(old, notification) : old),
      );

      if (!notification.isRead) {
        queryClient.setQueryData<number>(
          notificationKeys.unreadCount(),
          (old) => (typeof old === "number" ? old + 1 : old),
        );
      }
    };

    const handleUpdated = (notification: Notification) => {
      const previous = findNotificationInCache(queryClient, notification.id);
      const previousIsRead = previous?.isRead;

      queryClient.setQueriesData<InfiniteData<NotificationListResponse>>(
        { queryKey: notificationKeys.list() },
        (old) => (old ? replaceNotification(old, notification) : old),
      );

      if (previousIsRead === undefined) {
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount(),
        });
        return;
      }

      if (previousIsRead !== notification.isRead) {
        const delta = notification.isRead ? -1 : 1;
        queryClient.setQueryData<number>(
          notificationKeys.unreadCount(),
          (old) => (typeof old === "number" ? Math.max(0, old + delta) : old),
        );
      }
    };

    const handleBulkUpdated = (payload: NotificationsBulkUpdatedPayload) => {
      const { ids, status } = payload;
      const isRead = status === "READ";

      const { foundCount, unreadCountBefore } = findBulkNotificationsInCache(
        queryClient,
        ids,
      );

      queryClient.setQueriesData<InfiniteData<NotificationListResponse>>(
        { queryKey: notificationKeys.list() },
        (old) => (old ? replaceBulkNotifications(old, ids, isRead) : old),
      );

      const allFound = foundCount === ids.length;

      if (!allFound) {
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount(),
        });
        return;
      }

      if (isRead) {
        queryClient.setQueryData<number>(
          notificationKeys.unreadCount(),
          (old) =>
            typeof old === "number" ? Math.max(0, old - unreadCountBefore) : old,
        );
      } else {
        const newlyUnread = ids.length - unreadCountBefore;
        queryClient.setQueryData<number>(
          notificationKeys.unreadCount(),
          (old) => (typeof old === "number" ? old + newlyUnread : old),
        );
      }
    };

    socket.on("notification_created", handleCreated);
    socket.on("notification_updated", handleUpdated);
    socket.on("notifications_bulk_updated", handleBulkUpdated);

    return () => {
      socket.off("notification_created", handleCreated);
      socket.off("notification_updated", handleUpdated);
      socket.off("notifications_bulk_updated", handleBulkUpdated);
    };
  }, [queryClient]);
}
