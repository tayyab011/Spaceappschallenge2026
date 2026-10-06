import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoverProps {
  roverPosRef?: React.MutableRefObject<THREE.Vector3>;
  roverHeadingRef?: React.MutableRefObject<number>;
  roverSpeedRef?: React.MutableRefObject<number>;
  impactIntensityRef?: React.MutableRefObject<number>;
  terrainPitchRef?: React.MutableRefObject<number>;
  terrainRollRef?: React.MutableRefObject<number>;
  position?: [number, number, number];
  rotationY?: number;
  isMoving?: boolean;
  driveSpeed?: number; 
  isCharging?: boolean;
  isFPV?: boolean;
}

export const Rover: React.FC<RoverProps> = ({
  roverPosRef,
  roverHeadingRef,
  roverSpeedRef,
  impactIntensityRef,
  terrainPitchRef,
  terrainRollRef,
  position,
  rotationY,
  isMoving = false,
  driveSpeed = 0,
  isCharging = false,
  isFPV = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const mastHeadRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const solarGlowRef = useRef<THREE.Mesh>(null);
  const impactEffectGroupRef = useRef<THREE.Group>(null);
  const impactRingMatRef = useRef<THREE.MeshBasicMaterial>(null);


  useFrame((state, delta) => {
    const impact = impactIntensityRef ? impactIntensityRef.current : 0;
    const slopePitch = terrainPitchRef ? terrainPitchRef.current : 0;
    const slopeRoll = terrainRollRef ? terrainRollRef.current : 0;

    if (groupRef.current) {
      if (roverPosRef) {
        groupRef.current.position.copy(roverPosRef.current);
      } else if (position) {
        groupRef.current.position.set(...position);
      }
      if (roverHeadingRef) {
        groupRef.current.rotation.order = 'YXZ';
        groupRef.current.rotation.y = roverHeadingRef.current;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          slopePitch,
          0.22
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          slopeRoll,
          0.22
        );
      } else if (rotationY !== undefined) {
        groupRef.current.rotation.y = rotationY;
      }
    }

    const currentSpeed = roverSpeedRef ? roverSpeedRef.current : driveSpeed;
    const moving = Math.abs(currentSpeed) > 0.05 || isMoving;

   
    if (moving && wheelsRef.current.length > 0) {
      const wheelRoll = currentSpeed * delta * 5.0;
      wheelsRef.current.forEach((wheel) => {
        if (wheel) wheel.rotation.x += wheelRoll;
      });
    }

  
    if (chassisRef.current) {
      const t = state.clock.getElapsedTime();
      const baseTilt = moving ? Math.sin(t * 12) * 0.03 : Math.sin(t * 2) * 0.008;
      const impactPitch = impact > 0.01 ? -Math.sin(impact * Math.PI) * 0.22 : 0;
      const impactRoll = impact > 0.01 ? Math.sin(t * 45) * 0.14 * impact : 0;
      const impactHop = impact > 0.01 ? Math.sin(impact * Math.PI) * 0.16 : 0;

      chassisRef.current.rotation.z = baseTilt + impactRoll;
      chassisRef.current.rotation.x = impactPitch;
      chassisRef.current.position.y = 0.55 + impactHop;
    }

    
    if (impactEffectGroupRef.current && impactRingMatRef.current) {
      if (impact > 0.02) {
        impactEffectGroupRef.current.visible = true;
        const progress = 1 - impact; 
        const ringScale = 0.6 + progress * 2.2;
        impactEffectGroupRef.current.scale.set(ringScale, ringScale, ringScale);
        impactRingMatRef.current.opacity = impact * 0.85;
      } else {
        impactEffectGroupRef.current.visible = false;
      }
    }

    
    if (mastHeadRef.current) {
      const t = state.clock.getElapsedTime();
      mastHeadRef.current.rotation.y = Math.sin(t * 1.5) * 0.2 + (impact > 0.01 ? Math.sin(t * 50) * 0.35 * impact : 0);
    }

   
    if (solarGlowRef.current && isCharging) {
      const t = state.clock.getElapsedTime();
      const s = 1 + Math.sin(t * 8) * 0.12;
      solarGlowRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
     
      <group ref={impactEffectGroupRef} position={[0, 0.22, 0.4]} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.95, 24]} />
          <meshBasicMaterial
            ref={impactRingMatRef}
            color="#FF9E44"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

    
      <group ref={chassisRef} position={[0, 0.55, 0]}>
       
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.35, 1.4]} />
          <meshStandardMaterial
            color="#D9A84E"
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

       
        <mesh position={[0, 0.05, 0.8]}>
          <boxGeometry args={[0.9, 0.2, 0.25]} />
          <meshStandardMaterial color="#8C5C26" roughness={0.5} />
        </mesh>

       
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.7, 0.05, 1.8]} />
          <meshStandardMaterial
            color={isCharging ? '#D97706' : '#1B2A4A'}
            roughness={0.2}
            metalness={0.8}
            emissive={isCharging ? '#F59E0B' : '#0D1B2A'}
            emissiveIntensity={isCharging ? 1.4 : 0.2}
          />
        </mesh>

       
        <mesh position={[0, 0.33, 0]}>
          <planeGeometry args={[1.65, 1.75]} />
          <meshBasicMaterial
            color={isCharging ? '#FEF08A' : '#2E4A7D'}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>

        
        {isCharging && (
          <group position={[0, 0.5, 0]}>
            <pointLight color="#FDE047" intensity={3.0} distance={5} />
            <mesh ref={solarGlowRef} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.8, 1.2, 24]} />
              <meshBasicMaterial
                color="#FDE047"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

       
        <group position={[-0.45, 0.45, -0.45]}>
          <mesh rotation={[0.4, 0.2, 0]}>
            <cylinderGeometry args={[0.22, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#EAEAEA" roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
            <meshStandardMaterial color="#666" metalness={0.7} />
          </mesh>
        </group>

       
        <group position={[0.3, 0.3, 0.5]}>
         
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 1.0, 8]} />
            <meshStandardMaterial color="#B08D57" metalness={0.6} />
          </mesh>

          
          <group ref={mastHeadRef} position={[0, 1.05, 0]} visible={!isFPV}>
          
            <mesh>
              <boxGeometry args={[0.32, 0.1, 0.14]} />
              <meshStandardMaterial color="#C59B27" />
            </mesh>

           
            <mesh position={[-0.1, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
              <meshStandardMaterial color="#111" roughness={0.1} />
            </mesh>

          
            <mesh position={[0.1, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
              <meshStandardMaterial color="#111" roughness={0.1} />
            </mesh>
          </group>
        </group>
      </group>

      
      <group position={[0, 0.35, 0]}>
       
        <mesh position={[-0.75, 0, 0]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.1, 0.08, 1.5]} />
          <meshStandardMaterial color="#7D5832" roughness={0.6} />
        </mesh>

        
        <mesh position={[0.75, 0, 0]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.1, 0.08, 1.5]} />
          <meshStandardMaterial color="#7D5832" roughness={0.6} />
        </mesh>
      </group>

    
      {[
        { x: -0.85, z: 0.65, idx: 0 },
        { x: -0.85, z: 0.0, idx: 1 },
        { x: -0.85, z: -0.65, idx: 2 },
        { x: 0.85, z: 0.65, idx: 3 },
        { x: 0.85, z: 0.0, idx: 4 },
        { x: 0.85, z: -0.65, idx: 5 },
      ].map((cfg) => (
        <group key={cfg.idx} position={[cfg.x, 0.24, cfg.z]}>
          <mesh
            ref={(el) => {
              if (el) wheelsRef.current[cfg.idx] = el;
            }}
            rotation={[0, 0, Math.PI / 2]}
          >
           
            <cylinderGeometry args={[0.22, 0.22, 0.16, 16]} />
            <meshStandardMaterial
              color="#54433A"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
      
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.18, 12]} />
            <meshStandardMaterial color="#C59B27" />
          </mesh>
        </group>
      ))}

    
      <spotLight
        position={[0, 0.8, 0.7]}
        target-position={[0, 0, 5]}
        color="#FFF4D0"
        intensity={1.2}
        distance={12}
        angle={0.6}
        penumbra={0.5}
      />
    </group>
  );
};
