"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useCallStore } from "@/lib/store/use-call-store";

export function useVideoCallRouteSync() {
  const activeCall = useCallStore((s) => s.activeCall);
  const setMinimized = useCallStore((s) => s.setMinimized);
  const params = useParams();
  const prevChannelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeCall) {
      prevChannelIdRef.current = null;
      return;
    }

    const currentChannelId = (params?.channelId as string) || (params?.id as string);

    // Auto-minimize only when transitioning away from the call's channel for the first time
    if (
      prevChannelIdRef.current === activeCall.channelId &&
      currentChannelId &&
      currentChannelId !== activeCall.channelId
    ) {
      setMinimized(true);
    }

    prevChannelIdRef.current = currentChannelId || null;
  }, [activeCall, params, setMinimized]);
}

