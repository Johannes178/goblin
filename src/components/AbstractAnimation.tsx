import React, { useMemo, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AbstractAnimation: React.FC = () => {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const smoothVelocity = useRef(0);
  const accumulatedScroll = useRef(0); // Track total scroll
  const lastY = useRef(0);
  const isScrolling = useRef(false);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2() },
      u_scroll: { value: 0 },
      u_accumulated: { value: 0 }, // New uniform for accumulated scroll
    }),
    []
  );

  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setScrollVelocity(e.deltaY * 0.0015);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isScrolling.current = true;
      lastY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling.current) return;

      const deltaY = lastY.current - e.touches[0].clientY;
      lastY.current = e.touches[0].clientY;
      setScrollVelocity(deltaY * 0.01);
    };

    const handleTouchEnd = () => {
      isScrolling.current = false;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useFrame((state) => {
    const { clock, size } = state;
    uniforms.u_time.value = clock.elapsedTime;
    uniforms.u_resolution.value.set(size.width, size.height);

    // Smooth velocity and accumulate scroll
    smoothVelocity.current += (scrollVelocity - smoothVelocity.current) * 0.1;
    accumulatedScroll.current += smoothVelocity.current;

    uniforms.u_scroll.value = smoothVelocity.current;
    uniforms.u_accumulated.value = accumulatedScroll.current;
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
  uniform float u_scroll;
  uniform float u_accumulated;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                           dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float flowingRiver(vec2 st, float time, float flow) {
  // Even smaller scales for larger patterns
  float scale1 = 0.6;  // Reduced from 1.2 for bigger patterns
  float scale2 = 1.0;  // Reduced from 2.0
  
  // Slower flow based on accumulated scroll
  float flowOffset = u_accumulated * 0.05;
  
  // Stretch the patterns horizontally
  vec2 stretchedCoord = vec2(st.x * 0.5, st.y * 1.5); // Horizontal stretch
  
  // Main broad flow pattern - more elongated
  float pattern1 = snoise(vec2(
    stretchedCoord.x * scale1 + time * 0.1 + flowOffset,
    stretchedCoord.y * scale1 + time * 0.05  // Less vertical variation
  ));
  
  // Subtle secondary pattern for texture - also elongated
  float pattern2 = snoise(vec2(
    stretchedCoord.x * scale2 - time * 0.15 - flowOffset,
    stretchedCoord.y * scale2 * 0.8 + flowOffset * 0.5  // Reduced vertical variation
  )) * 0.3;
  
  // Smoother blend between patterns
  return mix(pattern1, pattern2, 0.3 + flow * 0.2);
}

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect;
    
    // Slower time scale for gentler movement
    float slowTime = u_time * 0.1;  // Reduced from 0.2
    
    // Get flow pattern
    float flow = flowingRiver(st, slowTime, abs(u_scroll));
    
    // Gentler scroll influence
    float scrollEffect = smoothstep(0.0, 0.3, abs(u_scroll)) * 0.5;  // Added * 0.5
    
    // Neutral river colors
  
// More blue-tinted river colors
vec3 deepColor = vec3(0.7, 0.78, 0.88);    // Deeper blue
vec3 shallowColor = vec3(0.75, 0.83, 0.93); // Medium blue
vec3 surfaceColor = vec3(0.8, 0.88, 0.96);  // Light blue

// Rest of the code stays the same
float colorMix = flow * 0.4 + 0.5;
vec3 baseColor = mix(deepColor, shallowColor, colorMix);
vec3 finalColor = mix(baseColor, surfaceColor, 
    smoothstep(0.3, 0.7, flow + scrollEffect * 0.2));
    
    gl_FragColor = vec4(finalColor, 1.0);
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
