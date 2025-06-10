import { useState } from "react";
import { useAudioAnalyser } from "../AudioAnalyser/useAudioAnalyser";

export function useVisualizerToggle() {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const { initAnalyser, audioContext, analyserNode } = useAudioAnalyser();
  return {
    showVisualizer,
    setShowVisualizer,
    initAnalyser,
    audioContext,
    analyserNode,
  };
}
