import React from "react";
import HiddenPlayer from "../HiddenPlayer/HiddenPlayer";
import PlaylistSection from "../Playlist/PlaylistSection/PlaylistSection";
import "./LayoutMain.sass";

interface LayoutMainProps {
  url: string;
  showVideo: boolean; // добавлено
  playerRef: React.RefObject<any>;
  isPlaying: boolean;
  volume: number;
  onReady: () => void;
  onProgress: (state: any) => void;
  onEnded: () => void;
  onError: (error: Error) => void;
  initAnalyser: (media: HTMLMediaElement) => void;
  playlist: Array<{ videoId: string; title: string }>;
  currentIndex: number;
  changeTrack: (
    idx: number,
    auto: boolean,
    playFn: () => void,
    seekFn: (sec: number) => void
  ) => void;
  play: () => void;
  seekTo: (sec: number) => void;
  loading: boolean;
}

const LayoutMain: React.FC<LayoutMainProps> = ({
  url,
  showVideo,
  playerRef,
  isPlaying,
  volume,
  onReady,
  onProgress,
  onEnded,
  onError,
  initAnalyser,
  playlist,
  currentIndex,
  changeTrack,
  play,
  seekTo,
  loading,
}) => (
  <div className="layout-main">
    <div className="video-area">
      <HiddenPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={volume}
        onReady={onReady}
        onProgress={onProgress}
        onEnded={onEnded}
        onError={onError}
        initAnalyser={initAnalyser}
        showVideo={showVideo} // передаём флаг дальше
      />
    </div>
    <div className="playlist-area">
      <PlaylistSection
        items={playlist}
        currentIndex={currentIndex}
        onSelect={(idx) => changeTrack(idx, true, play, seekTo)}
        loading={loading}
      />
    </div>
  </div>
);

export default LayoutMain;
