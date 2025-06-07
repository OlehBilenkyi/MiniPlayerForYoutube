import { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";
import { Subject, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";

export interface UsePlayerHandlersParams {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  /** Передает длительность в секундах */
  setDuration: (dur: number) => void;
  /** Передает прогресс в секундах */
  setProgress: (sec: number) => void;
  /** Управление состоянием воспроизведения */
  setIsPlaying: (flag: boolean) => void;
  /** Инициализация анализатора аудио (анализ спектра и т.п.) */
  initAnalyser: (mediaElement: HTMLMediaElement) => void;
  initialProgress: number;
  initialVolume: number;
  autoPlayInitial: boolean;
}

/**
 * Кастомный хук для управления событиями ReactPlayer с реактивным контролем прогресса.
 * Использует RxJS для debounce и реактивной обработки прогресса.
 * @param params Параметры хука для управления плеером
 * @returns Обработчики onReady, onProgress, onEnded
 */
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
  // RxJS Subject для прогресса с debounce
  const progressSubject = new Subject<number>();

  // Подписка на поток прогресса с дебаунсом 200 мс
  useEffect(() => {
    const subscription = progressSubject
      .pipe(debounceTime(200))
      .subscribe((sec) => {
        setProgress(sec);
      });
    return () => subscription.unsubscribe();
  }, [setProgress]);

  /**
   * Обработчик события готовности плеера
   */
  const onReady = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const internal = player.getInternalPlayer();

    if (internal instanceof HTMLMediaElement) {
      // Инициализация анализатора аудио/видео
      initAnalyser(internal);

      // Установка громкости [0..1]
      internal.volume = initialVolume / 100;

      // Установка начального времени
      if (initialProgress > 0) {
        internal.currentTime = initialProgress;
      }

      // Получение длительности, если она известна
      const dur = internal.duration;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }

      // Автовоспроизведение
      if (autoPlayInitial) {
        internal.play();
        setIsPlaying(true);
      }
    } else {
      // Для плееров типа YouTube iframe
      setIsPlaying(autoPlayInitial);

      // Попытка получить длительность из API YouTube
      const dur =
        typeof internal.getDuration === "function"
          ? internal.getDuration()
          : NaN;

      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
      // Анализатор не вызывается — это не HTMLMediaElement
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

  /**
   * Обработчик прогресса плеера.
   * Использует реактивный Subject с дебаунсом для оптимизации обновлений.
   */
  const onProgress = useCallback(
    (state: { playedSeconds: number }) => {
      progressSubject.next(state.playedSeconds);
    },
    [progressSubject]
  );

  /**
   * Обработчик окончания воспроизведения
   */
  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  return {
    onReady,
    onProgress,
    onEnded,
  };
}
