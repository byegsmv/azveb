"use client";

import { useRef, useEffect, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import { Sparkles, ArrowDown, Target, Film, ShieldCheck } from "lucide-react";
import { scrollToSection } from "@/hooks/useScrollNav";

export default function CinematicProceduralSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const timeRef = useRef(0);
  const TOTAL_VIRTUAL_FRAMES = 180;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_VIRTUAL_FRAMES - 1]);

  // Dynamic text transitions tied to scroll progression
  const text1Opacity = useTransform(scrollYProgress, [0.0, 0.04, 0.18, 0.23], [1, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.0, 0.04, 0.18, 0.23], [0, 0, 0, -40]);

  const text2Opacity = useTransform(scrollYProgress, [0.26, 0.32, 0.46, 0.52], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.26, 0.32, 0.46, 0.52], [40, 0, 0, -40]);

  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.62, 0.76, 0.82], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.55, 0.62, 0.76, 0.82], [40, 0, 0, -40]);

  const text4Opacity = useTransform(scrollYProgress, [0.84, 0.90, 0.98, 1.0], [0, 1, 1, 1]);
  const text4Y = useTransform(scrollYProgress, [0.84, 0.90, 0.98, 1.0], [40, 0, 0, 0]);

  // Main Render Loop (Continuous RAF for continuous grid/particle motion + Mouse Physics)
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += 0.02;
    const t = timeRef.current;
    const scrollVal = (currentFrameRef.current / (TOTAL_VIRTUAL_FRAMES - 1)) || 0;

    // Mouse smoothing (lerp)
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2 + mx * 40;
    const centerY = height / 2 + my * 40;
    const minDim = Math.min(width, height);

    // ─────────────────────────────────────────────────────────────
    // 1. DYNAMIC LIVING GRID (Üfüqi & Şaquli Hərəkətli Xətlər və İşıq Düyünləri)
    // ─────────────────────────────────────────────────────────────
    const gridSize = 55;
    const gridOffsetX = (t * 20 + mx * 60) % gridSize;
    const gridOffsetY = (t * 20 + my * 60) % gridSize;

    // Vertical lines
    ctx.lineWidth = 0.6;
    for (let x = gridOffsetX; x < width; x += gridSize) {
      const distFromCenter = Math.abs(x - width / 2) / (width / 2);
      const alpha = Math.max(0, (1 - distFromCenter * 0.8) * 0.12);
      ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = gridOffsetY; y < height; y += gridSize) {
      const distFromCenter = Math.abs(y - height / 2) / (height / 2);
      const alpha = Math.max(0, (1 - distFromCenter * 0.8) * 0.12);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Grid Intersection Pulsing Nodes
    const step = gridSize * 2;
    for (let gx = (gridOffsetX % step); gx < width; gx += step) {
      for (let gy = (gridOffsetY % step); gy < height; gy += step) {
        // Mouse repelling / gravitational lens effect
        const dx = gx - (width / 2 + mx * width * 0.4);
        const dy = gy - (height / 2 + my * height * 0.4);
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        const mouseGlow = Math.max(0, 1 - mouseDist / 220);

        const pulse = Math.sin(t * 2 + (gx + gy) * 0.01) * 0.5 + 0.5;
        const nodeAlpha = (0.15 + pulse * 0.25) + mouseGlow * 0.6;
        const nodeSize = (1.5 + pulse * 1.2) + mouseGlow * 2.5;

        ctx.beginPath();
        ctx.arc(gx, gy, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = mouseGlow > 0.3 ? "#38bdf8" : `rgba(129, 140, 248, ${nodeAlpha})`;
        if (mouseGlow > 0.2) {
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. DEEP SPACE COSMIC AMBIENT AURA
    // ─────────────────────────────────────────────────────────────
    const zoom = 1 + scrollVal * 1.8;
    const rot = scrollVal * Math.PI * 2.5 + t * 0.3;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      minDim * 0.05 * zoom,
      centerX,
      centerY,
      minDim * 0.8 * zoom
    );
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.45)");
    gradient.addColorStop(0.35, "rgba(168, 85, 247, 0.25)");
    gradient.addColorStop(0.7, "rgba(56, 189, 248, 0.1)");
    gradient.addColorStop(1, "rgba(3, 3, 5, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // ─────────────────────────────────────────────────────────────
    // 3. MULTI-TIERED HOLOGRAPHIC 3D GYROSCOPIC RINGS
    // ─────────────────────────────────────────────────────────────
    const rings = [
      { r: minDim * 0.18 * zoom, rx: 1.2, ry: 0.4, color: "#818cf8", width: 2.5, speed: 1.0 },
      { r: minDim * 0.28 * zoom, rx: 0.5, ry: 1.1, color: "#38bdf8", width: 1.8, speed: -0.7 },
      { r: minDim * 0.38 * zoom, rx: 0.8, ry: 0.8, color: "#ec4899", width: 1.2, speed: 0.5 },
      { r: minDim * 0.48 * zoom, rx: 1.4, ry: 0.3, color: "#a855f7", width: 0.8, speed: -0.3 },
    ];

    rings.forEach((ring) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      // Mouse 3D tilt
      ctx.rotate(rot * ring.speed + mx * 0.8);

      ctx.beginPath();
      ctx.ellipse(0, 0, ring.r * ring.rx, ring.r * ring.ry, rot * 0.5 + my * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.width;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Node beacons on the rings
      const beaconAngle = rot * ring.speed * 2;
      const bx = Math.cos(beaconAngle) * ring.r * ring.rx;
      const by = Math.sin(beaconAngle) * ring.r * ring.ry;
      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 20;
      ctx.fill();

      ctx.restore();
    });

    // ─────────────────────────────────────────────────────────────
    // 4. CENTRAL 3D INTERACTIVE GLASS MONOGRAM CORE
    // ─────────────────────────────────────────────────────────────
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Math.sin(rot * 0.5) * 0.15 + mx * 0.5);
    ctx.scale(zoom, zoom);

    const coreSize = minDim * 0.12;
    const coreGrad = ctx.createLinearGradient(-coreSize, -coreSize, coreSize, coreSize);
    coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.28)");
    coreGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.18)");
    coreGrad.addColorStop(1, "rgba(168, 85, 247, 0.08)");

    // Glass rounded card
    ctx.beginPath();
    ctx.roundRect(-coreSize, -coreSize * 1.15, coreSize * 2, coreSize * 2.3, 24);
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.shadowColor = "rgba(129, 140, 248, 0.7)";
    ctx.shadowBlur = 25;
    ctx.stroke();

    // Luminous Brand "A" inside Core
    ctx.beginPath();
    const s = coreSize * 0.035;
    ctx.moveTo(0, -22 * s);
    ctx.lineTo(20 * s, 22 * s);
    ctx.lineTo(11 * s, 22 * s);
    ctx.lineTo(0, -2 * s);
    ctx.lineTo(-11 * s, 22 * s);
    ctx.lineTo(-20 * s, 22 * s);
    ctx.closePath();

    ctx.moveTo(-7 * s, 8 * s);
    ctx.lineTo(7 * s, 8 * s);
    ctx.lineTo(0, -6 * s);
    ctx.closePath();

    const aGrad = ctx.createLinearGradient(0, -25 * s, 0, 25 * s);
    aGrad.addColorStop(0, "#ffffff");
    aGrad.addColorStop(0.5, "#818cf8");
    aGrad.addColorStop(1, "#38bdf8");

    ctx.fillStyle = aGrad;
    ctx.shadowColor = "#818cf8";
    ctx.shadowBlur = 30;
    ctx.fill();

    ctx.restore();

    // ─────────────────────────────────────────────────────────────
    // 5. INTERACTIVE PARTICLES (Mouse Gravity / Floating Constellation)
    // ─────────────────────────────────────────────────────────────
    const particleCount = 55;
    for (let i = 0; i < particleCount; i++) {
      const pAngle = (i / particleCount) * Math.PI * 2 + rot * 0.4 + t * 0.2;
      const pDist = (minDim * 0.15 + (i * 13) % (minDim * 0.45)) * (0.8 + scrollVal * 0.6);
      let px = centerX + Math.cos(pAngle) * pDist;
      let py = centerY + Math.sin(pAngle) * pDist * 0.7;

      // Mouse attraction / deflection
      const pdx = (width / 2 + mx * width * 0.4) - px;
      const pdy = (height / 2 + my * height * 0.4) - py;
      const pMouseDist = Math.sqrt(pdx * pdx + pdy * pdy);
      if (pMouseDist < 180) {
        const force = (1 - pMouseDist / 180) * 25;
        px += (pdx / pMouseDist) * force;
        py += (pdy / pMouseDist) * force;
      }

      const pSize = 1 + (i % 3) * 0.9;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? "rgba(129, 140, 248, 0.85)" : "rgba(56, 189, 248, 0.85)";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 12;
      ctx.fill();
    }
  }, []);

  // Update Frame Index based on scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    currentFrameRef.current = latest;
  });

  // Start continuous 60-120fps RAF loop with mouse listener
  useEffect(() => {
    let animationId: number;

    const loop = () => {
      render();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [render]);

  return (
    <div id="hero" ref={containerRef} className="relative h-[450vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030305] flex items-center justify-center">
        {/* 4K / Retina Dynamic Procedural 3D Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Ambient Depth Gradients */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background/60" />

        {/* ─── Scroll Overlay 1: Hero & Vision ─── */}
        <motion.div
          style={{ opacity: text1Opacity, y: text1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Azveb Media
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight max-w-4xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Rəqəmsal Dünyada <span className="gradient-text">Zirvəyə Yüksəlin</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-xl mt-4 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            Brendinizi böyüdən, satışlarınızı qatlayan və bazarda fərq yaradan strateji rəqəmsal marketinq.
          </p>
          <div className="mt-10 flex items-center gap-2 text-white/50 text-xs tracking-widest uppercase animate-bounce font-semibold">
            <ArrowDown className="w-4 h-4 text-accent" /> Hekayəni Kəşf Etmək Üçün Sürüşdürün
          </div>
        </motion.div>

        {/* ─── Scroll Overlay 2: SMM & Targeted Ads ─── */}
        <motion.div
          style={{ opacity: text2Opacity, y: text2Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Target className="w-3.5 h-3.5" />
            Maksimum Dönüşüm & Satış
          </div>
          <h2 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Dəqiq Hədəfli <span className="gradient-text">Targetinq & SMM</span>
          </h2>
          <p className="text-white/70 text-lg sm:text-xl max-w-lg mt-4 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            Meta, TikTok və Google-da hər büdcə üçün 4x-8x ROAS və real alıcı auditoriyası.
          </p>
        </motion.div>

        {/* ─── Scroll Overlay 3: Cinematic Production & Reels ─── */}
        <motion.div
          style={{ opacity: text3Opacity, y: text3Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Film className="w-3.5 h-3.5" />
            Viral Məzmun İstehsalı
          </div>
          <h2 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Sinematik <span className="gradient-text">Prodakşn & Reels</span>
          </h2>
          <p className="text-white/70 text-lg sm:text-xl max-w-lg mt-4 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            Milyonlarla baxış toplayan yaradıcı ssenarilər, 4K çəkilişlər və güclü brend təqdimatı.
          </p>
        </motion.div>

        {/* ─── Scroll Overlay 4: Final CTA ─── */}
        <motion.div
          style={{ opacity: text4Opacity, y: text4Y }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Zəmanətli Böyümə
          </div>
          <h2 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight max-w-4xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Təsadüf Deyil, <span className="gradient-text">Mühəndislik.</span>
          </h2>
          <p className="text-white/70 text-lg sm:text-xl max-w-lg mt-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            Biznesinizi növbəti səviyyəyə daşımaq üçün bu gün ilk addımı atın.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToSection("calculator")}
              className="px-8 py-4 rounded-xl font-bold text-white bg-accent hover:bg-accent-hover transition-all shadow-xl shadow-accent/30 hover:scale-105 cursor-pointer"
            >
              Böyüməni Hesabla
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
            >
              Bizimlə Əlaqə
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
