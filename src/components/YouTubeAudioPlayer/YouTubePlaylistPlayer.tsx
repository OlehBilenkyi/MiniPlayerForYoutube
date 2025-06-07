// src/components/YouTubeAudioPlayer/YouTubePlaylistPlayer.tsx
import React, { useEffect, useCallback, useState } from "react";
import Header from "../Header/Header";
import HiddenPlayer from "../HiddenPlayer/HiddenPlayer";
import ControlsWithTooltip from "../Controls/ControlsWithTooltip/ControlsWithTooltip";
import ProgressWithTime from "../ProgressWithTime/ProgressWithTime";
import VolumeWithLabel from "../VolumeSection/VolumeWithLabel/VolumeWithLabel";
import { useTheme } from "../../hooks/Theme/useTheme";
import { useHotkeys } from "../../hooks/hotkeys/useHotkeys";
import { usePlayerStore } from "../../hooks/player/usePlayerStore";
import "./YouTubeAudioPlayer.scss";

const PLAYLIST_URL =
  "https://www.youtube.com/watch?v=CdqPv4Jks_w&list=RDCdqPv4Jks_w";

const YouTubePlaylistPlayer: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // 1) initAnalyser один раз из стора
  const initAnalyser = usePlayerStore.getState().initAnalyser!;

  // 2) отдельные подписки на каждое поле/метод
  const playerRef = usePlayerStore((s) => s.playerRef);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const onReady = usePlayerStore((s) => s.onReady);
  const onProgress = usePlayerStore((s) => s.onProgress);
  const onEnded = usePlayerStore((s) => s.onEnded);

  // применяем тему к <body>
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // хоткеи
  useHotkeys({
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
  });

  // блокируем клики по внешнему контейнеру
  const blockClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className={`yt-audio-player-container${isDark ? " dark" : ""}`}>
      <Header
        title="YouTube Playlist Audio"
        videoTitle=""
        isDark={isDark}
        onToggleTheme={toggleTheme}
        extraControls={
          <button
            onClick={() => setShowVideo((v) => !v)}
            className="video-toggle-btn"
          >
            {showVideo ? "Скрыть видео" : "Показать видео"}
          </button>
        }
      />

      <div className="hidden-player-container" onClick={blockClick}>
        <HiddenPlayer
          playerRef={playerRef}
          url={PLAYLIST_URL}
          isPlaying={isPlaying}
          volume={volume}
          onReady={onReady}
          onProgress={({ playedSeconds }) => onProgress({ playedSeconds })}
          onEnded={onEnded}
          initAnalyser={initAnalyser}
          showVideo={showVideo}
        />
      </div>

      <ControlsWithTooltip
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={() => playerRef.current?.getInternalPlayer()?.previousVideo?.()}
        onNext={() => playerRef.current?.getInternalPlayer()?.nextVideo?.()}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={toggleRepeat}
      />

      <div className="progress-volume-section">
        <ProgressWithTime
          progress={progress}
          duration={duration}
          onSeek={(t) => {
            seekTo(t);
            setProgress(t);
          }}
        />
        <VolumeWithLabel volume={volume} onVolumeChange={setVolume} />
      </div>
    </div>
  );
};

export default YouTubePlaylistPlayer;
