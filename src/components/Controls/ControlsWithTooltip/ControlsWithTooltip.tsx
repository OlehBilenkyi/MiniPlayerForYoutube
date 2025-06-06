import React from "react";
import ControlsSection, { RepeatMode } from "../ControlsSection";
import "./YouTubeAudioPlayer.scss";

interface ControlsWithTooltipProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
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
        isShuffle={isShuffle}
        onToggleShuffle={onToggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={onToggleRepeat}
      />
      <div className="tooltip-text">
        <p>P — Previous, N — Next</p>
        <p>Space — Play/Pause, M — Mute/Unmute, стрелки — Seek/Volume</p>
      </div>
    </div>
  );
};

export default ControlsWithTooltip;
