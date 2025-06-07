import React from "react";
import ReactPlayer from "react-player";
import "./HiddenPlyer.scss";

interface HiddenPlayerProps {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  url: string;
  isPlaying: boolean;
  volume: number;
  onReady: (e: any) => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  initAnalyser: (media: HTMLMediaElement) => void;
  showVideo?: boolean;
}

const HiddenPlayer: React.FC<HiddenPlayerProps> = ({
  playerRef,
  url,
  isPlaying,
  volume,
  onReady,
  onProgress,
  onEnded,
  initAnalyser,
  showVideo = false,
}) => {
  const blockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`hidden-player-wrapper ${showVideo ? "visible" : "hidden"}`}
    >
      {showVideo && <div className="video-overlay" onClick={blockClick} />}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={false}
        width="100%"
        height="100%"
        onReady={(event) => {
          onReady(event);
          const internal = playerRef.current?.getInternalPlayer();
          if (internal instanceof HTMLMediaElement) {
            initAnalyser(internal);
          }
        }}
        onProgress={onProgress}
        onEnded={onEnded}
        volume={volume / 100}
        config={{
          youtube: {
            playerVars: {
              listType: "playlist",
              list: url.includes("list=") ? url.split("list=")[1] : undefined,
              rel: 0,
              modestbranding: 1,
              iv_load_policy: 3,
              disablekb: 1,
              fs: 0, // Исправлено с 1 на 0 для отключения полноэкранного режима
              controls: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default HiddenPlayer;
