import React, { useState } from 'react';
import { playBloop } from '../utils/sound';

interface FirstSpacecraftProps {
  className?: string;
  onClick?: () => void;
}

export const FirstSpacecraftIllustration: React.FC<FirstSpacecraftProps> = ({
  className = '',
  onClick,
}) => {
  const [waving, setWaving] = useState(false);

  const handleClick = () => {
    playBloop(580);
    setWaving(true);
    setTimeout(() => setWaving(false), 1200);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Click me to wave back!"
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-3xl p-3 ${className}`}
    >

      <div className="mb-3 px-4 py-2 bg-white/95 backdrop-blur-xs border-2 border-amber-300 rounded-2xl shadow-md text-amber-950 font-bold text-sm sm:text-base animate-float-slow text-center">
        <span>"Beep-beep! Hi friend! I am Explorer 1!"</span>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-amber-300" />
      </div>

      <svg
        viewBox="0 0 220 220"
        className="w-48 h-48 sm:w-60 sm:h-60 overflow-visible drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="40%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="noseCone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="stripes" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

     
        <g className="animate-pulse">
          <circle cx="28" cy="45" r="3" fill="#fde047" />
          <circle cx="190" cy="35" r="4" fill="#fde047" />
          <circle cx="35" cy="180" r="2.5" fill="#fde047" />
          <circle cx="195" cy="165" r="3.5" fill="#fde047" />
        </g>

        
        <ellipse cx="110" cy="205" rx="45" ry="8" fill="#d97706" fillOpacity="0.2" />

        <g className="animate-float-slow">
    
          <rect
            x="88"
            y="65"
            width="44"
            height="105"
            rx="8"
            fill="url(#rocketBody)"
            stroke="#64748b"
            strokeWidth="3"
          />

       
          <path
            d="M 88 65 Q 110 20 132 65 Z"
            fill="url(#noseCone)"
            stroke="#b91c1c"
            strokeWidth="2.5"
          />

        
          <g>
        
            <circle cx="102" cy="85" r="6" fill="#1e293b" />
            <circle cx="118" cy="85" r="6" fill="#1e293b" />
            <circle cx="100" cy="83" r="2.5" fill="#ffffff" />
            <circle cx="116" cy="83" r="2.5" fill="#ffffff" />

        
            <path
              d="M 104 94 Q 110 99 116 94"
              stroke="#1e293b"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

         
            <ellipse cx="96" cy="90" rx="3.5" ry="2" fill="#f87171" fillOpacity="0.8" />
            <ellipse cx="124" cy="90" rx="3.5" ry="2" fill="#f87171" fillOpacity="0.8" />
          </g>

    
          <rect x="88" y="104" width="44" height="12" fill="url(#stripes)" />
          <rect x="88" y="122" width="44" height="12" fill="#1e293b" />
          <rect x="88" y="140" width="44" height="12" fill="url(#stripes)" />

      
          <line x1="110" y1="20" x2="110" y2="6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="110" cy="6" r="3" fill="#facc15" className="animate-ping" />
          <circle cx="110" cy="6" r="2.5" fill="#f59e0b" />

          <path d="M 88 128 L 52 145" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="52" cy="145" r="3" fill="#cbd5e1" />

          <path d="M 132 128 L 168 145" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="168" cy="145" r="3" fill="#cbd5e1" />

       
          <g
            className={`transition-transform duration-300 ${
              waving ? 'animate-wave-arm' : 'origin-bottom-left rotate-[12deg]'
            }`}
            style={{ transformOrigin: '132px 105px' }}
          >
         
            <path
              d="M 132 105 Q 155 100 165 88"
              stroke="#f8fafc"
              strokeWidth="6"
              strokeLinecap="round"
            />
      
            <circle cx="165" cy="88" r="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 160 84 Q 165 78 170 84" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
          </g>

   
          <path
            d="M 88 105 Q 75 110 78 120"
            stroke="#f8fafc"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="78" cy="120" r="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />

   
          <polygon points="94,170 126,170 122,180 98,180" fill="#475569" />

       
          <g className="animate-pulse">
            <path
              d="M 100 180 Q 110 202 120 180 Z"
              fill="#f59e0b"
            />
            <path
              d="M 104 180 Q 110 195 116 180 Z"
              fill="#fef08a"
            />
          </g>
        </g>
      </svg>

      <span className="mt-1 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full shadow-xs">
        Explorer 1 · First American Satellite
      </span>
    </div>
  );
};
