import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { GlitterText } from "./GlitterText";
import { MouseLight } from "./MouseLight";
import { OrbitControls } from "@react-three/drei";
import { ExampleModels } from "./ExampleModels";
import "./style.css";

export default function App() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 60],
        fov: 27,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 3500,
      }}
    >
      <ambientLight intensity={3.6} color={0x444444} />
      <MouseLight />
      <OrbitControls enableZoom={true} enablePan={false} />
      <Suspense fallback={null}>
        <GlitterText position={[-5, 0, 0]} children="glitter" />
        <ExampleModels />
      </Suspense>
    </Canvas>
  );
}
