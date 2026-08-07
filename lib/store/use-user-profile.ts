import type { UserProfile } from "../api/user";
import { create } from "zustand";
import { authService } from "../api/auth";

type UserProfileActions = {
  logout: () => Promise<void>;
  setUserProfile: (profile: UserProfile) => void;
};

type UserProfileStore = {
  userProfile?: UserProfile;
  token?: string;
} & UserProfileActions;

export const useUserStore = create<UserProfileStore>((set) => ({
  logout: async () => {
    await authService.logout();
    set({ userProfile: undefined, token: undefined });
  },
  setUserProfile: (profile: UserProfile) =>
    set({ userProfile: profile, token: profile.token }),
}));
