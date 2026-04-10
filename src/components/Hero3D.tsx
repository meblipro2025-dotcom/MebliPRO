"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";

if (typeof window !== "undefined") {
  const _warn = console.warn.bind(console);
  console.warn = (...args: Parameters<typeof console.warn>) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    _warn(...args);
  };
}

export default function Hero3D() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-40 pointer-events-none z-0">
      <div className="w-full h-full min-h-[50vh] md:min-h-full aspect-[4/5] md:aspect-auto">
        <Canvas className="!h-full !w-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[1, 100, 200]} scale={2.4}>
            <MeshDistortMaterial
              color="#CC9900"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0}
              metalness={1}
            />
          </Sphere>
        </Float>
        </Canvas>
      </div>
    </div>
  );
}
