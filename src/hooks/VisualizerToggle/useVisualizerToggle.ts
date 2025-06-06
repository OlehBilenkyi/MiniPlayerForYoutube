import { useState } from "react";
import { useAudioAnalyser } from "../AudioAnalyser/useAudioAnalyser";

export function useVisualizerToggle() {
  const [showVisualizer, setShowVisualizer] = useState<boolean>(false);
  const { initAnalyser, audioContext, sourceNode } = useAudioAnalyser();

  return {
    showVisualizer,
    setShowVisualizer,
    initAnalyser,
    audioContext,
    sourceNode,
  };
}
