import React, { useEffect, useCallback } from "react";
import Header from "../Header/Header";
import HiddenPlayer from "../HiddenPlayer/HiddenPlayer";
import PlaylistSection from "../Playlist/PlaylistSection/PlaylistSection";
import ControlsWithTooltip from "../Controls/ControlsWithTooltip/ControlsWithTooltip";
import VisualizerToggle from "../Visualizer/VisualizerToggle/VisualizerToggle";
import { ProgressWithTime } from "../ProgressWithTime/ProgressWithTime";
import VolumeWithLabel from "../VolumeSection/VolumeWithLabel/VolumeWithLabel";

import { useTheme } from "../../hooks/Theme/useTheme";
import { useHotkeys } from "../../hooks/Hotkeys/useHotkeys";
import { usePlayerStore } from "../../hooks/player/usePlayerStore";
import { usePlaylist } from "../../hooks/Playlist/usePlaylist";
import { useAudioAnalyser } from "../../hooks/AudioAnalyser/useAudioAnalyser";
import { useVisualizerToggle } from "../../hooks/VisualizerToggle/useVisualizerToggle";

import "./YouTubeAudioPlayer.scss";

const PLAYLIST_ID = "RDCdqPv4Jks_w";

const YouTubePlaylistPlayer: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { playlist, currentIndex, changeTrack, loading, error } =
    usePlaylist(PLAYLIST_ID);

  // Individual selectors for Zustand store
  const playerRef = usePlayerStore((s) => s.playerRef);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const onReady = usePlayerStore((s) => s.onReady);
  const onProgress = usePlayerStore((s) => s.onProgress);
  const onEnded = usePlayerStore((s) => s.onEnded);

  const { initAnalyser, analyserNode } = useAudioAnalyser();
  const { showVisualizer, setShowVisualizer } = useVisualizerToggle();

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

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

  const handlePlayerReady = useCallback(() => {
    const player = playerRef.current;
    const internal = player?.getInternalPlayer();
    if (internal instanceof HTMLMediaElement) {
      initAnalyser(internal);
    }
    onReady();
  }, [initAnalyser, playerRef, onReady]);

  const toggleVisualizer = useCallback(() => {
    setShowVisualizer((v) => !v);
  }, [setShowVisualizer]);

  const currentVideoId = playlist[currentIndex]?.videoId;
  const url = currentVideoId
    ? `https://www.youtube.com/watch?v=${currentVideoId}`
    : "";

  if (loading) return <div className="loading">Loading playlist…</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div
      className={`yt-audio-player-container ${isDark ? "dark" : ""} ${
        url ? "layout--with-video" : "layout--no-video"
      }`}
    >
      <Header
        title="YouTube Playlist Audio"
        videoTitle={playlist[currentIndex]?.title || ""}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        extraControls={
          <button
            type="button"
            className="video-toggle-btn"
            onClick={toggleVisualizer}
          >
            {showVisualizer ? "Hide Video" : "Show Video"}
          </button>
        }
      />

      <div className="layout-main">
        {url && (
          <div className="video-area">
            <HiddenPlayer
              ref={playerRef}
              url={url}
              playing={isPlaying}
              volume={volume}
              onReady={handlePlayerReady}
              onProgress={onProgress}
              onEnded={onEnded}
              initAnalyser={initAnalyser}
              showVideo={!!url}
            />
          </div>
        )}

        <div className="playlist-area">
          <PlaylistSection
            items={playlist}
            currentIndex={currentIndex}
            onSelect={(idx) => changeTrack(idx, true, play, seekTo)}
            loading={loading}
          />
        </div>
      </div>

      <div className="layout-controls">
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
          analyserNode={analyserNode}
        />

        <div className="progress-volume-section">
          <ProgressWithTime
            progress={progress}
            duration={duration}
            onSeek={seekTo}
          />
          <VolumeWithLabel volume={volume} onVolumeChange={setVolume} />
        </div>
      </div>
    </div>
  );
};

export default YouTubePlaylistPlayer;
