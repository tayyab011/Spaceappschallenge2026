import React from 'react';

interface MissionProps {
  emoji: string;
  name: string;
  year: string;
  speechBubble?: string;
  isSpeaking?: boolean;
  dark?: boolean;
  onClick?: () => void;
}

export const MissionIllustration: React.FC<MissionProps> = ({
  emoji, name, year, speechBubble, isSpeaking = false, dark = false, onClick,
}) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    title={`${name} (${year})`}
    className="relative inline-flex flex-col items-center select-none cursor-pointer transition-all duration-300 hover:scale-[1.02] focus:outline-none rounded-3xl p-3"
  >
    {speechBubble && (
      <div className={`mb-3 px-4 py-2 rounded-2xl border shadow-lg text-sm sm:text-base font-bold text-center max-w-[220px] ${
        dark ? 'bg-purple-950/80 border-purple-400/50 text-purple-100' : 'bg-white/90 border-slate-400/60 text-amber-900'
      }`}>
        {speechBubble}
      </div>
    )}
    <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-6xl sm:text-7xl border-4 shadow-xl ${
      isSpeaking ? 'animate-pulse ' : ''
    }${dark ? 'bg-indigo-950 border-purple-400/60' : 'bg-slate-200 border-slate-400'}`}>
      {emoji}
    </div>
    <div className={`mt-2 text-xs sm:text-sm font-mono font-bold ${dark ? 'text-purple-200' : 'text-amber-900'}`}>
      {name} ({year})
    </div>
  </div>
);

export default MissionIllustration;
