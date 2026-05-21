import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  workspaceService,
  type InviteWorkspaceMember,
} from "@/lib/api/workspace";
import { workspaceMemberKeys } from "@/queries/workspace-member";
import { workspaceKeys } from "@/queries/workspace";

export const useInviteWorkspaceMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteWorkspaceMember) =>
      workspaceService.createWorkspaceInvitation(payload),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all }),
        queryClient.invalidateQueries({
          queryKey: workspaceMemberKeys.profiles(variables.workspaceId),
        }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
        queryClient.invalidateQueries({
          queryKey: workspaceKeys.detail(variables.workspaceId),
        }),
      ]);
    },
  });
};
