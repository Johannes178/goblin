import React, { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AbstractAnimation: React.FC = () => {
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2() },
    }),
    []
  );

  useFrame((state) => {
    const { clock, mouse, size } = state;
    uniforms.u_time.value = clock.elapsedTime;
    uniforms.u_mouse.value.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);
    uniforms.u_resolution.value.set(size.width, size.height);
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
   uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  
  // Correct aspect ratio
  float aspect = u_resolution.x / u_resolution.y;
  st.x *= aspect;

  // Reduce scale for larger patterns
  vec2 pos = st * 0.5; 

  float DF = 0.0;

  // Use only one layer of noise for simpler, larger shapes
  vec2 vel = vec2(u_time * 0.02, u_time * 0.01);
  DF = snoise(pos + vel);

  // Softer mouse interaction
  vec2 mousePos = u_mouse * vec2(aspect, 1.0);
  float mouseEffect = snoise((pos - mousePos) * 0.05) * 0.2;
  DF += mouseEffect;

  // Subtle pulsing
  float pulse = sin(u_time * 0.1) * 0.05 + 0.95;
  DF *= pulse;

  // Increase contrast for more defined shapes
  DF = smoothstep(0.2, 0.8, DF);

  // Create grayscale color
  vec3 color = vec3(DF);

  // Adjust contrast
  color = pow(color, vec3(1.2));

  gl_FragColor = vec4(color, 1.0);
}
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default AbstractAnimation;
