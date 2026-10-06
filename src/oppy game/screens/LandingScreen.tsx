import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_TITLE, APP_SUBTITLE, START_LABEL, THEME_COLORS } from '../config';
import { SolarSystemScene } from '../three/SolarSystemScene';
import { useGame } from '../state/GameContext';

interface LandingScreenProps {
  onStart: () => void;
  isZooming: boolean;
  onZoomComplete: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStart,
  isZooming,
  onZoomComplete,
}) => {
  const { state, dispatch } = useGame();
  const [isTopBarOpen, setIsTopBarOpen] = React.useState(true);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleStartClick = () => {
    if (prefersReduced) {
      onZoomComplete();
    } else {
      onStart();
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none font-['Plus_Jakarta_Sans']"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
    >
      <div className="absolute inset-0 z-0">
        <SolarSystemScene
          isZooming={isZooming}
          onZoomComplete={onZoomComplete}
        />
      </div>

      
      {!isZooming && (
        <div className="pointer-events-auto absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
          {isTopBarOpen ? (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#1A0D08]/90 backdrop-blur-md border border-amber-300/40 rounded-2xl px-2.5 py-1.5 shadow-lg">
             

              <button
                onClick={() => dispatch({ type: 'TOGGLE_AMBIENT_SOUND' })}
                className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
                  state.ambientSoundEnabled
                    ? 'bg-amber-400/25 text-[#FFF8EB] border border-amber-300/60'
                    : 'bg-black/25 text-amber-200/60 border border-transparent'
                }`}
                title={
                  state.ambientSoundEnabled
                    ? 'Mute Ambient Space Sounds'
                    : 'Unmute Ambient Space Sounds'
                }
                aria-label="Toggle Ambient Space Sounds"
                aria-pressed={state.ambientSoundEnabled}
              >
                <span>{state.ambientSoundEnabled ? '🌌🔊' : '🌌🔇'}</span>
                <span className="hidden sm:inline">Space</span>
              </button>

              <button
                onClick={() => dispatch({ type: 'TOGGLE_ROVER_SOUND' })}
                className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
                  state.roverSoundEnabled
                    ? 'bg-amber-400/25 text-[#FFF8EB] border border-amber-300/60'
                    : 'bg-black/25 text-amber-200/60 border border-transparent'
                }`}
                title={
                  state.roverSoundEnabled
                    ? 'Mute Rover Driving Effects'
                    : 'Unmute Rover Driving Effects'
                }
                aria-label="Toggle Rover Driving Effects"
                aria-pressed={state.roverSoundEnabled}
              >
                <span>{state.roverSoundEnabled ? '🚜🔊' : '🚜🔇'}</span>
                <span className="hidden sm:inline">Rover SFX</span>
              </button>

              <button
                onClick={() => setIsTopBarOpen(false)}
                className="px-2 py-1 rounded-xl text-xs font-bold text-amber-200 hover:text-white hover:bg-black/25 transition-all cursor-pointer"
                title="Close top bar"
                aria-label="Close top bar"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsTopBarOpen(true)}
              className="bg-[#1A0D08]/90 backdrop-blur-md border border-amber-200/40 rounded-full px-3 py-1.5 text-xs font-bold text-[#FFF8EB] shadow-lg hover:bg-[#2E160D] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open sound and version controls"
              aria-label="Open top bar"
            >
              <span>🔊</span>
              <span>Menu</span>
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {!isZooming && (
          <motion.div
            key="hero-ui"
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25, scale: 0.96 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.h1
              className="text-4xl sm:text-6xl md:text-8xl font-black font-['Fraunces'] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
              style={{ color: THEME_COLORS.titleCream }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              {APP_TITLE}
            </motion.h1>

            <motion.p
              className="mt-2.5 sm:mt-3 max-w-lg text-sm sm:text-base md:text-lg font-bold leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] px-2"
              style={{ color: THEME_COLORS.subtitlePeach }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {APP_SUBTITLE}
            </motion.p>

            <motion.div
              className="mt-4 sm:mt-5 pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleStartClick}
                className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-white font-extrabold text-base tracking-wide shadow-xl shadow-black/60 border border-amber-200/40 transition-shadow hover:shadow-2xl focus-visible:outline-3 focus-visible:outline-amber-300 cursor-pointer"
                style={{ backgroundColor: THEME_COLORS.buttonOrange }}
                aria-label={`Start Game: ${START_LABEL}`}
              >
                {START_LABEL}
              </motion.button>
            </motion.div>

            
          </motion.div>
        )}
      </AnimatePresence>

     {isZooming && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-[#03050C]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.85, 1] }}
          transition={{ duration: 2.5, times: [0, 0.7, 0.92, 1] }}
        />
      )}
    </div>
  );
};
