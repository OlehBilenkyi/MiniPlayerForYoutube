import { useRef } from "react";
import ReactPlayer from "react-player";
import { usePlayerState } from "../PlayerState/usePlayerState";
import { usePlayerHandlers } from "../PlayerHandlers/usePlayerHandlers";

// Этот хук просто оборачивает usePlayerState + usePlayerHandlers,
// чтобы вернуть все необходимые колбэки и внутреннюю ref.
export function usePlayerCore(initialVolume: number, initialProgress: number) {
  const playerRef = useRef<ReactPlayer | null>(null);

  // 1) Состояние плеера (play/pause, progress, duration, volume)
  const {
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
    setDuration,
    setProgress,
  } = usePlayerState(initialVolume, initialProgress, (sec) => {
    if (playerRef.current) {
      playerRef.current.seekTo(sec, "seconds");
    }
  });

  // 2) Колбэки onReady/onProgress/onEnded для ReactPlayer
  const { onReady, onProgress, onEnded } = usePlayerHandlers({
    playerRef,
    setDuration,
    setProgress,
    setIsPlaying: (flag: boolean) => {
      if (flag) play();
      else pause();
    },
    initAnalyser: () => {
      /* инициализация визуализатора оставляем в useVisualizerToggle */
    },
    initialProgress,
    initialVolume,
    autoPlayInitial: false,
  });

  return {
    playerRef,
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
    onReady,
    onProgress,
    onEnded,
  };
}
