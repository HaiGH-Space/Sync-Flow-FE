import { api } from "./api";
import { UserProfile } from "./user";

export type RoleMember = "ADMIN" | "MEMBER";

export interface MemberWorkspace {
  id: string;
  workspaceId: string;
  userId: string;
  role: RoleMember;
  joinedAt: string;
}

async function getWorkspaceMembersProfile(workspaceId: string) {
  return api.get<UserProfile[]>(`/workspaces/${workspaceId}/members/profile`);
}

export const workspaceMemberService = {
  getWorkspaceMembersProfile,
};
