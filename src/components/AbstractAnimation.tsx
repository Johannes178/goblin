import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

const AbstractAnimation: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial color="white" wireframe />
    </mesh>
  );
};

export default AbstractAnimation;
