import React from 'react';
import { playOrbitCue } from '../utils/sound';

interface VoyagerProps {
  className?: string;
  isSpeaking?: boolean;
  speechBubble?: string;
  onClick?: () => void;
}

export const VoyagerIllustration: React.FC<VoyagerProps> = ({
  className = '',
  isSpeaking = false,
  speechBubble,
  onClick,
}) => {
  const handleClick = () => {
    playOrbitCue();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Voyager 1 · The farthest human explorer, carrying the Golden Record into interstellar space!"
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-3xl p-3 ${className}`}
    >
    
      {speechBubble && (
        <div
          className={`mb-3 max-w-xs sm:max-w-md px-5 py-3.5 bg-white/95 backdrop-blur-xs border-2 ${
            isSpeaking ? 'border-amber-400 ring-4 ring-amber-300/40 shadow-xl' : 'border-amber-300 shadow-md'
          } rounded-3xl text-amber-950 text-sm sm:text-base font-bold relative text-center transition-all duration-300 animate-float-slow`}
        >
          <span>{speechBubble}</span>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
        </div>
      )}

      <svg
        viewBox="0 0 250 220"
        className="w-52 h-44 sm:w-64 sm:h-52 overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="voyagerDish" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <radialGradient id="goldenRecord" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
        </defs>

       
        <ellipse cx="125" cy="205" rx="58" ry="8" fill="#1e1b4b" fillOpacity="0.3" />

        <g className="animate-float-slow">
          
          <line x1="85" y1="130" x2="15" y2="40" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="15" cy="40" r="4.5" fill="#facc15" />

          
          <line x1="165" y1="130" x2="235" y2="60" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="225" y="50" width="16" height="18" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="233" cy="59" r="3.5" fill="#38bdf8" />

         
          <ellipse
            cx="125"
            cy="78"
            rx="82"
            ry="40"
            fill="url(#voyagerDish)"
            stroke="#475569"
            strokeWidth="3"
          />
         
          <ellipse cx="125" cy="78" rx="55" ry="24" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />

          
          <line x1="80" y1="78" x2="125" y2="35" stroke="#475569" strokeWidth="2" />
          <line x1="170" y1="78" x2="125" y2="35" stroke="#475569" strokeWidth="2" />
          <circle cx="125" cy="35" r="5" fill="#0284c7" />

          
          <rect
            x="95"
            y="118"
            width="60"
            height="42"
            rx="6"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="2.5"
          />

          
          <g>
            <circle
              cx="75"
              cy="142"
              r="22"
              fill="url(#goldenRecord)"
              stroke="#78350f"
              strokeWidth="2"
            />
            
            <circle cx="75" cy="142" r="16" fill="none" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.7" />
            <circle cx="75" cy="142" r="10" fill="none" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.7" />
            <circle cx="75" cy="142" r="4" fill="#78350f" />
           
            <line x1="75" y1="142" x2="88" y2="135" stroke="#fef08a" strokeWidth="1" />
            <line x1="75" y1="142" x2="65" y2="130" stroke="#fef08a" strokeWidth="1" />
          </g>

         
          <g>
            <ellipse cx="114" cy="74" rx="5" ry="6" fill="#1e293b" />
            <ellipse cx="136" cy="74" rx="5" ry="6" fill="#1e293b" />
            <circle cx="112" cy="72" r="2" fill="#ffffff" />
            <circle cx="134" cy="72" r="2" fill="#ffffff" />
            
            <path d="M 120 81 Q 125 84 130 81" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      <span className="mt-1 text-xs font-semibold text-sky-900 bg-sky-100/90 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-sky-200 transition-colors">
        Voyager 1 (1977 · Interstellar Space)
      </span>
    </div>
  );
};
