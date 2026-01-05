// components/user-dashboard/InteractiveHeader.jsx
import React, { useState, useEffect } from 'react';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

const InteractiveHeader = ({ user }) => {
  const [isWebGLLoaded, setIsWebGLLoaded] = useState(false);
  const [Three, setThree] = useState(null);

  useEffect(() => {
    const loadWebGL = async () => {
      try {
        const three = await import('@react-three/fiber');
        const drei = await import('@react-three/drei');
        setThree({ Canvas: three.Canvas, ...drei });
        setIsWebGLLoaded(true);
      } catch (error) {
        console.warn('WebGL not available, using fallback UI');
      }
    };
    
    loadWebGL();
  }, []);

  const FallbackHeader = () => (
    <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-10 shadow-[0_20px_50px_rgba(237,27,47,0.2)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#ED1B2F] to-[#455185] opacity-90" />
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-3xl z-10" />
      <div className="relative z-20 h-full flex items-center justify-between px-10">
        <div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Support Hub</h1>
          <div className="h-1 w-20 bg-white mt-2 rounded-full" />
          <p className="text-white/80 mt-4 text-lg">Welcome back, {user?.name}</p>
        </div>
        <RocketLaunchIcon className="w-20 h-20 text-white/30" />
      </div>
    </div>
  );

  if (!isWebGLLoaded || !Three) {
    return <FallbackHeader />;
  }

  const { Canvas, Float, Sphere, MeshDistortMaterial, OrbitControls } = Three;

  return (
    <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-10 shadow-[0_20px_50px_rgba(237,27,47,0.2)]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-3xl z-10 pointer-events-none" />
      <div className="absolute top-10 left-10 z-20">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Support Hub</h1>
        <div className="h-1 w-20 bg-[#ED1B2F] mt-2 rounded-full" />
        <p className="text-white/80 mt-2">Welcome, {user?.name}</p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Float speed={2} rotationIntensity={2}>
          <Sphere args={[1.4, 64, 64]} position={[-3, 0, 0]}>
            <MeshDistortMaterial color="#ED1B2F" speed={3} distort={0.5} metalness={0.9} />
          </Sphere>
        </Float>
        <Float speed={3} rotationIntensity={1}>
          <Sphere args={[1, 64, 64]} position={[3, -1, 0]}>
            <MeshDistortMaterial color="#455185" speed={4} distort={0.6} metalness={0.8} />
          </Sphere>
        </Float>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default InteractiveHeader;