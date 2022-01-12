import "./style.css";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef } from "react";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GlitterMaterial } from "./glitterMaterial";

extend({ TextGeometry });

export function GlitterText({ children, ...props }) {
  const textMesh = useRef<THREE.Mesh>();
  const { mouse, camera, viewport } = useThree();

  const customUniforms = {
    uGlitterSize: { value: 30.0 },
    uGlitterDensity: { value: 1.0 },
    color: { value: "#a007f2" },
  };

  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: customUniforms.color.value,
  });

  //   useFrame((state, delta) => {
  //     const parallaxX = mouse.x;
  //     const parallaxY = -mouse.y;
  //     camera.position.x += (parallaxX - camera.position.x) * 5 * delta;
  //     camera.position.y += (parallaxY - camera.position.y) * 5 * delta;
  //   });

  const font = useLoader(
    FontLoader,
    "../fonts/pacifico/pacifico-regular-normal-400.json"
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
      position={[0, 8, 0]}
      {...props}
      material={glitterMaterial}
      geometry={textGeometry}
    ></mesh>
  );
}
