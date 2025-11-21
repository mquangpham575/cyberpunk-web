import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Grid, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ... (Giữ nguyên Component DigitalRain và ScannerLight)
const DigitalRain = () => (
  <group>
    <Sparkles
      count={200}
      scale={[20, 20, 10]}
      size={2}
      speed={1}
      opacity={0.4}
      color="#00f0ff"
      noise={0.5}
    />
    <Sparkles
      count={50}
      scale={[10, 15, 10]}
      size={5}
      speed={2}
      opacity={0.5}
      color="#ff003c"
      noise={0.2}
    />
  </group>
);

const ScannerLight = () => {
  const lightRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.5) * 15;
      lightRef.current.position.z = Math.cos(time * 0.3) * 5 - 10;
      lightRef.current.color.setHSL((time * 0.1) % 1, 0.8, 0.5);
    }
  });
  return <pointLight ref={lightRef} intensity={2} distance={30} decay={2} />;
};

// 3. CẬP NHẬT: DATA PRISM (Di chuyển vị trí)
const DataPrism = ({ scrollY }) => {
  const meshRef = useRef();
  const outerRef = useRef();
  const [hovered, setHover] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Logic kiểm tra màn hình để đặt vị trí
  const isMobile = window.innerWidth < 768;
  // PC: Dịch sang phải 2.5 (để tránh chữ bên trái)
  // Mobile: Dịch lên trên 1.5 (để nằm trên chữ) hoặc giữ nguyên 0
  const position = isMobile ? [0, 1.5, 0] : [2.5, 0, 0];

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

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
      position={position} // <--- ÁP DỤNG VỊ TRÍ MỚI TẠI ĐÂY
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef} scale={hovered ? 1.1 : 1}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#00f0ff"
            emissiveIntensity={0.3}
            roughness={0}
            metalness={0.9}
            reflectivity={1}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={outerRef} scale={[1.4, 1.4, 1.4]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ff003c"
            emissive="#ff003c"
            emissiveIntensity={0.5}
            wireframe={true}
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[2, 2, 2]}>
          <ringGeometry args={[0.98, 1, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </group>
  );
};

const OptimizedScene = ({ scrollY }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-cyber-black">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#050505", 5, 25]} />
        <ambientLight intensity={0.3} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          color="#00f0ff"
        />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ff003c" />

        <DigitalRain />
        <ScannerLight />
        <DataPrism scrollY={scrollY} />

        <Grid
          position={[0, -3, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#00f0ff"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#ff003c"
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
