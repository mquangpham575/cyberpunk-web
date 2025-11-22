import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Grid, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// --- THEME CONFIG ---
const THEME = {
  cyan: "#00f0ff",
  pink: "#ff003c",
  black: "#050505",
};

/**
 * Background particle effect (Matrix/Rain style)
 */
const DigitalRain = () => (
  <group>
    <Sparkles
      count={200}
      scale={[20, 20, 10]}
      size={2}
      speed={1}
      opacity={0.4}
      color={THEME.cyan}
      noise={0.5}
    />
    <Sparkles
      count={50}
      scale={[10, 15, 10]}
      size={5}
      speed={2}
      opacity={0.5}
      color={THEME.pink}
      noise={0.2}
    />
  </group>
);

/**
 * Animated light simulating a security scanner
 */
const ScannerLight = () => {
  const lightRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
      // Figure-8 movement pattern
      lightRef.current.position.x = Math.sin(time * 0.5) * 15;
      lightRef.current.position.z = Math.cos(time * 0.3) * 5 - 10;
      lightRef.current.color.setHSL((time * 0.1) % 1, 0.8, 0.5);
    }
  });

  return <pointLight ref={lightRef} intensity={2} distance={30} decay={2} />;
};

/**
 * Interactive Prism Object
 * Uses window event listener to track mouse because the parent container
 * has 'pointer-events-none', blocking standard Canvas events.
 */
const DataPrism = () => {
  const meshRef = useRef();
  const outerRef = useRef();
  const [hovered, setHover] = useState(false);

  // Use a ref to store mouse position to avoid re-renders on every move
  const mouseRef = useRef({ x: 0, y: 0 });

  // Responsive positioning logic
  const isMobile = window.innerWidth < 768;
  const position = isMobile ? [0, 1.5, 0] : [2.5, 0, 0];

  // --- MOUSE LISTENER SETUP ---
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates: -1 to +1
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- ANIMATION LOOP ---
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { x: mouseX, y: mouseY } = mouseRef.current; // Read from Ref

    // Animate Inner Core
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        time * 0.2 + mouseX * 1.2,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouseY * 1.0,
        0.05
      );
    }

    // Animate Outer Shell (Inverse Rotation)
    if (outerRef.current) {
      outerRef.current.rotation.y = THREE.MathUtils.lerp(
        outerRef.current.rotation.y,
        -mouseX * 0.5,
        0.05
      );
      outerRef.current.rotation.x = THREE.MathUtils.lerp(
        outerRef.current.rotation.x,
        mouseY * 0.5,
        0.05
      );
    }
  });

  return (
    <group
      position={position}
      // Note: onPointer events here might not trigger if container is pointer-events-none
      // kept here just in case layout changes later.
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core Mesh */}
        <mesh ref={meshRef} scale={hovered ? 1.1 : 1}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive={THEME.cyan}
            emissiveIntensity={0.3}
            roughness={0}
            metalness={0.9}
            reflectivity={1}
            clearcoat={1}
          />
        </mesh>

        {/* Wireframe Shell */}
        <mesh ref={outerRef} scale={[1.4, 1.4, 1.4]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={THEME.pink}
            emissive={THEME.pink}
            emissiveIntensity={0.5}
            wireframe={true}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Holographic Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[2, 2, 2]}>
          <ringGeometry args={[0.98, 1, 64]} />
          <meshBasicMaterial
            color={THEME.cyan}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </group>
  );
};

/**
 * Main Scene
 */
const OptimizedScene = ({ scrollY }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-cyber-black">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={[THEME.black, 5, 25]} />

        {/* Lights */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          color={THEME.cyan}
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={2}
          color={THEME.pink}
        />

        {/* Objects */}
        <DigitalRain />
        <ScannerLight />
        <DataPrism />

        {/* Environment */}
        <Grid
          position={[0, -3, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={THEME.cyan}
          sectionSize={3}
          sectionThickness={1}
          sectionColor={THEME.pink}
          fadeDistance={15}
          fadeStrength={1.5}
          followCamera={false}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default OptimizedScene;
