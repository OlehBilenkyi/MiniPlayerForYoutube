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
  fetchVideoTitle?: () => void;
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
      // Инициализируем анализатор, передав HTMLMediaElement
      initAnalyser(internal);

      // Устанавливаем громкость на самом элементе
      internal.volume = initialVolume / 100;

      // Если было сохранённое время, перемещаем на него
      if (initialProgress > 0) {
        internal.currentTime = initialProgress;
      }

      // Сразу обновляем длительность, если она известна
      const dur = internal.duration;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }

      // Автозаплей, если нужно
      if (autoPlayInitial) {
        internal.play();
        setIsPlaying(true);
      }
    } else {
      // Если это не HTMLMediaElement (например, YouTube-iframe), просто ставим флаг
      setIsPlaying(autoPlayInitial);
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
