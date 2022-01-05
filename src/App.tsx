import "./style.css";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Component, Suspense, useEffect } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { OrbitControls } from "@react-three/drei";
import { GlitterMaterial } from "./glitterMaterial";
import { GlitterText } from "./GlitterText";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 60] }}>
      <ambientLight intensity={2.6} color={0x444444} />
      {/* <directionalLight intensity={10} position={[1.5, 0, 1]} /> */}
      <OrbitControls enableZoom={true} enablePan={false} />
      <Suspense fallback={null}>
        <GlitterText position={[0, -10, 0]} children="glitter" />
      </Suspense>
    </Canvas>
  );
}
