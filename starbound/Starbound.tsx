import React, { useState, Suspense } from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { FontLoader } from './ui/FontLoader';
import { LandingScreen } from './screens/LandingScreen';
import { MissionIntro } from './screens/MissionIntro';
import { MissionComplete } from './screens/MissionComplete';
import { FinalScreen } from './screens/FinalScreen';
import { MarsGameScene } from './three/MarsGameScene';
import { Hud } from './ui/Hud';
import { TouchControls, TouchInputState } from './ui/TouchControls';
import { DiscoveryCard } from './ui/DiscoveryCard';
import { DiscoveryJournal } from './ui/DiscoveryJournal';
import { THEME_COLORS } from './config';


const LoadingScreen: React.FC = () => (
  <div
    className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none font-['Plus_Jakarta_Sans']"
    style={{ backgroundColor: THEME_COLORS.bgRust }}
  >
    <div className="w-12 h-12 border-4 border-[#C44810] border-t-[#F2D9A4] rounded-full animate-spin mb-4" />
    <h2 className="text-xl font-bold font-['Fraunces'] text-[#EFE7D8]">
      Preparing Mars Orbit...
    </h2>
    <p className="text-xs text-[#F2D9A4]/70 mt-1">
      Polishing solar panels and calibrating rover cameras
    </p>
  </div>
);

const IDLE_TOUCH_INPUT: TouchInputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};


const StarboundGameContent: React.FC = () => {
  const { state, dispatch, currentMission } = useGame();


  const [touchInput, setTouchInput] = useState<TouchInputState>(IDLE_TOUCH_INPUT);

  const handleTouchInput = (partial: Partial<TouchInputState>) => {
    setTouchInput((prev) => ({ ...prev, ...partial }));
  };

  const handleRockRover = (dir: 'forward' | 'backward') => {
    dispatch({ type: 'ROCK_ROVER', direction: dir });
  };

  const hasLanded = state.screen !== 'landing' && state.screen !== 'zooming';

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
    >
      <Suspense fallback={<LoadingScreen />}>
       
        {(state.screen === 'landing' || state.screen === 'zooming') && (
          <LandingScreen
            isZooming={state.screen === 'zooming'}
            onStart={() => dispatch({ type: 'START_GAME' })}
            onZoomComplete={() => dispatch({ type: 'FINISH_ZOOM' })}
          />
        )}

      
        {hasLanded && (
          <div className="absolute inset-0 z-0">
            <MarsGameScene
              touchInput={state.screen === 'playing' ? touchInput : IDLE_TOUCH_INPUT}
              onNearDiscoveryChange={(targetId) => {
                dispatch({ type: 'SET_NEAR_SCAN_TARGET', targetId });
               
                if (
                  state.screen === 'playing' &&
                  targetId &&
                  !state.discoveredIds.includes(targetId)
                ) {
                  dispatch({ type: 'TRIGGER_SCAN', discoveryId: targetId });
                }
              }}
            />
          </div>
        )}

       
        {state.screen === 'intro' && (
          <MissionIntro
            mission={currentMission}
            onStart={() => dispatch({ type: 'START_MISSION' })}
          />
        )}

      
        {state.screen === 'playing' && (
          <>
           
            <Hud />

           
            <TouchControls
              onInput={handleTouchInput}
              isStuckMission={currentMission.type === 'stuck'}
              onRock={handleRockRover}
            />

           
            {state.activeDiscovery && (
              <DiscoveryCard
                discovery={state.activeDiscovery}
                onClose={() => dispatch({ type: 'CLOSE_DISCOVERY' })}
              />
            )}

           
            {state.isJournalOpen && (
              <DiscoveryJournal
                discoveredIds={state.discoveredIds}
                onClose={() => dispatch({ type: 'CLOSE_JOURNAL' })}
              />
            )}
          </>
        )}

       
        {state.screen === 'complete' && (
          <MissionComplete
            onNext={() => dispatch({ type: 'NEXT_MISSION' })}
          />
        )}

        
        {state.screen === 'final' && (
          <FinalScreen
            onRestart={() => dispatch({ type: 'RESTART_GAME' })}
          />
        )}
      </Suspense>
    </div>
  );
};

export const Starbound: React.FC = () => {
  return (
    <div
      className="w-full h-[100dvh] overflow-hidden"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
    >
      <FontLoader />
      <GameProvider>
        <StarboundGameContent />
      </GameProvider>
    </div>
  );
};

export default Starbound;
