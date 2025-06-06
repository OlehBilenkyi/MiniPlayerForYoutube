// src/components/YouTubeAudioPlayer/ControlsSection.tsx
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
  // Иконки «repeat» меняются в зависимости от режима
  const repeatIcon = {
    none: "↻", // повторять запрещено
    all: "🔁", // повторять весь плейлист
    one: "🔂", // повторять только текущий трек
  }[repeatMode];

  return (
    <div className="yt-controls">
      <button onClick={onPrev} className="yt-btn">
        ⏮️
      </button>
      <button onClick={onPlayPause} className="yt-btn">
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button onClick={onNext} className="yt-btn">
        ⏭️
      </button>
      <button
        onClick={onToggleShuffle}
        className={`yt-btn ${isShuffle ? "active" : ""}`}
      >
        🔀
      </button>
      <button onClick={onToggleRepeat} className="yt-btn">
        {repeatIcon}
      </button>
    </div>
  );
};

export default ControlsSection;
