import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface GlassProps {
  transmission?: number;
  roughness?: number;
  ior?: number;
  chromaticAberration?: number;
  thickness?: number;
  anisotropy?: number;
}

interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: GlassProps;
  barProps?: GlassProps;
  cubeProps?: GlassProps;
}

export function FluidGlass({ mode = 'lens', ...rawOverrides }: FluidGlassProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const activeProps = useMemo(() => {
    switch (mode) {
      case 'bar':
        return rawOverrides.barProps || {};
      case 'cube':
        return rawOverrides.cubeProps || {};
      case 'lens':
      default:
        return rawOverrides.lensProps || {};
    }
  }, [mode, rawOverrides]);

  const {
    transmission = 1,
    roughness = 0,
    ior = 1.2,
    chromaticAberration = 0.05,
    thickness = 0.5,
    anisotropy = 0.1,
  } = activeProps;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  const Geometry = () => {
    switch (mode) {
      case 'bar':
        return <boxGeometry args={[4, 0.5, 0.5]} />;
      case 'cube':
        return <boxGeometry args={[2, 2, 2]} />;
      case 'lens':
      default:
        return <torusGeometry args={[2, 0.6, 32, 100]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <Geometry />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={transmission}
          roughness={roughness}
          ior={ior}
          thickness={thickness}
          chromaticAberration={chromaticAberration}
          anisotropy={anisotropy}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#FFFF00"
        />
      </mesh>
    </Float>
  );
}
