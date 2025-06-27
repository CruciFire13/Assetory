"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function LogoReveal() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <WaveParticles count={500} />
      </Canvas>
    </div>
  );
}

function WaveParticles({ count = 500 }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const sizeAttribute = useRef<THREE.BufferAttribute | null>(null);
  const basePositions = useRef<Float32Array | null>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const colorStart = new THREE.Color("#ffcccc");
    const colorEnd = new THREE.Color("#1a1a1a");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      pos[i3 + 0] = (Math.random() - 0.5) * 12;
      pos[i3 + 1] = (Math.random() - 0.5) * 7;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;

      const t = Math.random();
      const color = colorStart.clone().lerp(colorEnd, t);
      col[i3 + 0] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;

      sz[i] = 0.008;
    }

    basePositions.current = pos.slice();
    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || !basePositions.current) return;

    const geometry = ref.current.geometry;
    const time = clock.getElapsedTime();
    const position = geometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const x = basePositions.current[i3 + 0];
      const z = basePositions.current[i3 + 2];
      const wave = Math.sin(time * 1.5 + x + z * 0.5) * 0.2;

      position.setY(i, basePositions.current[i3 + 1] + wave);
    }

    position.needsUpdate = true;
    ref.current.rotation.y += 0.001;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <primitive
          attach="attributes-position"
          object={new THREE.BufferAttribute(positions, 3)}
        />
        <primitive
          attach="attributes-color"
          object={new THREE.BufferAttribute(colors, 3)}
        />
        <primitive
          ref={sizeAttribute}
          attach="attributes-size"
          object={new THREE.BufferAttribute(sizes, 1)}
        />
      </bufferGeometry>

      <pointsMaterial
        vertexColors
        size={0.01}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
