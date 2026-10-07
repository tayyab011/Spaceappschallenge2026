import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { THEME_COLORS } from '../config';
import { CameraFly } from './CameraFly';

interface SolarSystemSceneProps {
  isZooming?: boolean;
  onZoomComplete?: () => void;
}


const StarSpecs: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const brightStarsRef = useRef<THREE.Points>(null);
  const galacticBandRef = useRef<THREE.Points>(null);

  const { dimGeo, brightGeo, bandGeo } = useMemo(() => {
   
    const dimCoords: number[] = [];
    const dimColors: number[] = [];
    const palette = [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#E0F2FE'),
      new THREE.Color('#FEF3C7'),
      new THREE.Color('#FDE68A'),
      new THREE.Color('#BFDBFE'),
    ];

    for (let i = 0; i < 1800; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 32 + Math.random() * 65;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      dimCoords.push(x, y, z);
      const c = palette[i % palette.length];
      dimColors.push(c.r, c.g, c.b);
    }

    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.Float32BufferAttribute(dimCoords, 3));
    dGeo.setAttribute('color', new THREE.Float32BufferAttribute(dimColors, 3));

  
    const brightCoords: number[] = [];
    for (let i = 0; i < 320; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 24 + Math.random() * 55;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      brightCoords.push(x, y, z);
    }
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.Float32BufferAttribute(brightCoords, 3));

 
    const bandCoords: number[] = [];
    for (let i = 0; i < 700; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * 55;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * 14 + Math.sin(angle * 2) * 4;
      bandCoords.push(x, y, z);
    }
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(bandCoords, 3));

    return { dimGeo: dGeo, brightGeo: bGeo, bandGeo: gGeo };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (brightStarsRef.current) {
      const mat = brightStarsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.78 + Math.sin(t * 2.4) * 0.22;
    }
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.003;
    }
    if (galacticBandRef.current) {
      galacticBandRef.current.rotation.y = -t * 0.002;
    }
  });

  return (
    <group>
      <points ref={starsRef} geometry={dimGeo}>
        <pointsMaterial
          size={0.18}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      <points ref={brightStarsRef} geometry={brightGeo}>
        <pointsMaterial
          size={0.32}
          color="#FFFDF7"
          transparent
          opacity={0.95}
          sizeAttenuation
        />
      </points>
      <points ref={galacticBandRef} geometry={bandGeo} rotation={[0.25, 0, 0.18]}>
        <pointsMaterial
          size={0.12}
          color="#FDE68A"
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </group>
  );
};


const OrbitRing: React.FC<{
  xRadius: number;
  zRadius: number;
  rotationY?: number;
}> = ({ xRadius, zRadius, rotationY = 0 }) => {
  const { lineLoopObject, ribbonGeometry } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const ribbonPositions: number[] = [];
    const segments = 128;
    const halfWidth = 0.012; 

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      points.push(new THREE.Vector3(cosT * xRadius, 0, sinT * zRadius));
        ribbonPositions.push(
        cosT * (xRadius - halfWidth),
        0,
        sinT * (zRadius - halfWidth),
        cosT * (xRadius + halfWidth),
        0,
        sinT * (zRadius + halfWidth)
      );
    }

    const indices: number[] = [];
    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: '#9E4E24',
      transparent: true,
      opacity: 0.85,
    });

    const ribGeo = new THREE.BufferGeometry();
    ribGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribbonPositions, 3));
    ribGeo.setIndex(indices);

    return {
      lineLoopObject: new THREE.LineLoop(lineGeo, lineMat),
      ribbonGeometry: ribGeo,
    };
  }, [xRadius, zRadius]);

  return (
    <group rotation={[0, rotationY, 0]}>
      <primitive object={lineLoopObject} />
      <mesh geometry={ribbonGeometry}>
        <meshBasicMaterial
          color="#8C421C"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};


const Sun: React.FC = () => {
  const innerHaloRef = useRef<THREE.Mesh>(null);
  const outerHaloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (innerHaloRef.current) {
      const s1 = 1 + Math.sin(t * 1.8) * 0.04;
      innerHaloRef.current.scale.set(s1, s1, 1);
    }
    if (outerHaloRef.current) {
      const s2 = 1 + Math.sin(t * 1.4 + 1) * 0.06;
      outerHaloRef.current.scale.set(s2, s2, 1);
    }
  });

  return (
    <group position={[0, 0, 0]}>
     
      <mesh ref={outerHaloRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 3.4, 48]} />
        <meshBasicMaterial
          color={THEME_COLORS.sunHaloOuter}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      
      <mesh ref={innerHaloRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.3, 48]} />
        <meshBasicMaterial
          color={THEME_COLORS.sunHaloInner}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

  
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color={THEME_COLORS.sunCream} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};


const Planets: React.FC<{
  onMarsPositionUpdate?: (pos: [number, number, number]) => void;
  isZooming?: boolean;
}> = ({ onMarsPositionUpdate, isZooming }) => {
  const marsGroupRef = useRef<THREE.Group>(null);
  const orangeGroupRef = useRef<THREE.Group>(null);
  const blueGroupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const giantGroupRef = useRef<THREE.Group>(null);

  const [hoveredMars, setHoveredMars] = useState(false);

   useFrame((state) => {
    const speedMultiplier = isZooming ? 0.05 : 1;
    const t = state.clock.getElapsedTime() * speedMultiplier;

    if (marsGroupRef.current) {
      const angle = 2.4 + t * 0.12;
      const mx = Math.cos(angle) * 7.5;
      const mz = Math.sin(angle) * 6.0;
      marsGroupRef.current.position.set(mx, 0, mz);
      if (onMarsPositionUpdate) {
        onMarsPositionUpdate([mx, 0, mz]);
      }
    }

    if (orangeGroupRef.current) {
      const angle = 0.8 + t * 0.18;
      orangeGroupRef.current.position.set(Math.cos(angle) * 4.6, 0, Math.sin(angle) * 3.8);
    }

    if (blueGroupRef.current) {
      const angle = 4.8 + t * 0.14;
      const bx = Math.cos(angle) * 11.0;
      const bz = Math.sin(angle) * 8.5;
      blueGroupRef.current.position.set(bx, 0, bz);

      if (moonRef.current) {
        const mt = t * 1.5;
        moonRef.current.position.set(Math.cos(mt) * 0.8, 0, Math.sin(mt) * 0.8);
      }
    }

   if (giantGroupRef.current) {
      const angle = 3.6 + t * 0.06;
      giantGroupRef.current.position.set(Math.cos(angle) * 16.0, 0, Math.sin(angle) * 12.5);
    }
  });

  return (
    <>
       <group ref={marsGroupRef} position={[-5.2, 0, 4.3]}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredMars(true);
          }}
          onPointerOut={() => setHoveredMars(false)}
          onClick={(e) => {
            e.stopPropagation();
            setHoveredMars((prev) => !prev);
          }}
        >
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshStandardMaterial
            color="#C84922"
            roughness={0.35}
            metalness={0.1}
            emissive="#7A240A"
            emissiveIntensity={0.2}
          />
        </mesh>
   <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.72, 32]} />
          <meshBasicMaterial
            color="#FF9D73"
            transparent
            opacity={hoveredMars ? 0.9 : 0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {(hoveredMars || isZooming) && (
          <Html position={[0, 0.75, 0]} center distanceFactor={15}>
            <div className="bg-[#48170B]/90 text-[#F2D9A4] border border-[#F2D9A4]/40 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none whitespace-nowrap animate-bounce">
              Mars 🔴
            </div>
          </Html>
        )}
      </group>

      <group ref={orangeGroupRef} position={[3.2, 0, 2.5]}>
        <mesh>
          <sphereGeometry args={[0.34, 20, 20]} />
          <meshStandardMaterial color="#E87C29" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
      <group ref={blueGroupRef} position={[2.5, 0, -8.0]}>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color="#367BB8" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh ref={moonRef} position={[0.8, 0, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#A9B1B8" roughness={0.6} />
        </mesh>
      </group>
      <group ref={giantGroupRef} position={[-14, 0, -6]}>
        <mesh>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshStandardMaterial color="#D86518" roughness={0.4} metalness={0.15} />
        </mesh>
      </group>
    </>
  );
};

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  isZooming = false,
  onZoomComplete,
}) => {
  const controlsRef = useRef<any>(null);
  const marsPosRef = useRef<[number, number, number]>([-5.2, 0, 4.3]);

  return (
    <div
      className="w-full h-full relative touch-none"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
    >
      <Canvas
        camera={{ position: [0, 18, 14], fov: 46 }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(THEME_COLORS.bgRust);
          scene.background = new THREE.Color(THEME_COLORS.bgRust);
        }}
      >
        <ambientLight intensity={1.1} color="#FFE6CC" />
        <directionalLight position={[0, 10, 0]} intensity={1.4} color="#FFF2DF" />
        <pointLight position={[0, 1, 0]} intensity={2.5} distance={30} color="#FFD199" />

        <StarSpecs />

        <Sun />

        <OrbitRing xRadius={4.6} zRadius={3.8} />
        <OrbitRing xRadius={7.5} zRadius={6.0} />
        <OrbitRing xRadius={11.0} zRadius={8.5} />
        <OrbitRing xRadius={16.0} zRadius={12.5} />

        <Planets
          onMarsPositionUpdate={(pos) => {
            marsPosRef.current = pos;
          }}
          isZooming={isZooming}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={!isZooming}
          enableZoom={!isZooming}
          enableRotate={!isZooming}
          screenSpacePanning
          zoomSpeed={1.1}
          rotateSpeed={0.9}
          panSpeed={0.85}
          minDistance={4.5}
          maxDistance={42}
          minPolarAngle={0.08}
          maxPolarAngle={Math.PI - 0.08}
          autoRotate={!isZooming}
          autoRotateSpeed={0.35}
          dampingFactor={0.06}
          enableDamping
        />

        {isZooming && onZoomComplete && (
          <CameraFly
            targetPosition={marsPosRef}
            duration={2.5}
            controlsRef={controlsRef}
            onComplete={onZoomComplete}
          />
        )}
      </Canvas>
    </div>
  );
};
