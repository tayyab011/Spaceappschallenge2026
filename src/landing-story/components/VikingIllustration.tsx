import React from 'react';
import { playBloop } from '../utils/sound';

interface VikingIllustrationProps {
  size?: 'sm' | 'md' | 'lg';
  speechBubble?: string;
  isSpeaking?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Simple storybook drawing of Viking 1: a three-legged lander (it never had wheels). */
export const VikingIllustration: React.FC<VikingIllustrationProps> = ({
  size = 'md',
  speechBubble,
  isSpeaking = false,
  onClick,
  className = '',
}) => {
  const sizeClasses = { sm: 'w-36 h-32', md: 'w-52 h-44', lg: 'w-64 h-56' }[size];

  return (
    <div
      onClick={() => {
        playBloop(500);
        onClick?.();
      }}
      role="button"
      tabIndex={0}
      title="Click Viking 1 to say hello!"
      className={`relative inline-flex flex-col items-center select-none cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {speechBubble && (
        <div
          className={`mb-2 max-w-xs sm:max-w-sm px-4 py-2.5 bg-white/95 border-2 ${
            isSpeaking ? 'border-amber-400 ring-4 ring-amber-300/40' : 'border-amber-300'
          } rounded-2xl shadow-md text-amber-950 text-xs sm:text-sm font-bold text-center`}
        >
          {speechBubble}
        </div>
      )}
      <svg viewBox="0 0 240 200" className={`${sizeClasses} overflow-visible drop-shadow-md`} fill="none">
        <ellipse cx="120" cy="185" rx="85" ry="10" fill="#c2410c" fillOpacity="0.25" />
        {/* legs and foot pads */}
        <g stroke="#475569" strokeWidth="4" strokeLinecap="round">
          <path d="M 95 125 L 55 172" />
          <path d="M 145 125 L 185 172" />
          <path d="M 120 130 L 120 174" />
        </g>
        <ellipse cx="52" cy="176" rx="14" ry="5" fill="#64748b" />
        <ellipse cx="188" cy="176" rx="14" ry="5" fill="#64748b" />
        <ellipse cx="120" cy="178" rx="14" ry="5" fill="#64748b" />
        {/* body */}
        <polygon points="80,125 160,125 172,95 68,95" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
        <rect x="95" y="105" width="50" height="14" rx="3" fill="#94a3b8" />
        {/* camera mast and dish */}
        <rect x="150" y="62" width="5" height="34" fill="#64748b" />
        <circle cx="152" cy="58" r="7" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
        <circle cx="152" cy="58" r="2.5" fill="#0f172a" />
        <ellipse cx="96" cy="86" rx="18" ry="7" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
        <line x1="96" y1="90" x2="96" y2="96" stroke="#475569" strokeWidth="3" />
        {/* sampler arm */}
        <path d="M 70 108 L 38 122 L 28 134" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <circle cx="27" cy="136" r="4" fill="#334155" />
      </svg>
      <span className="mt-1 rounded-full bg-orange-100 px-3 py-0.5 text-xs font-bold text-orange-800">Viking 1</span>
    </div>
  );
};

export default VikingIllustration;
