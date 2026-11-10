import React, { useState } from 'react';
import {
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  Volume2,
  VolumeX,
  Satellite,
  Eye,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CelestialBodyData, SOLAR_SYSTEM_DATA } from '../data/solarSystemData';
import { ScaleMode } from './CelestialBody3D';
import { CameraPreset } from './SolarSystemScene';

interface ControlOverlayProps {
  selectedBody: CelestialBodyData;
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
  isAudioMuted: boolean;
  isInspectorOpen: boolean;
  onSelectBody: (id: string) => void;
  onSelectMoon: (moonId: string | null) => void;
  onSelectPreset: (preset: CameraPreset) => void;
  onChangeScaleMode: (mode: ScaleMode) => void;
  onChangeSpeed: (speed: number) => void;
  onTogglePause: () => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onToggleAsteroids: () => void;
  onToggleAxialTilt: () => void;
  onToggleCutaway: () => void;
  onToggleProbe: () => void;
  onToggleAudio: () => void;
  onToggleInspector: (open?: boolean) => void;
}

type InspectorTab = 'telemetry' | 'interior' | 'moons' | 'missions';

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  selectedBody,
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
  isAudioMuted,
  isInspectorOpen,
  onSelectBody,
  onSelectMoon,
  onSelectPreset,
  onChangeScaleMode,
  onChangeSpeed,
  onTogglePause,
  onToggleOrbits,
  onToggleLabels,
  onToggleAsteroids,
  onToggleAxialTilt,
  onToggleCutaway,
  onToggleProbe,
  onToggleAudio,
  onToggleInspector,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<InspectorTab>('telemetry');

  const speedOptions = [0.2, 1, 5, 25];

  const handleStepPlanet = (dir: -1 | 1) => {
    const nextIdx =
      (selectedBody.index + dir + SOLAR_SYSTEM_DATA.length) % SOLAR_SYSTEM_DATA.length;
    onSelectBody(SOLAR_SYSTEM_DATA[nextIdx].id);
  };

  const earthRef = SOLAR_SYSTEM_DATA[3];
  const massRatioEarth =
    selectedBody.id === 'sun'
      ? '333,000×'
      : `${(selectedBody.massKg24 / earthRef.massKg24).toFixed(2)}×`;
  const gravityRatioEarth = `${(selectedBody.surfaceGravityMs2 / earthRef.surfaceGravityMs2).toFixed(2)} g`;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between overflow-hidden">
      {/* 1. TOP BAR CONTRACT: Strict 1-row, 3-zone header separated by gap-8 */}
      <header className="pointer-events-auto flex items-center justify-between gap-8 px-6 py-3.5 bg-[#07090E]/92 border-b border-slate-800/80">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            onSelectPreset('overview');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 font-display whitespace-nowrap shrink-0"
        >
          Helios Observatory
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#inner-system"
            onClick={(e) => {
              e.preventDefault();
              onChangeScaleMode('orrery');
              onSelectPreset('inner');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              cameraPreset === 'inner' ? 'text-cyan-400 underline' : ''
            }`}
          >
            Inner System
          </a>
          <a
            href="#gas-giants"
            onClick={(e) => {
              e.preventDefault();
              onChangeScaleMode('orrery');
              onSelectPreset('gas');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              cameraPreset === 'gas' ? 'text-cyan-400 underline' : ''
            }`}
          >
            Gas Giants
          </a>
          <a
            href="#ice-giants"
            onClick={(e) => {
              e.preventDefault();
              onChangeScaleMode('orrery');
              onSelectPreset('ice');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              cameraPreset === 'ice' ? 'text-cyan-400 underline' : ''
            }`}
          >
            Ice Giants
          </a>
          <a
            href="#size-lineup"
            onClick={(e) => {
              e.preventDefault();
              onChangeScaleMode(scaleMode === 'lineup' ? 'orrery' : 'lineup');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              scaleMode === 'lineup' ? 'text-cyan-400 underline' : ''
            }`}
          >
            Scale Lineup
          </a>
          <a
            href="#ecliptic-plane"
            onClick={(e) => {
              e.preventDefault();
              onChangeScaleMode('orrery');
              onSelectPreset('top');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              cameraPreset === 'top' ? 'text-cyan-400 underline' : ''
            }`}
          >
            Ecliptic Map
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              onChangeScaleMode('orrery');
              onSelectPreset('overview');
              onToggleInspector(false);
            }}
            className="px-4 py-2 text-xs font-medium text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Reset Overview
          </button>
        </div>
      </header>

      {/* 2. TOP-LEFT COMPACT ACTIVE TARGET TELEMETRY BAR (Non-occluding) */}
      <div className="pointer-events-none flex items-start justify-between px-6 pt-4">
        <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#0B0E17]/90 border border-slate-800/90">
          <button
            type="button"
            onClick={() => handleStepPlanet(-1)}
            title="Previous Celestial Body"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="min-w-[170px]">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: selectedBody.primaryColor }}
              />
              <span className="text-sm font-bold text-slate-100 font-display tracking-tight">
                {selectedBody.name}
              </span>
              <span className="text-xs text-slate-500" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-mono text-cyan-400 tabular-nums">
                {selectedBody.semiMajorAxisAU.toFixed(2)} AU
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
              <span>{selectedBody.classification}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                R = {selectedBody.meanRadiusKm.toLocaleString()} km
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleStepPlanet(1)}
            title="Next Celestial Body"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-0.5" />

          <button
            type="button"
            onClick={() => onToggleInspector(!isInspectorOpen)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isInspectorOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isInspectorOpen ? 'Hide Telemetry' : 'Inspect World'}
          </button>
        </div>
      </div>

      {/* 3. TOGGLEABLE SCIENTIFIC PLANETARY INSPECTOR DRAWER */}
      {isInspectorOpen && (
        <aside
          aria-label="Planetary Telemetry Inspector"
          className="pointer-events-auto fixed top-20 right-6 z-20 w-[370px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-13rem)] flex flex-col bg-[#0B0E17]/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-800/90 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{selectedBody.classification}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Orbit #{selectedBody.index}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {selectedBody.knownMoonsCount} Moons
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-display tracking-tight mt-0.5">
                {selectedBody.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onToggleInspector(false)}
              title="Close Inspector"
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Section Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1.5 bg-[#07090E] border-b border-slate-800/80">
            {(
              [
                { id: 'telemetry', label: 'Telemetry' },
                { id: 'interior', label: 'Interior' },
                { id: 'moons', label: `Moons (${selectedBody.moons.length})` },
                { id: 'missions', label: 'Missions' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Telemetry Content */}
          <div className="p-5 overflow-y-auto space-y-5 text-sm">
            {activeTab === 'telemetry' && (
              <>
                <p className="text-xs leading-relaxed text-slate-300">
                  {selectedBody.summary}
                </p>

                {/* Primary Calibrated Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#111827] border border-slate-800/90 rounded-lg">
                    <div className="text-[11px] text-slate-400">Mean Radius</div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
                        {selectedBody.meanRadiusKm.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        km
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-0.5 tabular-nums">
                      {selectedBody.relativeRadiusEarth}× Earth
                    </div>
                  </div>

                  <div className="p-3 bg-[#111827] border border-slate-800/90 rounded-lg">
                    <div className="text-[11px] text-slate-400">Surface Gravity</div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
                        {selectedBody.surfaceGravityMs2.toFixed(2)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        m/s²
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-0.5 tabular-nums">
                      {gravityRatioEarth}
                    </div>
                  </div>

                  <div className="p-3 bg-[#111827] border border-slate-800/90 rounded-lg">
                    <div className="text-[11px] text-slate-400">Orbital Velocity</div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
                        {selectedBody.orbitalVelocityKms.toFixed(2)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        km/s
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5 tabular-nums">
                      {selectedBody.orbitalPeriodLabel}
                    </div>
                  </div>

                  <div className="p-3 bg-[#111827] border border-slate-800/90 rounded-lg">
                    <div className="text-[11px] text-slate-400">Mean Temperature</div>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
                        {selectedBody.meanTempK}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        K
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-400 mt-0.5 tabular-nums">
                      {selectedBody.meanTempC > 0
                        ? `+${selectedBody.meanTempC}`
                        : selectedBody.meanTempC}{' '}
                      °C
                    </div>
                  </div>
                </div>

                {/* Secondary Orbital & Physical Parameters Table */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Sidereal Rotation</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {selectedBody.rotationPeriodLabel}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Axial Obliquity (Tilt)</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {selectedBody.axialTiltDeg.toFixed(2)}°
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Orbital Eccentricity</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {selectedBody.eccentricity.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Escape Velocity</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {selectedBody.escapeVelocityKms.toFixed(2)} km/s
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Planetary Mass</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {selectedBody.massKg24} × 10²⁴ kg ({massRatioEarth})
                    </span>
                  </div>
                </div>

                {/* Atmospheric Composition Breakdown */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                  <div className="text-xs font-semibold text-slate-200">
                    Atmospheric Composition
                  </div>
                  {selectedBody.atmosphere.map((gas) => (
                    <div key={gas.formula} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">
                          <span className="font-mono text-cyan-300 mr-1.5">
                            {gas.formula}
                          </span>
                          {gas.name}
                        </span>
                        <span className="font-mono text-slate-300 tabular-nums">
                          {gas.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(4, gas.percentage)}%`,
                            backgroundColor: gas.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'interior' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-[#111827] border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-100">
                      3D Internal Core Cutaway
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Slice open {selectedBody.name} in the 3D viewport
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleCutaway}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showCutaway
                        ? 'bg-cyan-400 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {showCutaway ? 'Cutaway Active' : 'Slice 3D Core'}
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-slate-300">
                  {selectedBody.geologyNote}
                </p>

                <div className="space-y-2.5">
                  {selectedBody.internalLayers.map((layer, idx) => (
                    <div
                      key={layer.name}
                      className="p-3 rounded-lg bg-[#111827] border border-slate-800/90 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-sm shrink-0"
                            style={{ backgroundColor: layer.color }}
                          />
                          <span className="text-xs font-semibold text-slate-100">
                            0{idx + 1}. {layer.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                          {Math.round(layer.radiusRatio * 100)}% R
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 pl-5">
                        {layer.composition}
                      </div>
                      <div className="text-[11px] font-mono text-amber-400 pl-5 tabular-nums">
                        Thermal Regime: {layer.temperatureK}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'moons' && (
              <div className="space-y-3">
                {selectedBody.rings && (
                  <div className="p-3 rounded-lg bg-[#111827] border border-slate-800">
                    <div className="text-xs font-semibold text-slate-100">
                      Planetary Ring System
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono tabular-nums">
                      Radial Span: {(selectedBody.meanRadiusKm * selectedBody.rings.innerRadiusRatio).toLocaleString(undefined, { maximumFractionDigits: 0 })} – {(selectedBody.meanRadiusKm * selectedBody.rings.outerRadiusRatio).toLocaleString(undefined, { maximumFractionDigits: 0 })} km
                    </div>
                  </div>
                )}

                {selectedBody.moons.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-[#111827] border border-slate-800/80 rounded-lg">
                    {selectedBody.name} has no natural planetary moons.
                  </div>
                ) : (
                  selectedBody.moons.map((moon) => {
                    const isMoonSelected = selectedMoonId === moon.id;
                    return (
                      <div
                        key={moon.id}
                        onClick={() =>
                          onSelectMoon(isMoonSelected ? null : moon.id)
                        }
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          isMoonSelected
                            ? 'bg-slate-800/90 border-cyan-400'
                            : 'bg-[#111827] border-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: moon.color }}
                            />
                            <span className="text-xs font-semibold text-slate-100">
                              {moon.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                            R = {moon.radiusKm.toLocaleString()} km
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {moon.description}
                        </p>
                        <div className="mt-2 text-[11px] font-mono text-slate-400 tabular-nums">
                          Orbital Period: {Math.abs(moon.orbitalPeriodDays).toFixed(2)} Days
                          {moon.orbitalPeriodDays < 0 ? ' · Retrograde' : ''}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'missions' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#111827] border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-100">
                      3D Orbital Reconnaissance Probe
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Toggle active spacecraft in planetary orbit
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleProbe}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showProbe
                        ? 'bg-cyan-400 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {showProbe ? 'Probe Active' : 'Deploy Probe'}
                  </button>
                </div>

                {selectedBody.missions.map((mission) => (
                  <div
                    key={mission.name}
                    className="p-3 rounded-lg bg-[#111827] border border-slate-800/90 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100">
                        {mission.name}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                        {mission.year} · {mission.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Agency: {mission.agency}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mission.highlight}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 4. UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
      <div className="pointer-events-none flex flex-col items-center pb-4 px-4">
        <div className="pointer-events-auto flex flex-col items-center w-full max-w-[940px]">
          {/* Collapse / Expand Cinema Mode Toggle Tab */}
          <button
            type="button"
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium text-slate-300 bg-[#0B0E17]/95 border border-b-0 border-slate-800 rounded-t-lg hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hide Controls</span>
              </>
            )}
          </button>

          {/* Main Dock Container */}
          {!isDockCollapsed && (
            <div className="w-full bg-[#0B0E17]/95 border border-slate-800 rounded-xl shadow-2xl p-3 space-y-2.5">
              {/* Row 1: Celestial Body Selector Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SOLAR_SYSTEM_DATA.map((body) => {
                  const active = selectedBody.id === body.id && cameraPreset === 'planet';
                  return (
                    <button
                      key={body.id}
                      type="button"
                      onClick={() => onSelectBody(body.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-slate-800/95 border-cyan-400 text-white shadow-sm'
                          : 'bg-[#111827]/90 border-slate-800/90 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: body.primaryColor }}
                      />
                      <span>{body.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                        {body.id === 'sun' ? '0.0 AU' : `${body.semiMajorAxisAU.toFixed(1)} AU`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Simulation Speed, Scale Mode & Visual Layer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                {/* Time & Speed Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onTogglePause}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-0.5 p-0.5 bg-[#07090E] border border-slate-800 rounded-lg">
                    {speedOptions.map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => onChangeSpeed(spd)}
                        className={`px-2 py-1 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer ${
                          simulationSpeed === spd && !isPaused
                            ? 'bg-slate-800 text-cyan-300 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {spd}×
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scale Mode Segmented Control */}
                <div className="flex items-center gap-0.5 p-0.5 bg-[#07090E] border border-slate-800 rounded-lg">
                  {(
                    [
                      { id: 'orrery', label: 'Orrery Scale' },
                      { id: 'truescale', label: 'Proportional' },
                      { id: 'lineup', label: 'Lineup' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onChangeScaleMode(mode.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scaleMode === mode.id
                          ? 'bg-slate-800 text-cyan-300'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Viewport Layer Toggles */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={onToggleOrbits}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showOrbits
                        ? 'bg-slate-800/90 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Orbits</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleLabels}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showLabels
                        ? 'bg-slate-800/90 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Labels</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleAsteroids}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showAsteroids
                        ? 'bg-slate-800/90 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Asteroids</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleCutaway}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showCutaway
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Core Cutaway</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleProbe}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showProbe
                        ? 'bg-slate-800/90 border-cyan-500/50 text-cyan-300'
                        : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Satellite className="w-3.5 h-3.5" />
                    <span>Probe</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleAudio}
                    title="Keplerian Planetary Harmonic Drone"
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      !isAudioMuted
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isAudioMuted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>Audio</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
