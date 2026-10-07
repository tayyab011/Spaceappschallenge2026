import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission } from '../data/missions';
import { THEME_COLORS } from '../config';

interface MissionIntroProps {
  mission: Mission;
  onStart: () => void;
}

export const MissionIntro: React.FC<MissionIntroProps> = ({ mission, onStart }) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [isGo, setIsGo] = useState<boolean>(false);

  useEffect(() => {
    const timer3 = setTimeout(() => setCountdown(2), 1000);
    const timer2 = setTimeout(() => setCountdown(1), 2000);
    const timer1 = setTimeout(() => {
      setIsGo(true);
    }, 3000);
    const timerGo = setTimeout(() => {
      onStart();
    }, 3600);

    return () => {
      clearTimeout(timer3);
      clearTimeout(timer2);
      clearTimeout(timer1);
      clearTimeout(timerGo);
    };
  }, [onStart]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none font-['Plus_Jakarta_Sans']"
      style={{ backgroundColor: THEME_COLORS.bgRust }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C44810]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center text-[#EFE7D8]">
       
        <motion.span
          className="text-xs uppercase font-extrabold tracking-widest px-4 py-1.5 rounded-full bg-[#591D0E] text-amber-300 border border-amber-400/40 shadow-md mb-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Mission {mission.number} of 5
        </motion.span>

       
        <motion.h1
          className="text-3xl sm:text-5xl font-black font-['Fraunces'] text-[#EFE7D8] drop-shadow-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {mission.title}
        </motion.h1>

       
        <motion.p
          className="mt-3 text-base sm:text-lg text-[#F2D9A4] max-w-md font-medium leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {mission.goal}
        </motion.p>

       
        <motion.div
          className="relative my-6 w-full max-w-sm h-36 bg-[#4A180B]/60 rounded-3xl border border-[#F2D9A4]/25 p-4 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          
          <svg className="w-full h-full" viewBox="0 0 320 100" fill="none">
           
            <path
              d="M10 85 Q 80 40, 160 85 T 310 80"
              stroke="rgba(242, 217, 164, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            
            <motion.path
              d="M25 80 Q 70 30, 140 70 T 260 45"
              stroke="#FBBF24"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
            
            <circle cx="260" cy="45" r="7" fill="#FBBF24" />
          </svg>

         
          <motion.div
            className="absolute bottom-3 right-4 flex items-center gap-2 bg-[#5A1F10] border border-amber-300/40 px-3 py-1.5 rounded-2xl shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-2xl"
            >
              👋
            </motion.span>
            <div className="text-left">
              <span className="text-[10px] font-bold text-amber-200 block">Orbit</span>
              <span className="text-[11px] text-[#F2D9A4]">Let's explore!</span>
            </div>
          </motion.div>
        </motion.div>

       
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isGo ? (
              <motion.div
                key={countdown}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl font-black font-['Fraunces'] text-amber-300 drop-shadow"
              >
                {countdown}
              </motion.div>
            ) : (
              <motion.div
                key="go"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-4xl sm:text-5xl font-black font-['Fraunces'] text-emerald-400 drop-shadow"
              >
                GO! 🚀
              </motion.div>
            )}
          </AnimatePresence>
        </div>

     
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="mt-4 px-6 py-2 rounded-full bg-[#591D0E] hover:bg-[#7D2C17] text-[#F2D9A4] text-xs font-bold border border-[#F2D9A4]/30 shadow-md transition-colors"
          aria-label="Skip mission intro"
        >
          Skip Intro ➔
        </motion.button>
      </div>
    </motion.div>
  );
};
