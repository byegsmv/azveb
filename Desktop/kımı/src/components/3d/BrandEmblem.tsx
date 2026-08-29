"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

interface BrandEmblemProps {
  scale?: number;
}

export default function BrandEmblem({ scale = 1.0 }: BrandEmblemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const emblemMeshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const secondaryRingRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Parametric "A" Monogram Geometry with Beveled Extrusion
  const extrudedGeometry = useMemo(() => {
    const shape = new THREE.Shape();

    // Outer contour of the stylized 'A' monogram
    shape.moveTo(-0.85, -0.95);
    shape.lineTo(-0.4, -0.95);
    shape.lineTo(-0.18, -0.3);
    shape.lineTo(0.18, -0.3);
    shape.lineTo(0.4, -0.95);
    shape.lineTo(0.85, -0.95);
    shape.lineTo(0.24, 1.05);
    shape.lineTo(-0.24, 1.05);
    shape.closePath();

    // Inner triangular counter / cutout
    const hole = new THREE.Path();
    hole.moveTo(-0.16, -0.05);
    hole.lineTo(0.16, -0.05);
    hole.lineTo(0.0, 0.62);
    hole.closePath();
    shape.holes.push(hole);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.045,
      bevelThickness: 0.055,
      curveSegments: 32,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center(); // Center rotation pivot precisely at the geometric centroid
    return geometry;
  }, []);

  // Frame-by-frame smooth animations & pointer parallax
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth continuous yaw
      groupRef.current.rotation.y += delta * 0.35;

      // Mouse pointer parallax lerping with fallback to state.pointer
      const px = mouseRef.current.x || state.pointer.x;
      const py = mouseRef.current.y || state.pointer.y;

      const targetParallaxX = (px * Math.PI) / 12;
      const targetParallaxY = (py * Math.PI) / 12;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetParallaxY,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -targetParallaxX * 0.4,
        0.05
      );
    }

    // Outer refractive ring gyroscopic spin
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.28;
      ringRef.current.rotation.y += delta * 0.38;
    }

    // Secondary orbital ring spin
    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.x -= delta * 0.22;
      secondaryRingRef.current.rotation.z += delta * 0.32;
    }

    // Glowing core faceted counter-rotation & pulse
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.75;
      coreRef.current.rotation.x += delta * 0.45;
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float
      speed={2.2}
      rotationIntensity={0.5}
      floatIntensity={0.8}
      floatingRange={[-0.12, 0.12]}
    >
      <group ref={groupRef} scale={scale}>
        {/* 1. Extruded Glassmorphism "A" Monogram */}
        <mesh
          ref={emblemMeshRef}
          geometry={extrudedGeometry}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            transmission={0.95}
            roughness={0.12}
            ior={1.52}
            thickness={1.6}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            attenuationColor="#ff6b35"
            attenuationDistance={1.4}
            color="#ffffff"
            specularIntensity={1.0}
            specularColor="#ffffff"
            transparent={true}
            opacity={1.0}
            metalness={0.05}
          />
        </mesh>

        {/* 2. Central Glowing Ember Core */}
        <group position={[0, 0.08, 0]}>
          <mesh ref={coreRef}>
            <octahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial
              color="#ff5a1f"
              emissive="#ff4500"
              emissiveIntensity={3.2}
              roughness={0.18}
              metalness={0.85}
            />
          </mesh>
          {/* Radial Ember Light Burst */}
          <pointLight
            color="#ff5a1f"
            intensity={2.8}
            distance={3.5}
            decay={2}
          />
        </group>

        {/* 3. Primary Refractive Glass Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 3.5, Math.PI / 5, 0]}>
          <torusGeometry args={[1.65, 0.026, 32, 100]} />
          <meshPhysicalMaterial
            transmission={0.95}
            roughness={0.12}
            ior={1.52}
            thickness={1.6}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            attenuationColor="#ff6b35"
            attenuationDistance={1.2}
            color="#ffffff"
            transparent={true}
            opacity={0.95}
            metalness={0.08}
          />
        </mesh>

        {/* 4. Secondary Counter-Orbital Accent Ring */}
        <mesh
          ref={secondaryRingRef}
          rotation={[-Math.PI / 4, -Math.PI / 3, Math.PI / 6]}
        >
          <torusGeometry args={[1.88, 0.016, 24, 80]} />
          <meshStandardMaterial
            color="#ff7a45"
            emissive="#ff5a1f"
            emissiveIntensity={1.8}
            roughness={0.25}
            metalness={0.7}
            transparent={true}
            opacity={0.85}
          />
        </mesh>
      </group>
    </Float>
  );
}
