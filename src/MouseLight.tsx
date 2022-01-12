import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import "./style.css";

export function MouseLight() {
  const pointLight = useRef(null);
  const { mouse, size, camera } = useThree();

  useEffect(() => {
    function handleMouseMove(event) {
      mouse.x = (event.clientX / size.width) * 2 - 1;
      mouse.y = -(event.clientY / size.height) * 2 + 1;

      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      if (pointLight.current) {
        pointLight.current.position.set(pos.x, pos.y, 10.0);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <pointLight
      ref={pointLight}
      position={[0, 0, 10]}
      color={0xffffff}
      intensity={0.2}
    />
  );
}
