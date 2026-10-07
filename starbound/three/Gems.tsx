import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMarsHeight } from './MarsTerrain';
import { OPPY_TRACK_WAYPOINTS } from '../data/missions';

interface GemsProps {
  roverPosRef?: React.MutableRefObject<THREE.Vector3>;
  roverPosition?: [number, number, number];
  onCollect: () => void;
  missionNumber: number;
  gemCount?: number;
}

export const Gems: React.FC<GemsProps> = ({
  roverPosRef,
  roverPosition,
  onCollect,
  missionNumber,
  gemCount = 5,
}) => {
  
  const [collectedIds, setCollectedIds] = useState<number[]>([]);
  useEffect(() => {
    setCollectedIds([]);
  }, [missionNumber]);

  const gemPositions = useMemo(() => {
    const list: { id: number; x: number; z: number }[] = [];

    if (missionNumber === 5) {
      
      for (let i = 0; i < gemCount; i++) {
        const segIdx = Math.min(i, OPPY_TRACK_WAYPOINTS.length - 2);
        const [x0, z0] = OPPY_TRACK_WAYPOINTS[segIdx];
        const [x1, z1] = OPPY_TRACK_WAYPOINTS[segIdx + 1];
        const t = 0.55;
        const x = x0 + (x1 - x0) * t + (i % 2 === 0 ? 0.9 : -0.9);
        const z = z0 + (z1 - z0) * t;
        list.push({ id: i, x, z });
      }
      return list;
    }

    if (missionNumber === 2) {
      const rockTrailGems: [number, number][] = [
        [14, -30],
        [12, -20],
        [14, -10],
        [19, -7],
        [23, 3],
      ];
      for (let i = 0; i < gemCount; i++) {
        const [gx, gz] = rockTrailGems[i % rockTrailGems.length];
        list.push({ id: i, x: gx, z: gz });
      }
      return list;
    }

    
    const centers: Record<number, [number, number]> = {
      1: [4, -18],
      3: [4, -14],
      4: [-6, -6],
    };
    const [cx, cz] = centers[missionNumber] || [0, -10];

    for (let i = 0; i < gemCount; i++) {
      const angle = (i / gemCount) * Math.PI * 2 + missionNumber * 0.6;
      const dist = 7 + (i % 3) * 5;
      const x = cx + Math.cos(angle) * dist;
      const z = cz + Math.sin(angle) * dist;
      list.push({ id: i, x, z });
    }
    return list;
  }, [missionNumber, gemCount]);

  const groupRefs = useRef<{ [key: number]: THREE.Group | null }>({});
  const fallbackVecRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const roverVec = roverPosRef
      ? roverPosRef.current
      : roverPosition
      ? fallbackVecRef.current.set(...roverPosition)
      : fallbackVecRef.current;

    gemPositions.forEach((gem) => {
      if (collectedIds.includes(gem.id)) return;

      const group = groupRefs.current[gem.id];
      if (group) {
        
        const baseHeight = getMarsHeight(gem.x, gem.z);
        group.position.y = baseHeight + 1.2 + Math.sin(t * 3.5 + gem.id) * 0.25;
        group.rotation.y = t * 2.2 + gem.id;
        group.rotation.x = Math.sin(t * 1.5 + gem.id) * 0.15;

       
        const gemVec = new THREE.Vector3(gem.x, group.position.y, gem.z);
        if (gemVec.distanceTo(roverVec) < 3.0) {
          setCollectedIds((prev) => (prev.includes(gem.id) ? prev : [...prev, gem.id]));
          onCollect();
        }
      }
    });
  });

  return (
    <group>
      {gemPositions.map((gem) => {
        if (collectedIds.includes(gem.id)) return null;
        const initialY = getMarsHeight(gem.x, gem.z) + 1.2;

        return (
          <group
            key={gem.id}
            ref={(el) => {
              groupRefs.current[gem.id] = el;
            }}
            position={[gem.x, initialY, gem.z]}
          >
           
            <mesh castShadow>
              <octahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial
                color="#5EEAD4"
                roughness={0.15}
                metalness={0.2}
                emissive="#14B8A6"
                emissiveIntensity={0.85}
              />
            </mesh>

            
            <pointLight color="#5EEAD4" intensity={1.6} distance={5} />

            
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, 0.68, 16]} />
              <meshBasicMaterial
                color="#99F6E4"
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
