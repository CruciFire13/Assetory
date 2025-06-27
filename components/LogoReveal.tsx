"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

export default function LogoReveal() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <GlowingParticles count={500} />
      </Canvas>
    </div>
  );
}

function GlowingParticles({ count = 500 }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef([0, 0]);

  const { size, camera } = useThree();

  // Mouse movement tracking
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / size.width) * 2 - 1;
      const y = -(e.clientY / size.height) * 2 + 1;
      mouse.current = [x, y];
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [size]);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const colorStart = new THREE.Color("#ffcccc");
    const colorEnd = new THREE.Color("#220000");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position
      pos[i3] = (Math.random() - 0.5) * 12;
      pos[i3 + 1] = (Math.random() - 0.5) * 7;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;

      // Color interpolation
      const t = Math.random();
      const color = colorStart.clone().lerp(colorEnd, t);
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;

      sz[i] = 0.01;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  const sizeAttribute = useRef<THREE.BufferAttribute | null>(null);

  useFrame(() => {
    if (!ref.current || !sizeAttribute.current) return;

    const mouseVector = new THREE.Vector3(
      mouse.current[0],
      mouse.current[1],
      0.5
    );
    mouseVector.unproject(camera);

    const positionsAttr = ref.current.geometry.getAttribute("position");
    const sizes = sizeAttribute.current;

    for (let i = 0; i < count; i++) {
      const dx = positionsAttr.getX(i) - mouseVector.x;
      const dy = positionsAttr.getY(i) - mouseVector.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const size = dist < 0.5 ? 0.04 - dist * 0.05 : 0.008;
      sizes.setX(i, size);
    }

    sizes.needsUpdate = true;

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
