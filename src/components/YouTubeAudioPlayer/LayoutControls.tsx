// LayoutControls.tsx
import React from "react";
import ControlsWithTooltip from "../Controls/ControlsWithTooltip/ControlsWithTooltip";
import VisualizerToggle from "../Visualizer/VisualizerToggle/VisualizerToggle";
import { ProgressWithTime } from "../ProgressWithTime/ProgressWithTime";
import VolumeWithLabel from "../VolumeSection/VolumeWithLabel/VolumeWithLabel";

interface LayoutControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: "none" | "one" | "all"; // Исправлено на конкретные значения
  onToggleRepeat: () => void;
  showVisualizer: boolean;
  toggleVisualizer: () => void;
  analyserNode: AnalyserNode | null; // Уточнен тип
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  showVisualizer,
  toggleVisualizer,
  analyserNode,
  progress,
  duration,
  onSeek,
  volume,
  onVolumeChange,
}) => {
  return (
    <div className="layout-controls">
      <ControlsWithTooltip
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onPrev={onPrev}
        onNext={onNext}
        isShuffle={isShuffle}
        onToggleShuffle={onToggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={onToggleRepeat}
      />
      <VisualizerToggle
        show={showVisualizer}
        toggle={toggleVisualizer}
        isPlaying={isPlaying}
        analyserNode={analyserNode}
      />
      <div className="progress-volume-section">
        <ProgressWithTime
          progress={progress}
          duration={duration}
          onSeek={onSeek}
        />
        <VolumeWithLabel volume={volume} onVolumeChange={onVolumeChange} />
      </div>
    </div>
  );
};

export default LayoutControls;