import React, { useEffect, useRef, memo } from "react";
import "./Visualizer.scss";

interface Props {
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
}

const Visualizer: React.FC<Props> = ({ isPlaying, analyserNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyserNode) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyserNode.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength;
      dataArray.forEach((v, i) => {
        const h = (v / 255) * canvas.height;
        ctx.fillStyle = `hsl(${(i / bufferLength) * 360},100%,50%)`;
        ctx.fillRect(i * barWidth, canvas.height - h, barWidth, h);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, analyserNode]);

  return <canvas ref={canvasRef} className="visualizer-canvas" />;
};

export default memo(Visualizer);
