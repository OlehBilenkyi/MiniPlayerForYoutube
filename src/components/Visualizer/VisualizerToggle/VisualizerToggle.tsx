import React, { memo } from "react";
import Visualizer from "../Visualizer";
import "./VisualizerToggle.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
}

const VisualizerToggle: React.FC<Props> = ({
  show,
  toggle,
  isPlaying,
  analyserNode,
}) => (
  <div
    className={`visualizer-toggle ${show ? "" : "visualizer-toggle--hidden"}`}
  >
    <button
      type="button"
      className="toggle-visualizer-btn"
      onClick={toggle}
      aria-pressed={show}
      aria-label="Toggle visualizer"
    >
      {show ? "Hide Visualizer" : "Show Visualizer"}
    </button>
    {show && (
      <div className="visualizer-toggle__canvas-wrapper">
        <Visualizer isPlaying={isPlaying} analyserNode={analyserNode} />
      </div>
    )}
  </div>
);

export default memo(VisualizerToggle);
