import React from "react";
import HiddenPlayer from "../HiddenPlayer/HiddenPlayer";
import PlaylistSection from "../Playlist/PlaylistSection/PlaylistSection";
import "./LayoutMain.sass";

interface LayoutMainProps {
  url: string;
  playerRef: React.RefObject<any>;
  isPlaying: boolean;
  volume: number;
  onReady: () => void;
  onProgress: (state: any) => void;
  onEnded: () => void;
  onError: (error: Error) => void;
  initAnalyser: (mediaElement: HTMLMediaElement) => void;
  playlist: any[];
  currentIndex: number;
  changeTrack: (index: number, shouldPlay: boolean, play: () => void, seekTo: (time: number) => void) => void;
  play: () => void;
  seekTo: (time: number) => void;
  loading: boolean;
}

const LayoutMain: React.FC<LayoutMainProps> = ({
  url,
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
    {url && (
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
);

export default LayoutMain;
