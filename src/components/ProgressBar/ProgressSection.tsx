import React from "react";
import "./ProgressSection.scss";

interface ProgressSectionProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  duration,
  onSeek,
}) => {
  const formatTime = (time: number): string => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    // убрали лишний '\' перед '${'
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="progress-section">
      <span className="current-time">{formatTime(progress)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={progress}
        onChange={handleChange}
        className="progress-slider"
      />
      <span className="total-time">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressSection;
