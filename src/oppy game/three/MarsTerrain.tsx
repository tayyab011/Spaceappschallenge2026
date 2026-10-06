import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { oppyPosition } from '../data/missions';

export interface MarsCrater {
  x: number;
  z: number;
  radius: number;
  depth: number;
  rimHeight: number;
}


export const MARS_CRATERS: MarsCrater[] = [
  
  { x: 16, z: -40, radius: 14.5, depth: 2.9, rimHeight: 0.85 }, 
  { x: -12, z: -12, radius: 7.5, depth: 1.6, rimHeight: 0.5 },
  { x: 18, z: -18, radius: 8.5, depth: 1.8, rimHeight: 0.55 },
  { x: -25, z: -34, radius: 12.0, depth: 2.5, rimHeight: 0.75 },
  { x: 32, z: -28, radius: 11.0, depth: 2.3, rimHeight: 0.7 },
  { x: -8, z: -48, radius: 9.5, depth: 2.0, rimHeight: 0.6 },
  { x: 6, z: -26, radius: 6.5, depth: 1.35, rimHeight: 0.42 },
  { x: -34, z: -10, radius: 13.0, depth: 2.7, rimHeight: 0.8 },
  { x: 28, z: 8, radius: 10.5, depth: 2.2, rimHeight: 0.65 },
  { x: -20, z: 12, radius: 9.0, depth: 1.9, rimHeight: 0.55 },
  { x: 12, z: 16, radius: 7.0, depth: 1.45, rimHeight: 0.45 },
  { x: -44, z: -26, radius: 15.5, depth: 3.1, rimHeight: 0.9 },
  { x: 44, z: -14, radius: 14.0, depth: 2.8, rimHeight: 0.82 },
  { x: 0, z: -64, radius: 16.0, depth: 3.2, rimHeight: 0.95 },
  { x: -38, z: 28, radius: 12.5, depth: 2.5, rimHeight: 0.75 },
  { x: 36, z: 30, radius: 11.5, depth: 2.3, rimHeight: 0.7 },
 
  { x: -16, z: 45, radius: 10.0, depth: 2.1, rimHeight: 0.65 },
  { x: 18, z: 58, radius: 11.5, depth: 2.4, rimHeight: 0.72 },
  { x: -22, z: 76, radius: 13.5, depth: 2.8, rimHeight: 0.8 },
  { x: 15, z: 92, radius: 9.0, depth: 1.9, rimHeight: 0.58 },
  { x: -14, z: 112, radius: 10.5, depth: 2.2, rimHeight: 0.68 },
  { x: 22, z: 125, radius: 12.5, depth: 2.6, rimHeight: 0.76 },
  { x: -24, z: 148, radius: 14.0, depth: 2.9, rimHeight: 0.85 },
  { x: 25, z: 162, radius: 11.0, depth: 2.3, rimHeight: 0.68 },
  { x: -28, z: 185, radius: 15.0, depth: 3.0, rimHeight: 0.88 },
  { x: 26, z: 192, radius: 13.0, depth: 2.7, rimHeight: 0.78 },
];


export function getMarsHeight(x: number, z: number): number {
  
  const h1 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.2;
  
  const h2 = Math.sin(x * 0.12 + 1.2) * Math.sin(z * 0.14) * 0.8;
  
  const h3 = Math.sin(x * 0.3) * Math.cos(z * 0.25) * 0.3;


  let cratersOffset = 0;
  for (let i = 0; i < MARS_CRATERS.length; i++) {
    const c = MARS_CRATERS[i];
    const dx = x - c.x;
    const dz = z - c.z;
    const maxR = c.radius * 1.35;
    if (Math.abs(dx) < maxR && Math.abs(dz) < maxR) {
      const dist = Math.hypot(dx, dz);
      const u = dist / c.radius;
      if (u < 1.35) {
        if (u < 0.88) {
          const t = u / 0.88;
          cratersOffset -= c.depth * 0.5 * (1 + Math.cos(t * Math.PI));
        }
        if (u > 0.55) {
          const rT = (u - 0.55) / 0.8;
          cratersOffset += c.rimHeight * 0.5 * (1 - Math.cos(rT * Math.PI * 2));
        }
      }
    }
  }


  const distRidge = Math.hypot(x + 16, z + 18);
  const ridge = distRidge < 16 ? Math.cos((distRidge / 16) * Math.PI * 0.5) * 3.2 : 0;

  
  let trailRidges = 0;
  if (z > 30 && z < 165) {
    trailRidges = Math.sin((z - 30) * 0.09) * 1.8;
    
    const distRim = Math.abs(z - 142);
    if (distRim < 18) {
      trailRidges += Math.cos((distRim / 18) * Math.PI * 0.5) * 2.8;
    }
  }

 
  const distValley = Math.hypot(x - oppyPosition[0], z - oppyPosition[2]);
  const valley =
    distValley < 24 ? -Math.cos((distValley / 24) * Math.PI * 0.5) * 2.0 : 0;

  return h1 + h2 + h3 + cratersOffset + ridge + trailRidges + valley;
}


function createProceduralMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  
  ctx.fillStyle = '#c1440e';
  ctx.fillRect(0, 0, 512, 512);

  
  for (let i = 0; i < 24000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 2.5 + 0.5;
    const tone = Math.random();
    ctx.fillStyle =
      tone > 0.65
        ? 'rgba(214, 82, 22, 0.24)' 
        : tone > 0.3
        ? 'rgba(193, 68, 14, 0.28)' 
        : 'rgba(162, 52, 10, 0.26)'; 
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }


  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const cr = 4 + Math.random() * 14;
    ctx.strokeStyle = 'rgba(140, 42, 8, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.stroke();
  }


  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, 'rgba(206, 76, 18, 0.14)');
  grad.addColorStop(0.5, 'rgba(176, 58, 11, 0.16)');
  grad.addColorStop(1, 'rgba(193, 68, 14, 0.14)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(48, 48);
  return texture;
}

export interface TerrainRock {
  index: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  radius: number;
  rotX: number;
  rotY: number;
  rotZ: number;
}

const ROCK_COUNT = 220;

export const TERRAIN_ROCKS: TerrainRock[] = (() => {
  const rocks: TerrainRock[] = [];
  for (let i = 0; i < ROCK_COUNT; i++) {
    const seed = i * 13.37;
    let rx: number;
    let rz: number;

    if (i < 130) {
     
      rx = Math.sin(seed) * 70;
      rz = Math.cos(seed * 1.7) * 70;
    
      if (Math.hypot(rx, rz) < 5.0) {
        rx += rx >= 0 ? 6.0 : -6.0;
        rz += rz >= 0 ? 6.0 : -6.0;
      }
    } else {
     
      const side = i % 2 === 0 ? 1 : -1;
      rx = side * (12 + Math.abs(Math.sin(seed * 1.3)) * 38);
      rz = 15 + ((i - 130) / (ROCK_COUNT - 130)) * 190;
    }

    const ry = getMarsHeight(rx, rz);
    const s = 0.4 + (Math.sin(seed * 4) * 0.5 + 0.5) * 1.3;

    rocks.push({
      index: i,
      x: rx,
      y: ry + 0.2,
      z: rz,
      scale: s,
      radius: s * 0.46,
      rotX: Math.sin(seed * 3) * Math.PI,
      rotY: Math.cos(seed * 2) * Math.PI,
      rotZ: Math.sin(seed * 5) * Math.PI,
    });
  }
  return rocks;
})();

export interface RockHitState {
  rockIndex: number;
  hitTime: number;
  dirX: number;
  dirZ: number;
}

interface MarsTerrainProps {
  lastRockHitRef?: React.MutableRefObject<RockHitState | null>;
}

export const MarsTerrain: React.FC<MarsTerrainProps> = ({ lastRockHitRef }) => {
  const instancedRocksRef = useRef<THREE.InstancedMesh>(null);
  const activeHitRef = useRef<{ index: number; elapsed: number; dirX: number; dirZ: number } | null>(null);
  const lastProcessedHitTimeRef = useRef<number>(0);

 
  const marsTexture = useMemo(() => createProceduralMarsTexture(), []);


  const terrainGeometry = useMemo(() => {
    const size = 600;
    const segments = 260;
    const offsetZ = 70;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, offsetZ);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      pos.setY(i, getMarsHeight(vx, vz));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const rockGeometry = useMemo(() => {
    return new THREE.DodecahedronGeometry(0.5, 1);
  }, []);

  const rockMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8F3512',
      emissive: '#2B0C03',
      emissiveIntensity: 0.12,
      roughness: 0.85,
      metalness: 0.08,
    });
  }, []);

  useEffect(() => {
    if (!instancedRocksRef.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < TERRAIN_ROCKS.length; i++) {
      const r = TERRAIN_ROCKS[i];
      position.set(r.x, r.y, r.z);
      rotation.set(r.rotX, r.rotY, r.rotZ);
      quaternion.setFromEuler(rotation);
      scale.set(r.scale, r.scale * 0.7, r.scale);

      matrix.compose(position, quaternion, scale);
      instancedRocksRef.current.setMatrixAt(i, matrix);
    }
    instancedRocksRef.current.instanceMatrix.needsUpdate = true;
  }, []);


  useEffect(() => {
    if (!lastRockHitRef) return;
    let animFrameId: number;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    const updateHitRock = () => {
      const hit = lastRockHitRef.current;
      if (hit && hit.hitTime !== lastProcessedHitTimeRef.current && hit.rockIndex >= 0) {
        lastProcessedHitTimeRef.current = hit.hitTime;
        activeHitRef.current = {
          index: hit.rockIndex,
          elapsed: 0,
          dirX: hit.dirX,
          dirZ: hit.dirZ,
        };
      }

      if (activeHitRef.current && instancedRocksRef.current) {
        const active = activeHitRef.current;
        active.elapsed += 0.016;
        const r = TERRAIN_ROCKS[active.index];
        if (r) {
          if (active.elapsed < 0.38) {
            const decay = 1 - active.elapsed / 0.38;
            const wobble = Math.sin(active.elapsed * 42) * 0.22 * decay;
            const nudge = Math.sin(active.elapsed * Math.PI / 0.38) * 0.14 * decay;
            position.set(r.x + active.dirX * nudge, r.y + Math.abs(wobble) * 0.15, r.z + active.dirZ * nudge);
            rotation.set(r.rotX + wobble, r.rotY, r.rotZ - wobble);
            quaternion.setFromEuler(rotation);
            scale.set(r.scale, r.scale * 0.7, r.scale);
            matrix.compose(position, quaternion, scale);
            instancedRocksRef.current.setMatrixAt(active.index, matrix);
            instancedRocksRef.current.instanceMatrix.needsUpdate = true;
          } else {
            position.set(r.x, r.y, r.z);
            rotation.set(r.rotX, r.rotY, r.rotZ);
            quaternion.setFromEuler(rotation);
            scale.set(r.scale, r.scale * 0.7, r.scale);
            matrix.compose(position, quaternion, scale);
            instancedRocksRef.current.setMatrixAt(active.index, matrix);
            instancedRocksRef.current.instanceMatrix.needsUpdate = true;
            activeHitRef.current = null;
          }
        }
      }
      animFrameId = requestAnimationFrame(updateHitRock);
    };

    animFrameId = requestAnimationFrame(updateHitRock);
    return () => cancelAnimationFrame(animFrameId);
  }, [lastRockHitRef]);

 
  useEffect(() => {
    return () => {
      marsTexture.dispose();
      terrainGeometry.dispose();
      rockGeometry.dispose();
      rockMaterial.dispose();
    };
  }, [marsTexture, terrainGeometry, rockGeometry, rockMaterial]);

  return (
    <group>
     
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial
          map={marsTexture}
          roughness={0.88}
          metalness={0.04}
          color="#ffffff"
          emissive="#c1440e"
          emissiveIntensity={0.12}
        />
      </mesh>

     
      <instancedMesh
        ref={instancedRocksRef}
        args={[rockGeometry, rockMaterial, ROCK_COUNT]}
        receiveShadow
        castShadow
        frustumCulled={false}
      />
    </group>
  );
};
