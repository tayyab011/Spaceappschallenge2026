import React from 'react';
import { playRoverRoll } from '../utils/sound';

interface SojournerProps {
  className?: string;
  isSpeaking?: boolean;
  speechBubble?: string;
  onClick?: () => void;
}

export const SojournerIllustration: React.FC<SojournerProps> = ({
  className = '',
  isSpeaking = false,
  speechBubble,
  onClick,
}) => {
  const handleClick = () => {
    playRoverRoll();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Sojourner · First wheeled vehicle on Mars (1997)! Tap to hear her roll!"
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
        viewBox="0 0 240 200"
        className="w-48 h-44 sm:w-60 sm:h-52 overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sojournerSolar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>
          <linearGradient id="sojournerBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

       
        <ellipse cx="120" cy="180" rx="76" ry="10" fill="#c2410c" fillOpacity="0.25" />

       
        <g stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        
          <path d="M 90 135 L 55 165" />
          <path d="M 90 135 L 90 168" />
          <path d="M 150 135 L 185 165" />
          <path d="M 150 135 L 150 168" />
        </g>

       
        {[
          { cx: 50, cy: 168 },
          { cx: 85, cy: 172 },
          { cx: 120, cy: 174 },
          { cx: 155, cy: 172 },
          { cx: 190, cy: 168 },
        ].map((w, idx) => (
          <g key={idx}>
            <circle cx={w.cx} cy={w.cy} r="13" fill="#334155" stroke="#94a3b8" strokeWidth="2.5" />
            
            <circle cx={w.cx} cy={w.cy} r="6" fill="#64748b" />
            <circle cx={w.cx} cy={w.cy} r="2.5" fill="#f59e0b" />
          </g>
        ))}

       
        <rect
          x="68"
          y="105"
          width="104"
          height="45"
          rx="10"
          fill="url(#sojournerBody)"
          stroke="#b45309"
          strokeWidth="3"
        />

       
        <rect
          x="60"
          y="95"
          width="120"
          height="14"
          rx="4"
          fill="url(#sojournerSolar)"
          stroke="#075985"
          strokeWidth="2"
        />
    
        <line x1="84" y1="95" x2="84" y2="109" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="108" y1="95" x2="108" y2="109" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="132" y1="95" x2="132" y2="109" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="156" y1="95" x2="156" y2="109" stroke="#38bdf8" strokeWidth="1.5" />

    
        <g>
       
          <rect x="86" y="112" width="68" height="28" rx="8" fill="#1e293b" />
      
          <ellipse cx="106" cy="125" rx="5.5" ry="6.5" fill="#38bdf8" />
          <ellipse cx="134" cy="125" rx="5.5" ry="6.5" fill="#38bdf8" />
          <circle cx="104" cy="123" r="2" fill="#ffffff" />
          <circle cx="132" cy="123" r="2" fill="#ffffff" />
       
          <path d="M 114 132 Q 120 136 126 132" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        </g>

       
        <path d="M 68 135 L 42 145 L 36 158" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36" cy="158" r="4" fill="#ef4444" />

        <line x1="162" y1="95" x2="175" y2="60" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        <circle cx="175" cy="60" r="3" fill="#f59e0b" />
      </svg>

      <span className="mt-1 text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-amber-200 transition-colors">
        Sojourner (1997 · Mars Pathfinder)
      </span>
    </div>
  );
};
