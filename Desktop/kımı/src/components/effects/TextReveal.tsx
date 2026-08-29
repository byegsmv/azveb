"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  splitBy?: "word" | "character";
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  as = "div",
  splitBy = "word",
}: TextRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  const elements = splitBy === "word" ? children.split(" ") : children.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: splitBy === "word" ? 0.08 : 0.02, 
        delayChildren: delay * i 
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -40,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration,
      },
    },
  };

  const Component = motion[as as keyof typeof motion] as any;

  return (
    <Component
      ref={ref}
      className={`overflow-hidden flex flex-wrap text-foreground ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ perspective: "1000px" }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={child}
          className={`inline-block ${splitBy === "word" ? "mr-[0.25em]" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {element === " " && splitBy === "character" ? "\u00A0" : element}
        </motion.span>
      ))}
    </Component>
  );
}
