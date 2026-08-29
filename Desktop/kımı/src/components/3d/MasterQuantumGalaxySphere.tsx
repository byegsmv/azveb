"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MasterQuantumGalaxySphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Ultra-Optimized Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Turn off heavy multisample AA for light GPU load
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(1); // Lock DPR to 1 to reduce fillrate by 4x
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. Ultra-Light Optimized Particle Count (1,500 particles - Silky smooth on any potato PC)
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#818cf8"); // Cyber Indigo
    const color2 = new THREE.Color("#38bdf8"); // Electric Cyan
    const colorCore = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 1.2) * 10 + 1.5;
      const spinAngle = radius * 1.8;
      const branchAngle = ((i % 3) * ((2 * Math.PI) / 3));

      const randomSpread = (Math.random() - 0.5) * 1.5;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomSpread;
      positions[i3 + 1] = (Math.random() - 0.5) * 2.0;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomSpread;

      const mixedColor = radius < 3 ? colorCore : i % 2 === 0 ? color1 : color2;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.22,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 3. Mouse Parallax with Throttle
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * -1.5;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // 4. Smooth 60 FPS Throttled Loop (Pauses when scrolled away)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (isVisible) {
        const elapsed = clock.getElapsedTime();

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        particleSystem.rotation.y = elapsed * 0.08 + mouse.x * 0.5;
        particleSystem.rotation.x = mouse.y * 0.3;

        camera.position.x = mouse.x * 2;
        camera.position.y = mouse.y * 1.5;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
}
