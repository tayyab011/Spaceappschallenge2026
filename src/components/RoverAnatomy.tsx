import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import wheel1 from '../assets/images/wheel1.gif'
import wheel2 from '../assets/images/wheel2.jpg'
import arm1 from '../assets/images/arm1.jpg'
import arm2 from '../assets/images/arm2.jpg'
import cam1 from '../assets/images/cam1.jpg'
import cam2 from '../assets/images/cam2.jpg'
import com1 from '../assets/images/ant1.jpg'
import com2 from '../assets/images/an2.jpg'
import pow1 from '../assets/images/pow.jpg'
import pow2 from '../assets/images/pow2.jpg'
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
            3D model didn't load. Check that 25042_Perseverance.glb is in public/models/.
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


interface SpecRow {
  label: string;
  value: string;
}

interface AnatomyPart {
  id: string;
  designation: string; 
  role: string; 
  summary: string;
  specs: SpecRow[];
  didYouKnow?: string;
  photoUrl?: string; 
  diagramUrl?: string; }

const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'mobility',
    designation: 'Mobility System — Rocker-Bogie Suspension',
    role: 'Terrain-adaptive six-wheel drive and suspension',
    summary:
      'Each of the six wheels is independently motorized, with the front and rear wheels also independently steerable. The rocker-bogie geometry allows the chassis to passively distribute weight across uneven terrain without springs, keeping all six wheels in contact with the ground over obstacles up to a wheel diameter in height.',
    specs: [
      { label: 'Wheel count', value: '6 (aluminum, cleated)' },
      { label: 'Wheel diameter', value: '52.5 cm' },
      { label: 'Top speed (flat, hard ground)', value: '~4.2 cm/s (0.152 km/h)' },
      { label: 'Tilt tolerance', value: 'Designed for 45°; drivers avoid more than 30°' },
      { label: 'Obstacle climb capability', value: 'Up to ~52.5 cm (about one wheel diameter)' },
    ],
    didYouKnow:
      'The rocker-bogie system has no springs — stability comes purely from its mechanical linkage geometry, a design first flown on Sojourner in 1997 and refined on every rover since.',
    photoUrl: wheel1,
    diagramUrl: wheel2,
  },
  {
    id: 'power',
    designation: 'Power System — Multi-Mission Radioisotope Thermoelectric Generator (MMRTG)',
    role: 'Continuous electrical power and thermal management',
    summary:
      'Unlike earlier solar-powered rovers, Perseverance is powered by an MMRTG, which converts heat from the natural radioactive decay of plutonium-238 dioxide into electricity via thermoelectric couples. This provides constant power output regardless of sunlight, season, or dust accumulation on any solar array.',
    specs: [
      { label: 'Power source', value: 'Pu-238 radioisotope decay' },
      { label: 'Electrical output', value: '~110 W (beginning of mission)' },
      { label: 'Design lifetime', value: '14 years minimum' },
      { label: 'Secondary function', value: 'Waste-heat routed to keep electronics warm' },
    ],
    didYouKnow:
      "Solar power ended both earlier rovers, in different ways. Opportunity went silent in 2018 when a global dust storm blocked sunlight to its panels. Spirit was lost in 2010 after it got stuck in soft sand and could not tilt its panels toward the Sun for winter. An MMRTG has neither weakness.",
    photoUrl: pow1,
    diagramUrl: pow2,
  },
  {
    id: 'mast',
    designation: 'Remote Sensing Mast — Mastcam-Z & SuperCam',
    role: 'Stereo imaging, navigation sensing, and remote spectroscopy',
    summary:
      "The mast carries the primary imaging and navigation sensor suite roughly 2 meters above the surface. Mastcam-Z provides zoomable, stereoscopic, high-resolution color imaging for terrain assessment and science documentation. SuperCam, mounted on the mast head, fires a laser at target rocks from a distance and analyzes the resulting spark spectroscopically to determine chemical composition without physical contact.",
    specs: [
      { label: 'Camera pair', value: 'Mastcam-Z (zoom stereo, up to 3x optical)' },
      { label: 'Remote sensing', value: 'SuperCam (LIBS laser spectroscopy)' },
      { label: 'Effective range (SuperCam)', value: 'Up to ~7 m' },
      { label: 'Mast height', value: '~2 m above chassis deck' },
    ],
    photoUrl: cam1,
    diagramUrl: cam2,
  },
  {
    id: 'arm',
    designation: 'Robotic Arm & Turret',
    role: 'In-situ sample acquisition and close-up instrument deployment',
    summary:
      "The 2.1-meter, five-degree-of-freedom robotic arm positions a turret of instruments and tools directly against rock targets. It carries a rotary percussive drill for coring rock samples, along with PIXL (an X-ray spectrometer) and SHERLOC (a UV Raman/fluorescence spectrometer with an integrated camera) for fine-scale mineralogical and organic-compound analysis.",
    specs: [
      { label: 'Arm length', value: '2.1 m' },
      { label: 'Degrees of freedom', value: '5' },
      { label: 'Coring drill', value: 'Rotary-percussive, collects ~6 cm cores' },
      { label: 'Turret instruments', value: 'PIXL, SHERLOC, coring drill' },
    ],
    photoUrl: arm1,
    diagramUrl: arm2,
  },
  {
    id: 'sampling',
    designation: 'Sample Caching System',
    role: 'Sample handling, sealing, and surface depot deployment',
    summary:
      "An internal robotic mechanism (the Adaptive Caching Assembly) processes rock cores collected by the drill, seals them into titanium tubes, and stores them onboard or deposits them at designated surface cache sites. This system is the core infrastructure supporting the Mars Sample Return campaign, a joint NASA/ESA effort to bring these samples to Earth for laboratory analysis.",
    specs: [
      { label: 'Sample tube material', value: 'Titanium' },
      { label: 'Tube capacity', value: '43 total tubes carried' },
      { label: 'Cache strategy', value: 'Onboard storage + surface depot tubes' },
    ],
    photoUrl: '/assets/objects/25005-mars20200602-1041-49834fe3.jpg',
    diagramUrl: '/assets/objects/44902-SCS-16-MAIN-d0e31e4d.gif',
  },
  {
    id: 'comms',
    designation: 'Telecommunications — UHF & X-Band Antennas',
    role: 'Earth and orbiter relay communication',
    summary:
      "Perseverance communicates with Earth both directly via X-band antennas and indirectly via UHF relay through orbiting spacecraft (such as the Mars Reconnaissance Orbiter), which then relay data to NASA's Deep Space Network. Orbital relay is typically used for the bulk of science data due to higher bandwidth and lower power cost per bit.",
    specs: [
      { label: 'Direct-to-Earth band', value: 'X-band' },
      { label: 'Relay band', value: 'UHF (via orbiters)' },
      { label: 'One-way light time (avg)', value: '~5–20 minutes, Mars–Earth' },
    ],
    photoUrl: com1,
    diagramUrl: com2,
  },
];


const ImageSlot: React.FC<{ url?: string; label: string; alt: string }> = ({ url, label, alt }) => (
  <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[0.03]">
    {url ? (
      <img src={url} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon className="h-6 w-6 text-[#6b7280]" />
        <span className="font-mono text-[10px] uppercase tracking-wide text-[#6b7280]">{label}</span>
      </div>
    )}
  </div>
);


const PartRow: React.FC<{ part: AnatomyPart; index: number }> = ({ part, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });
  const flip = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 items-start gap-10 border-t border-white/10 py-14 ${
        flip
          ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:[&>*:first-child]:order-2'
          : 'md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'
      }`}
    >
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <ImageSlot url={part.photoUrl} label="Photo coming soon" alt={`${part.designation} photo`} />
        <ImageSlot url={part.diagramUrl} label="Diagram coming soon" alt={`${part.designation} diagram`} />
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <p className="font-mono text-sm uppercase tracking-wider text-[#c1440e]">{part.role}</p>
        <h3 className="mt-1 font-serif text-3xl font-normal text-[#ece7dc] sm:text-4xl">
          {part.designation}
        </h3>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#ece7dc]/85">{part.summary}</p>

        {/* Spec table */}
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-2">
          {part.specs.map((spec, i) => (
            <div key={i} className="block">
              <dt className="font-mono text-xs uppercase tracking-wide text-[#9aa0a6]">{spec.label}</dt>
              <dd className="mt-1 font-mono text-sm text-[#ece7dc]">{spec.value}</dd>
            </div>
          ))}
        </dl>

        {part.didYouKnow && (
          <p className="mt-5 border-l-2 border-[#c1440e]/60 pl-4 text-base italic text-[#ece7dc]/70">
            {part.didYouKnow}
          </p>
        )}
      </motion.div>
    </div>
  );
};


export const RoverAnatomy: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#9aa0a6]">
          Engineering Reference · Perseverance Rover
        </p>
        <h2 className="mt-2 font-serif text-4xl font-normal text-[#ece7dc]">Rover Anatomy</h2>
        <p className="mt-3 leading-relaxed text-[#ece7dc]/75">
          A subsystem-level breakdown of Perseverance's major hardware — mobility, power,
          remote sensing, sample handling, and communications — based on publicly documented
          NASA/JPL mission specifications.
        </p>
      </div>

      {/* 3D model viewer */}
      <div className="h-[55vh] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0b0d12]">
        {ready && (
          <ModelErrorBoundary>
            <Canvas camera={{ position: [3, 1.5, 3], fov: 45 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <directionalLight position={[-5, 3, -5]} intensity={0.5} />
              <Suspense fallback={<CanvasLoadingFallback />}>
                <RoverModel />
              </Suspense>
              <OrbitControls autoRotate={!prefersReducedMotion()} autoRotateSpeed={0.6} enableZoom enablePan={false} />
            </Canvas>
          </ModelErrorBoundary>
        )}
      </div>
      <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wide text-[#6b7280]">
        3D model credit: NASA/JPL-Caltech
      </p>

      
      <div className="mt-4">
        {ANATOMY_PARTS.map((part, i) => (
          <PartRow key={part.id} part={part} index={i} />
        ))}
      </div>

      <p className="mt-10 border-t border-white/10 pt-6 text-center font-mono text-[10px] uppercase tracking-wide text-[#6b7280]">
        Specifications sourced from public NASA/JPL Mars 2020 mission documentation.
      </p>
    </section>
  );
};

useGLTF.preload(MODEL_PATH);