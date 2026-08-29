"use client";

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion } from "framer-motion";

export default function AuroraBackground() {
  const tier = usePerformanceTier();

  if (tier === "low") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 cyber-grid">
        <div className="absolute inset-0 bg-background transition-colors duration-500" />
        <div
          className="absolute -top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 cyber-grid">
      {/* Background that cleanly adapts to Light / Dark mode */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* Cyber Indigo Aurora Orb */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-35 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(168,85,247,0.3) 50%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Electric Cyan Aurora Orb */}
      <motion.div
        className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-45 dark:opacity-25 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.5) 0%, rgba(99,102,241,0.2) 60%, transparent 70%)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Neon Violet / Rose Aura */}
      <motion.div
        className="absolute -bottom-[20%] left-[25%] w-[60vw] h-[50vw] rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-40 dark:opacity-30 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(168,85,247,0.4) 50%, transparent 70%)",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Subtle Radial Vignette for Depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
