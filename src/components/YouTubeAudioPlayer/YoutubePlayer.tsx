import React, { useState, useEffect, useCallback } from "react";
import YouTube from "react-youtube";
import Playlist, { PlaylistItem } from "../Playlist/Playlist";
import Controls, { RepeatMode } from "../Controls/Controls";
import ProgressBar from "../ProgressBar/ProgressBar";
import VolumeControl from "../VolumeControl/VolumeControl";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer";
import "./YoutubePlayer.scss"; // Corrected import path for the SCSS file

const STORAGE_KEY = "ytPlayerState";

const YouTubeAudioPlayer: React.FC = () => {
  // Обновленный плейлист
  const playlist: PlaylistItem[] = [
    {
      videoId: "7pdN18RfGQw",
      title: "Ollane feat. Miyagi - Touch The Sky (Official Audio)",
    },
    {
      videoId: "4Ua1g8hU81A",
      title: "Miyagi - Captain (2018)",
    },
    {
      videoId: "jJpKYZs6Av0",
      title: "Miyagi - Самурай (Official Audio)",
    },
    {
      videoId: "vN12KY7eR8U",
      title: "Miyagi & Andy Panda - YAMAKASI (Official Video)",
    },
    {
      videoId: "xZEVGJszvo0",
      title: "Miyagi & Andy Panda - Freeman (Official Video)",
    },
    {
      videoId: "xZEVGJszvo0",
      title: "Miyagi & Эндшпиль - Bounty (Official Audio)",
    },
    {
      videoId: "DTz5k-8AzJo",
      title: "Miyagi feat. Mav-d, Ollane - Music is Love (Official Audio)",
    },
    {
      videoId: "iK7qs-1wTK8",
      title: "Mr Lambo - Mango (Official Video)",
    },
    {
      videoId: "af_Fnq39WQk",
      title: "Miyagi & Эндшпиль - RudeBoys (Official Audio)",
    },
    {
      videoId: "nidQCt_HEsY",
      title: "Miyagi & Эндшпиль feat. Рем Дигга - I Got Love (Official Video)",
    },
  ];

  // Загрузить состояние из localStorage
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  })();

  // Локальные состояния
  const [currentIndex, setCurrentIndex] = useState<number>(
    saved?.currentIndex ?? 0
  );
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(
    saved?.repeatMode ?? "none"
  );
  const [isShuffle, setIsShuffle] = useState<boolean>(
    saved?.isShuffle ?? false
  );
  const [isDark, setIsDark] = useState<boolean>(saved?.isDark ?? false);

  // Из сохранённого вытащим начальные volume / progress
  const initialProgress = saved?.progress ?? 0;
  const initialVolume = saved?.volume ?? 100;

  // Хук для работы с YouTube-плеером
  const {
    playerRef,
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume: setVol,
    onReady,
    onStateChange,
  } = useYouTubePlayer({
    initialVolume,
    initialProgress,
    autoPlayInitial: false,
  });

  // Сохранение в localStorage
  useEffect(() => {
    const toSave = {
      currentIndex,
      progress,
      volume,
      repeatMode,
      isShuffle,
      isDark,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [currentIndex, progress, volume, repeatMode, isShuffle, isDark]);

  // Dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // Keyboard Shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

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
          setVol(Math.min(volume + 10, 100));
          break;
        case "ArrowDown":
          setVol(Math.max(volume - 10, 0));
          break;
        case "KeyM":
          setVol(volume > 0 ? 0 : 50);
          break;
        case "KeyN":
          nextTrack();
          break;
        case "KeyP":
          prevTrack();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, volume, duration]);

  // Для переключения треков
  const getNext = useCallback((): number | null => {
    if (isShuffle) return Math.floor(Math.random() * playlist.length);
    const nxt = currentIndex + 1;
    if (nxt >= playlist.length) return repeatMode === "all" ? 0 : null;
    return nxt;
  }, [currentIndex, isShuffle, repeatMode]);

  const changeTrack = useCallback(
    (idx: number | null, auto = true) => {
      if (idx === null) return;
      playerRef.current?.stopVideo();
      setCurrentIndex(idx);
      seekTo(0);
      if (auto) setTimeout(play, 200);
    },
    [play, seekTo]
  );

  const nextTrack = useCallback(() => {
    if (repeatMode === "one") {
      play();
      return;
    }
    changeTrack(getNext(), true);
  }, [changeTrack, getNext, play, repeatMode]);

  const prevTrack = useCallback(() => {
    if (isShuffle) {
      changeTrack(Math.floor(Math.random() * playlist.length), true);
      return;
    }
    let prev = currentIndex - 1;
    if (prev < 0) prev = repeatMode === "all" ? playlist.length - 1 : -1;
    changeTrack(prev >= 0 ? prev : null, true);
  }, [currentIndex, isShuffle, repeatMode, playlist.length, changeTrack]);

  // Когда YouTube изменяет состояние (ENDED, PLAYING и т. д.)
  const handleState = useCallback(
    (e: any) => {
      onStateChange(e);
      if (e.data === 0) nextTrack();
    },
    [onStateChange, nextTrack]
  );

  // Опции для YouTube IFrame
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  return (
    <div className="yt-audio-player-container">
      <div className="header-row">
        <h2>YouTube Мини-плеер</h2>
        <ThemeToggle
          isDarkMode={isDark}
          onToggle={() => setIsDark((d) => !d)}
        />
      </div>

      <Playlist
        items={playlist}
        currentIndex={currentIndex}
        onSelect={(i) => changeTrack(i, true)}
      />

      <YouTube
        videoId={playlist[currentIndex].videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={handleState}
      />

      <Controls
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={prevTrack}
        onNext={nextTrack}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle((s) => !s)}
        repeatMode={repeatMode}
        onToggleRepeat={() =>
          setRepeatMode((r) =>
            r === "none" ? "all" : r === "all" ? "one" : "none"
          )
        }
      />

      <ProgressBar progress={progress} duration={duration} onSeek={seekTo} />

      <VolumeControl volume={volume} onVolumeChange={setVol} />
    </div>
  );
};

export default YouTubeAudioPlayer;
