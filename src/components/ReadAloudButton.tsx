import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, subscribeSpeechState, isSpeechSupported } from '../utils/speechAudio';

interface ReadAloudButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  text,
  label = 'Read aloud',
  size = 'md',
  className = '',
}) => {
  const [isPlayingThis, setIsPlayingThis] = useState(false);
  const supported = isSpeechSupported();

  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking) => {
      if (!speaking) {
        setIsPlayingThis(false);
      }
    });
    return unsubscribe;
  }, []);

  if (!supported) return null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingThis) {
      stopSpeaking();
      setIsPlayingThis(false);
    } else {
      setIsPlayingThis(true);
      speakText(text, () => {
        setIsPlayingThis(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'h-7 px-2 text-[11px] gap-1',
    md: 'h-8 px-2.5 text-xs gap-1.5',
    lg: 'h-10 px-3.5 text-sm gap-2',
  }[size];

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size];

  return (
    <button
      onClick={handleToggle}
      type="button"
      title={isPlayingThis ? 'Stop reading' : 'Read this text out loud'}
      aria-label={isPlayingThis ? 'Stop reading' : label}
      className={`inline-flex items-center rounded-xl border font-medium transition-all select-none shadow-sm cursor-pointer ${
        isPlayingThis
          ? 'border-amber-400 bg-amber-400/20 text-amber-300 ring-2 ring-amber-400/40 animate-pulse'
          : 'border-white/20 bg-white/10 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-500/20 hover:text-white'
      } ${sizeClasses} ${className}`}
    >
      {isPlayingThis ? (
        <>
          <VolumeX className={`${iconSizes} text-amber-300`} />
          <span className="font-sans font-semibold">Stop</span>
        </>
      ) : (
        <>
          <Volume2 className={`${iconSizes} text-cyan-300`} />
          <span className="font-sans">{label}</span>
        </>
      )}
    </button>
  );
};
