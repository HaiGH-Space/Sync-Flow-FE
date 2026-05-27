"use client";

import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "./types";
import { MessageBubble } from "./MessageBubble";
import { useTranslations } from "next-intl";

type MessageListProps = {
  messages: ChatMessage[];
  currentUserId: string;
};

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("dashboard");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-4 text-sm text-muted-foreground">
        {t("chatRightPanel.noMessages")}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 py-4">
      <div className="flex flex-col gap-4 pr-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.sender.id === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
