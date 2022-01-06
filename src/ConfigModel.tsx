import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useMemo, useRef } from "react";
import { GlitterMaterial } from "./glitterMaterial";
import "./style.css";

export function ConfigModel({ ...props }) {
  const sphere = useRef<THREE.Mesh>();

  const levaControls = useControls({
    uGlitterSize: { value: 350.0 },
    uGlitterDensity: { value: 0.1 },
    color: { value: "#0707f2" },
  });

  const customUniforms = {};
  for (const prop in levaControls) {
    customUniforms[prop] = { value: levaControls[prop] };
  }

  const glitterMaterial = useMemo(() => {
    return new GlitterMaterial(customUniforms, { color: levaControls.color });
  }, [levaControls]);

  useFrame(() => {
    sphere.current.rotation.x += 0.001;
    sphere.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={sphere} {...props} material={glitterMaterial}>
      <sphereGeometry args={[5, 32, 32]} />
    </mesh>
  );
}
