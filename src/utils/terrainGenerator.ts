import * as THREE from 'three';
import { BotMission } from '../types';

/**
 * Procedural (illustrative) heightmap and surface color texture synthesis. This is NOT real
 * NASA MOLA (Mars) or LOLA (Moon) data.
 * 
 * In production deployment, replace with direct static PNG tile downloads:
 * // TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,
 * // exported from NASA Mars Trek / Moon Trek for [bot name]'s specific site.
 */

export interface RealTerrainAssets {
  heightmapTexture: THREE.CanvasTexture;
  surfaceTexture: THREE.CanvasTexture;
  displacementScale: number;
  attributionNote: string;
}

// Generate realistic topographic heightmap and draped surface texture based on authentic landing sites
export function generateRealTerrainAssets(bot: BotMission): RealTerrainAssets {
  const isMars = bot.frontierId === 'mars';
  const isMoon = bot.frontierId === 'moon';

  // 256x256 elevation buffer
  const width = 256;
  const height = 256;

  // 1. Create Heightmap Canvas (Grayscale: 0 = deepest basin, 255 = highest peak/rim)
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = width;
  heightCanvas.height = height;
  const heightCtx = heightCanvas.getContext('2d')!;
  const heightImgData = heightCtx.createImageData(width, height);
  const hData = heightImgData.data;

  // 2. Create Surface Texture Canvas (Draped satellite color imagery)
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImgData = colorCtx.createImageData(width, height);
  const cData = colorImgData.data;

  // Seeded features for specific real mission landing sites
  // Mars: Opportunity (Endeavour crater rim), Mars 3 (Ptolemaeus), Percy (Jezero crater delta)
  // Moon: Luna 9 (Oceanus Procellarum basalt), Apollo LRV (Hadley Rille mountain slopes), Retroreflectors (Mare Tranquillitatis)
  const botId = bot.id;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = (x / width - 0.5) * 2; // -1 to 1
      const ny = (y / height - 0.5) * 2; // -1 to 1
      const distFromCenter = Math.sqrt(nx * nx + ny * ny);

      let elevation = 0.5; // Normalized 0-1

      if (botId === 'opportunity') {
        // Endeavour Crater Rim & Victoria outcroppings: prominent crater rim ridge to the west, sand plain to east
        const rimRidge = Math.exp(-Math.pow((nx + 0.35) * 3.2, 2)) * 0.42;
        const craterBasin = Math.max(0, 0.35 - Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.2, 2)) * 0.6);
        const dunes = Math.sin(nx * 18 + ny * 6) * 0.04 + Math.sin(nx * 32 - ny * 12) * 0.02;
        elevation = 0.45 + rimRidge - craterBasin + dunes;
      } else if (botId === 'perseverance') {
        // Jezero Crater River Delta: Fan structure entering from the west into ancient lakebed
        const deltaFan = Math.max(0, (0.4 - Math.abs(ny * 1.5)) * (0.8 - nx * 0.7)) * 0.5;
        const riverChannel = Math.exp(-Math.pow((ny - Math.sin(nx * 4) * 0.2) * 8, 2)) * 0.25;
        const layeredMudstone = Math.sin(nx * 24 + ny * 8) * 0.035;
        elevation = 0.42 + deltaFan - riverChannel + layeredMudstone;
      } else if (botId === 'mars-3') {
        // Ptolemaeus Crater Basin: broad flat depression with subtle impact ejecta mounds
        const rimSlope = Math.pow(distFromCenter, 1.8) * 0.45;
        const dustMounds = Math.sin(nx * 12) * Math.cos(ny * 12) * 0.04;
        elevation = 0.38 + rimSlope + dustMounds;
      } else if (botId === 'apollo-lrv') {
        // Hadley Rille Canyon & Apennine Mountain Slope: steep 300m canyon cut through high slope
        const canyonDistance = Math.abs(nx - Math.sin(ny * 3) * 0.25);
        const rilleGorge = Math.exp(-Math.pow(canyonDistance * 7, 2)) * 0.48;
        const apennineSlope = (ny + 1) * 0.25 + nx * 0.12;
        elevation = 0.45 + apennineSlope - rilleGorge;
      } else if (botId === 'luna-9') {
        // Oceanus Procellarum: Ancient flat basalt plain with small localized impact craters
        const crater1 = Math.max(0, 0.25 - Math.sqrt(Math.pow(nx + 0.3, 2) + Math.pow(ny + 0.3, 2)) * 1.8);
        const crater2 = Math.max(0, 0.2 - Math.sqrt(Math.pow(nx - 0.4, 2) + Math.pow(ny - 0.2, 2)) * 2.2);
        const regolithRolling = Math.sin(nx * 10 + ny * 10) * 0.03;
        elevation = 0.5 - crater1 - crater2 + regolithRolling;
      } else if (botId === 'lunar-retroreflectors') {
        // Mare Tranquillitatis: smooth maria with gentle rolling wrinkle ridges
        const wrinkleRidge = Math.exp(-Math.pow((nx - ny * 0.5 - 0.2) * 5, 2)) * 0.22;
        const mareGentle = Math.cos(nx * 8) * 0.03 + Math.sin(ny * 8) * 0.03;
        elevation = 0.48 + wrinkleRidge + mareGentle;
      } else {
        // Default general terrain
        elevation = 0.5 + Math.sin(nx * 8) * 0.05 + Math.cos(ny * 8) * 0.05;
      }

      // Clamp 0 to 1
      elevation = Math.max(0, Math.min(1, elevation));
      const val = Math.floor(elevation * 255);

      // Grayscale displacement map (R=G=B)
      hData[idx] = val;
      hData[idx + 1] = val;
      hData[idx + 2] = val;
      hData[idx + 3] = 255;

      // Draped surface color texture (Mars Trek rust tones / Moon Trek basalt & titanium tones)
      if (isMars) {
        // Base Mars palette
        const rustDarkR = 120, rustDarkG = 40, rustDarkB = 14;
        const rustBrightR = 193, rustBrightG = 68, rustBrightB = 14;
        const sandDuneR = 217, sandDuneG = 119, sandDuneB = 6;

        const mix = elevation;
        const r = Math.floor(rustDarkR + (rustBrightR - rustDarkR) * mix + (x % 3) * 3);
        const g = Math.floor(rustDarkG + (rustBrightG - rustDarkG) * mix);
        const b = Math.floor(rustDarkB + (rustBrightB - rustDarkB) * mix);

        // Add subtle rock flecks & sulfate deposits
        const isSulfate = elevation > 0.7 || (val % 17 === 0);
        cData[idx] = isSulfate ? Math.min(255, r + 45) : r;
        cData[idx + 1] = isSulfate ? Math.min(255, g + 35) : g;
        cData[idx + 2] = isSulfate ? Math.min(255, b + 25) : b;
        cData[idx + 3] = 255;
      } else {
        // Base Moon palette (Cool grey, dark basalt maria, bright anorthosite regolith)
        const darkBasalt = 55;
        const lightAnorthosite = 175;
        const grey = Math.floor(darkBasalt + (lightAnorthosite - darkBasalt) * elevation + ((x + y) % 5) * 2);

        // Glass spherule / reflective titanium tint
        cData[idx] = Math.min(255, grey + 4);
        cData[idx + 1] = Math.min(255, grey + 6);
        cData[idx + 2] = Math.min(255, grey + 10); // Slight cool titanium hue
        cData[idx + 3] = 255;
      }
    }
  }

  heightCtx.putImageData(heightImgData, 0, 0);
  colorCtx.putImageData(colorImgData, 0, 0);

  const heightmapTexture = new THREE.CanvasTexture(heightCanvas);
  heightmapTexture.wrapS = THREE.ClampToEdgeWrapping;
  heightmapTexture.wrapT = THREE.ClampToEdgeWrapping;
  heightmapTexture.needsUpdate = true;

  const surfaceTexture = new THREE.CanvasTexture(colorCanvas);
  surfaceTexture.wrapS = THREE.ClampToEdgeWrapping;
  surfaceTexture.wrapT = THREE.ClampToEdgeWrapping;
  surfaceTexture.needsUpdate = true;

  const datasetName = isMars ? 'Illustrative procedural terrain (Mars-toned, not MOLA data)' : 'Illustrative procedural terrain (Moon-toned, not LOLA data)';
  const trekPortal = isMars ? 'NASA Mars Trek' : 'NASA Moon Trek';

  return {
    heightmapTexture,
    surfaceTexture,
    displacementScale: isMars ? 12 : 14,
    attributionNote: `// TODO: Replace with actual MOLA/LOLA heightmap PNG and surface texture for this bot's landing region,\n// exported from ${trekPortal} for ${bot.name}'s specific site.`,
  };
}
