import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { THEME_COLORS } from '../config';
import { MarsTerrain, getMarsHeight, TERRAIN_ROCKS, RockHitState } from './MarsTerrain';
import { Rover } from './Rover';
import { Gems } from './Gems';
import { DiscoveryMarkers } from './DiscoveryMarkers';
import { useGame } from '../state/GameContext';
import { TouchInputState } from '../ui/TouchControls';
import { solarAudio } from './solarAudio';

interface MarsGameSceneProps {
  touchInput: TouchInputState;
  onNearDiscoveryChange: (targetId: string | null) => void;
}


const DISCOVERY_ROCK_COLLIDERS = [
  { x: 10, z: -12, radius: 0.75 },
  { x: 23, z: -4, radius: 0.9 },
];


const GamePhysicsController: React.FC<{
  touchInput: TouchInputState;
  onNearDiscoveryChange: (targetId: string | null) => void;
  lastRockHitRef: React.MutableRefObject<RockHitState | null>;
}> = ({ touchInput, onNearDiscoveryChange, lastRockHitRef }) => {
  const { state, dispatch, currentMission } = useGame();
  const { camera } = useThree();

 
  const roverPosRef = useRef<THREE.Vector3>(
    new THREE.Vector3(
      currentMission.startPosition[0],
      getMarsHeight(currentMission.startPosition[0], currentMission.startPosition[2]),
      currentMission.startPosition[2]
    )
  );
  const prevRoverPosRef = useRef<THREE.Vector3>(
    new THREE.Vector3(
      currentMission.startPosition[0],
      getMarsHeight(currentMission.startPosition[0], currentMission.startPosition[2]),
      currentMission.startPosition[2]
    )
  );
  const roverHeadingRef = useRef<number>(0);
  const roverSpeedRef = useRef<number>(0);
  const terrainPitchRef = useRef<number>(0);
  const terrainRollRef = useRef<number>(0);
  const verticalVelRef = useRef<number>(0);
  const suspensionOffsetRef = useRef<number>(0);
  const impactIntensityRef = useRef<number>(0);
  const recoilVelRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const hasInitThirdCamRef = useRef<boolean>(false);
  const fpvTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const fpvYawOffsetRef = useRef<number>(0);
  const fpvPitchOffsetRef = useRef<number>(0);
  const isPointerDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevCameraModeRef = useRef<string>(state.cameraMode);
  const distanceAccRef = useRef<number>(0);
  const batteryAccRef = useRef<number>(0);
  const lastStateSyncRef = useRef<number>(0);


  useEffect(() => {
    const startX = currentMission.startPosition[0];
    const startZ = currentMission.startPosition[2];
    const startY = getMarsHeight(startX, startZ);
    roverPosRef.current.set(startX, startY, startZ);
    prevRoverPosRef.current.set(startX, startY, startZ);
    roverHeadingRef.current = 0;
    roverSpeedRef.current = 0;
    terrainPitchRef.current = 0;
    terrainRollRef.current = 0;
    verticalVelRef.current = 0;
    suspensionOffsetRef.current = 0;
    impactIntensityRef.current = 0;
    recoilVelRef.current = { x: 0, z: 0 };
    fpvYawOffsetRef.current = 0;
    fpvPitchOffsetRef.current = 0;
    hasInitThirdCamRef.current = false;
  }, [currentMission, state.missionAttempt]);


  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (state.cameraMode !== 'fpv') return;
      isPointerDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDraggingRef.current || state.cameraMode !== 'fpv') return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      fpvYawOffsetRef.current -= dx * 0.0045;
      fpvPitchOffsetRef.current = THREE.MathUtils.clamp(
        fpvPitchOffsetRef.current - dy * 0.02,
        -3.5,
        4.5
      );
    };
    const onPointerUp = () => {
      isPointerDraggingRef.current = false;
    };
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [state.cameraMode]);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        dispatch({ type: 'TOGGLE_CAMERA_MODE' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

 
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const lastRockDirRef = useRef<'forward' | 'backward' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

     
      if (e.key.toLowerCase() === 'e' && state.nearScanTargetId) {
        dispatch({ type: 'TRIGGER_SCAN', discoveryId: state.nearScanTargetId });
      }

     
      if (currentMission.type === 'stuck' && !state.isFreedFromSand) {
        if (e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') {
          if (lastRockDirRef.current !== 'forward') {
            lastRockDirRef.current = 'forward';
            dispatch({ type: 'ROCK_ROVER', direction: 'forward' });
          }
        } else if (e.key.toLowerCase() === 's' || e.key === 'ArrowDown') {
          if (lastRockDirRef.current !== 'backward') {
            lastRockDirRef.current = 'backward';
            dispatch({ type: 'ROCK_ROVER', direction: 'backward' });
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, state.nearScanTargetId, currentMission.type, state.isFreedFromSand]);


  useFrame((frameState, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const keys = keysRef.current;
    const forwardKey = keys['w'] || keys['arrowup'] || touchInput.forward;
    const backwardKey = keys['s'] || keys['arrowdown'] || touchInput.backward;
    const leftKey = keys['a'] || keys['arrowleft'] || touchInput.left;
    const rightKey = keys['d'] || keys['arrowright'] || touchInput.right;

    let desiredSpeed = 0;
    const maxSpeed = currentMission.type === 'tracks' ? 10.0 : 8.5;
    const turnRate = 2.4;

   
    if (currentMission.type === 'stuck' && !state.isFreedFromSand) {
      if (forwardKey || backwardKey) {
        desiredSpeed = forwardKey ? 0.45 : -0.45;
      }
    } else {
      if (forwardKey) desiredSpeed = maxSpeed;
      else if (backwardKey) desiredSpeed = -maxSpeed * 0.65;
    }

   
    if (leftKey) roverHeadingRef.current += turnRate * delta;
    if (rightKey) roverHeadingRef.current -= turnRate * delta;

   
    const fwdX = Math.sin(roverHeadingRef.current);
    const fwdZ = Math.cos(roverHeadingRef.current);
    const rightX = Math.cos(roverHeadingRef.current);
    const rightZ = -Math.sin(roverHeadingRef.current);
    const sampleDist = 0.85;

    const hFront = getMarsHeight(
      roverPosRef.current.x + fwdX * sampleDist,
      roverPosRef.current.z + fwdZ * sampleDist
    );
    const hBack = getMarsHeight(
      roverPosRef.current.x - fwdX * sampleDist,
      roverPosRef.current.z - fwdZ * sampleDist
    );
    const hLeft = getMarsHeight(
      roverPosRef.current.x - rightX * sampleDist,
      roverPosRef.current.z - rightZ * sampleDist
    );
    const hRight = getMarsHeight(
      roverPosRef.current.x + rightX * sampleDist,
      roverPosRef.current.z + rightZ * sampleDist
    );

    const slopeRise = hFront - hBack;
    const slopePitch = -Math.atan2(slopeRise, sampleDist * 2);
    const slopeRoll = Math.atan2(hLeft - hRight, sampleDist * 2);
    terrainPitchRef.current = slopePitch;
    terrainRollRef.current = slopeRoll;

 
    const currentSpeed = roverSpeedRef.current;
    let nextSpeed = currentSpeed;

    const moveTowards = (curr: number, target: number, maxStep: number) => {
      if (Math.abs(target - curr) <= maxStep) return target;
      return curr + Math.sign(target - curr) * maxStep;
    };

    if (Math.abs(desiredSpeed) > 0.01) {
      const isBraking = currentSpeed * desiredSpeed < 0;
      const rate = isBraking ? 18.0 : 12.0;
      nextSpeed = moveTowards(currentSpeed, desiredSpeed, rate * delta);
    } else {
      
      nextSpeed = moveTowards(currentSpeed, 0, 6.8 * delta);
    }

   
    if (!(currentMission.type === 'stuck' && !state.isFreedFromSand)) {
      const slopeGravityAccel = - (slopeRise / (sampleDist * 2)) * 8.5;
      if (Math.abs(desiredSpeed) > 0.01 || Math.abs(nextSpeed) > 0.25) {
        nextSpeed = THREE.MathUtils.clamp(
          nextSpeed + slopeGravityAccel * delta,
          -maxSpeed * 0.8,
          maxSpeed * 1.28
        );
      }
    }

    roverSpeedRef.current = nextSpeed;
    const isMoving = Math.abs(nextSpeed) > 0.04;

    
    if (impactIntensityRef.current > 0) {
      impactIntensityRef.current = Math.max(0, impactIntensityRef.current - delta * 2.6);
    }

   
    if (Math.abs(recoilVelRef.current.x) > 0.01 || Math.abs(recoilVelRef.current.z) > 0.01) {
      roverPosRef.current.x += recoilVelRef.current.x * delta;
      roverPosRef.current.z += recoilVelRef.current.z * delta;
      const damp = Math.exp(-delta * 8);
      recoilVelRef.current.x *= damp;
      recoilVelRef.current.z *= damp;
    }

   
    if (state.screen === 'playing') {
      solarAudio.updateRoverDrive(nextSpeed);
    } else {
      solarAudio.stopRoverDrive();
    }

    const oldGroundY = getMarsHeight(roverPosRef.current.x, roverPosRef.current.z);

    if (isMoving) {
      const moveDist = nextSpeed * delta;
      roverPosRef.current.x += fwdX * moveDist;
      roverPosRef.current.z += fwdZ * moveDist;

     
      const odometerScale = currentMission.type === 'tracks' ? 2.0 : 1.0;
      distanceAccRef.current += Math.abs(moveDist) * odometerScale;
      if (distanceAccRef.current >= 0.8) {
        dispatch({ type: 'ADD_DISTANCE', meters: distanceAccRef.current });
        distanceAccRef.current = 0;
      }
    }

    
    const roverRadius = 0.82;
    const rx = roverPosRef.current.x;
    const rz = roverPosRef.current.z;

    for (let i = 0; i < TERRAIN_ROCKS.length; i++) {
      const rock = TERRAIN_ROCKS[i];
      const dx = rx - rock.x;
      const dz = rz - rock.z;
      const minSep = roverRadius + rock.radius;
     
      if (Math.abs(dx) < minSep && Math.abs(dz) < minSep) {
        const dist = Math.hypot(dx, dz);
        if (dist < minSep && dist > 0.0001) {
          const nx = dx / dist;
          const nz = dz / dist;
          const overlap = minSep - dist;

          
          roverPosRef.current.x += nx * (overlap + 0.04);
          roverPosRef.current.z += nz * (overlap + 0.04);

         
          recoilVelRef.current.x = nx * 4.2;
          recoilVelRef.current.z = nz * 4.2;
          roverSpeedRef.current *= -0.35;
          impactIntensityRef.current = 1.0;
          lastRockHitRef.current = {
            rockIndex: rock.index,
            hitTime: frameState.clock.getElapsedTime(),
            dirX: -nx,
            dirZ: -nz,
          };
          solarAudio.playRockImpact(Math.min(1.2, 0.5 + rock.scale * 0.4));
          break;
        }
      }
    }

  
    if (currentMission.number === 2) {
      for (let i = 0; i < DISCOVERY_ROCK_COLLIDERS.length; i++) {
        const dRock = DISCOVERY_ROCK_COLLIDERS[i];
        const dx = roverPosRef.current.x - dRock.x;
        const dz = roverPosRef.current.z - dRock.z;
        const minSep = roverRadius + dRock.radius;
        if (Math.abs(dx) < minSep && Math.abs(dz) < minSep) {
          const dist = Math.hypot(dx, dz);
          if (dist < minSep && dist > 0.0001) {
            const nx = dx / dist;
            const nz = dz / dist;
            const overlap = minSep - dist;
            roverPosRef.current.x += nx * (overlap + 0.04);
            roverPosRef.current.z += nz * (overlap + 0.04);
            recoilVelRef.current.x = nx * 4.0;
            recoilVelRef.current.z = nz * 4.0;
            roverSpeedRef.current *= -0.35;
            impactIntensityRef.current = 1.0;
            solarAudio.playRockImpact(0.95);
            break;
          }
        }
      }
    }

 
    const newGroundY = getMarsHeight(roverPosRef.current.x, roverPosRef.current.z);
    const groundRate = (newGroundY - oldGroundY) / Math.max(delta, 0.008);
    if (Math.abs(groundRate) > 1.8 && isMoving) {
      verticalVelRef.current += THREE.MathUtils.clamp(groundRate * 0.12, -0.8, 1.1);
    }
   
    const springForce = -suspensionOffsetRef.current * 28.0 - verticalVelRef.current * 8.5;
    verticalVelRef.current += springForce * delta;
    suspensionOffsetRef.current = THREE.MathUtils.clamp(
      suspensionOffsetRef.current + verticalVelRef.current * delta,
      -0.12,
      0.35
    );
    roverPosRef.current.y = newGroundY + Math.max(0, suspensionOffsetRef.current);

   
    const now = state.missionTimeSeconds;
    if (now - lastStateSyncRef.current > 0.25) {
      lastStateSyncRef.current = now;
      if (distanceAccRef.current > 0) {
        dispatch({ type: 'ADD_DISTANCE', meters: distanceAccRef.current });
        distanceAccRef.current = 0;
      }
      if (
        Math.abs(roverPosRef.current.x - state.roverPosition[0]) > 0.5 ||
        Math.abs(roverPosRef.current.z - state.roverPosition[2]) > 0.5 ||
        Math.abs(roverHeadingRef.current - state.roverHeading) > 0.08
      ) {
        dispatch({
          type: 'UPDATE_ROVER_TRANSFORM',
          position: [roverPosRef.current.x, roverPosRef.current.y, roverPosRef.current.z],
          heading: roverHeadingRef.current,
        });
      }
    }

    
    if (currentMission.type === 'solar') {
      const distToSunbeam = Math.hypot(roverPosRef.current.x + 16, roverPosRef.current.z + 18);
      const inSunbeam = distToSunbeam < 9.5;

      if (inSunbeam && state.batteryLevel < 100) {
        batteryAccRef.current += delta * 25;
        if (batteryAccRef.current >= 1.0) {
          dispatch({ type: 'UPDATE_BATTERY', amount: batteryAccRef.current });
          batteryAccRef.current = 0;
        }
        if (!state.isChargingSolar) {
          dispatch({ type: 'SET_CHARGING_SOLAR', isCharging: true });
        }
        solarAudio.startCharging(state.batteryLevel);
      } else if (inSunbeam && state.batteryLevel >= 100) {
        if (batteryAccRef.current > 0) {
          dispatch({ type: 'UPDATE_BATTERY', amount: batteryAccRef.current });
          batteryAccRef.current = 0;
        }
        if (state.isChargingSolar) {
          dispatch({ type: 'SET_CHARGING_SOLAR', isCharging: false });
        }
        solarAudio.playFullyChargedChime();
      } else {
        if (state.isChargingSolar) {
          dispatch({ type: 'SET_CHARGING_SOLAR', isCharging: false });
        }
        solarAudio.stopCharging();
      }
    } else {
      solarAudio.stopCharging();
    }

   
    const isFPV = state.cameraMode === 'fpv';
    const elapsedClock = frameState.clock.getElapsedTime();
    const shakeAmt = impactIntensityRef.current > 0.02 ? impactIntensityRef.current * 0.14 : 0;
    const shakeX = shakeAmt > 0 ? Math.sin(elapsedClock * 55) * shakeAmt : 0;
    const shakeY = shakeAmt > 0 ? Math.cos(elapsedClock * 62) * shakeAmt : 0;

   
    const moveDeltaX = roverPosRef.current.x - prevRoverPosRef.current.x;
    const moveDeltaY = roverPosRef.current.y - prevRoverPosRef.current.y;
    const moveDeltaZ = roverPosRef.current.z - prevRoverPosRef.current.z;
    prevRoverPosRef.current.copy(roverPosRef.current);

    if (isFPV) {
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      const lookAngle = roverHeadingRef.current + fpvYawOffsetRef.current;
      const forwardX = Math.sin(lookAngle);
      const forwardZ = Math.cos(lookAngle);

     
      const mastX = roverPosRef.current.x + Math.sin(roverHeadingRef.current) * 0.42 + shakeX;
      const mastY = roverPosRef.current.y + 1.52 + shakeY;
      const mastZ = roverPosRef.current.z + Math.cos(roverHeadingRef.current) * 0.42;

    
      const t = state.missionTimeSeconds;
      const bobY = isMoving ? Math.sin(t * 14) * 0.018 : Math.sin(t * 2) * 0.003;

      const targetCamPos = new THREE.Vector3(mastX, mastY + bobY, mastZ);

      if (prevCameraModeRef.current !== 'fpv') {
        camera.position.copy(targetCamPos);
      } else {
        camera.position.lerp(targetCamPos, 0.45);
      }

      
      const lookDist = 14;
      const lookX = targetCamPos.x + forwardX * lookDist;
      const lookY = targetCamPos.y - 0.38 + fpvPitchOffsetRef.current;
      const lookZ = targetCamPos.z + forwardZ * lookDist;

      const targetLook = new THREE.Vector3(lookX, lookY, lookZ);

      if (prevCameraModeRef.current !== 'fpv') {
        fpvTargetRef.current.copy(targetLook);
      } else {
        fpvTargetRef.current.lerp(targetLook, 0.4);
      }

      camera.lookAt(fpvTargetRef.current);

      
      let targetRoll = 0;
      if (leftKey) targetRoll = 0.035;
      if (rightKey) targetRoll = -0.035;
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRoll, 0.1);
    } else {
     
      if (controlsRef.current) {
        controlsRef.current.enabled = true;

        if (prevCameraModeRef.current === 'fpv' || !hasInitThirdCamRef.current) {
          hasInitThirdCamRef.current = true;
          const forwardX = Math.sin(roverHeadingRef.current);
          const forwardZ = Math.cos(roverHeadingRef.current);
          camera.position.set(
            roverPosRef.current.x - forwardX * 6.8,
            roverPosRef.current.y + 3.8,
            roverPosRef.current.z - forwardZ * 6.8
          );
          controlsRef.current.target.set(
            roverPosRef.current.x,
            roverPosRef.current.y + 0.85,
            roverPosRef.current.z
          );
        } else {
        
          camera.position.x += moveDeltaX;
          camera.position.y += moveDeltaY;
          camera.position.z += moveDeltaZ;
          controlsRef.current.target.lerp(
            new THREE.Vector3(
              roverPosRef.current.x + shakeX,
              roverPosRef.current.y + 0.85 + shakeY,
              roverPosRef.current.z
            ),
            0.18
          );
        }

        controlsRef.current.update();
      }
    }

    prevCameraModeRef.current = state.cameraMode;
  });

  
  useEffect(() => {
    return () => {
      solarAudio.stopCharging();
      solarAudio.stopRoverDrive();
    };
  }, []);

  return (
    <>
      
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        screenSpacePanning
        zoomSpeed={1.1}
        rotateSpeed={0.9}
        panSpeed={0.8}
        minDistance={2.5}
        maxDistance={38}
        maxPolarAngle={Math.PI / 2.04}
        dampingFactor={0.08}
        enableDamping
      />

     
      <Rover
        roverPosRef={roverPosRef}
        roverHeadingRef={roverHeadingRef}
        roverSpeedRef={roverSpeedRef}
        impactIntensityRef={impactIntensityRef}
        terrainPitchRef={terrainPitchRef}
        terrainRollRef={terrainRollRef}
        isCharging={state.isChargingSolar}
        isFPV={state.cameraMode === 'fpv'}
      />

      
      <Gems
        key={`gems-${currentMission.number}-${state.missionAttempt}`}
        roverPosRef={roverPosRef}
        missionNumber={currentMission.number}
        gemCount={currentMission.gemCount}
        onCollect={() => {
          solarAudio.playGemCollect();
          dispatch({ type: 'COLLECT_GEM' });
        }}
      />

      
      <DiscoveryMarkers
        key={`markers-${currentMission.number}-${state.missionAttempt}`}
        roverPosRef={roverPosRef}
        mission={currentMission}
        passedCheckpoints={state.passedCheckpoints}
        discoveredIds={state.discoveredIds}
        onPassCheckpoint={(id) => dispatch({ type: 'PASS_CHECKPOINT', id })}
        onNearDiscovery={onNearDiscoveryChange}
        onHint={(message) => dispatch({ type: 'SHOW_HINT', message })}
      />
    </>
  );
};

export const MarsGameScene: React.FC<MarsGameSceneProps> = ({
  touchInput,
  onNearDiscoveryChange,
}) => {
  const lastRockHitRef = useRef<RockHitState | null>(null);

  return (
    <div
      className="w-full h-full relative touch-none"
      style={{ backgroundColor: THEME_COLORS.skyHaze }}
    >
      <Canvas
        camera={{ position: [0, 4.2, -6.8], fov: 68, near: 0.08, far: 500 }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(THEME_COLORS.skyHaze);
       
          scene.fog = new THREE.FogExp2(THEME_COLORS.skyHaze, 0.0085);
        }}
      >
       
        <ambientLight intensity={0.95} color="#ffffff" />
        <directionalLight
          position={[-30, 50, -20]}
          intensity={1.35}
          color="#fffaf0"
          castShadow
        />
        
        <hemisphereLight args={['#FFFAED', '#c1440e', 0.5]} />

        
        <MarsTerrain lastRockHitRef={lastRockHitRef} />

       
        <GamePhysicsController
          touchInput={touchInput}
          onNearDiscoveryChange={onNearDiscoveryChange}
          lastRockHitRef={lastRockHitRef}
        />
      </Canvas>
    </div>
  );
};
