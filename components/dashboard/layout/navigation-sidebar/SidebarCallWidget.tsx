"use client";

import React from "react";
import { ConnectionState, Track } from "livekit-client";
import { useConnectionState, useTrackToggle } from "@livekit/components-react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Maximize2,
  PhoneOff,
  Signal,
} from "lucide-react";
import { useCallStore } from "@/lib/store/use-call-store";
import { Button } from "@/components/ui/button";

export function SidebarCallWidget() {
  const activeCall = useCallStore((s) => s.activeCall);
  const isMinimized = useCallStore((s) => s.isMinimized);
  const setMinimized = useCallStore((s) => s.setMinimized);
  const leaveCall = useCallStore((s) => s.leaveCall);

  const connectionState = useConnectionState();
  const micToggle = useTrackToggle({ source: Track.Source.Microphone });
  const camToggle = useTrackToggle({ source: Track.Source.Camera });

  if (!activeCall || !isMinimized) return null;

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  return (
    <div className="mx-3 my-2 p-2.5 rounded-xl bg-sidebar-accent/80 border border-sidebar-border/80 shadow-sm flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            {isReconnecting ? (
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            )}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 flex items-center gap-1 leading-none">
              <Signal className="w-3 h-3" /> Voice Connected
            </span>
            <span className="text-xs font-medium truncate text-sidebar-foreground mt-0.5 max-w-35">
              {activeCall.roomName}
            </span>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMinimized(false)}
          className="h-7 w-7 text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
          title="Expand to Fullscreen"
          aria-label="Expand to Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-1 pt-1 border-t border-sidebar-border/40">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant={micToggle.enabled ? "ghost" : "destructive"}
            onClick={() => micToggle.toggle()}
            className="h-7 w-7"
            title={micToggle.enabled ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micToggle.enabled ? (
              <Mic className="w-3.5 h-3.5" />
            ) : (
              <MicOff className="w-3.5 h-3.5" />
            )}
          </Button>

          <Button
            size="icon"
            variant={camToggle.enabled ? "ghost" : "destructive"}
            onClick={() => camToggle.toggle()}
            className="h-7 w-7"
            title={camToggle.enabled ? "Turn Off Camera" : "Turn On Camera"}
          >
            {camToggle.enabled ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <VideoOff className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        <Button
          size="icon"
          variant="destructive"
          onClick={leaveCall}
          className="h-7 w-7"
          title="Disconnect Call"
        >
          <PhoneOff className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
