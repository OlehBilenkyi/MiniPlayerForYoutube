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
    <>
      <button className="yt-btn toggle-visualizer-btn" onClick={toggle}>
        {show ? "Скрыть эквалайзер" : "Показать эквалайзер"}
      </button>
      <div className={`visualizer-wrapper ${show ? "" : "hidden"}`}>
        <Visualizer
          isPlaying={isPlaying}
          audioContext={audioContext}
          sourceNode={sourceNode}
        />
      </div>
    </>
  );
};

export default VisualizerToggle;
