import React, { useState, useEffect } from 'react';
import { Page1SolarSystem } from './components/Page1SolarSystem';
import { Page2Sputnik } from './components/Page2Sputnik';
import { Page3ChooseDestination } from './components/Page3ChooseDestination';
import { Page4MarsPath } from './components/Page4MarsPath';
import { Page5MoonPath } from './components/Page5MoonPath';
import { Page6DeepSpacePath } from './components/Page6DeepSpacePath';
import { Page7Finale } from './components/Page7Finale';
import { StorybookStateMachine } from './components/StorybookStateMachine';
import { DestinationChoice } from './types';
import { destinationFromHash, hashForDestination } from '../routes';
import { setSoundEnabled, playBloop, playPageTurn } from './utils/sound';
import {
  setSpeechEnabled,
  setAutoSpeakEnabled,
  registerSpeechListener,
  stopSpeaking,
  ACCENT_OPTIONS,
  getAccent,
  setAccent,
  Accent,
  CharacterVoice,
  primeSpeech,
} from './utils/speech';

export interface StorybookProps {
  initialDestination?: DestinationChoice | null;
  onComplete?: () => void;
  className?: string;
}

export const LandingStory: React.FC<StorybookProps> = ({
  initialDestination = null,
  className = '',
}) => {
  const [selectedDestination, setSelectedDestination] = useState<DestinationChoice | null>(() => {
    if (initialDestination != null) return initialDestination;
    return destinationFromHash(window.location.hash);
  });
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [accent, setAccentState] = useState<Accent>(getAccent());
  const [activeSpeaker, setActiveSpeaker] = useState<{ isSpeaking: boolean; character?: CharacterVoice }>({
    isSpeaking: false,
  });

  useEffect(() => {
    setAutoSpeakEnabled(false);
    setSpeechEnabled(false);
    setSoundEnabled(false);
    const unregister = registerSpeechListener((isSpeaking, character) => {
      setActiveSpeaker({ isSpeaking, character });
    });
    return () => unregister();
  }, []);

  useEffect(() => {
    if (initialDestination != null) {
      setSelectedDestination(initialDestination);
    }
  }, [initialDestination]);

  useEffect(() => {
    const onHashChange = () => {
      const dest = destinationFromHash(window.location.hash);
      if (dest) setSelectedDestination(dest);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!selectedDestination) return;
    const hash = hashForDestination(selectedDestination);
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${hash}`);
    }
  }, [selectedDestination]);

  const handleSoundToggle = () => {
    primeSpeech();
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    setSpeechEnabled(next);
    if (next) {
      playBloop(520);
    } else {
      // Audio off means no voice at all, so Auto-Voice must reflect that.
      setAutoSpeak(false);
      setAutoSpeakEnabled(false);
      stopSpeaking();
    }
  };

  const handleToggleAutoSpeak = () => {
    primeSpeech();
    const next = !autoSpeak;
    if (next) {
      // Auto-Voice needs audio. Turn speech on here so it works without a second click.
      setSoundOn(true);
      setSoundEnabled(true);
      setSpeechEnabled(true);
      setAutoSpeak(true);
      setAutoSpeakEnabled(true);
      playBloop(640);
    } else {
      setAutoSpeak(false);
      setAutoSpeakEnabled(false);
      stopSpeaking();
    }
  };

  const scrollToTop = () => {
    stopSpeaking();
    playPageTurn();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main
      className={`relative w-full min-h-screen bg-[#fff1dc] text-amber-900 selection:bg-orange-500 selection:text-white font-sans ${className}`}
    >
     
      <header className="fixed top-[5.75rem] left-3 right-3 z-40 flex items-center justify-between gap-2 pointer-events-none">

        <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
           
          <button
            onClick={handleSoundToggle}
            className={`px-2 sm:px-2.5 py-1 rounded-sm border text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-md cursor-pointer ${
              soundOn
                ? 'bg-orange-950/80 border-orange-500/60 text-orange-300 hover:border-orange-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title={soundOn ? 'Music and Voice are ON' : 'Audio is MUTED'}
          >
            <span>{soundOn ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{soundOn ? 'Audio ON' : 'Muted'}</span>
          </button>

      
          <button
            onClick={handleToggleAutoSpeak}
            className={`px-2 sm:px-2.5 py-1 rounded-sm border text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-md cursor-pointer ${
              autoSpeak
                ? 'bg-orange-800 border-orange-400 text-orange-200 hover:border-orange-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title={autoSpeak ? 'Auto-Voice is active! Characters read as you explore' : 'Auto-Voice is OFF. Tap to activate'}
          >
            <span>{autoSpeak ? '🗣️' : '🔇'}<span className="hidden sm:inline">{autoSpeak ? ' Auto-Voice ON' : ' Auto-Voice OFF'}</span><span className="sm:hidden">{autoSpeak ? ' Auto' : ' Off'}</span></span>
          </button>

        
        </div>

        
        <div className="pointer-events-auto flex items-center gap-1 min-w-0">
          <StorybookStateMachine
            selectedDestination={selectedDestination}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            soundEnabled={soundOn}
            onToggleSound={handleSoundToggle}
            autoSpeak={autoSpeak}
            onToggleAutoSpeak={handleToggleAutoSpeak}
          />
        </div>
      </header>

  
      <Page1SolarSystem autoSpeak={autoSpeak} />
      <Page2Sputnik autoSpeak={autoSpeak} />

     
      <Page3ChooseDestination
        selectedDestination={selectedDestination}
        onSelectDestination={(dest) => setSelectedDestination(dest)}
      />

      {selectedDestination === 'mars' && (
        <Page4MarsPath
          key="mars"
          autoSpeak={autoSpeak}
          onSwitchDestination={(dest) => setSelectedDestination(dest)}
        />
      )}

      {selectedDestination === 'moon' && (
        <Page5MoonPath
          key="moon"
          autoSpeak={autoSpeak}
          onSwitchDestination={(dest) => setSelectedDestination(dest)}
        />
      )}

      {selectedDestination === 'deep_space' && (
        <Page6DeepSpacePath
          key="deep_space"
          autoSpeak={autoSpeak}
          onSwitchDestination={(dest) => setSelectedDestination(dest)}
        />
      )}

    
      <Page7Finale  onRestartStory={scrollToTop} />
    </main>
  );
};

export const OppyStory = LandingStory;
export default LandingStory;