import { api } from "./api";

export interface LiveKitTokenResponse {
  token: string;
  roomName: string;
  wsUrl: string;
}

export interface LiveKitParticipantInfo {
  identity: string;
  name?: string;
  metadata?: string;
  joinedAt?: number;
}

export interface MuteParticipantRequest {
  participantIdentity: string;
  trackSid: string;
  muted: boolean;
}

async function getVideoToken(workspaceId: string, channelId: string): Promise<LiveKitTokenResponse> {
  return api.post<LiveKitTokenResponse>(`workspaces/${workspaceId}/channels/${channelId}/video/token`, {});
}

async function getParticipants(workspaceId: string, channelId: string): Promise<LiveKitParticipantInfo[]> {
  return api.get<LiveKitParticipantInfo[]>(`workspaces/${workspaceId}/channels/${channelId}/video/participants`);
}

async function muteParticipant(workspaceId: string, channelId: string, request: MuteParticipantRequest): Promise<void> {
  return api.post<void>(`workspaces/${workspaceId}/channels/${channelId}/video/mute-participant`, request);
}

async function kickParticipant(workspaceId: string, channelId: string, participantIdentity: string): Promise<void> {
  return api.delete<void>(`workspaces/${workspaceId}/channels/${channelId}/video/participants/${participantIdentity}`);
}

export const videoService = {
  getVideoToken,
  getParticipants,
  muteParticipant,
  kickParticipant,
};
