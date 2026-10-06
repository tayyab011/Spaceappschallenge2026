import React from 'react';
import { playRadioBeep } from '../utils/sound';

interface SputnikProps {
  className?: string;
  isSpeaking?: boolean;
  speechBubble?: string;
  onClick?: () => void;
}


export const SputnikIllustration: React.FC<SputnikProps> = ({
  className = '',
  isSpeaking = false,
  speechBubble,
  onClick,
}) => {
  const handleClick = () => {
    playRadioBeep(880, 0.12);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Pioneer 1 · Tap to hear a radio beep!"
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
        viewBox="0 0 240 220"
        className="w-48 h-48 sm:w-60 sm:h-60 overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pioneerMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="35%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        
        <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
          <path d="M 175 60 A 60 60 0 0 1 205 105" strokeDasharray="4 4" />
          <path d="M 185 45 A 80 80 0 0 1 225 105" strokeDasharray="5 5" />
          <path d="M 65 60 A 60 60 0 0 0 35 105" strokeDasharray="4 4" />
          <path d="M 55 45 A 80 80 0 0 0 15 105" strokeDasharray="5 5" />
        </g>

        
        <ellipse cx="120" cy="205" rx="48" ry="8" fill="#d97706" fillOpacity="0.2" />

      
        <g className="animate-float-slow">
          
          <line x1="120" y1="42" x2="120" y2="14" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="12" r="3.5" fill="#f59e0b" />

          
          <polygon
            points="104,42 136,42 150,72 90,72"
            fill="url(#pioneerMetal)"
            stroke="#475569"
            strokeWidth="3"
            strokeLinejoin="round"
          />

         
          <rect
            x="90"
            y="72"
            width="60"
            height="56"
            rx="3"
            fill="url(#pioneerMetal)"
            stroke="#475569"
            strokeWidth="3"
          />

          <rect x="90" y="80" width="60" height="6" fill="#1e293b" fillOpacity="0.75" />
          <rect x="90" y="114" width="60" height="6" fill="#1e293b" fillOpacity="0.75" />

          
          <polygon
            points="90,128 150,128 136,156 104,156"
            fill="url(#pioneerMetal)"
            stroke="#475569"
            strokeWidth="3"
            strokeLinejoin="round"
          />

       
          <polygon points="110,156 130,156 127,168 113,168" fill="#475569" />

         
          <g>
            <ellipse cx="108" cy="97" rx="5.5" ry="6.5" fill="#1e293b" />
            <ellipse cx="132" cy="97" rx="5.5" ry="6.5" fill="#1e293b" />
            <circle cx="106" cy="94.5" r="2.2" fill="#ffffff" />
            <circle cx="130" cy="94.5" r="2.2" fill="#ffffff" />
          </g>

          
          <ellipse cx="98" cy="105" rx="4" ry="2.3" fill="#f43f5e" fillOpacity="0.45" />
          <ellipse cx="142" cy="105" rx="4" ry="2.3" fill="#f43f5e" fillOpacity="0.45" />

          
          <path
            d="M 113 105 Q 120 111 127 105"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      <span className="mt-1 text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-amber-200 transition-colors">
        Pioneer 1 (1958)
      </span>
    </div>
  );
};