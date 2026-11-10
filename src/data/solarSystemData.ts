export interface MoonData {
  id: string;
  name: string;
  radiusKm: number;
  orbitalRadius: number; // scene units relative to parent planet
  orbitalPeriodDays: number;
  color: string;
  description: string;
}

export interface InternalLayer {
  name: string;
  radiusRatio: number; // 0 to 1
  color: string;
  composition: string;
  temperatureK: string;
}

export interface AtmosphereGas {
  formula: string;
  name: string;
  percentage: number;
  color: string;
}

export interface MissionRecord {
  name: string;
  agency: string;
  year: number;
  status: 'Active' | 'Completed' | 'En Route';
  highlight: string;
}

export type TextureStyle =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export interface CelestialBodyData {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  classification: string;
  region: 'star' | 'inner' | 'gas' | 'ice' | 'dwarf';
  textureStyle: TextureStyle;
  // Visual scene parameters (Orrery Mode)
  orreryRadius: number;
  orreryDistance: number;
  // True relative scale parameters (Earth radius = 1)
  relativeRadiusEarth: number;
  semiMajorAxisAU: number;
  orbitalPeriodDays: number;
  orbitalPeriodLabel: string;
  rotationPeriodHours: number; // negative = retrograde
  rotationPeriodLabel: string;
  orbitalVelocityKms: number;
  axialTiltDeg: number;
  eccentricity: number;
  inclinationDeg: number;
  // Physical metrics
  meanRadiusKm: number;
  massKg24: number; // in 10^24 kg
  surfaceGravityMs2: number;
  escapeVelocityKms: number;
  meanTempK: number;
  meanTempC: number;
  knownMoonsCount: number;
  // Visual colors
  primaryColor: string;
  secondaryColor: string;
  atmosphereColor: string;
  hasAtmosphere: boolean;
  hasClouds?: boolean;
  rings?: {
    innerRadiusRatio: number;
    outerRadiusRatio: number;
    color: string;
    opacity: number;
  };
  // Acoustic frequency for Web Audio synthesizer (Hz)
  harmonicFreqHz: number;
  // Detailed narrative & scientific breakdowns
  summary: string;
  geologyNote: string;
  internalLayers: InternalLayer[];
  atmosphere: AtmosphereGas[];
  moons: MoonData[];
  missions: MissionRecord[];
}

export const SOLAR_SYSTEM_DATA: CelestialBodyData[] = [
  {
    id: 'sun',
    index: 0,
    name: 'The Sun',
    subtitle: 'Sol · G2V Main-Sequence Star',
    classification: 'Yellow Dwarf Star',
    region: 'star',
    textureStyle: 'sun',
    orreryRadius: 5.2,
    orreryDistance: 0,
    relativeRadiusEarth: 109.2,
    semiMajorAxisAU: 0.0,
    orbitalPeriodDays: 0,
    orbitalPeriodLabel: '230 Myr (Galactic)',
    rotationPeriodHours: 609.12,
    rotationPeriodLabel: '25.38 Earth Days',
    orbitalVelocityKms: 220.0,
    axialTiltDeg: 7.25,
    eccentricity: 0.0,
    inclinationDeg: 0.0,
    meanRadiusKm: 696340,
    massKg24: 1988500,
    surfaceGravityMs2: 274.0,
    escapeVelocityKms: 617.7,
    meanTempK: 5778,
    meanTempC: 5505,
    knownMoonsCount: 0,
    primaryColor: '#F59E0B',
    secondaryColor: '#EA580C',
    atmosphereColor: '#FBBF24',
    hasAtmosphere: true,
    harmonicFreqHz: 126.22,
    summary:
      'The gravitational anchor and radiative furnace of the Solar System, containing 99.86% of all known mass in the system. Driven by thermonuclear proton-proton fusion in its core, converting 600 million metric tons of hydrogen into helium every second.',
    geologyNote:
      'Composed of convective plasma cells (granules) spanning 1,000 km across, magnetic flux loops, sunspots, and an outer corona heated to over 1,000,000 K by Alfven waves.',
    internalLayers: [
      {
        name: 'Thermonuclear Core',
        radiusRatio: 0.25,
        color: '#FEF08A',
        composition: 'High-density ionized Hydrogen & Helium plasma (150 g/cm³)',
        temperatureK: '15,700,000 K',
      },
      {
        name: 'Radiative Zone',
        radiusRatio: 0.7,
        color: '#FBBF24',
        composition: 'Photon thermal radiative transfer region',
        temperatureK: '7,000,000 – 2,000,000 K',
      },
      {
        name: 'Convective Zone',
        radiusRatio: 0.96,
        color: '#F97316',
        composition: 'Boiling thermal plasma columns & magnetic dynamo',
        temperatureK: '2,000,000 – 5,800 K',
      },
      {
        name: 'Photosphere & Chromosphere',
        radiusRatio: 1.0,
        color: '#EA580C',
        composition: 'Visible convective granulation & solar flares',
        temperatureK: '5,778 K',
      },
    ],
    atmosphere: [
      { formula: 'H', name: 'Hydrogen', percentage: 73.46, color: '#F59E0B' },
      { formula: 'He', name: 'Helium', percentage: 24.85, color: '#FBBF24' },
      { formula: 'O · C · Fe', name: 'Heavy Elements', percentage: 1.69, color: '#FB923C' },
    ],
    moons: [],
    missions: [
      {
        name: 'Parker Solar Probe',
        agency: 'NASA',
        year: 2018,
        status: 'Active',
        highlight: 'First spacecraft to fly directly through the upper solar corona at 195 km/s.',
      },
      {
        name: 'Solar Orbiter',
        agency: 'ESA / NASA',
        year: 2020,
        status: 'Active',
        highlight: 'High-latitude heliospheric imaging and polar magnetic field mapping.',
      },
      {
        name: 'SOHO',
        agency: 'ESA / NASA',
        year: 1995,
        status: 'Active',
        highlight: 'Continuous real-time coronagraph monitoring at Sun-Earth Lagrange Point L1.',
      },
    ],
  },
  {
    id: 'mercury',
    index: 1,
    name: 'Mercury',
    subtitle: 'I · Innermost Terrestrial Planet',
    classification: 'Terrestrial Planet',
    region: 'inner',
    textureStyle: 'mercury',
    orreryRadius: 0.95,
    orreryDistance: 11.5,
    relativeRadiusEarth: 0.383,
    semiMajorAxisAU: 0.387,
    orbitalPeriodDays: 87.97,
    orbitalPeriodLabel: '87.97 Earth Days',
    rotationPeriodHours: 1407.6,
    rotationPeriodLabel: '58.65 Earth Days',
    orbitalVelocityKms: 47.36,
    axialTiltDeg: 0.03,
    eccentricity: 0.2056,
    inclinationDeg: 7.0,
    meanRadiusKm: 2439.7,
    massKg24: 0.33,
    surfaceGravityMs2: 3.7,
    escapeVelocityKms: 4.25,
    meanTempK: 440,
    meanTempC: 167,
    knownMoonsCount: 0,
    primaryColor: '#94A3B8',
    secondaryColor: '#64748B',
    atmosphereColor: '#CBD5E1',
    hasAtmosphere: false,
    harmonicFreqHz: 141.27,
    summary:
      'Locked in a 3:2 spin-orbit resonance with the Sun, Mercury experiences the most extreme diurnal surface temperature swings in the Solar System (-180 °C at night to +430 °C at perihelion noon).',
    geologyNote:
      'Dominated by an enormous iron-nickel core occupying 85% of the planet’s radius, surrounded by a thin silicate mantle scarred by lobate scarps formed as the interior cooled and contracted.',
    internalLayers: [
      {
        name: 'Solid Inner Core',
        radiusRatio: 0.42,
        color: '#E2E8F0',
        composition: 'Crystalline Iron-Nickel alloy',
        temperatureK: '2,200 K',
      },
      {
        name: 'Molten Outer Core',
        radiusRatio: 0.83,
        color: '#94A3B8',
        composition: 'Liquid Iron-Sulfide dynamo layer',
        temperatureK: '1,850 K',
      },
      {
        name: 'Silicate Mantle',
        radiusRatio: 0.96,
        color: '#64748B',
        composition: 'Magnesium-rich silicate rock',
        temperatureK: '1,100 K',
      },
      {
        name: 'Cratered Crust',
        radiusRatio: 1.0,
        color: '#475569',
        composition: 'Anorthositic & basaltic regolith',
        temperatureK: '100 – 700 K',
      },
    ],
    atmosphere: [
      { formula: 'O₂', name: 'Oxygen (Exosphere)', percentage: 42.0, color: '#38BDF8' },
      { formula: 'Na', name: 'Sodium Vapor', percentage: 29.0, color: '#FBBF24' },
      { formula: 'H₂ · He', name: 'Solar Wind Ions', percentage: 29.0, color: '#94A3B8' },
    ],
    moons: [],
    missions: [
      {
        name: 'BepiColombo',
        agency: 'ESA / JAXA',
        year: 2018,
        status: 'En Route',
        highlight: 'Dual-orbiter mission studying Mercury’s magnetosphere and internal core structure.',
      },
      {
        name: 'MESSENGER',
        agency: 'NASA',
        year: 2004,
        status: 'Completed',
        highlight: 'Confirmed water ice deposits inside permanently shadowed polar craters.',
      },
    ],
  },
  {
    id: 'venus',
    index: 2,
    name: 'Venus',
    subtitle: 'II · Super-Greenhouse Terrestrial World',
    classification: 'Terrestrial Planet',
    region: 'inner',
    textureStyle: 'venus',
    orreryRadius: 1.45,
    orreryDistance: 17.5,
    relativeRadiusEarth: 0.949,
    semiMajorAxisAU: 0.723,
    orbitalPeriodDays: 224.7,
    orbitalPeriodLabel: '224.70 Earth Days',
    rotationPeriodHours: -5832.5,
    rotationPeriodLabel: '243.02 Days (Retrograde)',
    orbitalVelocityKms: 35.02,
    axialTiltDeg: 177.36,
    eccentricity: 0.0067,
    inclinationDeg: 3.39,
    meanRadiusKm: 6051.8,
    massKg24: 4.87,
    surfaceGravityMs2: 8.87,
    escapeVelocityKms: 10.36,
    meanTempK: 737,
    meanTempC: 464,
    knownMoonsCount: 0,
    primaryColor: '#EAB308',
    secondaryColor: '#CA8A04',
    atmosphereColor: '#FDE047',
    hasAtmosphere: true,
    hasClouds: true,
    harmonicFreqHz: 221.23,
    summary:
      'Often called Earth’s twin in mass and diameter, Venus is shrouded beneath an opaque deck of sulfuric acid clouds and a supercritical CO₂ atmosphere at 92 bar surface pressure—equivalent to 900 meters underwater on Earth.',
    geologyNote:
      'Features over 1,600 major volcanic structures, coronae, and tesserae highland plateaus (Ishtar and Aphrodite Terra), with radar evidence of active basaltic volcanism.',
    internalLayers: [
      {
        name: 'Metallic Core',
        radiusRatio: 0.52,
        color: '#FDE047',
        composition: 'Liquid & solid Iron-Nickel core',
        temperatureK: '5,100 K',
      },
      {
        name: 'Rocky Silicate Mantle',
        radiusRatio: 0.95,
        color: '#D97706',
        composition: 'Convective peridotite & silicate rock',
        temperatureK: '2,800 K',
      },
      {
        name: 'Basaltic Crust',
        radiusRatio: 1.0,
        color: '#A16207',
        composition: 'Volcanic plains & deformed tesserae',
        temperatureK: '737 K',
      },
    ],
    atmosphere: [
      { formula: 'CO₂', name: 'Carbon Dioxide', percentage: 96.5, color: '#F59E0B' },
      { formula: 'N₂', name: 'Nitrogen', percentage: 3.5, color: '#94A3B8' },
      { formula: 'SO₂', name: 'Sulfur Dioxide Clouds', percentage: 0.015, color: '#FDE047' },
    ],
    moons: [],
    missions: [
      {
        name: 'Akatsuki',
        agency: 'JAXA',
        year: 2010,
        status: 'Active',
        highlight: 'Discovered stationary planetary-scale gravity waves in Venusian cloud tops.',
      },
      {
        name: 'Magellan',
        agency: 'NASA',
        year: 1989,
        status: 'Completed',
        highlight: 'Mapped 98% of the surface through dense clouds using Synthetic Aperture Radar.',
      },
      {
        name: 'Venera 13',
        agency: 'Soviet Space Program',
        year: 1981,
        status: 'Completed',
        highlight: 'Survived 127 minutes on the 457 °C surface and transmitted color panoramas.',
      },
    ],
  },
  {
    id: 'earth',
    index: 3,
    name: 'Earth',
    subtitle: 'III · Ocean-Bearing Biosphere World',
    classification: 'Terrestrial Planet',
    region: 'inner',
    textureStyle: 'earth',
    orreryRadius: 1.6,
    orreryDistance: 24.5,
    relativeRadiusEarth: 1.0,
    semiMajorAxisAU: 1.0,
    orbitalPeriodDays: 365.256,
    orbitalPeriodLabel: '365.26 Days (1.00 yr)',
    rotationPeriodHours: 23.934,
    rotationPeriodLabel: '23h 56m 04s',
    orbitalVelocityKms: 29.78,
    axialTiltDeg: 23.44,
    eccentricity: 0.0167,
    inclinationDeg: 0.0,
    meanRadiusKm: 6371.0,
    massKg24: 5.97,
    surfaceGravityMs2: 9.807,
    escapeVelocityKms: 11.186,
    meanTempK: 288,
    meanTempC: 15,
    knownMoonsCount: 1,
    primaryColor: '#0EA5E9',
    secondaryColor: '#10B981',
    atmosphereColor: '#38BDF8',
    hasAtmosphere: true,
    hasClouds: true,
    harmonicFreqHz: 136.1,
    summary:
      'The largest and densest of the inner rocky planets, uniquely characterized by liquid hydrosphere oceans covering 71% of its surface, active plate tectonics, a protective dipolar magnetosphere, and a nitrogen-oxygen biosphere.',
    geologyNote:
      'Active lithospheric plates continuously recycle oceanic and continental crust over a ductile asthenosphere, stabilized in axial obliquity by its unusually large natural satellite, Luna.',
    internalLayers: [
      {
        name: 'Solid Inner Core',
        radiusRatio: 0.19,
        color: '#FEF08A',
        composition: 'Crystalline Iron-Nickel sphere',
        temperatureK: '5,700 K',
      },
      {
        name: 'Liquid Outer Core',
        radiusRatio: 0.54,
        color: '#F97316',
        composition: 'Convecting molten Iron-Nickel geodynamo',
        temperatureK: '4,400 – 5,500 K',
      },
      {
        name: 'Silicate Mantle',
        radiusRatio: 0.98,
        color: '#DC2626',
        composition: 'Bridgmanite & olivine silicate rock',
        temperatureK: '1,300 – 3,700 K',
      },
      {
        name: 'Oceanic & Continental Crust',
        radiusRatio: 1.0,
        color: '#0284C7',
        composition: 'Granitic continents & basaltic ocean basins',
        temperatureK: '288 K',
      },
    ],
    atmosphere: [
      { formula: 'N₂', name: 'Nitrogen', percentage: 78.08, color: '#38BDF8' },
      { formula: 'O₂', name: 'Oxygen', percentage: 20.95, color: '#10B981' },
      { formula: 'Ar · CO₂', name: 'Argon & Trace Gases', percentage: 0.97, color: '#94A3B8' },
    ],
    moons: [
      {
        id: 'moon',
        name: 'Luna (The Moon)',
        radiusKm: 1737.4,
        orbitalRadius: 3.1,
        orbitalPeriodDays: 27.32,
        color: '#CBD5E1',
        description: 'Tidally locked synchronous satellite formed 4.5 billion years ago from a giant proto-planetary impact.',
      },
    ],
    missions: [
      {
        name: 'International Space Station',
        agency: 'NASA / ESA / JAXA / Roscosmos / CSA',
        year: 1998,
        status: 'Active',
        highlight: 'Continuously inhabited low-Earth orbit research laboratory at 408 km altitude.',
      },
      {
        name: 'Sentinel / Copernicus Fleet',
        agency: 'ESA',
        year: 2014,
        status: 'Active',
        highlight: 'Multi-spectral global biosphere, ocean altimetry, and atmospheric carbon telemetry.',
      },
    ],
  },
  {
    id: 'mars',
    index: 4,
    name: 'Mars',
    subtitle: 'IV · The Red Arid Terrestrial World',
    classification: 'Terrestrial Planet',
    region: 'inner',
    textureStyle: 'mars',
    orreryRadius: 1.25,
    orreryDistance: 32.0,
    relativeRadiusEarth: 0.532,
    semiMajorAxisAU: 1.524,
    orbitalPeriodDays: 686.98,
    orbitalPeriodLabel: '686.98 Days (1.88 yr)',
    rotationPeriodHours: 24.623,
    rotationPeriodLabel: '24h 37m 22s',
    orbitalVelocityKms: 24.07,
    axialTiltDeg: 25.19,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    meanRadiusKm: 3389.5,
    massKg24: 0.642,
    surfaceGravityMs2: 3.721,
    escapeVelocityKms: 5.027,
    meanTempK: 210,
    meanTempC: -63,
    knownMoonsCount: 2,
    primaryColor: '#EA580C',
    secondaryColor: '#9A3412',
    atmosphereColor: '#FDBA74',
    hasAtmosphere: true,
    harmonicFreqHz: 144.72,
    summary:
      'Colored by iron(III) oxide dust across its surface, Mars hosts the largest volcano in the Solar System (Olympus Mons, 21.9 km high) and the Valles Marineris canyon system stretching over 4,000 km.',
    geologyNote:
      'Ancient valley networks, deltaic sedimentary fans in Jezero Crater, and hydrated clay minerals prove that liquid water once flowed across early Noachian Mars.',
    internalLayers: [
      {
        name: 'Liquid Iron-Nickel-Sulfur Core',
        radiusRatio: 0.54,
        color: '#FDBA74',
        composition: 'Molten Iron alloy enriched with sulfur & oxygen',
        temperatureK: '2,100 K',
      },
      {
        name: 'Silicate Mantle',
        radiusRatio: 0.96,
        color: '#C2410C',
        composition: 'Dormant silicate mantle lithosphere',
        temperatureK: '1,500 K',
      },
      {
        name: 'Iron-Oxide Regolith Crust',
        radiusRatio: 1.0,
        color: '#9A3412',
        composition: 'Basaltic rock & hematite dust layer (40–70 km thick)',
        temperatureK: '210 K',
      },
    ],
    atmosphere: [
      { formula: 'CO₂', name: 'Carbon Dioxide', percentage: 95.32, color: '#EA580C' },
      { formula: 'N₂', name: 'Nitrogen', percentage: 2.7, color: '#38BDF8' },
      { formula: 'Ar', name: 'Argon', percentage: 1.6, color: '#94A3B8' },
    ],
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        radiusKm: 11.27,
        orbitalRadius: 2.1,
        orbitalPeriodDays: 0.318,
        color: '#A8A29E',
        description: 'Innermost irregular moon orbiting closer to its primary than any other planetary moon (6,000 km altitude).',
      },
      {
        id: 'deimos',
        name: 'Deimos',
        radiusKm: 6.2,
        orbitalRadius: 2.8,
        orbitalPeriodDays: 1.263,
        color: '#D6D3D1',
        description: 'Outer captured asteroid-like moon in a near-circular equatorial orbit.',
      },
    ],
    missions: [
      {
        name: 'Perseverance & Ingenuity',
        agency: 'NASA',
        year: 2020,
        status: 'Active',
        highlight: 'Caching astrobiological rock cores in Jezero Crater and achieved first powered flight on another planet.',
      },
      {
        name: 'InSight Lander',
        agency: 'NASA',
        year: 2018,
        status: 'Completed',
        highlight: 'Measured over 1,300 marsquakes, directly constraining the radius of Mars’s liquid core.',
      },
    ],
  },
  {
    id: 'jupiter',
    index: 5,
    name: 'Jupiter',
    subtitle: 'V · Jovian Gas Giant Behemoth',
    classification: 'Gas Giant',
    region: 'gas',
    textureStyle: 'jupiter',
    orreryRadius: 3.4,
    orreryDistance: 46.0,
    relativeRadiusEarth: 10.97,
    semiMajorAxisAU: 5.204,
    orbitalPeriodDays: 4332.59,
    orbitalPeriodLabel: '11.86 Earth Years',
    rotationPeriodHours: 9.925,
    rotationPeriodLabel: '9h 55m 30s',
    orbitalVelocityKms: 13.07,
    axialTiltDeg: 3.13,
    eccentricity: 0.0489,
    inclinationDeg: 1.304,
    meanRadiusKm: 69911,
    massKg24: 1898.19,
    surfaceGravityMs2: 24.79,
    escapeVelocityKms: 59.5,
    meanTempK: 165,
    meanTempC: -108,
    knownMoonsCount: 95,
    primaryColor: '#D97706',
    secondaryColor: '#92400E',
    atmosphereColor: '#FDE68A',
    hasAtmosphere: true,
    rings: {
      innerRadiusRatio: 1.28,
      outerRadiusRatio: 1.65,
      color: '#A8A29E',
      opacity: 0.14,
    },
    harmonicFreqHz: 183.58,
    summary:
      'More than twice as massive as all other Solar System planets combined, Jupiter rotates in under 10 hours, generating powerful jet streams, counter-rotating ammonia cloud belts, and the centuries-old Great Red Spot anticyclone.',
    geologyNote:
      'Lacks a solid surface; atmospheric hydrogen compresses continuously into a supercritical fluid and then liquid metallic hydrogen, generating the strongest planetary magnetosphere in the system.',
    internalLayers: [
      {
        name: 'Dilute Fuzzy Core',
        radiusRatio: 0.25,
        color: '#FEF08A',
        composition: 'Heavy elements & rock dissolved in metallic hydrogen',
        temperatureK: '24,000 K',
      },
      {
        name: 'Liquid Metallic Hydrogen',
        radiusRatio: 0.78,
        color: '#F59E0B',
        composition: 'Degenerate electro-conductive proton-electron fluid',
        temperatureK: '10,000 – 20,000 K',
      },
      {
        name: 'Molecular Hydrogen Envelope',
        radiusRatio: 0.97,
        color: '#B45309',
        composition: 'Supercritical H₂ & He fluid continuum',
        temperatureK: '1,000 – 10,000 K',
      },
      {
        name: 'Ammonia Cloud Deck',
        radiusRatio: 1.0,
        color: '#D97706',
        composition: 'Zonal belts, zones, and Great Red Spot vortices',
        temperatureK: '165 K',
      },
    ],
    atmosphere: [
      { formula: 'H₂', name: 'Molecular Hydrogen', percentage: 89.8, color: '#F59E0B' },
      { formula: 'He', name: 'Helium', percentage: 10.2, color: '#FBBF24' },
      { formula: 'NH₃ · CH₄', name: 'Ammonia & Methane', percentage: 0.3, color: '#38BDF8' },
    ],
    moons: [
      {
        id: 'io',
        name: 'Io',
        radiusKm: 1821.6,
        orbitalRadius: 4.8,
        orbitalPeriodDays: 1.769,
        color: '#FACC15',
        description: 'Most volcanically active body in the Solar System, driven by Laplace tidal resonance heating.',
      },
      {
        id: 'europa',
        name: 'Europa',
        radiusKm: 1560.8,
        orbitalRadius: 5.9,
        orbitalPeriodDays: 3.551,
        color: '#E0F2FE',
        description: 'Smooth water-ice shell concealing a global subsurface saltwater ocean twice the volume of Earth’s oceans.',
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        radiusKm: 2634.1,
        orbitalRadius: 7.2,
        orbitalPeriodDays: 7.155,
        color: '#94A3B8',
        description: 'Largest moon in the Solar System (larger than Mercury) and the only moon with an intrinsic magnetosphere.',
      },
      {
        id: 'callisto',
        name: 'Callisto',
        radiusKm: 2410.3,
        orbitalRadius: 8.6,
        orbitalPeriodDays: 16.689,
        color: '#64748B',
        description: 'Ancient, heavily cratered ice-rock world outside Jupiter’s main radiation belt.',
      },
    ],
    missions: [
      {
        name: 'Juno Orbiter',
        agency: 'NASA',
        year: 2011,
        status: 'Active',
        highlight: 'Polar orbit gravity and microwave radiometry revealed Jupiter’s dilute core and polar cyclone polygons.',
      },
      {
        name: 'JUICE & Europa Clipper',
        agency: 'ESA / NASA',
        year: 2023,
        status: 'En Route',
        highlight: 'Dedicated flagship missions targeting the habitable subsurface oceans of Europa, Ganymede, and Callisto.',
      },
    ],
  },
  {
    id: 'saturn',
    index: 6,
    name: 'Saturn',
    subtitle: 'VI · Ringed Gas Giant Jewel',
    classification: 'Gas Giant',
    region: 'gas',
    textureStyle: 'saturn',
    orreryRadius: 2.9,
    orreryDistance: 62.0,
    relativeRadiusEarth: 9.14,
    semiMajorAxisAU: 9.582,
    orbitalPeriodDays: 10759.22,
    orbitalPeriodLabel: '29.45 Earth Years',
    rotationPeriodHours: 10.7,
    rotationPeriodLabel: '10h 42m 00s',
    orbitalVelocityKms: 9.68,
    axialTiltDeg: 26.73,
    eccentricity: 0.0565,
    inclinationDeg: 2.485,
    meanRadiusKm: 58232,
    massKg24: 568.34,
    surfaceGravityMs2: 10.44,
    escapeVelocityKms: 35.5,
    meanTempK: 134,
    meanTempC: -139,
    knownMoonsCount: 146,
    primaryColor: '#EAB308',
    secondaryColor: '#CA8A04',
    atmosphereColor: '#FEF08A',
    hasAtmosphere: true,
    rings: {
      innerRadiusRatio: 1.35,
      outerRadiusRatio: 2.45,
      color: '#E7E5E4',
      opacity: 0.88,
    },
    harmonicFreqHz: 147.85,
    summary:
      'Adorned by the most extensive and bright ring system in the Solar System—spanning 282,000 km across yet averaging only 10 meters thick—composed of 99.9% pure water-ice particles sculpted by shepherd moons.',
    geologyNote:
      'Saturn has a mean density of 0.687 g/cm³ (lower than liquid water), features a persistent 30,000 km hexagonal jet stream at its north pole, and radiates 2.3 times more energy than it receives from the Sun via helium rain.',
    internalLayers: [
      {
        name: 'Rocky-Icy Core',
        radiusRatio: 0.22,
        color: '#FEF08A',
        composition: 'Silicate rock & water-ice core (15–20 Earth masses)',
        temperatureK: '11,700 K',
      },
      {
        name: 'Metallic Hydrogen & Helium Rain',
        radiusRatio: 0.62,
        color: '#F59E0B',
        composition: 'Liquid metallic hydrogen with condensing helium droplets',
        temperatureK: '6,000 – 10,000 K',
      },
      {
        name: 'Molecular Hydrogen Envelope',
        radiusRatio: 0.97,
        color: '#CA8A04',
        composition: 'Liquid and gaseous H₂ & He interior',
        temperatureK: '500 – 6,000 K',
      },
      {
        name: 'Upper Ammonia Haze',
        radiusRatio: 1.0,
        color: '#FDE047',
        composition: 'Banded golden clouds & North Polar Hexagon',
        temperatureK: '134 K',
      },
    ],
    atmosphere: [
      { formula: 'H₂', name: 'Molecular Hydrogen', percentage: 96.3, color: '#EAB308' },
      { formula: 'He', name: 'Helium', percentage: 3.25, color: '#FACC15' },
      { formula: 'CH₄ · NH₃', name: 'Methane & Ammonia', percentage: 0.45, color: '#38BDF8' },
    ],
    moons: [
      {
        id: 'titan',
        name: 'Titan',
        radiusKm: 2574.7,
        orbitalRadius: 7.4,
        orbitalPeriodDays: 15.945,
        color: '#F59E0B',
        description: 'Only moon with a dense nitrogen atmosphere (1.45 bar) and liquid methane/ethane lakes and rivers.',
      },
      {
        id: 'enceladus',
        name: 'Enceladus',
        radiusKm: 252.1,
        orbitalRadius: 4.9,
        orbitalPeriodDays: 1.37,
        color: '#F8FAFC',
        description: 'Ejects cryo-volcanic plumes of water vapor, molecular hydrogen, and organic salts from south polar Tiger Stripes.',
      },
      {
        id: 'rhea',
        name: 'Rhea',
        radiusKm: 763.8,
        orbitalRadius: 6.0,
        orbitalPeriodDays: 4.518,
        color: '#CBD5E1',
        description: 'Second-largest Kronian moon with high-albedo ice cliffs and cratered plains.',
      },
    ],
    missions: [
      {
        name: 'Cassini-Huygens',
        agency: 'NASA / ESA / ASI',
        year: 1997,
        status: 'Completed',
        highlight: '13-year orbital tour of Saturn, landed Huygens on Titan, and sampled Enceladus’s geyser plumes.',
      },
      {
        name: 'Dragonfly Rotorcraft',
        agency: 'NASA',
        year: 2028,
        status: 'En Route',
        highlight: 'Nuclear-powered octocopter lander designed to fly across Titan’s organic dunes.',
      },
    ],
  },
  {
    id: 'uranus',
    index: 7,
    name: 'Uranus',
    subtitle: 'VII · Sideways-Spinning Ice Giant',
    classification: 'Ice Giant',
    region: 'ice',
    textureStyle: 'uranus',
    orreryRadius: 2.25,
    orreryDistance: 78.0,
    relativeRadiusEarth: 3.98,
    semiMajorAxisAU: 19.218,
    orbitalPeriodDays: 30688.5,
    orbitalPeriodLabel: '84.02 Earth Years',
    rotationPeriodHours: -17.24,
    rotationPeriodLabel: '17h 14m (Retrograde)',
    orbitalVelocityKms: 6.8,
    axialTiltDeg: 97.77,
    eccentricity: 0.0472,
    inclinationDeg: 0.773,
    meanRadiusKm: 25362,
    massKg24: 86.81,
    surfaceGravityMs2: 8.69,
    escapeVelocityKms: 21.3,
    meanTempK: 76,
    meanTempC: -197,
    knownMoonsCount: 28,
    primaryColor: '#22D3EE',
    secondaryColor: '#0891B2',
    atmosphereColor: '#67E8F9',
    hasAtmosphere: true,
    rings: {
      innerRadiusRatio: 1.5,
      outerRadiusRatio: 1.95,
      color: '#67E8F9',
      opacity: 0.35,
    },
    harmonicFreqHz: 207.36,
    summary:
      'Tilted 97.77° onto its side—likely from a cataclysmic proto-planetary collision—Uranus rolls along its orbital path, subjecting each pole to 42 continuous Earth years of sunlight followed by 42 years of winter darkness.',
    geologyNote:
      ' possesses the coldest planetary atmosphere in the Solar System (minimum 49 K) due to minimal internal heat flux, and an off-center magnetosphere tilted 59° from its spin axis.',
    internalLayers: [
      {
        name: 'Silicate-Iron Core',
        radiusRatio: 0.2,
        color: '#94A3B8',
        composition: 'Dense silicate rock and nickel-iron core',
        temperatureK: '5,000 K',
      },
      {
        name: 'Superionic Ice Mantle',
        radiusRatio: 0.8,
        color: '#0891B2',
        composition: 'Hot, dense fluid of Water (H₂O), Ammonia (NH₃) & Methane (CH₄) ices',
        temperatureK: '2,000 – 4,500 K',
      },
      {
        name: 'Hydrogen-Helium-Methane Envelope',
        radiusRatio: 1.0,
        color: '#22D3EE',
        composition: 'Red-light absorbing methane haze giving cyan hue',
        temperatureK: '76 K',
      },
    ],
    atmosphere: [
      { formula: 'H₂', name: 'Molecular Hydrogen', percentage: 82.5, color: '#22D3EE' },
      { formula: 'He', name: 'Helium', percentage: 15.2, color: '#38BDF8' },
      { formula: 'CH₄', name: 'Methane Ice Clouds', percentage: 2.3, color: '#06B6D4' },
    ],
    moons: [
      {
        id: 'miranda',
        name: 'Miranda',
        radiusKm: 235.8,
        orbitalRadius: 3.6,
        orbitalPeriodDays: 1.413,
        color: '#CBD5E1',
        description: 'Features Verona Rupes, a 20-km-high tectonic ice cliff—the tallest known cliff in the Solar System.',
      },
      {
        id: 'titania',
        name: 'Titania',
        radiusKm: 788.4,
        orbitalRadius: 4.8,
        orbitalPeriodDays: 8.706,
        color: '#94A3B8',
        description: 'Largest Uranian moon, scarred by giant fault canyons and cryovolcanic resurfacing.',
      },
      {
        id: 'oberon',
        name: 'Oberon',
        radiusKm: 761.4,
        orbitalRadius: 5.8,
        orbitalPeriodDays: 13.463,
        color: '#64748B',
        description: 'Outermost major Uranian moon with dark carbonaceous crater floor deposits.',
      },
    ],
    missions: [
      {
        name: 'Voyager 2',
        agency: 'NASA',
        year: 1986,
        status: 'Completed',
        highlight: 'Only spacecraft to visit Uranus, discovering 11 new moons and its skewed magnetic field.',
      },
    ],
  },
  {
    id: 'neptune',
    index: 8,
    name: 'Neptune',
    subtitle: 'VIII · Supersonic Azure Ice Giant',
    classification: 'Ice Giant',
    region: 'ice',
    textureStyle: 'neptune',
    orreryRadius: 2.15,
    orreryDistance: 92.0,
    relativeRadiusEarth: 3.86,
    semiMajorAxisAU: 30.07,
    orbitalPeriodDays: 60195.0,
    orbitalPeriodLabel: '164.79 Earth Years',
    rotationPeriodHours: 16.11,
    rotationPeriodLabel: '16h 06m 36s',
    orbitalVelocityKms: 5.43,
    axialTiltDeg: 28.32,
    eccentricity: 0.0086,
    inclinationDeg: 1.77,
    meanRadiusKm: 24622,
    massKg24: 102.41,
    surfaceGravityMs2: 11.15,
    escapeVelocityKms: 23.5,
    meanTempK: 72,
    meanTempC: -201,
    knownMoonsCount: 16,
    primaryColor: '#2563EB',
    secondaryColor: '#1D4ED8',
    atmosphereColor: '#60A5FA',
    hasAtmosphere: true,
    rings: {
      innerRadiusRatio: 1.45,
      outerRadiusRatio: 1.75,
      color: '#60A5FA',
      opacity: 0.2,
    },
    harmonicFreqHz: 211.44,
    summary:
      'The first planet predicted by mathematical orbital perturbation before optical discovery in 1846. Despite orbiting 30 AU from the Sun, internal heat drives supersonic winds reaching 2,100 km/h—the fastest sustained winds in the Solar System.',
    geologyNote:
      'High-pressure experiments indicate that methane inside Neptune’s hot icy mantle dissociates into diamond crystals that rain downward toward the silicate core.',
    internalLayers: [
      {
        name: 'Iron-Nickel-Silicate Core',
        radiusRatio: 0.22,
        color: '#94A3B8',
        composition: 'Dense rocky core (~1.2 Earth masses)',
        temperatureK: '5,400 K',
      },
      {
        name: 'Ionic Water-Ammonia-Diamond Mantle',
        radiusRatio: 0.82,
        color: '#1D4ED8',
        composition: 'Supercritical H₂O, NH₃, and compressed carbon diamond precipitation',
        temperatureK: '2,200 – 5,000 K',
      },
      {
        name: 'Methane-Enriched Atmosphere',
        radiusRatio: 1.0,
        color: '#3B82F6',
        composition: 'Supersonic zonal winds & high-altitude methane ice cirrus clouds',
        temperatureK: '72 K',
      },
    ],
    atmosphere: [
      { formula: 'H₂', name: 'Molecular Hydrogen', percentage: 80.0, color: '#3B82F6' },
      { formula: 'He', name: 'Helium', percentage: 19.0, color: '#60A5FA' },
      { formula: 'CH₄', name: 'Methane Chromophores', percentage: 1.5, color: '#2563EB' },
    ],
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        radiusKm: 1353.4,
        orbitalRadius: 4.3,
        orbitalPeriodDays: -5.877,
        color: '#E2E8F0',
        description: 'Captured Kuiper Belt object in a retrograde orbit with active nitrogen gas geysers and cantaloupe terrain.',
      },
    ],
    missions: [
      {
        name: 'Voyager 2 Flyby',
        agency: 'NASA',
        year: 1989,
        status: 'Completed',
        highlight: 'Imaged the Great Dark Spot and active cryovolcanic nitrogen plumes on Triton.',
      },
    ],
  },
  {
    id: 'pluto',
    index: 9,
    name: 'Pluto',
    subtitle: 'IX · 134340 · Kuiper Belt Binary World',
    classification: 'Dwarf Planet',
    region: 'dwarf',
    textureStyle: 'pluto',
    orreryRadius: 0.85,
    orreryDistance: 105.0,
    relativeRadiusEarth: 0.186,
    semiMajorAxisAU: 39.482,
    orbitalPeriodDays: 90560.0,
    orbitalPeriodLabel: '247.94 Earth Years',
    rotationPeriodHours: -153.29,
    rotationPeriodLabel: '6.39 Days (Retrograde)',
    orbitalVelocityKms: 4.67,
    axialTiltDeg: 122.53,
    eccentricity: 0.2488,
    inclinationDeg: 17.16,
    meanRadiusKm: 1188.3,
    massKg24: 0.013,
    surfaceGravityMs2: 0.62,
    escapeVelocityKms: 1.212,
    meanTempK: 44,
    meanTempC: -229,
    knownMoonsCount: 5,
    primaryColor: '#D6D3D1',
    secondaryColor: '#A8A29E',
    atmosphereColor: '#93C5FD',
    hasAtmosphere: true,
    harmonicFreqHz: 140.25,
    summary:
      'The largest known world of the Kuiper Belt, orbiting in a 3:2 mean-motion resonance with Neptune. Revealed by New Horizons to be geologically active, featuring convecting nitrogen-ice glaciers in Sputnik Planitia and water-ice mountain ranges.',
    geologyNote:
      'Forms a true binary system with its large moon Charon, as their mutual barycenter lies in open space above Pluto’s surface.',
    internalLayers: [
      {
        name: 'Hydrated Silicate Core',
        radiusRatio: 0.7,
        color: '#A8A29E',
        composition: 'Rocky silicate core heated by radiogenic decay',
        temperatureK: '400 K',
      },
      {
        name: 'Subsurface Liquid Water Layer',
        radiusRatio: 0.86,
        color: '#0284C7',
        composition: 'Ammonia-rich briny subsurface ocean',
        temperatureK: '260 K',
      },
      {
        name: 'Water-Ice & Nitrogen Crust',
        radiusRatio: 1.0,
        color: '#E7E5E4',
        composition: 'Bedrock H₂O ice with volatile N₂, CO & CH₄ glaciers',
        temperatureK: '44 K',
      },
    ],
    atmosphere: [
      { formula: 'N₂', name: 'Nitrogen', percentage: 99.0, color: '#93C5FD' },
      { formula: 'CH₄', name: 'Methane', percentage: 0.5, color: '#38BDF8' },
      { formula: 'CO', name: 'Carbon Monoxide', percentage: 0.5, color: '#CBD5E1' },
    ],
    moons: [
      {
        id: 'charon',
        name: 'Charon',
        radiusKm: 606.0,
        orbitalRadius: 2.3,
        orbitalPeriodDays: 6.387,
        color: '#94A3B8',
        description: 'Mutually tidally locked binary companion with half the diameter of Pluto and a reddish tholin polar cap (Mordor Macula).',
      },
    ],
    missions: [
      {
        name: 'New Horizons',
        agency: 'NASA',
        year: 2015,
        status: 'Active',
        highlight: 'Historic 2015 flyby revealed Tombaugh Regio ("The Heart") and layered blue atmospheric photochemical hazes.',
      },
    ],
  },
];
