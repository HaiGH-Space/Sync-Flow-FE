"use client";

import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/mutations/notification";
import { useNotificationChannel } from "@/hooks/notifications/use-notification-channel";
import { createDateFormatter } from "@/lib/format-date";
import { type Notification } from "@/lib/api/notification";
import {
  createNotificationUnreadCountOptions,
  createNotificationsInfiniteOptions,
} from "@/queries/notification";

export default function NotificationsMenu() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const formatDate = useMemo(() => createDateFormatter(locale), [locale]);
  useNotificationChannel();

  const { data: unreadCount = 0 } = useQuery(
    createNotificationUnreadCountOptions(),
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(createNotificationsInfiniteOptions());

  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const hasUnread = unreadCount > 0;

  const handleMarkRead = (notification: Notification) => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label={t("notifications.title")}
        >
          <Bell className="size-5" />
          {hasUnread ? (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
              {unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold">
            {t("notifications.title")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => markAllRead()}
            disabled={!hasUnread || isMarkingAll}
          >
            <CheckCheck className="size-4" />
            {t("notifications.markAll")}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="max-h-105">
          {isLoading ? (
            <div className="space-y-3 p-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground">
              {t("notifications.empty")}
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="flex w-full gap-3 p-3 text-left transition hover:bg-muted/50"
                  onClick={() => handleMarkRead(notification)}
                >
                  <span
                    className={`mt-2 h-2 w-2 rounded-full ${
                      notification.isRead ? "bg-transparent" : "bg-primary"
                    }`}
                    aria-hidden
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {notification.message ? (
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    ) : null}
                    <p className="text-[11px] text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        {hasNextPage ? (
          <div className="px-3 py-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {t("notifications.loadMore")}
            </Button>
          </div>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
