import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleAlert,
  Crosshair,
  Cpu,
  Eye,
  Gauge,
  Globe2,
  Info,
  MapPin,
  Radio,
  RotateCw,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  User,
  Wrench,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

import { auth, db, firebaseEnabled } from './lib/firebase';
import { prefersReducedMotion } from '../a11y';


type TargetId = 'sojourner' | 'lunar' | 'deep-space';
type Status = 'good' | 'caution' | 'poor';
type Action = 'scan' | 'communicate' | 'inspect' | 'repair' | 'leave';
type Outcome = 'possible' | 'not-feasible' | 'updated';

type Target = {
  id: TargetId;
  eyebrow: string;
  name: string;
  location: string;
  mission: string;
  status: string;
  description: string;
  icon: string;
  choices: string[];
};

type Assessment = {
  access: Status;
  communication: Status;
  power: Status;
  repair: Status;
  science: Status;
  risk: Status;
};

type ModerationStatus = 'pending' | 'approved' | 'rejected';

type Solution = {
  id: string;
  name: string;
  isAnonymous: boolean;
  idea: string;
  impact: string;
  drawbacks: string;
  createdAt: number;
  status: ModerationStatus;
};

type CommunityComment = {
  id: string;
  name: string;
  isAnonymous: boolean;
  text: string;
  createdAt: number;
  status: ModerationStatus;
};

const LOCAL_SOLUTIONS_KEY = 'mender-community-solutions';

const TARGETS: Target[] = [
  {
    id: 'sojourner',
    eyebrow: 'CASE 01 ; MARS ROVER',
    name: 'SOJOURNER',
    location: 'Mars',
    mission: 'Pathfinder',
    status: 'Inactive',
    description:
      'MENDER detects the rover but cannot communicate with it. The first question is whether to inspect the system before attempting intervention.',
    icon: '🔴',
    choices: ['Attempt communication recovery', 'Inspect first', 'Leave it untouched'],
  },
  {
    id: 'lunar',
    eyebrow: 'CASE 02 ; LUNAR EQUIPMENT',
    name: 'LUNAR EQUIPMENT',
    location: 'Moon',
    mission: 'Historic surface mission',
    status: 'Mission complete',
    description:
      'The equipment is no longer operational but may have historical significance. Moving it could change the context in which future explorers encounter it.',
    icon: '🌕',
    choices: ['Document & preserve', 'Recover', 'Leave undisturbed'],
  },
  {
    id: 'deep-space',
    eyebrow: 'CASE 03  DEEP-SPACE SPACECRAFT',
    name: 'DEEP-SPACE CRAFT',
    location: 'Deep Space',
    mission: 'Long-duration flight',
    status: 'Still traveling',
    description:
      'The spacecraft is far beyond practical physical intervention. MENDER must distinguish between what can be observed remotely and what cannot be recovered.',
    icon: '🛰️',
    choices: ['Attempt remote communication', 'Observe remotely', 'No physical recovery possible'],
  },
];

const initialAssessment: Assessment = {
  access: 'good',
  communication: 'caution',
  power: 'poor',
  repair: 'caution',
  science: 'good',
  risk: 'caution',
};

const assessmentFor = (target: TargetId): Assessment => {
  if (target === 'lunar') {
    return {
      access: 'good',
      communication: 'poor',
      power: 'poor',
      repair: 'poor',
      science: 'good',
      risk: 'caution',
    };
  }

  if (target === 'deep-space') {
    return {
      access: 'poor',
      communication: 'caution',
      power: 'caution',
      repair: 'poor',
      science: 'good',
      risk: 'good',
    };
  }

  return initialAssessment;
};

const statusClass = (status: Status) => {
  if (status === 'good') return 'bg-emerald-400';
  if (status === 'caution') return 'bg-amber-300';
  return 'bg-red-400';
};

const statusText = (status: Status) => {
  if (status === 'good') return 'GOOD';
  if (status === 'caution') return 'CAUTION';
  return 'LIMITED';
};



const Wheel: React.FC<{ position: [number, number, number]; side: 1 | -1 }> = ({
  position,
  side,
}) => (
  <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
      <meshStandardMaterial color="#27292d" roughness={0.82} metalness={0.45} />
    </mesh>
    <mesh position={[0, side * 0.095, 0]}>
      <cylinderGeometry args={[0.15, 0.15, 0.025, 16]} />
      <meshStandardMaterial color="#77716b" roughness={0.7} metalness={0.4} />
    </mesh>
  </group>
);

const MenderRobot: React.FC = () => {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.25) * 0.025;
    group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group} rotation={[0, -0.35, 0]}>
     
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.15, 0.32, 1.25]} />
        <meshStandardMaterial color="#38383d" roughness={0.68} metalness={0.65} />
      </mesh>

      
      <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.72, 0.68, 1.08]} />
        <meshStandardMaterial color="#aaa096" roughness={0.58} metalness={0.55} />
      </mesh>

      <mesh position={[0, 0.82, -0.551]}>
        <boxGeometry args={[1.25, 0.35, 0.025]} />
        <meshStandardMaterial color="#17191d" roughness={0.55} metalness={0.55} />
      </mesh>

      <mesh position={[-0.43, 0.82, -0.57]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#63f2b0" emissive="#63f2b0" emissiveIntensity={3} />
      </mesh>
      <mesh position={[-0.25, 0.82, -0.57]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#f1c85a" emissive="#f1c85a" emissiveIntensity={2} />
      </mesh>

      <mesh position={[0, 1.42, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.65, 12]} />
        <meshStandardMaterial color="#77716b" roughness={0.65} metalness={0.7} />
      </mesh>

      <mesh position={[0, 1.76, 0]} castShadow>
        <boxGeometry args={[0.72, 0.27, 0.32]} />
        <meshStandardMaterial color="#c0b4a6" roughness={0.52} metalness={0.48} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh
  key={x}
  position={[x, 1.77, -0.175]}
  rotation={[Math.PI / 2, 0, 0]}
>
  <cylinderGeometry args={[0.07, 0.07, 0.025, 20]} />
  <meshStandardMaterial
    color="#101217"
    roughness={0.35}
    metalness={0.8}
  />
</mesh>
      ))}
      <group position={[0.67, 1.18, 0.05]} rotation={[0.1, -0.5, 0.35]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.12, 0.08, 24]} />
          <meshStandardMaterial color="#b9aea1" roughness={0.5} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#d57a4b" emissive="#d57a4b" emissiveIntensity={1.5} />
        </mesh>
      </group>
      <group position={[-0.68, 0.72, -0.12]} rotation={[0, 0, -0.45]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <boxGeometry args={[0.13, 0.68, 0.13]} />
          <meshStandardMaterial color="#6f6963" roughness={0.62} metalness={0.72} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#9b9188" roughness={0.6} metalness={0.6} />
        </mesh>
        <mesh position={[0.08, 0.86, 0]} rotation={[0, 0, 0.75]}>
          <boxGeometry args={[0.11, 0.43, 0.11]} />
          <meshStandardMaterial color="#807870" roughness={0.62} metalness={0.72} />
        </mesh>
        <mesh position={[0.22, 1.03, 0]}>
          <boxGeometry args={[0.2, 0.08, 0.2]} />
          <meshStandardMaterial color="#3a3b40" roughness={0.65} metalness={0.7} />
        </mesh>
      </group>

      {[
        [-0.82, 0.36, -0.68],
        [0, 0.36, -0.68],
        [0.82, 0.36, -0.68],
        [-0.82, 0.36, 0.68],
        [0, 0.36, 0.68],
        [0.82, 0.36, 0.68],
      ].map(([x, y, z], index) => (
        <Wheel key={`${x}-${y}-${z}-${index}`} position={[x, y, z]} side={z > 0 ? 1 : -1} />
      ))}
    </group>
  );
};

const MenderScene: React.FC = () => (
  <div className="relative h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b10] sm:h-[520px]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(213,122,75,.18),transparent_36%),linear-gradient(180deg,#15141a_0%,#0a0c10_72%,#050608_100%)]" />
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:44px_44px]" />

    <Canvas
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [3.6, 2.5, 4.6], fov: 42 }}
      className="relative z-10"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={3.2} castShadow />
        <pointLight position={[-3, 2, 2]} intensity={8} color="#d57a4b" distance={7} />
        <pointLight position={[3, 1, -2]} intensity={5} color="#8ab4ff" distance={6} />

        <MenderRobot />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#141216" roughness={1} metalness={0} />
        </mesh>
        <gridHelper args={[12, 24, '#343035', '#19191e']} position={[0, 0.055, 0]} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.58}
          autoRotate={!prefersReducedMotion()}
          autoRotateSpeed={0.8}
        />
      </Suspense>
    </Canvas>

    <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a8a0a0]">
          CONCEPTUAL SYSTEM
        </p>
        <p className="mt-1 text-xl font-medium text-[#eee9e1]">MENDER</p>
      </div>
      <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-200">
        Procedural 3D concept
      </div>
    </div>
  </div>
);

const SectionTitle: React.FC<{
  eyebrow: string;
  title: string;
  text?: string;
}> = ({ eyebrow, title, text }) => (
  <div className="mx-auto max-w-3xl text-center">
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d57a4b]">{eyebrow}</p>
    <h2 className="mt-2 font-serif text-3xl font-normal leading-tight text-[#eee9e1] sm:text-5xl">
      {title}
    </h2>
    {text ? <p className="mt-4 leading-7 text-[#a8a0a0]">{text}</p> : null}
  </div>
);

const WhyCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#d57a4b]">
      {icon}
    </div>
    <h3 className="mt-5 text-lg font-medium text-[#eee9e1]">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-[#9e9999]">{children}</p>
  </motion.div>
);

const MissionStep: React.FC<{
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}> = ({ number, icon, title, children, last = false }) => (
  <div className="relative grid grid-cols-[56px_1fr] gap-4 sm:grid-cols-[70px_1fr] sm:gap-6">
    {!last ? (
      <div className="absolute left-[27px] top-14 h-[calc(100%-22px)] w-px bg-gradient-to-b from-white/20 to-transparent sm:left-[34px]" />
    ) : null}
    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#111319] sm:h-[68px] sm:w-[68px]">
      <span className="font-mono text-[10px] text-[#d57a4b]">{number}</span>
      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1a1c22] text-[#eee9e1]">
        {icon}
      </span>
    </div>
    <div className="pb-8 pt-1 sm:pb-10">
      <h3 className="text-lg font-medium text-[#eee9e1]">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#9e9999]">{children}</p>
    </div>
  </div>
);

const ActionButton: React.FC<{
  action: Action;
  label: string;
 icon: LucideIcon;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  wide?: boolean;
}> = ({ action, label, icon: Icon, active, disabled, onClick, wide = false }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-wait disabled:opacity-60 ${
      active
        ? 'border-[#d57a4b]/50 bg-[#d57a4b]/10'
        : 'border-white/10 bg-white/[0.025] hover:border-white/20'
    } ${wide ? 'sm:col-span-2' : ''}`}
  >
    <Icon className="h-4 w-4 text-[#d57a4b]" />
    <span className="font-mono text-[10px] tracking-wide text-[#d4ceca]">{label}</span>
  </button>
);

const SolutionCard: React.FC<{
  solution: Solution;
  comments: CommunityComment[];
  onAddComment: (solutionId: string, text: string) => Promise<void>;
}> = ({ solution, comments, onAddComment }) => {
  const [commentInput, setCommentInput] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  const submitComment = async () => {
    const text = commentInput.trim();
    if (!text || commenting) return;

    setCommentError(null);
    setCommentSuccess(null);
    setCommenting(true);
    try {
      await onAddComment(solution.id, text);
      setCommentInput('');
      setShowComments(true);
      setCommentSuccess('✓ Sent for moderation. It will appear after approval.');
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Could not submit your response.');
    } finally {
      setCommenting(false);
    }
  };

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#111319] p-5 sm:w-[370px]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <User className="h-3.5 w-3.5 text-[#d57a4b]" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4ceca]">
          {solution.isAnonymous ? 'Anonymous Explorer' : solution.name}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#eee9e1]">{solution.idea}</p>

      {solution.impact ? (
        <div className="mt-4 flex items-start gap-2">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
          <p className="text-xs leading-5 text-[#9e9999]">
            <span className="font-mono uppercase tracking-wider text-emerald-200/80">Impact — </span>
            {solution.impact}
          </p>
        </div>
      ) : null}

      {solution.drawbacks ? (
        <div className="mt-2 flex items-start gap-2">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
          <p className="text-xs leading-5 text-[#9e9999]">
            <span className="font-mono uppercase tracking-wider text-amber-200/80">Drawbacks — </span>
            {solution.drawbacks}
          </p>
        </div>
      ) : null}

      <div className="mt-5 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setShowComments((value) => !value)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#aaa3a1]">
            💬 {comments.length} {comments.length === 1 ? 'community response' : 'community responses'}
          </span>
          <span className="text-xs text-[#777272]">{showComments ? 'Hide' : 'View'}</span>
        </button>

        {showComments ? (
          <div className="mt-3 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#d57a4b]">
                    {comment.isAnonymous ? 'Anonymous Explorer' : comment.name}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#bdb6b3]">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#666161]">No approved responses yet.</p>
            )}

            <div className="pt-1">
              <textarea
                value={commentInput}
                onChange={(event) => setCommentInput(event.target.value)}
                maxLength={240}
                rows={2}
                placeholder="Add your perspective..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-[#eee9e1] placeholder:text-[#5d5959] outline-none focus:border-[#d57a4b]/50"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[8px] uppercase tracking-wider text-[#5d5959]">
                  Anonymous by default
                </span>
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={!commentInput.trim() || commenting}
                  className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[#d4ceca] transition hover:border-[#d57a4b]/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {commenting ? 'Sending…' : 'Add perspective'}
                </button>
              </div>
              {commentSuccess ? <p className="mt-2 text-[10px] text-emerald-300">{commentSuccess}</p> : null}
              {commentError ? <p className="mt-2 text-[10px] text-red-300">{commentError}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

type Pillar = { label: string; icon: React.ReactNode; content: React.ReactNode };

const PillarTabs: React.FC<{ pillars: Pillar[] }> = ({ pillars }) => {
  const [active, setActive] = useState(0);
  const current = pillars[active];

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {pillars.map((pillar, index) => (
          <button
            key={pillar.label}
            type="button"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            className={`border-t-2 pt-4 text-left transition ${
              index === active ? 'border-[#d57a4b]' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#d57a4b]">0{index + 1}</span>
            <span className="mt-2 flex items-center gap-2 text-xs text-[#d4ceca] sm:text-sm">
              {pillar.icon}
              {pillar.label}
            </span>
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
        {current.content}
      </motion.div>
    </div>
  );
};

const OrbitDiagram: React.FC = () => {
  const nodes: { label: string; icon: LucideIcon; pos: string }[] = [
    { label: 'REPAIR', icon: Wrench, pos: 'left-1/2 top-[12%]' },
    { label: 'PRESERVE', icon: Shield, pos: 'left-[88%] top-1/2' },
    { label: 'INSPECT', icon: Search, pos: 'left-1/2 top-[88%]' },
    { label: 'LEAVE', icon: Info, pos: 'left-[12%] top-1/2' },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-[12%] rounded-full border border-white/10" />
      <div className="absolute inset-[24%] rounded-full border border-white/10" />
      <div className="absolute inset-[36%] rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d57a4b]/40 bg-[#d57a4b]/10">
        <span className="font-mono text-xs tracking-[0.25em] text-[#eee9e1]">MENDER</span>
      </div>
      {nodes.map(({ label, icon: Icon, pos }) => (
        <div key={label} className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 ${pos}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#111319] text-[#d57a4b]">
            <Icon className="h-4 w-4" />
          </div>
          <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.2em] text-[#aaa3a1]">{label}</span>
        </div>
      ))}
    </div>
  );
};

export const Recovery: React.FC = () => {
  const [selectedTargetId, setSelectedTargetId] = useState<TargetId>('sojourner');
  const [simulationState, setSimulationState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [selectedAction, setSelectedAction] = useState<Action>('scan');
  const [assessment, setAssessment] = useState<Assessment>(initialAssessment);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const timerRef = useRef<number | null>(null);


  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [ideaInput, setIdeaInput] = useState('');
  const [impactInput, setImpactInput] = useState('');
  const [drawbacksInput, setDrawbacksInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const [commentsBySolution, setCommentsBySolution] = useState<Record<string, CommunityComment[]>>({});

  const solutionsRowRef = useRef<HTMLDivElement>(null);
  const scrollSolutions = (dir: 1 | -1) => {
    const el = solutionsRowRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  useEffect(() => {
    if (firebaseEnabled && db) {
      const q = query(collection(db, 'solutions'), where('status', '==', 'approved'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: Solution[] = snapshot.docs
            .map((docSnap) => {
              const data = docSnap.data() as Partial<Solution> & {
                createdAt?: { toMillis?: () => number };
              };

              return {
                id: docSnap.id,
                name: data.name ?? 'Anonymous Explorer',
                isAnonymous: Boolean(data.isAnonymous),
                idea: data.idea ?? '',
                impact: data.impact ?? '',
                drawbacks: data.drawbacks ?? '',
                createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
                status: (data.status ?? 'pending') as ModerationStatus,
              };
            })
            .sort((a, b) => b.createdAt - a.createdAt);

          setSolutions(items);
        },
        () => setSubmitError('Could not load community solutions right now.'),
      );

      return () => unsubscribe();
    }

    try {
      const stored = window.localStorage.getItem(LOCAL_SOLUTIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Solution[];
        setSolutions(parsed.map((item) => ({ ...item, status: item.status ?? 'approved' })));
      }
    } catch {
      
    }

    return undefined;
  }, []);

 
  useEffect(() => {
    if (!firebaseEnabled || !db || solutions.length === 0) {
      setCommentsBySolution({});
      return;
    }

    const unsubscribers = solutions.map((solution) => {
      const commentsQuery = query(
  collection(db, 'solutions', solution.id, 'comments'),
  where('status', '==', 'approved'),
);

return onSnapshot(commentsQuery, (snapshot) => {
  const comments: CommunityComment[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Partial<CommunityComment> & {
            createdAt?: { toMillis?: () => number };
          };

          return {
            id: docSnap.id,
            name: data.name ?? 'Anonymous Explorer',
            isAnonymous: Boolean(data.isAnonymous),
            text: data.text ?? '',
            createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
                    status: (data.status ?? 'pending') as ModerationStatus,
        };
      });

      comments.sort((a, b) => a.createdAt - b.createdAt);

      setCommentsBySolution((current) => ({
          ...current,
          [solution.id]: comments,
        }));
      });
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [solutions]);

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> => {
    let timeoutId: number | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    }
  };

  const ensureAnonymousSession = async () => {
    if (!firebaseEnabled) return;

    if (!auth) {
      throw new Error('Firebase Authentication is not configured. Check src/lib/firebase.ts and your .env file.');
    }

    if (!auth.currentUser) {
      await withTimeout(
        signInAnonymously(auth),
        10000,
        'Anonymous sign-in timed out. Check Firebase Authentication and your internet connection.',
      );
    }
  };

  const handleSubmitSolution = async (event: React.FormEvent) => {
    event.preventDefault();

   
    if (!ideaInput.trim() || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    const newSolution: Solution = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: !isAnonymous && nameInput.trim() ? nameInput.trim() : 'Anonymous Explorer',
      isAnonymous: isAnonymous || !nameInput.trim(),
      idea: ideaInput.trim(),
      impact: impactInput.trim(),
      drawbacks: drawbacksInput.trim(),
      createdAt: Date.now(),
      status: firebaseEnabled ? 'pending' : 'approved',
    };

    try {
      if (firebaseEnabled) {
        if (!db) {
          throw new Error('Firestore is not configured. Check your Firebase environment variables.');
        }

        await ensureAnonymousSession();

        await withTimeout(
          addDoc(collection(db, 'solutions'), {
            name: newSolution.name,
            isAnonymous: newSolution.isAnonymous,
            idea: newSolution.idea,
            impact: newSolution.impact,
            drawbacks: newSolution.drawbacks,
            status: 'pending',
            createdAt: serverTimestamp(),
          }),
          10000,
          'Submission timed out. Check your Firestore connection and security rules.',
        );

        setSubmitMessage('✓ Submitted for review. It will appear here after approval.');
      } else {
        setSolutions((prev) => {
          const next = [newSolution, ...prev];
          try {
            window.localStorage.setItem(LOCAL_SOLUTIONS_KEY, JSON.stringify(next));
          } catch {
            
          }
          return next;
        });

        setSubmitMessage('✓ Saved in local demo mode. It is not shared with other visitors.');
      }

      setNameInput('');
      setIsAnonymous(false);
      setIdeaInput('');
      setImpactInput('');
      setDrawbacksInput('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save your solution. Please try again.';

      if (message.includes('auth/configuration-not-found')) {
        setSubmitError(
          'Firebase Anonymous Authentication is not enabled. Open Firebase Console → Authentication → Sign-in method → Anonymous → Enable.',
        );
      } else if (message.includes('permission-denied')) {
        setSubmitError(
          'Firebase rejected the submission. Check your Firestore security rules and make sure Anonymous Authentication is enabled.',
        );
      } else {
        setSubmitError(`Submission failed: ${message}`);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleAddComment = async (solutionId: string, text: string) => {
    if (!firebaseEnabled) {
      throw new Error('Community comments require the shared Firebase backend.');
    }

    if (!db) {
      throw new Error('Firestore is not configured. Check your Firebase environment variables.');
    }

    await ensureAnonymousSession();

    await withTimeout(
      addDoc(collection(db, 'solutions', solutionId, 'comments'), {
        name: 'Anonymous Explorer',
        isAnonymous: true,
        text: text.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      }),
      10000,
      'Comment submission timed out. Check your Firestore connection and security rules.',
    );
  };

  const selectedTarget = useMemo(
    () => TARGETS.find((target) => target.id === selectedTargetId) ?? TARGETS[0],
    [selectedTargetId],
  );

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSimulationState('idle');
    setOutcome(null);
    setAssessment(assessmentFor(selectedTargetId));
    setSelectedAction('scan');
  }, [selectedTargetId]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const runSimulation = (action: Action) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);

    setSelectedAction(action);
    setSimulationState('scanning');
    setOutcome(null);

    timerRef.current = window.setTimeout(() => {
      const base = assessmentFor(selectedTargetId);
      setAssessment(base);

      let nextOutcome: Outcome = 'updated';
      if (action === 'repair' && selectedTargetId === 'sojourner') nextOutcome = 'not-feasible';
      if (action === 'inspect') nextOutcome = 'possible';
      if (action === 'communicate' && selectedTargetId === 'deep-space') nextOutcome = 'possible';

      setOutcome(nextOutcome);
      setSimulationState('result');
      timerRef.current = null;
    }, 1200);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090c] text-[#eee9e1]">
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg">🤖</span>
          <span className="font-mono text-xs tracking-[0.3em] text-[#eee9e1]">MENDER</span>
        </a>
        <nav aria-label="Sections" className="hidden gap-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9e9999] md:flex">
          <a href="#mender" className="hover:text-[#eee9e1]">Concept</a>
          <a href="#why" className="hover:text-[#eee9e1]">Why</a>
          <a href="#universe" className="hover:text-[#eee9e1]">Cases</a>
          <a href="#how" className="hover:text-[#eee9e1]">How it works</a>
          <a href="#simulation" className="hover:text-[#eee9e1]">Simulation</a>
          <a href="#community" className="hover:text-[#eee9e1]">Community</a>
        </nav>
      </header>

      <div id="top"><section className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="absolute left-1/2 top-0 -z-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[#d57a4b]/10 blur-[120px]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
           
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-normal leading-[.95] tracking-tight text-[#f0ece5] sm:text-7xl lg:text-8xl">
            SECOND LIFE
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-[#d4ceca] sm:text-2xl">
              What if tomorrow&apos;s explorers could meet yesterday&apos;s?
            </p>
            <p className="mt-5 max-w-2xl leading-7 text-[#9e9999]">
              Across the Moon, Mars, and deep space, robotic explorers have completed missions,
              lost contact, or simply reached the end of their operational lives. What if future
              robotic missions could locate, inspect and when feasible help preserve or recover them?
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#mender"
                className="inline-flex items-center gap-2 rounded-full bg-[#eee9e1] font-bold px-5 py-3 text-sm text-[#101115] transition hover:bg-white"
              >
                Meet MENDER <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#simulation"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-[#d4ceca] hover:border-white/30"
              >
                Run the simulation <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <MenderScene />
        </div>
      </section></div>

      <section id="mender" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="font-mono text-5xl font-light text-[#d57a4b]/30">01</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-[#eee9e1] sm:text-5xl">
              The explorer after the exploration.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-[#d4ceca]">
              MENDER is a concept, not an existing spacecraft. Its role is to explore what a future
              recovery mission could look like when the first mission has already ended.
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#9e9999]">
              A conceptual autonomous system for interacting with humanity&apos;s robotic legacy. It
              locates inactive explorers, inspects their condition, and helps decide whether to repair,
              preserve, document or leave them undisturbed.
            </p>
            <a
              href="#why"
              className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d57a4b] hover:text-[#e08a5c]"
            >
              Why go back <ArrowDown className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#101218] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d57a4b]/10 text-2xl">🤖</div>
              <div>
                <h3 className="text-2xl font-medium text-[#eee9e1]">MENDER</h3>
                <p className="font-mono text-[10px] leading-5 text-[#d4ceca]">
                  Mission Exploration, Navigation, Diagnostics &amp; Emergency Recovery Robot
                </p>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                ['LOCATE', MapPin],
                ['DIAGNOSE', Cpu],
                ['DECIDE', Gauge],
                ['PRESERVE', Shield],
              ].map(([label, IconComponent]) => {
                const Icon = IconComponent as React.ComponentType<{ className?: string }>;
                return (
                  <div key={String(label)} className="rounded-xl border border-white/10 p-4">
                    <Icon className="h-4 w-4 text-[#d57a4b]" />
                    <p className="mt-2 font-mono text-[9px] tracking-widest text-[#aaa3a1]">{String(label)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="relative overflow-hidden border-y border-white/10 bg-[#0c0a0d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(213,122,75,.16),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d57a4b]">02 / WHY GO BACK?</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-[#eee9e1] sm:text-5xl">
                Because a mission can end without its story ending.
              </h2>
            </div>
            <p className="leading-7 text-[#9e9999]">
              Inactive spacecraft are more than old hardware. Some are records of engineering decisions,
              scientific milestones and the environments they survived. A future servicing mission would need
              a clear reason to return, not an assumption that every object should be recovered.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <WhyCard icon={<Wrench className="h-5 w-5" />} title="PRESERVE">
              Some spacecraft represent important milestones in exploration and may deserve careful documentation or preservation.
            </WhyCard>
            <WhyCard icon={<Search className="h-5 w-5" />} title="LEARN">
              Older machines can help us understand how hardware changes after years in harsh environments.
            </WhyCard>
            <WhyCard icon={<Radio className="h-5 w-5" />} title="RECONNECT">
              Some inactive spacecraft may have faults that are theoretically diagnosable or, in a future mission, potentially recoverable.
            </WhyCard>
            <WhyCard icon={<Globe2 className="h-5 w-5" />} title="REDUCE FUTURE FOOTPRINT">
              Future exploration can be designed with the full mission lifecycle in mind, including what happens to hardware after operations end.
            </WhyCard>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <p className="font-serif text-2xl text-[#eee9e1]">Are you ready?</p>
            <a
              href="#simulation"
              className="inline-flex items-center gap-2 rounded-full bg-[#d57a4b] px-6 py-3 text-sm font-semibold text-[#101115] transition hover:bg-[#e08a5c]"
            >
              Run the simulation <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="universe" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d57a4b]">03 / NOT EVERYTHING NEEDS TO BE RECOVERED</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#eee9e1] sm:text-5xl">
              Should we recover every machine we leave behind?
            </h2>
            <p className="mt-4 max-w-md leading-7 text-[#9e9999]">MENDER treats recovery as a decision, not a default outcome.</p>
            <div className="mt-10">
              <OrbitDiagram />
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7f7979]">CHOOSE YOUR TARGET</p>
            <h3 className="mt-3 font-serif text-2xl text-[#eee9e1] sm:text-3xl">Recovery depends on the situation.</h3>
            <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {TARGETS.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  aria-pressed={target.id === selectedTargetId}
                  onClick={() => setSelectedTargetId(target.id)}
                  className={`flex w-full items-start justify-between gap-4 py-4 text-left transition ${
                    target.id === selectedTargetId ? 'text-[#d57a4b]' : 'text-[#d4ceca] hover:text-white'
                  }`}
                >
                  <span>
                    <span className="block font-mono text-[9px] tracking-[0.2em] text-[#8f8a8a]">{target.eyebrow}</span>
                    <span className="mt-1 block text-sm">{target.name}</span>
                  </span>
                  <span className="text-lg">{target.icon}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTarget.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-6"
              >
                <p className="text-sm leading-7 text-[#9e9999]">{selectedTarget.description}</p>
                <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.25em] text-[#7f7979]">POSSIBLE RESPONSES</p>
                <div className="mt-3 grid gap-2">
                  {selectedTarget.choices.map((choice, index) => (
                    <div key={choice} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-[#d2cdca]">
                      <span className="font-mono text-[9px] text-[#d57a4b]">0{index + 1}</span>
                      {choice}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-white/10 bg-[#0d0f14]">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="04 / HOW MENDER WORKS"
            title="Six steps. One careful decision."
            text="The recovery mission is a loop of observation, diagnosis and restraint, with intervention only when the evidence supports it."
          />
          <div className="mt-14">
            <PillarTabs
              pillars={[
                {
                  label: 'The hard part',
                  icon: <CircleAlert className="h-4 w-4 text-[#d57a4b]" />,
                  content: (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">🌡️</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Harsh environments</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">Extreme temperatures, dust, radiation and other environmental conditions can affect hardware.</p>
                      </div>
<div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">📡</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Communication</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">A recovery robot must communicate with Earth and potentially with an inactive spacecraft.</p>
                      </div>
<div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">⚡</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Power</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">A dead spacecraft may have no usable power source.</p>
                      </div>
<div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">🧭</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Navigation</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">Finding and approaching an old spacecraft autonomously is a major challenge.</p>
                      </div>
<div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">🔧</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Unknown damage</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">A spacecraft may have failed in a way that cannot be diagnosed from outside.</p>
                      </div>
<div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">💰</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Mission cost</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">Launching another spacecraft simply to recover old hardware may not always make sense.</p>
                      </div>
<div className="rounded-2xl border border-white/10 bg-[#111319] p-6">
                        <span className="text-2xl">⚖️</span>
                        <h3 className="mt-4 text-base font-medium text-[#eee9e1]">Preservation</h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f8988]">Some historical artifacts may be more valuable where they are than after being moved.</p>
                      </div>
                    </div>
                  ),
                },
                {
                  label: 'Six steps',
                  icon: <Cpu className="h-4 w-4 text-[#d57a4b]" />,
                  content: (
                    <div className="mx-auto max-w-3xl">
                      <MissionStep number="01" icon={<MapPin className="h-3.5 w-3.5" />} title="LOCATE">
                        Find the target using known mission coordinates, mapping and onboard sensors.
                      </MissionStep>
                      <MissionStep number="02" icon={<Eye className="h-3.5 w-3.5" />} title="IDENTIFY">
                        Confirm what the object is and determine its current physical condition.
                      </MissionStep>
                      <MissionStep number="03" icon={<Cpu className="h-3.5 w-3.5" />} title="DIAGNOSE">
                        Assess power, communication, mobility, structural condition and other relevant systems.
                      </MissionStep>
                      <MissionStep number="04" icon={<Gauge className="h-3.5 w-3.5" />} title="DECIDE">
                        Determine whether intervention is technically feasible, justified and safe.
                      </MissionStep>
                      <MissionStep number="05" icon={<Wrench className="h-3.5 w-3.5" />} title="INTERVENE">
                        Attempt a limited repair, communication recovery or another predefined operation.
                      </MissionStep>
                      <MissionStep number="06" icon={<Shield className="h-3.5 w-3.5" />} title="PRESERVE" last>
                        If recovery is not possible, document the condition and leave the site undisturbed.
                      </MissionStep>
                    </div>
                  ),
                },
                {
                  label: 'Reality check',
                  icon: <Info className="h-4 w-4 text-[#d57a4b]" />,
                  content: (
                    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
                      <div className="rounded-[2rem] border border-[#d57a4b]/20 bg-[#d57a4b]/5 p-7">
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#d57a4b]">REALITY CHECK</p>
                        <h3 className="mt-2 font-serif text-3xl text-[#eee9e1]">Real missions. Future concept.</h3>
                        <p className="mt-4 text-sm leading-7 text-[#b1aaa8]">
                          MENDER is a Starbound concept, not an existing NASA recovery mission. Its purpose is to
                          explore what future robotic servicing of inactive spacecraft could look like.
                        </p>
                      </div>
                      <div className="space-y-5 rounded-[2rem] border border-white/10 bg-[#101218] p-7">
                        {[
                          ['🟢', 'REAL', 'Mission history / documented data'],
                          ['🟣', 'STARBOUND CONCEPT', 'MENDER'],
                          ['⚪', 'FUTURE POSSIBILITY', 'Proposed scenarios'],
                        ].map(([dot, title, description]) => (
                          <div key={title} className="flex items-center gap-3">
                            <span>{dot}</span>
                            <div>
                              <p className="font-mono text-[9px] tracking-widest text-[#d4ceca]">{title}</p>
                              <p className="mt-0.5 text-xs text-[#777272]">{description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section id="simulation" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="05 / MENDER SIMULATION"
          title="You found something. Now decide what to do."
          text="Start with a scan. Then choose an action. The simulation deliberately allows uncertain and unsuccessful outcomes."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#101218] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-300">🔴 TARGET DETECTED</p>
                <h3 className="mt-2 text-2xl font-medium text-[#eee9e1]">{selectedTarget.name}</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-300/20 bg-red-300/10">
                <Crosshair className="h-5 w-5 text-red-300" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ['Location', selectedTarget.location],
                ['Mission', selectedTarget.mission],
                ['Status', selectedTarget.status],
                ['Mode', 'Autonomous assist'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#777272]">{label}</p>
                  <p className="mt-2 text-sm text-[#d7d1ce]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#777272]">MENDER SCAN</p>
              <div className="overflow-hidden rounded-xl border border-white/10">
                {[
                  ['📡', 'Communication', assessment.communication],
                  ['🔋', 'Power', assessment.power],
                  ['⚙️', 'Mobility', assessment.access],
                  ['🧠', 'Computer', assessment.repair],
                  ['🛡️', 'Structure', assessment.science],
                ].map(([icon, label, status]) => {
                  const typedStatus = status as Status;
                  return (
                    <div key={label} className="flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-b-0">
                      <span className="text-sm text-[#b9b2af]">{icon} {label}</span>
                      <span className="flex items-center gap-2 font-mono text-[9px] text-[#aaa3a1]">
                        <span className={`h-2 w-2 rounded-full ${statusClass(typedStatus)}`} />
                        {simulationState === 'scanning' ? 'SCANNING…' : statusText(typedStatus)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#101218] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#d57a4b]">SELECT ACTION</p>
                <h3 className="mt-2 text-2xl font-medium text-[#eee9e1]">What should MENDER do?</h3>
              </div>
              <RotateCw className={`h-5 w-5 text-[#777272] ${simulationState === 'scanning' ? 'animate-spin' : ''}`} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ActionButton action="scan" label="SCAN" icon={Search} active={selectedAction === 'scan'} disabled={simulationState === 'scanning'} onClick={() => runSimulation('scan')} />
              <ActionButton action="communicate" label="ATTEMPT COMMUNICATION" icon={Radio} active={selectedAction === 'communicate'} disabled={simulationState === 'scanning'} onClick={() => runSimulation('communicate')} />
              <ActionButton action="inspect" label="INSPECT PHYSICALLY" icon={Eye} active={selectedAction === 'inspect'} disabled={simulationState === 'scanning'} onClick={() => runSimulation('inspect')} />
              <ActionButton action="repair" label="ATTEMPT REPAIR" icon={Wrench} active={selectedAction === 'repair'} disabled={simulationState === 'scanning'} onClick={() => runSimulation('repair')} />
              <ActionButton action="leave" label="LEAVE UNDISTURBED" icon={Shield} active={selectedAction === 'leave'} disabled={simulationState === 'scanning'} onClick={() => runSimulation('leave')} wide />
            </div>

            <AnimatePresence mode="wait">
              {simulationState === 'idle' ? (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-[#d57a4b]" />
                  <p className="mt-3 text-sm text-[#aaa3a1]">Choose an action to begin the diagnostic sequence.</p>
                </motion.div>
              ) : null}

              {simulationState === 'scanning' ? (
                <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-2xl border border-[#d57a4b]/20 bg-[#d57a4b]/5 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#d57a4b]" />
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[#d57a4b]">MENDER IS DIAGNOSING…</p>
                  </div>
                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.1 }} className="h-full bg-[#d57a4b]" />
                  </div>
                </motion.div>
              ) : null}

              {simulationState === 'result' ? (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  {outcome === 'not-feasible' ? (
                    <div className="rounded-2xl border border-red-300/20 bg-red-300/5 p-6">
                      <div className="flex items-center gap-3">
                        <CircleAlert className="h-5 w-5 text-red-300" />
                        <p className="font-mono text-xs tracking-[0.2em] text-red-200">🔴 INTERVENTION NOT FEASIBLE</p>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#b9b2af]">
                        The fault cannot be confirmed remotely. MENDER will not force an intervention when power and system condition remain uncertain.
                      </p>
                    </div>
                  ) : outcome === 'possible' ? (
                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-6">
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-emerald-300" />
                        <p className="font-mono text-xs tracking-[0.2em] text-emerald-200">🟢 INTERVENTION POSSIBLE</p>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#b9b2af]">
                        The current assessment suggests a limited operation may be technically plausible. A real mission would still require detailed engineering validation before intervention.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                      <div className="flex items-center gap-3">
                        <Info className="h-5 w-5 text-[#d57a4b]" />
                        <p className="font-mono text-xs tracking-[0.2em] text-[#d4ceca]">ASSESSMENT UPDATED</p>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#9e9999]">
                        MENDER has updated the target profile. The next action depends on the evidence gathered, not on a guaranteed recovery outcome.
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d57a4b]">06 / MENDER ASSESSMENT</p>
            <h2 className="mt-3 font-serif text-4xl text-[#eee9e1] sm:text-5xl">No fake recovery score.</h2>
            <p className="mt-5 leading-7 text-[#9e9999]">
              Instead of claiming something is “80% recoverable,” MENDER presents a feasibility profile. Each dimension can carry uncertainty, and the recommended action can remain conservative.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <Search className="h-4 w-4 text-[#d57a4b]" />
              <span className="font-mono text-[10px] tracking-wider text-[#d4ceca]">RECOMMENDED ACTION: INSPECT</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#101218] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Physical access', assessment.access],
                ['Communication', assessment.communication],
                ['Power', assessment.power],
                ['Mechanical repair', assessment.repair],
                ['Scientific value', assessment.science],
                ['Intervention risk', assessment.risk],
              ].map(([label, value]) => {
                const typedStatus = value as Status;
                return (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[#bcb5b2]">{label}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${statusClass(typedStatus)}`} />
                    </div>
                    <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#777272]">
                      <span>{statusText(typedStatus)}</span>
                      <span>{typedStatus === 'good' ? '🟢' : typedStatus === 'caution' ? '🟡' : '🔴'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#0b0d11]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(213,122,75,.08),transparent_45%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="07 / FROM FIRST LIFE → SECOND LIFE"
            title="You just met an explorer at the end of its mission."
            text="Earlier, you saw what it accomplished. Now you saw what a future mission might encounter when it finds it again."
          />

          <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center">
            {[
              ['🚀', 'BUILT'],
              ['🌕 / 🔴 / 🛰️', 'EXPLORED'],
              ['📡', 'MISSION ENDS'],
              ['🌑', 'LEFT BEHIND'],
              ['🤖', 'FUTURE MISSION'],
              ['🔎', 'INSPECT'],
            ].map(([icon, label], index) => (
              <React.Fragment key={label}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="flex w-full max-w-sm items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-4"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="font-mono text-xs tracking-[0.2em] text-[#d4ceca]">{label}</span>
                </motion.div>
                {index < 5 ? <ArrowDown className="my-2 h-4 w-4 text-[#5d5959]" /> : null}
              </React.Fragment>
            ))}

            <div className="my-3 grid w-full max-w-sm grid-cols-3 gap-2 text-center">
              {[
                ['🔧', 'REPAIR'],
                ['📷', 'PRESERVE'],
                ['🌑', 'LEAVE'],
              ].map(([icon, label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-[#12141a] px-3 py-4">
                  <div>{icon}</div>
                  <p className="mt-2 font-mono text-[9px] tracking-wider text-[#8f8988]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="border-y border-white/10 bg-[#0d0f14] py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="08 / WHAT WOULD YOU DO?"
            title="Add your own solution."
            text="No account is required. Share an idea anonymously, or add a name if you want your contribution credited. New submissions are reviewed before they become public."
          />

          {/* Submission form */}
          <form
            onSubmit={handleSubmitSolution}
            className="mx-auto mt-12 grid max-w-3xl gap-4 rounded-[2rem] border border-white/10 bg-[#111319] p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#777272]">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  disabled={isAnonymous}
                  placeholder="Optional — e.g. Ari"
                  maxLength={40}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#eee9e1] placeholder:text-[#5d5959] outline-none focus:border-[#d57a4b]/50 disabled:opacity-40"
                />
              </div>
              <label className="flex items-center gap-2 self-end pb-3 font-mono text-[10px] uppercase tracking-wider text-[#aaa3a1] sm:pb-3">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(event) => setIsAnonymous(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.03] accent-[#d57a4b]"
                />
                Post anonymously
              </label>
            </div>

            <div>
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#777272]">
                Your idea <span className="text-[#d57a4b]">(required)</span>
              </label>
              <textarea
                value={ideaInput}
                onChange={(event) => setIdeaInput(event.target.value)}
                required
                rows={3}
                maxLength={280}
                placeholder="What should be done with an inactive rover or spacecraft?"
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#eee9e1] placeholder:text-[#5d5959] outline-none focus:border-[#d57a4b]/50"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#777272]">
                  Potential impact
                </label>
                <textarea
                  value={impactInput}
                  onChange={(event) => setImpactInput(event.target.value)}
                  rows={2}
                  maxLength={200}
                  placeholder="Why would this help?"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#eee9e1] placeholder:text-[#5d5959] outline-none focus:border-[#d57a4b]/50"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#777272]">
                  Drawbacks
                </label>
                <textarea
                  value={drawbacksInput}
                  onChange={(event) => setDrawbacksInput(event.target.value)}
                  rows={2}
                  maxLength={200}
                  placeholder="What could go wrong or cost too much?"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#eee9e1] placeholder:text-[#5d5959] outline-none focus:border-[#d57a4b]/50"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#5d5959]">
                {firebaseEnabled
                  ? 'reviewed before publication.'
                  : 'Local demo mode · not shared with other visitors.'}
              </p>
              <button
                type="submit"
                disabled={!ideaInput.trim() || submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#eee9e1] px-5 py-2.5 text-sm font-medium text-[#101115] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                {submitting ? 'Submitting…' : 'Submit solution'}
              </button>
            </div>

            {submitMessage ? (
              <p className="rounded-xl border border-emerald-300/15 bg-emerald-300/5 px-4 py-3 font-mono text-[10px] leading-5 text-emerald-300">
                {submitMessage}
              </p>
            ) : null}

            {submitError ? (
              <p className="rounded-xl border border-red-300/15 bg-red-300/5 px-4 py-3 font-mono text-[10px] leading-5 text-red-300">
                {submitError}
              </p>
            ) : null}

            {!firebaseEnabled ? (
              <p className="rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-xs leading-5 text-amber-100/80">
                Demo mode is active because Firebase is not connected. For the real community
                feed, connect <code className="text-amber-200">lib/firebase.ts</code> and enable
                Anonymous Authentication + Firestore. Public visitors still never need to sign in.
              </p>
            ) : null}
          </form>

          {firebaseEnabled ? (
            <p className="mx-auto mt-4 max-w-3xl text-center font-mono text-[9px] uppercase tracking-[0.16em] text-[#5d5959]">
              Community responses are also moderated before publication.
            </p>
          ) : null}

          {/* Manually scrollable card row: swipe, drag the scrollbar, or use the arrows */}
          <div className="relative mt-12">
            {solutions.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 py-10">
                <p className="font-mono text-xs text-[#5d5959]">
                  No solutions yet — be the first explorer to weigh in.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => scrollSolutions(-1)}
                    aria-label="Scroll solutions left"
                    className="h-9 w-9 rounded-full border border-white/15 text-lg text-[#eee9e1] hover:border-white/40"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSolutions(1)}
                    aria-label="Scroll solutions right"
                    className="h-9 w-9 rounded-full border border-white/15 text-lg text-[#eee9e1] hover:border-white/40"
                  >
                    ›
                  </button>
                </div>
                <div
                  ref={solutionsRowRef}
                  className="flex gap-4 overflow-x-auto pb-4 snap-x"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {solutions.map((solution) => (
                    <div key={solution.id} className="snap-start shrink-0">
                      <SolutionCard
                        solution={solution}
                        comments={commentsBySolution[solution.id] ?? []}
                        onAddComment={handleAddComment}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#d57a4b]">THE QUESTION REMAINS</p>
        <h2 className="mt-5 font-serif text-5xl font-normal leading-[1.02] text-[#eee9e1] sm:text-7xl">
          WHAT SHOULD THE
          <br />
          NEXT EXPLORER DO?
        </h2>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {['REPAIR', 'PRESERVE', 'LEARN', 'LEAVE'].map((item) => (
            <div key={item} className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-3 font-mono text-[10px] tracking-[0.15em] text-[#b7b0ad]">
              {item}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-lg leading-8 text-[#9e9999]">
          The mission may be over.
          <br />
          But the decision belongs to the explorers who come next.
        </p>
        <div className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#eee9e1] px-6 py-3 text-sm font-medium text-[#101115]">
          <span>🚀</span>
          KEEP EXPLORING
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#777272] sm:flex-row">
          <span>MENDER · Starbound concept</span>
          <span>Not an existing NASA recovery mission</span>
        </div>
      </footer>
    </main>
  );
};

export default Recovery;