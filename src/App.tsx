import "./style.css";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect } from "react";
import { GlitterText } from "./GlitterText";
import { MouseLight } from "./MouseLight";
import { ExampleModels } from "./ExampleModels";
import { ConfigModel } from "./ConfigModel";
import { ScrollControls, Scroll } from "@react-three/drei";

export default function App() {
  const objectsDistance = 25;

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
      <ScrollControls
        pages={3}
        distance={1}
        damping={3}
        horizontal={false}
        infinite={false}
      >
        <Suspense fallback={null}>
          <Scroll>
            <GlitterText position={[-6, 0, 0]} children="glitter" />
          </Scroll>
          <Scroll>
            <ExampleModels
              position={[0, -objectsDistance * 1, 0]}
              scale={[2.0, 2.0, 2.0]}
            />
          </Scroll>
          <Scroll>
            <ConfigModel position={[-5, -objectsDistance * 2, 0]} />
          </Scroll>
        </Suspense>
      </ScrollControls>
    </Canvas>
  );
}
