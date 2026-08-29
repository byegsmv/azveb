"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { scrollToSection } from "@/hooks/useScrollNav";
import { soundManager } from "@/components/effects/SoundToggle";

interface BentoCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  className?: string;
  index: number;
}

export default function BentoCard({
  title,
  description,
  Icon,
  className = "",
  index,
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation degrees (tilt effect)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates (-0.5 to 0.5)
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const locale = useLocale();
  const ctaText =
    locale === "tr"
      ? "Sipariş Ver & Danışmanlık Al"
      : locale === "en"
      ? "Get Strategy & Quote"
      : "Sifariş et & Məsləhət al";

  return (
    <motion.div
      ref={ref}
      variants={itemVariant}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative p-8 rounded-3xl bg-surface/90 dark:bg-surface/80 backdrop-blur-md border border-border/80 dark:border-white/10 overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/40 transition-all ${className}`}
    >
      {/* Background radial gradient following hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div
        className="relative z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-accent" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-muted text-lg leading-relaxed">
          {description}
        </p>

        {/* Learn More link with arrow animation */}
        <div
          onClick={() => {
            soundManager.playClick();
            scrollToSection("contact");
          }}
          className="mt-8 inline-flex items-center text-accent font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <span>{ctaText}</span>
          <motion.svg
            className="w-5 h-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </motion.svg>
        </div>
      </div>
      
      {/* Glassmorphism reflection */}
      <div className="absolute -inset-px rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
