"use client";

import { useEffect } from "react";

const CRITICAL_ASSETS = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
];

export default function ResourcePreloader() {
  useEffect(() => {
    // 1. Critical Images Pre-cache (Browser In-Memory Cache)
    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // 2. Pre-compile WebGL Shader Context in Background
    try {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = 16;
      offscreenCanvas.height = 16;
      const gl = offscreenCanvas.getContext("webgl", {
        powerPreference: "high-performance",
        alpha: false,
      });
      if (gl) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    } catch {
      // Ignore background warmup fail
    }

    // 3. LocalStorage Preferences Caching
    try {
      if (!localStorage.getItem("azveb_preloaded")) {
        localStorage.setItem("azveb_preloaded", "true");
        localStorage.setItem("azveb_last_visit", Date.now().toString());
      }
    } catch {
      // Storage access blocked
    }
  }, []);

  return null;
}
