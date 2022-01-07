import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useMemo, useRef } from "react";
import { GlitterMaterial } from "./glitterMaterial";
import "./style.css";

export function ConfigModel({ ...props }) {
  const sphere = useRef<THREE.Mesh>();

  const levaControls = useControls({
    uGlitterSize: { value: 30.0 },
    uGlitterDensity: { value: 1.0 },
    color: { value: "#a007f2" },
    animate: { value: true },
  });

  const customUniforms = {};
  for (const prop in levaControls) {
    customUniforms[prop] = { value: levaControls[prop] };
  }

  const glitterMaterial = useMemo(() => {
    return new GlitterMaterial(customUniforms, { color: levaControls.color });
  }, [levaControls]);

  useFrame(() => {
    if (levaControls.animate) {
      sphere.current.rotation.x += 0.001;
      sphere.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={sphere} {...props} material={glitterMaterial}>
      <sphereGeometry args={[3, 32, 32]} />
    </mesh>
  );
}
