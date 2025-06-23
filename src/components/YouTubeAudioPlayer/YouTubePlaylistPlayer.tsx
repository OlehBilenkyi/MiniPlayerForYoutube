import React, { useState, useEffect, useCallback } from "react";
import Header from "../Header/Header";
import LayoutMain from "../LayoutMain/LayoutMain";
import LayoutControls from "../LayoutMain/LayoutControls/LayoutControls";
import { useTheme } from "../../hooks/Theme/useTheme";
import { useHotkeys } from "../../hooks/Hotkeys/useHotkeys";
import { usePlayerStore } from "../../hooks/Player/usePlayerStore";
import { usePlaylist } from "../../hooks/Playlist/usePlaylist";
import { useAudioAnalyser } from "../../hooks/AudioAnalyser/useAudioAnalyser";
import { useVisualizerToggle } from "../../hooks/VisualizerToggle/useVisualizerToggle";
import "./YouTubeAudioPlayer.scss";

const PLAYLIST_ID = "RDCdqPv4Jks_w";

const YouTubePlaylistPlayer: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { playlist, currentIndex, changeTrack, loading, error } =
    usePlaylist(PLAYLIST_ID);

  const {
    playerRef,
    isPlaying,
    play,
    pause,
    progress,
    duration,
    volume,
    setVolume,
    seekTo,
    repeatMode,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    onReady,
    onProgress,
    onError,
  } = usePlayerStore();

  // 1) хук анализатора
  const { initAnalyser, analyserNode } = useAudioAnalyser();
  // 2) хук показа/скрытия визуализатора
  const { showVisualizer, toggleVisualizer } = useVisualizerToggle();

  const [showVideo, setShowVideo] = useState(false);

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
    toggleShuffle,
    toggleRepeat,
  });

  const handlePlayerReady = useCallback(() => {
    const player = playerRef.current;
    const internal = player?.getInternalPlayer();
    if (internal instanceof HTMLMediaElement) {
      initAnalyser(internal);
      internal.volume = volume / 100;
    }
    onReady();
  }, [initAnalyser, onReady, playerRef, volume]);

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      playerRef.current?.seekTo(0);
      play();
    } else {
      const next = (currentIndex + 1) % playlist.length;
      changeTrack(next, true, play, seekTo);
    }
  }, [currentIndex, playlist.length, repeatMode, changeTrack, play, seekTo]);

  const currentVideoId = playlist[currentIndex]?.videoId;
  const url = currentVideoId
    ? `https://www.youtube.com/watch?v=${currentVideoId}`
    : "";

  if (loading) return <div className="loading">Loading playlist...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div
      className={`yt-audio-player-container ${
        showVideo ? "layout--with-video" : "layout--no-video"
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
            onClick={() => setShowVideo((v) => !v)}
          >
            {showVideo ? "Hide Video" : "Show Video"}
          </button>
        }
      />

      <LayoutMain
        url={url}
        showVideo={showVideo}
        playerRef={playerRef}
        isPlaying={isPlaying}
        volume={volume}
        onReady={handlePlayerReady}
        onProgress={onProgress}
        onEnded={handleEnded}
        onError={onError}
        initAnalyser={initAnalyser}
        playlist={playlist}
        currentIndex={currentIndex}
        changeTrack={changeTrack}
        play={play}
        seekTo={seekTo}
        loading={loading}
      />

      <LayoutControls
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={() => changeTrack(currentIndex - 1, true, play, seekTo)}
        onNext={() => changeTrack(currentIndex + 1, true, play, seekTo)}
        isShuffle={isShuffle}
        onToggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={toggleRepeat}
        showVisualizer={showVisualizer}
        toggleVisualizer={toggleVisualizer}
        analyserNode={analyserNode}
        progress={progress}
        duration={duration}
        onSeek={seekTo}
        volume={volume}
        onVolumeChange={setVolume}
      />
    </div>
  );
};

export default YouTubePlaylistPlayer;
