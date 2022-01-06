import "./style.css";
import React, { useRef } from "react";
import { GlitterMaterial } from "./glitterMaterial";
import { Suzanne } from "./Models/Suzanne";

const customUniforms = {
  uGlitterSize: { value: 350.0 },
  uGlitterDensity: { value: 0.1 },
};

const debugObject = {
  glitterColor: "#0707f2",
};

const objectsDistance = 2;

export function ExampleModels({ ...props }) {
  const group = useRef<THREE.Group>();

  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: debugObject.glitterColor,
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh position={[-10, 0, 0]} material={glitterMaterial}>
        <torusKnotGeometry args={[0.8, 0.35, 100, 16]} />
      </mesh>
      <Suzanne position={[0, 0, 0]} />
      <mesh position={[10, 0, 0]} material={glitterMaterial}>
        <boxGeometry args={[2, 2, 2, 2]} />
      </mesh>
    </group>
  );
}
