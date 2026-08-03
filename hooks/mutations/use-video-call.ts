import { useMutation, useQueryClient } from "@tanstack/react-query";
import { videoService, MuteParticipantRequest } from "@/lib/api/video";
import { videoKeys } from "@/queries/video";

export function useVideoTokenMutation() {
  return useMutation({
    mutationFn: ({ workspaceId, channelId }: { workspaceId: string; channelId: string }) =>
      videoService.getVideoToken(workspaceId, channelId),
  });
}

export function useMuteParticipantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, channelId, payload }: { workspaceId: string; channelId: string; payload: MuteParticipantRequest }) =>
      videoService.muteParticipant(workspaceId, channelId, payload),
    onSuccess: (_, { workspaceId, channelId }) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.participants(workspaceId, channelId) });
    },
  });
}

export function useKickParticipantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, channelId, participantIdentity }: { workspaceId: string; channelId: string; participantIdentity: string }) =>
      videoService.kickParticipant(workspaceId, channelId, participantIdentity),
    onSuccess: (_, { workspaceId, channelId }) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.participants(workspaceId, channelId) });
    },
  });
}
