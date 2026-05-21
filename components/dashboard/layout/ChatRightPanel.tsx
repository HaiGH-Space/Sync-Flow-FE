"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/lib/store/use-dashboard";
import { useProfile } from "@/hooks/use-profile";
import { ChannelHeader } from "@/components/dashboard/chat/ChannelHeader";
import { MessageList } from "@/components/dashboard/chat/MessageList";
import { Composer } from "@/components/dashboard/chat/Composer";
import { useChatChannel } from "@/hooks/chat/use-chat-channel";

export function ChatRightPanel() {
  const isOpenSidebarRight = useDashboard((state) => state.isOpenSidebarRight);
  const setOpenSidebarRight = useDashboard(
    (state) => state.setOpenSidebarRight,
  );
  const selectedChannelId = useDashboard((state) => state.selectedChannelId);
  const { messages, error, isLoading, sendMessage } = useChatChannel(
    selectedChannelId || undefined,
  );
  const { data: profile } = useProfile();
  const currentUserId = profile?.id ?? "";

  if (!isOpenSidebarRight) {
    return null;
  }

  return (
    <aside className="flex h-full min-h-0 w-96 shrink-0 flex-col border-l border-border/70 bg-background">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Chat</p>
          <p className="text-xs text-muted-foreground">
            {selectedChannelId ? "Active channel" : "No channel selected"}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setOpenSidebarRight(false)}
          aria-label="Close chat panel"
        >
          <X className="size-4" />
        </Button>
      </div>

      <Tabs
        defaultValue="chat"
        className="flex h-full min-h-0 flex-col overflow-hidden"
      >
        <TabsList variant="line" className="px-4 pt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent
          value="chat"
          className="flex h-full min-h-0 flex-col overflow-hidden"
        >
          {selectedChannelId ? (
            <div className="flex h-full min-h-0 flex-col px-4 pb-4">
              <div className="shrink-0">
                <ChannelHeader title="Channel" />
              </div>
              {error ? (
                <div className="flex-1 min-h-0 py-4 text-sm text-destructive">
                  {error}
                </div>
              ) : isLoading ? (
                <div className="flex-1 min-h-0 py-4 text-sm text-muted-foreground">
                  Loading messages…
                </div>
              ) : (
                <MessageList
                  messages={messages}
                  currentUserId={currentUserId}
                />
              )}
              <div className="shrink-0">
                <Composer onSendAction={sendMessage} />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              Select a channel on the left to start chatting.
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="activity"
          className="flex h-full min-h-0 flex-col overflow-hidden"
        >
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Activity feed coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
