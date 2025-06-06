import React from "react";
import "./ControlsSection.scss";

export type RepeatMode = "none" | "one" | "all";

interface ControlsSectionProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}) => {
  const repeatIcon = {
    none: "↻",
    all: "🔁",
    one: "🔂",
  }[repeatMode];

  return (
    <div className="yt-controls">
      <button onClick={onPrev} className="yt-btn" title="Предыдущий (P)">
        ⏮️
      </button>
      <button
        onClick={onPlayPause}
        className="yt-btn"
        title="Play/Pause (Space)"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button onClick={onNext} className="yt-btn" title="Следующий (N)">
        ⏭️
      </button>
      <button
        onClick={onToggleShuffle}
        className={`yt-btn ${isShuffle ? "active" : ""}`}
        title="Перемешать треки"
      >
        🔀
      </button>
      <button
        onClick={onToggleRepeat}
        className="yt-btn"
        title="Повтор (None → All → One)"
      >
        {repeatIcon}
      </button>
    </div>
  );
};

export default ControlsSection;
