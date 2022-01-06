import "./style.css";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Component, Suspense, useEffect, useRef } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { OrbitControls } from "@react-three/drei";
import { GlitterMaterial } from "./glitterMaterial";
import { GlitterText } from "./GlitterText";
import { MouseLight } from "./MouseLight";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 30] }}>
      <ambientLight intensity={2.6} color={0x444444} />
      <MouseLight />
      <OrbitControls enableZoom={true} enablePan={false} />
      <Suspense fallback={null}>
        <GlitterText position={[-10, 0, 0]} children="glitter" />
      </Suspense>
    </Canvas>
  );
}
