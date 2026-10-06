import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import wheel1 from '../assets/images/wheel1.gif'
import cam from '../assets/images/cam1.jpg'
import arm from '../assets/images/arm1.jpg'
import ant from '../assets/images/ant1.jpg'
import { prefersReducedMotion } from '../a11y';

const MODEL_PATH = '/models/25042_Perseverance.glb';

function RoverModel() {
  const { scene } = useGLTF(MODEL_PATH);
  return <primitive object={scene} scale={1.4} position={[0, -0.6, 0]} />;
}


class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
   
    console.error('Rover model failed to load:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center px-6">
          <span className="text-4xl">🛰️</span>
          <p className="font-mono text-xs text-[#9aa0a6]">
            3D model didn't load. Check that perseverance.glb is in public/models/.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function CanvasLoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#c1440e" wireframe />
    </mesh>
  );
}


interface KidPart {
  id: string;
  emoji: string;
  name: string;
  sentence: string;
  imageUrl?: string; 
}

const KID_PARTS: KidPart[] = [
  {
    id: 'wheels',
    emoji: '🛞',
    name: 'My Wheels',
    sentence:
      "I have six strong wheels! They help me roll over rocks and sand without getting stuck.",
    imageUrl: wheel1,
  },
  {
    id: 'solar',
    emoji: '☀️',
    name: 'My Power',
    sentence:
      "I use a special battery charged by a tiny nuclear generator, so I don't even need sunshine to keep going!",
    imageUrl: '/assets/objects.power.jpg',
  },
  {
    id: 'mast',
    emoji: '👀',
    name: 'My Eyes',
    sentence:
      "My cameras sit high up on my neck so I can look all around and find the safest path forward.",
    imageUrl: cam,
  },
  {
    id: 'arm',
    emoji: '💪',
    name: 'My Arm',
    sentence:
      "My long arm can reach out and touch rocks, take tiny samples, and study what they're made of.",
    imageUrl: arm,
  },
  {
    id: 'antenna',
    emoji: '📡',
    name: 'My Voice',
    sentence:
      "My antenna sends messages all the way back to Earth, millions of miles away!",
    imageUrl: ant,
  },
];

const PartRow: React.FC<{ part: KidPart; index: number }> = ({ part, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.6, once: false });
  const flip = index % 2 === 1; 
  return (
    <div
      ref={ref}
      className={`grid min-h-[70vh] grid-cols-1 items-center gap-8 py-12 md:grid-cols-2 ${
        flip ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="flex aspect-square w-full items-center justify-center rounded-3xl border-2 border-dashed border-white/15 bg-white/5"
      >
        {part.imageUrl ? (
          <img src={part.imageUrl} alt={part.name} className="h-full w-full rounded-3xl object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <span className="text-6xl">{part.emoji}</span>
            <span className="font-mono text-xs text-[#9aa0a6]">Photo coming soon</span>
          </div>
        )}
      </motion.div>

     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">{part.emoji}</span>
          <h3 className="font-serif text-3xl font-normal ">{part.name}</h3>
        </div>
        <p className="mt-4 max-w-md text-lg leading-relaxed ">{part.sentence}</p>
      </motion.div>
    </div>
  );
};


export const MeetMyParts: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl scroll-smooth px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl font-extrabold  sm:text-4xl">
          Meet My Parts!
        </h2>
          </div>

     
      <div className="h-[55vh] w-full overflow-hidden rounded-3xl border border-white/15 bg-[#7f3306]">
        {ready && (
          <ModelErrorBoundary>
            <Canvas camera={{ position: [3, 1.5, 3], fov: 45 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <directionalLight position={[-5, 3, -5]} intensity={0.5} />
              <Suspense fallback={<CanvasLoadingFallback />}>
                <RoverModel />
              </Suspense>
              <OrbitControls autoRotate={!prefersReducedMotion()} autoRotateSpeed={0.8} enableZoom enablePan={false} />
            </Canvas>
          </ModelErrorBoundary>
        )}
      </div>
      <p className="mt-2 text-center font-mono text-xs text-[#9aa0a6]">
        Drag to spin me around! Credit: NASA/JPL-Caltech
      </p>

 
      <div className="mt-8">
        {KID_PARTS.map((part, i) => (
          <PartRow key={part.id} part={part} index={i} />
        ))}
      </div>

      <div className="py-12 text-center">
        <p className="font-serif text-2xl ">🎉 You explored every part of me!</p>
      </div>
    </section>
  );
};

useGLTF.preload(MODEL_PATH);