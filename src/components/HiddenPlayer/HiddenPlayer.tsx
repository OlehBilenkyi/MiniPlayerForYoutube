import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import "./HiddenPlayer.scss";

interface Props {
  url: string;
  playing: boolean;
  volume: number;
  onReady: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  onError: (error: Error) => void;
  initAnalyser: (media: HTMLMediaElement) => void;
  showVideo: boolean;
}

const HiddenPlayer = forwardRef<ReactPlayer, Props>(
  ({ url, playing, volume, onReady, onProgress, onEnded, onError, initAnalyser, showVideo }, ref) => {
    const localRef = useRef<ReactPlayer>(null);

    useImperativeHandle(ref, () => localRef.current!);

const handleReady = useCallback(() => {
  const internal = localRef.current!.getInternalPlayer();
  if (internal instanceof HTMLMediaElement) {
    initAnalyser(internal);
    internal.volume = volume / 100;
  }
  onReady();
}, [initAnalyser, onReady, volume]);


    return (
      <div className={`hidden-player-wrapper ${showVideo ? "hidden-player-wrapper--visible" : ""}`}>
        <ReactPlayer
          ref={localRef}
          url={url}
          playing={playing}
          controls={false}
          width="100%"
          height="auto"
          onReady={handleReady}
          onProgress={onProgress}
          onEnded={onEnded}
          onError={onError}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                playsinline: 1,
                showinfo: 0,
                autohide: 1,
                cc_load_policy: 0,
                color: "white",
                hl: "en",
                enablejsapi: 1,
                widget_referrer: window.location.origin,
              },
            },
          }}
        />
      </div>
    );
  }
);

export default HiddenPlayer;
