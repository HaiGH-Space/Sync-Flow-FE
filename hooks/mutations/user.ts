import { userService } from "@/lib/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMyAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateMyAvatar,
    onSuccess: async (response) => {
      // Keep UI in sync immediately.
      queryClient.setQueryData(["userProfile"], response.data);
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useMarkWelcomeSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.markWelcomeSeen,
    onSuccess: async (response) => {
      queryClient.setQueryData(["userProfile"], response.data);
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
