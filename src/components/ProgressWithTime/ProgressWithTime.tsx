import React, { memo, useCallback } from "react";
import "./ProgressWithTime.scss";

interface Props {
  progress: number;
  duration: number;
  onSeek: (sec: number) => void;
}

const formatTime = (time: number): string => {
  if (isNaN(time) || time < 0) return "00:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const ProgressWithTime: React.FC<Props> = memo(({ progress, duration, onSeek }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSeek(parseFloat(e.target.value)),
    [onSeek]
  );
  return (
    <div className="progress-with-time" role="group" aria-label="Progress bar">
      <span className="current-time" aria-live="off">{formatTime(progress)}</span>
      <input
        type="range"
        className="yt-progress-bar"
        min={0}
        max={duration || 0}
        step={0.01}
        value={progress}
        onChange={handleChange}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={progress}
      />
      <span className="total-time">{formatTime(duration)}</span>
    </div>
  );
});