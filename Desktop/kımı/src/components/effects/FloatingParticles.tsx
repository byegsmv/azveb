"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles({ count = 20 }: { count?: number }) {
  const tier = usePerformanceTier();

  // Adapt particle count by tier
  const actualCount =
    tier === "low" ? 0 : tier === "medium" ? Math.min(count, 8) : count;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: actualCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15, // longer = fewer RAF calls
      delay: Math.random() * 8,
    }));
  }, [actualCount]);

  // Low-tier: render nothing
  if (tier === "low" || actualCount === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
