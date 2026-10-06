import React from 'react';
import { ScienceSite } from '../types';

interface CenterTargetReticleProps {
  currentSite: ScienceSite | null;
  missionName: string;
  sites: ScienceSite[];
  onSelectSite: (site: ScienceSite) => void;
  onDriveToSite: () => void;
  onMoveToNextSite: (nextSite: ScienceSite) => void;
  isDriving: boolean;
  hasReachedDestination: boolean;
}

export const CenterTargetReticle: React.FC<CenterTargetReticleProps> = ({
  currentSite,
  missionName,
  sites,
  onSelectSite,
  onDriveToSite,
  onMoveToNextSite,
  isDriving,
  hasReachedDestination,
}) => {
  const displayTitle = currentSite ? currentSite.name.toUpperCase() : 'SURFACE SECTOR / AREA 1';

  const currentIndex = sites.findIndex((s) => s.id === currentSite?.id);
  const nextSite = sites.length > 1 ? sites[(currentIndex + 1) % sites.length] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between items-center py-3 px-3 select-none">
      
      <div className="flex flex-col items-center text-center mt-0.5 max-w-xl px-2">
        <span className="rounded-full bg-white/10 px-3 py-0.5 font-mono text-[10px] font-bold text-amber-300 border border-white/15 backdrop-blur-md shadow-sm">
          Target Exploration Site · {missionName}
        </span>
        
        <h1 className="mt-1 font-sans text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg leading-tight">
          {displayTitle}
        </h1>
        {sites.length > 1 && (
          <div className="pointer-events-auto mt-2 flex items-center justify-center gap-1.5 flex-wrap">
            {sites.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSite(s)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-sans text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                  currentSite?.id === s.id
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-white/60 shadow-amber-500/20'
                    : 'bg-black/60 text-slate-200 hover:text-white hover:bg-black/80 border border-white/15 backdrop-blur-md'
                }`}
                title={`Click destination: ${s.name}`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.beaconColor }} />
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentSite && (
        <div className="pointer-events-auto flex flex-col items-center gap-2 my-auto">
          <div className="flex items-center gap-2.5 opacity-80">
            <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
            <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

 <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#161218]/95 shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-xl p-1.5 text-center">
            {hasReachedDestination ? (
             
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => nextSite && onMoveToNextSite(nextSite)}
                  className="px-4 py-2 rounded-xl text-center font-sans text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>▶ Move to Next: {nextSite?.name || 'Next Site'}</span>
                  <span className="text-base font-bold leading-none">→</span>
                </button>
                <span className="font-mono text-[9px] text-emerald-300/90">
                  Arrived at destination · Click to navigate to next site
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={onDriveToSite}
                  disabled={isDriving}
                  className={`px-5 py-2 rounded-xl text-center font-sans text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer whitespace-nowrap ${
                    isDriving
                      ? 'bg-amber-400 text-slate-950 animate-pulse cursor-wait'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95'
                  }`}
                >
                  {isDriving ? '⟳ NAVIGATING TO SITE...' : '▶ DRIVE HERE'}
                </button>
                <span className="font-mono text-[9px] text-slate-300">
                  {isDriving ? 'En route · Sensors deploying...' : 'Click to drive · Drag screen to look around 360°'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

     
      <div className="h-2" />
    </div>
  );
};
