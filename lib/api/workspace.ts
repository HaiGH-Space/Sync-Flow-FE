import { api, ApiResponse, PaginatedData, PaginationQuery } from "./api";
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

async function getMyWorkspace(params?: PaginationQuery): Promise<ApiResponse<PaginatedData<Workspace>>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", String(params.page));
  if (params?.limit) searchParams.append("limit", String(params.limit));
  const queryString = searchParams.toString();
  return api.get<PaginatedData<Workspace>>(
    `${WORKSPACE_BASE_URL}/me${queryString ? `?${queryString}` : ""}`,
  );
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

async function acceptWorkspace({
  token,
}: {
  token: string;
}): Promise<ApiResponse<unknown>> {
  return api.post(`${WORKSPACE_BASE_URL}/invitations/accept`, { token });
}

export const workspaceService = {
  getMyWorkspace,
  getWorkspaceById,
  createWorkspace,
  acceptWorkspace,
  deleteWorkspace,
  createWorkspaceInvitation,
};
