import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveCallInfo {
  workspaceId: string;
  channelId: string;
  roomName: string;
  token: string;
  wsUrl: string;
}

interface CallState {
  activeCall: ActiveCallInfo | null;
  isMinimized: boolean;
  initialAudioIntent: boolean;
  initialVideoIntent: boolean;
  hasHydrated: boolean;
}

interface CallAction {
  joinCall: (info: ActiveCallInfo) => void;
  leaveCall: () => void;
  setMinimized: (minimized: boolean) => void;
  setInitialAudioIntent: (enabled: boolean) => void;
  setInitialVideoIntent: (enabled: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

type CallStore = CallState & CallAction;

export const useCallStore = create<CallStore>()(
  persist(
    (set) => ({
      activeCall: null,
      isMinimized: false,
      initialAudioIntent: true,
      initialVideoIntent: true,
      hasHydrated: false,

      joinCall: (info: ActiveCallInfo) => set({ activeCall: info, isMinimized: false }),
      leaveCall: () => set({ activeCall: null, isMinimized: false }),
      setMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
      setInitialAudioIntent: (enabled: boolean) => set({ initialAudioIntent: enabled }),
      setInitialVideoIntent: (enabled: boolean) => set({ initialVideoIntent: enabled }),
      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "call-storage",
      skipHydration: true,
      partialize: (state) => ({
        initialAudioIntent: state.initialAudioIntent,
        initialVideoIntent: state.initialVideoIntent,
      }),
    }
  )
);
