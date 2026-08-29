"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

interface Hero3DCanvasProps {
  className?: string;
}

/**
 * CSS/WebGL-based 3D Brand Emblem — performance-aware.
 * High: Full CSS 3D with RAF + mouse parallax
 * Medium: Slower RAF, no parallax
 * Low: Pure CSS animation, zero JS RAF
 */
export default function Hero3DCanvas({ className = "" }: Hero3DCanvasProps) {
  const tier = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    // Low tier: handled by pure CSS animation
    if (tier === "low" || tier === "medium") return;

    const el = containerRef.current;
    if (!el) return;

    let angle = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let lastTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 25;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * -15;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const emblem = el.querySelector<HTMLDivElement>(".emblem-3d");
    const ring1 = el.querySelector<HTMLDivElement>(".ring-1");
    const ring2 = el.querySelector<HTMLDivElement>(".ring-2");
    const ring3 = el.querySelector<HTMLDivElement>(".ring-3");

    const tick = (now: number) => {
      // Throttle to ~40fps on high tier to leave headroom
      if (now - lastTime < 25) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTime = now;

      angle += 0.35;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      if (emblem) {
        emblem.style.transform = `rotateX(${mouseY}deg) rotateY(${angle + mouseX}deg)`;
      }
      if (ring1) {
        ring1.style.transform = `rotateX(${60 + angle * 0.7}deg) rotateY(${angle * 0.9}deg)`;
      }
      if (ring2) {
        ring2.style.transform = `rotateX(${-45 + angle * -0.5}deg) rotateY(${angle * 0.6}deg) rotateZ(${angle * 0.4}deg)`;
      }
      if (ring3) {
        ring3.style.transform = `rotateX(${30 + angle * 0.3}deg) rotateZ(${-angle * 0.8}deg)`;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [tier]);

  // Low tier: pure CSS — zero JS overhead
  if (tier === "low") {
    return (
      <div
        className={`w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(255,107,53,0.4)",
              boxShadow: "0 0 30px rgba(255,107,53,0.2)",
            }}
          />
          <div
            className="w-[60%] h-[68%] rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,107,53,0.06))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 4px 24px rgba(255,107,53,0.2)",
            }}
          >
            <svg viewBox="0 0 80 90" width="55%" height="55%" fill="none">
              <defs>
                <linearGradient id="aGradL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d="M40 8 L72 82 H55 L40 45 L25 82 H8 Z M28 60 H52 L40 33 Z" fill="url(#aGradL)" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Medium tier: CSS animation-only (no RAF), with rotating rings via keyframes
  if (tier === "medium") {
    return (
      <div
        className={`w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center" style={{ perspective: "700px" }}>
          {/* CSS-only spinning ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1.5px solid rgba(255,107,53,0.5)",
              boxShadow: "0 0 16px rgba(255,107,53,0.3)",
              animation: "spin-ring 12s linear infinite",
              transformStyle: "preserve-3d",
            }}
          />
          <div
            className="absolute inset-[-14px] rounded-full"
            style={{
              border: "0.5px solid rgba(255,90,31,0.3)",
              animation: "spin-ring-rev 18s linear infinite",
              transformStyle: "preserve-3d",
            }}
          />
          {/* Glass card */}
          <div
            style={{
              width: "58%",
              height: "66%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,107,53,0.07))",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "16px",
              boxShadow: "0 6px 28px rgba(255,107,53,0.22), inset 0 1px 0 rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 80 90" width="52%" height="52%" fill="none">
              <defs>
                <linearGradient id="aGradM" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d="M40 8 L72 82 H55 L40 45 L25 82 H8 Z M28 60 H52 L40 33 Z" fill="url(#aGradM)" />
            </svg>
          </div>
          {/* Core glow */}
          <div
            className="absolute inset-[41%] rounded-full"
            style={{
              background: "#ff5a1f",
              boxShadow: "0 0 30px rgba(255,90,31,0.8)",
              animation: "core-pulse 2.5s ease-in-out infinite",
            }}
          />
        </div>
        <style>{`
          @keyframes spin-ring { from { transform: rotateX(60deg) rotateY(0deg); } to { transform: rotateX(60deg) rotateY(360deg); } }
          @keyframes spin-ring-rev { from { transform: rotateX(-45deg) rotateZ(0deg); } to { transform: rotateX(-45deg) rotateZ(-360deg); } }
          @keyframes core-pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.15); } }
        `}</style>
      </div>
    );
  }

  // High tier: full JS-driven 3D with mouse parallax
  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      <div className="relative w-56 h-56 sm:w-72 sm:h-72" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="ring-1 absolute inset-0 rounded-full"
          style={{
            transformStyle: "preserve-3d",
            border: "1.5px solid rgba(255,107,53,0.55)",
            boxShadow: "0 0 18px rgba(255,107,53,0.35), inset 0 0 10px rgba(255,107,53,0.15)",
            transform: "rotateX(60deg)",
          }}
        />
        <div
          className="ring-2 absolute inset-[-18px]"
          style={{
            transformStyle: "preserve-3d",
            borderRadius: "50%",
            border: "1px solid rgba(255,90,31,0.4)",
            boxShadow: "0 0 12px rgba(255,90,31,0.25)",
            transform: "rotateX(-45deg)",
          }}
        />
        <div
          className="ring-3 absolute inset-[-36px]"
          style={{
            transformStyle: "preserve-3d",
            borderRadius: "50%",
            border: "0.5px solid rgba(255,150,80,0.25)",
            transform: "rotateX(30deg)",
          }}
        />
        <div
          className="absolute inset-[30%] rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 35%, #ff8c5a, #ff4500 60%, #cc2200)",
            boxShadow: "0 0 40px rgba(255,80,20,0.9), 0 0 80px rgba(255,80,20,0.5)",
            animation: "core-pulse 2.5s ease-in-out infinite",
          }}
        />
        <div
          className="emblem-3d absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            style={{
              width: "60%",
              height: "68%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,107,53,0.08) 50%, rgba(255,255,255,0.06) 100%)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "18px",
              boxShadow: "0 8px 32px rgba(255,107,53,0.25), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translateZ(18px)",
            }}
          >
            <svg viewBox="0 0 80 90" width="55%" height="55%" fill="none">
              <defs>
                <linearGradient id="aGradH" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#ff8c5a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ff4500" stopOpacity="0.85" />
                </linearGradient>
                <filter id="aGlowH">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d="M40 8 L72 82 H55 L40 45 L25 82 H8 Z M28 60 H52 L40 33 Z" fill="url(#aGradH)" filter="url(#aGlowH)" />
            </svg>
          </div>
          <div style={{ position:"absolute", width:"60%", height:"68%", borderRadius:"18px", background:"rgba(255,60,10,0.12)", border:"1px solid rgba(255,107,53,0.2)", transform:"translateZ(-10px)" }} />
        </div>
      </div>
      <style>{`@keyframes core-pulse { 0%,100%{transform:scale(1);box-shadow:0 0 40px rgba(255,80,20,.9),0 0 80px rgba(255,80,20,.5);} 50%{transform:scale(1.12);box-shadow:0 0 60px rgba(255,80,20,1),0 0 120px rgba(255,80,20,.7);} }`}</style>
    </div>
  );
}
