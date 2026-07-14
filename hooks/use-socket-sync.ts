import { useEffect } from "react";
import { useUserStore } from "@/lib/store/use-user-profile";
import { disconnectChatSocket } from "@/lib/api/chat";
import { disconnectNotificationSocket } from "@/lib/api/notification";

export function useSocketSync() {
  useEffect(() => {
    let lastProfile = useUserStore.getState().userProfile;

    const unsubscribe = useUserStore.subscribe((state) => {
      const currentProfile = state.userProfile;

      // Reset sockets only on loggedOut or userSwapped transitions
      const loggedOut = lastProfile && !currentProfile;
      const userSwapped = lastProfile && currentProfile && lastProfile.id !== currentProfile.id;

      if (loggedOut || userSwapped) {
        disconnectChatSocket();
        disconnectNotificationSocket();
      }

      lastProfile = currentProfile;
    });

    return () => {
      unsubscribe();
    };
  }, []);
}
