import { io, type Socket } from "socket.io-client";

import type { Message } from "@/lib/api/message";
import { getCookieValue } from "@/lib/cookies";
import { logger } from "@/lib/logger";
import { getWebSocketUrl } from "./api-config";

type ChatServerEvents = {
  new_message: (message: Message) => void;
  error: (payload: { message: string }) => void;
};

type ChatClientEvents = {
  join_channel: (
    payload: { channelId: string },
    ack?: (response: { status: string; message: string }) => void,
  ) => void;
  send_message: (payload: { channelId: string; content: string }) => void;
};

let chatSocket: Socket<ChatServerEvents, ChatClientEvents> | null = null;

export const getChatSocket = (token?: string) => {
  const sessionToken = token || getCookieValue("session_token");
  if (chatSocket) {
    if (sessionToken && chatSocket.io.opts) {
      chatSocket.io.opts.auth = {
        ...(chatSocket.io.opts.auth as Record<string, unknown> | undefined),
        session_token: sessionToken,
      };
    }
    logger.debug("[chat] reuse socket", {
      id: chatSocket.id,
      connected: chatSocket.connected,
      hasSessionToken: !!sessionToken,
    });
    return chatSocket;
  }

  const socketUrl = getWebSocketUrl("chat");
  logger.debug("[chat] create socket", {
    socketUrl,
    hasSessionToken: !!sessionToken,
  });
  chatSocket = io(socketUrl, {
    withCredentials: true,
    autoConnect: true,
    auth: sessionToken ? { session_token: sessionToken } : undefined,
  });

  chatSocket.on("connect", () => {
    const latestToken = token || getCookieValue("session_token");
    logger.debug("[chat] connected", {
      id: chatSocket?.id,
      hasSessionToken: !!latestToken,
    });
  });
  chatSocket.on("connect_error", (err) => {
    logger.debug("[chat] connect_error", {
      message: err?.message,
    });
  });

  return chatSocket;
};

export const disconnectChatSocket = () => {
  if (chatSocket) {
    logger.debug("[chat] disconnecting socket", { id: chatSocket.id });
    chatSocket.disconnect();
    chatSocket = null;
  }
};

