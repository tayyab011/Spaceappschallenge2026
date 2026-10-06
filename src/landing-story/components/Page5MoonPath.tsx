import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { OrbitCharacter } from './OrbitCharacter';
import { MissionIllustration } from './MissionIllustration';
import { ApolloIllustration } from './ApolloIllustration';
import { REWRITTEN, MOON_EXTRA } from '../storyData';
import { InterviewChat } from './InterviewChat';
import { SpaceGlossaryWord } from './SpaceGlossaryWord';
import { playSceneMusic, playPageTurn, playRoverRoll } from '../utils/sound';
import { speakDialogue, getAutoSpeakEnabled, stopSpeaking } from '../utils/speech';

interface Page5Props {
  onSwitchDestination?: (dest: 'mars' | 'deep_space') => void;
  autoSpeak?: boolean;
}

export const Page5MoonPath: React.FC<Page5Props> = ({ autoSpeak = true }) => {
  const [activeBeat, setActiveBeat] = useState(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  const beats = useMemo(() => [
    {
      id: 'moon-surveyor-1',
      pageNumber: 13,
      layout: 'both_generic',
      speaker: 'narrator' as const,
      speakerName: 'Surveyor 1 & Orbit',
      isConversation: true,
      leadQuote: "I landed softly on the Moon!",
      bodyComponent: (
        <span>
          My mission was to land softly on the Moon and learn what the surface was really like. I sent back thousands of pictures and measurements.
        </span>
      ),
      speechText: "I landed softly on the Moon and sent back thousands of pictures and measurements!",
      scienceFact: "Surveyor 1 made the first successful U.S. soft landing on the Moon in 1966.",
      interview: REWRITTEN['moon-surveyor-1'],
      art: { emoji: '🌕', name: 'Surveyor 1', year: '1966' },
      orbitLine: 'Surveyor 1, tell us about your Moon landing!',
    },
    {
      id: 'moon-grail-a',
      pageNumber: 14,
      layout: 'both_generic',
      speaker: 'narrator' as const,
      speakerName: 'GRAIL-A (Ebb) & Orbit',
      isConversation: true,
      leadQuote: "I mapped the Moon's gravity!",
      bodyComponent: (
        <span>
          Ebb and Flow flew together to map the Moon's gravity, creating a giant invisible map of what lies beneath the surface.
        </span>
      ),
      speechText: "Ebb and Flow flew together to map the Moon's gravity!",
      scienceFact: "GRAIL used two spacecraft flying in formation to measure tiny changes in the Moon's gravity.",
      interview: REWRITTEN['moon-grail-a'],
      art: { emoji: '🛰️', name: 'GRAIL-A — Ebb', year: '2011' },
      orbitLine: 'Ebb, tell us about the gravity map!',
    },
    {
      id: 'moon-grail-b',
      pageNumber: 15,
      layout: 'both_generic',
      speaker: 'narrator' as const,
      speakerName: 'GRAIL-B (Flow) & Orbit',
      isConversation: true,
      leadQuote: "The perfect pair!",
      bodyComponent: (
        <span>
          Flow flew beside Ebb and helped map tiny changes in the Moon's gravity. After the science was complete, both spacecraft were sent into a planned impact.
        </span>
      ),
      speechText: "I flew beside Ebb and helped map the Moon's gravity. We were the perfect pair!",
      scienceFact: "GRAIL-B, named Flow, worked with Ebb to reveal detailed variations in the Moon's interior.",
      interview: REWRITTEN['moon-grail-b'],
      art: { emoji: '🛰️', name: 'GRAIL-B — Flow', year: '2011' },
      orbitLine: 'Flow, tell us about working with Ebb!',
    },
    {
      id: 'moon-apollo-11',
      pageNumber: 16,
      layout: 'both_generic',
      speaker: 'apollo' as const,
      speakerName: 'Apollo 11 & Orbit',
      isConversation: true,
      leadQuote: "Humans walked on the Moon!",
      bodyComponent: (
        <span>
          Apollo 11 carried humans to the Moon, where they walked on the surface for the first time. Parts of the mission hardware remain there.
        </span>
      ),
      speechText: "Apollo 11 landed humans on the Moon and brought them safely home!",
      scienceFact: "Apollo 11 achieved the first crewed landing on the Moon in July 1969.",
      interview: REWRITTEN['moon-apollo-11'],
      art: { emoji: '🚀', name: 'Apollo 11', year: '1969' },
      orbitLine: 'Apollo 11, tell us about your historic landing!',
    },
    {
      id: 'moon-apollo-15',
      pageNumber: 17,
      layout: 'both_apollo',
      speaker: 'apollo' as const,
      speakerName: 'Apollo 15 & Orbit',
      isConversation: true,
      leadQuote: "Moon parking!",
      bodyComponent: (
        <span>
          Apollo 15 explored more of the Moon using a Lunar Roving Vehicle. The rover stayed behind near the landing site after the crew returned to Earth.
        </span>
      ),
      speechText: "We explored more of the Moon using a Lunar Roving Vehicle!",
      scienceFact: "Apollo 15's Lunar Roving Vehicle helped astronauts travel across the lunar surface and collect rocks and data.",
      interview: REWRITTEN['moon-apollo-15'],
    },
    ...MOON_EXTRA,
  ], []);


  useEffect(() => {
    playSceneMusic('moon');

    const arrivalVoiceTimer = window.setTimeout(() => {
      if (autoSpeak && getAutoSpeakEnabled()) {
        speakDialogue(beats[0].speaker, beats[0].speechText, { skipSoundCue: true });
      }
    }, 300);

    return () => {
      window.clearTimeout(arrivalVoiceTimer);
      stopSpeaking();
    };
  }, [beats]);

  // Auto-voice switched on while already on a segment: narrate the current one now.
  const prevAutoSpeakRef = useRef(autoSpeak);
  useEffect(() => {
    if (prevAutoSpeakRef.current === autoSpeak) return;
    prevAutoSpeakRef.current = autoSpeak;
    if (autoSpeak && getAutoSpeakEnabled()) {
      const beat = beats[activeBeat];
      speakDialogue(beat.speaker, beat.speechText, { skipSoundCue: true });
    }
  }, [autoSpeak, beats, activeBeat]);

  const handleSpeak = useCallback((beatIdx: number) => {
    const beat = beats[beatIdx];
    speakDialogue(beat.speaker, beat.speechText, { manualTrigger: true });
  }, [beats]);

  
  useEffect(() => {
    const handleScroll = () => {
      const beatElements = document.querySelectorAll('.moon-beat');
      if (beatElements.length === 0) return;

      const vCenter = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDistance = Infinity;

      beatElements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - vCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      if (closestIdx !== activeBeat) {
        setActiveBeat(closestIdx);
        stopSpeaking(); // leaving a segment ends its narration immediately
        playPageTurn();
        const beat = beats[closestIdx];

        if (beat.speaker === 'apollo') {
          playRoverRoll();
        }

        if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = window.setTimeout(() => {
          if (autoSpeak && getAutoSpeakEnabled()) {
            speakDialogue(beat.speaker, beat.speechText, { skipSoundCue: true });
          }
        }, 220);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [activeBeat, beats, autoSpeak]);

  return (
    <section
      id="chosen-destination-story"
      className="relative w-full py-16 sm:py-24 text-amber-900 overflow-hidden bg-gradient-to-b from-[#fff1dc] via-[#ffe0b8] to-[#fff1dc]"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 1400 900" className="w-full h-full" preserveAspectRatio="none">
          <circle cx="1080" cy="180" r="45" fill="#38bdf8" />
          <circle cx="1075" cy="175" r="43" fill="#0284c7" />
          <path d="M 1060 160 Q 1090 150 1100 180 Q 1070 200 1060 160 Z" fill="#ffffff" opacity="0.8" />
          <circle cx="1080" cy="180" r="48" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.5" />

          <polygon points="100,620 380,490 680,620" fill="#334155" opacity="0.4" />
          <polygon points="550,620 850,460 1150,620" fill="#1e293b" opacity="0.5" />
          <polygon points="980,620 1200,510 1380,620" fill="#334155" opacity="0.4" />

          <path d="M 0 660 Q 400 610 850 670 T 1400 640 L 1400 900 L 0 900 Z" fill="#0f172a" opacity="0.8" />
          <ellipse cx="320" cy="740" rx="90" ry="24" fill="#020617" opacity="0.6" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="850" cy="790" rx="140" ry="32" fill="#020617" opacity="0.7" stroke="#475569" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
       
        <div className="pt-4 pb-12 px-4 text-center max-w-4xl mx-auto">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-md">
            The Moon: Surveyor, GRAIL & Apollo
          </h2>
          
        </div>

       
        <div className="w-full flex flex-col items-center space-y-16 sm:space-y-24">
          {beats.map((beat, idx) => {
            const isActive = activeBeat === idx;
            const isCenter = beat.layout === 'center';
            const isBothApollo = beat.layout === 'both_apollo';
            const isBothGeneric = beat.layout === 'both_generic';
            const isRight = beat.layout === 'right';

            return (
              <div
                key={idx}
                id={beat.id}
                className={`moon-beat w-full min-h-[75vh] max-w-6xl px-4 sm:px-8 lg:px-12 flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-65 scale-[0.98]'
                }`}
              >
               
                {isBothGeneric ? (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center max-w-3xl px-2">
                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-bold">
                        {beat.bodyComponent}
                      </div>
                    </div>
                    <div className="w-full flex flex-row items-center justify-around gap-4 sm:gap-12 py-4">
                      <div className="flex flex-col items-center opacity-85 hover:opacity-100 transition-opacity">
                        <OrbitCharacter
                          mood="curious"
                          size="md"
                          onClick={() => speakDialogue('orbit', beat.orbitLine || 'Tell us your story!')}
                        />
                        
                      </div>
                      <div className="text-amber-800 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>{beat.art?.emoji} ~ ~ ~ 🛰️</span>
                      </div>
                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(203,213,225,0.5)]">
                        <MissionIllustration
                          emoji={beat.art?.emoji || '🛰️'}
                          name={beat.art?.name || ''}
                          year={beat.art?.year || ''}
                          dark={false}
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                      </div>
                    </div>
                    {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                        🌕 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isBothApollo ? (
                 
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center max-w-3xl px-2">
                    
                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-bold">
                        {beat.bodyComponent}
                      </div>
                    </div>

                    <div className="w-full flex flex-row items-center justify-around gap-4 sm:gap-12 py-4">
                      
                      <div className="flex flex-col items-center opacity-85 hover:opacity-100 transition-opacity">
                        <OrbitCharacter
                          mood="excited"
                          size="md"
                          onClick={() => speakDialogue('orbit', beat.orbitLine || 'Tell us your story!')}
                        />
                        
                      </div>

                      <div className="text-amber-800 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>🚙 ~ ~ ~ 🛰️</span>
                      </div>

                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(203,213,225,0.5)]">
                        <ApolloIllustration
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                       
                      </div>
                    </div>

                    {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                        🌕 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isCenter ? (
                 
                  <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
                    <OrbitCharacter
                      mood="happy"
                      size="lg"
                      isSpeaking={isActive}
                      speechBubble={beat.leadQuote}
                      onClick={() => handleSpeak(idx)}
                    />

                    <div>
                     

                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-bold mb-4">
                        {beat.bodyComponent}
                      </div>

                      {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-500/40 shadow-xl text-left inline-block">
                        <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                          🌕 <strong className="text-amber-950">Lunar Fact:</strong> {beat.scienceFact}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  
                  <div
                    className={`w-full max-w-5xl flex gap-8 lg:gap-14 items-center ${
                      isRight ? 'flex-col lg:flex-row-reverse justify-between' : 'flex-col lg:flex-row justify-between'
                    }`}
                  >
                    <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
                      <OrbitCharacter
                        mood="happy"
                        size="lg"
                        isSpeaking={isActive}
                        speechBubble={beat.leadQuote}
                        onClick={() => handleSpeak(idx)}
                      />
                    </div>

                    <div className="w-full lg:w-7/12 flex flex-col justify-center max-w-xl">
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-950 tracking-tight drop-shadow-md mb-3 leading-snug">
                        {beat.leadQuote}
                      </h3>

                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-medium mb-4">
                        {beat.bodyComponent}
                      </div>

                      {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-500/40 shadow-xl">
                        <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                          🌕 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Page5MoonPath;