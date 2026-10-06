import * as THREE from 'three';
import { EnvironmentType } from '../types';
//made with google ai studio
export interface PlanetaryTerrainData {
  locationTitle: string;
  sourceDataset: string;
  gridDimensions: string;
  /** Unverified, hand-set range for the procedural terrain. NOT a measured MOLA/LOLA range. */
  elevationMinMaxMeters: [number, number];
  diffuseMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  displacementScale: number;
  sampleHeight: (x: number, z: number) => number;
  sampleNormal: (x: number, z: number) => THREE.Vector3;
}


function generateProceduralDiffuseMap(missionId: string, envType: EnvironmentType): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const isMoon = envType === 'moon';
  const isAres = missionId === 'sojourner';
  const isGusev = missionId === 'spirit';
  const isMeridiani = missionId === 'opportunity';

  // Base planetary ground tone
  let baseRGB: [number, number, number] = [170, 80, 42]; // Mars rust
  if (isMoon) baseRGB = [135, 142, 150]; // Lunar highland / mare gray
  if (isMeridiani) baseRGB = [156, 72, 34]; // Hematite-rich sulfate sand
  if (isGusev) baseRGB = [142, 65, 30]; // Darker olivine basaltic dust
  if (isAres) baseRGB = [180, 95, 48]; // Floodplain weathered silica

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Generate medium-scale natural planetary regolith texture with soft ripples and mineral variation
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Medium-frequency wind-blown sand dunes / ripple waves
      const ripple = Math.sin(x * 0.04 + Math.cos(y * 0.025) * 1.8) * 0.09;

      // Medium-scale rock and regolith shading
      const patch = Math.sin(x * 0.012) * Math.cos(y * 0.012) * 0.12;

      // Subtle fine regolith texture (medium, not harsh speckle)
      const fineRegolith = ((x ^ y) % 7 - 3) * 0.012 + (Math.sin(x * 0.2) * Math.sin(y * 0.2)) * 0.025;

      const factor = 1.0 + ripple + patch + fineRegolith;

      let r = Math.min(255, Math.max(0, Math.round(baseRGB[0] * factor)));
      let g = Math.min(255, Math.max(0, Math.round(baseRGB[1] * factor)));
      let b = Math.min(255, Math.max(0, Math.round(baseRGB[2] * factor)));

      // Add "blueberries" (gray-blue spherical hematite concretions) for Opportunity
      if (isMeridiani && Math.random() < 0.002) {
        r = 75 + Math.round(Math.random() * 15);
        g = 85 + Math.round(Math.random() * 20);
        b = 110 + Math.round(Math.random() * 25);
      }

      // Add green volcanic glass bead specks for Apollo 15
      if (isMoon && Math.random() < 0.0015) {
        r = 70;
        g = 135;
        b = 90;
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8); // Medium textured scale across terrain
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function generateProceduralNormalMap(missionId: string, envType: EnvironmentType): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Synthesize smooth medium elevation buffer
  const heightBuff = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const ripple = Math.sin(x * 0.06 + Math.cos(y * 0.03) * 1.5) * 0.35;
      const gentleVariation = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.25;
      heightBuff[idx] = ripple + gentleVariation;
    }
  }

  // Sobel Filter to generate true tangent-space normal map
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = (x - 1 + size) % size;
      const x1 = (x + 1) % size;
      const y0 = (y - 1 + size) % size;
      const y1 = (y + 1) % size;

      // Sobel kernel horizontal & vertical gradients
      const dx = (heightBuff[y * size + x1] - heightBuff[y * size + x0]) * 3.5;
      const dy = (heightBuff[y1 * size + x] - heightBuff[y0 * size + x]) * 3.5;
      const dz = 1.0;

      // Normalize (dx, dy, dz)
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = dx / len;
      const ny = dy / len;
      const nz = dz / len;

      const pIdx = (y * size + x) * 4;
      // Normal map encoding: [-1, 1] mapped to [0, 255]
      data[pIdx] = Math.round((nx * 0.5 + 0.5) * 255);
      data[pIdx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[pIdx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[pIdx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

function generateProceduralRoughnessMap(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Regolith is naturally matte and highly rough (~0.85 to 0.98)
    const val = Math.round(210 + (Math.random() - 0.5) * 40);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// -----------------------------------------------------------------------------
// Illustrative PROCEDURAL terrain functions. These are hand-written noise and shape
// functions, NOT MOLA (Mars) or LOLA (Moon) measurements. Do not label them as such.
// TODO: to show real terrain, replace with a DEM exported from NASA Mars Trek / Moon Trek
// and record its dataset id in the README data-sources table.
// -----------------------------------------------------------------------------

function hash2D(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise2D(x: number, z: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;

  const u = fx * fx * (3.0 - 2.0 * fx);
  const v = fz * fz * (3.0 - 2.0 * fz);

  const a = hash2D(ix, iz);
  const b = hash2D(ix + 1, iz);
  const c = hash2D(ix, iz + 1);
  const d = hash2D(ix + 1, iz + 1);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fractalBrownianMotion(x: number, z: number, octaves = 4): number {
  let total = 0;
  let amp = 1;
  let freq = 1;
  let maxAmp = 0;
  for (let i = 0; i < octaves; i++) {
    total += valueNoise2D(x * freq, z * freq) * amp;
    maxAmp += amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return total / maxAmp;
}

export function getMolaLroTerrain(missionId: string, envType: EnvironmentType): PlanetaryTerrainData {
  const diffuseMap = generateProceduralDiffuseMap(missionId, envType);
  const normalMap = generateProceduralNormalMap(missionId, envType);
  const roughnessMap = generateProceduralRoughnessMap();

  if (envType === 'moon') {
    // -------------------------------------------------------------------------
    // APOLLO 15: illustrative Hadley-Apennine-style terrain (procedural, not LOLA data)
    // (Mount Hadley Massif, Spur Crater Rim, and 300m Hadley Rille Sinuous Chasm)
    // -------------------------------------------------------------------------
    const sampleHeight = (x: number, z: number): number => {
      // 1. Regional Massif Slope (Mount Hadley Delta rise towards +x, -z)
      const massifSlope = (x * 0.06 - z * 0.08) * 1.8;

      // 2. Spur Crater (Center around x: 18, z: -35, diameter ~22m)
      const dSpur = Math.hypot(x - 18, z + 35);
      let spurOffset = 0;
      if (dSpur < 24) {
        const t = dSpur / 24;
        if (t < 0.65) {
          // Bowl excavation
          spurOffset = -3.2 * (1 - Math.pow(t / 0.65, 2));
        } else {
          // Raised ejecta rim
          spurOffset = 1.4 * Math.sin(((t - 0.65) / 0.35) * Math.PI);
        }
      }

      // 3. Sinuous Hadley Rille Canyon (runs along west, x ≈ -30 to -40)
      const rilleCenter = -32 + Math.sin(z * 0.04) * 8 + Math.cos(z * 0.08) * 3;
      const dRille = Math.abs(x - rilleCenter);
      let rilleOffset = 0;
      if (dRille < 18) {
        const rt = dRille / 18;
        // Steep V-shaped gorge with flat basalt floor
        rilleOffset = -8.5 * Math.pow(1 - rt, 1.8);
      }

      // 4. Fine impact gardening regolith texture
      const regolithFines = (fractalBrownianMotion(x * 0.08, z * 0.08) - 0.5) * 1.5;

      return massifSlope + spurOffset + rilleOffset + regolithFines;
    };

    const sampleNormal = (x: number, z: number): THREE.Vector3 => {
      const eps = 0.4;
      const hL = sampleHeight(x - eps, z);
      const hR = sampleHeight(x + eps, z);
      const hD = sampleHeight(x, z - eps);
      const hU = sampleHeight(x, z + eps);
      const n = new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU);
      return n.normalize();
    };

    return {
      locationTitle: 'Hadley-Apennine Region (26.13° N, 3.63° E)',
      sourceDataset: 'Illustrative procedural terrain (not survey data)',
      gridDimensions: 'Procedural 240 m x 240 m sector (illustrative)',
      elevationMinMaxMeters: [-300, 4600],
      diffuseMap,
      normalMap,
      roughnessMap,
      displacementScale: 1.0,
      sampleHeight,
      sampleNormal,
    };
  }

  if (missionId === 'opportunity') {
    // -------------------------------------------------------------------------
    // OPPORTUNITY: illustrative Meridiani-style terrain (procedural, not MOLA data)
    // (Layered Sulfate Outcrops, Eagle Crater Depression, Endurance & Ripples)
    // -------------------------------------------------------------------------
    const sampleHeight = (x: number, z: number): number => {
      // Gentle regional slope of the smooth sulfate plains
      const regional = (x * 0.012 - z * 0.015) * 1.2;

      // Eagle Crater (Landing Site, Center at x: 15, z: -30, Diameter 22m, Depth 3m)
      const dEagle = Math.hypot(x - 15, z + 30);
      let eagleOffset = 0;
      if (dEagle < 20) {
        const t = dEagle / 20;
        if (t < 0.65) {
          eagleOffset = -2.8 * (1 - Math.pow(t / 0.65, 2));
        } else {
          eagleOffset = 1.1 * Math.sin(((t - 0.65) / 0.35) * Math.PI);
        }
      }

      // Endurance Crater margin in the distance
      const dEndurance = Math.hypot(x + 50, z + 70);
      let enduranceOffset = 0;
      if (dEndurance < 45) {
        const et = dEndurance / 45;
        if (et < 0.7) {
          enduranceOffset = -4.5 * (1 - Math.pow(et / 0.7, 2));
        } else {
          enduranceOffset = 2.0 * Math.sin(((et - 0.7) / 0.3) * Math.PI);
        }
      }

      // Wind-sculpted sand dunes & hematite ripple bedforms
      const ripples = Math.sin(x * 0.15 + Math.cos(z * 0.08) * 1.5) * 0.35;
      const bedrockNoise = (fractalBrownianMotion(x * 0.05, z * 0.05) - 0.5) * 1.2;

      return regional + eagleOffset + enduranceOffset + ripples + bedrockNoise;
    };

    const sampleNormal = (x: number, z: number): THREE.Vector3 => {
      const eps = 0.4;
      const hL = sampleHeight(x - eps, z);
      const hR = sampleHeight(x + eps, z);
      const hD = sampleHeight(x, z - eps);
      const hU = sampleHeight(x, z + eps);
      const n = new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU);
      return n.normalize();
    };

    return {
      locationTitle: 'Meridiani Planum / Eagle Crater (1.95° S, 354.47° E)',
      sourceDataset: 'Illustrative procedural terrain (not survey data)',
      gridDimensions: 'Procedural 240 m x 240 m sector (illustrative)',
      elevationMinMaxMeters: [-1450, -1380],
      diffuseMap,
      normalMap,
      roughnessMap,
      displacementScale: 1.0,
      sampleHeight,
      sampleNormal,
    };
  }

  if (missionId === 'spirit') {
    // -------------------------------------------------------------------------
    // SPIRIT: illustrative Gusev-style terrain (procedural, not MOLA data)
    // (Basalt Lava Plains transitioning into Husband Hill Rise and Home Plate)
    // -------------------------------------------------------------------------
    const sampleHeight = (x: number, z: number): number => {
      // Columbia Hills Husband Hill ridge rising steeply to the southwest
      const hillRise = Math.max(0, (x * 0.08 - z * 0.12)) * 2.8;

      // Clovis outcrop rocky knoll at (12, -40)
      const dClovis = Math.hypot(x - 12, z + 40);
      const clovisKnoll = dClovis < 18 ? 2.5 * Math.cos((dClovis / 18) * (Math.PI / 2)) : 0;

      // Home Plate circular plateau feature at (-22, -68)
      const dPlate = Math.hypot(x + 22, z + 68);
      let plateOffset = 0;
      if (dPlate < 22) {
        plateOffset = 1.8 * (1 - Math.pow(dPlate / 22, 4));
      }

      const basaltUndulation = (fractalBrownianMotion(x * 0.04, z * 0.04) - 0.5) * 1.8;

      return hillRise + clovisKnoll + plateOffset + basaltUndulation;
    };

    const sampleNormal = (x: number, z: number): THREE.Vector3 => {
      const eps = 0.4;
      const hL = sampleHeight(x - eps, z);
      const hR = sampleHeight(x + eps, z);
      const hD = sampleHeight(x, z - eps);
      const hU = sampleHeight(x, z + eps);
      const n = new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU);
      return n.normalize();
    };

    return {
      locationTitle: 'Gusev Crater / Columbia Hills (14.57° S, 175.47° E)',
      sourceDataset: 'Illustrative procedural terrain (not survey data)',
      gridDimensions: 'Procedural 240 m x 240 m sector (illustrative)',
      elevationMinMaxMeters: [-1950, -1820],
      diffuseMap,
      normalMap,
      roughnessMap,
      displacementScale: 1.0,
      sampleHeight,
      sampleNormal,
    };
  }

  // ---------------------------------------------------------------------------
  // SOJOURNER: Ares Vallis Catastrophic Outflow Channel
  // (Streamlined teardrop islands, flood terraces, boulder fields)
  // ---------------------------------------------------------------------------
  const sampleHeight = (x: number, z: number): number => {
    // Catastrophic flood scour channels flowing from south to north (along z)
    const channelFluting = Math.sin(x * 0.08) * 1.4;

    // Streamlined teardrop island at (8, -20)
    const dIsland = Math.hypot((x - 8) * 1.5, z + 20);
    const islandOffset = dIsland < 25 ? 2.2 * Math.cos((dIsland / 25) * (Math.PI / 2)) : 0;

    const floodTerrace = (fractalBrownianMotion(x * 0.035, z * 0.035) - 0.5) * 2.0;

    return channelFluting + islandOffset + floodTerrace;
  };

  const sampleNormal = (x: number, z: number): THREE.Vector3 => {
    const eps = 0.4;
    const hL = sampleHeight(x - eps, z);
    const hR = sampleHeight(x + eps, z);
    const hD = sampleHeight(x, z - eps);
    const hU = sampleHeight(x, z + eps);
    const n = new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU);
    return n.normalize();
  };

  return {
    locationTitle: 'Ares Vallis Outflow Floodplain (19.33° N, 33.55° W)',
    sourceDataset: 'Illustrative procedural terrain (not survey data)',
    gridDimensions: 'Procedural 240 m x 240 m sector (illustrative)',
    elevationMinMaxMeters: [-3680, -3620],
    diffuseMap,
    normalMap,
    roughnessMap,
    displacementScale: 1.0,
    sampleHeight,
    sampleNormal,
  };
}
