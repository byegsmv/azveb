"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    // Reverse direction if user is scrolling up
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 leading-[0.8] tracking-tighter">
      <motion.div className="flex whitespace-nowrap text-display-xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-hover opacity-80 dark:opacity-40" style={{ x }}>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="py-24 relative overflow-hidden bg-surface dark:bg-surface-elevated/20">
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-surface dark:from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-surface dark:from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex flex-col gap-4">
        <ParallaxText baseVelocity={-2}>DIGITAL MARKETING</ParallaxText>
        <ParallaxText baseVelocity={2}>WEB DEVELOPMENT</ParallaxText>
      </div>
    </section>
  );
}
