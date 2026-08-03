"use client";

import React from "react";
import { ConnectionState, Track } from "livekit-client";
import { useConnectionState, useTrackToggle } from "@livekit/components-react";
import { Mic, MicOff, Video, VideoOff, Maximize2, PhoneOff, Loader2 } from "lucide-react";
import { useCallStore } from "@/lib/store/use-call-store";
import { Button } from "@/components/ui/button";

export function FloatingCallWidget() {
  const activeCall = useCallStore((s) => s.activeCall);
  const setMinimized = useCallStore((s) => s.setMinimized);
  const leaveCall = useCallStore((s) => s.leaveCall);

  const connectionState = useConnectionState();
  const micToggle = useTrackToggle({ source: Track.Source.Microphone });
  const camToggle = useTrackToggle({ source: Track.Source.Camera });

  if (!activeCall) return null;

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-3 bg-background/95 backdrop-blur border shadow-2xl rounded-xl p-3 max-w-[calc(100vw-2rem)]">
      <div className="flex flex-col">
        <span className="text-xs font-semibold truncate max-w-[140px]">{activeCall.roomName}</span>
        <span className="text-[10px] text-muted-foreground">
          {isReconnecting ? (
            <span className="flex items-center gap-1 text-amber-500">
              <Loader2 className="w-3 h-3 animate-spin" /> Reconnecting...
            </span>
          ) : (
            "Connected"
          )}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant={micToggle.enabled ? "ghost" : "destructive"}
          onClick={() => micToggle.toggle()}
          className="h-8 w-8"
        >
          {micToggle.enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>

        <Button
          size="icon"
          variant={camToggle.enabled ? "ghost" : "destructive"}
          onClick={() => camToggle.toggle()}
          className="h-8 w-8"
        >
          {camToggle.enabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMinimized(false)}
          className="h-8 w-8"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={leaveCall}
          className="h-8 w-8"
        >
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
