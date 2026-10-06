import React from 'react';
import { playOrbitCue } from '../utils/sound';

interface PioneerProps {
  className?: string;
  isSpeaking?: boolean;
  speechBubble?: string;
  onClick?: () => void;
}

export const PioneerIllustration: React.FC<PioneerProps> = ({
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
      title="Pioneer 11 · First to visit Saturn!"
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
          <linearGradient id="pioneerDish" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="goldPlaque" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

       
        <ellipse cx="125" cy="205" rx="55" ry="8" fill="#d97706" fillOpacity="0.2" />

        <g className="animate-float-slow">
         
          <line x1="85" y1="135" x2="25" y2="155" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <rect x="15" y="148" width="16" height="14" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />

          <line x1="165" y1="135" x2="225" y2="155" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <rect x="220" y="148" width="16" height="14" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />

       
          <ellipse
            cx="125"
            cy="80"
            rx="75"
            ry="38"
            fill="url(#pioneerDish)"
            stroke="#475569"
            strokeWidth="3"
          />
        
          <ellipse cx="125" cy="80" rx="48" ry="22" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />

        
          <line x1="85" y1="80" x2="125" y2="40" stroke="#475569" strokeWidth="2" />
          <line x1="165" y1="80" x2="125" y2="40" stroke="#475569" strokeWidth="2" />
          <circle cx="125" cy="40" r="5" fill="#f59e0b" />

       
          <polygon
            points="95,115 155,115 170,150 155,175 95,175 80,150"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="2.5"
          />

         
          <g>
            <rect
              x="100"
              y="125"
              width="50"
              height="34"
              rx="4"
              fill="url(#goldPlaque)"
              stroke="#b45309"
              strokeWidth="2"
            />
           
            <circle cx="115" cy="136" r="2.5" fill="#78350f" />
            <line x1="115" y1="139" x2="115" y2="152" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="132" cy="138" r="2.2" fill="#78350f" />
            <line x1="132" y1="140" x2="132" y2="152" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
           
            <line x1="124" y1="144" x2="140" y2="132" stroke="#78350f" strokeWidth="1" />
            <line x1="124" y1="144" x2="142" y2="144" stroke="#78350f" strokeWidth="1" />
          </g>

      
          <g>
            <ellipse cx="112" cy="74" rx="5" ry="6" fill="#1e293b" />
            <ellipse cx="138" cy="74" rx="5" ry="6" fill="#1e293b" />
            <circle cx="110" cy="72" r="2" fill="#ffffff" />
            <circle cx="136" cy="72" r="2" fill="#ffffff" />
            <path d="M 118 82 Q 125 86 132 82" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      <span className="mt-1 text-xs font-semibold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-amber-200 transition-colors">
        Pioneer 10 & 11 (1972)
      </span>
    </div>
  );
};
