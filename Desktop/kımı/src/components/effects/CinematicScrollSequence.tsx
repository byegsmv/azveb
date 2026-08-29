"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowDown } from "lucide-react";
import { scrollToSection } from "@/hooks/useScrollNav";

interface CinematicScrollSequenceProps {
  totalFrames?: number;
  imageFolderPath?: string; // default: /images/sequence/
  fallbackHero?: React.ReactNode;
}

export default function CinematicScrollSequence({
  totalFrames = 120,
  imageFolderPath = "/images/sequence/",
  fallbackHero,
}: CinematicScrollSequenceProps) {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [hasFrames, setHasFrames] = useState<boolean | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const currentFrameRef = useRef(0);

  // Scroll tracking (500vh container for ultra-cinematic scrub)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Text overlay transitions linked to scroll progression
  const text1Opacity = useTransform(scrollYProgress, [0.0, 0.05, 0.18, 0.23], [1, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.0, 0.05, 0.18, 0.23], [0, 0, 0, -40]);

  const text2Opacity = useTransform(scrollYProgress, [0.26, 0.32, 0.46, 0.52], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.26, 0.32, 0.46, 0.52], [40, 0, 0, -40]);

  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.62, 0.76, 0.82], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.55, 0.62, 0.76, 0.82], [40, 0, 0, -40]);

  const text4Opacity = useTransform(scrollYProgress, [0.85, 0.91, 0.98, 1.0], [0, 1, 1, 1]);
  const text4Y = useTransform(scrollYProgress, [0.85, 0.91, 0.98, 1.0], [40, 0, 0, 0]);

  // Canvas frame renderer with crisp DPR and Cover-fit calculation
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, rect.width, rect.height);

    // "Cover" fit geometry
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = rect.width / rect.height;
    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawHeight = rect.height;
      drawWidth = rect.height * imgRatio;
      drawX = (rect.width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = rect.width;
      drawHeight = rect.width / imgRatio;
      drawX = 0;
      drawY = (rect.height - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // Preload test & frame buffer
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    // Test first frame availability
    const testImg = new Image();
    testImg.src = `${imageFolderPath}image1.jpg`;
    testImg.onload = () => {
      setHasFrames(true);
      // Load remaining frames
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `${imageFolderPath}image${i}.jpg`;
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          if (i === 1) renderFrame(0);
        };
        img.onerror = () => {
          loaded++;
          setLoadedCount(loaded);
        };
        images.push(img);
      }
      imagesRef.current = images;
    };
    testImg.onerror = () => {
      setHasFrames(false);
    };
  }, [imageFolderPath, totalFrames, renderFrame]);

  // Frame scrub event
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!hasFrames) return;
    const index = Math.min(Math.round(latest), totalFrames - 1);
    if (index !== currentFrameRef.current) {
      currentFrameRef.current = index;
      requestAnimationFrame(() => renderFrame(index));
    }
  });

  return (
    <div ref={containerRef} className="relative">
      {/* If sequence images are found, render full-screen sticky canvas scrub */}
      {hasFrames ? (
        <div className="h-[500vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030305]">
            <canvas
              ref={canvasRef}
              className="h-full w-full block object-cover"
            />

            {/* Ambient Vignette & Fog Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-background/50" />

            {/* Scroll Text Overlay 1: Intro */}
            <motion.div
              style={{ opacity: text1Opacity, y: text1Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Azveb Media
              </div>
              <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight max-w-4xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                Rəqəmsal Dünyada <span className="gradient-text">İz Buraxın</span>
              </h1>
              <p className="text-white/70 text-lg sm:text-xl max-w-xl mt-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                Strateji marketinq və qüsursuz brendinq ilə satışlarınızı maksimuma çatdırırıq.
              </p>
              <div className="mt-8 flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase animate-bounce">
                <ArrowDown className="w-4 h-4" /> Aşağı Sürüşdürün
              </div>
            </motion.div>

            {/* Scroll Text Overlay 2: Innovation & SMM */}
            <motion.div
              style={{ opacity: text2Opacity, y: text2Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
            >
              <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                Yüksək Dəqiqlikli <span className="gradient-text">Targetinq & SMM</span>
              </h2>
              <p className="text-white/70 text-lg sm:text-xl max-w-lg mt-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                Hər damla büdcəniz üçün maksimum ROAS və real alıcı kütləsi.
              </p>
            </motion.div>

            {/* Scroll Text Overlay 3: Cinematic Production */}
            <motion.div
              style={{ opacity: text3Opacity, y: text3Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
            >
              <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                Sinematik <span className="gradient-text">Video & Foto Prodakşn</span>
              </h2>
              <p className="text-white/70 text-lg sm:text-xl max-w-lg mt-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                Məhsul və brendinizi 4K keyfiyyətlə və viral süjetlərlə təqdim edirik.
              </p>
            </motion.div>

            {/* Scroll Text Overlay 4: Final Call */}
            <motion.div
              style={{ opacity: text4Opacity, y: text4Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-auto"
            >
              <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tight max-w-4xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                Möcüzə Deyil, <span className="gradient-text">Nəticə.</span>
              </h2>
              <button
                onClick={() => scrollToSection("contact")}
                className="mt-8 px-8 py-4 rounded-xl font-bold text-white bg-accent hover:bg-accent-hover transition-all shadow-xl shadow-accent/30 hover:scale-105 cursor-pointer"
              >
                Layihənizi Başladın
              </button>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Native Fallback when frame sequence is not in folder */
        fallbackHero
      )}
    </div>
  );
}
