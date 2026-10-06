import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OrbitCharacter } from './OrbitCharacter';
import { SputnikIllustration } from './SputnikIllustration';
import { SpaceGlossaryWord } from './SpaceGlossaryWord';
import { playSceneMusic, playPageTurn, playRadioBeep } from '../utils/sound';
import { speakDialogue, getSpeechEnabled, getAutoSpeakEnabled, stopSpeaking } from '../utils/speech';

interface Page2Props {
  autoSpeak?: boolean;
}

export const Page2Sputnik: React.FC<Page2Props> = ({ autoSpeak = true }) => {
  const [activeBeat, setActiveBeat] = useState(0);
  const scrollTimeoutRef = useRef<number | null>(null);


  const dialogueBeats = [
    {
      pageNumber: 5,
      layout: 'right', 
      speaker: 'orbit' as const,
      speakerName: 'Orbit',
      isConversation: false,
      leadQuote: "Long ago, in 1958...",
      bodyComponent: (
        <span>
          On 11 October 1958, Pioneer 1 blasted off. It was NASA's very first spacecraft! It wanted to <SpaceGlossaryWord termKey="orbit" displayText="orbit" /> the Moon.
        </span>
      ),
      speechText: "Long ago, in 1958, Pioneer 1 flew toward the Moon!",
      scienceFact: "Pioneer 1 launched on 11 October 1958. It was the first spacecraft launched by NASA.",
    },
    {
      pageNumber: 6,
      layout: 'both', 
      speaker: 'orbit' as const,
      speakerName: 'Orbit',
      isConversation: true,
      leadQuote: "Pioneer, how was your trip?",
      bodyComponent: (
        <span>
          Orbit flies beside Pioneer 1. Let's ask about the trip!
        </span>
      ),
      speechText: "Pioneer, how was your trip?",
      scienceFact: "Pioneer 1 flew about 113,800 km high. That is almost a third of the way to the Moon.",
    },
    {
      pageNumber: 7,
      layout: 'both', 
      speaker: 'sputnik' as const,
      speakerName: 'Pioneer 1',
      isConversation: true,
      leadQuote: "Beep beep! My rocket stopped early!",
      bodyComponent: (
        <span>
          I sent data home while I climbed. Then I fell back down.
        </span>
      ),
      speechText: "Beep beep! My rocket stopped early. I missed the Moon!",
      scienceFact: "Pioneer 1's rocket shut off a little too early. It still sent data home!",
    },
    {
      pageNumber: 8,
      layout: 'center', 
      speaker: 'sputnik' as const,
      speakerName: 'Pioneer 1 & Orbit',
      isConversation: true,
      leadQuote: "I missed the Moon. But I helped!",
      bodyComponent: (
        <span>
          After 43 hours, Pioneer 1 fell back to Earth. It found clues about the Van Allen belts. They are invisible zones around Earth!
        </span>
      ),
      speechText: "I flew 43 hours. I missed the Moon. But I helped!",
      scienceFact: "Pioneer 1 studied the Van Allen belts. It fell back to Earth on 13 October 1958.",
    },
    {
      pageNumber: 9,
      layout: 'center', 
      speaker: 'orbit' as const,
      speakerName: 'Orbit',
      isConversation: false,
      leadQuote: "Pioneer fell. Others made it!",
      bodyComponent: (
        <span>
          Next, meet machines that reached the Moon and Mars. They were left behind. Abandoned, but not forgotten!
        </span>
      ),
      speechText: "Others made it! They're still up there. Not forgotten!",
      scienceFact: "NASA's NSSDCA keeps a public table of human-made objects that rest on the Moon.",
    },
  ];

  useEffect(() => {
    playSceneMusic('sputnik');
  }, []);

  // Auto-voice switched on while already on a segment: narrate the current one now.
  const prevAutoSpeakRef = useRef(autoSpeak);
  useEffect(() => {
    if (prevAutoSpeakRef.current === autoSpeak) return;
    prevAutoSpeakRef.current = autoSpeak;
    if (autoSpeak && getAutoSpeakEnabled()) {
      const beat = dialogueBeats[activeBeat];
      speakDialogue(beat.speaker, beat.speechText, { skipSoundCue: true });
    }
  }, [autoSpeak, dialogueBeats, activeBeat]);

  const handleSpeak = useCallback((beatIdx: number) => {
    const beat = dialogueBeats[beatIdx];
    speakDialogue(beat.speaker, beat.speechText, { manualTrigger: true });
  }, [dialogueBeats]);

  
  useEffect(() => {
    const handleScroll = () => {
      const beatElements = document.querySelectorAll('.sputnik-beat');
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
        const beat = dialogueBeats[closestIdx];

        if (beat.speaker === 'sputnik') {
          playRadioBeep(880, 0.1);
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
  }, [activeBeat, dialogueBeats, autoSpeak]);

  return (
    <section
      id="chapter-2"
      className="relative w-full py-16 sm:py-24 text-amber-900 overflow-hidden bg-gradient-to-b from-[#fff1dc] via-[#ffe0b8] to-[#fff1dc]"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 1400 900" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="earth1957Glow" cx="50%" cy="100%" r="70%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="700" cy="950" rx="1000" ry="450" fill="url(#earth1957Glow)" />
          <path d="M 450 350 A 250 250 0 0 1 950 350" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="8 8" fill="none" opacity="0.65" />
          <path d="M 380 280 A 320 320 0 0 1 1020 280" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="10 10" fill="none" opacity="0.45" />
          <path d="M 300 210 A 400 400 0 0 1 1100 210" stroke="#38bdf8" strokeWidth="2" strokeDasharray="12 12" fill="none" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        
        <div className="pt-4 pb-12 px-4 text-center max-w-4xl mx-auto">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-md">
            October 11, 1958: NASA Reaches for the Moon
          </h2>
         
        </div>

        
        <div className="w-full flex flex-col items-center space-y-16 sm:space-y-24">
          {dialogueBeats.map((beat, idx) => {
            const isActive = activeBeat === idx;
            const isCenter = beat.layout === 'center';
            const isBoth = beat.layout === 'both';
            const isRight = beat.layout === 'right';
            const isSputnikTalking = beat.speaker === 'sputnik';

            return (
              <div
                key={idx}
                className={`sputnik-beat w-full min-h-[75vh] max-w-6xl px-4 sm:px-8 lg:px-12 flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-65 scale-[0.98]'
                }`}
              >
                
                {isBoth ? (
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="text-center max-w-3xl px-2">
                      
                     
                      <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-950 tracking-tight drop-shadow-md mb-3 leading-snug">
                        {beat.bodyComponent}
                      </div>
                    </div>

                    <div className="w-full flex flex-row items-center justify-around gap-4 sm:gap-12 py-4">
                     
                      <div className={`flex flex-col items-center transition-all duration-300 ${!isSputnikTalking ? 'scale-105 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]' : 'scale-90 opacity-75'}`}>
                        <OrbitCharacter
                          mood="curious"
                          size="md"
                          isSpeaking={isActive && !isSputnikTalking}
                          speechBubble={!isSputnikTalking ? beat.leadQuote : undefined}
                          onClick={() => handleSpeak(idx)}
                        />
                        <span className="text-xs sm:text-sm font-mono text-amber-700 mt-2 font-bold">
                          🛰️ Orbit {!isSputnikTalking ? '(Speaking)' : '(Listening)'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center text-amber-800 font-mono text-xs sm:text-sm opacity-75 animate-pulse">
                        <span>📡 ~ ~ ~ 🛰️</span>
                        <span className="text-[11px]">Radio Waves</span>
                      </div>

                   
                      <div className={`flex flex-col items-center transition-all duration-300 ${isSputnikTalking ? 'scale-105 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'scale-90 opacity-75'}`}>
                        <SputnikIllustration
                          isSpeaking={isActive && isSputnikTalking}
                          speechBubble={isSputnikTalking ? beat.leadQuote : undefined}
                          onClick={() => handleSpeak(idx)}
                        />
                        <span className="text-xs sm:text-sm font-mono text-amber-700 mt-2 font-bold">
                          📡 Pioneer 1 {isSputnikTalking ? '(Speaking)' : '(Listening)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-500/40 shadow-xl max-w-2xl text-center">
                      <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                        📡 <strong className="text-amber-950">NASA History:</strong> {beat.scienceFact}
                      </p>
                    </div>
                  </div>
                ) : isCenter ? (
                  
                  <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
                    <div className="flex items-center justify-center gap-6">
                      <OrbitCharacter mood="excited" size="md" isSpeaking={isActive} />
                      <SputnikIllustration isSpeaking={isActive} />
                    </div>

                    <div>
                      
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-950 tracking-tight drop-shadow-md mb-3">
                        {beat.leadQuote}
                      </h3>
                      <div className="text-lg sm:text-2xl text-amber-900/95 leading-relaxed font-medium mb-4">
                        {beat.bodyComponent}
                      </div>
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-500/40 shadow-xl text-left inline-block">
                        <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                          📡 <strong className="text-amber-950">NASA History:</strong> {beat.scienceFact}
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
                        mood="curious"
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

                      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-500/40 shadow-xl">
                        <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                          📡 <strong className="text-amber-950">NASA History:</strong> {beat.scienceFact}
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

export default Page2Sputnik;