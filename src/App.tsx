import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AbstractAnimation from "./components/AbstractAnimation";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>JokiDev</h1>
      </header>
      <main>
        <Canvas>
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <AbstractAnimation />
        </Canvas>
      </main>
    </div>
  );
}

export default App;
