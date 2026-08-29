"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  label: string;
}

export default function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  decimals = 0,
  label,
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const count = useCountUp({ end, duration, decimals });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <div className="text-display-md font-bold gradient-text">
        {isInView ? `${prefix}${count}${suffix}` : `${prefix}0${suffix}`}
      </div>
      <p className="text-muted text-sm mt-2 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}
