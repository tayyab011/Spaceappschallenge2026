import React from 'react';
import { Rocket, PuzzleIcon, UserCog } from 'lucide-react';

interface KidsNavbarProps {
  onPlay: () => void;
  onMeetParts: () => void;
  onGrownUp: () => void;
   onLogoClick: () => void;
}

export const KidsNavbar: React.FC<KidsNavbarProps> = ({ onPlay, onMeetParts, onGrownUp, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#4a2413]/15 bg-[#fbe4b8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
         <button
          onClick={onLogoClick}
         className="font-serif text-2xl font-medium text-[#4a2413] transition-opacity hover:opacity-70 sm:text-xl"
       >
           Starbound Kids

       </button>

        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 rounded-full bg-[#c1440e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
          >
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">Be Rover</span>
          </button>

          <button
            onClick={onMeetParts}
            className="flex items-center gap-2 rounded-full bg-[#7fd6e8] px-4 py-2 text-sm font-semibold text-[#0b0d12] shadow-sm transition-transform hover:scale-105"
          >
            <PuzzleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Learn Parts</span>
          </button>

          <button
            onClick={onGrownUp}
            className="flex items-center gap-2 rounded-full border border-[#4a2413]/30 px-4 py-2 text-sm font-medium text-[#6b4426] transition-colors hover:border-[#4a2413]/60 hover:text-[#4a2413]"
          >
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Archive</span>
          </button>
        </nav>
      </div>
    </header>
  );
};