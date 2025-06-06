
import React, { useEffect, useRef } from "react";
import "./Visualizer.scss";

interface VisualizerProps {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}

const Visualizer: React.FC<VisualizerProps> = ({
  isPlaying,
  audioContext,
  sourceNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioContext || !sourceNode) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    sourceNode.connect(analyser);
    analyserRef.current = analyser;

    return () => {
      analyser.disconnect();
    };
  }, [audioContext, sourceNode]);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !canvasRef.current) {
      cancelAnimationFrame(animationRef.current || 0);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = `hsl(${i * 2}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current || 0);
    };
  }, [isPlaying]);

  return (
    <div className="visualizer-container">
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className="visualizer-canvas"
      />
    </div>
  );
};

export default Visualizer;
