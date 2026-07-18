"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getChatSocket } from "@/lib/api/chat";
import { logger } from "@/lib/logger";
import {
  messageService,
  type GetMessagesResponse,
  type Message,
} from "@/lib/api/message";

const messageQueryKey = (channelId: string) => ["channel-messages", channelId];

type SocketErrorState = {
  message: string;
  channelId?: string;
} | null;

export function useChatChannel(channelId?: string) {
  const [socketError, setSocketError] = useState<SocketErrorState>(null);
  const activeChannelIdRef = useRef<string | undefined>(channelId);
  const queryClient = useQueryClient();

  useEffect(() => {
    activeChannelIdRef.current = channelId;
  }, [channelId]);

  const {
    data: messageResponse,
    isLoading,
    error,
  } = useQuery<GetMessagesResponse, Error>({
    queryKey: ["channel-messages", channelId ?? ""],
    enabled: !!channelId,
    queryFn: () => messageService.getMessages(channelId ?? "", null),
  });

  useEffect(() => {
    const socket = getChatSocket();

    const handleNewMessage = (message: Message) => {
      if (message.channelId !== activeChannelIdRef.current) {
        return;
      }

      queryClient.setQueryData<GetMessagesResponse>(
        messageQueryKey(message.channelId),
        (prev) => {
          const previous = prev ?? { data: [], nextCursor: null };
          return {
            ...previous,
            data: [...previous.data, message],
          };
        },
      );
    };

    const handleError = (payload: { message: string }) => {
      setSocketError({
        message: payload.message,
        channelId: activeChannelIdRef.current,
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("error", handleError);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!channelId) {
      return;
    }

    const socket = getChatSocket();
    const joinChannel = () => {
      logger.debug("[chat] join_channel", {
        channelId,
        socketId: socket.id,
        connected: socket.connected,
      });
      socket.emit("join_channel", { channelId }, (response) => {
        logger.debug("[chat] join_ack", {
          channelId,
          socketId: socket.id,
          response,
        });
      });
    };

    if (socket.connected) {
      joinChannel();
    }

    socket.on("connect", joinChannel);

    return () => {
      socket.off("connect", joinChannel);
    };
  }, [channelId]);

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !channelId) {
      return;
    }

    const socket = getChatSocket();
    logger.debug("[chat] send_message", {
      channelId,
      socketId: socket.id,
      connected: socket.connected,
    });
    socket.emit("send_message", { channelId, content: trimmed });
  };

  const messages = channelId ? (messageResponse?.data ?? []) : [];
  const errorMessage =
    (socketError && socketError.channelId === channelId
      ? socketError.message
      : null) ??
    (error as Error | null)?.message ??
    null;

  return {
    messages,
    isLoading,
    error: errorMessage,
    sendMessage,
  };
}
