import React from 'react';
import { playRoverRoll } from '../utils/sound';

interface ApolloProps {
  className?: string;
  isSpeaking?: boolean;
  speechBubble?: string;
  onClick?: () => void;
}

export const ApolloIllustration: React.FC<ApolloProps> = ({
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
      title="Apollo Lunar Roving Vehicle · The first car driven on the Moon!"
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
        viewBox="0 0 260 210"
        className="w-52 h-44 sm:w-64 sm:h-52 overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lunarVisor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="lrvChassis" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <ellipse cx="130" cy="188" rx="90" ry="10" fill="#0f172a" fillOpacity="0.3" />
        <g>
          <line x1="68" y1="125" x2="68" y2="45" stroke="#475569" strokeWidth="3" />
 
          <path
            d="M 45 42 Q 68 22 91 42 Z"
            fill="#cbd5e1"
            stroke="#475569"
            strokeWidth="2"
          />
          <circle cx="68" cy="28" r="3.5" fill="#f59e0b" />
        </g>

    
        <g>
     
          <rect x="110" y="78" width="46" height="52" rx="12" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
        
          <rect x="148" y="75" width="16" height="45" rx="6" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
      
          <circle cx="132" cy="62" r="22" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
      
          <path
            d="M 116 62 Q 132 50 148 62 Q 148 72 132 74 Q 116 72 116 62 Z"
            fill="url(#lunarVisor)"
            stroke="#78350f"
            strokeWidth="1.5"
          />
        
          <ellipse cx="126" cy="58" rx="4" ry="2" fill="#ffffff" fillOpacity="0.8" />
       
          <path d="M 152 90 Q 175 75 180 55" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" />
          <path d="M 152 90 Q 175 75 180 55" stroke="#475569" strokeWidth="10" strokeLinecap="round" strokeDasharray="0 999" />
       
          <circle cx="180" cy="55" r="7" fill="#64748b" />
          <polygon points="186,45 194,48 190,56 182,53" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="188" cy="50" r="1.5" fill="#ffffff" />
        </g>

      
        <g>
          <rect x="58" y="125" width="144" height="24" rx="6" fill="url(#lrvChassis)" stroke="#334155" strokeWidth="2.5" />
        
          <line x1="152" y1="125" x2="155" y2="95" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <line x1="102" y1="125" x2="108" y2="108" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="102" y1="108" x2="114" y2="108" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </g>

        {[
          { cx: 70, cy: 168 },
          { cx: 120, cy: 172 },
          { cx: 190, cy: 168 },
        ].map((w, idx) => (
          <g key={idx}>
            <circle cx={w.cx} cy={w.cy} r="18" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
            <circle cx={w.cx} cy={w.cy} r="10" fill="#1e293b" />
            <circle cx={w.cx} cy={w.cy} r="3" fill="#cbd5e1" />
            <line x1={w.cx - 14} y1={w.cy} x2={w.cx + 14} y2={w.cy} stroke="#cbd5e1" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1={w.cx} y1={w.cy - 14} x2={w.cx} y2={w.cy + 14} stroke="#cbd5e1" strokeWidth="1.5" strokeOpacity="0.6" />
          </g>
        ))}
      </svg>

      <span className="mt-1 text-xs font-semibold text-slate-800 bg-slate-100/90 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-slate-200 transition-colors">
        Apollo 15 Lunar Rover (1971)
      </span>
    </div>
  );
};
