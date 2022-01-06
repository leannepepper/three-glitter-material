import React from "react";
import { GlitterMaterial } from "./glitterMaterial";
import { FryingPan } from "./Models/FryingPan";
import "./style.css";

const customUniforms = {
  uGlitterSize: { value: 350.0 },
  uGlitterDensity: { value: 0.1 },
};

const debugObject = {
  glitterColor: "#f20707",
};

const objectsDistance = 2;

export function ExampleModels() {
  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: debugObject.glitterColor,
  });

  return (
    <>
      <mesh position={[-10, -5, 0]} material={glitterMaterial}>
        <torusKnotGeometry args={[0.8, 0.35, 100, 16]} />
      </mesh>
      <mesh position={[0, -5, 0]} material={glitterMaterial}>
        <torusKnotGeometry args={[0.8, 0.35, 100, 16]} />
      </mesh>
      <FryingPan
        position={[10, -5, 0]}
        rotation={[0.3, 3.0, 0.0]}
        scale={[1.5, 1.5, 1.5]}
      />
    </>
  );
}
