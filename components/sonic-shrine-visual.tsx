"use client"

import * as THREE from "three"
import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sparkles, Points, PointMaterial } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { useSacred } from "@/components/providers/sacred-provider"

function Crystal() {
  const ref = useRef<THREE.Mesh>(null!)
  const { resonanceLevel } = useSacred()

  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.1
    ref.current.rotation.y += delta * 0.2
    // Pulse the crystal based on resonance
    const scale = 1 + Math.sin(state.clock.elapsedTime + resonanceLevel * 0.1) * 0.05
    ref.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2, 1]} />
      <meshPhysicalMaterial
        roughness={0.1}
        transmission={1}
        thickness={1.5}
        color="#14b8a6" // Use our primary teal
        emissive="#0f766e"
        emissiveIntensity={2}
      />
    </mesh>
  )
}

function ParticleSystem() {
  const ref = useRef<any>()
  const { resonanceLevel } = useSacred()

  const count = 5000
  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    return [positions]
  }, [count])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02
      // Make particles react to resonance
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, (resonanceLevel / 100 - 0.5) * 0.5, 0.1)
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#2dd4bf" // Use our accent teal
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export function SonicShrineVisual() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#5eead4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

        <Crystal />
        <ParticleSystem />
        <Sparkles count={100} scale={6} size={2} speed={0.4} color="#fbbf24" />

        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.7} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
