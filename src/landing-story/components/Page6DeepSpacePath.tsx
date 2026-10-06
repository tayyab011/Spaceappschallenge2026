import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { OrbitCharacter } from './OrbitCharacter';
import { MissionIllustration } from './MissionIllustration';
import { PioneerIllustration } from './PioneerIllustration';
import { VoyagerIllustration } from './VoyagerIllustration';
import { REWRITTEN, DEEP_EXTRA } from '../storyData';
import { InterviewChat } from './InterviewChat';
import { SpaceGlossaryWord } from './SpaceGlossaryWord';
import { playSceneMusic, playPageTurn, playOrbitCue } from '../utils/sound';
import { speakDialogue, getAutoSpeakEnabled, stopSpeaking } from '../utils/speech';

interface Page6Props {
  autoSpeak?: boolean;
  onSwitchDestination?: (dest: 'mars' | 'moon') => void;
}

export const Page6DeepSpacePath: React.FC<Page6Props> = ({ autoSpeak = true }) => {
  const [activeBeat, setActiveBeat] = useState(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  const beats = useMemo(() => [
    {
      id: 'deep-pioneer-5',
      pageNumber: 13,
      layout: 'both_generic',
      speaker: 'pioneer5' as const,
      speakerName: 'Pioneer 5 & Orbit',
      isConversation: true,
      leadQuote: "I'm still orbiting the Sun!",
      bodyComponent: (
        <span>
          I studied the Sun and the space between Earth and it, sending back information about <SpaceGlossaryWord termKey="solar_particles" displayText="solar particles" /> and magnetic fields.
        </span>
      ),
      speechText: "I studied the Sun and the space between Earth and it, including solar particles and magnetic fields.",
      scienceFact: "Pioneer 5 helped scientists study solar particles and magnetic fields between Earth and the Sun.",
      interview: REWRITTEN['deep-pioneer-5'],
      art: { emoji: '☀️', name: 'Pioneer 5', year: '1960' },
      orbitLine: 'Pioneer 5, tell us about your journey!',
    },
    {
      id: 'deep-mariner-2',
      pageNumber: 14,
      layout: 'both_generic',
      speaker: 'mariner2' as const,
      speakerName: 'Mariner 2 & Orbit',
      isConversation: true,
      leadQuote: "I was the first successful visitor to another planet!",
      bodyComponent: (
        <span>
          I became the first successful spacecraft to visit another planet, measuring Venus's hot atmosphere and environment.
        </span>
      ),
      speechText: "I became the first successful spacecraft to visit another planet: Venus!",
      scienceFact: "Mariner 2 flew past Venus in 1962 and made important measurements of its atmosphere and environment.",
      interview: REWRITTEN['deep-mariner-2'],
      art: { emoji: '🟡', name: 'Mariner 2', year: '1962' },
      orbitLine: 'Mariner 2, what was Venus like?',
    },
    {
      id: 'deep-mariner-10',
      pageNumber: 15,
      layout: 'both_generic',
      speaker: 'mariner10' as const,
      speakerName: 'Mariner 10 & Orbit',
      isConversation: true,
      leadQuote: "Venus gave me a gravity boost!",
      bodyComponent: (
        <span>
          I visited Mercury three times and used Venus's gravity to help me reach it.
        </span>
      ),
      speechText: "I visited Mercury three times and used Venus's gravity to help me reach it!",
      scienceFact: "Mariner 10 used a Venus gravity assist to reach Mercury and became the first spacecraft to visit Mercury.",
      interview: REWRITTEN['deep-mariner-10'],
      art: { emoji: '🌑', name: 'Mariner 10', year: '1973' },
      orbitLine: 'Mariner 10, how did you reach Mercury?',
    },
    {
      id: 'deep-pioneer-10',
      pageNumber: 16,
      layout: 'both_generic',
      speaker: 'pioneer' as const,
      speakerName: 'Pioneer 10 & Orbit',
      isConversation: true,
      leadQuote: "Still traveling outward from the Sun.",
      bodyComponent: (
        <span>
          I was the first spacecraft to travel through the asteroid belt and visit Jupiter, then continued far beyond the giant planet toward interstellar space.
        </span>
      ),
      speechText: "I visited Jupiter first, then continued far beyond it toward interstellar space.",
      scienceFact: "Pioneer 10 was the first spacecraft to travel through the asteroid belt and make a close encounter with Jupiter.",
      interview: REWRITTEN['deep-pioneer-10'],
      art: { emoji: '🛰️', name: 'Pioneer 10', year: '1972' },
      orbitLine: 'Pioneer 10, tell us about going beyond Jupiter!',
    },
    {
      id: 'deep-pioneer-11',
      pageNumber: 17,
      layout: 'both_pioneer',
      speaker: 'pioneer11' as const,
      speakerName: 'Pioneer 11 & Orbit',
      isConversation: true,
      leadQuote: "Jupiter first, then Saturn!",
      bodyComponent: (
        <span>
          I visited Jupiter and then flew past Saturn, sending back some of the first close-up observations of the ringed planet.
        </span>
      ),
      speechText: "I visited Jupiter, then flew past Saturn and sent back close-up observations.",
      scienceFact: "Pioneer 11 was the first spacecraft to fly past Saturn.",
      interview: REWRITTEN['deep-pioneer-11'],
    },
    {
      id: 'deep-voyager-1',
      pageNumber: 18,
      layout: 'both_voyager',
      speaker: 'voyager' as const,
      speakerName: 'Voyager 1 & Orbit',
      isConversation: true,
      leadQuote: "I just… kept going.",
      bodyComponent: (
        <span>
          I studied the outer planets and eventually entered <SpaceGlossaryWord termKey="interstellar" displayText="interstellar space" />. Far beyond the planets, I keep traveling through the space between stars.
        </span>
      ),
      speechText: "I studied Jupiter and Saturn and eventually entered interstellar space. I just kept going.",
      scienceFact: "Voyager 1 entered interstellar space in 2012 and continues sending limited science and engineering data.",
      interview: REWRITTEN['deep-voyager-1'],
    },
    ...DEEP_EXTRA,
  ], []);

  
  useEffect(() => {
    playSceneMusic('deep_space');

    const arrivalVoiceTimer = window.setTimeout(() => {
      if (autoSpeak && getAutoSpeakEnabled()) {
        speakDialogue(beats[0].speaker, beats[0].speechText, { skipSoundCue: true });
      }
    }, 450);

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
      const beatElements = document.querySelectorAll('.deep-space-beat');
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

        playOrbitCue();

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
          <circle cx="280" cy="240" r="85" fill="#fde047" opacity="0.6" />
          <path d="M 195 220 Q 280 230 365 220" stroke="#ca8a04" strokeWidth="6" fill="none" opacity="0.7" />
          <path d="M 195 245 Q 280 255 365 245" stroke="#a16207" strokeWidth="5" fill="none" opacity="0.6" />
          <circle cx="310" cy="255" r="14" fill="#dc2626" opacity="0.75" />

          <circle cx="1120" cy="280" r="55" fill="#fcd34d" opacity="0.5" />
          <ellipse cx="1120" cy="280" rx="120" ry="24" stroke="#fde047" strokeWidth="6" fill="none" opacity="0.7" transform="rotate(-18 1120 280)" />

          <ellipse cx="700" cy="450" rx="600" ry="250" fill="#7e22ce" opacity="0.15" filter="blur(60px)" />
          <ellipse cx="850" cy="500" rx="450" ry="200" fill="#3b82f6" opacity="0.12" filter="blur(50px)" />

          <line x1="700" y1="450" x2="620" y2="350" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="700" y1="450" x2="820" y2="390" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="700" y1="450" x2="740" y2="560" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
       
        <div className="pt-4 pb-12 px-4 text-center max-w-4xl mx-auto">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-md">
            Solar System & Beyond: Pioneer, Mariner & Voyager
          </h2>
          
        </div>

       
        <div className="w-full flex flex-col items-center space-y-16 sm:space-y-24">
          {beats.map((beat, idx) => {
            const isActive = activeBeat === idx;
            const isCenter = beat.layout === 'center';
            const isBothGeneric = beat.layout === 'both_generic';
            const isBothPioneer = beat.layout === 'both_pioneer';
            const isBothVoyager = beat.layout === 'both_voyager';
            const isLeft = beat.layout === 'left';

            return (
              <div
                key={idx}
                id={beat.id}
                className={`deep-space-beat w-full min-h-[75vh] max-w-6xl px-4 sm:px-8 lg:px-12 flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-65 scale-[0.98]'
                }`}
              >
               
                {isBothGeneric ? (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center max-w-3xl px-2">
                      <div className="text-lg sm:text-2xl text-purple-900 leading-relaxed font-bold">
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
                      <div className="text-purple-950 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>{beat.art?.emoji} ~ ~ ~ 🛰️</span>
                      </div>
                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <MissionIllustration
                          emoji={beat.art?.emoji || '🛰️'}
                          name={beat.art?.name || ''}
                          year={beat.art?.year || ''}
                          dark={true}
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                      </div>
                    </div>
                    {beat.interview && <InterviewChat lines={beat.interview} dark={true} />}
                    <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/70 backdrop-blur-md border border-purple-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-purple-200 leading-snug">
                        🌌 <strong className="text-purple-100">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isBothPioneer ? (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center max-w-3xl px-2">
                      
                      <div className="text-lg sm:text-2xl text-amber-800/95 leading-relaxed font-bold">
                        {beat.bodyComponent}
                      </div>
                    </div>

                    <div className="w-full flex flex-row items-center justify-around gap-4 sm:gap-12 py-4">
                    
                      <div className="flex flex-col items-center opacity-85 hover:opacity-100 transition-opacity">
                        <OrbitCharacter
                          mood="curious"
                          size="md"
                          onClick={() => speakDialogue('orbit', "Pioneer 11, tell us about Saturn!")}
                        />
                       
                      </div>

                      <div className="text-purple-950 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>🪐 ~ ~ ~ 🛰️</span>
                      </div>

                      
                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <PioneerIllustration
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                        
                      </div>
                    </div>

                    {beat.interview && <InterviewChat lines={beat.interview} dark={true} />}

                    <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/70 backdrop-blur-md border border-purple-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-purple-200 leading-snug">
                        🌌 <strong className="text-purple-900">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isBothVoyager ? (
                  
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center max-w-3xl px-2">
                     
                      <div className="text-lg sm:text-2xl text-amber-800/95 leading-relaxed font-bold">
                        {beat.bodyComponent}
                      </div>
                    </div>

                    <div className="w-full flex flex-row items-center justify-around gap-4 sm:gap-12 py-4">
                     
                      <div className="flex flex-col items-center opacity-85 hover:opacity-100 transition-opacity">
                        <OrbitCharacter
                          mood="excited"
                          size="md"
                          onClick={() => speakDialogue('orbit', "Voyager, where are you now in the cosmos?")}
                        />
                       
                      </div>

                      <div className="text-purple-950 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>🌟 ~ ~ ~ 🛰️</span>
                      </div>

                     
                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <VoyagerIllustration
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                        
                      </div>
                    </div>

                    {beat.interview && <InterviewChat lines={beat.interview} dark={true} />}

                    <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/70 backdrop-blur-md border border-purple-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-purple-200 leading-snug">
                        🌌 <strong className="text-purple-100">Interstellar Fact:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isCenter ? (
                  
                  <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
                    <OrbitCharacter
                      mood="gentle"
                      size="lg"
                      isSpeaking={isActive}
                      speechBubble={beat.leadQuote}
                      onClick={() => handleSpeak(idx)}
                    />

                    <div>
                      
                      <div className="text-lg sm:text-2xl text-amber-800/95 leading-relaxed font-bold mb-4">
                        {beat.bodyComponent}
                      </div>

                      {beat.interview && <InterviewChat lines={beat.interview} dark={true} />}

                      <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/70 backdrop-blur-md border border-purple-500/40 shadow-xl text-left inline-block">
                        <p className="text-sm sm:text-base font-semibold text-purple-200 leading-snug">
                          🌌 <strong className="text-purple-100">Cosmic Fact:</strong> {beat.scienceFact}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  
                  <div className="w-full max-w-5xl flex gap-8 lg:gap-14 items-center flex-col lg:flex-row justify-between">
                    <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
                      <OrbitCharacter
                        mood="curious"
                        size="lg"
                        isSpeaking={isActive}
                        speechBubble={beat.leadQuote}
                        onClick={() => handleSpeak(idx)}
                      />
                     
                    </div>

                    <div className="w-full lg:w-7/12 flex flex-col justify-center max-w-xl">
                     

                      <div className="text-lg sm:text-2xl text-amber-800/95 leading-relaxed font-bold mb-4">
                        {beat.bodyComponent}
                      </div>

                      {beat.interview && <InterviewChat lines={beat.interview} dark={true} />}

                      <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/70 backdrop-blur-md border border-purple-500/40 shadow-xl">
                        <p className="text-sm sm:text-base font-semibold text-purple-200 leading-snug">
                          🌌 <strong className="text-purple-100">NASA Discovery:</strong> {beat.scienceFact}
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

export default Page6DeepSpacePath;