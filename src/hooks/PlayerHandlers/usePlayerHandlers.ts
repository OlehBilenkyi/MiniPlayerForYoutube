import { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

export interface UsePlayerHandlersParams {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  setDuration: (dur: number) => void;
  setProgress: (sec: number) => void;
  setIsPlaying: (flag: boolean) => void;
  initAnalyser: (mediaElement: HTMLMediaElement) => void;
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
  const progressSubject = new Subject<number>();

  useEffect(() => {
    const subscription = progressSubject
      .pipe(debounceTime(200))
      .subscribe((sec) => {
        setProgress(sec);
      });
    return () => subscription.unsubscribe();
  }, [setProgress]);

  const onReady = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const internal = player.getInternalPlayer();

    if (internal instanceof HTMLMediaElement) {
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
      setIsPlaying(autoPlayInitial);

      const dur =
        typeof internal.getDuration === "function"
          ? internal.getDuration()
          : NaN;

      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    }
  }, [
    playerRef,
    initAnalyser,
    initialVolume,
    initialProgress,
    setDuration,
    setIsPlaying,
    autoPlayInitial,
  ]);

  const onProgress = useCallback(
    (state: { playedSeconds: number }) => {
      progressSubject.next(state.playedSeconds);
    },
    [progressSubject]
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
