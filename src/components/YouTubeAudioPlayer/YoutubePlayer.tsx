import React, { useState, useEffect, useCallback, useMemo } from "react";
import YouTube from "react-youtube";
import PlaylistSection, { PlaylistItem } from "./PlaylistSection";
import ControlsSection, { RepeatMode } from "./ControlsSection";
import ProgressSection from "./ProgressSection";
import VolumeSection from "./VolumeSection";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer";
import "./YoutubePlayer.scss";

const STORAGE_KEY = "ytPlayerState";

const DEFAULT_PLAYLIST: PlaylistItem[] = [
  { videoId: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
  { videoId: "3tmd-ClpJxA", title: "Eminem – Lose Yourself" },
  { videoId: "JGwWNGJdvx8", title: "Ed Sheeran – Shape of You" },
];

interface PlayerState {
  currentIndex: number;
  progress: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  isDark: boolean;
}

const DEFAULT_STATE: PlayerState = {
  currentIndex: 0,
  progress: 0,
  volume: 50,
  repeatMode: "none",
  isShuffle: false,
  isDark: false,
};

const YouTubeAudioPlayer: React.FC = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_STATE;

      const parsed = JSON.parse(saved) as Partial<PlayerState>;

      return {
        ...DEFAULT_STATE,
        ...parsed,
        currentIndex: isValidIndex(parsed.currentIndex)
          ? parsed.currentIndex!
          : DEFAULT_STATE.currentIndex,
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  const {
    currentIndex,
    progress: savedProgress,
    volume: savedVolume,
    repeatMode,
    isShuffle,
    isDark,
  } = playerState;
  const [playlist] = useState<PlaylistItem[]>(DEFAULT_PLAYLIST);

  const safeCurrentIndex = useMemo(() => {
    return isValidIndex(currentIndex) ? currentIndex : 0;
  }, [currentIndex]);

  const {
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
    onStateChange,
  } = useYouTubePlayer({
    initialVolume: savedVolume,
    initialProgress: savedProgress,
    autoPlayInitial: false,
  });

  useEffect(() => {
    const stateToSave: PlayerState = {
      currentIndex: safeCurrentIndex,
      progress,
      volume,
      repeatMode,
      isShuffle,
      isDark,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save player state", e);
    }
  }, [safeCurrentIndex, progress, volume, repeatMode, isShuffle, isDark]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  const isValidIndex = (index?: number): boolean => {
    return index !== undefined && index >= 0 && index < playlist.length;
  };

  const getNextIndex = useCallback((): number | null => {
    if (isShuffle) return Math.floor(Math.random() * playlist.length);
    const nextIndex = safeCurrentIndex + 1;
    if (nextIndex >= playlist.length) return repeatMode === "all" ? 0 : null;
    return nextIndex;
  }, [safeCurrentIndex, isShuffle, repeatMode, playlist.length]);

  const changeTrack = useCallback(
    (index: number | null, autoPlay = true) => {
      if (index === null || !isValidIndex(index)) return;

      playerRef.current?.stopVideo();
      setPlayerState((prev) => ({ ...prev, currentIndex: index }));
      seekTo(0);
      if (autoPlay) setTimeout(play, 200);
    },
    [play, seekTo, playlist.length]
  );

  const nextTrack = useCallback(() => {
    if (repeatMode === "one") {
      seekTo(0);
      play();
      return;
    }
    changeTrack(getNextIndex(), true);
  }, [changeTrack, getNextIndex, play, repeatMode, seekTo]);

  const prevTrack = useCallback(() => {
    if (isShuffle) {
      changeTrack(Math.floor(Math.random() * playlist.length), true);
      return;
    }
    let prevIndex = safeCurrentIndex - 1;
    if (prevIndex < 0)
      prevIndex = repeatMode === "all" ? playlist.length - 1 : -1;
    changeTrack(prevIndex >= 0 ? prevIndex : null, true);
  }, [safeCurrentIndex, isShuffle, repeatMode, playlist.length, changeTrack]);

  const handleStateChange = useCallback(
    (e: any) => {
      onStateChange(e);
      if (e.data === 0) nextTrack();
    },
    [onStateChange, nextTrack]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case "ArrowRight":
          seekTo(
            Math.min((playerRef.current?.getCurrentTime() || 0) + 5, duration)
          );
          break;
        case "ArrowLeft":
          seekTo(Math.max((playerRef.current?.getCurrentTime() || 0) - 5, 0));
          break;
        case "ArrowUp":
          setVolume(Math.min(volume + 10, 100));
          break;
        case "ArrowDown":
          setVolume(Math.max(volume - 10, 0));
          break;
        case "KeyM":
          setVolume(volume > 0 ? 0 : 50);
          break;
        case "KeyN":
          nextTrack();
          break;
        case "KeyP":
          prevTrack();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isPlaying,
    volume,
    duration,
    nextTrack,
    prevTrack,
    play,
    pause,
    seekTo,
    setVolume,
  ]);

  const playerOpts = useMemo(
    () => ({
      height: "0",
      width: "0",
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
      },
    }),
    []
  );

  const currentTrack = useMemo(() => {
    return (
      playlist[safeCurrentIndex] || playlist[0] || { videoId: "", title: "" }
    );
  }, [playlist, safeCurrentIndex]);

  return (
    <div className={`yt-audio-player-container ${isDark ? "dark" : ""}`}>
      <div className="header-row">
        <h2>YouTube Audio Player</h2>
        <ThemeToggle
          isDarkMode={isDark}
          onToggle={() =>
            setPlayerState((prev) => ({ ...prev, isDark: !prev.isDark }))
          }
        />
      </div>

      <PlaylistSection
        items={playlist}
        currentIndex={safeCurrentIndex}
        onSelect={(index) => changeTrack(index, true)}
      />

      {currentTrack.videoId && (
        <YouTube
          key={currentTrack.videoId}
          videoId={currentTrack.videoId}
          opts={playerOpts}
          onReady={onReady}
          onStateChange={handleStateChange}
        />
      )}

      <ControlsSection
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={prevTrack}
        onNext={nextTrack}
        isShuffle={isShuffle}
        onToggleShuffle={() =>
          setPlayerState((prev) => ({ ...prev, isShuffle: !prev.isShuffle }))
        }
        repeatMode={repeatMode}
        onToggleRepeat={() =>
          setPlayerState((prev) => ({
            ...prev,
            repeatMode:
              prev.repeatMode === "none"
                ? "all"
                : prev.repeatMode === "all"
                ? "one"
                : "none",
          }))
        }
      />

      <ProgressSection
        progress={progress}
        duration={duration}
        onSeek={seekTo}
      />

      <VolumeSection volume={volume} onVolumeChange={setVolume} />
    </div>
  );
};

export default YouTubeAudioPlayer;
