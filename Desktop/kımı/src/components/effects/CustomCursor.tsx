"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Yüngülləşdirilmiş, sürətli və heç bir gecikmə yaratmayan fizika
  const springConfig = { damping: 35, stiffness: 500, mass: 0.25 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const dotXSpring = useSpring(dotX, { damping: 50, stiffness: 900, mass: 0.1 });
  const dotYSpring = useSpring(dotY, { damping: 50, stiffness: 900, mass: 0.1 });

  useEffect(() => {
    let ticking = false;

    const moveCursor = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          cursorX.set(e.clientX - 18);
          cursorY.set(e.clientY - 18);
          dotX.set(e.clientX - 2.5);
          dotY.set(e.clientY - 2.5);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.classList.contains("cursor-pointer");

      setIsPointer(isClickable);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseover", handlePointerOver, { passive: true });

    setIsVisible(true);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handlePointerOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `,
        }}
      />

      {/* Outer Glowing Brand "A" Logo Ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-2xl pointer-events-none z-[9999] hidden md:flex items-center justify-center will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
          background: isPointer
            ? "radial-gradient(circle, rgba(255,107,53,0.3) 0%, rgba(255,60,10,0.08) 70%)"
            : "radial-gradient(circle, rgba(255,107,53,0.12) 0%, rgba(0,0,0,0) 70%)",
          border: isPointer
            ? "1.5px solid rgba(255,107,53,0.75)"
            : "1px solid rgba(255,107,53,0.3)",
          boxShadow: isPointer
            ? "0 0 15px rgba(255,107,53,0.4)"
            : "0 0 8px rgba(255,107,53,0.15)",
        }}
        animate={{
          scale: isPointer ? 1.25 : 1,
          rotate: isPointer ? 30 : 0,
        }}
        transition={{ scale: { duration: 0.15 }, rotate: { duration: 0.2 } }}
      >
        <svg
          viewBox="0 0 40 45"
          className="w-3.5 h-3.5 text-accent drop-shadow-[0_0_5px_rgba(255,107,53,0.6)]"
          fill="currentColor"
        >
          <path d="M20 3 L36 41 H27.5 L20 22.5 L12.5 41 H4 Z M14 30 H26 L20 16.5 Z" />
        </svg>
      </motion.div>

      {/* Inner Laser Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] hidden md:block will-change-transform"
        style={{
          x: dotXSpring,
          y: dotYSpring,
          opacity: isVisible ? 1 : 0,
          background: "#ff5a1f",
          boxShadow: "0 0 6px #ff5a1f",
        }}
        animate={{
          scale: isPointer ? 0.4 : 1,
        }}
        transition={{ scale: { duration: 0.12 } }}
      />
    </>
  );
}
