import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChapterItem, DestinationChoice } from '../types';
import { playSceneMusic, playBloop, playPageTurn } from '../utils/sound';
import { speakDialogue, stopSpeaking, getSpeechEnabled, getAutoSpeakEnabled } from '../utils/speech';

interface StateMachineProps {
  selectedDestination: DestinationChoice | null;
  onSelectDestination: (choice: DestinationChoice) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export const StorybookStateMachine: React.FC<StateMachineProps> = ({
  selectedDestination,
  onSelectDestination,
  soundEnabled,
  onToggleSound,
  autoSpeak,
  onToggleAutoSpeak,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string>('chapter-1');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenIdRef = useRef<string | null>(null);


  const chapters: ChapterItem[] = useMemo(() => {
    const commonStart: ChapterItem[] = [
      {
        id: 'chapter-1',
        title: 'Chapter 1: A Very Big Place',
        shortLabel: 'A Very Big Place',
        pageNumber: 1,
        pageStr: 'P.1',
        soundScene: 'space',
        autoSpeakText: "Hey, explorer! Have you ever wondered just how BIG space really is?",
      },
      {
        id: 'chapter-2',
        title: 'Chapter 2: The First Messenger',
        shortLabel: 'The First Messenger',
        pageNumber: 2,
        pageStr: 'P.2',
        soundScene: 'sputnik',
        autoSpeakText: "Long ago, in 1958, NASA sent Pioneer 1 toward the Moon!",
      },
      {
        id: 'chapter-3',
        title: 'Chapter 3: Choose Your Journey',
        shortLabel: 'Choose Your Journey',
        pageNumber: 3,
        pageStr: 'P.3',
        soundScene: 'earth',
        autoSpeakText: "Okay, explorer… Now it's your turn. Where should we go?",
      },
    ];

    let destinationChapters: ChapterItem[] = [];

    if (selectedDestination === null) {
     
      destinationChapters = [];
    } else if (selectedDestination === 'mars') {
      destinationChapters = [
        {
          id: 'mars-p4',
          title: 'Mars: Sojourner',
          shortLabel: 'Sojourner',
          pageNumber: 4,
          pageStr: 'P.4',
          destination: 'mars',
          soundScene: 'mars',
          autoSpeakText: "Meet Sojourner, the little Mars rover that was meant to work for 7 Mars days and explored for 83!",
        },
        {
          id: 'mars-p5',
          title: 'Mars: Opportunity',
          shortLabel: 'Opportunity',
          pageNumber: 5,
          pageStr: 'P.5',
          destination: 'mars',
          soundScene: 'mars',
          autoSpeakText: "Meet Opportunity, the rover that found tiny round blueberries and survived far longer than planned!",
        },
      ];
    } else if (selectedDestination === 'moon') {
      destinationChapters = [
        {
          id: 'moon-p4',
          title: 'The Moon: Surveyor 1',
          shortLabel: 'Surveyor 1',
          pageNumber: 4,
          pageStr: 'P.4',
          destination: 'moon',
          soundScene: 'moon',
          autoSpeakText: "Surveyor 1 made the first successful U.S. soft landing on the Moon!",
        },
        {
          id: 'moon-p5',
          title: 'The Moon: GRAIL',
          shortLabel: 'GRAIL: Ebb & Flow',
          pageNumber: 5,
          pageStr: 'P.5',
          destination: 'moon',
          soundScene: 'moon',
          autoSpeakText: "Ebb and Flow mapped the Moon's gravity together!",
        },
        {
          id: 'moon-p6',
          title: 'The Moon: Apollo 11 & 15',
          shortLabel: 'Apollo 11 & 15',
          pageNumber: 6,
          pageStr: 'P.6',
          destination: 'moon',
          soundScene: 'moon',
          autoSpeakText: "Apollo 11 landed humans on the Moon, and Apollo 15 explored it with a rover!",
        },
      ];
    } else if (selectedDestination === 'deep_space') {
      destinationChapters = [
        {
          id: 'deep-space-p4',
          title: 'Solar System & Beyond: Pioneer & Mariner',
          shortLabel: 'Pioneer & Mariner',
          pageNumber: 4,
          pageStr: 'P.4',
          destination: 'deep_space',
          soundScene: 'deep_space',
          autoSpeakText: "Let's meet the spacecraft that explored the Sun, Venus and Mercury!",
        },
        {
          id: 'deep-space-p5',
          title: 'Solar System & Beyond: Pioneer 10 & 11',
          shortLabel: 'Pioneer 10 & 11',
          pageNumber: 5,
          pageStr: 'P.5',
          destination: 'deep_space',
          soundScene: 'deep_space',
          autoSpeakText: "Pioneer 10 and Pioneer 11 pushed farther into the outer Solar System!",
        },
        {
          id: 'deep-space-p6',
          title: 'Solar System & Beyond: Voyager 1',
          shortLabel: 'Voyager 1',
          pageNumber: 6,
          pageStr: 'P.6',
          destination: 'deep_space',
          soundScene: 'deep_space',
          autoSpeakText: "Voyager 1 went beyond the planets and into interstellar space!",
        },
      ];
    }

    const commonEnd: ChapterItem[] = [
      {
        id: 'chapter-7',
        title: "Final Chapter: The Story Isn't Over",
        shortLabel: "The Story Isn't Over",
        pageNumber: 7,
        pageStr: 'P.7',
        soundScene: 'finale',
        autoSpeakText: "Space isn't just about planets and stars. It's about questions!",
      },
      {
        id: 'chapter-8',
        title: 'Your Mission Log: Join The Mission',
        shortLabel: 'Join The Mission',
        pageNumber: 8,
        pageStr: 'P.8',
        soundScene: 'finale',
        autoSpeakText: "Are you ready to join the mission?",
      },
    ];

    return [...commonStart, ...destinationChapters, ...commonEnd];
  }, [selectedDestination]);


  const currentChapter = useMemo(() => {
    return chapters.find((c) => c.id === activeChapterId) || chapters[0];
  }, [chapters, activeChapterId]);

 
  useEffect(() => {
    const handleIntersect: IntersectionObserverCallback = (entries) => {
     
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length === 0) return;

    
      let closestEntry = visibleEntries[0];
      let minDistanceToCenter = Infinity;
      const vCenter = window.innerHeight / 2;

      visibleEntries.forEach((entry) => {
        const rect = entry.boundingClientRect;
        const entryCenter = rect.top + rect.height / 2;
        const dist = Math.abs(entryCenter - vCenter);
        if (dist < minDistanceToCenter) {
          minDistanceToCenter = dist;
          closestEntry = entry;
        }
      });

      const matchedId = closestEntry.target.id;
      if (matchedId && matchedId !== activeChapterId) {
        setActiveChapterId(matchedId);
        const chapter = chapters.find((c) => c.id === matchedId);
        if (chapter && chapter.soundScene) {
          playSceneMusic(chapter.soundScene);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-10% 0px -25% 0px',
      threshold: [0.1, 0.25, 0.5],
    });

    chapters.forEach((chap) => {
      const el = document.getElementById(chap.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters, activeChapterId, autoSpeak]);

 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  
  const handleScrollToChapter = (chapterId: string) => {
    playBloop(580);
    setIsOpen(false);

    const chapter = chapters.find((c) => c.id === chapterId);
    const el = document.getElementById(chapterId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    if (chapter && chapter.autoSpeakText && getAutoSpeakEnabled()) {
      setTimeout(() => {
        speakDialogue('orbit', chapter.autoSpeakText!, { manualTrigger: true });
      }, 350);
    }
  };

  
  const handleSwitchDestination = (dest: DestinationChoice) => {
    playPageTurn();
    onSelectDestination(dest);
    setIsOpen(false);

    const destIntro =
      dest === 'mars'
        ? "Switching to Mars! The Red Planet with Sojourner and Opportunity!"
        : dest === 'moon'
        ? "Switching to the Moon! Exploring Surveyor 1, GRAIL, and Apollo missions!"
        : "Switching to Solar System! Journeying with Pioneer and Voyager!";

    if (getAutoSpeakEnabled()) {
      speakDialogue('orbit', destIntro, { manualTrigger: true });
    }


    setTimeout(() => {
      const targetId = dest === 'mars' ? 'mars-p4' : dest === 'moon' ? 'moon-p4' : 'deep-space-p4';
      const el = document.getElementById(targetId) || document.getElementById('chosen-destination-story');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

 
  const truncatedTitle = useMemo(() => {
    if (currentChapter.title.length > 28) {
      return currentChapter.title.slice(0, 24) + '...';
    }
    return currentChapter.title;
  }, [currentChapter]);

  return (
    <div ref={dropdownRef} className="relative z-50 min-w-0">
    
      <button
        onClick={() => {
          playBloop(500);
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-yellow-400/60 bg-[#fff8ee]/90 backdrop-blur-md text-amber-900 hover:text-amber-950 hover:border-yellow-300 font-mono text-xs shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        title="Open Chapter Selection"
      >
        <span className="text-yellow-400 text-sm">📖</span>
        <span className="hidden sm:inline font-semibold tracking-tight">{truncatedTitle}</span>
        <span className="hidden sm:inline text-amber-800">·</span>
        <span className="font-bold text-amber-800">Page {currentChapter.pageNumber}</span>
        <span className={`text-[10px] text-yellow-700 ml-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-1.5rem))] rounded-2xl border border-yellow-700 bg-[#fff1dc]/95 backdrop-blur-2xl shadow-2xl p-3 text-amber-900 animate-in fade-in zoom-in-95 duration-150">
       
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-yellow-900/50">
            <span className="text-[10px] font-mono font-bold tracking-widest text-yellow-800 uppercase">
              Storybook Chapters:
            </span>
            <div className="flex items-center gap-2">
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAutoSpeak();
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 transition-colors ${
                  autoSpeak
                    ? 'bg-yellow-500/20 border-yellow-400 text-amber-800'
                    : 'bg-amber-100/60 border-amber-300 text-amber-600'
                }`}
                title="Toggle Auto Voice Narration"
              >
                <span>{autoSpeak ? '🔊 Auto-Voice' : '🔇 Voice Manual'}</span>
              </button>
            </div>
          </div>

         
          <div className="mt-2 space-y-1 max-h-[58vh] overflow-y-auto pr-1">
            {chapters.map((chap) => {
              const isActive = chap.id === activeChapterId;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleScrollToChapter(chap.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-yellow-950/80 border border-yellow-400 text-amber-100 shadow-[0_0_12px_rgba(56,189,248,0.25)] font-bold'
                      : 'hover:bg-yellow-900/30 text-amber-800/90 border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">{chap.title}</span>
                  <span className="text-[11px] font-semibold text-yellow-600 flex-shrink-0">
                    {chap.pageStr}
                  </span>
                </button>
              );
            })}
          </div>

         
          <div className="mt-3 pt-2.5 border-t border-yellow-900/60">
            <div className="text-[10px] font-mono font-bold tracking-wider text-amber-400/90 uppercase px-2 mb-1.5">
              Switch Destination:
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 rounded-xl border border-yellow-950">
         
              <button
                onClick={() => handleSwitchDestination('mars')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  selectedDestination === 'mars'
                    ? 'bg-white/90 text-amber-800 border border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                    : 'text-stone-300 hover:text-amber-950 hover:bg-stone-800/40'
                }`}
              >
                <span>🔴</span>
                <span>Mars</span>
              </button>

            
              <button
                onClick={() => handleSwitchDestination('moon')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  selectedDestination === 'moon'
                    ? 'bg-amber-100/90 text-amber-900 border border-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.3)]'
                    : 'text-stone-300 hover:text-amber-950 hover:bg-stone-800/40'
                }`}
              >
                <span>🌕</span>
                <span>Moon</span>
              </button>

              
              <button
                onClick={() => handleSwitchDestination('deep_space')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  selectedDestination === 'deep_space'
                    ? 'bg-purple-900/90 text-purple-200 border border-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'text-stone-300 hover:text-amber-950 hover:bg-stone-800/40'
                }`}
              >
                <span>🌌</span>
                <span>Solar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorybookStateMachine;