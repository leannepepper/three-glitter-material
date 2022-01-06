import "./style.css";
import React, { useEffect } from "react";
import { GlitterMaterial } from "./glitterMaterial";
import * as dat from "dat.gui";

const gui = new dat.GUI();

const customUniforms = {
  uGlitterSize: { value: 350.0 },
  uGlitterDensity: { value: 0.1 },
};

const debugObject = {
  glitterColor: "#0707f2",
};

export function ConfigModel({ ...props }) {
  const glitterMaterial = new GlitterMaterial(customUniforms, {
    color: debugObject.glitterColor,
  });

  useEffect(() => {
    gui.addColor(debugObject, "glitterColor").onChange(() => {
      glitterMaterial.color.set(debugObject.glitterColor);
    });
    gui
      .add(customUniforms.uGlitterSize, "value")
      .min(50.0)
      .max(500.0)
      .step(10.0)
      .name("glitterSize");
    gui
      .add(customUniforms.uGlitterDensity, "value")
      .min(0.0)
      .max(1.0)
      .step(0.001)
      .name("glitterDensity");
  });

  return (
    <mesh {...props} material={glitterMaterial}>
      <sphereGeometry args={[5, 32, 16]} />
    </mesh>
  );
}
