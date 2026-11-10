import * as THREE from 'three';
import { TextureStyle } from '../data/solarSystemData';

export const IS_SOFTWARE_GL = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

// Deterministic pseudo-random helper for repeatable procedural geological features
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fbmNoise(x: number, y: number, seed: number): number {
  const sin1 = Math.sin(x * 1.7 + y * 1.3 + seed) * Math.cos(x * 1.1 - y * 1.9 + seed);
  const sin2 = Math.sin(x * 3.9 - y * 2.7 + seed * 2) * 0.5;
  const sin3 = Math.cos(x * 8.3 + y * 7.1 - seed * 3) * 0.25;
  const sin4 = Math.sin(x * 16.7 - y * 14.2 + seed * 5) * 0.125;
  return (sin1 + sin2 + sin3 + sin4) * 0.5 + 0.5;
}

export interface PlanetTextureSet {
  albedoMap: THREE.CanvasTexture;
  bumpMap?: THREE.CanvasTexture;
  cloudsMap?: THREE.CanvasTexture;
}

const textureCache = new Map<TextureStyle, PlanetTextureSet>();
const ringTextureCache = new Map<string, THREE.CanvasTexture>();

export function getPlanetTextures(style: TextureStyle): PlanetTextureSet {
  const cached = textureCache.get(style);
  if (cached) return cached;

  const width = IS_SOFTWARE_GL ? 512 : 1024;
  const height = IS_SOFTWARE_GL ? 256 : 512;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  const rand = mulberry32(style.split('').reduce((a, c) => a + c.charCodeAt(0) * 31, 1337));

  if (style === 'sun') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#EA580C');
    grad.addColorStop(0.25, '#F59E0B');
    grad.addColorStop(0.5, '#FEF08A');
    grad.addColorStop(0.75, '#F59E0B');
    grad.addColorStop(1, '#EA580C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Convective granules & solar filaments
    for (let i = 0; i < 1600; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 2 + rand() * 14;
      const bright = rand() > 0.35;
      ctx.fillStyle = bright
        ? `rgba(254, 249, 195, ${0.12 + rand() * 0.25})`
        : `rgba(180, 83, 9, ${0.15 + rand() * 0.25})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Sunspot groups near active latitudes
    for (let i = 0; i < 18; i++) {
      const x = rand() * width;
      const y = height * (0.28 + rand() * 0.44);
      const r = 4 + rand() * 10;
      ctx.fillStyle = 'rgba(67, 20, 7, 0.72)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  } else if (style === 'mercury') {
    ctx.fillStyle = '#64748B';
    ctx.fillRect(0, 0, width, height);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    // Regolith albedo variations
    for (let i = 0; i < 500; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 10 + rand() * 45;
      const shade = Math.floor(85 + rand() * 65);
      ctx.fillStyle = `rgba(${shade}, ${shade + 4}, ${shade + 10}, 0.22)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Impact craters & ejecta rays
    for (let i = 0; i < 320; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 2 + rand() * 22;
      ctx.fillStyle = 'rgba(51, 65, 85, 0.55)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      bCtx.fillStyle = 'rgba(30, 30, 30, 0.7)';
      bCtx.beginPath();
      bCtx.arc(x, y, r * 0.85, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.strokeStyle = 'rgba(235, 235, 235, 0.8)';
      bCtx.lineWidth = 2;
      bCtx.stroke();
    }
  } else if (style === 'venus') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#A16207');
    grad.addColorStop(0.2, '#CA8A04');
    grad.addColorStop(0.5, '#FACC15');
    grad.addColorStop(0.8, '#CA8A04');
    grad.addColorStop(1, '#A16207');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // V-shaped chevron sulfuric cloud bands
    for (let y = 0; y < height; y += 3) {
      const normY = (y / height - 0.5) * 2;
      const alpha = 0.08 + rand() * 0.14;
      ctx.strokeStyle = rand() > 0.5 ? `rgba(254, 240, 138, ${alpha})` : `rgba(146, 64, 14, ${alpha})`;
      ctx.lineWidth = 3 + rand() * 6;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 16) {
        const wave = Math.sin((x / width) * Math.PI * 4 + normY * 3) * 14;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
  } else if (style === 'earth') {
    // Deep ocean bathymetry base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0C4A6E');
    oceanGrad.addColorStop(0.2, '#0369A1');
    oceanGrad.addColorStop(0.5, '#0284C7');
    oceanGrad.addColorStop(0.8, '#0369A1');
    oceanGrad.addColorStop(1, '#0C4A6E');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    bCtx.fillStyle = '#202020';
    bCtx.fillRect(0, 0, width, height);

    // Procedural continental landmasses via multi-octave noise
    const step = 4;
    for (let y = 0; y < height; y += step) {
      const lat = Math.abs(y / height - 0.5) * 2; // 0 at equator, 1 at poles
      for (let x = 0; x < width; x += step) {
        const nx = (x / width) * Math.PI * 2;
        const ny = (y / height) * Math.PI;
        const n = fbmNoise(Math.cos(nx) * 1.6, ny * 2.1 + Math.sin(nx) * 0.8, 42);

        if (lat > 0.86 - n * 0.12) {
          // Polar ice caps
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(x, y, step, step);
          bCtx.fillStyle = '#B0B0B0';
          bCtx.fillRect(x, y, step, step);
        } else if (n > 0.51) {
          // Continental land
          const elev = (n - 0.51) / 0.49;
          if (elev < 0.12) {
            ctx.fillStyle = '#15803D'; // Coastal lowland forest
          } else if (lat < 0.35 && elev < 0.45) {
            ctx.fillStyle = '#D97706'; // Subtropical arid desert belt
          } else if (elev < 0.65) {
            ctx.fillStyle = '#166534'; // Temperate continental forest
          } else {
            ctx.fillStyle = '#78716C'; // Alpine mountain ranges
          }
          ctx.fillRect(x, y, step, step);
          const bumpVal = Math.min(255, Math.floor(110 + elev * 145));
          bCtx.fillStyle = `rgb(${bumpVal},${bumpVal},${bumpVal})`;
          bCtx.fillRect(x, y, step, step);
        }
      }
    }
  } else if (style === 'mars') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#9A3412');
    grad.addColorStop(0.3, '#C2410C');
    grad.addColorStop(0.5, '#EA580C');
    grad.addColorStop(0.7, '#C2410C');
    grad.addColorStop(1, '#7C2D12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    bCtx.fillStyle = '#707070';
    bCtx.fillRect(0, 0, width, height);

    // Dark basaltic albedo regions (Syrtis Major / Acidalia)
    for (let i = 0; i < 180; i++) {
      const x = rand() * width;
      const y = height * (0.15 + rand() * 0.7);
      const r = 14 + rand() * 55;
      ctx.fillStyle =
        rand() > 0.45 ? 'rgba(67, 20, 7, 0.25)' : 'rgba(251, 146, 60, 0.22)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Valles Marineris equatorial canyon scar
    ctx.strokeStyle = 'rgba(41, 13, 4, 0.65)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.52);
    ctx.bezierCurveTo(
      width * 0.44,
      height * 0.54,
      width * 0.55,
      height * 0.51,
      width * 0.64,
      height * 0.53
    );
    ctx.stroke();

    // Craters & Tharsis volcanoes
    for (let i = 0; i < 190; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 3 + rand() * 18;
      ctx.strokeStyle = 'rgba(253, 186, 116, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      bCtx.strokeStyle = 'rgba(220, 220, 220, 0.6)';
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.stroke();
    }

    // North & South CO2 Polar Ice Caps
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, height * 0.055);
    ctx.fillRect(0, height * 0.945, width, height * 0.055);
  } else if (style === 'jupiter') {
    const bandColors = [
      '#78350F',
      '#B45309',
      '#FDE68A',
      '#D97706',
      '#FEF3C7',
      '#92400E',
      '#F59E0B',
      '#FEF3C7',
      '#B45309',
      '#EA580C',
      '#FDE68A',
      '#92400E',
      '#78350F',
    ];
    const bandH = height / bandColors.length;
    bandColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * bandH, width, bandH + 2);
    });

    // Turbulent zonal eddies along belt boundaries
    for (let y = 0; y < height; y += 2) {
      ctx.fillStyle =
        rand() > 0.5
          ? `rgba(254, 243, 199, ${0.06 + rand() * 0.14})`
          : `rgba(120, 53, 15, ${0.06 + rand() * 0.14})`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const wave = Math.sin((x / width) * Math.PI * 8 + y * 0.15) * 4;
        ctx.rect(x, y + wave, 12, 2);
      }
      ctx.fill();
    }

    // Iconic Great Red Spot anticyclone in southern hemisphere
    const grsX = width * 0.62;
    const grsY = height * 0.68;
    ctx.save();
    ctx.translate(grsX, grsY);
    ctx.scale(1.8, 1.0);
    const grsGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
    grsGrad.addColorStop(0, '#EF4444');
    grsGrad.addColorStop(0.55, '#C2410C');
    grsGrad.addColorStop(0.85, '#FDE68A');
    grsGrad.addColorStop(1, 'rgba(253, 230, 138, 0)');
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (style === 'saturn') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#713F12');
    grad.addColorStop(0.15, '#CA8A04');
    grad.addColorStop(0.35, '#FDE047');
    grad.addColorStop(0.5, '#FEF9C3');
    grad.addColorStop(0.65, '#FACC15');
    grad.addColorStop(0.85, '#CA8A04');
    grad.addColorStop(1, '#713F12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle fine butterscotch atmospheric banding
    for (let y = 0; y < height; y += 3) {
      ctx.fillStyle =
        rand() > 0.5
          ? `rgba(254, 249, 195, ${0.05 + rand() * 0.1})`
          : `rgba(161, 98, 7, ${0.05 + rand() * 0.1})`;
      ctx.fillRect(0, y, width, 2);
    }
  } else if (style === 'uranus') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0891B2');
    grad.addColorStop(0.3, '#22D3EE');
    grad.addColorStop(0.5, '#67E8F9');
    grad.addColorStop(0.7, '#22D3EE');
    grad.addColorStop(1, '#0E7490');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y += 4) {
      ctx.fillStyle = `rgba(207, 250, 254, ${0.03 + rand() * 0.06})`;
      ctx.fillRect(0, y, width, 2);
    }
  } else if (style === 'neptune') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#1E3A8A');
    grad.addColorStop(0.25, '#1D4ED8');
    grad.addColorStop(0.5, '#2563EB');
    grad.addColorStop(0.75, '#1D4ED8');
    grad.addColorStop(1, '#1E3A8A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // High-velocity zonal bands & white methane ice cirrus streaks
    for (let i = 0; i < 90; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const w = 30 + rand() * 110;
      ctx.fillStyle =
        rand() > 0.35
          ? 'rgba(147, 197, 253, 0.32)'
          : 'rgba(30, 58, 138, 0.45)';
      ctx.fillRect(x, y, w, 3);
    }

    // Great Dark Spot vortex
    ctx.save();
    ctx.translate(width * 0.42, height * 0.62);
    ctx.scale(1.7, 1.0);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(191, 219, 254, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  } else if (style === 'pluto') {
    ctx.fillStyle = '#A8A29E';
    ctx.fillRect(0, 0, width, height);

    // Dark reddish tholin equatorial band (Cthulhu Macula)
    for (let i = 0; i < 160; i++) {
      const x = rand() * width;
      const y = height * (0.35 + rand() * 0.4);
      const r = 12 + rand() * 45;
      ctx.fillStyle = 'rgba(68, 34, 20, 0.35)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tombaugh Regio ("The Heart" bright nitrogen ice plain)
    ctx.fillStyle = '#F5F5F4';
    ctx.beginPath();
    ctx.arc(width * 0.52, height * 0.48, 42, 0, Math.PI * 2);
    ctx.arc(width * 0.58, height * 0.48, 38, 0, Math.PI * 2);
    ctx.fill();
  }

  const albedoMap = new THREE.CanvasTexture(canvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.ClampToEdgeWrapping;
  albedoMap.anisotropy = 8;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  let cloudsMap: THREE.CanvasTexture | undefined;
  if (style === 'earth' || style === 'venus') {
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = width;
    cloudCanvas.height = height;
    const cCtx = cloudCanvas.getContext('2d')!;
    for (let i = 0; i < 420; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const rx = 18 + rand() * 65;
      const ry = 5 + rand() * 16;
      cCtx.fillStyle =
        style === 'earth'
          ? `rgba(255, 255, 255, ${0.12 + rand() * 0.28})`
          : `rgba(254, 249, 195, ${0.15 + rand() * 0.25})`;
      cCtx.beginPath();
      cCtx.ellipse(x, y, rx, ry, (rand() - 0.5) * 0.4, 0, Math.PI * 2);
      cCtx.fill();
    }
    cloudsMap = new THREE.CanvasTexture(cloudCanvas);
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.wrapS = THREE.RepeatWrapping;
    cloudsMap.wrapT = THREE.ClampToEdgeWrapping;
  }

  const result: PlanetTextureSet = { albedoMap, bumpMap, cloudsMap };
  textureCache.set(style, result);
  return result;
}

export function getRingTexture(planetId: string, baseColor: string): THREE.CanvasTexture {
  const key = `${planetId}_${baseColor}`;
  const cached = ringTextureCache.get(key);
  if (cached) return cached;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const rand = mulberry32(planetId.charCodeAt(0) * 97);

  for (let x = 0; x < size; x++) {
    const t = x / size; // 0 = inner edge, 1 = outer edge
    let alpha = Math.sin(t * Math.PI);

    if (planetId === 'saturn') {
      // Cassini Division gap around t = 0.65 - 0.71 and Encke Gap around 0.88
      if (t > 0.64 && t < 0.71) {
        alpha *= 0.08;
      } else if (t > 0.87 && t < 0.89) {
        alpha *= 0.15;
      } else if (t < 0.22) {
        alpha *= 0.35; // C Ring
      } else {
        alpha *= 0.65 + 0.35 * Math.sin(t * 95) * Math.cos(t * 43);
      }
      const r = Math.floor(215 + 30 * Math.sin(t * 40));
      const g = Math.floor(195 + 25 * Math.sin(t * 40));
      const b = Math.floor(155 + 20 * Math.cos(t * 30));
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
    } else {
      // Narrow rings for Uranus, Neptune, Jupiter
      const ringBand = Math.pow(Math.sin(t * Math.PI * 6), 4);
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = Math.max(0.05, ringBand * alpha);
    }
    ctx.fillRect(x, 0, 1, 64);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  ringTextureCache.set(key, tex);
  return tex;
}
