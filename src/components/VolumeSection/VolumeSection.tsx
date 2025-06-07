import React from "react";
import "./VolumeSection.scss";

interface VolumeSectionProps {
  volume: number; // 0–100
  onVolumeChange: (vol: number) => void;
}

const VolumeSection: React.FC<VolumeSectionProps> = ({
  volume,
  onVolumeChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="volume-section">
      <label htmlFor="volume-input">Volume:</label>
      <input
        id="volume-input"
        type="range"
        min={0}
        max={100}
        step={1}
        value={volume}
        onChange={handleChange}
      />
    </div>
  );
};

export default VolumeSection;
