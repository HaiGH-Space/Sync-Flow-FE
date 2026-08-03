import { queryOptions } from "@tanstack/react-query";
import { videoService } from "@/lib/api/video";

export const videoKeys = {
  all: ["video"] as const,
  participants: (workspaceId: string, channelId: string) =>
    [...videoKeys.all, "participants", workspaceId, channelId] as const,
};

export function createVideoParticipantsQueryOptions(workspaceId: string, channelId: string) {
  return queryOptions({
    queryKey: videoKeys.participants(workspaceId, channelId),
    queryFn: () => videoService.getParticipants(workspaceId, channelId),
    enabled: Boolean(workspaceId && channelId),
    staleTime: 10_000,
  });
}
