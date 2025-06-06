import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPlayer from "react-player";
import ControlsSection, { RepeatMode } from "../Controls/ControlsSection";
import ProgressSection from "../ProgressBar/ProgressSection";
import VolumeSection from "../VolumeSection/VolumeSection";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { usePlayerState } from "../../hooks/PlayerState/usePlayerState";
import { useAudioAnalyser } from "../../hooks/AudioAnalyser/useAudioAnalyser";
import { usePlayerHandlers } from "../../hooks/PlayerHandlers/usePlayerHandlers";
import PlaylistSection, { PlaylistItem } from "../Playlist/PlaylistSection";
import "./YouTubeAudioPlayer.scss";

const STORAGE_KEY = "ytPlaylistPlayerState";

const YouTubePlaylistPlayer: React.FC = () => {
  // ————— 1. URL публичного плейлиста —————
  const playlistUrl =
    "https://www.youtube.com/watch?v=CdqPv4Jks_w&list=RDCdqPv4Jks_w";

  // ————— 2. Сохраняем/восстанавливаем repeatMode, isShuffle, isDark, progress, volume из localStorage —————
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
        // Если ещё нет заголовка, пытаемся снова через полсекунды
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

  // ————— 3. Хук usePlayerState: управляет isPlaying, progress, duration, volume —————
  const playerRef = useRef<ReactPlayer | null>(null);
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

  // ————— 4. Хук useAudioAnalyser (для визуализации, если понадобится) —————
  const { audioAnalyserRef, initAnalyser } = useAudioAnalyser();

  // ————— 5. Хук usePlayerHandlers —————
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

  // ————— 6. Сохраняем в localStorage при изменениях —————
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

  // ————— 7. Dark Mode: переключаем класс на <body> —————
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // ————— 8. Горячие клавиши —————
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

  // ————— 9. Логика Repeat / Shuffle при окончании трека —————
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
      // Иначе: YouTube сам переключится на следующий (или на первый, если repeatMode="all")
    }
  }, [repeatMode, isShuffle, play, seekTo]);

  // ————— 10. Рендер —————
  return (
    <div className={`yt-audio-player-container ${isDark ? "dark" : ""}`}>
      {/* Header + ThemeToggle + название трека */}
      <div className="header-row">
        <div className="header-row">
          <h2>YouTubePlaylistAudioPlayer</h2>
          <ThemeToggle
            isDarkMode={isDark}
            onToggle={() => setIsDark((prev) => !prev)}
          />
        </div>
        <p className="video-title">🎵 {videoTitle}</p>
      </div>

      {/* 1) Скрытый ReactPlayer + визуализатор */}
      <div className="player-section">
        <ReactPlayer
          ref={playerRef}
          url={playlistUrl}
          playing={isPlaying}
          controls={false}
          width="100%"
          height="360px"
          onReady={(event) => {
            onReady(); // Вызов без аргументов, если они не нужны
            fetchVideoTitle(); // сразу запрашиваем название
          }}
          onProgress={handleProgress}
          onEnded={() => {
            onPlayerEnded();
            handleEnded();
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
                disablekb: 1, // отключаем встроенные горячие клавиши YouTube
                fs: 0, // отключаем кнопку полноэкранного режима
                controls: 0, // скрываем стандартные кнопки YouTube
              },
            },
          }}
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            pointerEvents: "none", // блокируем клики по самому фрейму
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
        onToggleShuffle={() => setIsShuffle((prev) => !prev)}
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

      {/* 4) Полоса прогресса */}
      <ProgressSection
        progress={progress}
        duration={duration}
        onSeek={(time) => {
          if (playerRef.current) {
            playerRef.current.seekTo(time, "seconds");
          }
          setProgress(time);
        }}
      />

      {/* 5) Ползунок громкости */}
      <VolumeSection volume={volume} onVolumeChange={(v) => setVolume(v)} />
    </div>
  );
};

export default YouTubePlaylistPlayer;
