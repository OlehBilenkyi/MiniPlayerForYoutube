import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { RefObject } from "react";
import ReactPlayer from "react-player";

type RepeatMode = "none" | "one" | "all";

interface PlayerStoreState {
  playerRef: RefObject<ReactPlayer | null>;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;

  play: () => void;
  pause: () => void;
  setVolume: (vol: number) => void;
  seekTo: (sec: number) => void;
  setProgress: (sec: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  initAnalyser: (media: HTMLMediaElement) => void;

  onReady: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  onError: (error: Error) => void;
}

export const usePlayerStore = create<PlayerStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        playerRef: { current: null },
        isPlaying: false,
        progress: 0,
        duration: 0,
        volume: 100,
        repeatMode: "none",
        isShuffle: false,
        audioContext: null,
        analyserNode: null,

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

        initAnalyser: (media) => {
          const { audioContext } = get();
          if (audioContext) return; // Уже инициализирован

          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;

            const source = ctx.createMediaElementSource(media);
            source.connect(analyser);
            analyser.connect(ctx.destination);

            set({ audioContext: ctx, analyserNode: analyser });
          } catch (error) {
            console.error("AudioContext initialization error:", error);
          }
        },

        onReady: () => {
          const { playerRef, volume, initAnalyser } = get();
          const player = playerRef.current;
          if (!player) return;
          
          const internal = player.getInternalPlayer();
          if (internal instanceof HTMLMediaElement) {
            internal.volume = volume / 100;
            if (!isNaN(internal.duration)) {
              set({ duration: internal.duration });
            }
            initAnalyser(internal); // Инициализируем анализатор
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

        onError: (error) => {
          console.error("Player error:", error);
          set({ isPlaying: false });
        },
      }),
      {
        name: "yt-player-store",
        partialize: (state) => ({
          volume: state.volume,
          repeatMode: state.repeatMode,
          isShuffle: state.isShuffle,
        }),
      }
    )
  )
);