"use client";

import React, { useEffect } from "react";
import { VideoConference, useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useCallStore } from "@/lib/store/use-call-store";
import { Loader2 } from "lucide-react";

interface Props {
  workspaceId: string;
  channelId: string;
}

export function ChannelCallPanel({ channelId }: Props) {
  const activeCall = useCallStore((s) => s.activeCall);
  const isMinimized = useCallStore((s) => s.isMinimized);
  const setMinimized = useCallStore((s) => s.setMinimized);

  const connectionState = useConnectionState();

  useEffect(() => {
    if (activeCall?.channelId === channelId && isMinimized) {
      setMinimized(false);
    }
  }, [activeCall?.channelId, channelId, isMinimized, setMinimized]);

  if (!activeCall || activeCall.channelId !== channelId || isMinimized) {
    return null;
  }

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  return (
    <div className="relative flex flex-col h-125 w-full border-b bg-card rounded-lg overflow-hidden my-3">
      {isReconnecting && (
        <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span className="font-medium text-sm">
            Reconnecting to meeting call...
          </span>
        </div>
      )}
      <VideoConference />
    </div>
  );
}
