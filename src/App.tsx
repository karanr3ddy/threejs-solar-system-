/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SOLAR_SYSTEM_DATA } from './data/solarSystemData';
import { ScaleMode } from './components/CelestialBody3D';
import { CameraPreset, SolarSystemScene } from './components/SolarSystemScene';
import { ControlOverlay } from './components/ControlOverlay';
import { spaceAudio } from './utils/spaceAudio';

export default function App() {
  const [selectedBodyId, setSelectedBodyId] = useState<string>('earth');
  const [selectedMoonId, setSelectedMoonId] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('orrery');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Visual layer toggles
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showAsteroids, setShowAsteroids] = useState<boolean>(true);
  const [showAxialTilt, setShowAxialTilt] = useState<boolean>(false);
  const [showCutaway, setShowCutaway] = useState<boolean>(false);
  const [showProbe, setShowProbe] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const selectedBody = useMemo(
    () => SOLAR_SYSTEM_DATA.find((b) => b.id === selectedBodyId) || SOLAR_SYSTEM_DATA[3],
    [selectedBodyId]
  );

  const handleSelectBody = useCallback((id: string) => {
    setSelectedBodyId(id);
    setSelectedMoonId(null);
    setCameraPreset('planet');
    setIsInspectorOpen(true);

    const target = SOLAR_SYSTEM_DATA.find((b) => b.id === id);
    if (target) {
      spaceAudio.updatePlanetFrequency(target.harmonicFreqHz);
      spaceAudio.playSelectPing(target.harmonicFreqHz);
    }
  }, []);

  const handleSelectPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    if (preset === 'lineup') {
      setScaleMode('lineup');
    }
  }, []);

  const handleChangeScaleMode = useCallback((mode: ScaleMode) => {
    setScaleMode(mode);
    if (mode === 'lineup') {
      setCameraPreset('lineup');
    } else {
      setCameraPreset((prev) => (prev === 'lineup' ? 'overview' : prev));
    }
  }, []);

  const handleToggleAudio = useCallback(() => {
    setIsAudioMuted((prev) => {
      const nextMuted = !prev;
      spaceAudio.setMuted(nextMuted, selectedBody.harmonicFreqHz);
      return nextMuted;
    });
  }, [selectedBody.harmonicFreqHz]);

  // Keyboard shortcuts (0-9 for Sun..Pluto, Space for pause/resume, C for cutaway, Escape for overview)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        const idx = parseInt(e.key, 10);
        if (SOLAR_SYSTEM_DATA[idx]) {
          handleSelectBody(SOLAR_SYSTEM_DATA[idx].id);
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'c' || e.key === 'C') {
        setShowCutaway((c) => !c);
      } else if (e.key === 'Escape') {
        setCameraPreset('overview');
        setIsInspectorOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSelectBody]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#07090E]">
      {/* Full-Viewport 3D Solar System Canvas */}
      <SolarSystemScene
        selectedBodyId={selectedBodyId}
        selectedMoonId={selectedMoonId}
        cameraPreset={cameraPreset}
        scaleMode={scaleMode}
        simulationSpeed={simulationSpeed}
        isPaused={isPaused}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showAsteroids={showAsteroids}
        showAxialTilt={showAxialTilt}
        showCutaway={showCutaway}
        showProbe={showProbe}
        onSelectBody={handleSelectBody}
        onSelectMoon={setSelectedMoonId}
      />

      {/* Semantic DOM HUD Overlay */}
      <ControlOverlay
        selectedBody={selectedBody}
        selectedMoonId={selectedMoonId}
        cameraPreset={cameraPreset}
        scaleMode={scaleMode}
        simulationSpeed={simulationSpeed}
        isPaused={isPaused}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showAsteroids={showAsteroids}
        showAxialTilt={showAxialTilt}
        showCutaway={showCutaway}
        showProbe={showProbe}
        isAudioMuted={isAudioMuted}
        isInspectorOpen={isInspectorOpen}
        onSelectBody={handleSelectBody}
        onSelectMoon={setSelectedMoonId}
        onSelectPreset={handleSelectPreset}
        onChangeScaleMode={handleChangeScaleMode}
        onChangeSpeed={(spd) => {
          setSimulationSpeed(spd);
          setIsPaused(false);
        }}
        onTogglePause={() => setIsPaused((p) => !p)}
        onToggleOrbits={() => setShowOrbits((o) => !o)}
        onToggleLabels={() => setShowLabels((l) => !l)}
        onToggleAsteroids={() => setShowAsteroids((a) => !a)}
        onToggleAxialTilt={() => setShowAxialTilt((t) => !t)}
        onToggleCutaway={() => {
          setShowCutaway((c) => !c);
          setCameraPreset('planet');
        }}
        onToggleProbe={() => setShowProbe((p) => !p)}
        onToggleAudio={handleToggleAudio}
        onToggleInspector={(open) =>
          setIsInspectorOpen((prev) => (open !== undefined ? open : !prev))
        }
      />
    </main>
  );
}
