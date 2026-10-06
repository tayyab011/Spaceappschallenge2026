import * as THREE from 'three';
import { EnvironmentType } from '../types';

//made with google ai studio
function hash2D(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function smoothNoise(x: number, z: number): number {
  const iX = Math.floor(x);
  const iZ = Math.floor(z);
  const fX = x - iX;
  const fZ = z - iZ;

  const u = fX * fX * (3.0 - 2.0 * fX);
  const v = fZ * fZ * (3.0 - 2.0 * fZ);

  const a = hash2D(iX, iZ);
  const b = hash2D(iX + 1, iZ);
  const c = hash2D(iX, iZ + 1);
  const d = hash2D(iX + 1, iZ + 1);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function getTerrainHeight(x: number, z: number, envType: EnvironmentType): number {
  if (envType === 'jupiter_system' || envType === 'saturn_system' || envType === 'interplanetary') {
    return 0; // Space flyby
  }

  if (envType === 'moon') {
    // Hadley-Apennine topography: rolling mare, spur crater slopes, and Hadley Rille chasm
    const regionalSlope = Math.sin(x * 0.015) * 4.0 + Math.cos(z * 0.018) * 3.5;
    const craterDist = Math.hypot(x - 18, z + 35);
    let craterOffset = 0;
    if (craterDist < 25) {
      // Spur crater rim and bowl
      const t = craterDist / 25;
      if (t < 0.6) {
        craterOffset = -3.5 * (1 - t / 0.6); // crater depression
      } else {
        craterOffset = 1.8 * Math.sin(((t - 0.6) / 0.4) * Math.PI); // elevated rim
      }
    }

    // Hadley Rille chasm depression along west side (x < -20)
    let rilleOffset = 0;
    const rilleDist = Math.abs(x - (-28 + Math.sin(z * 0.05) * 6));
    if (rilleDist < 16) {
      const rt = rilleDist / 16;
      rilleOffset = -9.0 * (1 - rt * rt);
    }

    const fineRegolith = smoothNoise(x * 0.1, z * 0.1) * 0.6 + smoothNoise(x * 0.3, z * 0.3) * 0.2;
    return regionalSlope + craterOffset + rilleOffset + fineRegolith;
  }

  // Mars (Meridiani Planum / Gusev / Ares Vallis)
  // Rolling dunes, impact craters, and rocky knolls
  const baseDunes = Math.sin(x * 0.035 + Math.cos(z * 0.02) * 1.5) * 2.2;
  const rollingPlains = smoothNoise(x * 0.015, z * 0.015) * 4.5;
  const ripples = smoothNoise(x * 0.12, z * 0.12) * 0.45;

  // Crater at site 1 (e.g. Eagle Crater depression)
  const eagleDist = Math.hypot(x - 15, z + 30);
  let eagleCrater = 0;
  if (eagleDist < 20) {
    const t = eagleDist / 20;
    if (t < 0.7) {
      eagleCrater = -2.6 * (1 - t / 0.7);
    } else {
      eagleCrater = 1.1 * Math.sin(((t - 0.7) / 0.3) * Math.PI);
    }
  }

  return baseDunes + rollingPlains + ripples + eagleCrater;
}

// Compute surface normal at (x, z) to tilt the rover realistically with terrain
export function getTerrainNormal(x: number, z: number, envType: EnvironmentType): THREE.Vector3 {
  const delta = 0.5;
  const hL = getTerrainHeight(x - delta, z, envType);
  const hR = getTerrainHeight(x + delta, z, envType);
  const hD = getTerrainHeight(x, z - delta, envType);
  const hU = getTerrainHeight(x, z + delta, envType);

  const normal = new THREE.Vector3(hL - hR, 2.0 * delta, hD - hU);
  normal.normalize();
  return normal;
}
