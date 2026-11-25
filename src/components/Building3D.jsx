import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Helper Component: Outlined Clay Box ──────────────────────── */
function OutlinedBox({ position, args, color, lineColor, clipPlane, opacity = 1.0, showOutlines = true, ...props }) {
  const edgeGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(...args)
    return new THREE.EdgesGeometry(geo)
  }, [args])

  return (
    <group position={position} {...props}>
      {/* Solid Clay Shaded Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={color}
          roughness={0.92}
          metalness={0.06}
          clippingPlanes={clipPlane ? [clipPlane] : []}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      {/* CAD Outline Overlay - Only visible in Dark Mode (or if outlines enabled) */}
      {showOutlines && (
        <lineSegments geometry={edgeGeo}>
          <lineBasicMaterial
            color={lineColor}
            clippingPlanes={clipPlane ? [clipPlane] : []}
            transparent
            opacity={0.42 * opacity}
            linewidth={1}
          />
        </lineSegments>
      )}
    </group>
  )
}

/* ─── Helper Component: Scale Human Figure ──────────────────────── */
function ScaleFigure({ position, color, lineColor, clipPlane, showOutlines, isSitting }) {
  const bodyY = isSitting ? 0.04 : 0.06
  const headY = isSitting ? 0.125 : 0.145
  
  return (
    <group position={position}>
      {/* Torso */}
      <OutlinedBox
        position={[0, bodyY, 0]}
        args={[0.05, 0.12, 0.05]}
        color={color}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      {/* Head */}
      <OutlinedBox
        position={[0, headY, 0]}
        args={[0.045, 0.045, 0.045]}
        color={color}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
    </group>
  )
}

/* ─── Helper Component: Scale Vehicle ───────────────────────────── */
function ScaleCar({ position, rotation = [0, 0, 0], color, cabinColor, wheelColor, lineColor, clipPlane, showOutlines }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Chassis */}
      <OutlinedBox
        position={[0, 0.06, 0]}
        args={[0.22, 0.1, 0.44]}
        color={color}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      {/* Cabin */}
      <OutlinedBox
        position={[0, 0.145, -0.02]}
        args={[0.18, 0.07, 0.26]}
        color={cabinColor}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      {/* Wheels */}
      <OutlinedBox
        position={[-0.115, 0.035, 0.11]}
        args={[0.03, 0.07, 0.07]}
        color={wheelColor}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      <OutlinedBox
        position={[0.115, 0.035, 0.11]}
        args={[0.03, 0.07, 0.07]}
        color={wheelColor}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      <OutlinedBox
        position={[-0.115, 0.035, -0.11]}
        args={[0.03, 0.07, 0.07]}
        color={wheelColor}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      <OutlinedBox
        position={[0.115, 0.035, -0.11]}
        args={[0.03, 0.07, 0.07]}
        color={wheelColor}
        lineColor={lineColor}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
    </group>
  )
}

/* ─── Helper Component: Landscaped Park Area ────────────────────── */
function ParkArea({ colors, showOutlines, clipPlane, isLight }) {
  const lawnColor = isLight ? '#86efac' : '#022c22'
  const curbColor = colors.clayBody
  const benchColor = isLight ? '#b45309' : '#1e293b'
  const sculptureColor = isLight ? '#38bdf8' : '#00e5ff'

  return (
    <group position={[3.0, 0, 2.4]}>
      {/* Lawn Plate */}
      <OutlinedBox
        position={[0, 0.01, 0]}
        args={[2.8, 0.02, 1.6]}
        color={lawnColor}
        lineColor={colors.outlines}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      {/* Curb Boundary Retaining Walls */}
      <OutlinedBox position={[0, 0.05, -0.82]} args={[2.84, 0.08, 0.04]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
      <OutlinedBox position={[0, 0.05, 0.82]} args={[2.84, 0.08, 0.04]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
      <OutlinedBox position={[-1.42, 0.05, 0]} args={[0.04, 0.08, 1.6]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
      <OutlinedBox position={[1.42, 0.05, 0]} args={[0.04, 0.08, 1.6]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />

      {/* Bench */}
      <group position={[-0.5, 0.01, -0.2]}>
        <OutlinedBox position={[-0.28, 0.05, 0]} args={[0.04, 0.1, 0.16]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        <OutlinedBox position={[0.28, 0.05, 0]} args={[0.04, 0.1, 0.16]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        <OutlinedBox position={[0, 0.11, 0]} args={[0.6, 0.02, 0.18]} color={benchColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        <OutlinedBox position={[0, 0.18, -0.08]} args={[0.6, 0.12, 0.02]} color={benchColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
      </group>

      {/* Pedestal and Diamond Sculpture */}
      <group position={[0.6, 0.01, 0.1]}>
        <OutlinedBox position={[0, 0.06, 0]} args={[0.24, 0.12, 0.24]} color={curbColor} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        <OutlinedBox
          position={[0, 0.18, 0]}
          args={[0.14, 0.14, 0.14]}
          color={sculptureColor}
          lineColor={colors.accentLines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
          rotation={[0.5, 0.78, 0.5]}
        />
      </group>
    </group>
  )
}

/* ─── Helper Component: Parking Lot ────────────────────────────── */
function ParkingLot({ colors, showOutlines, clipPlane, isLight }) {
  const asphaltColor = isLight ? '#cbd5e1' : '#0f172a'
  const lineColor = isLight ? '#f1f5f9' : '#38bdf8'
  const lines = [-2.7, -0.9, 0.9, 2.7]

  return (
    <group position={[0, 0.002, -2.5]}>
      {/* Asphalt Pad */}
      <OutlinedBox
        position={[0, 0.001, 0]}
        args={[8.4, 0.002, 1.8]}
        color={asphaltColor}
        lineColor={colors.outlines}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />
      {/* Divider lines */}
      {lines.map((x, i) => (
        <OutlinedBox
          key={`park-line-${i}`}
          position={[x, 0.002, 0]}
          args={[0.02, 0.001, 1.6]}
          color={lineColor}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={false}
        />
      ))}
    </group>
  )
}

/* ─── Procedural Detailed Building Model ────────────────────────── */
export function WireframeBuilding({ buildProgress = 1, explodeProgress = 0, autoRotate = true, rotationY = 0, theme }) {
  const groupRef = useRef()
  const [hoveredZone, setHoveredZone] = useState(null)

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.0), [])

  const isLight = theme === 'light'
  const showOutlines = !isLight // Completely disable outlines in Light Mode!

  // Dynamic Theme Colors Mapper
  const colors = useMemo(() => ({
    clayBody: isLight ? '#f8fafc' : '#141d30',      // Clean architectural porcelain vs modern slate
    clayPlates: isLight ? '#f1f5f9' : '#0e1626',    // Slab plates
    clayGate: isLight ? '#334155' : '#1e293b',      // Structural contrast accents
    outlines: isLight ? '#2563eb' : '#60a5fa',      // Radiant sapphire architectural lines
    accentLines: isLight ? '#1d4ed8' : '#38bdf8',   // Electric sky azure detailing
    foliage: isLight ? '#10b981' : '#059669',       // Natural landscape emerald green
    basePlane: isLight ? '#f1f5f9' : '#070b14',     // Architectural base plate
    draftGuides: isLight ? '#cbd5e1' : '#152238',   // Floor boundary guides
  }), [isLight])

  // Building geometry layout parameters (18 storeys high!)
  const numFloors = 18 
  const lobbyHeight = 0.9 
  const typicalHeight = 0.45
  const wingWidth = 2.4 
  const wingDepth = 2.4 
  const coreWidth = 1.4 
  const coreDepth = 2.2 

  // Dynamically compute floor slab heights
  const slabHeights = useMemo(() => {
    const arr = [0.0]
    for (let i = 1; i < numFloors; i++) {
      arr.push(lobbyHeight + (i - 1) * typicalHeight)
    }
    return arr
  }, [numFloors, lobbyHeight, typicalHeight])

  const buildingHeight = slabHeights[numFloors - 1] // 8.55 units total building height

  // Generate detailed procedural line networks (railings, core, piping)
  const lineGeometries = useMemo(() => {
    const railingPoints = []
    const corePoints = []
    const pipePoints = []
    const treePoints = []
    const foliagePoints = []

    // Only populate line geometry if outlines are active (Dark Mode)
    if (showOutlines) {
      // 1. Facade Balcony Railing Lines (Floors 1 to 17)
      for (let f = 1; f < numFloors; f++) {
        const y = slabHeights[f]
        const balconyWidth = 2.0
        const leftCenterX = -1.9
        const rightCenterX = 1.9

        const addBalconyRailings = (cx, cz, isFront) => {
          const zSign = isFront ? 1 : -1
          const railZ = cz + zSign * 0.175
          const backZ = cz - zSign * 0.175

          railingPoints.push(cx - balconyWidth * 0.5, y + 0.35, railZ, cx + balconyWidth * 0.5, y + 0.35, railZ)
          railingPoints.push(cx - balconyWidth * 0.5, y + 0.18, railZ, cx + balconyWidth * 0.5, y + 0.18, railZ)
          railingPoints.push(cx - balconyWidth * 0.5, y + 0.35, railZ, cx - balconyWidth * 0.5, y + 0.35, backZ)
          railingPoints.push(cx - balconyWidth * 0.5, y + 0.18, railZ, cx - balconyWidth * 0.5, y + 0.18, backZ)
          railingPoints.push(cx + balconyWidth * 0.5, y + 0.35, railZ, cx + balconyWidth * 0.5, y + 0.35, backZ)
          railingPoints.push(cx + balconyWidth * 0.5, y + 0.18, railZ, cx + balconyWidth * 0.5, y + 0.18, backZ)

          const numBalusters = 4
          for (let i = 0; i < numBalusters; i++) {
            const t = i / (numBalusters - 1)
            const rx = cx - balconyWidth * 0.5 + t * balconyWidth
            railingPoints.push(rx, y, railZ, rx, y + 0.35, railZ)
          }
        }

        addBalconyRailings(leftCenterX, 1.2, true)
        addBalconyRailings(leftCenterX, -1.2, false)
        addBalconyRailings(rightCenterX, 1.2, true)
        addBalconyRailings(rightCenterX, -1.2, false)
      }

      // 2. Central Elevator Guide Rails
      corePoints.push(-0.4, 0.0, -0.7, -0.4, buildingHeight, -0.7)
      corePoints.push(-0.4, 0.0, -0.3, -0.4, buildingHeight, -0.3)
      corePoints.push(0.4, 0.0, -0.7, 0.4, buildingHeight, -0.7)
      corePoints.push(0.4, 0.0, -0.3, 0.4, buildingHeight, -0.3)

      for (let f = 1; f < numFloors; f++) {
        const y = slabHeights[f]
        corePoints.push(-0.55, y, -0.7, 0.55, y, -0.7)
        corePoints.push(-0.55, y, -0.3, 0.55, y, -0.3)
      }

      // 3. Facade Utility Piping
      const px1 = -0.68, px2 = 0.68
      const pz = 1.12
      const pipeTop = buildingHeight + 0.15
      const pipeBendTop = buildingHeight + 0.22
      pipePoints.push(px1, 0.0, pz, px1, pipeTop, pz)
      pipePoints.push(px2, 0.0, pz, px2, pipeTop, pz)
      pipePoints.push(px1, pipeTop, pz, px1, pipeBendTop, pz - 0.2)
      pipePoints.push(px2, pipeTop, pz, px2, pipeBendTop, pz - 0.2)

      for (let f = 0; f < numFloors; f++) {
        const y = slabHeights[f]
        pipePoints.push(px1, y, pz, px1, y, pz - 0.08)
        pipePoints.push(px2, y, pz, px2, y, pz - 0.08)
      }

      // 4. Rooftop Lightning Rod Antenna
      const antX = 2.0, antZ = -0.8, antBaseY = buildingHeight
      pipePoints.push(antX, antBaseY, antZ, antX, antBaseY + 1.25, antZ)
      pipePoints.push(antX - 0.15, antBaseY + 0.8, antZ, antX + 0.15, antBaseY + 0.8, antZ)
      pipePoints.push(antX, antBaseY + 0.8, antZ, antX - 0.4, antBaseY, antZ - 0.3)
      pipePoints.push(antX, antBaseY + 0.8, antZ, antX + 0.4, antBaseY, antZ - 0.3)
    }

    // 5. Landscape trees (Only line skeletons for Dark Mode)
    const trees = [
      { tx: -4.2, tz: 2.8 },
      { tx: -2.6, tz: 2.8 },
      { tx: 2.6, tz: 2.8 },
      { tx: 4.2, tz: 2.8 },
      { tx: -4.3, tz: 0.0 },
      { tx: -4.3, tz: -2.0 },
    ]

    trees.forEach(t => {
      const trunkH = 0.25 + Math.random() * 0.1
      
      if (showOutlines) {
        treePoints.push(t.tx, 0.0, t.tz, t.tx, trunkH, t.tz)
        treePoints.push(t.tx, trunkH, t.tz, t.tx - 0.06, trunkH + 0.08, t.tz + 0.03)
        treePoints.push(t.tx, trunkH, t.tz, t.tx + 0.06, trunkH + 0.08, t.tz - 0.03)

        const canopyCenterY = trunkH + 0.12
        const pCount = 30
        for (let p = 0; p < pCount; p++) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          const rad = 0.08 + Math.cbrt(Math.random()) * 0.12
          const fx = t.tx + rad * Math.sin(phi) * Math.cos(theta)
          const fy = canopyCenterY + rad * Math.sin(phi) * Math.sin(theta)
          const fz = t.tz + rad * Math.cos(phi)
          foliagePoints.push(fx, fy, fz)
        }
      }
    })

    return {
      railing: new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(railingPoints), 3)),
      core: new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(corePoints), 3)),
      pipe: new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(pipePoints), 3)),
      tree: new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(treePoints), 3)),
      foliage: new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(foliagePoints), 3))
    }
  }, [buildingHeight, slabHeights, numFloors, showOutlines])

  // Line materials
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: colors.outlines,
    clippingPlanes: [clipPlane],
    transparent: true,
    opacity: 0.65
  }), [colors.outlines, clipPlane])

  const detailMat = useMemo(() => new THREE.LineBasicMaterial({
    color: colors.accentLines,
    clippingPlanes: [clipPlane],
    transparent: true,
    opacity: 0.55
  }), [colors.accentLines, clipPlane])

  const leafMat = useMemo(() => new THREE.PointsMaterial({
    color: colors.foliage,
    size: 0.04,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    clippingPlanes: [clipPlane]
  }), [colors.foliage, clipPlane])

  // Motorized turntable rotation
  const rotationYRef = useRef(0)
  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (autoRotate) {
      rotationYRef.current += delta * 0.15 // Smooth horizontal auto-rotation
    }
    groupRef.current.rotation.y = rotationYRef.current + rotationY
    groupRef.current.position.y = -1.4 // Static height

    const baseWorldY = groupRef.current.position.y
    const targetClipH = baseWorldY + buildProgress * (buildingHeight + 1.2) + (numFloors * 0.22 * explodeProgress)
    clipPlane.constant = targetClipH
  })

  // Columns layout definition
  const columns = useMemo(() => {
    const colX = [-3.0, -1.9, -0.8, 0.8, 1.9, 3.0]
    const colZ = [-1.1, 0.0, 1.1]
    const arr = []
    colX.forEach(x => {
      colZ.forEach(z => {
        arr.push({ x, z })
      })
    })
    return arr
  }, [])

  // Trees array for solid rendering in Light Mode
  const treesList = useMemo(() => [
    { tx: -4.2, tz: 2.8, h: 0.32 },
    { tx: -2.6, tz: 2.8, h: 0.28 },
    { tx: 2.6, tz: 2.8, h: 0.3 },
    { tx: 4.2, tz: 2.8, h: 0.35 },
    { tx: -4.3, tz: 0.0, h: 0.31 },
    { tx: -4.3, tz: -2.0, h: 0.27 },
  ], [])

  // Cars coordinates for the backside parking lot and active compound areas (21 cars total)
  const carsData = useMemo(() => [
    // Row 1 (Z = -3.0, 9 spots)
    { x: -4.0, z: -3.0, rot: 0 },
    { x: -3.0, z: -3.0, rot: 0 },
    { x: -2.0, z: -3.0, rot: 0 },
    { x: -1.0, z: -3.0, rot: 0 },
    { x: 0.0,  z: -3.0, rot: 0 },
    { x: 1.0,  z: -3.0, rot: 0 },
    { x: 2.0,  z: -3.0, rot: 0 },
    { x: 3.0,  z: -3.0, rot: 0 },
    { x: 4.0,  z: -3.0, rot: 0 },

    // Row 2 (Z = -2.0, 9 spots)
    { x: -4.0, z: -2.0, rot: Math.PI },
    { x: -3.0, z: -2.0, rot: Math.PI },
    { x: -2.0, z: -2.0, rot: Math.PI },
    { x: -1.0, z: -2.0, rot: Math.PI },
    { x: 0.0,  z: -2.0, rot: Math.PI },
    { x: 1.0,  z: -2.0, rot: Math.PI },
    { x: 2.0,  z: -2.0, rot: Math.PI },
    { x: 3.0,  z: -2.0, rot: Math.PI },
    { x: 4.0,  z: -2.0, rot: Math.PI },

    // Courtyard & Gate Vehicles (3 cars)
    { x: 0.0,  z: 3.3,  rot: 0 },
    { x: -1.0, z: 2.0,  rot: Math.PI * 0.1 },
    { x: -3.2, z: 1.8,  rot: Math.PI * 0.5 },
  ], [])

  // Scale people figures coordinates
  const peopleData = useMemo(() => [
    // Near main gate/entrance
    { x: 0.35, z: 3.1 },
    { x: -0.35, z: 2.9 },
    { x: 0.0, z: 2.2 },
    { x: -0.6, z: 1.2 },

    // In the park (front right)
    { x: 2.5, y: 0.12, z: 2.22, isSitting: true },
    { x: 3.6, z: 2.5 },
    { x: 2.0, z: 2.7 },

    // Near the parking lot (backside)
    { x: -2.0, z: -1.7 },
    { x: 2.2, z: -1.6 },
  ], [])

  return (
    <group ref={groupRef} position={[0.0, -1.4, -0.4]} scale={0.84}>
      {/* ── GROUND PLOT BASE PLATFORM (Enlarged Plot Area!) ── */}
      <OutlinedBox
        position={[0, -0.02, 0]}
        args={[10.0, 0.04, 7.2]}
        color={colors.basePlane}
        lineColor={colors.outlines}
        clipPlane={clipPlane}
        showOutlines={showOutlines}
      />

      {/* ── PLOT BOUNDARY WALLS (Enlarged walls area!) ── */}
      <group>
        {/* Back Wall */}
        <OutlinedBox position={[0, 0.105, -3.56]} args={[10.0, 0.21, 0.08]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Left Wall */}
        <OutlinedBox position={[-4.96, 0.105, 0]} args={[0.08, 0.21, 7.2]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Right Wall */}
        <OutlinedBox position={[4.96, 0.105, 0]} args={[0.08, 0.21, 7.2]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Front Left Wall */}
        <OutlinedBox position={[-2.96, 0.105, 3.56]} args={[4.0, 0.21, 0.08]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Front Right Wall */}
        <OutlinedBox position={[2.96, 0.105, 3.56]} args={[4.0, 0.21, 0.08]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
      </group>

      {/* ── GRAND Entrance Gate (Between front wall gap!) ── */}
      <group>
        {/* Left Gate Pillar */}
        <OutlinedBox position={[-0.96, 0.325, 3.56]} args={[0.22, 0.65, 0.22]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Right Gate Pillar */}
        <OutlinedBox position={[0.96, 0.325, 3.56]} args={[0.22, 0.65, 0.22]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Overhead Gate Beam */}
        <OutlinedBox position={[0.0, 0.68, 3.56]} args={[2.14, 0.08, 0.22]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        
        {/* Left Gate Leaf (Solid dark steel panels) */}
        <OutlinedBox position={[-0.42, 0.225, 3.56]} args={[0.8, 0.45, 0.03]} color={colors.clayGate} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
        {/* Right Gate Leaf */}
        <OutlinedBox position={[0.42, 0.225, 3.56]} args={[0.8, 0.45, 0.03]} color={colors.clayGate} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
      </group>

      {/* ── GROUND LEVEL LOBBY ZONE ── */}
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('lobby') }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredZone(null) }}
      >
        {/* Open pilotis parking bays & central entrance slab */}
        <OutlinedBox
          position={[0, 0.01, -0.1]}
          args={[1.4, 0.02, 2.0]}
          color={colors.clayPlates}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />
        {hoveredZone === 'lobby' && (
          <Html position={[0, 0.22, 1.2]} center>
            <div className="hud-tooltip">
              <div className="hud-tooltip__header">
                <div className="hud-tooltip__title">Ground Pilotis</div>
                <div className="hud-tooltip__height">Clearance: 7.8m (Double Height)</div>
              </div>
              <div className="hud-tooltip__body">
                <div className="hud-tooltip__row">
                  <span className="hud-tooltip__label">Function</span>
                  <span className="hud-tooltip__value">Open Lobby, Landscaping, Covered Parking</span>
                </div>
                <div className="hud-tooltip__status">
                  <span className="hud-tooltip__status-dot"></span>
                  <span>Structural Phase</span>
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ── SUITES ZONE (Left & Right Wings Slabs, Balconies, Solid division walls, Columns) ── */}
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('suites') }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredZone(null) }}
      >
        {/* Floor slabs, columns, division walls & balconies mapped per-floor for exploded spacing */}
        {slabHeights.map((y, index) => {
          const balconyW = 2.0
          const leftX_pos = -1.9
          const rightX_pos = 1.9
          
          // Compute staggered vertical offset for exploded view
          const explodeOffset = index * 0.22 * explodeProgress
          const slabY = y + explodeOffset
          const colHeight = index === 0 ? lobbyHeight : typicalHeight
          const colY = (index === 0 ? lobbyHeight * 0.5 : y + typicalHeight * 0.5) + explodeOffset

          return (
            <group key={`slabs-floor-${index}`}>
              {/* Left Wing Floor Slab */}
              <OutlinedBox position={[-1.9, slabY, 0.0]} args={[wingWidth, 0.04, wingDepth]} color={colors.clayPlates} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
              {/* Right Wing Floor Slab */}
              <OutlinedBox position={[1.9, slabY, 0.0]} args={[wingWidth, 0.04, wingDepth]} color={colors.clayPlates} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
              {/* Central Bay Connecting Slab */}
              <OutlinedBox position={[0.0, slabY, -0.1]} args={[coreWidth, 0.04, 2.0]} color={colors.clayPlates} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />

              {/* Balconies (Floors 1-17) */}
              {index > 0 && (
                <>
                  {/* Left Wing Front Balcony */}
                  <OutlinedBox position={[-1.9, slabY, 1.355]} args={[2.0, 0.02, 0.31]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
                  {/* Left Wing Back Balcony */}
                  <OutlinedBox position={[-1.9, slabY, -1.355]} args={[2.0, 0.02, 0.31]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
                  {/* Right Wing Front Balcony */}
                  <OutlinedBox position={[1.9, slabY, 1.355]} args={[2.0, 0.02, 0.31]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />
                  {/* Right Wing Back Balcony */}
                  <OutlinedBox position={[1.9, slabY, -1.355]} args={[2.0, 0.02, 0.31]} color={colors.clayBody} lineColor={colors.outlines} clipPlane={clipPlane} showOutlines={showOutlines} />

                  {/* ── Balcony Railing Glass/Metal Panels (Rendered in both modes for consistent styling!) ── */}
                  <group>
                    {/* Left Wing Front Railing */}
                    <mesh position={[leftX_pos, slabY + 0.185, 1.355]} castShadow>
                      <boxGeometry args={[balconyW, 0.35, 0.02]} />
                      <meshStandardMaterial 
                        color={isLight ? "#cbd5e1" : "#0f172a"} 
                        transparent 
                        opacity={isLight ? 0.65 : 0.35} 
                        roughness={0.1} 
                        metalness={isLight ? 0.2 : 0.8} 
                        clippingPlanes={[clipPlane]} 
                      />
                    </mesh>
                    {/* Left Wing Back Railing */}
                    <mesh position={[leftX_pos, slabY + 0.185, -1.355]} castShadow>
                      <boxGeometry args={[balconyW, 0.35, 0.02]} />
                      <meshStandardMaterial 
                        color={isLight ? "#cbd5e1" : "#0f172a"} 
                        transparent 
                        opacity={isLight ? 0.65 : 0.35} 
                        roughness={0.1} 
                        metalness={isLight ? 0.2 : 0.8} 
                        clippingPlanes={[clipPlane]} 
                      />
                    </mesh>
                    {/* Right Wing Front Railing */}
                    <mesh position={[rightX_pos, slabY + 0.185, 1.355]} castShadow>
                      <boxGeometry args={[balconyW, 0.35, 0.02]} />
                      <meshStandardMaterial 
                        color={isLight ? "#cbd5e1" : "#0f172a"} 
                        transparent 
                        opacity={isLight ? 0.65 : 0.35} 
                        roughness={0.1} 
                        metalness={isLight ? 0.2 : 0.8} 
                        clippingPlanes={[clipPlane]} 
                      />
                    </mesh>
                    {/* Right Wing Back Railing */}
                    <mesh position={[rightX_pos, slabY + 0.185, -1.355]} castShadow>
                      <boxGeometry args={[balconyW, 0.35, 0.02]} />
                      <meshStandardMaterial 
                        color={isLight ? "#cbd5e1" : "#0f172a"} 
                        transparent 
                        opacity={isLight ? 0.65 : 0.35} 
                        roughness={0.1} 
                        metalness={isLight ? 0.2 : 0.8} 
                        clippingPlanes={[clipPlane]} 
                      />
                    </mesh>
                  </group>
                </>
              )}

              {/* Render structural grid columns and division walls per floor segment */}
              {index < numFloors - 1 && (
                <>
                  {/* Left Wing Facade Division Wall */}
                  <OutlinedBox
                    position={[-1.9, colY, 0.0]}
                    args={[2.32, colHeight, 0.06]}
                    color={colors.clayBody}
                    lineColor={colors.outlines}
                    clipPlane={clipPlane}
                    showOutlines={showOutlines}
                  />
                  {/* Right Wing Facade Division Wall */}
                  <OutlinedBox
                    position={[1.9, colY, 0.0]}
                    args={[2.32, colHeight, 0.06]}
                    color={colors.clayBody}
                    lineColor={colors.outlines}
                    clipPlane={clipPlane}
                    showOutlines={showOutlines}
                  />
                  {/* Structural Columns */}
                  {columns.map((col, idx) => (
                    <OutlinedBox
                      key={`col-f${index}-${idx}`}
                      position={[col.x, colY, col.z]}
                      args={[0.08, colHeight, 0.08]}
                      color={colors.clayBody}
                      lineColor={colors.outlines}
                      clipPlane={clipPlane}
                      showOutlines={showOutlines}
                    />
                  ))}
                </>
              )}
            </group>
          )
        })}

        {hoveredZone === 'suites' && (
          <Html position={[2.0, (buildingHeight * 0.5) + (9 * 0.22 * explodeProgress), 1.2]} center>
            <div className="hud-tooltip">
              <div className="hud-tooltip__header">
                <div className="hud-tooltip__title">Skyscraper Suites</div>
                <div className="hud-tooltip__height">{numFloors - 1} Storeys (Wings A & B)</div>
              </div>
              <div className="hud-tooltip__body">
                <div className="hud-tooltip__row">
                  <span className="hud-tooltip__label">Slab Area</span>
                  <span className="hud-tooltip__value">640 sqm per Wing</span>
                </div>
                <div className="hud-tooltip__row">
                  <span className="hud-tooltip__label">Detail</span>
                  <span className="hud-tooltip__value">Dual-aspect balconies, glazed facades</span>
                </div>
                <div className="hud-tooltip__status">
                  <span className="hud-tooltip__status-dot"></span>
                  <span>Frame Complete</span>
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* Columns are now rendered dynamically inside the suites loop per floor */}
      <group />

      {/* ── CENTRAL ELEVATOR & STAIRCASE CORE ── */}
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('core') }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredZone(null) }}
      >
        {/* Rear Core Shear Wall */}
        <OutlinedBox
          position={[0.0, buildingHeight * 0.5, -0.8]}
          args={[1.2, buildingHeight, 0.08]}
          color={colors.clayBody}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />
        {/* Core center partition wall */}
        <OutlinedBox
          position={[0.0, buildingHeight * 0.5, -0.3]}
          args={[0.08, buildingHeight, 0.8]}
          color={colors.clayBody}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />

        {hoveredZone === 'core' && (
          <Html position={[0, buildingHeight * 0.5, 0.4]} center>
            <div className="hud-tooltip">
              <div className="hud-tooltip__header">
                <div className="hud-tooltip__title">Staircase & Elevator Core</div>
                <div className="hud-tooltip__height">Height: {Math.round(buildingHeight * 4.5)}m</div>
              </div>
              <div className="hud-tooltip__body">
                <div className="hud-tooltip__row">
                  <span className="hud-tooltip__label">Core Type</span>
                  <span className="hud-tooltip__value">Shear Wall Concrete Core</span>
                </div>
                <div className="hud-tooltip__row">
                  <span className="hud-tooltip__label">Detailing</span>
                  <span className="hud-tooltip__value">Split-flight stairs, twin lift shafts</span>
                </div>
                <div className="hud-tooltip__status">
                  <span className="hud-tooltip__status-dot"></span>
                  <span>Internal Outfitting</span>
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ── ROOFTOP PENTHOUSE & MACHINERY ZONE (Translated with top floor) ── */}
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHoveredZone('roof') }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredZone(null) }}
      >
        {/* Main Mechanical Room block */}
        <OutlinedBox
          position={[0.0, buildingHeight + 0.3 + ((numFloors - 1) * 0.22 * explodeProgress), -0.2]}
          args={[2.2, 0.6, 1.4]}
          color={colors.clayBody}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />
        {/* Auxiliary service block left */}
        <OutlinedBox
          position={[-1.5, buildingHeight + 0.2 + ((numFloors - 1) * 0.22 * explodeProgress), 0.5]}
          args={[0.5, 0.4, 0.5]}
          color={colors.clayPlates}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />
        {/* Auxiliary service block right */}
        <OutlinedBox
          position={[1.5, buildingHeight + 0.2 + ((numFloors - 1) * 0.22 * explodeProgress), 0.5]}
          args={[0.5, 0.4, 0.5]}
          color={colors.clayPlates}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />

        {hoveredZone === 'roof' && (
          <Html position={[0, buildingHeight + 0.3 + ((numFloors - 1) * 0.22 * explodeProgress), 0]} center>
            <div className="hud-tooltip">
              <div className="hud-tooltip__header">
                <div className="hud-tooltip__title">Mechanical Penthouse</div>
                <div className="hud-tooltip__height">Level {numFloors}</div>
              </div>
              <div className="hud-tooltip__body">
                <div className="hud-tooltip__row">
                  <span className="hud-tooltip__label">Machinery</span>
                  <span className="hud-tooltip__value">HVAC Plant, Lift Overrun, Antenna</span>
                </div>
                <div className="hud-tooltip__status">
                  <span className="hud-tooltip__status-dot"></span>
                  <span>Service Fitting</span>
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* ── SOLID CLAY TREES & FOLIAGE (Light Mode ONLY) ── */}
      {!showOutlines && (
        <group>
          {treesList.map((t, idx) => (
            <group key={`solid-tree-${idx}`}>
              {/* Solid Trunk */}
              <mesh position={[t.tx, t.h * 0.5, t.tz]} castShadow>
                <cylinderGeometry args={[0.025, 0.035, t.h, 6]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} clippingPlanes={[clipPlane]} />
              </mesh>
              {/* Solid Canopy (Green Clay Box/Sphere) */}
              <mesh position={[t.tx, t.h + 0.12, t.tz]} castShadow>
                <sphereGeometry args={[0.18, 6, 6]} />
                <meshStandardMaterial color={colors.foliage} roughness={0.85} clippingPlanes={[clipPlane]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* ── PARK AREA ── */}
      <ParkArea colors={colors} showOutlines={showOutlines} clipPlane={clipPlane} isLight={isLight} />

      {/* ── PARKING LOT base ── */}
      <ParkingLot colors={colors} showOutlines={showOutlines} clipPlane={clipPlane} isLight={isLight} />

      {/* ── PARKED CARS ── */}
      {carsData.map((car, idx) => (
        <ScaleCar
          key={`car-${idx}`}
          position={[car.x, 0.01, car.z]}
          rotation={[0, car.rot, 0]}
          color={colors.clayBody}
          cabinColor={isLight ? colors.clayGate : colors.clayBody}
          wheelColor={isLight ? colors.clayGate : colors.clayBody}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
        />
      ))}

      {/* ── SCALE PEOPLE FIGURES ── */}
      {peopleData.map((p, idx) => (
        <ScaleFigure
          key={`person-${idx}`}
          position={[p.x, p.y || 0.01, p.z]}
          color={isLight ? colors.clayGate : colors.clayBody}
          lineColor={colors.outlines}
          clipPlane={clipPlane}
          showOutlines={showOutlines}
          isSitting={p.isSitting}
        />
      ))}

      {/* ── PROCEDURAL LINES OVERLAYS (Railings, Core, Pipes, Trees - Dark Mode ONLY) ── */}
      {showOutlines && (
        <>
          <lineSegments geometry={lineGeometries.railing} material={lineMat} />
          <lineSegments geometry={lineGeometries.core} material={lineMat} />
          <lineSegments geometry={lineGeometries.pipe} material={detailMat} />
          <lineSegments geometry={lineGeometries.tree} material={lineMat} />
          <points geometry={lineGeometries.foliage} material={leafMat} />
        </>
      )}
    </group>
  )
}

/* ─── Ground grid plane ────────────────────────────────────────────── */
export function GroundGrid({ size = 28, divisions = 32, theme }) {
  const ref = useRef()
  const mat = useMemo(() => new THREE.LineBasicMaterial({
    color: theme === 'light' ? '#93c5fd' : '#07246e', // light mode blue vs dark mode navy
    transparent: true,
    opacity: 0.45
  }), [theme])

  useFrame(() => {})

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const verts = []
    const step = size / divisions
    const half = size / 2
    for (let i = 0; i <= divisions; i++) {
      const p = -half + i * step
      verts.push(-half, -1.4, p, half, -1.4, p)
      verts.push(p, -1.4, -half, p, -1.4, half)
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
    return g
  }, [size, divisions])

  return (
    <lineSegments
      ref={ref}
      geometry={geo}
      material={mat}
      position={[0, 0, 0]}
    />
  )
}

/* ─── Floating Data Particles ──────────────────────────────────────── */
export function DataParticles({ count = 120, theme }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 15
      arr[i * 3 + 1] = Math.random() * 6 - 1.4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 11
    }
    return arr
  }, [count])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: theme === 'light' ? '#2563eb' : '#0a4fdc', // vibrant blue vs dark blue
    size: 0.03,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true
  }), [theme])

  useFrame(() => {})

  return <points ref={ref} geometry={geo} material={mat} />
}
