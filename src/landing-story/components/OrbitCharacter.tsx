import React, { useState } from 'react';
import { playChirp } from '../utils/sound';

interface OrbitCharacterProps {
  mood?: 'happy' | 'curious' | 'waving' | 'excited' | 'sleepy' | 'gentle';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  isFlapping?: boolean;
  isSpeaking?: boolean;
  className?: string;
  onClick?: () => void;
}

export const OrbitCharacter: React.FC<OrbitCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  speechBubble,
  isFlapping = false,
  isSpeaking = false,
  className = '',
  onClick,
}) => {
  const [internalWaving, setInternalWaving] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44',
    lg: 'w-48 h-56',
    xl: 'w-64 h-72',
  }[size];

  const handleClick = () => {
    playChirp();
    setInternalWaving(true);
    setTimeout(() => setInternalWaving(false), 1400);
    if (onClick) onClick();
  };

  const isExcited = isFlapping || internalWaving || isSpeaking || mood === 'excited' || mood === 'waving';

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Click Orbit to say hello!"
      className={`relative inline-flex flex-col items-center select-none cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-3xl p-2 ${className}`}
    >
     
      {speechBubble && (
        <div className={`mb-3 max-w-xs sm:max-w-md px-5 py-3.5 bg-white/95 backdrop-blur-sm border-2 ${
          isSpeaking ? 'border-amber-400 ring-4 ring-amber-300/40 shadow-xl' : 'border-amber-300 shadow-md'
        } rounded-3xl text-amber-950 text-sm sm:text-base font-bold relative text-center transition-all duration-300 animate-float-slow`}>
          <span>{speechBubble}</span>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
        </div>
      )}

     
      <svg
        viewBox="0 0 200 220"
        className={`${sizeClasses} overflow-visible drop-shadow-md`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dishGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="70%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="solarPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        
        <ellipse cx="100" cy="208" rx="42" ry="7" fill="#d97706" fillOpacity="0.25" />

     
        <g
          className={`transition-transform duration-300 ${
            isExcited ? 'animate-wave-arm' : 'origin-bottom-right rotate-[-6deg]'
          }`}
          style={{ transformOrigin: '55px 135px' }}
        >
         
          <circle cx="55" cy="135" r="6" fill="#78350f" />
          <rect x="50" y="132" width="10" height="6" rx="2" fill="#92400e" />
         
          <rect
            x="14"
            y="118"
            width="42"
            height="26"
            rx="5"
            fill="url(#solarPanelGrad)"
            stroke="#1e293b"
            strokeWidth="2"
          />
         
          <line x1="28" y1="118" x2="28" y2="144" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="42" y1="118" x2="42" y2="144" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="14" y1="131" x2="56" y2="131" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.8" />
        </g>

        <g
          className={`transition-transform duration-300 ${
            isExcited ? 'animate-wave-arm' : 'origin-bottom-left rotate-[6deg]'
          }`}
          style={{ transformOrigin: '145px 135px', animationDirection: 'reverse' }}
        >
         
          <circle cx="145" cy="135" r="6" fill="#78350f" />
         
          <rect
            x="144"
            y="118"
            width="42"
            height="26"
            rx="5"
            fill="url(#solarPanelGrad)"
            stroke="#1e293b"
            strokeWidth="2"
          />
         
          <line x1="158" y1="118" x2="158" y2="144" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="172" y1="118" x2="172" y2="144" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="144" y1="131" x2="186" y2="131" stroke="#7dd3fc" strokeWidth="1.5" strokeOpacity="0.8" />
        </g>

     
        <g className="animate-float-slow">
          <circle
            cx="100"
            cy="142"
            r="44"
            fill="url(#bodyGrad)"
            stroke="#d97706"
            strokeWidth="3.5"
          />

         
          <rect
            x="76"
            y="126"
            width="48"
            height="34"
            rx="12"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="2"
          />

       
          {mood === 'sleepy' ? (
           
            <g stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
              <path d="M84 142 Q 90 146 96 142" />
              <path d="M104 142 Q 110 146 116 142" />
            </g>
          ) : (
          
            <g fill="#38bdf8" filter="url(#glowLight)">
              <ellipse cx="90" cy="141" rx="5.5" ry="6.5" />
              <ellipse cx="110" cy="141" rx="5.5" ry="6.5" />
             
              <circle cx="88" cy="139" r="2" fill="#ffffff" />
              <circle cx="108" cy="139" r="2" fill="#ffffff" />
            </g>
          )}

    
          <path
            d={mood === 'sleepy' ? 'M94 153 Q 100 155 106 153' : 'M92 151 Q 100 157 108 151'}
            stroke={mood === 'sleepy' ? '#94a3b8' : '#38bdf8'}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

       
          <ellipse cx="82" cy="146" rx="4" ry="2.5" fill="#f43f5e" fillOpacity="0.5" />
          <ellipse cx="118" cy="146" rx="4" ry="2.5" fill="#f43f5e" fillOpacity="0.5" />

         
          <circle cx="100" cy="172" r="4" fill="#ef4444" className="animate-pulse" />

         
          <rect x="92" y="93" width="16" height="10" rx="3" fill="#b45309" />
          <circle cx="100" cy="98" r="3" fill="#fde047" />

        
          <g
            className="animate-dish-tilt"
            style={{ transformOrigin: '100px 92px' }}
          >
        
            <line x1="100" y1="58" x2="100" y2="40" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
           
            <circle cx="100" cy="38" r="6" fill="#f43f5e" filter="url(#glowLight)" className="animate-ping" />
            <circle cx="100" cy="38" r="5" fill="#fb7185" />

            <path
              d="M 58 72 C 60 96, 140 96, 142 72 C 142 62, 58 62, 58 72 Z"
              fill="url(#dishGrad)"
              stroke="#b45309"
              strokeWidth="3"
            />
            
            <ellipse cx="100" cy="72" rx="32" ry="10" fill="#fef9c3" stroke="#f59e0b" strokeWidth="1.5" />
            <ellipse cx="100" cy="72" rx="18" ry="6" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="100" cy="72" r="5" fill="#b45309" />
            <circle cx="100" cy="72" r="2.5" fill="#fde047" />
          </g>
        </g>
      </svg>

      <span className="mt-1 text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full shadow-xs group-hover:bg-amber-200 transition-colors">
        Orbit
      </span>
    </div>
  );
};
