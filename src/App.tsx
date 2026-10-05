import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, AppView } from './components/Navbar';
import { routeFromPathname, pathForView, destinationFromHash, pathForStory } from './routes';
import { KidsNavbar } from './components/KidsNavbar';
import { EntryScreen } from './components/EntryScreen';
import { LandingStory as OppyStory } from './landing-story';
import { Recovery } from './components/Recovery';
import { ColdOpen } from './components/ColdOpen';
import { BotDetailPanel } from './components/BotDetailPanel';
import { ExplorationConsole } from './components/ExplorationConsole';
import { RoverAnatomy } from './components/RoverAnatomy';
import { MeetMyParts } from './components/MeetMyParts';
import {AdminModeration}from './components/AdminModeration';
import Starbound from './starbound';
import { FrontierId, BotMission } from './types';
import { BOT_MISSIONS } from './data/missions';
import { AbandonedStories } from './components/AbandonedStories';
import { Mars } from './components/Mars';

const MapView = lazy(() => import('./map/MapView'));

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'kids' | 'adult'>(() => {
    const fromUrl = routeFromPathname(window.location.pathname);
    if (fromUrl) return fromUrl.mode;
    try {
      const saved = localStorage.getItem('abnf_mode');
      return saved === 'adult' ? 'adult' : 'kids';
    } catch {
      return 'kids';
    }
  });

 
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const fromUrl = routeFromPathname(window.location.pathname);
    if (fromUrl) return fromUrl.view;
    try {
      const saved = localStorage.getItem('abnf_mode');
      return saved === 'adult' ? 'coldopen' : 'entry';
    } catch {
      return 'entry';
    }
  });
  const [selectedFrontier, setSelectedFrontier] = useState<FrontierId | null>(null);
  const [selectedBot, setSelectedBot] = useState<BotMission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('abnf_mode', mode);
    } catch {
     
    }
  }, [mode]);

  useEffect(() => {
    const fromUrl = routeFromPathname(location.pathname);
    if (!fromUrl) return;
    setCurrentView((prev) => (prev === fromUrl.view ? prev : fromUrl.view));
    setMode((prev) => (prev === fromUrl.mode ? prev : fromUrl.mode));
  }, [location.pathname]);

  const navigateToView = useCallback(
    (view: AppView) => {
      setCurrentView(view);
      const path = pathForView(view);
      if (path && location.pathname !== path) {
        navigate(path);
      }
    },
    [location.pathname, navigate]
  );

  const [simulationBot, setSimulationBot] = useState<BotMission>(() => {
    return BOT_MISSIONS.find((b) => b.id === 'opportunity') || BOT_MISSIONS[0];
  });

  
  
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abnf_unlocked_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  
  const [unlockedPoiIds, setUnlockedPoiIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('abnf_unlocked_pois');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('abnf_unlocked_badges', JSON.stringify(unlockedBadges));
    } catch {
      
      
    }
  }, [unlockedBadges]);

  useEffect(() => {
    try {
      localStorage.setItem('abnf_unlocked_pois', JSON.stringify(unlockedPoiIds));
    } catch {
      
      
    }
  }, [unlockedPoiIds]);

  const handleUnlockBadge = (badgeId: string) => {
    setUnlockedBadges((prev) => {
      if (prev.includes(badgeId)) return prev;
      return [...prev, badgeId];
    });
  };

  const handleDiscoveryUnlocked = (poiId: string, botId: string) => {
    setUnlockedPoiIds((prev) => {
      if (prev.includes(poiId)) return prev;
      return [...prev, poiId];
    });

    
    const targetBot = BOT_MISSIONS.find((b) => b.id === botId);
    if (targetBot) {
      handleUnlockBadge(targetBot.badge.id);
    }
  };

  const handleOpenBot = (bot: BotMission) => {
    setSelectedBot(bot);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleLaunchSimulationForBot = (bot: BotMission) => {
    setSimulationBot(bot);
    navigateToView('simulation');
    setIsDetailOpen(false);
  };

  // Map "Read story" -> /stories#<book id>, which opens that book.
  const handleOpenStory = (storyId: string) => {
    setCurrentView('abandoned-stories');
    navigate(pathForStory(storyId));
  };

  const handleToggleMode = () => {
    if (mode === 'adult') {
      setMode('kids');
      navigateToView('oppy-story');
    } else {
      setMode('adult');
      navigateToView('coldopen');
    }
  };

  const kidsStoryHashDestination = destinationFromHash(location.hash);

  const totalBadges = BOT_MISSIONS.length;

  const isChromeless =
    currentView === 'simulation' ||
    currentView === 'rover-game' ||
    currentView === 'kids-game' ||
    currentView === 'entry';

  return (
    <div
      className={`flex min-h-screen flex-col selection:text-white ${
        mode === 'kids'
          ? 'bg-[#fbe4b8] text-[#4a2413] selection:bg-[#c1440e]/20'
          : 'bg-[#0b0d12] text-[#ece7dc] selection:bg-[#c1440e]/30'
      }`}
    >
      {!isChromeless && mode === 'kids' && (
        <KidsNavbar
          onPlay={() => navigateToView('kids-game')}
          onMeetParts={() => navigateToView('meetmyparts')}
          onGrownUp={handleToggleMode}
          onLogoClick={() => navigateToView('oppy-story')}
        />
      )}
      {!isChromeless && mode === 'adult' && (
  <Navbar
    currentView={currentView}
    onNavigate={navigateToView}
    unlockedBadgeCount={unlockedBadges.length}
    totalBadges={totalBadges}
    onSwitchToKids={handleToggleMode}
  />
)}

      <main className="flex-1">
        {currentView === 'entry' && (
          <EntryScreen
            onStart={() => {
              setMode('kids');
              navigateToView('oppy-story');
            }}
          />
        )}

        {currentView === 'coldopen' && (
  <ColdOpen
    onBegin={() => navigateToView('abandoned-stories')}
    onReturnToKids={handleToggleMode}
  />
)}

        {currentView === 'kids-game' && (
          <div className="relative">
            <Starbound />
            <button
              onClick={() => navigateToView(mode === 'adult' ? 'coldopen' : 'oppy-story')}
              className="fixed left-3 top-3 z-[60] rounded-full bg-[#fbe4b8] px-4 py-2 text-sm font-semibold text-[#4a2413] shadow"
            >
              ← Back
            </button>
          </div>
        )}

        {currentView === 'oppy-story' && (
          <OppyStory
            initialDestination={kidsStoryHashDestination}
            onComplete={() => setCurrentView('kids-home')}
          />
        )}

        {currentView === 'celestial' && <Mars />}

        {currentView === 'simulation' && (
          <ExplorationConsole onExit={() => navigateToView('coldopen')} />
        )}

       

        {currentView === 'admin' && <AdminModeration />}
        {currentView === 'anatomy' && <RoverAnatomy />}
        {currentView === 'recovery' && <Recovery />}
        {currentView === 'meetmyparts' && <MeetMyParts />}
        {currentView === 'abandoned-stories' && <AbandonedStories />}
        {currentView === 'map' && (
          <Suspense fallback={<p className="p-8 text-center text-[#9aa0a6]">Loading map…</p>}>
            <MapView onOpenStory={handleOpenStory} />
          </Suspense>
        )}
      </main>

      <BotDetailPanel
        bot={selectedBot}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onUnlockBadge={handleUnlockBadge}
        isBadgeAlreadyUnlocked={selectedBot ? unlockedBadges.includes(selectedBot.badge.id) : false}
        onEnterSimulation={handleLaunchSimulationForBot}
      />

      {!isChromeless && currentView !== 'kids-home' && (
        <footer className="border-t border-white/10 bg-[#0c101a] py-8 text-center text-xs font-sans text-[#9aa0a6]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-[#ece7dc] font-medium">Starbound</span>
              <span aria-hidden="true">·</span>
              <span>A Tribute to Brave Robot Explorers · Still Out There, Still Amazing!</span>
            </div>
            <div className="flex items-center gap-3">
              <span>NASA JPL, NSSDC & International Science Archive</span>
              <span>·</span>
              <button
                onClick={() => navigateToView('abandoned-stories')}
                className="text-amber-400 font-semibold hover:underline cursor-pointer"
              >
                Active Telemetry Console
              </button>
              <span>·</span>
               <button
          onClick={() => navigateToView('admin')}
          className="whitespace-nowrap flex items-center gap-1.5 text-[#9aa0a6] hover:text-amber-200"
        >
          <span>Admin</span>
        </button>

            </div>
          </div>
        </footer>
      )}
    </div>
  );
}