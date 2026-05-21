"use client";

import { useParams } from "next/navigation";

import { ChannelHeader } from "@/components/dashboard/chat/ChannelHeader";
import { Composer } from "@/components/dashboard/chat/Composer";
import { MessageList } from "@/components/dashboard/chat/MessageList";
import { useProfile } from "@/hooks/use-profile";
import { useChatChannel } from "@/hooks/chat/use-chat-channel";

export default function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: profile } = useProfile();
  const { messages, error, isLoading, sendMessage } = useChatChannel(channelId);
  const currentUserId = profile?.id ?? "";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChannelHeader />
      {error ? (
        <div className="flex-1 min-h-0 py-4 text-sm text-destructive">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex-1 min-h-0 py-4 text-sm text-muted-foreground">
          Loading messages…
        </div>
      ) : (
        <MessageList messages={messages} currentUserId={currentUserId} />
      )}
      <Composer onSendAction={sendMessage} />
    </div>
  );
}
