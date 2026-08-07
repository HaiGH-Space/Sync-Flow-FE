"use client";

import React from "react";
import { Participant } from "livekit-client";
import { MicOff, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMuteParticipantMutation, useKickParticipantMutation } from "@/hooks/mutations/use-video-call";
import { toast } from "sonner";

interface Props {
  workspaceId: string;
  channelId: string;
  participant: Participant;
  isAdmin: boolean;
}

export function ParticipantContextMenu({ workspaceId, channelId, participant, isAdmin }: Props) {
  const muteMutation = useMuteParticipantMutation();
  const kickMutation = useKickParticipantMutation();

  if (!isAdmin) return null;

  const handleMute = async () => {
    try {
      const audioTrack = Array.from(participant.audioTrackPublications.values())[0];
      if (!audioTrack) {
        toast.error("Participant has no active audio track.");
        return;
      }
      await muteMutation.mutateAsync({
        workspaceId,
        channelId,
        payload: {
          participantIdentity: participant.identity,
          trackSid: audioTrack.trackSid,
          muted: true,
        },
      });
      toast.success(`Muted ${participant.identity}`);
    } catch {
      toast.error("Failed to mute participant.");
    }
  };

  const handleKick = async () => {
    try {
      await kickMutation.mutateAsync({
        workspaceId,
        channelId,
        participantIdentity: participant.identity,
      });
      toast.success(`Kicked ${participant.identity} from call`);
    } catch {
      toast.error("Failed to kick participant.");
    }
  };

  return (
    <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-background/80 backdrop-blur rounded-md p-1 shadow">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive"
        onClick={handleMute}
        disabled={muteMutation.isPending}
        title="Admin: Mute Participant"
      >
        <MicOff className="w-3.5 h-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive"
        onClick={handleKick}
        disabled={kickMutation.isPending}
        title="Admin: Kick Participant"
      >
        <UserX className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
