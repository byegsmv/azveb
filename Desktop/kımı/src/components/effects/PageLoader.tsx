"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

export default function PageLoader() {
  const locale = useLocale();
  const subtitle =
    locale === "tr"
      ? "Dijital Büyüme & İnovasyon"
      : locale === "en"
      ? "Digital Growth & Innovation"
      : "Rəqəmsal İnkişaf & İnnovasiya";

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Smooth cybernetic counter animation
    const startTime = Date.now();
    const duration = 1400; // 1.4s ultra-responsive loading

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      const current = Math.round(ease * 100);
      setProgress(current);

      if (pct >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
        }, 300);
      }
    }, 16);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="luxury-loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#030305] text-white"
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Cybernetic Ambient Aura */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
          <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

          {/* Centerpiece Monogram */}
          <div className="relative flex flex-col items-center gap-8 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Outer Gyro Ring */}
              <motion.div
                className="absolute inset-[-16px] rounded-full border border-indigo-500/30 border-t-indigo-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[-6px] rounded-full border border-cyan-500/20 border-b-cyan-400"
                animate={{ rotate: -360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />

              {/* Glass Logo Box */}
              <div className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                <svg viewBox="0 0 60 70" width="38" height="38" fill="none">
                  <defs>
                    <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M30 5 L56 65 H42 L30 35 L18 65 H4 Z M20 48 H40 L30 22 Z"
                    fill="url(#loaderGrad)"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Typography */}
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Azveb <span className="gradient-text">Media</span>
              </h2>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-1">
                {subtitle}
              </p>
            </div>

            {/* Futuristic Progress Track */}
            <div className="w-56 flex flex-col items-center gap-2">
              <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-indigo-300 font-semibold tracking-wider">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
