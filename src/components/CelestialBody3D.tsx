import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { CelestialBodyData } from '../data/solarSystemData';
import { getPlanetTextures, getRingTexture, IS_SOFTWARE_GL } from '../utils/proceduralTextures';

export type ScaleMode = 'orrery' | 'truescale' | 'lineup';

interface CelestialBody3DProps {
  body: CelestialBodyData;
  selectedBodyId: string;
  selectedMoonId: string | null;
  scaleMode: ScaleMode;
  simulationSpeed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  showAxialTilt: boolean;
  showCutaway: boolean;
  showProbe: boolean;
  onSelectBody: (id: string) => void;
  onSelectMoon: (moonId: string | null) => void;
  bodyPositionRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
  planetLabelDomRef: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  moonLabelDomRef: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
}

// Pre-allocated vectors at module scope to prevent GC in useFrame
const _tempVec = new THREE.Vector3();
const _projVec = new THREE.Vector3();
const _moonWorldVec = new THREE.Vector3();

/**
 * Composite 9-part Deep Space Telemetry Probe orbiting the inspected planet
 */
function SpacecraftProbe3D({ orbitRadius }: { orbitRadius: number }) {
  const probeGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!probeGroupRef.current) return;
    const t = clock.getElapsedTime() * 0.65;
    probeGroupRef.current.position.set(
      Math.cos(t) * orbitRadius,
      Math.sin(t * 1.4) * (orbitRadius * 0.22),
      Math.sin(t) * orbitRadius
    );
    probeGroupRef.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={probeGroupRef} scale={0.14}>
      {/* 1. Primary Silhouette: Octagonal Gold-Foil Bus */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 1.4, 8]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.92} roughness={0.22} />
      </mesh>

      {/* 2. Secondary Read: High-Gain Parabolic Dish Antenna */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.65, 0.45, 24, 1, true]} />
        <meshStandardMaterial
          color="#F8FAFC"
          metalness={0.45}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Accent Detail: Dish Central Feed Horn & Tripod Strut */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.85, 8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 4 & 5. Secondary Read: Port & Starboard Photovoltaic Solar Arrays */}
      <group position={[-2.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[3.6, 0.06, 1.1]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.75} roughness={0.15} />
        </mesh>
        <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 6]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>
      <group position={[2.8, 0, 0]}>
        <mesh>
          <boxGeometry args={[3.6, 0.06, 1.1]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.75} roughness={0.15} />
        </mesh>
        <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 6]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* 6. Accent Detail: Optical Spectrometer Turret */}
      <mesh position={[0, -0.2, 1.05]}>
        <boxGeometry args={[0.45, 0.45, 0.55]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* 7. Accent Detail: Optical Lens Aperture */}
      <mesh position={[0, -0.2, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.8} />
      </mesh>

      {/* 8. Accent Detail: Magnetometer Boom */}
      <mesh position={[0, -0.3, -1.9]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 2.2, 6]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 9. Accent Detail: Ion Thruster Plume */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.25, 0.42, 0.5, 12]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.65} depthWrite={false} />
      </mesh>
    </group>
  );
}

export const CelestialBody3D: React.FC<CelestialBody3DProps> = ({
  body,
  selectedBodyId,
  selectedMoonId,
  scaleMode,
  simulationSpeed,
  isPaused,
  showOrbits,
  showLabels,
  showAxialTilt,
  showCutaway,
  showProbe,
  onSelectBody,
  onSelectMoon,
  bodyPositionRef,
  planetLabelDomRef,
  moonLabelDomRef,
}) => {
  const orbitPositionGroupRef = useRef<THREE.Group>(null);
  const planetSpinGroupRef = useRef<THREE.Group>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const coronaMeshRef = useRef<THREE.Mesh>(null);
  const moonGroupRefs = useRef<Record<string, THREE.Group | null>>({});

  const [hovered, setHovered] = useState(false);

  // Initial orbital phase angle seeded deterministically per planet
  const orbitalAngleRef = useRef<number>(body.index * 1.15 + 0.4);

  const isSelected = selectedBodyId === body.id;
  const isSun = body.id === 'sun';

  // Compute target visual radius and orbital distance for the active scaleMode
  const { visualRadius, orbitalDistance, lineupX } = useMemo(() => {
    if (scaleMode === 'truescale') {
      const r = isSun ? 6.8 : Math.max(0.24, Math.pow(body.relativeRadiusEarth, 0.62) * 0.72);
      const d = isSun ? 0 : 12 + Math.pow(body.semiMajorAxisAU, 0.65) * 18.5;
      return { visualRadius: r, orbitalDistance: d, lineupX: 0 };
    }
    if (scaleMode === 'lineup') {
      const spacing = [0, 10, 16, 23, 30, 41, 55, 68, 79, 88];
      return {
        visualRadius: body.orreryRadius * 1.15,
        orbitalDistance: 0,
        lineupX: spacing[body.index] ?? body.index * 10,
      };
    }
    return {
      visualRadius: body.orreryRadius,
      orbitalDistance: body.orreryDistance,
      lineupX: 0,
    };
  }, [scaleMode, body, isSun]);

  // Procedural textures
  const textures = useMemo(() => getPlanetTextures(body.textureStyle), [body.textureStyle]);

  // Custom radial UV RingGeometry for Saturn, Uranus, Jupiter, Neptune
  const ringGeometryAndTexture = useMemo(() => {
    if (!body.rings) return null;
    const innerR = visualRadius * body.rings.innerRadiusRatio;
    const outerR = visualRadius * body.rings.outerRadiusRatio;
    const geom = new THREE.RingGeometry(innerR, outerR, IS_SOFTWARE_GL ? 64 : 128);

    const pos = geom.attributes.position;
    const uvs = geom.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const dist = Math.sqrt(vx * vx + vy * vy);
      const u = (dist - innerR) / (outerR - innerR);
      uvs.setXY(i, Math.max(0, Math.min(1, u)), 0.5);
    }
    geom.attributes.uv.needsUpdate = true;

    const tex = getRingTexture(body.id, body.rings.color);
    return { geom, tex };
  }, [body.id, body.rings, visualRadius]);

  // Native Three.js Line object for elliptical orbit path (avoids @react-three/drei Line overhead)
  const orbitLineObject = useMemo(() => {
    if (isSun || scaleMode === 'lineup') return null;
    const pts: THREE.Vector3[] = [];
    const segments = 160;
    const a = orbitalDistance;
    const e = body.eccentricity * 0.45;
    const b = a * Math.sqrt(1 - e * e);
    const incRad = THREE.MathUtils.degToRad(body.inclinationDeg * 0.65);

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = a * Math.cos(theta);
      const z = b * Math.sin(theta);
      const y = Math.sin(theta) * a * Math.sin(incRad);
      pts.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: '#334155',
      transparent: true,
      opacity: 0.42,
    });
    return new THREE.Line(geometry, material);
  }, [isSun, scaleMode, orbitalDistance, body.eccentricity, body.inclinationDeg]);

  // Update orbit line highlight color when selected or hovered
  useEffect(() => {
    if (!orbitLineObject) return;
    const mat = orbitLineObject.material as THREE.LineBasicMaterial;
    if (isSelected) {
      mat.color.set('#22D3EE');
      mat.opacity = 0.88;
    } else if (hovered) {
      mat.color.set('#94A3B8');
      mat.opacity = 0.65;
    } else {
      mat.color.set('#334155');
      mat.opacity = 0.4;
    }
  }, [orbitLineObject, isSelected, hovered]);

  // Cleanup orbit line geometry and material on unmount
  useEffect(() => {
    return () => {
      if (orbitLineObject) {
        orbitLineObject.geometry.dispose();
        (orbitLineObject.material as THREE.Material).dispose();
      }
    };
  }, [orbitLineObject]);

  // Animation loop: advance orbital revolution, axial rotation, cloud drift, moon orbits, and screen-space label projection
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const activeSpeed = isPaused ? 0 : simulationSpeed;

    if (orbitPositionGroupRef.current) {
      if (scaleMode === 'lineup') {
        _tempVec.set(lineupX, 0, 0);
        orbitPositionGroupRef.current.position.lerp(_tempVec, 1 - Math.exp(-6 * dt));
      } else if (!isSun) {
        const angularSpeed = (365.25 / Math.max(40, body.orbitalPeriodDays)) * 0.22 * activeSpeed;
        orbitalAngleRef.current += angularSpeed * dt;

        const theta = orbitalAngleRef.current;
        const a = orbitalDistance;
        const e = body.eccentricity * 0.45;
        const b = a * Math.sqrt(1 - e * e);
        const incRad = THREE.MathUtils.degToRad(body.inclinationDeg * 0.65);

        const targetX = a * Math.cos(theta);
        const targetZ = b * Math.sin(theta);
        const targetY = Math.sin(theta) * a * Math.sin(incRad);

        _tempVec.set(targetX, targetY, targetZ);
        orbitPositionGroupRef.current.position.lerp(_tempVec, 1 - Math.exp(-12 * dt));
      } else {
        _tempVec.set(0, 0, 0);
        orbitPositionGroupRef.current.position.lerp(_tempVec, 1 - Math.exp(-12 * dt));
      }

      if (!bodyPositionRef.current[body.id]) {
        bodyPositionRef.current[body.id] = new THREE.Vector3();
      }
      bodyPositionRef.current[body.id].copy(orbitPositionGroupRef.current.position);

      // Project planet label to 2D screen coordinates via DOM ref (zero React root creation/unmounting)
      const labelEl = planetLabelDomRef.current[body.id];
      if (labelEl) {
        if (!showLabels) {
          labelEl.style.opacity = '0';
          labelEl.style.pointerEvents = 'none';
        } else {
          const yOffset = visualRadius * (body.rings ? 1.55 : 1.28) + 0.65;
          _projVec.copy(orbitPositionGroupRef.current.position);
          _projVec.y += yOffset;
          _projVec.project(state.camera);

          // Check if in front of camera frustum
          if (_projVec.z > 1.0 || _projVec.z < -1.0) {
            labelEl.style.opacity = '0';
            labelEl.style.pointerEvents = 'none';
          } else {
            const screenX = (_projVec.x * 0.5 + 0.5) * state.size.width;
            const screenY = (-_projVec.y * 0.5 + 0.5) * state.size.height;
            labelEl.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) translate(-50%, -50%)`;
            labelEl.style.opacity = '1';
            labelEl.style.pointerEvents = 'auto';
          }
        }
      }
    }

    // Axial spin
    if (planetSpinGroupRef.current) {
      const dir = body.rotationPeriodHours < 0 ? -1 : 1;
      const spinRate =
        (24 / Math.max(8, Math.abs(body.rotationPeriodHours))) *
        0.45 *
        dir *
        (isPaused ? 0.12 : Math.max(0.25, Math.min(4, simulationSpeed)));
      planetSpinGroupRef.current.rotation.y += spinRate * dt;
    }

    // Independent cloud super-rotation
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += 0.18 * dt * (isPaused ? 0.15 : 1);
    }

    // Solar corona subtle breathing scale
    if (coronaMeshRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 1.8) * 0.018;
      coronaMeshRef.current.scale.setScalar(pulse);
    }

    // Orbiting moons & moon screen-space label projection
    body.moons.forEach((moon, idx) => {
      const mGroup = moonGroupRefs.current[moon.id];
      if (!mGroup) return;
      const mSpeed =
        (10 / Math.max(0.8, Math.abs(moon.orbitalPeriodDays))) *
        0.45 *
        (moon.orbitalPeriodDays < 0 ? -1 : 1);
      const angle =
        state.clock.getElapsedTime() *
          mSpeed *
          (isPaused ? 0.05 : Math.min(3, Math.max(0.4, simulationSpeed))) +
        idx * 2.1;
      const dist = (visualRadius / body.orreryRadius) * moon.orbitalRadius;
      mGroup.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle * 0.7) * (dist * 0.08),
        Math.sin(angle) * dist
      );

      const moonLabelEl = moonLabelDomRef.current[moon.id];
      if (moonLabelEl && orbitPositionGroupRef.current) {
        if (!showLabels || !isSelected) {
          moonLabelEl.style.opacity = '0';
          moonLabelEl.style.pointerEvents = 'none';
        } else {
          _moonWorldVec.copy(orbitPositionGroupRef.current.position).add(mGroup.position);
          _moonWorldVec.y += 0.35;
          _moonWorldVec.project(state.camera);

          if (_moonWorldVec.z > 1.0 || _moonWorldVec.z < -1.0) {
            moonLabelEl.style.opacity = '0';
            moonLabelEl.style.pointerEvents = 'none';
          } else {
            const sx = (_moonWorldVec.x * 0.5 + 0.5) * state.size.width;
            const sy = (-_moonWorldVec.y * 0.5 + 0.5) * state.size.height;
            moonLabelEl.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
            moonLabelEl.style.opacity = '1';
            moonLabelEl.style.pointerEvents = 'auto';
          }
        }
      }
    });
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectBody(body.id);
  };

  const axialTiltRad = THREE.MathUtils.degToRad(body.axialTiltDeg);
  const isCutawayActive = isSelected && showCutaway;
  const sphereSegments = IS_SOFTWARE_GL ? 32 : 64;

  return (
    <group>
      {/* Orbital Trajectory Line */}
      {showOrbits && orbitLineObject && <primitive object={orbitLineObject} />}

      {/* Celestial Body Moving Group */}
      <group ref={orbitPositionGroupRef}>
        {/* Axial Obliquity Group */}
        <group rotation={[0, 0, axialTiltRad]}>
          {/* Axial Tilt Pole Indicator Rod & Compass Ring */}
          {(showAxialTilt || isSelected) && (
            <group>
              <mesh>
                <cylinderGeometry args={[0.025, 0.025, visualRadius * 3.1, 8]} />
                <meshBasicMaterial
                  color={isSelected ? '#22D3EE' : '#64748B'}
                  transparent
                  opacity={isSelected ? 0.75 : 0.4}
                />
              </mesh>
              <mesh position={[0, visualRadius * 1.58, 0]}>
                <coneGeometry args={[0.09, 0.25, 12]} />
                <meshBasicMaterial color="#22D3EE" />
              </mesh>
            </group>
          )}

          {/* Spinning Planetary Body & Surface Layers */}
          <group ref={planetSpinGroupRef}>
            {isSun ? (
              <group>
                {/* Photosphere Primary Sphere */}
                <mesh
                  onClick={handleClick}
                  onPointerOver={handlePointerOver}
                  onPointerOut={handlePointerOut}
                >
                  <sphereGeometry
                    args={[
                      visualRadius,
                      sphereSegments,
                      sphereSegments,
                      0,
                      isCutawayActive ? Math.PI * 1.5 : Math.PI * 2,
                    ]}
                  />
                  <meshStandardMaterial
                    map={textures.albedoMap}
                    emissive="#F59E0B"
                    emissiveMap={textures.albedoMap}
                    emissiveIntensity={1.65}
                    roughness={0.2}
                    side={isCutawayActive ? THREE.DoubleSide : THREE.FrontSide}
                  />
                </mesh>

                {/* Inner Chromosphere / Corona Shell */}
                {!isCutawayActive && (
                  <mesh ref={coronaMeshRef}>
                    <sphereGeometry args={[visualRadius * 1.08, 32, 32]} />
                    <meshBasicMaterial
                      color="#FBBF24"
                      transparent
                      opacity={0.18}
                      side={THREE.BackSide}
                      depthWrite={false}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                )}

                {/* Outer Heliospheric Glow Shell */}
                {!isCutawayActive && (
                  <mesh>
                    <sphereGeometry args={[visualRadius * 1.24, 32, 32]} />
                    <meshBasicMaterial
                      color="#EA580C"
                      transparent
                      opacity={0.09}
                      side={THREE.BackSide}
                      depthWrite={false}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                )}
              </group>
            ) : (
              <group>
                {/* Primary Lithosphere / Outer Envelope */}
                <mesh
                  castShadow
                  receiveShadow
                  onClick={handleClick}
                  onPointerOver={handlePointerOver}
                  onPointerOut={handlePointerOut}
                >
                  <sphereGeometry
                    args={[
                      visualRadius,
                      sphereSegments,
                      sphereSegments,
                      0,
                      isCutawayActive ? Math.PI * 1.5 : Math.PI * 2,
                    ]}
                  />
                  <meshStandardMaterial
                    map={textures.albedoMap}
                    bumpMap={textures.bumpMap}
                    bumpScale={0.04}
                    roughness={body.id === 'earth' ? 0.55 : body.region === 'gas' ? 0.75 : 0.85}
                    metalness={body.id === 'earth' ? 0.15 : 0.05}
                    side={isCutawayActive ? THREE.DoubleSide : THREE.FrontSide}
                  />
                </mesh>

                {/* Cloud Deck Layer (Earth & Venus) */}
                {body.hasClouds && textures.cloudsMap && !isCutawayActive && (
                  <mesh ref={cloudsMeshRef}>
                    <sphereGeometry args={[visualRadius * 1.018, 32, 32]} />
                    <meshStandardMaterial
                      map={textures.cloudsMap}
                      transparent
                      opacity={body.id === 'venus' ? 0.55 : 0.75}
                      depthWrite={false}
                      roughness={0.9}
                    />
                  </mesh>
                )}

                {/* Atmospheric Scattering Rim Shell */}
                {body.hasAtmosphere && !isCutawayActive && (
                  <mesh>
                    <sphereGeometry args={[visualRadius * 1.055, 32, 32]} />
                    <meshBasicMaterial
                      color={body.atmosphereColor}
                      transparent
                      opacity={hovered || isSelected ? 0.2 : 0.11}
                      side={THREE.BackSide}
                      depthWrite={false}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                )}
              </group>
            )}

            {/* 3D Internal Cutaway Concentric Core Layers */}
            {isCutawayActive && (
              <group>
                {body.internalLayers.slice(0, -1).map((layer, idx) => {
                  const r = visualRadius * layer.radiusRatio;
                  const isInnermost = idx === 0;
                  const phiLength = isInnermost ? Math.PI * 2 : Math.PI * (1.55 + idx * 0.06);
                  return (
                    <mesh key={layer.name}>
                      <sphereGeometry args={[r, 32, 32, 0, phiLength]} />
                      <meshStandardMaterial
                        color={layer.color}
                        emissive={layer.color}
                        emissiveIntensity={isInnermost ? 0.65 : 0.22}
                        roughness={isInnermost ? 0.25 : 0.6}
                        metalness={isInnermost ? 0.8 : 0.2}
                        side={THREE.DoubleSide}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>

          {/* Planetary Ring System (Saturn, Uranus, Jupiter, Neptune) */}
          {ringGeometryAndTexture && (
            <mesh
              geometry={ringGeometryAndTexture.geom}
              rotation={[Math.PI / 2, 0, 0]}
              receiveShadow
              castShadow
              onClick={handleClick}
            >
              <meshStandardMaterial
                map={ringGeometryAndTexture.tex}
                color={body.rings!.color}
                transparent
                opacity={body.rings!.opacity}
                roughness={0.6}
                metalness={0.1}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>

        {/* Selection Reticle Ring in Equatorial Plane */}
        {(isSelected || hovered) && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[visualRadius * 1.32, visualRadius * 1.38, 64]} />
            <meshBasicMaterial
              color={isSelected ? '#06B6D4' : '#94A3B8'}
              side={THREE.DoubleSide}
              transparent
              opacity={isSelected ? 0.85 : 0.45}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Composite 3D Deep Space Reconnaissance Probe orbiting the focused world */}
        {isSelected && showProbe && !isSun && (
          <SpacecraftProbe3D orbitRadius={visualRadius * (body.rings ? 2.75 : 1.75)} />
        )}

        {/* Orbiting Natural Satellites (Moons) */}
        {body.moons.map((moon) => {
          const isMoonSelected = selectedMoonId === moon.id && isSelected;
          const moonVisualRadius = Math.max(
            0.14,
            Math.min(0.42, (moon.radiusKm / 2634) * 0.36 * (visualRadius / body.orreryRadius))
          );
          const moonOrbitDist = (visualRadius / body.orreryRadius) * moon.orbitalRadius;

          return (
            <group key={moon.id}>
              {/* Moon Orbital Ring */}
              {(isSelected || showOrbits) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[moonOrbitDist - 0.015, moonOrbitDist + 0.015, 64]} />
                  <meshBasicMaterial
                    color={isMoonSelected ? '#22D3EE' : '#475569'}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={isSelected ? 0.45 : 0.16}
                    depthWrite={false}
                  />
                </mesh>
              )}

              {/* Moon Mesh Group */}
              <group
                ref={(el) => {
                  moonGroupRefs.current[moon.id] = el;
                }}
              >
                <mesh
                  castShadow
                  receiveShadow
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBody(body.id);
                    onSelectMoon(moon.id);
                  }}
                >
                  <sphereGeometry args={[moonVisualRadius, 20, 20]} />
                  <meshStandardMaterial
                    color={moon.color}
                    roughness={0.8}
                    metalness={0.1}
                    emissive={isMoonSelected ? '#06B6D4' : '#000000'}
                    emissiveIntensity={isMoonSelected ? 0.4 : 0}
                  />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
};
