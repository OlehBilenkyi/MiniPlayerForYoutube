
import React from "react";
import "../YouTubeAudioPlayer/YouTubeAudioPlayer.scss";

interface ProgressWithTimeProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressWithTime: React.FC<ProgressWithTimeProps> = ({
  progress,
  duration,
  onSeek,
}) => {
  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="progress-with-time">
      <span className="current-time">{formatTime(progress)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={progress}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="yt-progress-bar"
      />
      <span className="total-time">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressWithTime;
