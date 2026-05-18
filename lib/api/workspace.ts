import { api, ApiResponse } from "./api";
import { MemberWorkspace, RoleMember } from "./member-workspace";

export const WORKSPACE_BASE_URL = "/workspaces";

export interface Workspace {
  id: string;
  name: string;
  urlSlug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: MemberWorkspace[];
}

export type CreateWorkspace = {
  name: string;
  urlSlug: string;
};

export type InviteWorkspaceMember = {
  workspaceId: string;
  email: string;
  role: RoleMember;
};

type DeleteWorkspaceRequest = {
  workspaceId: string;
};

async function getMyWorkspace(): Promise<ApiResponse<Workspace[]>> {
  return api.get<Workspace[]>(`${WORKSPACE_BASE_URL}/me`);
}

async function getWorkspaceById(
  workspaceId: string,
): Promise<ApiResponse<Workspace>> {
  return api.get<Workspace>(`${WORKSPACE_BASE_URL}/${workspaceId}`);
}

async function createWorkspace({
  name,
  urlSlug,
}: CreateWorkspace): Promise<ApiResponse<Workspace>> {
  return api.post<Workspace>(WORKSPACE_BASE_URL, { name, urlSlug });
}

async function deleteWorkspace({
  workspaceId,
}: DeleteWorkspaceRequest): Promise<ApiResponse<Workspace>> {
  return api.delete(`${WORKSPACE_BASE_URL}/${workspaceId}`);
}

async function createWorkspaceInvitation({
  workspaceId,
  email,
  role,
}: InviteWorkspaceMember): Promise<ApiResponse<unknown>> {
  return api.post(`${WORKSPACE_BASE_URL}/${workspaceId}/invitations`, {
    email,
    role,
  });
}

export const workspaceService = {
  getMyWorkspace,
  getWorkspaceById,
  createWorkspace,
  deleteWorkspace,
  createWorkspaceInvitation,
};
