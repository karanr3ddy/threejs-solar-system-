import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CelestialBodyData, SOLAR_SYSTEM_DATA } from '../data/solarSystemData';
import { CelestialBody3D, ScaleMode } from './CelestialBody3D';
import { IS_SOFTWARE_GL } from '../utils/proceduralTextures';

export type CameraPreset = 'overview' | 'inner' | 'gas' | 'ice' | 'top' | 'lineup' | 'planet';

interface SolarSystemSceneProps {
  selectedBodyId: string;
  selectedMoonId: string | null;
  cameraPreset: CameraPreset;
  scaleMode: ScaleMode;
  simulationSpeed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroids: boolean;
  showAxialTilt: boolean;
  showCutaway: boolean;
  showProbe: boolean;
  onSelectBody: (id: string) => void;
  onSelectMoon: (moonId: string | null) => void;
}

// Pre-allocated vectors at module scope to prevent GC churn inside useFrame
const _desiredTarget = new THREE.Vector3();
const _desiredCamPos = new THREE.Vector3();
const _dummyObj = new THREE.Object3D();
const _dummyColor = new THREE.Color();

/**
 * Sets up procedural studio environment reflections via RoomEnvironment + PMREMGenerator
 */
function StudioEnvironmentSetup() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.fog = new THREE.FogExp2('#07090E', 0.0014);
    pmremGenerator.dispose();

    return () => {
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
}

/**
 * Instanced Starfield & Galactic Plane Dust
 */
function StarfieldInstanced() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = IS_SOFTWARE_GL ? 900 : 2200;

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const spectralPalette = ['#93C5FD', '#E0F2FE', '#F8FAFC', '#FEF9C3', '#FDE68A', '#FDBA74'];

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 210 + Math.random() * 190;

      _dummyObj.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * (Math.random() < 0.45 ? 0.35 : 1.0),
        r * Math.sin(phi) * Math.sin(theta)
      );
      const s = 0.18 + Math.random() * 0.48;
      _dummyObj.scale.setScalar(s);
      _dummyObj.updateMatrix();
      mesh.setMatrixAt(i, _dummyObj.matrix);

      _dummyColor.set(spectralPalette[i % spectralPalette.length]);
      mesh.setColorAt(i, _dummyColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/**
 * Instanced Main Asteroid Belt (Mars–Jupiter) & Kuiper Belt (Beyond Neptune)
 */
function AsteroidBeltsInstanced({
  visible,
  scaleMode,
  isPaused,
  simulationSpeed,
}: {
  visible: boolean;
  scaleMode: ScaleMode;
  isPaused: boolean;
  simulationSpeed: number;
}) {
  const mainBeltRef = useRef<THREE.InstancedMesh>(null);
  const kuiperBeltRef = useRef<THREE.InstancedMesh>(null);

  const mainCount = IS_SOFTWARE_GL ? 350 : 900;
  const kuiperCount = IS_SOFTWARE_GL ? 250 : 600;

  useEffect(() => {
    const mainMesh = mainBeltRef.current;
    if (mainMesh) {
      for (let i = 0; i < mainCount; i++) {
        const angle = (i / mainCount) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 36.8 + Math.random() * 4.8;
        const yOffset = (Math.random() - 0.5) * 2.2;

        _dummyObj.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
        _dummyObj.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        const s = 0.08 + Math.random() * 0.22;
        _dummyObj.scale.set(s * (0.85 + Math.random() * 0.3), s, s * (0.85 + Math.random() * 0.3));
        _dummyObj.updateMatrix();
        mainMesh.setMatrixAt(i, _dummyObj.matrix);

        const shade = 0.42 + Math.random() * 0.28;
        _dummyColor.setRGB(shade, shade * 0.95, shade * 0.88);
        mainMesh.setColorAt(i, _dummyColor);
      }
      mainMesh.instanceMatrix.needsUpdate = true;
      if (mainMesh.instanceColor) mainMesh.instanceColor.needsUpdate = true;
      mainMesh.computeBoundingSphere();
    }

    const kuiperMesh = kuiperBeltRef.current;
    if (kuiperMesh) {
      for (let i = 0; i < kuiperCount; i++) {
        const angle = (i / kuiperCount) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 97.0 + Math.random() * 14.0;
        const yOffset = (Math.random() - 0.5) * 4.8;

        _dummyObj.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
        _dummyObj.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        const s = 0.1 + Math.random() * 0.26;
        _dummyObj.scale.setScalar(s);
        _dummyObj.updateMatrix();
        kuiperMesh.setMatrixAt(i, _dummyObj.matrix);

        const iceShade = 0.5 + Math.random() * 0.3;
        _dummyColor.setRGB(iceShade * 0.85, iceShade * 0.95, iceShade);
        kuiperMesh.setColorAt(i, _dummyColor);
      }
      kuiperMesh.instanceMatrix.needsUpdate = true;
      if (kuiperMesh.instanceColor) kuiperMesh.instanceColor.needsUpdate = true;
      kuiperMesh.computeBoundingSphere();
    }
  }, [mainCount, kuiperCount]);

  useFrame((_, delta) => {
    if (isPaused || !visible || scaleMode === 'lineup') return;
    const dt = Math.min(delta, 0.1);
    const speed = Math.min(8, Math.max(0.2, simulationSpeed));
    if (mainBeltRef.current) {
      mainBeltRef.current.rotation.y += 0.018 * speed * dt;
    }
    if (kuiperBeltRef.current) {
      kuiperBeltRef.current.rotation.y += 0.005 * speed * dt;
    }
  });

  if (!visible || scaleMode === 'lineup') return null;

  return (
    <group>
      <instancedMesh ref={mainBeltRef} args={[undefined, undefined, mainCount]} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.85} metalness={0.15} />
      </instancedMesh>
      <instancedMesh ref={kuiperBeltRef} args={[undefined, undefined, kuiperCount]} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.65} metalness={0.25} />
      </instancedMesh>
    </group>
  );
}

/**
 * Smooth exponential camera controller tracking either a selected planet or a global camera preset
 */
function CameraRigController({
  selectedBody,
  cameraPreset,
  scaleMode,
  bodyPositionRef,
}: {
  selectedBody: CelestialBodyData;
  cameraPreset: CameraPreset;
  scaleMode: ScaleMode;
  bodyPositionRef: React.MutableRefObject<Record<string, THREE.Vector3>>;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const isTransitioningPosRef = useRef<boolean>(true);
  const prevTargetKeyRef = useRef<string>('');

  const targetKey = `${selectedBody.id}_${cameraPreset}_${scaleMode}`;
  if (prevTargetKeyRef.current !== targetKey) {
    prevTargetKeyRef.current = targetKey;
    isTransitioningPosRef.current = true;
  }

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const controls = controlsRef.current;
    if (!controls) return;

    const bodyWorldPos = bodyPositionRef.current[selectedBody.id];

    if (cameraPreset === 'planet' && bodyWorldPos) {
      _desiredTarget.copy(bodyWorldPos);
      const r =
        scaleMode === 'truescale'
          ? selectedBody.id === 'sun'
            ? 6.8
            : Math.max(0.24, Math.pow(selectedBody.relativeRadiusEarth, 0.62) * 0.72)
          : selectedBody.orreryRadius;

      const offsetDist = Math.max(4.2, r * (selectedBody.rings ? 4.4 : 3.5));
      _desiredCamPos.set(
        bodyWorldPos.x + offsetDist * 0.85,
        bodyWorldPos.y + offsetDist * 0.48,
        bodyWorldPos.z + offsetDist * 0.95
      );
    } else if (cameraPreset === 'lineup' || scaleMode === 'lineup') {
      _desiredTarget.set(42, 0, 0);
      _desiredCamPos.set(42, 16, 62);
    } else if (cameraPreset === 'inner') {
      _desiredTarget.set(0, 0, 0);
      _desiredCamPos.set(0, 26, 44);
    } else if (cameraPreset === 'gas') {
      _desiredTarget.set(0, 0, 0);
      _desiredCamPos.set(0, 46, 82);
    } else if (cameraPreset === 'ice') {
      _desiredTarget.set(0, 0, 0);
      _desiredCamPos.set(0, 68, 128);
    } else if (cameraPreset === 'top') {
      _desiredTarget.set(0, 0, 0);
      _desiredCamPos.set(0, 145, 0.1);
    } else {
      _desiredTarget.set(0, 0, 0);
      _desiredCamPos.set(0, 56, 108);
    }

    const lambda = 6.5;
    controls.target.x = THREE.MathUtils.damp(controls.target.x, _desiredTarget.x, lambda, dt);
    controls.target.y = THREE.MathUtils.damp(controls.target.y, _desiredTarget.y, lambda, dt);
    controls.target.z = THREE.MathUtils.damp(controls.target.z, _desiredTarget.z, lambda, dt);

    if (isTransitioningPosRef.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredCamPos.x, 4.8, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredCamPos.y, 4.8, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredCamPos.z, 4.8, dt);

      if (camera.position.distanceToSquared(_desiredCamPos) < 0.25 && cameraPreset !== 'planet') {
        isTransitioningPosRef.current = false;
      }
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={!IS_SOFTWARE_GL}
      dampingFactor={0.06}
      minDistance={2.2}
      maxDistance={260}
      onStart={() => {
        isTransitioningPosRef.current = false;
      }}
    />
  );
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  selectedBodyId,
  selectedMoonId,
  cameraPreset,
  scaleMode,
  simulationSpeed,
  isPaused,
  showOrbits,
  showLabels,
  showAsteroids,
  showAxialTilt,
  showCutaway,
  showProbe,
  onSelectBody,
  onSelectMoon,
}) => {
  const bodyPositionRef = useRef<Record<string, THREE.Vector3>>({});
  const planetLabelDomRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const moonLabelDomRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedBody = useMemo(
    () => SOLAR_SYSTEM_DATA.find((b) => b.id === selectedBodyId) || SOLAR_SYSTEM_DATA[3],
    [selectedBodyId]
  );

  return (
    <div className="relative w-full h-full bg-[#07090E] select-none overflow-hidden">
      <Canvas
        shadows={!IS_SOFTWARE_GL}
        dpr={IS_SOFTWARE_GL ? 1 : [1, 2]}
        camera={{ position: [0, 56, 108], fov: 45, near: 0.1, far: 800 }}
        gl={{
          antialias: !IS_SOFTWARE_GL,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={['#07090E']} />
        <StudioEnvironmentSetup />

        {/* Balanced 3-Point Heliocentric & Deep Space Lighting Rig */}
        <pointLight
          position={[0, 0, 0]}
          intensity={3.6}
          distance={350}
          decay={0.35}
          color="#FFFBEB"
          castShadow={!IS_SOFTWARE_GL}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />

        <hemisphereLight args={['#38BDF8', '#0F172A', 0.55]} />
        <directionalLight position={[-60, 45, -50]} intensity={0.45} color="#93C5FD" />

        {/* Instanced Deep-Space Starfield */}
        <StarfieldInstanced />

        {/* Instanced Main Asteroid Belt & Kuiper Belt */}
        <AsteroidBeltsInstanced
          visible={showAsteroids}
          scaleMode={scaleMode}
          isPaused={isPaused}
          simulationSpeed={simulationSpeed}
        />

        {/* All Celestial Bodies (Sun, 8 Planets, Pluto & Moons) */}
        {SOLAR_SYSTEM_DATA.map((body) => (
          <CelestialBody3D
            key={body.id}
            body={body}
            selectedBodyId={selectedBodyId}
            selectedMoonId={selectedMoonId}
            scaleMode={scaleMode}
            simulationSpeed={simulationSpeed}
            isPaused={isPaused}
            showOrbits={showOrbits}
            showLabels={showLabels}
            showAxialTilt={showAxialTilt}
            showCutaway={showCutaway}
            showProbe={showProbe}
            onSelectBody={onSelectBody}
            onSelectMoon={onSelectMoon}
            bodyPositionRef={bodyPositionRef}
            planetLabelDomRef={planetLabelDomRef}
            moonLabelDomRef={moonLabelDomRef}
          />
        ))}

        {/* Smooth Camera Tracking & OrbitControls */}
        <CameraRigController
          selectedBody={selectedBody}
          cameraPreset={cameraPreset}
          scaleMode={scaleMode}
          bodyPositionRef={bodyPositionRef}
        />
      </Canvas>

      {/* Screen-Space Projected 3D Labels Layer (Rendered inside the primary React root to avoid sub-root unmount race conditions) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
        {SOLAR_SYSTEM_DATA.map((body) => {
          const isSelected = selectedBodyId === body.id;
          const isSun = body.id === 'sun';
          return (
            <React.Fragment key={body.id}>
              <button
                ref={(el) => {
                  planetLabelDomRef.current[body.id] = el;
                }}
                type="button"
                onClick={() => onSelectBody(body.id)}
                style={{ opacity: 0, transform: 'translate3d(-9999px, -9999px, 0)' }}
                className={`absolute top-0 left-0 flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors duration-150 whitespace-nowrap cursor-pointer will-change-transform ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-400 text-white shadow-lg'
                    : 'bg-[#0B0E17]/85 border-slate-800/90 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: body.primaryColor }}
                />
                <span className="text-xs font-medium tracking-tight">{body.name}</span>
                {!isSun && (
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {body.semiMajorAxisAU.toFixed(2)} AU
                  </span>
                )}
              </button>

              {body.moons.map((moon) => {
                const isMoonSelected = selectedMoonId === moon.id && isSelected;
                return (
                  <button
                    key={moon.id}
                    ref={(el) => {
                      moonLabelDomRef.current[moon.id] = el;
                    }}
                    type="button"
                    onClick={() => {
                      onSelectBody(body.id);
                      onSelectMoon(moon.id);
                    }}
                    style={{ opacity: 0, transform: 'translate3d(-9999px, -9999px, 0)' }}
                    className={`absolute top-0 left-0 px-1.5 py-0.5 text-[10px] font-mono tracking-wide rounded transition-colors whitespace-nowrap cursor-pointer will-change-transform ${
                      isMoonSelected
                        ? 'bg-cyan-400 text-slate-950 font-semibold'
                        : 'bg-slate-950/90 text-slate-300 border border-slate-700/80 hover:border-cyan-400'
                    }`}
                  >
                    {moon.name}
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
