import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RefObject } from "react";
import ReactPlayer from "react-player";

type RepeatMode = "none" | "one" | "all";

interface PlayerStoreState {
  playerRef: RefObject<ReactPlayer>;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  play: () => void;
  pause: () => void;
  setVolume: (vol: number) => void;
  seekTo: (sec: number) => void;
  setProgress: (sec: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  onReady: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  initAnalyser: (media: HTMLMediaElement) => void;
}

export const usePlayerStore = create<PlayerStoreState>()(
  devtools((set, get) => ({
    playerRef: { current: null },
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 100,
    repeatMode: "off",
    isShuffle: false,

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    setVolume: (vol) => set({ volume: vol }),
    seekTo: (seconds) => {
      get().playerRef.current?.seekTo(seconds);
      set({ progress: seconds });
    },
    setProgress: (sec) => set({ progress: sec }),

    toggleRepeat: () => {
      const modes: RepeatMode[] = ["none", "one", "all"];
      const idx = modes.indexOf(get().repeatMode);
      set({ repeatMode: modes[(idx + 1) % modes.length] });
    },
    toggleShuffle: () => set({ isShuffle: !get().isShuffle }),

    onReady: () => {
      const { playerRef, volume, initAnalyser } = get();
      const player = playerRef.current;
      if (!player) return;

      const internal = player.getInternalPlayer();
      if (internal instanceof HTMLMediaElement) {
        initAnalyser(internal);
        internal.volume = volume / 100;
        if (!isNaN(internal.duration)) {
          set({ duration: internal.duration });
        }
      } else {
        const dur =
          typeof internal.getDuration === "function"
            ? internal.getDuration()
            : NaN;
        if (!isNaN(dur)) set({ duration: dur });
      }
      set({ isPlaying: true });
    },

    onProgress: ({ playedSeconds }) => set({ progress: playedSeconds }),
    onEnded: () => {
      const { repeatMode, playerRef } = get();
      if (repeatMode === "one") {
        playerRef.current?.seekTo(0);
        set({ isPlaying: true });
      } else {
        set({ isPlaying: false });
      }
    },

    initAnalyser: () => {
      /* заполняется хуком useAudioAnalyser */
    },
  }))
);
