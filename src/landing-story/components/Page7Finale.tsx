import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { OrbitCharacter } from './OrbitCharacter';
import { SputnikIllustration } from './SputnikIllustration';
import { SojournerIllustration } from './SojournerIllustration';
import { RoverIllustration } from './RoverIllustration';
import { ApolloIllustration } from './ApolloIllustration';
import { VoyagerIllustration } from './VoyagerIllustration';
import { PioneerIllustration } from './PioneerIllustration';
import { playCheer, playSceneMusic, playBloop, playPageTurn } from '../utils/sound';
import { speakDialogue, getSpeechEnabled } from '../utils/speech';

interface Page7Props {
  onRestartStory?: () => void;
}

export const Page7Finale: React.FC<Page7Props> = ({ onRestartStory }) => {
  const [explorerName, setExplorerName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [missionCalling, setMissionCalling] = useState<string>('Planetary Astrobiologist');
  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    'Is there liquid water beneath the icy crust of Europa?'
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [isStamped, setIsStamped] = useState(false);
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    playSceneMusic('finale');
  }, []);

  const missionCallings = [
    'Planetary Astrobiologist',
    'Rover Flight Director',
    'Solar System Cartographer',
    'Lunar Geologist',
  ];

  const standardQuestions = [
    'Is there liquid water beneath the icy crust of Europa?',
    'What was Mars like when rivers still flowed 3 billion years ago?',
    'How do the first stars ignite inside dark interstellar nebulae?',
    'Could plants grow in lunar greenhouses under a dome?',
    'Custom question...',
  ];

  const activeQuestionText =
    selectedQuestion === 'Custom question...'
      ? customQuestion.trim() || 'What lies beyond the farthest galaxies in our universe?'
      : selectedQuestion;

  const handleStampBadge = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = explorerName.trim();
    if (!trimmed) {
      setNameError(true);
      playBloop(320);
      return;
    }

    setNameError(false);
    playCheer();
    setIsStamped(true);

    const cheer = `Mission Badge stamped for Explorer ${trimmed}! Calling: ${missionCalling}. Never stop asking questions to the stars!`;
    speakDialogue('orbit', cheer);

    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#f59e0b', '#10b981', '#a855f7'],
    });
  };

  return (
    <div className="relative w-full text-amber-900">
     
      <section
        id="chapter-7"
        className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#fff1dc] via-[#ffe0b8] to-[#fff1dc] overflow-hidden"
      >
       
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
          <svg viewBox="0 0 1400 800" className="w-full h-full" preserveAspectRatio="none">
            <ellipse cx="700" cy="950" rx="900" ry="400" fill="#38bdf8" fillOpacity="0.25" />
            <ellipse cx="700" cy="950" rx="860" ry="370" fill="#0284c7" fillOpacity="0.15" />
          </svg>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
        
          <div className="pt-2 pb-10 px-4 text-center max-w-4xl mx-auto">
            
            <h2 className="text-3xl sm:text-6xl font-black text-amber-950 mt-3 tracking-tight drop-shadow-md">
              Questions That Reach the Stars
            </h2>
            
          </div>

        
          <div className="w-full max-w-6xl px-4 sm:px-8 lg:px-12 py-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
            <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
              <OrbitCharacter
                mood="curious"
                size="lg"
                speechBubble="Space isn't just about planets... it's about questions!"
                onClick={() =>
                  speakDialogue(
                    'orbit',
                    "So… what did we learn? Space isn't just about planets and stars. It's about questions! What's over there? What is Mars really like? What is beyond our Solar System? And every time humans asked a question… we built an explorer to go looking for the answer."
                  )
                }
              />
              <button
                onClick={() =>
                  speakDialogue(
                    'orbit',
                    "So… what did we learn? Space isn't just about planets and stars. It's about questions! And every time humans asked a question… we built an explorer to go looking for the answer."
                  )
                }
                className="mt-4 px-3.5 py-1.5 rounded-full bg-white/80 border border-orange-400/50 hover:border-orange-300 text-xs font-mono font-bold text-amber-800 hover:text-amber-950 flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                
              </button>
            </div>

            <div className="w-full lg:w-7/12 flex flex-col justify-center max-w-2xl">
              

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-950 tracking-tight drop-shadow-md mb-3 leading-snug">
                What did we learn? Space isn't just about planets and stars. It's about questions.
              </h3>

              <p className="text-lg sm:text-2xl font-medium text-amber-900/95 leading-relaxed mb-5">
                ‘What's over there?’ ‘What was Mars like when water flowed?’ ‘What lies beyond our Solar System?’ Every time humans asked a question, we engineered an explorer to go searching for the answer.
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-orange-500/40 shadow-xl">
                <p className="text-sm sm:text-base font-semibold text-amber-800 leading-snug">
                  🌱 <strong className="text-amber-950">The Spark of Discovery:</strong> Every probe, rover, and space telescope began in the imagination of a curious person just like you.
                </p>
              </div>
            </div>
          </div>

         

          <div className="w-full max-w-6xl px-4 sm:px-8 lg:px-12 py-10 flex flex-col items-center gap-6">
            <div className="w-full p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-orange-500/30 shadow-2xl">
              <div className="text-center mb-6 font-mono">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
                  ✦ The Space Explorers Gathered Together ✦
                </span>
                <p className="text-xs text-orange-600/80 mt-1">
                  Tap any friend to hear their greeting from across the Solar System!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-around gap-6">
                <div className="scale-90 sm:scale-100">
                  <OrbitCharacter
                    mood="gentle"
                    size="sm"
                    speechBubble="Every one left something behind."
                    onClick={() =>
                      speakDialogue(
                        'orbit',
                        "Some explorers became silent. Some are still travelling. Some left their footprints on another world. But every one of them left something behind: a little more knowledge about our universe."
                      )
                    }
                  />
                </div>
                <div className="scale-80 sm:scale-95">
                  <SputnikIllustration onClick={() => speakDialogue('sputnik', "Beep beep! Pioneer 1, NASA's first spacecraft!")} />
                </div>
                <div className="scale-80 sm:scale-95">
                  <SojournerIllustration onClick={() => speakDialogue('sojourner', "Sojourner, first wheels on Mars!")} />
                </div>
                <div className="scale-80 sm:scale-95">
                  <RoverIllustration name="Oppy" variant="celebrating" size="sm" speechBubble="Opportunity!" onClick={() => speakDialogue('oppy', "Opportunity, over 14 years on Mars!")} />
                </div>
                <div className="scale-80 sm:scale-95">
                  <ApolloIllustration onClick={() => speakDialogue('apollo', "Apollo 15 Lunar Roving Vehicle!")} />
                </div>
                <div className="scale-80 sm:scale-95">
                  <PioneerIllustration onClick={() => speakDialogue('pioneer', "Pioneer 10 plaque to the stars!")} />
                </div>
                <div className="scale-80 sm:scale-95">
                  <VoyagerIllustration onClick={() => speakDialogue('voyager', "Voyager 1 in interstellar space!")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section
        id="chapter-8"
        className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#fff1dc] via-[#ffe0b8] to-[#fff1dc] overflow-hidden"
      >
        <div className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6">
         
          <div className="flex flex-col items-center mb-6 text-center">
   
            <div className="flex items-center gap-1.5 mb-3 select-none">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
              </div>
              <div className="w-4 h-4 rounded-full border-2 border-orange-300 bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
                <div className="w-3.5 h-3.5 rounded-xs border border-orange-400 bg-orange-200/60" />
              </div>
            </div>

            <div className="text-xs sm:text-sm font-mono tracking-widest text-orange-600 font-bold uppercase flex items-center justify-center gap-2">
              <span>✦</span>
              <span>NASA Explorer Flight Deck · Junior Explorer Induction</span>
              <span>✦</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-amber-950 mt-2 tracking-tight flex items-center gap-2">
              <span>Join the Mission</span>
              <span className="text-3xl sm:text-4xl">🚀</span>
            </h2>
          </div>

         
          <div className="w-full max-w-3xl rounded-3xl border border-orange-500/50 bg-[#fff8ee]/95 backdrop-blur-2xl p-6 sm:p-9 shadow-2xl text-amber-900 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-700 border border-orange-400/60 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                🚀
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-widest text-orange-600 font-bold uppercase">
                  Final Page · Official Mission Log
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight mt-0.5">
                  Join the Mission
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-amber-800/90 leading-relaxed mb-6 font-medium">
              Every great journey started with one curious person asking a question. Enter your explorer name to stamp your official Junior Explorer Badge and choose the big question you want to ask the universe!
            </p>

            {!isStamped ? (
              <form onSubmit={handleStampBadge} className="space-y-6">
              
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-mono font-bold tracking-widest text-amber-700 uppercase">
                      Your Explorer Name / Callsign: <span className="text-red-600">*</span>
                    </label>
                    {nameError && (
                      <span className="text-xs sm:text-sm font-mono font-bold text-red-600 animate-pulse">
                        ⚠️ Explorer name is required!
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={explorerName}
                    onChange={(e) => {
                      setExplorerName(e.target.value);
                      if (nameError && e.target.value.trim()) {
                        setNameError(false);
                      }
                    }}
                    placeholder="Enter your name (e.g. Maya or Cadet Leo)"
                    maxLength={35}
                    className={`w-full px-4 py-3.5 rounded-2xl border bg-[#ffe0b8] text-amber-950 font-mono text-base sm:text-lg placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all shadow-inner ${
                      nameError
                        ? 'border-red-500 ring-2 ring-red-500/50'
                        : 'border-amber-400/60 focus:border-orange-400'
                    }`}
                  />
                  {nameError && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 font-mono">
                      Please enter your name above to claim your official badge. No nameless badges in our flight log!
                    </p>
                  )}
                </div>

             
                <div>
                  <label className="block text-xs sm:text-sm font-mono font-bold tracking-widest text-amber-700 uppercase mb-2">
                    Your Mission Calling:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {missionCallings.map((calling) => {
                      const isSelected = missionCalling === calling;
                      return (
                        <button
                          key={calling}
                          type="button"
                          onClick={() => {
                            playBloop(540);
                            setMissionCalling(calling);
                          }}
                          className={`w-full px-4 py-3 rounded-2xl border font-mono text-sm sm:text-base text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)] font-bold'
                              : 'bg-[#ffe0b8]/60 border-amber-300/60 text-amber-700/80 hover:bg-[#ffe0b8] hover:text-amber-950 hover:border-orange-700'
                          }`}
                        >
                          <span className={isSelected ? 'text-white' : 'text-orange-500'}>✦</span>
                          <span>{calling}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

             
                <div>
                  <label className="block text-xs sm:text-sm font-mono font-bold tracking-widest text-amber-700 uppercase mb-2">
                    What Big Question Will You Ask the Universe?
                  </label>
                  <div className="space-y-2.5">
                    {standardQuestions.map((q) => {
                      const isSelected = selectedQuestion === q;
                      return (
                        <label
                          key={q}
                          onClick={() => {
                            playBloop(480);
                            setSelectedQuestion(q);
                          }}
                          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)] font-semibold'
                              : 'bg-[#ffe0b8]/40 border-amber-300 text-amber-800/80 hover:bg-[#ffe0b8] hover:border-orange-800'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 ${
                              isSelected
                                ? 'border-orange-400 bg-orange-500'
                                : 'border-amber-400 bg-transparent'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                          <span className="text-sm sm:text-base font-sans font-medium">{q}</span>
                        </label>
                      );
                    })}
                  </div>

                  {selectedQuestion === 'Custom question...' && (
                    <div className="mt-2.5 pl-2">
                      <input
                        type="text"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Type your own cosmic question here..."
                        maxLength={120}
                        className="w-full px-4 py-3 rounded-2xl border border-orange-500 bg-[#ffe0b8] text-amber-950 font-sans text-sm sm:text-base placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-mono font-bold text-sm sm:text-base tracking-wider uppercase border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center gap-2.5 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Stamp My Mission Badge</span>
                    <span className="text-xl">🚀</span>
                  </button>
                </div>
              </form>
            ) : (
              
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#ffe9cf] to-[#fff1dc] border-2 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.35)] text-center relative overflow-hidden">
                <div className="absolute top-3 right-4 px-3 py-1 rounded-full border border-orange-400/80 bg-orange-100 text-[10px] font-mono tracking-widest text-orange-700 font-bold uppercase shadow-sm">
                  ✓ STAMPED & VERIFIED
                </div>

                <div className="text-4xl mb-2">🎖️</div>
                <div className="text-[11px] font-mono tracking-widest text-orange-600 uppercase font-bold">
                  NASA Explorer Flight Deck · Mission Crew Roster
                </div>

                <h4 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
                  Explorer {explorerName.trim()}
                </h4>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-400/60 text-orange-800 text-xs font-mono font-bold my-3">
                  <span>✦</span>
                  <span>{missionCalling}</span>
                </div>

                <div className="mt-2 p-4 rounded-xl bg-black/40 border border-amber-300/60 text-left">
                  <span className="text-[10px] font-mono tracking-wider text-orange-600 uppercase block mb-1">
                    Your Big Question to the Universe:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-amber-950 italic">
                    "{activeQuestionText}"
                  </p>
                </div>

                <p className="text-xs text-amber-800/80 mt-4 leading-relaxed max-w-md mx-auto">
                  You are officially logged into our exploration crew! Whenever you look up at the Moon, Mars, or deep starry space, remember: <strong>curiosity is humanity's greatest engine.</strong>
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      confetti({ particleCount: 90, spread: 75 });
                      playCheer();
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Celebrate Again ✨
                  </button>
                  <button
                    onClick={() => setIsStamped(false)}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold font-mono text-xs rounded-xl border border-amber-300 transition-colors cursor-pointer"
                  >
                    Edit Log Entry
                  </button>
                  {onRestartStory && (
                    <button
                      onClick={onRestartStory}
                      className="px-4 py-2 bg-transparent hover:bg-orange-100 text-amber-700 font-mono text-xs rounded-xl border border-orange-300 transition-colors cursor-pointer"
                    >
                      Read Story From Beginning 📖
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="relative z-10 pt-12 pb-6 text-center">
          <span className="text-xs font-mono text-amber-900">
            The story never ends · Space is waiting for your questions
          </span>
        </footer>
      </section>
    </div>
  );
};

export default Page7Finale;
