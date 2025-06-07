import { useEffect } from "react";

interface HotkeysParams {
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  seekTo: (sec: number) => void;
  setVolume: (vol: number) => void;
}

export function useHotkeys({
  isPlaying,
  progress,
  duration,
  volume,
  play,
  pause,
  seekTo,
  setVolume,
}: HotkeysParams) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case "ArrowRight":
          e.preventDefault();
          seekTo(Math.min(progress + 5, duration));
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekTo(Math.max(progress - 5, 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(volume + 10, 100));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(volume - 10, 0));
          break;
        case "KeyM":
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 50);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, progress, duration, volume, play, pause, seekTo, setVolume]);
}
