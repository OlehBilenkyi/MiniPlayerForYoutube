import React from "react";
import Visualizer from "../Visualizer";
import "./VisualizerToggle.scss";

interface VisualizerToggleProps {
  show: boolean;
  toggle: () => void;
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}

const VisualizerToggle: React.FC<VisualizerToggleProps> = ({
  show,
  toggle,
  isPlaying,
  audioContext,
  sourceNode,
}) => {
  return (
    <div className={`visualizer-wrapper ${show ? "" : "hidden"}`}>
      <button className="toggle-visualizer-btn yt-btn" onClick={toggle}>
        {show ? "Hide Visualizer" : "Show Visualizer"}
      </button>
      {show && (
        <Visualizer
          isPlaying={isPlaying}
          audioContext={audioContext}
          sourceNode={sourceNode}
        />
      )}
    </div>
  );
};

export default VisualizerToggle;
