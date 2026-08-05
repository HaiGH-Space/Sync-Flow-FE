"use client";

import React from "react";
import { Video, PhoneOff, Loader2 } from "lucide-react";
import { useCallStore } from "@/lib/store/use-call-store";
import { useVideoTokenMutation } from "@/hooks/mutations/use-video-call";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  workspaceId: string;
  channelId: string;
}

export function ChannelCallHeaderButton({ workspaceId, channelId }: Props) {
  const activeCall = useCallStore((s) => s.activeCall);
  const joinCall = useCallStore((s) => s.joinCall);
  const leaveCall = useCallStore((s) => s.leaveCall);

  const tokenMutation = useVideoTokenMutation();
  const isInThisCall = activeCall?.channelId === channelId;

  const handleToggleCall = async () => {
    if (isInThisCall) {
      leaveCall();
      return;
    }

    if (activeCall) {
      const confirmSwitch = window.confirm("You are currently in another call. Leave current call to join this channel?");
      if (!confirmSwitch) return;
      leaveCall();
    }

    try {
      const res = await tokenMutation.mutateAsync({ workspaceId, channelId });
      joinCall({
        workspaceId,
        channelId,
        roomName: res.data.roomName,
        token: res.data.token,
        wsUrl: res.data.wsUrl,
      });
    } catch {
      toast.error("Failed to join video call. Please try again.");
    }
  };

  return (
    <Button
      size="sm"
      variant={isInThisCall ? "destructive" : "outline"}
      onClick={handleToggleCall}
      disabled={tokenMutation.isPending}
      className="gap-2"
    >
      {tokenMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isInThisCall ? (
        <PhoneOff className="w-4 h-4" />
      ) : (
        <Video className="w-4 h-4" />
      )}
      <span>{isInThisCall ? "Leave Call" : "Start Call"}</span>
    </Button>
  );
}
