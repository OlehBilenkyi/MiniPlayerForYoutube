import React, { memo } from "react";
import VolumeSection from "../VolumeSection";
import "./VolumeWithLabel.scss";

interface VolumeWithLabelProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeWithLabel: React.FC<VolumeWithLabelProps> = ({
  volume,
  onVolumeChange,
}) => {
  return (
    <div className="volume-with-label">
      <VolumeSection volume={volume} onVolumeChange={onVolumeChange} />
      <span className="volume-label" aria-live="polite">
        {volume}%
      </span>
    </div>
  );
};

export default VolumeWithLabel;
