import { extend, useLoader } from "@react-three/fiber";
import React, { useMemo } from "react";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GlitterMaterial } from "./glitterMaterial";
import "./style.css";

extend({ TextGeometry });

const customUniforms = {
  uGlitterSize: { value: 350.0 },
  uGlitterDensity: { value: 0.1 },
};

export function GlitterText({
  children,
  size = 5.5,
  color = "#dc630f",
  ...props
}) {
  const font = useLoader(
    FontLoader,
    "/fonts/pacifico/pacifico-regular-normal-400.json"
  );

  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: "#dc630f",
  });

  const config = useMemo(
    () => ({
      font,
      size: 5.5,
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
  //   const mesh = useRef(null);

  return (
    <mesh material={glitterMaterial}>
      <textGeometry args={[children, config]} />
    </mesh>
  );
}
