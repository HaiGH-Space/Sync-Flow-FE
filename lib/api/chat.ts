import { io, type Socket } from "socket.io-client";

import type { Message } from "@/lib/api/message";
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

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookies = document.cookie.split(";").map((item) => item.trim());
  for (const entry of cookies) {
    const [key, ...rest] = entry.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return undefined;
};

export const getChatSocket = () => {
  if (chatSocket) {
    if (process.env.NODE_ENV !== "production") {
      const existingToken = getCookieValue("session_token");
      console.debug("[chat] reuse socket", {
        id: chatSocket.id,
        connected: chatSocket.connected,
        hasSessionToken: !!existingToken,
      });
    }
    return chatSocket;
  }

  const socketUrl = getWebSocketUrl("chat");
  const sessionToken = getCookieValue("session_token");
  if (process.env.NODE_ENV !== "production") {
    console.debug("[chat] create socket", {
      socketUrl,
      hasSessionToken: !!sessionToken,
    });
  }
  chatSocket = io(socketUrl, {
    withCredentials: true,
    autoConnect: true,
    auth: sessionToken ? { session_token: sessionToken } : undefined,
  });

  if (process.env.NODE_ENV !== "production") {
    chatSocket.on("connect", () => {
      const latestToken = getCookieValue("session_token");
      console.debug("[chat] connected", {
        id: chatSocket?.id,
        hasSessionToken: !!latestToken,
      });
    });
    chatSocket.on("connect_error", (err) => {
      console.debug("[chat] connect_error", {
        message: err?.message,
      });
    });
  }

  return chatSocket;
};
