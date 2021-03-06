import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { ConfigModel } from "./ConfigModel";
import { GlitterText } from "./GlitterText";
import { MouseLight } from "./MouseLight";
import "./style.css";

export default function App() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 60],
        fov: 27,
        aspect: window.innerWidth / 2 / (window.innerHeight / 2),
        near: 1,
        far: 800,
      }}
    >
      <ambientLight intensity={2.5} color={0x444444} />
      <MouseLight />
      <Suspense fallback={null}>
        <GlitterText rotation={[0.15, 0, 0]} children="glitter" />
        <ConfigModel position={[-4, -8.5, 0]} />
      </Suspense>
    </Canvas>
  );
}
