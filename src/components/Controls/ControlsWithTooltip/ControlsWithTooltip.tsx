import React, { memo } from "react";
import ControlsSection from "../ControlsSection";
import "./ControlsWithTooltip.scss";

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

const ControlsWithTooltip: React.FC<Props> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}) => (
  <div className="controls-tooltip" aria-describedby="controls-tooltip">
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
    <div
      id="controls-tooltip"
      role="tooltip"
      aria-hidden="true"
      className="controls-tooltip__text"
    >
      <p>Space — Play/Pause</p>
      <p>←/→ — Seek, ↑/↓ — Volume</p>
      <p>S — Shuffle, R — Repeat</p>
    </div>
  </div>
);

export default memo(ControlsWithTooltip);
