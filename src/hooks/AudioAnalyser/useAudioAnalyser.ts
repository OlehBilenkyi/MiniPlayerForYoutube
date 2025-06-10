import { useRef, useCallback } from "react";

export function useAudioAnalyser() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const initAnalyser = useCallback((media: HTMLMediaElement) => {
    if (audioContextRef.current) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(media);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioContextRef.current = ctx;
    sourceNodeRef.current = source;
    analyserRef.current = analyser;
  }, []);

  return {
    initAnalyser,
    audioContext: audioContextRef.current,
    sourceNode: sourceNodeRef.current,
    analyserNode: analyserRef.current,
  };
}
