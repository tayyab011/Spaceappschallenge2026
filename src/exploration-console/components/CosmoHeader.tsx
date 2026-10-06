import React from 'react';
import { NasaMission } from '../types';
import { NASA_MISSIONS } from '../data/nasaMissions';

interface CosmoHeaderProps {
  currentMission: NasaMission;
  onSelectMission: (mission: NasaMission) => void;
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const CosmoHeader: React.FC<CosmoHeaderProps> = ({
  currentMission,
  onSelectMission,
  onBack,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="relative z-40 flex items-center justify-between border-b border-white/10 bg-[#0d0f15]/90 px-3 sm:px-6 py-2.5 backdrop-blur-xl select-none">
      
  
      <div className="flex items-center gap-2.5 sm:gap-4">
        
        <button
        
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 font-sans text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          title="Return / Reset Mission"
        >
          <span className="text-base font-bold leading-none">←</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5">
          <select
            value={currentMission.id}
            onChange={(e) => {
              const m = NASA_MISSIONS.find((x) => x.id === e.target.value);
              if (m) onSelectMission(m);
            }}
            className="rounded-xl border border-white/15 bg-[#171a24] px-2.5 sm:px-3 py-1.5 font-sans text-xs sm:text-sm font-bold text-slate-100 hover:border-amber-400 focus:border-amber-400 focus:outline-none cursor-pointer shadow-inner max-w-[200px] sm:max-w-none truncate"
          >
            <optgroup label="Surface Rovers">
              {NASA_MISSIONS.filter((m) => m.missionType === 'surface_rover').map((m) => (
                <option key={m.id} value={m.id} className="bg-[#12151e] text-white">
                  #{m.number} {m.name} ({m.targetDestination})
                </option>
              ))}
            </optgroup>
            <optgroup label="Planetary Flybys">
              {NASA_MISSIONS.filter((m) => m.missionType === 'orbital_flyby').map((m) => (
                <option key={m.id} value={m.id} className="bg-[#12151e] text-white">
                  #{m.number} {m.name} ({m.targetDestination})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 font-sans text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
        </button>
      </div>
    </header>
  );
};
