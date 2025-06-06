
import React, { useEffect } from "react";
import ReactPlayer from "react-player";

interface HiddenPlayerProps {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  url: string;
  isPlaying: boolean;
  volume: number;
  onReady: (e: any) => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  initAnalyser: (media: unknown) => void;
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
}) => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={false}
        width="0"
        height="0"
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
              fs: 0,
              controls: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default HiddenPlayer;

