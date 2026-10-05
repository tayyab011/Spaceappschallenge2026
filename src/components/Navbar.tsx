import React from 'react';
import { Award, Play, Sparkles, Rocket,Bot,MapPinned,LibraryBig,Bone } from 'lucide-react';

export type AppView =
  | 'entry'
  | 'kids-home'
  | 'coldopen'
  | 'simulation'
  | 'live-archive'
  | 'anatomy'
  | 'meetmyparts'
  | 'rover-game'
  | 'kids-game'
  | 'oppy-story'
  | 'still-out-there'
  | 'celestial'
  | 'recovery'
  | 'abandoned-stories'
  | 'admin'
  | 'map';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  unlockedBadgeCount: number;
  totalBadges: number;
  onSwitchToKids?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  unlockedBadgeCount,
  totalBadges,
  onSwitchToKids,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0d12]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <button
          onClick={() => onNavigate('coldopen')}
          className="text-left font-serif text-lg font-medium tracking-tight text-[#ece7dc] transition-opacity hover:opacity-80 sm:text-xl"
        >
          Starbound
        </button>

        {/* Nav Links */}
        <nav className="hidden items-center gap-6 lg:flex">
          
         <button
            onClick={() => onNavigate('abandoned-stories')}
            className={`whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'abandoned-stories'
                ? 'text-[#ff8a65] border-b-2 border-[#c1440e] pb-1 font-semibold'
                : 'text-[#9aa0a6] hover:text-[#ff8a65]'
            }`}
          >
            <LibraryBig className="h-5 w-4  text-[#9aa0a6]"/>
           <span> Abandoned Stories</span>
          </button>

          <button
            onClick={() => onNavigate('simulation')}
            className={`whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'simulation'
                ? 'text-[#ff8a65] border-b-2 border-[#c1440e] pb-1 font-semibold'
                : 'text-[#9aa0a6] hover:text-[#ff8a65]'
            }`}
          >
            <Play className="h-3 w-3 fill-current" />
            <span>3D Mission POV</span>
          </button>

          <button
            onClick={() => onNavigate('anatomy')}
            className={`whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'anatomy'
                ?  'text-[#ff8a65] border-b-2 border-[#c1440e] pb-1 font-semibold'
                : 'text-[#9aa0a6] hover:text-[#ff8a65]'
            }`}
          >
            <Bone className="h-5 w-4  text-[#9aa0a6]"/> 
            Rover Anatomy
          </button>
           <button
            onClick={() => onNavigate('map')}
            className={`whitespace-nowrap text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'map'
                ? 'text-[#ff8a65] border-b-2 border-[#c1440e] pb-1 font-semibold'
                : 'text-[#9aa0a6] hover:text-[#ff8a65]'
            }`}
          >
            <MapPinned className="h-5 w-4  text-[#9aa0a6]"/>
          <span>Map</span>  
          </button>
          <button
            onClick={() => onNavigate('recovery')}
            className={`whitespace-nowrap text-sm font-medium transition-colors flex items-center text-[#9aa0a6] gap-5${
              currentView === 'recovery'
                ? 'text-[#ff8a65] border-b-2 border-[#c1440e] pb-1 font-semibold'
                : 'text-[#9aa0a6] hover:text-[#ff8a65]'
            }`}
          >
            <Bot className="h-5 w-4 mr-1 text-[#9aa0a6]"/>
          <span className='text-[#9aa0a6]'>Recovery</span>  
          </button>
         
         
          
        </nav>

        <div className="flex items-center gap-3">
          {onSwitchToKids && (
            <button
              onClick={onSwitchToKids}
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#89cfa6] transition-colors hover:border-[#7fd6e8]/50 hover:text-[#ece7dc]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kids</span>
            </button>
          )}

          
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="flex overflow-x-auto border-t border-white/5 px-4 py-2 text-xs lg:hidden gap-4">
        <button
          onClick={() => onNavigate('abandoned-stories')}
          className={`whitespace-nowrap ${currentView === 'abandoned-stories' ? 'text-[#ece7dc] border-b-2 border-[#c1440e] pb-1 font-semibold' : 'text-[#9aa0a6] hover:text-[#ece7dc]'}`}
        >
          Abandoned
        </button>
       
        <button
          onClick={() => onNavigate('simulation')}
          className={`whitespace-nowrap flex items-center gap-1 ${currentView === 'simulation' ? 'text-[#ff8a65] font-semibold' : 'text-[#9aa0a6]'}`}
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Simulation</span>
        </button>
       
        
        <button
          onClick={() => onNavigate('anatomy')}
          className={`whitespace-nowrap ${currentView === 'anatomy' ? 'text-[#ece7dc] font-semibold' : 'text-[#9aa0a6]'}`}
        >
          Anatomy
        </button>
         <button
          onClick={() => onNavigate('map')}
          className={`whitespace-nowrap ${currentView === 'map' ? 'text-[#ece7dc] font-semibold' : 'text-[#9aa0a6]'}`}
        >
          Map
        </button>
        <button
          onClick={() => onNavigate('recovery')}
          className={`whitespace-nowrap ${currentView === 'recovery' ? 'text-[#ece7dc] font-semibold' : 'text-[#9aa0a6]'}`}
        >
          <Bot className={`h-5 w-5 text-[#9aa0a6] ${currentView === 'recovery' ? 'text-[#ece7dc] font-semibold' : 'text-[#9aa0a6]'}`}/>
        </button>
       
        
       
     
      </div>
    </header>
  );
};