
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { gameReducer, initialGameState, GameState, GameAction } from './gameReducer';
import { MISSIONS } from '../data/missions';
import { solarAudio } from '../three/solarAudio';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  currentMission: (typeof MISSIONS)[number];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    if (state.ambientSoundEnabled) {
      solarAudio.startAmbientSpace();
      solarAudio.startBackgroundMusic();
    } else {
      solarAudio.stopAmbientSpace();
      solarAudio.stopBackgroundMusic();
    }
  }, [state.ambientSoundEnabled, state.screen]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (state.ambientSoundEnabled) {
        solarAudio.startAmbientSpace();
        solarAudio.startBackgroundMusic();
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [state.ambientSoundEnabled]);

  useEffect(() => {
    if (state.screen !== 'playing') {
      solarAudio.stopRoverDrive();
      solarAudio.stopCharging();
    }
  }, [state.screen]);

  useEffect(() => {
    return () => {
      solarAudio.stopAmbientSpace();
      solarAudio.stopBackgroundMusic();
      solarAudio.stopRoverDrive();
      solarAudio.stopCharging();
    };
  }, []);

  useEffect(() => {
    if (state.screen !== 'playing') return;

    const timer = setInterval(() => {
      dispatch({ type: 'TICK_TIME' });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.screen]);

  useEffect(() => {
    if (state.screen !== 'playing') return;

    const hintTimer = setTimeout(() => {
      const mission = MISSIONS[state.currentMissionIndex];

      if (mission) {
        dispatch({ type: 'SHOW_HINT', message: mission.hint });
      }
    }, 18000);

    return () => clearTimeout(hintTimer);
  }, [state.screen, state.currentMissionIndex]);

  const currentMission = MISSIONS[state.currentMissionIndex] || MISSIONS[0];

  return (
    <GameContext.Provider value={{ state, dispatch, currentMission }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
};

