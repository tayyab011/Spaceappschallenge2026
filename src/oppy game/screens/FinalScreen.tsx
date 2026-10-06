import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGame } from '../state/GameContext';
import { THEME_COLORS } from '../config';
import {
  FINAL_REWARD_TIERS,
  MISSION_GEM_PRIZES,
  getFinalRewardTier,
} from '../data/rewards';
import { MISSIONS } from '../data/missions';

interface FinalScreenProps {
  onRestart: () => void;
}

const CONFETTI_PIECES = [
  { id: 0, left: '10%', delay: 0.1, color: '#FDE047', rotate: 25 },
  { id: 1, left: '20%', delay: 0.25, color: '#5EEAD4', rotate: -40 },
  { id: 2, left: '32%', delay: 0.05, color: '#FB923C', rotate: 15 },
  { id: 3, left: '45%', delay: 0.3, color: '#FBBF24', rotate: -25 },
  { id: 4, left: '58%', delay: 0.15, color: '#34D399', rotate: 35 },
  { id: 5, left: '70%', delay: 0.35, color: '#FDE047', rotate: -15 },
  { id: 6, left: '82%', delay: 0.2, color: '#5EEAD4', rotate: 45 },
  { id: 7, left: '90%', delay: 0.1, color: '#FB923C', rotate: -30 },
];

export const FinalScreen: React.FC<FinalScreenProps> = ({ onRestart }) => {
  const { state, dispatch } = useGame();
  const prefersReducedMotion = useReducedMotion();


  const [explorerName, setExplorerName] = useState<string>('');

  const totalMin = Math.floor(state.totalTimeSeconds / 60);
  const totalSec = state.totalTimeSeconds % 60;
  const timeFormatted = `${totalMin}m ${totalSec}s`;

  const totalPossibleGems = MISSIONS.reduce((sum, m) => sum + m.gemCount, 0);
  const finalTier = getFinalRewardTier(
    state.totalGemsCollected,
    state.discoveredIds.length
  );
  const earnedGemPrizes = MISSION_GEM_PRIZES.filter((prize) =>
    state.earnedGemPrizeIds.includes(prize.id)
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 block overflow-y-auto overscroll-contain p-3 sm:p-6 font-['Plus_Jakarta_Sans']"
      style={{
        background: `radial-gradient(circle at 50% 15%, #F27B35 0%, ${THEME_COLORS.bgRust} 55%, #94320E 100%)`,
        WebkitOverflowScrolling: 'touch',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-3xl mx-auto py-2 sm:py-6">
        <motion.div
          className="relative z-10 w-full bg-[#68230D]/95 border-2 border-amber-300/65 rounded-3xl shadow-2xl text-[#FFF8EB] flex flex-col backdrop-blur-md"
          initial={prefersReducedMotion ? { opacity: 0 } : { y: 16, opacity: 0, scale: 0.98 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          
          <div className="px-4 sm:px-6 py-3 bg-[#521B09]/95 border-b border-amber-300/40 rounded-t-3xl flex flex-wrap items-center justify-between gap-2 z-30">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <span>🌟</span>
              <span>Mission Complete · Final Summary</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onRestart}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E85D1A] to-[#F97316] hover:brightness-110 text-white text-xs sm:text-sm font-extrabold shadow border border-amber-200/50 transition-all cursor-pointer flex items-center gap-1.5"
                aria-label="Restart Game"
              >
                <span>↻</span>
                <span>Restart</span>
              </button>
              <button
                onClick={() => dispatch({ type: 'RETURN_TO_MENU' })}
                className="px-3.5 py-1.5 rounded-xl bg-[#7A2A10] hover:bg-[#943414] text-[#FFF8EB] text-xs sm:text-sm font-extrabold shadow border border-amber-300/45 transition-all cursor-pointer flex items-center gap-1.5"
                aria-label="Main Menu"
              >
                <span>🏠</span>
                <span>Main Menu</span>
              </button>
            </div>
          </div>

         
          {!prefersReducedMotion && (
            <div className="pointer-events-none absolute inset-x-0 top-12 h-40 overflow-hidden z-20">
              {CONFETTI_PIECES.map((piece) => (
                <motion.div
                  key={piece.id}
                  initial={{ y: -20, opacity: 0, rotate: 0 }}
                  animate={{
                    y: [0, 130],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, piece.rotate * 4],
                  }}
                  transition={{
                    duration: 3.2,
                    delay: piece.delay,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  style={{ left: piece.left, backgroundColor: piece.color }}
                  className="absolute top-0 w-3 h-3 rounded-sm shadow-sm"
                />
              ))}
            </div>
          )}

         
          <div className="p-5 sm:p-8 flex flex-col items-center text-center gap-5">
           
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { scale: 0, rotate: -18, opacity: 0 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { scale: 1, rotate: 0, opacity: 1 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0.4 }
                    : { type: 'spring', stiffness: 180, damping: 13, delay: 0.1 }
                }
                className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-100 p-1.5 shadow-2xl"
              >
                <div className="w-full h-full rounded-full bg-[#6E250E] border-2 border-yellow-200 flex flex-col items-center justify-center">
                  <span className="text-4xl leading-none" role="img" aria-label="Golden Trophy">
                    🏆
                  </span>
                </div>

                
                {!prefersReducedMotion && (
                  <>
                    <motion.span
                      animate={{ scale: [0.8, 1.3, 0.8], rotate: [0, 20, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="absolute -top-2 -right-2 text-2xl"
                    >
                      ✨
                    </motion.span>
                    <motion.span
                      animate={{ scale: [1, 1.25, 1], rotate: [0, -20, 0] }}
                      transition={{ repeat: Infinity, duration: 2.1, delay: 0.3 }}
                      className="absolute -bottom-1 -left-2 text-2xl"
                    >
                      🌟
                    </motion.span>
                  </>
                )}
              </motion.div>

              
              <div className="mt-3 flex flex-col items-center gap-1">
                <span className="px-4 py-1 rounded-full bg-amber-400/30 border border-amber-300 text-amber-100 text-base sm:text-lg font-extrabold uppercase tracking-wider">
                  {finalTier.tierName} ({finalTier.shortLabel})
                </span>
                <h1 className="text-3xl sm:text-4xl font-black font-['Fraunces'] text-[#FFF8EB] mt-1">
                  Rest Well, Oppy
                </h1>
                <p className="text-base sm:text-lg text-amber-200 italic font-serif">
                  "My battery is low and it's getting dark."
                </p>
              </div>
            </div>

           
            <div className="w-full bg-[#471708]/90 border border-amber-300/35 rounded-2xl p-4 flex flex-col gap-3 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {FINAL_REWARD_TIERS.map((tier) => {
                  const isCurrentTier = tier.id === finalTier.id;
                  return (
                    <div
                      key={tier.id}
                      className={`rounded-xl p-3 border text-center transition-all ${
                        isCurrentTier
                          ? 'bg-gradient-to-b from-amber-400/35 to-[#6E250E] border-2 border-amber-300 shadow-lg'
                          : 'bg-[#571D0B]/70 border-amber-200/25 opacity-85'
                      }`}
                    >
                      <div className="text-2xl">{tier.badgeIcon}</div>
                      <div className="text-base sm:text-lg font-extrabold text-white mt-1">
                        {tier.tierName}
                      </div>
                      <div className="text-sm font-semibold text-amber-200">
                        {tier.shortLabel}
                      </div>
                      {isCurrentTier && (
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-300 text-[#2B0C04] text-xs font-black uppercase">
                          Earned!
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="pt-1 text-center">
                <p className="text-lg sm:text-xl font-bold text-amber-200">
                  {finalTier.prizeName}
                </p>
                <p className="text-base sm:text-lg text-[#FFF8EB] mt-1 leading-relaxed">
                  {finalTier.kidsDescription}
                </p>
              </div>
            </div>

           
            <div className="w-full bg-[#6A240E]/90 border border-amber-300/45 rounded-2xl p-4 sm:p-5 text-left flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between border-b border-amber-200/25 pb-2">
                <h2 className="text-xl sm:text-2xl font-bold font-['Fraunces'] text-amber-200 flex items-center gap-2">
                  <span>🏆</span>
                  <span>Prize Shelf</span>
                </h2>
                <span className="text-sm sm:text-base font-bold text-amber-100">
                  {earnedGemPrizes.length + 1}{' '}
                  {earnedGemPrizes.length + 1 === 1 ? 'Prize' : 'Prizes'} Earned
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               
                <div className="bg-gradient-to-r from-[#7D2B11] to-[#63210D] border-2 border-amber-300/80 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/30 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
                    {finalTier.badgeIcon}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                      Final Prize · {finalTier.shortLabel}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {finalTier.prizeName}
                    </h3>
                    <p className="text-base text-amber-100 leading-snug mt-0.5">
                      {finalTier.kidsEncouragement}
                    </p>
                  </div>
                </div>

                
                {earnedGemPrizes.map((prize) => (
                  <div
                    key={prize.id}
                    className="bg-[#4D1909] border border-cyan-300/50 rounded-xl p-3.5 flex items-start gap-3"
                  >
                    <div
                      className="w-12 h-12 bg-gradient-to-br from-cyan-300 via-teal-400 to-amber-300 flex items-center justify-center text-xl text-[#2B0C04] shrink-0 border border-white"
                      style={{
                        clipPath:
                          'polygon(50% 0%, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%)',
                      }}
                    >
                      {prize.icon}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                        Mission {prize.missionNumber} Gem Prize
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {prize.name}
                      </h3>
                      <p className="text-base text-amber-100 leading-snug mt-0.5">
                        {prize.kidsDescription}
                      </p>
                    </div>
                  </div>
                ))}

                {earnedGemPrizes.length === 0 && (
                  <div className="bg-[#4D1909]/85 border border-amber-200/30 rounded-xl p-3.5 flex items-center gap-3">
                    <span className="text-2xl">💎</span>
                    <p className="text-base text-amber-100 leading-snug">
                      Find more gems next time! Win shiny gem prizes!'
                    </p>
                  </div>
                )}
              </div>
            </div>

          
            <div className="w-full bg-gradient-to-b from-[#732710] to-[#4E1909] border-4 border-double border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col items-center gap-3.5 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm uppercase font-extrabold tracking-widest text-amber-300">
                  Official Mars Exploration Certificate
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-['Fraunces'] text-white mt-0.5">
                  Oppy Explorer
                </h2>
                <span className="mt-1 px-3.5 py-0.5 rounded-full bg-amber-300 text-[#2B0C04] text-sm sm:text-base font-extrabold">
                  Rank: {finalTier.tierName}
                </span>
              </div>

              
              <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2">
                <label
                  htmlFor="explorer-name-input"
                  className="text-sm sm:text-base font-bold text-amber-100 whitespace-nowrap"
                >
                  Explorer Name:
                </label>
                <input
                  id="explorer-name-input"
                  type="text"
                  maxLength={28}
                  value={explorerName}
                  onChange={(e) => setExplorerName(e.target.value)}
                  placeholder="Type your first name or nickname (optional)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#381105] border border-amber-200/50 text-white text-base font-semibold placeholder:text-amber-200/50 focus:outline-none focus:border-amber-300"
                />
              </div>

              <p className="text-base sm:text-lg text-[#FFF8EB] font-medium">
                                  <>
                    Great job,{' '}
                    <strong className="text-amber-200 underline decoration-amber-300/70">
                      {explorerName.trim() || 'Mars Rover Pilot'}
                    </strong>
                    ! You found our friend Oppy!
                  </>
              </p>

              
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#3E1306] border border-amber-200/35 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-xl">⏱️</span>
                  <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">
                    Time
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                    {timeFormatted}
                  </span>
                </div>

                <div className="bg-[#3E1306] border border-amber-200/35 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-xl">🧭</span>
                  <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">
                    Distance
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                    {Math.round(state.distanceMeters)}m
                  </span>
                </div>

                <div className="bg-[#3E1306] border border-amber-200/35 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-xl">💎</span>
                  <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">
                    Gems
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                    {state.totalGemsCollected} / {totalPossibleGems}
                  </span>
                </div>

                <div className="bg-[#3E1306] border border-amber-200/35 rounded-xl p-3 flex flex-col items-center">
                  <span className="text-xl">📜</span>
                  <span className="text-sm sm:text-base font-medium text-amber-200 mt-1">
                    Discoveries
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5">
                    {state.discoveredIds.length} / 6
                  </span>
                </div>
              </div>
            </div>

            
            <div className="w-full bg-[#66220D]/85 border border-amber-200/35 rounded-2xl p-4 sm:p-5 text-left text-base sm:text-lg text-[#FFF8EB] leading-relaxed flex flex-col gap-2 shrink-0">
                              <>
                  <p>Oppy landed in 2004. It drove for fifteen years!</p>
                  <p>Oppy found clues of water. A big dust storm came.</p>
                  <p>Now Oppy rests on Mars. Goodnight, brave little rover!</p>
                </>
              <div className="pt-2 border-t border-amber-200/25 flex items-center justify-between text-sm text-amber-200">
                <span>NASA Mars Exploration Rover Mission</span>
                <span className="text-amber-300 font-bold">2004 — 2018</span>
              </div>
            </div>
          </div>

         
          <div className="sticky bottom-0 z-30 rounded-b-3xl px-5 sm:px-8 py-4 bg-[#4A1808]/95 backdrop-blur-md border-t border-amber-300/45 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              onClick={onRestart}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E85D1A] to-[#F97316] text-white font-extrabold text-base sm:text-lg shadow-xl border border-amber-200/50 transition-all hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
              aria-label="Play Again / Restart Game"
            >
              <span>↻</span>
              <span>Play Again (Restart)</span>
            </motion.button>

            <motion.button
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              onClick={() => dispatch({ type: 'RETURN_TO_MENU' })}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#7A2A10] hover:bg-[#943414] text-[#FFF8EB] font-extrabold text-base sm:text-lg shadow-lg border border-amber-300/45 transition-all cursor-pointer flex items-center justify-center gap-2"
              aria-label="Return to Main Menu"
            >
              <span>🏠</span>
              <span>Return to Main Menu</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
