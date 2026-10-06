import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGame } from '../state/GameContext';
import { getRequiredGemsForPrize } from '../data/missions';
import { GEM_PRIZE_TEXT, getGemPrizeForMission } from '../data/rewards';

interface MissionCompleteProps {
  onNext: () => void;
}

export const MissionComplete: React.FC<MissionCompleteProps> = ({ onNext }) => {
  const { state, dispatch, currentMission } = useGame();
  const prefersReducedMotion = useReducedMotion();

  const minutes = Math.floor(state.missionTimeSeconds / 60);
  const seconds = state.missionTimeSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const isLastMission = currentMission.number === 5;
  const requiredGems = getRequiredGemsForPrize(currentMission);
  const missionPrize = getGemPrizeForMission(currentMission.id);
  const earnedGemPrize = missionPrize
    ? state.earnedGemPrizeIds.includes(missionPrize.id) || state.gemsCollected >= requiredGems
    : state.gemsCollected >= requiredGems;

  return (
    <motion.div
      className="fixed inset-0 z-50 block overflow-y-auto overscroll-contain p-4 sm:p-6 select-none font-['Plus_Jakarta_Sans'] bg-[#3D1206]/75 backdrop-blur-md"
      style={{ WebkitOverflowScrolling: 'touch' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-full w-full flex flex-col items-center justify-center py-4">
        <motion.div
          className="relative w-full max-w-xl bg-[#68230D] border-2 border-amber-300/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#FFF8EB] flex flex-col items-center text-center gap-5"
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.3 } : { type: 'spring', damping: 20 }}
        >
        
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1 }}
            transition={
              prefersReducedMotion ? { duration: 0.3 } : { delay: 0.1, type: 'spring' }
            }
            className="w-16 h-16 rounded-3xl bg-amber-400/25 border-2 border-amber-300/60 flex items-center justify-center text-3xl shadow-lg"
          >
            🌟
          </motion.div>

          <div>
            <span className="text-sm uppercase font-extrabold tracking-widest text-amber-300">
              Mission {currentMission.number} Complete!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Fraunces'] text-[#FFF8EB] mt-1">
              {currentMission.title}
            </h2>
            <p className="text-base sm:text-lg text-amber-100 mt-1.5 max-w-md">
              {'Great job driving on Mars! You helped science move forward!'}
            </p>
          </div>

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 my-1">
           
            <div className="bg-[#4B1808] border border-amber-200/35 rounded-2xl p-3.5 flex flex-col items-center">
              <span className="text-xl">⏱️</span>
              <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">Time</span>
              <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                {timeFormatted}
              </span>
            </div>

           
            <div className="bg-[#4B1808] border border-amber-200/35 rounded-2xl p-3.5 flex flex-col items-center">
              <span className="text-xl">🧭</span>
              <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">
                Distance
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                {Math.round(state.distanceMeters)}m
              </span>
            </div>

           
            <div className="bg-[#4B1808] border border-amber-200/35 rounded-2xl p-3.5 flex flex-col items-center">
              <span className="text-xl">💎</span>
              <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">Gems</span>
              <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                {state.gemsCollected} / {currentMission.gemCount}
              </span>
            </div>

           
            <div className="bg-[#4B1808] border border-amber-200/35 rounded-2xl p-3.5 flex flex-col items-center">
              <span className="text-xl">📜</span>
              <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">
                Discovered
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                {state.discoveredIds.length} total
              </span>
            </div>
          </div>

          
          {earnedGemPrize && missionPrize ? (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.3 }
                  : { type: 'spring', stiffness: 180, damping: 15 }
              }
              className="w-full bg-gradient-to-r from-[#7C2B11] via-[#8E3214] to-[#7C2B11] border-2 border-amber-300/80 rounded-2xl p-4 flex items-center gap-4 text-left shadow-xl"
            >
              <div
                className="w-14 h-14 bg-gradient-to-br from-cyan-300 via-teal-400 to-amber-300 flex flex-col items-center justify-center text-[#2B0C04] shadow-md border-2 border-white shrink-0"
                style={{
                  clipPath: 'polygon(50% 0%, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%)',
                }}
              >
                <span className="text-xl leading-none">{missionPrize.icon}</span>
                <span className="text-[10px] font-black uppercase leading-tight">Prize</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                    {GEM_PRIZE_TEXT.badgeTitle} Earned!
                  </span>
                  <span>✨</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {missionPrize.name}
                </h3>
                <p className="text-base text-[#FFF8EB] leading-snug mt-1">
                  {missionPrize.kidsDescription}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full bg-[#4B1808] border border-amber-200/35 rounded-2xl p-4 flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-300/45 flex items-center justify-center text-2xl shrink-0">
                💎
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg font-bold text-amber-200">
                  {state.gemsCollected} of {currentMission.gemCount} Gems Found!
                </p>
                <p className="text-base text-[#FFF8EB] leading-snug mt-0.5">
                  {GEM_PRIZE_TEXT.kidsEncourageTryAgain}
                </p>
              </div>
            </div>
          )}

          <div className="w-full bg-[#5C1F0C]/90 border border-amber-300/45 rounded-2xl p-4 flex items-center gap-3.5 text-left">
            <span className="text-2xl shrink-0">🤖</span>
            <p className="text-base text-[#FFF8EB] leading-snug">
              <strong className="text-amber-200">Orbit says:</strong>{' '}
              {'You are a great pilot! Ready for the next mission?'}
            </p>
          </div>

         
          <motion.button
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            onClick={onNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E85D1A] to-[#F97316] text-white font-extrabold text-lg tracking-wide shadow-xl border border-amber-200/50 transition-all hover:brightness-110 cursor-pointer"
            aria-label={isLastMission ? 'View Final Summary' : 'Proceed to Next Mission'}
          >
            {isLastMission ? 'Celebrate Final Mission ➔' : 'Next Mission ➔'}
          </motion.button>

          <div className="w-full flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => dispatch({ type: 'RESTART_MISSION' })}
              className="flex-1 min-w-[130px] py-2.5 px-4 rounded-xl bg-[#7A2A10] hover:bg-[#943414] border border-amber-300/45 text-[#FFF8EB] text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>↻</span>
              <span>Restart Level</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'END_GAME' })}
              className="flex-1 min-w-[130px] py-2.5 px-4 rounded-xl bg-amber-400/90 hover:bg-amber-300 border border-amber-200 text-[#2B0C04] text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🏁</span>
              <span>End Game</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'RETURN_TO_MENU' })}
              className="flex-1 min-w-[130px] py-2.5 px-4 rounded-xl bg-[#521B0A] hover:bg-[#6E250F] border border-amber-300/35 text-amber-100 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🏠</span>
              <span>Main Menu</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
