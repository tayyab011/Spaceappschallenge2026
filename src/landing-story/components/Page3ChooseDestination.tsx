import React, { useEffect } from 'react';
import { OrbitCharacter } from './OrbitCharacter';
import { playBloop, playPageTurn, playSceneMusic } from '../utils/sound';
import { speakDialogue } from '../utils/speech';

export type DestinationChoice = 'mars' | 'moon' | 'deep_space';

interface Page3Props {
  selectedDestination: DestinationChoice | null;
  onSelectDestination: (choice: DestinationChoice) => void;
}

export const Page3ChooseDestination: React.FC<Page3Props> = ({
  selectedDestination,
  onSelectDestination,
}) => {
  useEffect(() => {
    playSceneMusic('earth');
  }, []);

  const handleSelect = (choice: DestinationChoice) => {
    playBloop(choice === 'mars' ? 440 : choice === 'moon' ? 520 : 660);
    playPageTurn();
    onSelectDestination(choice);

    const destVoiceIntro =
      choice === 'mars'
        ? "Mars! The Red Planet! It looks dry and dusty today, but scientists found clues that Mars was once full of liquid water! Let's roll with Sojourner and Oppy!"
        : choice === 'moon'
        ? "The Moon! Earth's silent companion! Surveyor 1 made a soft landing, GRAIL mapped lunar gravity, and Apollo missions explored the surface!"
        : "Solar System! Beyond the planets into the cold cosmic sea! Pioneer and Voyager are journeying into the stars!";

    speakDialogue('orbit', destVoiceIntro, { manualTrigger: true });

   
    setTimeout(() => {
      const el = document.getElementById('chosen-destination-story');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <section
      id="chapter-3"
      className="relative w-full py-16 sm:py-24 text-amber-900 overflow-hidden bg-gradient-to-b from-[#fff1dc] via-[#ffe0b8] to-[#fff1dc]"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="none">
          <ellipse cx="700" cy="880" rx="900" ry="400" fill="#38bdf8" fillOpacity="0.3" />
          <ellipse cx="700" cy="880" rx="870" ry="380" fill="#0284c7" fillOpacity="0.2" />
          <path d="M 700 520 Q 380 320 200 160" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity="0.7" />
          <path d="M 700 520 Q 700 300 700 120" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity="0.7" />
          <path d="M 700 520 Q 1020 320 1200 160" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity="0.7" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
       
        <div className="pt-4 pb-10 px-4 text-center max-w-4xl mx-auto">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-md">
            Where Should We Go?
          </h2>
          
        </div>

        <div className="w-full max-w-6xl px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
          <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
            <OrbitCharacter
              mood="curious"
              size="lg"
              speechBubble="Now it's your turn, explorer! Which world calls to you?"
              onClick={() =>
                speakDialogue(
                  'orbit',
                  "Okay, explorer… You've met our first space messenger. Now it's your turn. Where should we go? The red deserts of Mars, the silent Moon, or the endless deep interstellar void?"
                )
              }
            />
            <button
              onClick={() =>
                speakDialogue(
                  'orbit',
                  "Okay explorer, choose where we travel next! Mars, the Moon, or Solar System?"
                )
              }
              className="mt-3 px-4 py-1.5 rounded-full bg-white/80 border border-orange-400/50 hover:border-orange-300 text-xs sm:text-sm font-mono font-bold text-amber-800 hover:text-amber-950 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>🛰️</span>
              <span>Listen to Orbit's invitation</span>
            </button>
          </div>

          <div className="w-full lg:w-7/12 flex flex-col justify-center max-w-2xl">
           

            

            <p className="text-base sm:text-xl font-bold text-amber-900/90 leading-relaxed mb-6">
              Pick your destination and immerse yourself in the adventure.
            </p>

            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
             
              <button
                onClick={() => handleSelect('mars')}
                className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex flex-col cursor-pointer ${
                  selectedDestination === 'mars'
                    ? 'bg-white/80 border-orange-400 ring-4 ring-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                    : 'bg-[#ffe0b8]/60 border-orange-900/60 hover:border-orange-500/60 hover:bg-white/30'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-2">🔴</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-amber-800">MARS</span>
                <span className="text-xs sm:text-sm text-amber-700/80 mt-1 leading-snug">
                  Sojourner, Spirit & Oppy's water clues!
                </span>
                <span className="mt-3 text-xs font-mono font-bold px-3 py-1 rounded-full bg-orange-500/80 text-amber-950 w-fit">
                  {selectedDestination === 'mars' ? '✓ Chapter Open' : 'Open Mars'}
                </span>
              </button>

          
              <button
                onClick={() => handleSelect('moon')}
                className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex flex-col cursor-pointer ${
                  selectedDestination === 'moon'
                    ? 'bg-white/90 border-slate-300 ring-4 ring-slate-400/30 shadow-[0_0_20px_rgba(148,163,184,0.3)]'
                    : 'bg-[#ffe0b8]/60 border-orange-900/60 hover:border-slate-400/60 hover:bg-white/40'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-2">🌕</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-amber-800">THE MOON</span>
                <span className="text-xs sm:text-sm text-amber-700/80 mt-1 leading-snug">
                  Surveyor 1, GRAIL & Apollo exploration!
                </span>
                <span className="mt-3 text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-300/80 text-amber-950 w-fit">
                  {selectedDestination === 'moon' ? '✓ Chapter Open' : 'Open Moon'}
                </span>
              </button>

             
              <button
                onClick={() => handleSelect('deep_space')}
                className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex flex-col cursor-pointer ${
                  selectedDestination === 'deep_space'
                    ? 'bg-purple-950/80 border-purple-800 ring-4 ring-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-[#ffe0b8]/60 border-orange-900/60 hover:border-purple-500/60 hover:bg-purple-950/30'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-2">🌌</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-purple-800">DEEP SPACE</span>
                <span className="text-xs sm:text-sm text-purple-800/80 mt-1 leading-snug">
                  Pioneer, Jupiter, Voyager & Golden Record!
                </span>
                <span className="mt-3 text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-600/80 text-amber-950 w-fit">
                  {selectedDestination === 'deep_space' ? '✓ Chapter Open' : 'Open Solar System'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page3ChooseDestination;
