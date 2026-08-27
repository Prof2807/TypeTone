import { useEffect, useRef } from "react";
import { getAnalyser } from "../../music/audioEngine";

export default function Visualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const bufferRef = useRef<Float32Array>(new Float32Array(600));
  const SMOOTH_FACTOR = 0.15;
  const SCROLL_SPEED = 2;
  const GAIN = 2.5;
  const OFFSET = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = getAnalyser();
    if (!analyser) return;

    let frameId: number;
    let smoothedValue = 0;

    const draw = () => {
      const rawData = analyser.getValue() as Float32Array;

      let maxIdx = 0;
      let maxAbs = 0;
      for (let i = 0; i < rawData.length; i++) {
        const abs = Math.abs(rawData[i]);
        if (abs > maxAbs) {
          maxAbs = abs;
          maxIdx = i;
        }
      }
      let peak = rawData[maxIdx];

      peak = Math.min(Math.max(peak * GAIN, -1), 1);

      smoothedValue = smoothedValue * (1 - SMOOTH_FACTOR) + peak * SMOOTH_FACTOR;

      const buffer = bufferRef.current;
      buffer.copyWithin(0, SCROLL_SPEED);
      for (let i = 0; i < SCROLL_SPEED; i++) {
        buffer[buffer.length - SCROLL_SPEED + i] = smoothedValue;
      }

      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.fillStyle = "#151515";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const activeWidth = width - OFFSET;

      const getColor = (y: number) => {
        const t = y / height;
        let r, g, b;
        if (t < 0.5) {
          const u = t / 0.5;
          r = 255;
          g = Math.round(255 * u);
          b = Math.round(255 * u);
        } else {
          const u = (t - 0.5) / 0.5;
          r = Math.round(255 * (1 - u));
          g = Math.round(255 * (1 - u));
          b = Math.round(255 - (255 - 150) * u);
        }
        return `rgb(${r},${g},${b})`;
      };

      for (let i = 0; i < activeWidth - 1; i++) {
        const idx1 = Math.min(Math.floor((i / activeWidth) * buffer.length), buffer.length - 1);
        const idx2 = Math.min(Math.floor(((i + 1) / activeWidth) * buffer.length), buffer.length - 1);
        const val1 = buffer[idx1];
        const val2 = buffer[idx2];
        const y1 = height * 0.5 - val1 * height * 0.45;
        const y2 = height * 0.5 - val2 * height * 0.45;
        const x1 = OFFSET + i;
        const x2 = OFFSET + i + 1;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = getColor((y1 + y2) / 2);
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: "none" }}
    />
  );
}