import { useState, useRef, useEffect, useCallback } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";

interface UseYouTubePlayerOptions {
  initialVolume?: number;
  initialProgress?: number;
  autoPlayInitial?: boolean;
  onTrackEnd?: () => void;
}

interface UseYouTubePlayerResult {
  playerRef: React.MutableRefObject<YouTubePlayer | null>;
  playerElement: HTMLMediaElement | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  onReady: (event: YouTubeEvent) => void;
  onStateChange: (event: YouTubeEvent) => void;
}

export function useYouTubePlayer(
  options: UseYouTubePlayerOptions = {}
): UseYouTubePlayerResult {
  const {
    initialVolume = 100,
    initialProgress = 0,
    autoPlayInitial = false,
    onTrackEnd,
  } = options;

  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerElementRef = useRef<HTMLMediaElement | null>(null);
  const progressRef = useRef(initialProgress);
  const [isPlaying, setIsPlaying] = useState(autoPlayInitial);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);

  // Обновление прогресса
  useEffect(() => {
    if (!isPlaying) return;

    const updateProgress = () => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        progressRef.current = currentTime;
        requestAnimationFrame(updateProgress);
      }
    };

    const frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  // Методы управления плеером
  const play = useCallback(() => {
    playerRef.current?.playVideo();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
    setIsPlaying(false);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
      progressRef.current = seconds;
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const newVol = Math.max(0, Math.min(100, vol));
    setVolumeState(newVol);
    playerRef.current?.setVolume(newVol);
  }, []);

  // Обработчики событий YouTube
  const onReady = useCallback((event: YouTubeEvent) => {
    playerRef.current = event.target;
    playerElementRef.current = playerRef.current.getMediaElement();
    
    setVolume(initialVolume);
    if (initialProgress > 0) seekTo(initialProgress);
    
    const updateDuration = () => {
      const dur = playerRef.current?.getDuration() || 0;
      if (dur > 0) setDuration(dur);
    };
    
    if (autoPlayInitial) play();
    setTimeout(updateDuration, 500);
  }, [autoPlayInitial, initialProgress, initialVolume, play, seekTo, setVolume]);

  const onStateChange = useCallback((event: YouTubeEvent) => {
    switch (event.data) {
      case 0: // ENDED
        setIsPlaying(false);
        onTrackEnd?.();
        break;
      case 1: // PLAYING
        setIsPlaying(true);
        setDuration(prev => {
          const dur = playerRef.current?.getDuration() || 0;
          return dur > 0 ? dur : prev;
        });
        break;
      case 2: // PAUSED
        setIsPlaying(false);
        break;
    }
  }, [onTrackEnd]);

  return {
    playerRef,
    playerElement: playerElementRef.current,
    isPlaying,
    progress: progressRef.current,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
    onReady,
    onStateChange,
  };
}