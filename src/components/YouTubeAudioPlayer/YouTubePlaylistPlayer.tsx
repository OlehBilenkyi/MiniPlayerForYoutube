import React, { useEffect, useCallback, useState } from "react";
import Header from "../Header/Header";
import HiddenPlayer from "../HiddenPlayer/HiddenPlayer";
import ControlsWithTooltip from "../Controls/ControlsWithTooltip/ControlsWithTooltip";
import ProgressWithTime from "../ProgressWithTime/ProgressWithTime";
import VolumeWithLabel from "../VolumeSection/VolumeWithLabel/VolumeWithLabel";
import PlaylistSection from "../Playlist/PlaylistSection/PlaylistSection";
import VisualizerToggle from "../Visualizer/VisualizerToggle/VisualizerToggle";
import { useTheme } from "../../hooks/Theme/useTheme";
import { useHotkeys } from "../../hooks/Hotkeys/useHotkeys";
import { usePlayerStore } from "../../hooks/player/usePlayerStore";
import { usePlaylist } from "../../hooks/Playlist/usePlaylist";
import { useVisualizerToggle } from "../../hooks/VisualizerToggle/useVisualizerToggle";
import "./YouTubeAudioPlayer.scss";

const PLAYLIST_ID = "RDCdqPv4Jks_w";

const YouTubePlaylistPlayer: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Zustand-store для плеера
  const initAnalyser = usePlayerStore.getState().initAnalyser!;
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

  // Хук плейлиста YouTube
  const { playlist, currentIndex, changeTrack, loading, error } =
    usePlaylist(PLAYLIST_ID);

  // Визуализатор
  const { showVisualizer, setShowVisualizer, audioContext, sourceNode } =
    useVisualizerToggle();
  const toggleVisualizer = () => setShowVisualizer((v) => !v);

  // Применяем тему к body
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // Хоткеи
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

  // Блок кликов
  const blockClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // URL текущего трека
  const currentVideoId = playlist[currentIndex]?.videoId;
  const url = currentVideoId
    ? `https://www.youtube.com/watch?v=${currentVideoId}&list=${PLAYLIST_ID}`
    : "";

  if (error) return <div className="error">Ошибка: {error}</div>;
  if (loading) return <div className="loading">Загрузка плейлиста…</div>;

  return (
    <div className={`yt-audio-player-container${isDark ? " dark" : ""}`}>
      <Header
        title="YouTube Playlist Audio"
        videoTitle={playlist[currentIndex]?.title || ""}
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
          url={url}
          isPlaying={isPlaying}
          volume={volume}
          onReady={onReady}
          onProgress={({ playedSeconds }) => onProgress({ playedSeconds })}
          onEnded={onEnded}
          initAnalyser={initAnalyser}
          showVideo={showVideo}
        />
      </div>

      <PlaylistSection
        items={playlist}
        currentIndex={currentIndex}
        onSelect={(idx) => changeTrack(idx, true, play, seekTo)}
      />

      <ControlsWithTooltip
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={() => changeTrack(currentIndex - 1, true, play, seekTo)}
        onNext={() => changeTrack(currentIndex + 1, true, play, seekTo)}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={toggleRepeat}
      />

      <VisualizerToggle
        show={showVisualizer}
        toggle={toggleVisualizer}
        isPlaying={isPlaying}
        audioContext={audioContext}
        sourceNode={sourceNode}
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
