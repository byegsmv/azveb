"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MasterHeroCosmos() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 2. Custom GLSL Shader for Holographic Raymarched Chromatic Crystal Torus Knot
    const customMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        uniform float uTime;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          // Organic vertex pulse & magnetic displacement
          vec3 pos = position;
          float pulse = sin(pos.x * 3.0 + uTime * 2.0) * cos(pos.y * 3.0 + uTime * 1.5) * 0.12;
          pos += normal * pulse;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vViewPosition = -mvPosition.xyz;
          vPosition = pos;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Optical Fresnel Glass rim reflection
          float fresnel = dot(viewDir, normal);
          fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
          float fresnelGlow = pow(fresnel, 3.5);

          // Liquid Iridescence / Thin-Film interference
          float n = sin(vPosition.x * 2.5 + uTime * 1.2) + cos(vPosition.y * 2.5 + uTime * 0.8) + sin(vPosition.z * 2.5);
          
          vec3 col1 = vec3(0.51, 0.55, 0.98); // Cyber Indigo
          vec3 col2 = vec3(0.22, 0.74, 0.98); // Electric Cyan
          vec3 col3 = vec3(0.92, 0.28, 0.60); // Neon Magenta
          vec3 colGold = vec3(1.0, 0.75, 0.3); // Luxury Gold Highlight

          vec3 baseColor = mix(col1, col2, sin(n + uTime) * 0.5 + 0.5);
          baseColor = mix(baseColor, col3, cos(n * 0.8 - uTime * 0.5) * 0.5 + 0.5);

          // Specular highlights
          vec3 lightDir = normalize(vec3(uMouse.x * 2.0, uMouse.y * 2.0, 3.0));
          vec3 halfVector = normalize(lightDir + viewDir);
          float NdotH = max(dot(normal, halfVector), 0.0);
          float specular = pow(NdotH, 64.0);

          vec3 finalColor = baseColor * (0.35 + fresnelGlow * 1.2) + vec3(specular) * colGold + fresnelGlow * col2 * 0.8;

          // Interior volumetric alpha glow
          float alpha = clamp(0.4 + fresnelGlow * 0.6, 0.0, 0.95);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Torus Knot Sculpture Geometry
    const knotGeo = new THREE.TorusKnotGeometry(1.7, 0.45, 180, 48, 2, 3);
    const knotMesh = new THREE.Mesh(knotGeo, customMaterial);
    scene.add(knotMesh);

    // 3. Orbiting Energy Gyro Ring
    const ringGeo = new THREE.TorusGeometry(3.0, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ringMesh);

    // 4. Interactive Physics & Magnetic Cursor Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      customMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // 5. 60 FPS Kinetic Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      customMaterial.uniforms.uTime.value = elapsed;
      customMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Kinetic sculpture rotation
      knotMesh.rotation.x = elapsed * 0.3 + mouse.y * 0.8;
      knotMesh.rotation.y = elapsed * 0.4 + mouse.x * 0.8;
      knotMesh.rotation.z = Math.sin(elapsed * 0.2) * 0.3;

      ringMesh.rotation.x = Math.PI / 3 + elapsed * 0.2 + mouse.y * 0.3;
      ringMesh.rotation.y = -elapsed * 0.5 + mouse.x * 0.3;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      knotGeo.dispose();
      customMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    />
  );
}
