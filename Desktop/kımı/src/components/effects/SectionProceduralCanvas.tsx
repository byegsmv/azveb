"use client";

import { useEffect, useRef } from "react";

interface SectionProceduralCanvasProps {
  theme: "matrix-nodes" | "quantum-waves" | "cyber-hypercube" | "energy-core";
  intensity?: number;
  className?: string;
}

export default function SectionProceduralCanvas({
  theme,
  intensity = 0.5,
  className = "",
}: SectionProceduralCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth / 2);
    let height = (canvas.height = container.clientHeight / 2);

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        t += 0.02;

        ctx.strokeStyle = "rgba(129, 140, 248, 0.15)";
        ctx.lineWidth = 1;

        if (theme === "matrix-nodes") {
          for (let i = 0; i < 4; i++) {
            const y = (height / 5) * (i + 1) + Math.sin(t + i) * 6;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        } else if (theme === "quantum-waves") {
          ctx.beginPath();
          for (let x = 0; x < width; x += 10) {
            const y = height / 2 + Math.sin(x * 0.03 + t) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [theme]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full opacity-40" />
    </div>
  );
}
