// src/components/YouTubeAudioPlayer/YouTubePlaylistPlayer.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPlayer from "react-player";
import ControlsSection, { RepeatMode } from "./ControlsSection";
import ProgressSection from "./ProgressSection";
import VolumeSection from "./VolumeSection";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { usePlayerState } from "../../hooks/usePlayerState";
import { useAudioAnalyser } from "../../hooks/useAudioAnalyser";
import { usePlayerHandlers } from "../../hooks/usePlayerHandlers";
import "./YouTubeAudioPlayer.scss";

const STORAGE_KEY = "ytPlaylistPlayerState";

const YouTubePlaylistPlayer: React.FC = () => {
  // --------------- 1. URL вашего публичного плейлиста ---------------
  // Обратите внимание: достаточно указать ?list={ID_PLAYLIST}, ReactPlayer разберёт его как плейлист.
  const playlistUrl =
    "https://www.youtube.com/watch?v=CdqPv4Jks_w&list=RDCdqPv4Jks_w";

  // --------------- 2. Стейт: repeatMode, isShuffle, isDark, plus прогресс/громкость ---------------
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  })();

  const [videoTitle, setVideoTitle] = useState<string>("Loading...");
  const fetchVideoTitle = () => {
    const internal = playerRef.current?.getInternalPlayer();
    if (internal && typeof internal.getVideoData === "function") {
      const data = internal.getVideoData();
      if (data?.title) {
        setVideoTitle(data.title);
      } else {
        setTimeout(fetchVideoTitle, 500);
      }
    }
  };

  const [repeatMode, setRepeatMode] = useState<RepeatMode>(
    saved?.repeatMode ?? "none"
  );
  const [isShuffle, setIsShuffle] = useState<boolean>(
    saved?.isShuffle ?? false
  );
  const [isDark, setIsDark] = useState<boolean>(saved?.isDark ?? false);

  const initialProgress: number = saved?.progress ?? 0;
  const initialVolume: number = saved?.volume ?? 100;
  const autoPlayInitial = false;

  // --------------- 3. Хук usePlayerState (управляет isPlaying, progress, duration, volume) ---------------
  const playerRef = useRef<ReactPlayer | null>(null);
  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, "seconds");
    }
    setProgress(time);
  };
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

  // --------------- 4. Хук useAudioAnalyser (для визуализации, если понадобится) ---------------
  const { audioAnalyserRef, initAnalyser } = useAudioAnalyser();

  // --------------- 5. Хук usePlayerHandlers ---------------
  const {
    onReady,
    onProgress: handleProgress,
    onEnded: onPlayerEnded,
  } = usePlayerHandlers({
    playerRef,
    setDuration,
    setProgress,
    setIsPlaying: (flag: boolean) => {
      if (flag) play();
      else pause();
    },
    initAnalyser,
    initialProgress,
    initialVolume,
    autoPlayInitial,
  });

  // --------------- 6. Сохраняем в localStorage: progress, volume, repeatMode, isShuffle, isDark ---------------
  useEffect(() => {
    const toSave = {
      progress,
      volume,
      repeatMode,
      isShuffle,
      isDark,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [progress, volume, repeatMode, isShuffle, isDark]);

  // --------------- 7. Dark Mode: переключаем класс на <body> ---------------
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // --------------- 8. Горячие клавиши ---------------
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
          seekTo(Math.min(progress + 5, duration));
          break;
        case "ArrowLeft":
          seekTo(Math.max(progress - 5, 0));
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
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, progress, duration, volume, pause, play, seekTo, setVolume]);

  // --------------- 9. Логика Repeat / Shuffle ---------------
  // Если repeatMode = "one" → при окончании просто запускаем текущее заново.
  // Если repeatMode = "all" → YouTube сам переключит на следующий (или на первый, когда дойдёт до конца).
  // Если isShuffle = true → при окончании перемешиваем вручную.
  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      seekTo(0);
      play();
    } else {
      if (isShuffle && playerRef.current) {
        const internal = playerRef.current.getInternalPlayer();
        if (typeof internal.getPlaylist === "function") {
          const list: string[] = internal.getPlaylist();
          const randIdx = Math.floor(Math.random() * list.length);
          internal.playVideoAt(randIdx);
        }
      }
      // иначе: YouTube сам переключится к следующему треку (или к первому, если repeatMode="all").
    }
  }, [repeatMode, isShuffle, play, seekTo]);

  // --------------- 10. Рендер ---------------
  return (
    <div className={`yt-audio-player-container ${isDark ? "dark" : ""}`}>
      {/* Header + ThemeToggle */}
      <div className="header-row">
        <div className="header-row">
          <h2>YouTubePlaylistAudioPlayer</h2>
          <ThemeToggle
            isDarkMode={isDark}
            onToggle={() => setIsDark((p) => !p)}
          />
        </div>
        <p className="video-title">🎵 {videoTitle}</p> {/* добавь */}
      </div>

      {/* 1) Скрытый ReactPlayer */}
      <div className="player-section">
        <ReactPlayer
          ref={playerRef}
          url={playlistUrl}
          playing={isPlaying}
          controls={false}
          width="100%"
          height="360px"
          onReady={onReady}
          onProgress={handleProgress}
          onEnded={() => {
            onPlayerEnded();
            handleEnded();
            fetchVideoTitle();
          }}
          volume={volume / 100}
          config={{
            youtube: {
              playerVars: {
                listType: "playlist",
                list: "RDCdqPv4Jks_w",
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                disablekb: 1, // Отключаем клавиатурные управление YouTube, чтобы использовать свои горячие клавиши
                fs: 0, // Отключаем полноэкранный режим
              },
            },
          }}
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />

        <div className="visualizer-container">
          <canvas
            id="visualizer"
            width={350}
            height={100}
            style={{
              marginTop: "16px",
              background: "rgba(0, 0, 0, 0.05)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* 2) ControlsSection: Prev / PlayPause / Next / Shuffle / Repeat */}
      <ControlsSection
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={() => {
          if (playerRef.current) {
            const internal = playerRef.current.getInternalPlayer();
            if (typeof internal.previousVideo === "function") {
              internal.previousVideo();
            }
          }
        }}
        onNext={() => {
          if (playerRef.current) {
            const internal = playerRef.current.getInternalPlayer();
            if (typeof internal.nextVideo === "function") {
              internal.nextVideo();
            }
          }
        }}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle((p) => !p)}
        repeatMode={repeatMode}
        onToggleRepeat={() => {
          const nextMode: RepeatMode =
            repeatMode === "none"
              ? "all"
              : repeatMode === "all"
              ? "one"
              : "none";
          setRepeatMode(nextMode);
        }}
      />

      {/* 3) Полоса прогресса */}
      <ProgressSection
        progress={progress}
        duration={duration}
        onSeek={handleSeek}
      />

      {/* 4) Ползунок громкости */}
      <VolumeSection volume={volume} onVolumeChange={(v) => setVolume(v)} />
    </div>
  );
};

export default YouTubePlaylistPlayer;
