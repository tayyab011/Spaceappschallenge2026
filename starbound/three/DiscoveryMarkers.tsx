import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getMarsHeight } from './MarsTerrain';
import {
  Mission,
  oppyPosition as defaultOppyPosition,
  arrivalRadius as defaultArrivalRadius,
  OPPY_REVEAL_DISTANCE,
  OPPY_TRACK_WAYPOINTS,
} from '../data/missions';

interface DiscoveryMarkersProps {
  roverPosRef?: React.MutableRefObject<THREE.Vector3>;
  roverPosition?: [number, number, number];
  mission: Mission;
  passedCheckpoints: string[];
  discoveredIds: string[];
  onPassCheckpoint: (id: string) => void;
  onNearDiscovery: (discoveryId: string | null) => void;
  onHint?: (message: string) => void;
}

interface TrackStep {
  id: string;
  x: number;
  y: number;
  z: number;
  angleY: number;
  segmentIndex: number;
  isWaypointMarker: boolean;
}

export const DiscoveryMarkers: React.FC<DiscoveryMarkersProps> = ({
  roverPosRef,
  roverPosition,
  mission,
  passedCheckpoints,
  discoveredIds,
  onPassCheckpoint,
  onNearDiscovery,
  onHint,
}) => {
  const beaconRingsRef = useRef<THREE.Mesh[]>([]);
  const trackGlowMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const prevNearIdRef = useRef<string | null>(null);
  const fallbackRoverVecRef = useRef(new THREE.Vector3());

 
  const [isOppyRevealed, setIsOppyRevealed] = useState(false);
  const isOppyRevealedRef = useRef(false);

  const hasShownKeepFollowingHintRef = useRef(false);
  const hasShownSeeSomethingHintRef = useRef(false);

 
  useEffect(() => {
    setIsOppyRevealed(false);
    isOppyRevealedRef.current = false;
    hasShownKeepFollowingHintRef.current = false;
    hasShownSeeSomethingHintRef.current = false;
    prevNearIdRef.current = null;
  }, [mission.id]);

  const oppyCoords = mission.oppyPosition ?? defaultOppyPosition;
  const oppyTriggerRadius = mission.arrivalRadius ?? defaultArrivalRadius;

  
  const discoveryTargets = useMemo(
    () => [
      {
        id: 'martian-blueberries',
        title: 'Martian "Blueberries"',
        x: 10,
        z: -12,
        triggerRadius: 4.2,
        icon: '🔵',
      },
      {
        id: 'insight-lander',
        title: 'InSight Lander',
        x: 23,
        z: -4,
        triggerRadius: 4.2,
        icon: '📡',
      },
      {
        id: 'purgatory-ripple',
        title: 'Dune Sand Ripple',
        x: 4,
        z: -14,
        triggerRadius: 5.0,
        icon: '🏜️',
      },
      {
        id: 'solar-sun-chase',
        title: 'Sunny Ridge Crest',
        x: -16,
        z: -18,
        triggerRadius: 5.0,
        icon: '☀️',
      },
      {
        id: 'future-mars-base',
        title: 'Base Concept Site',
        x: -24,
        z: -26,
        triggerRadius: 5.0,
        icon: '🏗️',
      },
      {
        id: 'oppy-perseverance-valley',
        title: 'Opportunity (Oppy)',
        x: oppyCoords[0],
        z: oppyCoords[2],
        triggerRadius: oppyTriggerRadius,
        icon: '🤖',
      },
    ],
    [oppyCoords, oppyTriggerRadius]
  );

 
  const trackSteps = useMemo<TrackStep[]>(() => {
    if (mission.type !== 'tracks') return [];
    const steps: TrackStep[] = [];
    const stepSpacing = 2.6;

    for (let segIdx = 0; segIdx < OPPY_TRACK_WAYPOINTS.length - 1; segIdx++) {
      const [x0, z0] = OPPY_TRACK_WAYPOINTS[segIdx];
      const [x1, z1] = OPPY_TRACK_WAYPOINTS[segIdx + 1];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const segLength = Math.hypot(dx, dz);
      const angleY = Math.atan2(dx, dz);
      const numSteps = Math.max(2, Math.floor(segLength / stepSpacing));

      for (let i = 0; i < numSteps; i++) {
        const t = i / numSteps;
        
        const curveOffset = Math.sin(t * Math.PI) * (segIdx % 2 === 0 ? 1.4 : -1.4);
        const perpX = Math.cos(angleY) * curveOffset;
        const perpZ = -Math.sin(angleY) * curveOffset;

        const wx = x0 + dx * t + perpX;
        const wz = z0 + dz * t + perpZ;
        const wy = getMarsHeight(wx, wz) + 0.06;

        steps.push({
          id: `seg-${segIdx}-step-${i}`,
          x: wx,
          y: wy,
          z: wz,
          angleY,
          segmentIndex: segIdx,
          isWaypointMarker: i === 0 && segIdx > 0,
        });
      }
    }
    return steps;
  }, [mission.type]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const roverVec = roverPosRef
      ? roverPosRef.current
      : roverPosition
      ? fallbackRoverVecRef.current.set(...roverPosition)
      : fallbackRoverVecRef.current;

  
    beaconRingsRef.current.forEach((ring, idx) => {
      if (ring) {
        const s = 1 + Math.sin(t * 3 + idx) * 0.15;
        ring.scale.set(s, s, 1);
      }
    });

  
    trackGlowMaterialsRef.current.forEach((mat, idx) => {
      if (mat) {
        mat.emissiveIntensity = 0.85 + Math.sin(t * 2.5 + idx * 0.6) * 0.3;
      }
    });

    
    if (mission.type === 'drive' && mission.checkpoints) {
      mission.checkpoints.forEach((cp) => {
        if (!passedCheckpoints.includes(cp.id)) {
          const cpVec = new THREE.Vector3(cp.x, getMarsHeight(cp.x, cp.z), cp.z);
          if (roverVec.distanceTo(cpVec) < cp.radius) {
            onPassCheckpoint(cp.id);
          }
        }
      });
    }

    
    if (mission.type === 'tracks') {
      const oppyWorldY = getMarsHeight(oppyCoords[0], oppyCoords[2]);
      const oppyWorldVec = new THREE.Vector3(oppyCoords[0], oppyWorldY, oppyCoords[2]);
      const distToOppy = roverVec.distanceTo(oppyWorldVec);

      const startWorldY = getMarsHeight(mission.startPosition[0], mission.startPosition[2]);
      const startWorldVec = new THREE.Vector3(
        mission.startPosition[0],
        startWorldY,
        mission.startPosition[2]
      );
      const distFromStart = roverVec.distanceTo(startWorldVec);

      
      const shouldReveal = distToOppy <= OPPY_REVEAL_DISTANCE;
      if (shouldReveal !== isOppyRevealedRef.current) {
        isOppyRevealedRef.current = shouldReveal;
        setIsOppyRevealed(shouldReveal);
      }

     
      if (
        !hasShownKeepFollowingHintRef.current &&
        distFromStart > 22 &&
        distToOppy > OPPY_REVEAL_DISTANCE + 10
      ) {
        hasShownKeepFollowingHintRef.current = true;
        if (onHint) {
          onHint('Keep following the tracks!');
        }
      }

      
      if (
        !hasShownSeeSomethingHintRef.current &&
        distToOppy <= OPPY_REVEAL_DISTANCE &&
        distToOppy > oppyTriggerRadius
      ) {
        hasShownSeeSomethingHintRef.current = true;
        if (onHint) {
          onHint('I think I see something ahead...');
        }
      }
    }

  
    const missionStartVec = new THREE.Vector3(
      mission.startPosition[0],
      getMarsHeight(mission.startPosition[0], mission.startPosition[2]),
      mission.startPosition[2]
    );
    const distFromMissionSpawn = roverVec.distanceTo(missionStartVec);

    let nearestDiscoveryId: string | null = null;
    let nearestDist = Infinity;

    if (distFromMissionSpawn > 5.0) {
      discoveryTargets.forEach((target) => {
        if (mission.discoveryIds.includes(target.id) && !discoveredIds.includes(target.id)) {
          const targetWorldVec = new THREE.Vector3(
            target.x,
            getMarsHeight(target.x, target.z),
            target.z
          );
          const dist = roverVec.distanceTo(targetWorldVec);
          if (dist < target.triggerRadius && dist < nearestDist) {
            nearestDiscoveryId = target.id;
            nearestDist = dist;
          }
        }
      });
    }

    if (nearestDiscoveryId !== prevNearIdRef.current) {
      prevNearIdRef.current = nearestDiscoveryId;
      onNearDiscovery(nearestDiscoveryId);
    }
  });

  return (
    <group>
     
      {mission.type === 'drive' &&
        mission.checkpoints?.map((cp, idx) => {
          const isPassed = passedCheckpoints.includes(cp.id);
          const y = getMarsHeight(cp.x, cp.z) + 1.8;

          return (
            <group key={cp.id} position={[cp.x, y, cp.z]}>
             
              <mesh
                ref={(el) => {
                  if (el) beaconRingsRef.current[idx] = el;
                }}
                rotation={[0, 0, 0]}
              >
                <torusGeometry args={[cp.radius * 0.7, 0.18, 16, 32]} />
                <meshStandardMaterial
                  color={isPassed ? '#10B981' : '#F59E0B'}
                  emissive={isPassed ? '#059669' : '#D97706'}
                  emissiveIntensity={1.2}
                  roughness={0.2}
                />
              </mesh>

             
              <pointLight
                color={isPassed ? '#34D399' : '#FBBF24'}
                intensity={2}
                distance={8}
              />

             
              {!isPassed && (
                <Html position={[0, cp.radius * 0.85, 0]} center distanceFactor={15}>
                  <div className="px-2.5 py-1 rounded-full text-xs font-bold border shadow-md whitespace-nowrap bg-amber-950/90 text-amber-200 border-amber-400/40 pointer-events-none select-none">
                    {cp.label}
                  </div>
                </Html>
              )}
            </group>
          );
        })}

      
      {discoveryTargets.map((target) => {
        const isMissionRelevant = mission.discoveryIds.includes(target.id);
        if (!isMissionRelevant) return null;

       
        if (target.id === 'oppy-perseverance-valley' && !isOppyRevealed) {
          return null;
        }

        const isFound = discoveredIds.includes(target.id);
        const y = getMarsHeight(target.x, target.z) + 0.5;

        return (
          <group key={target.id} position={[target.x, y, target.z]}>
          
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.8, 32]} />
              <meshBasicMaterial
                color={isFound ? '#10B981' : '#F97316'}
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>

           
            {!isFound && (
              <mesh position={[0, 3, 0]}>
                <cylinderGeometry args={[0.08, 0.4, 6, 16]} />
                <meshBasicMaterial
                  color="#FB923C"
                  transparent
                  opacity={0.4}
                />
              </mesh>
            )}

            
            {target.id === 'martian-blueberries' && (
              <group position={[0, 0.2, 0]}>
                <mesh position={[0, 0.15, 0]} castShadow>
                  <dodecahedronGeometry args={[0.65, 1]} />
                  <meshStandardMaterial color="#C85A28" roughness={0.6} />
                </mesh>
                {[-0.55, 0, 0.55, -0.3, 0.4, 0.15].map((off, i) => (
                  <mesh key={i} position={[off, 0.35 + (i % 2) * 0.15, Math.sin(i * 1.4) * 0.45]}>
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshStandardMaterial
                      color="#60A5FA"
                      emissive="#1D4ED8"
                      emissiveIntensity={0.45}
                      metalness={0.75}
                      roughness={0.2}
                    />
                  </mesh>
                ))}
              </group>
            )}

            {target.id === 'insight-lander' && (
              <group position={[0, 0.25, 0]}>
                <mesh position={[0, 0.3, 0]} castShadow>
                  <dodecahedronGeometry args={[0.85, 1]} />
                  <meshStandardMaterial
                    color="#94A3B8"
                    emissive="#475569"
                    emissiveIntensity={0.3}
                    metalness={0.65}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            )}

            {target.id === 'oppy-perseverance-valley' && (
              
              <group position={[0, 0.3, 0]} rotation={[0.08, 0.4, 0.05]}>
                <pointLight color="#FDE047" intensity={2.5} distance={14} position={[0, 2.2, 0]} />
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[1.2, 0.3, 1.3]} />
                  <meshStandardMaterial color="#C59B27" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.38, 0]}>
                  <boxGeometry args={[1.6, 0.05, 1.7]} />
                  <meshStandardMaterial color="#2B3A42" metalness={0.7} />
                </mesh>
               
                <mesh position={[0.2, 0.6, 0.3]} rotation={[-0.2, 0, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
                  <meshStandardMaterial color="#A37E2C" />
                </mesh>
              </group>
            )}

            
            {!isFound && (
              <Html position={[0, 2.6, 0]} center distanceFactor={15}>
                <div className="px-2.5 py-1 rounded-full text-xs font-bold border shadow-md flex items-center gap-1 whitespace-nowrap bg-[#48170B]/90 text-amber-200 border-amber-400/50 pointer-events-none select-none">
                  <span>{target.icon}</span>
                  <span>{target.title}</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      
      {mission.type === 'solar' && (
        <group position={[-16, getMarsHeight(-16, -18), -18]}>
          
          <mesh position={[0, 22, 0]}>
            <cylinderGeometry args={[5.0, 9.5, 44, 32, 1, true]} />
            <meshBasicMaterial
              color="#FDE047"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          
          <mesh position={[0, 20, 0]}>
            <cylinderGeometry args={[2.5, 6.0, 40, 24, 1, true]} />
            <meshBasicMaterial
              color="#FEF08A"
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <circleGeometry args={[9.5, 36]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>

         
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
            <ringGeometry args={[8.6, 9.5, 36]} />
            <meshBasicMaterial
              color="#FBBF24"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>

          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
            <ringGeometry args={[3.2, 3.8, 24]} />
            <meshBasicMaterial
              color="#FEF08A"
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          
          <pointLight color="#FDE047" intensity={3.5} distance={24} position={[0, 3, 0]} />
        </group>
      )}

      
      {mission.type === 'tracks' && (
        <group>
          {trackSteps.map((step, idx) => (
            <group
              key={step.id}
              position={[step.x, step.y, step.z]}
              rotation={[0, step.angleY, 0]}
            >
             
              <mesh position={[-0.85, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.36, 2.5]} />
                <meshStandardMaterial
                  ref={(el) => {
                    if (el && idx % 6 === 0) {
                      trackGlowMaterialsRef.current[idx] = el;
                    }
                  }}
                  color="#FDE68A"
                  emissive="#F59E0B"
                  emissiveIntensity={0.85}
                  transparent
                  opacity={0.78}
                  side={THREE.DoubleSide}
                />
              </mesh>

             
              <mesh position={[0.85, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.36, 2.5]} />
                <meshStandardMaterial
                  color="#FDE68A"
                  emissive="#F59E0B"
                  emissiveIntensity={0.85}
                  transparent
                  opacity={0.78}
                  side={THREE.DoubleSide}
                />
              </mesh>

              
              <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.3, 2.6]} />
                <meshBasicMaterial
                  color="#FBBF24"
                  transparent
                  opacity={0.22}
                  side={THREE.DoubleSide}
                />
              </mesh>

            
              {step.isWaypointMarker && (
                <group position={[0, 0.25, 0]}>
                  <pointLight color="#FBBF24" intensity={1.8} distance={16} />
                  <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.5, 2.1, 24]} />
                    <meshBasicMaterial
                      color="#FDE047"
                      transparent
                      opacity={0.55}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                </group>
              )}
            </group>
          ))}
        </group>
      )}
    </group>
  );
};
