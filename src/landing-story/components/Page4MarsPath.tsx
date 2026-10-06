import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { OrbitCharacter } from './OrbitCharacter';
import { SojournerIllustration } from './SojournerIllustration';
import { VikingIllustration } from './VikingIllustration';
import { RoverIllustration } from './RoverIllustration';
import { REWRITTEN, MARS_EXTRA } from '../storyData';
import { MissionIllustration } from './MissionIllustration';
import { InterviewChat } from './InterviewChat';
import { SpaceGlossaryWord } from './SpaceGlossaryWord';
import { playSceneMusic, playPageTurn, playRoverRoll, playOppyCue } from '../utils/sound';
import { speakDialogue, getAutoSpeakEnabled, stopSpeaking } from '../utils/speech';

type OrangeVariant = 'boulder' | 'meridiani' | 'storm' | 'hope';

interface Page4Props {
  onSwitchDestination?: (dest: 'moon' | 'deep_space') => void;
  autoSpeak?: boolean;
}

export const Page4MarsPath: React.FC<Page4Props> = ({ autoSpeak = true }) => {
  const [activeBeat, setActiveBeat] = useState(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  const beats = useMemo(() => [


  {
    id: 'mars-viking-1',
    pageNumber: 13,
    layout: 'both_oppy',
    speaker: 'viking1' as const,
    speakerName: 'Viking 1 & Orbit',
    isConversation: true,
    orangeVariant: 'meridiani' as OrangeVariant,
    leadQuote: "I landed safely on Mars!",
    bodyComponent: (
      <span>
        I was sent to Mars to land safely, study the planet, and search for
        signs of life. I landed in 1976 and sent back pictures and science data.
        My mission lasted for years, and my lander is still sitting quietly on
        Mars.
      </span>
    ),
    speechText:
      "To land safely, study Mars, and search for signs of life! I landed in 1976 and sent back pictures and science data!",
    scienceFact:
      "Viking 1 landed on Mars in 1976 and returned images and scientific measurements from the Martian surface.",
    interview: REWRITTEN['mars-viking-1'],
  },

    {
      id: 'mars-sojourner',
      pageNumber: 14,
      layout: 'both_sojourner',
      speaker: 'sojourner' as const,
      speakerName: 'Sojourner & Orbit',
      isConversation: true,
      orangeVariant: 'boulder' as OrangeVariant,
      leadQuote: "Hi! I'm Sojourner!",
      bodyComponent: (
        <span>
          I was sent to Mars to explore rocks and soil up close. I was supposed to work for just 7 Mars days, but I explored for 83! I'm still resting near my <SpaceGlossaryWord termKey="pathfinder" displayText="Pathfinder" /> home.
        </span>
      ),
      speechText: "To explore rocks and soil up close! I was supposed to work for 7 Mars days, but I explored for 83!",
      scienceFact: "Sojourner was part of the Mars Pathfinder mission and sent its last signal in 1997.",
      interview: REWRITTEN['mars-sojourner'],
    },

     {
    id: 'mars-spirit',
    pageNumber: 15,
    layout: 'both_oppy',
    speaker: 'spirit' as const,
    speakerName: 'Spirit & Orbit',
    isConversation: true,
    orangeVariant: 'boulder' as OrangeVariant,
    leadQuote: "I found evidence of ancient water!",
    bodyComponent: (
      <span>
        I searched Mars for rocks and clues that water once existed there. I
        found evidence that ancient water changed the rocks. I was supposed to
        explore for just 90 Martian days, but I lasted for over 6 years!
      </span>
    ),
    speechText:
      "Rocks and clues that water once existed there! I found evidence that ancient water once changed the rocks. I was supposed to explore for just 90 Martian days, but I explored for over 6 years!",
    scienceFact:
      "Spirit became stuck in soft soil in 2009 and eventually lost power. It remains on Mars with its discoveries.",
    interview: REWRITTEN['mars-spirit'],
  },

    {
      id: 'mars-opportunity',
      pageNumber: 16,
      layout: 'both_oppy',
      speaker: 'oppy' as const,
      speakerName: 'Opportunity (Oppy) & Orbit',
      isConversation: true,
      orangeVariant: 'meridiani' as OrangeVariant,
      leadQuote: "Tiny round blueberries!",
      bodyComponent: (
        <span>
          I found tiny round <SpaceGlossaryWord termKey="blueberries" displayText="blueberries" /> made in water. I was supposed to explore for only 90 sols, but I made it 5,111!
        </span>
      ),
      speechText: "I found tiny round blueberries made in water! I was supposed to explore for 90 sols, but I made it 5,111!",
      scienceFact: "A huge dust storm covered Opportunity's solar panels in 2018, leaving it unable to recharge.",
      interview: REWRITTEN['mars-opportunity'],
    },
  ...MARS_EXTRA,
  ], []);


  useEffect(() => {
    playSceneMusic('mars');

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
      const beatElements = document.querySelectorAll('.mars-beat');
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

        if (beat.orangeVariant === 'storm') {
          playSceneMusic('opportunity_climax');
        } else if (beat.orangeVariant === 'hope') {
          playSceneMusic('opportunity_hope');
        } else {
          playSceneMusic('mars');
        }

        if (beat.speaker === 'sojourner') {
  playRoverRoll();
} else if (beat.speaker === 'oppy' || beat.speaker === 'spirit' || beat.speaker === 'viking1') {
  playOppyCue();
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

  const activeorange = beats[activeBeat]?.orangeVariant || 'sunlight';

  return (
    <section
      id="chosen-destination-story"
      className={`relative w-full py-16 sm:py-24 text-amber-900 overflow-hidden transition-colors duration-1000 ${
        activeorange === 'storm'
          ? 'bg-gradient-to-b from-[#ffedd5] via-[#fed7aa] to-[#fff1dc]'
          : activeorange === 'hope'
          ? 'bg-gradient-to-b from-[#fed7aa] via-[#ffedd5] to-[#fff1dc]'
          : 'bg-gradient-to-b from-[#fff1dc] via-[#fed7aa] to-[#fff1dc]'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-45 z-0 transition-opacity duration-1000">
        <svg viewBox="0 0 1400 900" className="w-full h-full" preserveAspectRatio="none">
          <polygon
            points="150,620 420,480 750,620"
            fill={activeorange === 'storm' ? '#271007' : '#9a3412'}
            opacity="0.4"
          />
          <path
            d="M 0 680 Q 400 580 850 680 T 1400 640 L 1400 900 L 0 900 Z"
            fill={activeorange === 'storm' ? '#1f0d06' : '#c2410c'}
            opacity="0.3"
          />
          <path
            d="M 0 760 Q 500 700 1000 760 L 1400 720 L 1400 900 L 0 900 Z"
            fill={activeorange === 'storm' ? '#140804' : '#7c2d12'}
            opacity="0.5"
          />
          <circle cx="280" cy="340" r="1.5" fill="#fed7aa" opacity="0.6" />
          <circle cx="620" cy="220" r="2" fill="#fdba74" opacity="0.7" />
          <circle cx="940" cy="380" r="1.5" fill="#fed7aa" opacity="0.5" />
          <circle cx="1120" cy="180" r="2.5" fill="#f97316" opacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
     
        <div className="pt-4 pb-12 px-4 text-center max-w-4xl mx-auto">
         
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-md">
            The Red Planet: Sojourner & Opportunity
          </h2>
        
        </div>

         <div className="w-full flex flex-col items-center space-y-16 sm:space-y-24">
          {beats.map((beat, idx) => {
            const isActive = activeBeat === idx;
            const isCenter = beat.layout === 'center';
            const isBothSojourner = beat.layout === 'both_sojourner';
            const isBothOppy = beat.layout === 'both_oppy';
            const isBothGeneric = beat.layout === 'both_generic';
            const gen = beat as Partial<(typeof MARS_EXTRA)[number]>;
            const isRight = beat.layout === 'right';

            return (
              <div
                key={idx}
                id={beat.id}
                className={`mars-beat w-full min-h-[75vh] max-w-6xl px-4 sm:px-8 lg:px-12 flex items-center justify-center transition-all duration-500 ${
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
                          onClick={() => speakDialogue('orbit', gen.orbitLine || 'Tell us your story!')}
                        />
                      </div>

                      <div className="text-orange-800 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>{gen.art?.emoji} ~ ~ ~ 🛰️</span>
                      </div>

                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                        <MissionIllustration
                          emoji={gen.art?.emoji || '🛰️'}
                          name={gen.art?.name || ''}
                          year={gen.art?.year || ''}
                          dark={false}
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                      </div>
                    </div>

                    {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                        🔴 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isBothSojourner ? (
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
                          onClick={() => speakDialogue('orbit', "Sojourner, show us how you climbed those Martian rocks!")}
                        />
                        
                      </div>

                      <div className="text-orange-800 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>🏎️ ~ ~ ~ 🛰️</span>
                      </div>

                    
                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                        <SojournerIllustration
                          isSpeaking={isActive}
                          speechBubble={beat.leadQuote}
                          onClick={() => handleSpeak(idx)}
                        />
                       
                      </div>
                    </div>

                    {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                        🔴 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isBothOppy ? (
                  
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
                          onClick={() => speakDialogue('orbit', "Oppy, tell us about the ancient water you found on Mars!")}
                        />
                       
                      </div>

                      <div className="text-orange-800 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>✨ ~ ~ ~ 🛰️</span>
                      </div>

                     
                      <div className="flex flex-col items-center scale-105 filter drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                       {beat.speaker === 'viking1' ? (
                          <VikingIllustration size="lg" speechBubble={beat.leadQuote} onClick={() => handleSpeak(idx)} />
                        ) : (
                          <RoverIllustration
                            name={beat.speaker === 'spirit' ? 'Spirit' : 'Oppy'}
                            variant="celebrating"
                            size="lg"
                            speechBubble={beat.leadQuote}
                            onClick={() => handleSpeak(idx)}
                          />
                        )}
                        
                      </div>
                    </div>

                    {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                        🔴 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isCenter ? (
                  
                  <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
                    <RoverIllustration
                      name="Oppy"
                      variant="resting"
                      size="lg"
                      speechBubble={beat.leadQuote}
                      onClick={() => handleSpeak(idx)}
                    />

                    <div>
                      

                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-bold mb-4">
                        {beat.bodyComponent}
                      </div>

                      {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-500/40 shadow-xl text-left inline-block">
                        <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                          🔴 <strong className="text-amber-950">Martian Record:</strong> {beat.scienceFact}
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
                        mood={beat.orangeVariant === 'hope' ? 'gentle' : 'curious'}
                        size="lg"
                        isSpeaking={isActive}
                        speechBubble={beat.leadQuote}
                        onClick={() => handleSpeak(idx)}
                      />
                     
                    </div>

                    <div className="w-full lg:w-7/12 flex flex-col justify-center max-w-xl">
                     

                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-bold mb-4">
                        {beat.bodyComponent}
                      </div>

                      {beat.interview && <InterviewChat lines={beat.interview} dark={false} />}

                      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-500/40 shadow-xl">
                        <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                          🔴 <strong className="text-amber-950">NASA Discovery:</strong> {beat.scienceFact}
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

export default Page4MarsPath;