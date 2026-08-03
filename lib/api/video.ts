import { api, ApiResponse } from "./api";

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

async function getVideoToken(workspaceId: string, channelId: string): Promise<ApiResponse<LiveKitTokenResponse>> {
  return api.post<LiveKitTokenResponse>(`workspaces/${workspaceId}/channels/${channelId}/video/token`, {});
}

async function getParticipants(workspaceId: string, channelId: string): Promise<ApiResponse<LiveKitParticipantInfo[]>> {
  return api.get<LiveKitParticipantInfo[]>(`workspaces/${workspaceId}/channels/${channelId}/video/participants`);
}

async function muteParticipant(workspaceId: string, channelId: string, request: MuteParticipantRequest): Promise<ApiResponse<void>> {
  return api.post<void>(`workspaces/${workspaceId}/channels/${channelId}/video/mute-participant`, request);
}

async function kickParticipant(workspaceId: string, channelId: string, participantIdentity: string): Promise<ApiResponse<void>> {
  return api.delete<void>(`workspaces/${workspaceId}/channels/${channelId}/video/participants/${participantIdentity}`);
}

export const videoService = {
  getVideoToken,
  getParticipants,
  muteParticipant,
  kickParticipant,
};
