import { useCallback } from "react";
import ReactPlayer from "react-player";

interface UsePlayerHandlersParams {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  setDuration: (dur: number) => void;
  setProgress: (sec: number) => void;
  setIsPlaying: (flag: boolean) => void;
  initAnalyser: (media: unknown) => void;
  initialProgress: number;
  initialVolume: number;
  autoPlayInitial: boolean;
}

export function usePlayerHandlers({
  playerRef,
  setDuration,
  setProgress,
  setIsPlaying,
  initAnalyser,
  initialProgress,
  initialVolume,
  autoPlayInitial,
}: UsePlayerHandlersParams) {
  const onReady = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const internal = player.getInternalPlayer();

    if (internal instanceof HTMLMediaElement) {
      // Если это <audio> или <video> (например, в других реализациях)
      initAnalyser(internal);

      internal.volume = initialVolume / 100;

      if (initialProgress > 0) {
        internal.currentTime = initialProgress;
      }

      const dur = internal.duration;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }

      if (autoPlayInitial) {
        internal.play();
        setIsPlaying(true);
      }
    } else {
      // Ветка для YouTube-iframe (ReactPlayer)
      setIsPlaying(autoPlayInitial);

      // Попробуем получить длительность через YouTube API
      const dur =
        typeof internal.getDuration === "function"
          ? internal.getDuration()
          : NaN;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
      // (Не трогаем initAnalyser, так как это не HTMLMediaElement)
    }
  }, [
    autoPlayInitial,
    initialProgress,
    initialVolume,
    initAnalyser,
    playerRef,
    setDuration,
    setIsPlaying,
  ]);

  const onProgress = useCallback(
    (state: { playedSeconds: number }) => {
      setProgress(state.playedSeconds);
    },
    [setProgress]
  );

  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  return {
    onReady,
    onProgress,
    onEnded,
  };
}
