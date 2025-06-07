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
    <div className="visualizer-toggle-container">
      <button className="toggle-visualizer-btn" onClick={toggle}>
        {show ? "Hide Visualizer" : "Show Visualizer"}
      </button>
      {show && (
        <div className="visualizer-wrapper">
          <Visualizer
            isPlaying={isPlaying}
            audioContext={audioContext}
            sourceNode={sourceNode}
          />
        </div>
      )}
    </div>
  );
};

export default VisualizerToggle;
