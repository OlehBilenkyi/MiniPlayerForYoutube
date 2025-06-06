import { useRef, useCallback } from "react";

export function useAudioAnalyser() {
  // сохраняем ссылку на AnalyserNode, AudioContext и исходный MediaElementAudioSourceNode
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const initAnalyser = useCallback((media: unknown) => {
    if (!(media instanceof HTMLMediaElement)) {
      return;
    }
    // если уже инициализировали — не делаем двойную инициализацию
    if (audioContextRef.current) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(media);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioContextRef.current = ctx;
    sourceNodeRef.current = source;
    audioAnalyserRef.current = analyser;
  }, []);

  return {
    initAnalyser,
    audioContext: audioContextRef.current,
    sourceNode: sourceNodeRef.current,
    analyserNode: audioAnalyserRef.current,
  };
}
