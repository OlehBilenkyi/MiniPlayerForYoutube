import React, { memo } from "react";
import "./ControlsSection.scss";

interface Props {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: "none" | "one" | "all";
  onToggleRepeat: () => void;
}

const ControlsSection: React.FC<Props> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}) => (
  <div className="player-controls" role="group" aria-label="Player controls">
    <button
      type="button"
      className="control-btn control-btn--prev"
      onClick={onPrev}
      aria-label="Previous track"
    >
      <svg viewBox="0 0 24 24">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
      </svg>
    </button>

    <button
      type="button"
      className={`control-btn control-btn--shuffle ${isShuffle ? "control-btn--active" : ""}`}
      onClick={onToggleShuffle}
      aria-pressed={isShuffle}
      aria-label="Toggle shuffle"
    >
      <svg viewBox="0 0 24 24">
        <path d="M16 6h2v2h-2zM4 6h2v2H4zM4 16h2v2H4zM16 16h2v2h-2zM6.5 11l5 5h2l-5-5h-2z" />
      </svg>
    </button>

    <button
      type="button"
      className="control-btn control-btn--play-pause"
      onClick={onPlayPause}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>

    <button
      type="button"
      className="control-btn control-btn--repeat"
      onClick={onToggleRepeat}
      aria-pressed={repeatMode !== "none"}
      aria-label={`Repeat mode: ${repeatMode}`}
    >
      <svg viewBox="0 0 24 24">
        {repeatMode === "one" ? (
          <path d="M7 7h10v2l3-3-3-3v2H7v2zM17 13h-10v-2l-3 3 3 3v-2h10v-2zm-5 1h-2v-4h2v4z" />
        ) : (
          <path d="M7 7h10v2l3-3-3-3v2H7v2zM17 13h-10v-2l-3 3 3 3v-2h10v-2z" />
        )}
      </svg>
    </button>

    <button
      type="button"
      className="control-btn control-btn--next"
      onClick={onNext}
      aria-label="Next track"
    >
      <svg viewBox="0 0 24 24">
        <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
      </svg>
    </button>
  </div>
);

export default memo(ControlsSection);
