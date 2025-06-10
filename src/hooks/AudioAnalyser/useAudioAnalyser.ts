import { useRef, useCallback, useEffect } from "react";

export function useAudioAnalyser() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const initAnalyser = useCallback((media: HTMLMediaElement) => {
    if (audioContextRef.current) return;
    const ctx = new AudioContext();
    const src = ctx.createMediaElementSource(media);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
  }, []);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return {
    initAnalyser,
    audioContext: audioContextRef.current,
    analyserNode: analyserRef.current,
  };
}
