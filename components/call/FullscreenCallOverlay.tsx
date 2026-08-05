"use client";

import React from "react";
import { VideoConference, useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { Minimize2, PhoneOff, Loader2, Video } from "lucide-react";
import { useCallStore } from "@/lib/store/use-call-store";
import { Button } from "@/components/ui/button";

export function FullscreenCallOverlay() {
  const activeCall = useCallStore((s) => s.activeCall);
  const setMinimized = useCallStore((s) => s.setMinimized);
  const leaveCall = useCallStore((s) => s.leaveCall);

  const connectionState = useConnectionState();

  if (!activeCall) return null;

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background w-screen h-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-border/80 bg-background/95 backdrop-blur px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
            <Video className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-xs md:max-w-md">
              {activeCall.roomName}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              {isReconnecting ? (
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" /> Reconnecting…
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMinimized(true)}
            className="flex items-center gap-1.5"
            title="Minimize to floating bar"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Minimize</span>
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={leaveCall}
            className="flex items-center gap-1.5"
            title="Leave call"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Leave Call</span>
          </Button>
        </div>
      </header>

      {/* Main Video Conference Area */}
      <main className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        {isReconnecting && (
          <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="font-medium text-sm">Reconnecting to meeting call...</span>
          </div>
        )}
        <VideoConference />
      </main>
    </div>
  );
}
