import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  PerspectiveCamera,
  ContactShadows,
  Stars,
  OrbitControls,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  SMAA,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { WireframeBuilding, GroundGrid, DataParticles } from './Building3D'

/* ─── Build-up and Explode animation controller ──────────────────────────── */
function AnimatedBuilding({ theme, isExploded, autoRotate }) {
  const [progress, setProgress] = useState(0)
  const [started, setStarted] = useState(false)
  const [explodeProgress, setExplodeProgress] = useState(0)

  useEffect(() => {
    // Trigger build animation after a short delay
    const timer = setTimeout(() => setStarted(true), 600)
    return () => clearTimeout(timer)
  }, [])

  useFrame((_, delta) => {
    if (started && progress < 1) {
      setProgress(p => Math.min(p + delta * 0.28, 1))
    }

    // Interpolate explodeProgress smoothly
    const targetExplode = isExploded ? 1 : 0
    if (explodeProgress !== targetExplode) {
      const step = delta * 2.2
      setExplodeProgress(current => {
        if (current < targetExplode) {
          return Math.min(current + step, targetExplode)
        } else {
          return Math.max(current - step, targetExplode)
        }
      })
    }
  })

  return (
    <>
      <WireframeBuilding buildProgress={progress} explodeProgress={explodeProgress} autoRotate={autoRotate} theme={theme} />
      <GroundGrid theme={theme} />
      <DataParticles count={180} theme={theme} />
    </>
  )
}

/* ─── Camera Setup ───────────────────────────────────────────── */
function CameraRig() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[10.5, 4.6, 10.5]}
      fov={44}
    />
  )
}

/* ─── Scene Lights ────────────────────────────────────────────── */
function SceneLights({ theme }) {
  const isLight = theme === 'light'
  return (
    <>
      <ambientLight intensity={isLight ? 0.8 : 0.55} color={isLight ? "#ffffff" : "#e2e8f0"} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={isLight ? 1.2 : 1.1}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-5, 7, -4]} intensity={isLight ? 0.6 : 0.7} color={isLight ? "#e0e7ff" : "#93c5fd"} distance={22} />
      <pointLight position={[5, 3, 5]} intensity={isLight ? 0.5 : 0.6} color={isLight ? "#bfdbfe" : "#60a5fa"} distance={16} />
      <spotLight
        position={[3, 14, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={isLight ? 1.2 : 1.5}
        color={isLight ? "#ffffff" : "#dbeafe"}
        target-position={[0, 2.5, 0]}
      />
    </>
  )
}

/* ─── Main 3D Canvas ──────────────────────────────────────────── */
export default function BuildingCanvas({ theme = 'dark', isExploded = false, autoRotate = true }) {
  return (
    <div className="building-canvas-wrap">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: 3, // ACESFilmic
          toneMappingExposure: 1.4,
          localClippingEnabled: true,
        }}
        shadows
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <CameraRig />
        <SceneLights theme={theme} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={7}
          maxDistance={22}
          target={[0, 2.2, 0]}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableDamping={true}
          dampingFactor={0.06}
        />

        {theme === 'dark' && (
          <Stars
            radius={80}
            depth={50}
            count={1200}
            factor={2}
            saturation={0.8}
            fade
            speed={0.4}
          />
        )}

        <Suspense fallback={null}>
          <AnimatedBuilding theme={theme} isExploded={isExploded} autoRotate={autoRotate} />

          <ContactShadows
            position={[0, -1.41, 0]}
            opacity={theme === 'light' ? 0.25 : 0.45}
            scale={14}
            blur={2.2}
            far={10}
            color={theme === 'light' ? "#1e3a8a" : "#000b22"}
          />
        </Suspense>

        {/* ── Post-processing ── */}
        <EffectComposer multisampling={0}>
          <SMAA />
          <Bloom
            intensity={theme === 'light' ? 0.2 : 0.4}
            luminanceThreshold={0.65}
            luminanceSmoothing={0.5}
            mipmapBlur
            blendFunction={BlendFunction.ADD}
          />
          <Vignette
            offset={0.4}
            darkness={theme === 'light' ? 0.2 : 0.4}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
