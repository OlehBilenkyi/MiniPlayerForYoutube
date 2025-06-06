// src/components/ProgressBar/ProgressBar.tsx
import React from "react";
import "./ProgressBar.scss";

interface ProgressBarProps {
  progress: number; // текущее время (в секундах)
  duration: number; // общая длительность (в секундах)
  onSeek: (time: number) => void; // коллбэк при изменении позиции
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration,
  onSeek,
}) => {
  // Форматируем секунды в строку "mm:ss"
  const formatTime = (time: number): string => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Когда пользователь меняет рейндж
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="yt-progress-container">
      <div className="time-display">
        {/* Слева: текущая позиция, справа: общая длительность */}
        <span className="current-time">{formatTime(progress)}</span>
        <span className="total-time">{formatTime(duration)}</span>
      </div>

      {/* Сама полоска перемотки: */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={progress}
        onChange={handleChange}
        className="yt-progress-bar"
      />
    </div>
  );
};

export default ProgressBar;
