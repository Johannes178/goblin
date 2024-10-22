import React from "react";
import { Canvas } from "@react-three/fiber";
import AbstractAnimation from "./components/AbstractAnimation";
import OverlayContent from "./components/OverlayContent";

function App() {
  return (
    <main className="w-screen h-screen overflow-hidden m-0 p-0">
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          background: "black", // Optional: adds a background color
        }}>
        <AbstractAnimation />
      </Canvas>
      <OverlayContent />
    </main>
  );
}

export default App;
