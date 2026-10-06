import React from 'react';
import { playRadioBeep } from '../utils/sound';

interface LunaProps {
  className?: string;
  isSpeaking?: boolean;
  speechBubble?: string;
  onClick?: () => void;
}

export const LunaIllustration: React.FC<LunaProps> = ({
  className = '',
  isSpeaking = false,
  speechBubble,
  onClick,
}) => {
  const handleClick = () => {
    playRadioBeep(920, 0.14);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Luna 1 · The probe that missed the Moon and discovered the solar wind!"
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
          <radialGradient id="lunaMetal" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#e0e7ff" />
            <stop offset="80%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4338ca" />
          </radialGradient>
        </defs>

        <ellipse cx="120" cy="205" rx="46" ry="8" fill="#4338ca" fillOpacity="0.2" />

        <g className="animate-float-slow">
   
          <line x1="120" y1="52" x2="120" y2="12" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="12" r="5" fill="#a5b4fc" stroke="#4338ca" strokeWidth="2" />

  
          <line x1="85" y1="65" x2="25" y2="25" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="155" y1="65" x2="215" y2="25" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="125" x2="18" y2="175" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="165" y1="125" x2="222" y2="175" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

        
          <g opacity="0.6">
            <circle cx="35" cy="85" r="2.5" fill="#fde047" />
            <circle cx="55" cy="100" r="1.5" fill="#fde047" />
            <circle cx="195" cy="80" r="2" fill="#fde047" />
            <circle cx="210" cy="115" r="2.5" fill="#fde047" />
          </g>

     
          <circle
            cx="120"
            cy="105"
            r="48"
            fill="url(#lunaMetal)"
            stroke="#3730a3"
            strokeWidth="3.5"
          />

  
          <g>
        
            <circle cx="106" cy="100" r="6" fill="#1e1b4b" />
            <circle cx="104" cy="98" r="2" fill="#ffffff" />
          
            <path d="M 128 100 Q 134 94 140 100" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
        
            <ellipse cx="98" cy="110" rx="4" ry="2.5" fill="#f43f5e" fillOpacity="0.4" />
            <ellipse cx="142" cy="110" rx="4" ry="2.5" fill="#f43f5e" fillOpacity="0.4" />
           
            <path d="M 112 112 Q 120 122 128 112" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>

      <span className="mt-1 text-xs font-semibold text-indigo-900 bg-indigo-100/80 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-indigo-200 transition-colors">
        Luna 1 (1959)
      </span>
    </div>
  );
};
