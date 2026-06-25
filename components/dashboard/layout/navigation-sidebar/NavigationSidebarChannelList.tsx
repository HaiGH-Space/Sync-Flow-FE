"use client";

import CreateChannelModal from "@/components/dashboard/comp/CreateChannelModal";
import { Button } from "@/components/ui/button";
import type { Channel } from "@/lib/api/channel";
import { ChannelType } from "@/lib/api/channel";
import { cn } from "@/lib/utils";
import { Hash, Loader2, MessageCircle, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type NavigationSidebarChannelListProps = {
  channels?: Channel[];
  isFetching: boolean;
  error?: Error | null;
  selectedChannelId: string;
  onSelectChannelAction: (projectId: string, channelId: string) => void;
  workspaceId: string;
  projectId: string;
};

export function NavigationSidebarChannelList({
  channels,
  isFetching,
  error,
  selectedChannelId,
  onSelectChannelAction,
  workspaceId,
  projectId,
}: NavigationSidebarChannelListProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="mt-2 pl-3">
      <div className="border-l border-border pl-3 space-y-1">
        <div className="sticky top-0 z-10 -ml-3 border-b border-sidebar-border/60 bg-sidebar/95 px-3 pb-2 pt-2 backdrop-blur">
          <CreateChannelModal
            workspaceId={workspaceId}
            projectId={projectId}
            onCreatedAction={(channelId) =>
              onSelectChannelAction(projectId, channelId)
            }
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-start gap-2 px-2 py-1.5 text-muted-foreground hover:text-foreground"
              >
                <PlusIcon className="size-3.5" />
                {t("channel.create.action")}
              </Button>
            }
          />
        </div>
        {isFetching && (
          <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            <span>{t("sidebar.loadingChannels")}</span>
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive">
            {t("sidebar.errorLoadingChannels")}
          </div>
        )}
        {!isFetching && !error && (channels?.length ?? 0) === 0 && (
          <div className="cursor-default text-sm text-muted-foreground">
            {t("sidebar.noChannels")}
          </div>
        )}
        {channels?.map((channel) => {
          const isChannelSelected = selectedChannelId === channel.id;
          const channelName = channel.name?.trim()
            ? channel.name
            : t("sidebar.untitledChannel");

          return (
            <Button
              key={channel.id}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "group h-auto w-full justify-start gap-2 text-left border-l-2 transition-all px-2 py-1.5",
                isChannelSelected
                  ? "bg-primary/10 text-foreground font-medium border-primary rounded-r-md"
                  : "border-transparent hover:bg-sidebar-accent/50 text-sidebar-foreground/75 progress-left-pad",
              )}
              aria-pressed={isChannelSelected}
              onClick={() => onSelectChannelAction(projectId, channel.id)}
            >
              {channel.type === ChannelType.DIRECT ? (
                <MessageCircle
                  className={cn(
                    "size-3.5 shrink-0",
                    isChannelSelected
                      ? "text-primary"
                      : "text-muted-foreground/70 group-hover:text-foreground/70",
                  )}
                />
              ) : (
                <Hash
                  className={cn(
                    "size-3.5 shrink-0",
                    isChannelSelected
                      ? "text-primary"
                      : "text-muted-foreground/70 group-hover:text-foreground/70",
                  )}
                />
              )}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm",
                  isChannelSelected
                    ? "font-medium text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {channelName}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
