import React from "react";
import "./ControlsSection.scss";

interface ControlsSectionProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
}) => {
  return (
    <div className="player-controls">
      <button
        className="control-btn"
        onClick={onPrev}
        title="Previous"
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      <button
        className="control-btn play-pause"
        onClick={onPlayPause}
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        className="control-btn"
        onClick={onNext}
        title="Next"
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ControlsSection;
