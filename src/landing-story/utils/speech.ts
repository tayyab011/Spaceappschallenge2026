import {
  playOrbitCue,
  playSpiritCue,
  playOppyCue,
  playRadioBeep,
} from './sound';

export type CharacterVoice =
  | 'orbit'
  | 'sputnik'
  | 'sojourner'
  | 'spirit'
  | 'oppy'
  | 'viking1'
  | 'apollo'
  | 'pioneer'
  | 'voyager'
  | 'mariner2'
  | 'pioneer5'
  | 'mariner10'
  | 'pioneer11'
  | 'narrator';

export interface CharacterVoiceMeta {
  name: string;
  avatar: string;
  role: string;
  soundCue: string;
  sampleQuote: string;
}

export const CHARACTER_META: Record<CharacterVoice, CharacterVoiceMeta> = {
  orbit: {
    name: 'Orbit',
    avatar: '🛰️',
    role: 'Your Space Guide',
    soundCue: 'Warm Storybook Bell',
    sampleQuote: "Hey explorer! Have you ever wondered just how BIG space really is?",
  },
  sputnik: {
    name: 'Sputnik 1',
    avatar: '📡',
    role: 'First Earth Satellite (1957)',
    soundCue: 'Gentle Radio Ping',
    sampleQuote: "Beep... beep... beep! I helped open the door to space!",
  },
  sojourner: {
    name: 'Sojourner',
    avatar: '🏎️',
    role: 'First Mars Rover (1997)',
    soundCue: 'Adventurous Chime',
    sampleQuote: "I rolled across the Martian rocks and soil for 83 wonderful days!",
  },
  spirit: {
    name: 'Spirit',
    avatar: '🤖',
    role: 'Mars Rover Pioneer',
    soundCue: 'Brave Horn',
    sampleQuote: "I climbed high hills and uncovered bright silica rocks under Mars!",
  },
  oppy: {
    name: 'Opportunity',
    avatar: '✨',
    role: 'Mars Rover Explorer',
    soundCue: 'Gentle Music Box',
    sampleQuote: "I found signs that liquid water had once flowed across ancient Mars!",
  },
  viking1: {
    name: 'Viking 1',
    avatar: '🛰️',
    role: 'First Long-Lived Mars Lander (1976)',
    soundCue: 'Steady Radio Ping',
    sampleQuote: "I landed on Mars in 1976 and sent home pictures and science!",
  },
  apollo: {
    name: 'Apollo 15 Crew',
    avatar: '🚙',
    role: 'Lunar Roving Vehicle',
    soundCue: 'Radio Transmission',
    sampleQuote: "We drove the first car on the Moon and collected the ancient Genesis Rock!",
  },
  pioneer: {
    name: 'Pioneer 10',
    avatar: '🪐',
    role: 'Outer Solar System Scout',
    soundCue: 'Cosmic Drone',
    sampleQuote: "I was the first to cross the asteroid belt and fly past giant Jupiter!",
  },
  voyager: {
    name: 'Voyager 1',
    avatar: '🌟',
    role: 'Interstellar Messenger',
    soundCue: 'Golden Record Chime',
    sampleQuote: "I carry a golden record into the quiet space between the stars.",
  },
  mariner2: {
    name: 'Mariner 2',
    avatar: '🟡',
    role: 'First Venus Flyby (1962)',
    soundCue: 'Cosmic Drone',
    sampleQuote: "Hi! I'm Mariner 2!",
  },
  pioneer5: {
    name: 'Pioneer 5',
    avatar: '☀️',
    role: 'Sun-Orbit Messenger (1960)',
    soundCue: 'Cosmic Drone',
    sampleQuote: "Hi! I'm Pioneer 5!",
  },
  mariner10: {
    name: 'Mariner 10',
    avatar: '🌑',
    role: 'Mercury Explorer (1973)',
    soundCue: 'Cosmic Drone',
    sampleQuote: "Hi! I'm Mariner 10!",
  },
  pioneer11: {
    name: 'Pioneer 11',
    avatar: '🪐',
    role: 'First Saturn Visitor (1979)',
    soundCue: 'Cosmic Drone',
    sampleQuote: "Hi! I'm Pioneer 11!",
  },
  narrator: {
    name: 'Storybook Voice',
    avatar: '📖',
    role: 'Narrator',
    soundCue: 'Soft Page Flutter',
    sampleQuote: "Once upon a time, humanity looked up at the stars and sent little explorers to find answers.",
  },
};

interface VoiceProfile {
  pitch: number;
  rate: number;
  volume: number;
  voiceKeywords: string[];
}

const VOICE_PROFILES: Record<CharacterVoice, VoiceProfile> = {
  orbit: {
    pitch: 1.05,
    rate: 0.95,
    volume: 1.0,
    voiceKeywords: [
      'natural',
      'google us english',
      'jenny',
      'samantha',
      'flo',
      'victoria',
      'karen',
      'female',
      'en-us',
    ],
  },
  sputnik: {
    pitch: 1.25,
    rate: 1.0,
    volume: 0.95,
    voiceKeywords: ['google', 'alex', 'en-us'],
  },
  sojourner: {
    pitch: 1.15,
    rate: 1.02,
    volume: 1.0,
    voiceKeywords: ['junior', 'natural', 'samantha', 'child', 'en-us'],
  },
  spirit: {
    pitch: 0.95,
    rate: 0.96,
    volume: 1.0,
    voiceKeywords: ['guy', 'daniel', 'alex', 'natural', 'george', 'male'],
  },
  oppy: {
    pitch: 1.08,
    rate: 0.96,
    volume: 1.0,
    voiceKeywords: ['samantha', 'ana', 'natural', 'victoria', 'female'],
  },
  apollo: {
    pitch: 0.96,
    rate: 0.96,
    volume: 1.0,
    voiceKeywords: ['alex', 'daniel', 'david', 'male'],
  },
  pioneer: {
    pitch: 0.92,
    rate: 0.94,
    volume: 1.0,
    voiceKeywords: ['guy', 'natural', 'alex', 'male'],
  },
  voyager: {
    pitch: 0.90,
    rate: 0.90,
    volume: 0.95,
    voiceKeywords: ['natural', 'daniel', 'oliver', 'male'],
  },
  viking1: {
    pitch: 1.0,
    rate: 0.95,
    volume: 1.0,
    voiceKeywords: ['daniel', 'natural', 'male', 'en-us'],
  },
  mariner2: {
    pitch: 1.0,
    rate: 0.94,
    volume: 1.0,
    voiceKeywords: ["daniel", "male"],
  },
  pioneer5: {
    pitch: 1.08,
    rate: 0.96,
    volume: 1.0,
    voiceKeywords: ["david", "male"],
  },
  mariner10: {
    pitch: 0.95,
    rate: 0.93,
    volume: 1.0,
    voiceKeywords: ["oliver", "male"],
  },
  pioneer11: {
    pitch: 0.88,
    rate: 0.92,
    volume: 1.0,
    voiceKeywords: ["guy", "natural", "male"],
  },
  narrator: {
    pitch: 1.0,
    rate: 0.92,
    volume: 1.0,
    voiceKeywords: ['natural', 'google us english', 'samantha'],
  },
};

let speechEnabled = false; // master mute: starts muted to match the UI
let speakId = 0;
let autoSpeakEnabled = false; 
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechListeners: Array<(isSpeaking: boolean, character?: CharacterVoice) => void> = [];
let resumeInterval: number | null = null;
let pendingSpeakTimer: number | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

export type Accent = 'auto' | 'en-US' | 'en-GB' | 'en-AU' | 'en-IN';
export const ACCENT_OPTIONS: { value: Accent; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'en-US', label: 'American' },
  { value: 'en-GB', label: 'British' },
  { value: 'en-AU', label: 'Australian' },
  { value: 'en-IN', label: 'Indian' },
];
let accent: Accent = 'auto';
try {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem('sb-accent') : null;
  if (saved && ACCENT_OPTIONS.some((o) => o.value === saved)) accent = saved as Accent;
} catch {
  /* storage unavailable */
}
export const getAccent = () => accent;
export const setAccent = (a: Accent) => {
  accent = a;
  try { window.localStorage.setItem('sb-accent', a); } catch { /* ignore */ }
};

// Mobile browsers only let speech start from a direct tap. Calling this inside a
// button handler "unlocks" later automatic narration.
export const primeSpeech = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
};

export const setSpeechEnabled = (enabled: boolean) => {
  speechEnabled = enabled;
  if (!enabled) {
    stopSpeaking();
  }
};

export const getSpeechEnabled = () => speechEnabled;

export const setAutoSpeakEnabled = (enabled: boolean) => {
  autoSpeakEnabled = enabled;
  if (!enabled) {
    stopSpeaking();
  }
};

export const getAutoSpeakEnabled = () => autoSpeakEnabled && speechEnabled;

export const registerSpeechListener = (
  listener: (isSpeaking: boolean, character?: CharacterVoice) => void
) => {
  speechListeners.push(listener);
  return () => {
    speechListeners = speechListeners.filter((l) => l !== listener);
  };
};

const notifyListeners = (isSpeaking: boolean, character?: CharacterVoice) => {
  speechListeners.forEach((l) => {
    try {
      l(isSpeaking, character);
    } catch {
     
    }
  });
};

const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const fresh = window.speechSynthesis.getVoices();
  if (fresh && fresh.length > 0) {
    cachedVoices = fresh;
  }
  return cachedVoices;
};


export const unlockSpeech = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  if (synth.paused) {
    synth.resume();
  }
  getAvailableVoices();
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };

  const onFirstInteraction = () => {
    unlockSpeech();
  };

  window.addEventListener('click', onFirstInteraction, { passive: true });
  window.addEventListener('scroll', onFirstInteraction, { passive: true });
  window.addEventListener('touchstart', onFirstInteraction, { passive: true });
  window.addEventListener('keydown', onFirstInteraction, { passive: true });
}


const pickBestVoice = (keywords: string[]): SpeechSynthesisVoice | null => {
  const all = getAvailableVoices();
  if (all.length === 0) return null;

  const norm = (l: string) => l.toLowerCase().replace('_', '-');
  let voices = all;
  if (accent !== 'auto') {
    const want = accent.toLowerCase();
    const inAccent = all.filter((v) => norm(v.lang) === want);
    if (inAccent.length > 0) voices = inAccent;
  }

  for (const kw of keywords) {
    const matched = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      return name.includes(kw) || lang.includes(kw);
    });
    if (matched) return matched;
  }

  const english = voices.find((v) => norm(v.lang).startsWith('en'));
  if (english) return english;

  return voices.find((v) => v.default) || voices[0] || null;
};

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  skipSoundCue?: boolean;
  manualTrigger?: boolean;
}


const cleanSpeechText = (rawText: string): string => {
  return rawText
    .replace(/[“”"']/g, '')
    .replace(/✦|⭐|💎|🚀|📡|🏎️|🤖|✨|🌕|🚙|🪐|🌟|📖|🔴/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};


const waitForSynthIdle = (synth: SpeechSynthesis, onIdle: () => void, startedAt = Date.now()) => {
  if (!synth.speaking && !synth.pending) {
    onIdle();
    return;
  }
  if (Date.now() - startedAt > 1500) {
    // Some browsers keep reporting "speaking" after cancel(); stop waiting.
    try { synth.cancel(); } catch { /* ignore */ }
    onIdle();
    return;
  }
  window.setTimeout(() => waitForSynthIdle(synth, onIdle, startedAt), 30);
};

export const speakDialogue = (
  character: CharacterVoice,
  text: string,
  options: SpeakOptions = {}
) => {
  if (!speechEnabled) return;
  if (!options.manualTrigger && !autoSpeakEnabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;
  if (synth.paused) {
    synth.resume();
  }

  // Every request (and every stopSpeaking) bumps speakId. Anything still holding an
  // older id is stale and must not touch shared state or start audio.
  const myId = ++speakId;
  const isCurrent = () => myId === speakId;

  if (pendingSpeakTimer) {
    window.clearTimeout(pendingSpeakTimer);
    pendingSpeakTimer = null;
  }

  try {
    synth.cancel();
  } catch {
    /* ignore */
  }

  if (resumeInterval) {
    window.clearInterval(resumeInterval);
    resumeInterval = null;
  }

  pendingSpeakTimer = window.setTimeout(() => {
    pendingSpeakTimer = null;
    if (!isCurrent()) return;
    if (!speechEnabled) return;
    if (!options.manualTrigger && !autoSpeakEnabled) return;

    if (!options.skipSoundCue) {
      if (character === 'orbit') playOrbitCue();
      else if (character === 'spirit') playSpiritCue();
      else if (character === 'oppy') playOppyCue();
      else if (character === 'sputnik') playRadioBeep(880, 0.1);
    }

    const cleanedText = cleanSpeechText(text);
    if (!cleanedText) return;

    const profile = VOICE_PROFILES[character] || VOICE_PROFILES.orbit;
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = profile.volume;

    const chosenVoice = pickBestVoice(profile.voiceKeywords);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      if (!isCurrent()) return;
      notifyListeners(true, character);
      if (options.onStart) options.onStart();
      if (resumeInterval) window.clearInterval(resumeInterval);
      resumeInterval = window.setInterval(() => {
        if (!synth.speaking) {
          if (resumeInterval) {
            window.clearInterval(resumeInterval);
            resumeInterval = null;
          }
          return;
        }
        synth.pause();
        synth.resume();
      }, 8000);
    };

    const handleFinish = () => {
      // A cancelled or superseded utterance can still fire onend in some browsers.
      // Ignore it so it cannot start the next line of an interview or notify the UI.
      if (!isCurrent()) return;
      if (resumeInterval) {
        window.clearInterval(resumeInterval);
        resumeInterval = null;
      }
      activeUtterance = null;
      (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = undefined;
      notifyListeners(false);
      if (options.onEnd) options.onEnd();
    };

    utterance.onend = handleFinish;
    utterance.onerror = (e) => {
      const err = (e as SpeechSynthesisErrorEvent).error;
      if (err === 'interrupted' || err === 'canceled') return;
      handleFinish();
    };

    // Start only once the browser has really stopped the previous voice, so two
    // voices never play at the same time.
    waitForSynthIdle(synth, () => {
      if (!isCurrent() || !speechEnabled) return;
      activeUtterance = utterance;
      (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = utterance;
      try {
        synth.speak(utterance);
        if (synth.paused) {
          synth.resume();
        }
      } catch {
        handleFinish();
      }
    });
  }, 25);
};

export const stopSpeaking = () => {
  speakId += 1;
  if (pendingSpeakTimer) {
    window.clearTimeout(pendingSpeakTimer);
    pendingSpeakTimer = null;
  }
  if (resumeInterval) {
    window.clearInterval(resumeInterval);
    resumeInterval = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
     
    }
  }
  activeUtterance = null;
  (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance }).__activeUtterance = undefined;
  notifyListeners(false);
};

export const isSpeakingCurrently = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
};