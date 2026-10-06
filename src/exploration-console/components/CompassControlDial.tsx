import React from 'react';

interface CompassControlDialProps {
  headingDeg: number;
  onRotatePort: () => void;
  onRotateStarboard: () => void;
  onResetHeading: () => void;
}

export const CompassControlDial: React.FC<CompassControlDialProps> = ({
  headingDeg,
  onRotatePort,
  onRotateStarboard,
  onResetHeading,
}) => {
  return (
    <div className="pointer-events-auto flex items-center gap-2 select-none">
     
      <span className="rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-slate-300 border border-white/10 backdrop-blur-md">
        1x
      </span>

      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md shadow-2xl">
        <div
          className="absolute inset-1 rounded-full transition-transform duration-100"
          style={{ transform: `rotate(${-headingDeg}deg)` }}
        >
          <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold text-amber-300">
            N
          </span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[8px] font-bold text-slate-400">
            E
          </span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold text-slate-400">
            S
          </span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-mono text-[8px] font-bold text-slate-400">
            W
          </span>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rotate-45 border-t-2 border-r-2 border-white" />
        </div>

        <button
          onClick={onResetHeading}
          className="relative z-10 flex flex-col items-center justify-center rounded-full h-14 w-14 hover:bg-white/10 transition-colors text-center cursor-pointer"
          title="Click to reset camera azimuth to forward"
        >
          <span className="font-mono text-[10px] font-bold text-white tabular-nums">
            {headingDeg}°
          </span>
          <span className="font-sans text-[8px] leading-tight text-slate-300">
            Rotate camera
          </span>
        </button>

        <button
          onClick={onRotatePort}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-xs text-white cursor-pointer"
          title="Rotate camera left"
        >
          ‹
        </button>
        <button
          onClick={onRotateStarboard}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-xs text-white cursor-pointer"
          title="Rotate camera right"
        >
          ›
        </button>
      </div>
    </div>
  );
};
