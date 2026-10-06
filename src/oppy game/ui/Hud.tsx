import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useGame } from '../state/GameContext';
import { DISCOVERIES } from '../data/discoveries';
import { getRequiredGemsForPrize, oppyPosition as defaultOppyPosition } from '../data/missions';
import { GEM_PRIZE_TEXT, getGemPrizeForMission } from '../data/rewards';

export const Hud: React.FC = () => {
  const { state, dispatch, currentMission } = useGame();
  const prefersReducedMotion = useReducedMotion();
  const [isTopBarOpen, setIsTopBarOpen] = React.useState(true);

  const minutes = Math.floor(state.missionTimeSeconds / 60);
  const seconds = state.missionTimeSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const totalDiscoveriesCount = DISCOVERIES.length;
  const foundDiscoveriesCount = state.discoveredIds.length;
  const currentMissionFoundCount = currentMission.discoveryIds.filter((id) =>
    state.discoveredIds.includes(id)
  ).length;

 
  const requiredGemsForPrize = getRequiredGemsForPrize(currentMission);
  const gemsRemainingForPrize = Math.max(0, requiredGemsForPrize - state.gemsCollected);
  const gemPrizeProgressPct = Math.min(
    100,
    Math.round((state.gemsCollected / requiredGemsForPrize) * 100)
  );
  const missionGemPrize = getGemPrizeForMission(currentMission.id);
  const hasEarnedMissionGemPrize = missionGemPrize
    ? state.earnedGemPrizeIds.includes(missionGemPrize.id)
    : state.gemsCollected >= requiredGemsForPrize;

 
  useEffect(() => {
    if (!state.showGemPrizeCelebration) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_GEM_PRIZE_CELEBRATION' });
    }, 3500);
    return () => clearTimeout(timer);
  }, [state.showGemPrizeCelebration, dispatch]);

  // Auto-dismiss Orbit hint bubble after 3.8s so it never stays stuck on screen
  useEffect(() => {
    if (!state.showOrbitHint) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_HINT' });
    }, 3800);
    return () => clearTimeout(timer);
  }, [state.showOrbitHint, state.orbitHintText, dispatch]);

  // Check if mission goals are satisfied
  let isObjectiveComplete = false;
  if (currentMission.type === 'drive') {
    isObjectiveComplete =
      Boolean(currentMission.checkpoints) &&
      currentMission.checkpoints!.every((cp) => state.passedCheckpoints.includes(cp.id));
  } else if (currentMission.type === 'scan') {
    isObjectiveComplete = currentMission.discoveryIds.every((id) =>
      state.discoveredIds.includes(id)
    );
  } else if (currentMission.type === 'stuck') {
    isObjectiveComplete = state.isFreedFromSand;
  } else if (currentMission.type === 'solar') {
    isObjectiveComplete = state.batteryLevel >= 95;
  } else if (currentMission.type === 'tracks') {
    isObjectiveComplete = state.discoveredIds.includes('oppy-perseverance-valley');
  }


  const oppyCoords = currentMission.oppyPosition ?? defaultOppyPosition;
  const distToOppy = Math.max(
    0,
    Math.round(
      Math.hypot(
        state.roverPosition[0] - oppyCoords[0],
        state.roverPosition[2] - oppyCoords[2]
      )
    )
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-3 sm:p-4 select-none font-['Plus_Jakarta_Sans']">
     
      <motion.div
        initial={{ y: prefersReducedMotion ? 0 : -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-2 max-w-6xl mx-auto w-full"
      >
        {isTopBarOpen ? (
          
          <div className="pointer-events-auto bg-[#68230D]/90 backdrop-blur-md border border-amber-300/45 rounded-2xl px-3.5 py-2 shadow-xl flex flex-wrap items-center justify-between gap-2 text-[#FFF8EB]">
            
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-sm shadow-amber-300" />
              <span className="font-extrabold text-sm md:text-base uppercase tracking-wider text-amber-200">
                M{currentMission.number}
              </span>
              <span className="text-amber-200/40 font-light">|</span>
              <span className="text-base font-bold text-[#FFF8EB] max-w-[140px] sm:max-w-[200px] truncate">
                {currentMission.title}
              </span>
            </div>

           
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3.5 text-base font-medium">
            
              <div className="flex items-center gap-1" title="Time passed">
                <span className="text-amber-300 text-sm">⏱️</span>
                <span className="font-mono tabular-nums text-white font-bold text-base">
                  {timeFormatted}
                </span>
              </div>

            
              <div className="flex items-center gap-1" title="Distance traveled">
                <span className="text-amber-300 text-sm">🧭</span>
                <span className="tabular-nums font-bold text-white text-base">
                  {Math.round(state.distanceMeters)}m
                </span>
              </div>

             
              <div
                className="flex items-center gap-2 bg-[#4A1808]/90 border border-cyan-300/45 rounded-xl px-2.5 py-1"
                title="Martian Gems collected toward Gem Prize"
              >
                <span className="text-cyan-300 text-sm">💎</span>
                <span className="tabular-nums font-bold text-white text-sm md:text-base whitespace-nowrap">
                  {state.gemsCollected} / {currentMission.gemCount} gems
                </span>
                <span className="hidden xl:inline text-xs md:text-sm font-semibold text-amber-200 whitespace-nowrap">
                  {gemsRemainingForPrize > 0
                    ? `- ${gemsRemainingForPrize} more for a prize!`
                    : '- Prize unlocked! ✨'}
                </span>

             
                <div
                  className="w-14 sm:w-18 h-2 bg-black/50 rounded-full overflow-hidden border border-cyan-300/45 p-0.5 shrink-0"
                  role="progressbar"
                  aria-valuenow={gemPrizeProgressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progress toward mission gem prize"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      hasEarnedMissionGemPrize
                        ? 'bg-gradient-to-r from-amber-300 via-yellow-300 to-emerald-400'
                        : 'bg-gradient-to-r from-cyan-400 to-teal-300'
                    }`}
                    style={{ width: `${gemPrizeProgressPct}%` }}
                  />
                </div>
              </div>

             
              <div className="hidden lg:flex items-center gap-1" title="Discoveries found">
                <span className="text-amber-300 text-sm">📜</span>
                <span className="font-bold text-white text-sm md:text-base">
                  {foundDiscoveriesCount}/{totalDiscoveriesCount}
                </span>
              </div>
            </div>

           
            <div className="flex flex-wrap items-center gap-1.5">

           
              <button
                onClick={() => dispatch({ type: 'TOGGLE_AMBIENT_SOUND' })}
                className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 border cursor-pointer ${
                  state.ambientSoundEnabled
                    ? 'bg-amber-400/25 border-amber-300/70 text-amber-100 hover:bg-amber-400/35'
                    : 'bg-[#4A1808]/80 border-amber-200/25 text-amber-200/60 hover:bg-[#5E1F0B]'
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
                className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 border cursor-pointer ${
                  state.roverSoundEnabled
                    ? 'bg-amber-400/25 border-amber-300/70 text-amber-100 hover:bg-amber-400/35'
                    : 'bg-[#4A1808]/80 border-amber-200/25 text-amber-200/60 hover:bg-[#5E1F0B]'
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
                onClick={() => dispatch({ type: 'TOGGLE_CAMERA_MODE' })}
                className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 border cursor-pointer ${
                  state.cameraMode === 'fpv'
                    ? 'bg-amber-400/30 border-amber-300 text-amber-100 hover:bg-amber-400/40'
                    : 'bg-[#822E13] border-amber-200/40 text-[#FFF8EB] hover:bg-[#9C3818]'
                }`}
                title="Switch Camera View (Shortcut: 'C')"
                aria-label="Toggle Camera View"
              >
                <span>{state.cameraMode === 'fpv' ? '📷' : '🚁'}</span>
                <span className="font-mono">{state.cameraMode === 'fpv' ? 'FPV' : '3RD'}</span>
              </button>

              <button
                onClick={() => dispatch({ type: 'OPEN_JOURNAL' })}
                className="px-2.5 py-1.5 rounded-xl bg-[#822E13] hover:bg-[#9C3818] border border-amber-200/40 text-[#FFF8EB] text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                aria-label="Open Mars Field Journal"
              >
                <span>📖</span>
                <span className="hidden sm:inline">Journal</span>
                {foundDiscoveriesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-300 text-[#2B0C04] text-[11px] flex items-center justify-center font-extrabold">
                    {foundDiscoveriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => dispatch({ type: 'RESTART_MISSION' })}
                className="px-2.5 py-1.5 rounded-xl bg-[#822E13] hover:bg-[#9C3818] border border-amber-200/40 text-[#FFF8EB] text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Restart current mission"
                aria-label="Restart Mission"
              >
                <span>↻</span>
                <span>Restart</span>
              </button>

              <button
                onClick={() => dispatch({ type: 'END_GAME' })}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/85 hover:bg-amber-400 border border-amber-200/60 text-[#2B0C04] text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Finish and view End Game Rewards"
                aria-label="End Game"
              >
                <span>🏁</span>
                <span>End Game</span>
              </button>

              <button
                onClick={() => dispatch({ type: 'RETURN_TO_MENU' })}
                className="px-2.5 py-1.5 rounded-xl bg-[#521B0A] hover:bg-[#6E250F] border border-amber-200/35 text-amber-100 text-xs sm:text-sm font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Return to Main Menu"
                aria-label="Main Menu"
              >
                <span>🏠</span>
                <span className="hidden md:inline">Main Menu</span>
              </button>

              
              <button
                onClick={() => setIsTopBarOpen(false)}
                className="px-2.5 py-1.5 rounded-xl bg-[#3D1306] hover:bg-[#521B0A] border border-amber-200/35 text-amber-200 hover:text-white text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Close top bar"
                aria-label="Close top bar"
              >
                <span>✕</span>
              </button>
            </div>
          </div>
        ) : (
          
          <div className="self-end pointer-events-auto">
            <button
              onClick={() => setIsTopBarOpen(true)}
              className="bg-[#68230D]/90 backdrop-blur-md border border-amber-300/50 rounded-full px-3.5 py-1.5 shadow-lg text-xs sm:text-sm font-bold text-[#FFF8EB] hover:bg-[#7D2B10] transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              title="Show top bar"
              aria-label="Open top bar"
            >
              <span>M{currentMission.number}</span>
              <span>·</span>
              <span>💎 {state.gemsCollected}/{currentMission.gemCount}</span>
              <span className="text-amber-300">▼ Show Bar</span>
            </button>
          </div>
        )}

        
        {!isObjectiveComplete && (
          <div className="self-center flex flex-col items-center gap-1.5 max-w-xl w-full">
            <div className="bg-[#5C1F0C]/90 backdrop-blur-sm border border-amber-300/40 rounded-full px-4 py-1 text-sm sm:text-base text-[#FFF8EB] flex items-center gap-2 shadow-md text-center">
              <span className="text-amber-300 shrink-0">🎯</span>
              <span className="font-medium">
                {currentMission.goal}
                {currentMission.type === 'scan'
                  ? ` (${currentMissionFoundCount}/${currentMission.discoveryIds.length} scanned)`
                  : ''}
                {currentMission.type === 'tracks' && distToOppy > 6
                  ? ` (~${distToOppy}m ahead)`
                  : ''}
              </span>
            </div>

            
            {currentMission.type === 'stuck' && !state.isFreedFromSand && (
              <div className="pointer-events-auto bg-[#68230D]/95 border border-amber-400/50 rounded-full px-4 py-1.5 shadow-md flex items-center gap-3 text-sm">
                <span className="font-bold text-amber-200 whitespace-nowrap">
                  🚜 Rock {state.rockCounter}/6
                </span>
                <div className="w-32 h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-amber-200/40">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full"
                    style={{ width: `${state.wheelSlip}%` }}
                  />
                </div>
              </div>
            )}

           
            {currentMission.type === 'solar' &&
              (() => {
                const distToSunbeam = Math.max(
                  0,
                  Math.round(Math.hypot(state.roverPosition[0] + 16, state.roverPosition[2] + 18))
                );
                return (
                  <div className="pointer-events-auto bg-[#68230D]/95 border border-yellow-300/60 rounded-full px-4 py-1.5 shadow-md flex items-center gap-3 text-sm">
                    <span className="font-bold text-amber-200 whitespace-nowrap">
                      {state.isChargingSolar ? '⚡ Charging' : '☀️ Solar'}: {state.batteryLevel}%
                    </span>
                    <div className="w-28 sm:w-36 h-2.5 bg-black/50 rounded-full overflow-hidden p-0.5 border border-amber-200/40">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          state.isChargingSolar
                            ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-400'
                            : 'bg-gradient-to-r from-orange-400 to-amber-300'
                        }`}
                        style={{ width: `${state.batteryLevel}%` }}
                      />
                    </div>
                    {!state.isChargingSolar && (
                      <span className="text-xs sm:text-sm text-amber-100 whitespace-nowrap">
                        ~{distToSunbeam}m to beam
                      </span>
                    )}
                  </div>
                );
              })()}
          </div>
        )}

        
        <AnimatePresence>
          {state.showGemPrizeCelebration && missionGemPrize && (
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { scale: 0.5, opacity: 0, y: -12 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { scale: 0.85, opacity: 0, y: -8 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.25 }
                  : { type: 'spring', stiffness: 220, damping: 14 }
              }
              className="pointer-events-auto self-center bg-[#68230D]/95 border-2 border-amber-300 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-3 max-w-md"
              role="status"
              aria-live="polite"
            >
              <div className="relative flex items-center justify-center shrink-0">
                {!prefersReducedMotion && (
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className="absolute -top-1.5 -right-1.5 text-sm"
                  >
                    ✨
                  </motion.span>
                )}
                <div
                  className="w-11 h-11 bg-gradient-to-br from-cyan-300 via-teal-400 to-amber-300 flex flex-col items-center justify-center text-[#2B0C04] shadow border border-white"
                  style={{
                    clipPath:
                      'polygon(50% 0%, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%)',
                  }}
                >
                  <span className="text-base leading-none">{missionGemPrize.icon}</span>
                  <span className="text-[9px] font-black uppercase leading-none mt-0.5">
                    Prize
                  </span>
                </div>
              </div>

              <div className="text-left flex-1">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  {GEM_PRIZE_TEXT.badgeTitle} Unlocked! — {missionGemPrize.name}
                </div>
                <p className="text-base text-[#FFF8EB] leading-snug">
                  Orbit: "{GEM_PRIZE_TEXT.orbitCelebration}"
                </p>
              </div>

              <button
                onClick={() => dispatch({ type: 'DISMISS_GEM_PRIZE_CELEBRATION' })}
                className="text-xs text-amber-200 hover:text-white p-1 cursor-pointer"
                aria-label="Close prize celebration"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col items-center gap-2 w-full">
       
        <AnimatePresence>
          {state.showOrbitHint && !state.showGemPrizeCelebration && !isObjectiveComplete && (
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              className="pointer-events-auto self-center sm:self-end sm:mr-2 mb-16 sm:mb-2 max-w-sm bg-[#68230D]/95 border border-amber-300/60 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5 backdrop-blur-md"
            >
              <span className="text-xl shrink-0">🤖</span>
              <p className="text-base text-[#FFF8EB] font-medium leading-snug flex-1">
                {state.orbitHintText || currentMission.hint}
              </p>
              <button
                onClick={() => dispatch({ type: 'DISMISS_HINT' })}
                className="text-xs text-amber-200 hover:text-white p-1 cursor-pointer"
                aria-label="Dismiss hint"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      
        {isObjectiveComplete && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.92, y: 10, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, y: 0, opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.25 }
                : { type: 'spring', damping: 18, stiffness: 160 }
            }
            className="pointer-events-auto mb-2 z-30"
          >
            <motion.button
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              onClick={() => dispatch({ type: 'COMPLETE_MISSION' })}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white text-lg md:text-xl font-semibold tracking-wide shadow-xl border-2 border-emerald-200 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Finish Mission"
            >
              <span>🚀</span>
              <span>Finish Mission</span>
            </motion.button>
          </motion.div>
        )}
      </div>

    
      {state.cameraMode === 'fpv' && (
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between p-3 sm:p-5 opacity-40">
          <div className="flex justify-between items-start">
            <div className="w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-l-2 border-amber-300/60" />
            <div className="w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-r-2 border-amber-300/60" />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-l-2 border-amber-300/60" />
            <div className="w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-r-2 border-amber-300/60" />
          </div>
        </div>
      )}
    </div>
  );
};
