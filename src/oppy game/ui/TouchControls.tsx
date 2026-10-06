import React from 'react';
import { motion } from 'framer-motion';

export interface TouchInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

interface TouchControlsProps {
  onInput: (input: Partial<TouchInputState>) => void;
  isStuckMission?: boolean;
  onRock?: (dir: 'forward' | 'backward') => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onInput,
  isStuckMission,
  onRock,
}) => {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex items-end justify-between px-6 md:px-12">
     
      <div className="pointer-events-auto flex flex-col items-center gap-2 select-none">
       
        <motion.button
          whileTap={{ scale: 0.9 }}
          onTouchStart={() => {
            onInput({ forward: true });
            if (isStuckMission && onRock) onRock('forward');
          }}
          onTouchEnd={() => onInput({ forward: false })}
          onMouseDown={() => {
            onInput({ forward: true });
            if (isStuckMission && onRock) onRock('forward');
          }}
          onMouseUp={() => onInput({ forward: false })}
          onMouseLeave={() => onInput({ forward: false })}
          className="w-16 h-16 rounded-2xl bg-[#48170B]/90 hover:bg-[#682210] active:bg-[#C44810] border-2 border-[#F2D9A4]/40 text-[#EFE7D8] flex items-center justify-center text-2xl shadow-xl shadow-black/40 backdrop-blur-md"
          aria-label="Drive Forward"
        >
          ▲
        </motion.button>

        
        <div className="flex items-center gap-2">
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => onInput({ left: true })}
            onTouchEnd={() => onInput({ left: false })}
            onMouseDown={() => onInput({ left: true })}
            onMouseUp={() => onInput({ left: false })}
            onMouseLeave={() => onInput({ left: false })}
            className="w-16 h-16 rounded-2xl bg-[#48170B]/90 hover:bg-[#682210] active:bg-[#C44810] border-2 border-[#F2D9A4]/40 text-[#EFE7D8] flex items-center justify-center text-2xl shadow-xl shadow-black/40 backdrop-blur-md"
            aria-label="Turn Left"
          >
            ◀
          </motion.button>

          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => {
              onInput({ backward: true });
              if (isStuckMission && onRock) onRock('backward');
            }}
            onTouchEnd={() => onInput({ backward: false })}
            onMouseDown={() => {
              onInput({ backward: true });
              if (isStuckMission && onRock) onRock('backward');
            }}
            onMouseUp={() => onInput({ backward: false })}
            onMouseLeave={() => onInput({ backward: false })}
            className="w-16 h-16 rounded-2xl bg-[#48170B]/90 hover:bg-[#682210] active:bg-[#C44810] border-2 border-[#F2D9A4]/40 text-[#EFE7D8] flex items-center justify-center text-2xl shadow-xl shadow-black/40 backdrop-blur-md"
            aria-label="Drive Backward"
          >
            ▼
          </motion.button>

          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => onInput({ right: true })}
            onTouchEnd={() => onInput({ right: false })}
            onMouseDown={() => onInput({ right: true })}
            onMouseUp={() => onInput({ right: false })}
            onMouseLeave={() => onInput({ right: false })}
            className="w-16 h-16 rounded-2xl bg-[#48170B]/90 hover:bg-[#682210] active:bg-[#C44810] border-2 border-[#F2D9A4]/40 text-[#EFE7D8] flex items-center justify-center text-2xl shadow-xl shadow-black/40 backdrop-blur-md"
            aria-label="Turn Right"
          >
            ▶
          </motion.button>
        </div>
      </div>
    </div>
  );
};
