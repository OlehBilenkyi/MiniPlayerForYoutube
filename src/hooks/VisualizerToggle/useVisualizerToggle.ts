import { useState, useCallback } from "react";

export function useVisualizerToggle() {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const toggleVisualizer = useCallback(() => setShowVisualizer(v => !v), []);
  return { showVisualizer, toggleVisualizer };
}
