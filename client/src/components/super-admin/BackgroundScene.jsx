// components/super-admin/BackgroundScene.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { THEME } from '../../constants/theme';

const AnimatedSphere = ({ color, position, scale = 1 }) => (
  <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
    <Sphere args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial 
        color={color} 
        roughness={0.1} 
        metalness={0.8} 
        distort={0.5} 
        speed={1.5} 
      />
    </Sphere>
  </Float>
);

const BackgroundScene = () => (
  <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <AnimatedSphere color={THEME.primary} position={[-4, -2, -5]} scale={1.5} />
      <AnimatedSphere color={THEME.secondary} position={[4, 2, -5]} scale={2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  </div>
);

export default BackgroundScene;