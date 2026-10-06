import React, { useState } from 'react';
import { playBloop } from '../utils/sound';

interface RoverIllustrationProps {
  name: 'Spirit' | 'Oppy';
  variant?: 'exploring' | 'waving' | 'resting' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
  speechBubble?: string;
  isSpeaking?: boolean;
  onClick?: () => void;
  className?: string;
}

export const RoverIllustration: React.FC<RoverIllustrationProps> = ({
  name,
  variant = 'exploring',
  size = 'md',
  speechBubble,
  isSpeaking = false,
  onClick,
  className = '',
}) => {
  const [bounced, setBounced] = useState(false);

  const sizeClasses = {
    sm: 'w-36 h-32',
    md: 'w-52 h-44',
    lg: 'w-64 h-56',
  }[size];

  const handleClick = () => {
    playBloop(name === 'Spirit' ? 480 : 540);
    setBounced(true);
    setTimeout(() => setBounced(false), 800);
    if (onClick) onClick();
  };

  const isResting = variant === 'resting';
  const themeColor = name === 'Spirit' ? '#f59e0b' : '#0ea5e9';
  const badgeColor = name === 'Spirit' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800';

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={`Click ${name} to say beep!`}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-3xl p-2 ${className}`}
    >
   
      {speechBubble && (
        <div className={`mb-2 max-w-xs sm:max-w-sm px-4 py-2.5 bg-white/95 backdrop-blur-xs border-2 ${
          isSpeaking ? 'border-amber-400 ring-4 ring-amber-300/40 shadow-md' : 'border-amber-300'
        } rounded-2xl shadow-md text-amber-950 text-xs sm:text-sm font-bold text-center relative transition-all duration-300 animate-float-slow`}>
          <span>{speechBubble}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-amber-300" />
        </div>
      )}

   
      <svg
        viewBox="0 0 240 200"
        className={`${sizeClasses} overflow-visible drop-shadow-md`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${name}-solar`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          <linearGradient id={`${name}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

    
        <ellipse
          cx="120"
          cy={isResting ? '180' : '185'}
          rx="80"
          ry="10"
          fill="#c2410c"
          fillOpacity={isResting ? '0.35' : '0.2'}
        />

      
        <g stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        
          <path d="M 80 135 L 50 165 L 35 178" />
          <path d="M 80 135 L 90 178" />
          <path d="M 160 135 L 190 165 L 205 178" />
          <path d="M 160 135 L 150 178" />
    
          <path d="M 50 165 L 90 165" />
          <path d="M 150 165 L 190 165" />
        </g>

  
        {[
          { cx: 35, cy: 178 },
          { cx: 90, cy: 178 },
          { cx: 120, cy: 178 },
          { cx: 150, cy: 178 },
          { cx: 205, cy: 178 },
        ].map((wheel, idx) => (
          <g key={idx} className={bounced ? 'animate-spin' : ''} style={{ transformOrigin: `${wheel.cx}px ${wheel.cy}px` }}>
            <circle cx={wheel.cx} cy={wheel.cy} r="12" fill="#334155" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx={wheel.cx} cy={wheel.cy} r="6" fill="#94a3b8" />
           
            <line x1={wheel.cx - 10} y1={wheel.cy} x2={wheel.cx - 6} y2={wheel.cy} stroke="#64748b" strokeWidth="2" />
            <line x1={wheel.cx + 6} y1={wheel.cy} x2={wheel.cx + 10} y2={wheel.cy} stroke="#64748b" strokeWidth="2" />
            <line x1={wheel.cx} y1={wheel.cy - 10} x2={wheel.cx} y2={wheel.cy - 6} stroke="#64748b" strokeWidth="2" />
            <line x1={wheel.cx} y1={wheel.cy + 6} x2={wheel.cx} y2={wheel.cy + 10} stroke="#64748b" strokeWidth="2" />
          </g>
        ))}

        <polygon
          points="40,135 70,122 170,122 200,135 180,145 60,145"
          fill={`url(#${name}-solar)`}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      
        <line x1="100" y1="123" x2="95" y2="145" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="140" y1="123" x2="145" y2="145" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.7" />

      
        <rect
          x="75"
          y="126"
          width="90"
          height="32"
          rx="6"
          fill={`url(#${name}-body)`}
          stroke="#475569"
          strokeWidth="2.5"
        />

       
        <rect x="98" y="136" width="44" height="12" rx="3" fill="#ffffff" stroke={themeColor} strokeWidth="1.5" />
        <text
          x="120"
          y="145"
          fill={themeColor}
          fontSize="9"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="system-ui"
        >
          {name.toUpperCase()}
        </text>

      
        <g stroke="#64748b" strokeWidth="3" strokeLinecap="round">
          <path d="M 165 142 L 185 148 L 195 160" />
          <circle cx="195" cy="160" r="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        </g>

        <line x1="110" y1="126" x2="110" y2="70" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
      
        <circle cx="110" cy="100" r="3" fill="#94a3b8" />
        <circle cx="110" cy="74" r="4" fill="#64748b" />

      
        <path d="M 136 125 L 144 105" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="144" cy="105" rx="8" ry="4" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />

       
        <g
          className={`transition-transform duration-300 ${
            isResting ? 'rotate-[-8deg] translate-y-1' : 'hover:scale-105'
          }`}
          style={{ transformOrigin: '110px 70px' }}
        >
         
          <rect
            x="85"
            y="48"
            width="50"
            height="26"
            rx="7"
            fill="#1e293b"
            stroke={themeColor}
            strokeWidth="2.5"
          />

         
          <path d="M 83 49 C 83 45, 137 45, 137 49 Z" fill={themeColor} />

         
          {isResting ? (
           
            <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 94 62 Q 99 66 104 62" />
              <path d="M 116 62 Q 121 66 126 62" />
            </g>
          ) : (
            
            <g>
             
              <circle cx="99" cy="61" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="99" cy="61" r="5" fill="#38bdf8" />
              <circle cx="97" cy="59" r="2" fill="#ffffff" />

           
              <circle cx="121" cy="61" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="121" cy="61" r="5" fill="#38bdf8" />
              <circle cx="119" cy="59" r="2" fill="#ffffff" />
            </g>
          )}

       
          <path
            d={isResting ? 'M 105 69 Q 110 71 115 69' : 'M 103 68 Q 110 73 117 68'}
            stroke={isResting ? '#94a3b8' : '#fbbf24'}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

        
          <ellipse cx="91" cy="65" rx="3" ry="2" fill="#f43f5e" fillOpacity="0.6" />
          <ellipse cx="129" cy="65" rx="3" ry="2" fill="#f43f5e" fillOpacity="0.6" />
        </g>

       
        {isResting && (
          <g className="animate-pulse">
            <text x="145" y="45" fill="#fef08a" fontSize="14" fontWeight="bold" fontFamily="system-ui">
              z
            </text>
            <text x="155" y="32" fill="#fde047" fontSize="16" fontWeight="bold" fontFamily="system-ui">
              z
            </text>
            <text x="168" y="20" fill="#facc15" fontSize="18" fontWeight="bold" fontFamily="system-ui">
              Z
            </text>
          </g>
        )}
      </svg>

  
      <span className={`mt-1 text-xs font-bold px-3 py-1 rounded-full shadow-xs ${badgeColor}`}>
        {name}
      </span>
    </div>
  );
};
