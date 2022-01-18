import { extend, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { GlitterMaterial } from "three-glitter-material";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import "./style.css";

extend({ TextGeometry });

export function GlitterText({ children, ...props }) {
  const textMesh = useRef<THREE.Mesh>();

  const customUniforms = {
    uGlitterSize: { value: 100.0 },
    uGlitterDensity: { value: 1.0 },
  };

  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: "#a007f2",
  });

  const font = useLoader(
    FontLoader,
    "./fonts/pacifico/pacifico-regular-normal-400.json"
  );

  const config = useMemo(
    () => ({
      font,
      size: 3.5,
      height: 0.2,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 10,
    }),
    [font]
  );
  const textGeometry = new TextGeometry("glitter", config);

  useEffect(() => {
    textGeometry.computeBoundingBox();
    textGeometry.center();
  });

  return (
    <mesh
      ref={textMesh}
      position={[0, 9.5, 0]}
      {...props}
      material={glitterMaterial}
      geometry={textGeometry}
    ></mesh>
  );
}
