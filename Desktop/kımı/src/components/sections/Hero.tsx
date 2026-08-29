"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { scrollToSection } from "@/hooks/useScrollNav";
import { Link } from "@/i18n/navigation";
import MagneticButton from "@/components/effects/MagneticButton";
import FloatingParticles from "@/components/effects/FloatingParticles";
import { ArrowRight, Play } from "lucide-react";

// Dynamically import 3D Canvas to bypass SSR issues
const Hero3DCanvas = dynamic(() => import("@/components/3d/Hero3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-accent/15 blur-3xl animate-pulse" />
    </div>
  ),
});

export default function Hero() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // WebGL Fluid Shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;

      #define PI 3.14159265359

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 6; i++) {
          value += amplitude * smoothNoise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;

        vec2 mouseOffset = (mouse - 0.5) * 0.3;
        p += mouseOffset;

        float t = time * 0.15;

        float n1 = fbm(p * 1.5 + vec2(t, t * 0.7));
        float n2 = fbm(p * 2.0 - vec2(t * 0.5, t));
        float n3 = fbm(p * 0.8 + vec2(t * 0.3, -t * 0.4));

        float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

        // Ultra-luminous Cyber Space Palette (Obsidian, Indigo, Neon Violet, Electric Cyan)
        vec3 colorDeep = vec3(0.015, 0.015, 0.025);
        vec3 colorIndigo = vec3(0.08, 0.05, 0.22);
        vec3 colorViolet = vec3(0.35, 0.12, 0.65);
        vec3 colorCyan = vec3(0.15, 0.55, 0.95);

        vec3 finalColor = mix(colorDeep, colorIndigo, smoothstep(0.1, 0.9, pattern));
        finalColor = mix(finalColor, colorViolet, pow(n2, 2.2) * 0.85);
        finalColor = mix(finalColor, colorCyan, pow(n3, 3.2) * 0.7);

        // Interactive mouse luminescence (Electric Violet Aura)
        float glow = smoothstep(0.45, 0.0, length(p - mouseOffset * 2.0));
        finalColor += vec3(0.55, 0.45, 1.0) * glow * 0.22;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "time");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const mouseLocation = gl.getUniformLocation(program, "mouse");

    let animationId: number;
    let startTime = Date.now();
    const mouseRef = { x: 0.5, y: 0.5 };
    let isVisible = true;

    const resize = () => {
      // Optimizasiya: DPR 1.5 ilə məhdudlaşdıraraq 4K ekranlarda GPU-nu qoruyaq
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.x = e.clientX / window.innerWidth;
      mouseRef.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Yalnız Hero ekranda görünəndə GPU işləsin
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const render = () => {
      if (isVisible) {
        const time = (Date.now() - startTime) / 1000;
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouseRef.x, mouseRef.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Background (2D Ambient Flow) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 dark:opacity-100 transition-opacity duration-500"
        style={{ zIndex: 0 }}
      />

      {/* 3D Brand Emblem Visual Centerpiece */}
      <div className="absolute inset-0 z-[2] w-full h-full pointer-events-none flex items-center justify-center">
        <Hero3DCanvas />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-[3] pointer-events-none transition-colors duration-500" />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        <FloatingParticles count={30} />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-sm font-medium">{t("badge")}</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-display-xl font-bold tracking-tight mb-6 text-foreground"
        >
          <span className="block">{t("title").split("\n")[0]}</span>
          <span className="block gradient-text">{t("title").split("\n")[1]}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            onClick={() => scrollToSection("contact")}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/25 cursor-pointer"
          >
            {t("cta_primary")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>

          <MagneticButton
            onClick={() => scrollToSection("portfolio")}
            className="group inline-flex items-center gap-2 px-8 py-4 border border-border bg-surface text-foreground hover:bg-surface-elevated hover:border-accent/40 rounded-xl font-semibold text-lg transition-all shadow-sm cursor-pointer"
          >
            <Play className="w-5 h-5 text-accent" />
            {t("cta_secondary")}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — direct child of section, not inside content div */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}
          >
            <motion.div
              animate={{ opacity: [1, 0], y: [0, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-accent"
            />
          </motion.div>
          <span className="text-[9px] tracking-[0.25em] uppercase text-white/25 font-medium">
            scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
