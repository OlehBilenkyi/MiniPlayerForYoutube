// ControlsWithTooltip.tsx
import React from "react";
import ControlsSection from "../ControlsSection";
import "../../YouTubeAudioPlayer/YouTubeAudioPlayer.scss";

interface ControlsWithTooltipProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: string; // or whatever type it is
  onToggleRepeat: () => void;
}

const ControlsWithTooltip: React.FC<ControlsWithTooltipProps> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}) => {
  return (
    <div className="controls-tooltip">
      <ControlsSection
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onPrev={onPrev}
        onNext={onNext}
      />
      <div className="tooltip-text">
        <p>Space — Play/Pause</p>
        <p>←/→ — Seek, ↑/↓ — Volume</p>
      </div>
    </div>
  );
};

export default ControlsWithTooltip;
