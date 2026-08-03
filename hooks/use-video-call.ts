"use client";

import { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { useCallStore } from "@/lib/store/use-call-store";

export function useVideoCallRouteSync() {
  const activeCall = useCallStore((s) => s.activeCall);
  const setMinimized = useCallStore((s) => s.setMinimized);
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    if (!activeCall) return;

    const currentChannelId = (params?.channelId as string) || (params?.id as string);

    if (currentChannelId === activeCall.channelId) {
      setMinimized(false);
    } else {
      setMinimized(true);
    }
  }, [activeCall, params, pathname, setMinimized]);
}
