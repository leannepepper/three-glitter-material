import "./style.css";
import { extend, useLoader } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GlitterMaterial } from "./glitterMaterial";

extend({ TextGeometry });

const customUniforms = {
  uGlitterSize: { value: 350.0 },
  uGlitterDensity: { value: 0.1 },
};

const debugObject = {
  glitterColor: "#f20707",
};

export function GlitterText({
  children,
  color = debugObject.glitterColor,
  ...props
}) {
  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: debugObject.glitterColor,
  });

  const font = useLoader(
    FontLoader,
    "/fonts/pacifico/pacifico-regular-normal-400.json"
  );

  const config = useMemo(
    () => ({
      font,
      size: 3.5,
      height: 0.2,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 1.2,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 10,
    }),
    [font]
  );

  return (
    <mesh {...props} material={glitterMaterial}>
      <textGeometry args={[children, config]} />
    </mesh>
  );
}
