import "./style.css";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef } from "react";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GlitterMaterial } from "./glitterMaterial";
import { useScroll } from "@react-three/drei";

extend({ TextGeometry });

export function GlitterText({ children, ...props }) {
  const textMesh = useRef<THREE.Mesh>();
  const { mouse, camera } = useThree();

  const levaControls = useControls({
    uGlitterSize: { value: 30.0 },
    uGlitterDensity: { value: 1.0 },
    color: { value: "#a007f2" },
    // parallax: { value: true },
  });

  const customUniforms = {};
  for (const prop in levaControls) {
    customUniforms[prop] = { value: levaControls[prop] };
  }

  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: levaControls.color,
  });

  useFrame((state, delta) => {
    // if (levaControls.parallax) {
    //   const parallaxX = mouse.x;
    //   const parallaxY = -mouse.y;
    //   camera.position.x += (parallaxX - camera.position.x) * 5 * delta;
    //   camera.position.y += (parallaxY - camera.position.y) * 5 * delta;
    // }
  });

  const font = useLoader(
    FontLoader,
    "/fonts/pacifico/pacifico-regular-normal-400.json"
  );

  const config = useMemo(
    () => ({
      font,
      size: 4.5,
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
    <mesh ref={textMesh} {...props} material={glitterMaterial}>
      <textGeometry args={[children, config]} />
    </mesh>
  );
}
