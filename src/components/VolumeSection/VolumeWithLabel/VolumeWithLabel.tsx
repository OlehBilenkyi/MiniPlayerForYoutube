import React, { memo } from "react";
import VolumeSection from "../VolumeSection";
import "./VolumeWithLabel.scss";

interface Props {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeWithLabel: React.FC<Props> = ({ volume, onVolumeChange }) => (
  <div className="volume-with-label">
    <VolumeSection volume={volume} onVolumeChange={onVolumeChange} />
    <span className="volume-label" aria-live="polite">{volume}%</span>
  </div>
);

export default memo(VolumeWithLabel);
