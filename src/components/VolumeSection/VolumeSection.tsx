import React, { memo, useCallback } from "react";
import "./VolumeSection.scss";

interface Props {
  volume: number;
  onVolumeChange: (vol: number) => void;
}

const VolumeSection: React.FC<Props> = ({ volume, onVolumeChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onVolumeChange(parseInt(e.target.value, 10)),
    [onVolumeChange]
  );

  return (
    <label className="volume-section">
      Volume:
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={volume}
        onChange={handleChange}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volume}
      />
    </label>
  );
};

export default memo(VolumeSection);
