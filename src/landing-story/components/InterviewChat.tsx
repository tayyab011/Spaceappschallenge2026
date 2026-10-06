import React, { useRef, useState, useEffect } from 'react';
import { SpaceGlossaryWord } from './SpaceGlossaryWord';
import { speakDialogue, stopSpeaking, getSpeechEnabled, CharacterVoice } from '../utils/speech';

interface InterviewChatProps {
  lines: [string, string][];
  dark?: boolean;
}


const SPEAKERS: Record<string, { voice: CharacterVoice; bubble: string }> = {
  Orbit: { voice: 'orbit', bubble: 'bg-sky-600 border-sky-300' },
  Sojourner: { voice: 'sojourner', bubble: 'bg-amber-600 border-amber-300' },
  Oppy: { voice: 'oppy', bubble: 'bg-red-600 border-red-300' },
  Spirit: { voice: 'spirit', bubble: 'bg-pink-600 border-pink-300' },
  'Viking 1': { voice: 'viking1', bubble: 'bg-orange-700 border-orange-300' },
  'Apollo Rover': { voice: 'apollo', bubble: 'bg-emerald-600 border-emerald-300' },
  'Surveyor 1': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'GRAIL-A (Ebb)': { voice: 'narrator', bubble: 'bg-teal-600 border-teal-300' },
  'GRAIL-B (Flow)': { voice: 'narrator', bubble: 'bg-cyan-600 border-cyan-300' },
  'Apollo 11': { voice: 'apollo', bubble: 'bg-blue-600 border-blue-300' },
  'Apollo 15': { voice: 'apollo', bubble: 'bg-emerald-600 border-emerald-300' },
  'Pioneer 10': { voice: 'pioneer', bubble: 'bg-yellow-600 border-yellow-300' },
  'Mariner 2': { voice: 'mariner2', bubble: 'bg-orange-600 border-orange-300' },
  'Pioneer 5': { voice: 'pioneer5', bubble: 'bg-lime-700 border-lime-300' },
  'Mariner 10': { voice: 'mariner10', bubble: 'bg-fuchsia-600 border-fuchsia-300' },
  'Pioneer 11': { voice: 'pioneer11', bubble: 'bg-cyan-600 border-cyan-300' },
  'Voyager 1': { voice: 'voyager', bubble: 'bg-violet-600 border-violet-300' },
  'Viking 2': { voice: 'viking1', bubble: 'bg-orange-700 border-orange-300' },
  'Viking 1 Orbiter': { voice: 'viking1', bubble: 'bg-orange-800 border-orange-300' },
  'Viking 2 Orbiter': { voice: 'viking1', bubble: 'bg-amber-800 border-amber-300' },
  'Mariner 4': { voice: 'mariner2', bubble: 'bg-orange-600 border-orange-300' },
  'Mariner 5': { voice: 'mariner2', bubble: 'bg-orange-600 border-orange-300' },
  'Mariner 6': { voice: 'mariner2', bubble: 'bg-orange-600 border-orange-300' },
  'Mariner 7': { voice: 'mariner2', bubble: 'bg-orange-600 border-orange-300' },
  'Mars Observer': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Mars Global Surveyor': { voice: 'narrator', bubble: 'bg-teal-600 border-teal-300' },
  'Mars Climate Orbiter': { voice: 'narrator', bubble: 'bg-rose-700 border-rose-300' },
  'Mars Polar Lander': { voice: 'narrator', bubble: 'bg-indigo-600 border-indigo-300' },
  'Phoenix': { voice: 'sojourner', bubble: 'bg-red-700 border-red-300' },
  'InSight': { voice: 'spirit', bubble: 'bg-pink-700 border-pink-300' },
  'Ingenuity': { voice: 'oppy', bubble: 'bg-sky-700 border-sky-300' },
  'Ranger 7': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Ranger 8': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Ranger 9': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Lunar Orbiter 1': { voice: 'narrator', bubble: 'bg-cyan-700 border-cyan-300' },
  'Lunar Orbiter 2': { voice: 'narrator', bubble: 'bg-cyan-700 border-cyan-300' },
  'Lunar Orbiter 3': { voice: 'narrator', bubble: 'bg-cyan-700 border-cyan-300' },
  'Lunar Orbiter 4': { voice: 'narrator', bubble: 'bg-cyan-700 border-cyan-300' },
  'Lunar Orbiter 5': { voice: 'narrator', bubble: 'bg-cyan-700 border-cyan-300' },
  'Surveyor 2': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Surveyor 3': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Surveyor 4': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Surveyor 5': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Surveyor 6': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Surveyor 7': { voice: 'narrator', bubble: 'bg-slate-600 border-slate-300' },
  'Apollo 12': { voice: 'apollo', bubble: 'bg-blue-600 border-blue-300' },
  'Apollo 14': { voice: 'apollo', bubble: 'bg-blue-600 border-blue-300' },
  'Apollo 16': { voice: 'apollo', bubble: 'bg-blue-600 border-blue-300' },
  'Apollo 17': { voice: 'apollo', bubble: 'bg-blue-600 border-blue-300' },
  'Apollo 16 Rover': { voice: 'apollo', bubble: 'bg-emerald-600 border-emerald-300' },
  'Apollo 17 Rover': { voice: 'apollo', bubble: 'bg-emerald-600 border-emerald-300' },
  'ALSEP': { voice: 'apollo', bubble: 'bg-lime-700 border-lime-300' },
  'Lunar Prospector': { voice: 'narrator', bubble: 'bg-teal-600 border-teal-300' },
  'LADEE': { voice: 'narrator', bubble: 'bg-teal-700 border-teal-300' },
  'Apollo 10 Snoopy': { voice: 'apollo', bubble: 'bg-blue-700 border-blue-300' },
  'Galileo': { voice: 'voyager', bubble: 'bg-violet-600 border-violet-300' },
  'Cassini': { voice: 'voyager', bubble: 'bg-purple-600 border-purple-300' },
};

const plain = (t: string) => t.replace(/\{\{\w+\|([^}]+)\}\}/g, '$1');
const renderText = (t: string) =>
  t.split(/(\{\{\w+\|[^}]+\}\})/g).map((part, k) => {
    const m = part.match(/^\{\{(\w+)\|([^}]+)\}\}$/);
    return m ? (
      <span key={k} onClick={(e) => e.stopPropagation()} className="inline-block">
        <SpaceGlossaryWord termKey={m[1] as any} displayText={m[2]} />
      </span>
    ) : (
      <React.Fragment key={k}>{part}</React.Fragment>
    );
  });

const FALLBACK = { voice: 'narrator' as CharacterVoice, bubble: 'bg-stone-600 border-stone-300' };

export const InterviewChat: React.FC<InterviewChatProps> = ({ lines, dark = false }) => {
  const [playing, setPlaying] = useState<number | null>(null);
  const token = useRef(0);
  const playingRef = useRef<number | null>(null);
  playingRef.current = playing;

  useEffect(() => () => {
    token.current += 1;
    if (playingRef.current !== null) stopSpeaking();
  }, []);

  const playFrom = (i: number, myToken: number) => {
    if (myToken !== token.current) return;
    if (i >= lines.length) {
      setPlaying(null);
      return;
    }
    setPlaying(i);
    const sp = SPEAKERS[lines[i][0]] || FALLBACK;
    speakDialogue(sp.voice, plain(lines[i][1]), {
      manualTrigger: true,
      onEnd: () => {
        if (myToken !== token.current) return;
        window.setTimeout(() => playFrom(i + 1, myToken), 250);
      },
    });
  };

  const playAll = () => {
    if (!getSpeechEnabled()) return;
    token.current += 1;
    playFrom(0, token.current);
  };

  const stopAll = () => {
    token.current += 1;
    stopSpeaking();
    setPlaying(null);
  };

  const playOne = (i: number) => {
    if (!getSpeechEnabled()) return;
    token.current += 1;
    const myToken = token.current;
    setPlaying(i);
    const sp = SPEAKERS[lines[i][0]] || FALLBACK;
    speakDialogue(sp.voice, plain(lines[i][1]), {
      manualTrigger: true,
      onEnd: () => {
        if (myToken === token.current) setPlaying(null);
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2 my-4 text-left">
      <div className="flex justify-center">
        <button
          onClick={playing === null ? playAll : stopAll}
          className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-mono font-bold shadow-md cursor-pointer transition-all ${
            dark
              ? 'bg-purple-900 border-purple-300 text-purple-100 hover:bg-purple-800'
              : 'bg-orange-600 border-orange-300 text-white hover:bg-orange-500'
          }`}
        >
          {playing === null ? '🔊 Play the chat' : '⏹ Stop'}
        </button>
      </div>
      {lines.map(([speaker, text], i) => {
        const sp = SPEAKERS[speaker] || FALLBACK;
        const isOrbit = speaker === 'Orbit';
        const active = playing === i;
        return (
          <div key={i} className={`flex ${isOrbit ? 'justify-start' : 'justify-end'}`}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => playOne(i)}
              title="Tap to hear me!"
              className={`max-w-[85%] px-4 py-2 rounded-2xl border shadow-md text-sm sm:text-base font-semibold leading-snug text-white text-left cursor-pointer transition-all ${sp.bubble} ${
                active ? 'ring-4 ring-yellow-300 scale-105' : 'opacity-95 hover:opacity-100'
              }`}
            >
              <strong>{speaker}:</strong> {renderText(text)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InterviewChat;