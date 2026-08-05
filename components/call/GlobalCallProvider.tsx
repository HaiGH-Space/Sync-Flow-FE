"use client";

import "@livekit/components-styles";
import React, { useEffect } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { DisconnectReason } from "livekit-client";
import { useCallStore } from "@/lib/store/use-call-store";
import { useVideoCallRouteSync } from "@/hooks/use-video-call";
import { FloatingCallWidget } from "./floating-call-widget";
import { toast } from "sonner";

export function GlobalCallProvider({ children }: { children: React.ReactNode }) {
  const activeCall = useCallStore((s) => s.activeCall);
  const isMinimized = useCallStore((s) => s.isMinimized);
  const leaveCall = useCallStore((s) => s.leaveCall);
  const setHasHydrated = useCallStore((s) => s.setHasHydrated);

  useVideoCallRouteSync();

  useEffect(() => {
    useCallStore.persist.rehydrate();
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (!activeCall) return;

    const handleUnload = () => {
      leaveCall();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [activeCall, leaveCall]);

  return (
    <LiveKitRoom
      token={activeCall?.token}
      serverUrl={activeCall?.wsUrl}
      connect={Boolean(activeCall)}
      audio={true}
      video={true}
      onDisconnected={(reason) => {
        leaveCall();
        if (reason === DisconnectReason.DUPLICATE_IDENTITY) {
          toast.error("You joined this call from another browser tab or window.");
        } else if (reason === DisconnectReason.PARTICIPANT_REMOVED) {
          toast.error("You were removed from the meeting by an admin.");
        }

      }}
      data-lk-theme="default"
    >
      <RoomAudioRenderer />
      {children}
      {activeCall && isMinimized && <FloatingCallWidget />}
    </LiveKitRoom>
  );
}
