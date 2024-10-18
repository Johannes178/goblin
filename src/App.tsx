import React from "react";
import { Canvas } from "@react-three/fiber";
import AbstractAnimation from "./components/AbstractAnimation";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <AbstractAnimation />
      </Canvas>
    </div>
  );
}

export default App;
