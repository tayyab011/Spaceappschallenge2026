import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import bg from '../assets/images/cold-open-bg.jpg';

interface ColdOpenProps {
  onBegin: () => void;
  onSelectFrontierDirect?: (frontier: 'moon' | 'mars' | 'deep') => void;
  onReturnToKids?: () => void;
}

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ColdOpen: React.FC<ColdOpenProps> = ({ onBegin }) => {
  const reduced = useReducedMotion();

  const { stars, sparkles, dust } = useMemo(() => {
    const r = rng(7);
    const stars = Array.from({ length: 170 }, () => ({
      x: r() * 100,
      y: r() * 100,
      r: 0.4 + r() * 1.2,
      o: 0.3 + r() * 0.6,
      tw: r() < 0.4,
      d: r() * 6,
      s: 2.5 + r() * 4,
    }));
    const sparkles = Array.from({ length: 11 }, () => ({
      x: 4 + r() * 92,
      y: 4 + r() * 70,
      k: 0.6 + r() * 1.1,
      d: r() * 6,
    }));
    const dust = Array.from({ length: 20 }, () => ({
      x: 4 + r() * 92,
      y: 8 + r() * 82,
      size: 2 + r() * 4,
      dx: (r() - 0.5) * 90,
      dy: -20 - r() * 90,
      dur: 12 + r() * 14,
      d: -r() * 12,
      o: 0.3 + r() * 0.5,
    }));
    return { stars, sparkles, dust };
  }, []);

  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-end overflow-hidden bg-[#02050a] px-4 pb-14 pt-8 sm:pb-20">
      <style>{`
        @keyframes ab-twinkle { 0%,100% { opacity: .15 } 50% { opacity: 1 } }
        @keyframes ab-shoot {
          0% { opacity: 0; transform: translate(0,0) rotate(-35deg) }
          3% { opacity: 1 }
          9% { opacity: 0; transform: translate(-260px,182px) rotate(-35deg) }
          100% { opacity: 0; transform: translate(-260px,182px) rotate(-35deg) }
        }
        @keyframes ab-dust { from { transform: translate(0,0) } to { transform: translate(var(--dx), var(--dy)) } }
        @keyframes ab-breathe { 0%,100% { opacity: .75 } 50% { opacity: 1 } }
        @keyframes ab-ping { 0% { transform: scale(1); opacity: .7 } 100% { transform: scale(1.7); opacity: 0 } }
        .ab-twinkle { animation: ab-twinkle var(--s, 4s) ease-in-out infinite }
        .ab-shoot { position: absolute; width: 150px; height: 1.5px; opacity: 0; background: linear-gradient(90deg, #fff, rgba(255,255,255,0)); animation: ab-shoot 10s ease-in infinite }
        .ab-dust { animation: ab-dust var(--dur, 18s) ease-in-out infinite alternate }
        .ab-nebula { animation: ab-breathe 9s ease-in-out infinite }
        .ab-ping { animation: ab-ping 2.2s ease-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .ab-twinkle, .ab-dust, .ab-nebula, .ab-ping { animation: none }
          .ab-shoot { display: none }
        }
      `}</style>

      {/* nebula glow behind the photo (shows at the sides on wide screens) */}
      <div
        aria-hidden="true"
        className="ab-nebula absolute inset-0 -z-30"
        style={{
          background:
            'radial-gradient(circle at 10% 28%, rgba(96,80,220,.34), transparent 42%), radial-gradient(circle at 90% 72%, rgba(30,130,230,.3), transparent 44%), radial-gradient(circle at 78% 10%, rgba(190,90,200,.16), transparent 34%)',
        }}
      />

      {/* background photo: shown whole, edges fade into the sky */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-20 h-full -translate-x-1/2"
        style={{
          aspectRatio: '1080 / 1350',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <img src={bg} alt="" className="h-full w-full object-cover" />
      </div>

      {/* stars and sparkles drifting over the photo */}
      <svg aria-hidden="true" className="absolute inset-0 -z-[15] h-full w-full mix-blend-screen">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#fff"
            opacity={s.o}
            className={s.tw ? 'ab-twinkle' : undefined}
            style={s.tw ? ({ animationDelay: `${s.d}s`, '--s': `${s.s}s` } as React.CSSProperties) : undefined}
          />
        ))}
        {sparkles.map((s, i) => (
          <svg key={i} x={`${s.x}%`} y={`${s.y}%`} overflow="visible">
            <path
              d="M0 -9 L1.6 -1.6 L9 0 L1.6 1.6 L0 9 L-1.6 1.6 L-9 0 L-1.6 -1.6 Z"
              fill="#dff1ff"
              transform={`scale(${s.k})`}
              className="ab-twinkle"
              style={{ animationDelay: `${s.d}s`, '--s': '5s' } as React.CSSProperties}
            />
          </svg>
        ))}
      </svg>

      {/* zero-gravity dust floating around the astronaut */}
      {dust.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="ab-dust pointer-events-none absolute -z-[14] rounded-full"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.o,
              background: 'radial-gradient(circle, #fff, rgba(160,210,255,.35) 70%, transparent)',
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--dur': `${p.dur}s`,
              animationDelay: `${p.d}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* shooting stars */}
      <span aria-hidden="true" className="ab-shoot -z-[13]" style={{ left: '80%', top: '10%', animationDelay: '2s' }} />
      <span aria-hidden="true" className="ab-shoot -z-[13]" style={{ left: '30%', top: '20%', animationDelay: '6s' }} />
      <span aria-hidden="true" className="ab-shoot -z-[13]" style={{ left: '95%', top: '42%', animationDelay: '9s' }} />

      {/* readability shading for the title */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 26%, rgba(0,0,0,0) 55%)' }}
      />

      <motion.h1
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-5xl text-center"
      >
        <button
          type="button"
          onClick={onBegin}
          className="group mx-auto block rounded-xl px-4 py-2 text-[#f1ede4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#7fd6e8]"
        >
          <span
            className="block font-sans font-light uppercase leading-tight tracking-[0.1em] [text-shadow:0_2px_24px_rgba(0,0,0,0.8)] transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_30px_rgba(127,196,255,0.65)]"
            style={{ fontSize: 'clamp(1.35rem, 5.2vw, 4rem)' }}
          >
            <span className="mb-2 block text-[0.42em] tracking-[0.5em] opacity-90">Stories of</span>
            <span className="block text-balance">Abandoned Spacecrafts</span>
          </span>
          <span className="relative mx-auto mt-7 grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-black/30 text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black">
            <span aria-hidden="true" className="ab-ping absolute inset-0 rounded-full border border-white/60" />
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </motion.h1>
    </section>
  );
};