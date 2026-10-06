import React, { useState, useRef, useEffect } from 'react';
import { playBloop } from '../utils/sound';
import { speakDialogue } from '../utils/speech';

export interface GlossaryDefinition {
  term: string;
  icon: string;
  pronounce?: string;
  simpleDefinition: string;
  kidAnalogy: string;
  illustration: 'ionosphere' | 'orbit' | 'atmosphere' | 'spectrometer' | 'hematite' | 'regolith' | 'solar_wind' | 'heliopause' | 'pulsar' | 'rtg' | 'light_year' | 'pathfinder' | 'blueberries' | 'solar_particles';
}

export const SPACE_GLOSSARY: Record<string, GlossaryDefinition> = {
  ionosphere: {
    term: 'Ionosphere',
    icon: '📡',
    pronounce: 'eye-ON-oh-sfeer',
    simpleDefinition: "A layer high above Earth. It bounces radio waves.",
    kidAnalogy: "Like a mirror in the sky for radio!",
    illustration: 'ionosphere',
  },
  orbit: {
    term: 'Orbit',
    icon: '💫',
    pronounce: 'OR-bit',
    simpleDefinition: "A path around a planet or star.",
    kidAnalogy: "Like running circles around a playground!",
    illustration: 'orbit',
  },
  atmosphere: {
    term: 'Atmosphere',
    icon: '🌍',
    pronounce: 'AT-mus-feer',
    simpleDefinition: "The air around a planet.",
    kidAnalogy: "Like a warm blanket of air!",
    illustration: 'atmosphere',
  },
  spectrometer: {
    term: 'Spectrometer (APXS)',
    icon: '🔬',
    pronounce: 'spek-TROM-uh-tur',
    simpleDefinition: "A tool that checks what rocks are made of.",
    kidAnalogy: "Like a robot chef tasting soup!",
    illustration: 'spectrometer',
  },
  hematite: {
    term: 'Hematite (Blueberries)',
    icon: '🫐',
    pronounce: 'HEEM-uh-tite',
    simpleDefinition: "Tiny round rocks that grow in water.",
    kidAnalogy: "Finding them means water was there!",
    illustration: 'hematite',
  },
  pathfinder: {
    term: 'Pathfinder',
    icon: '🏠',
    pronounce: 'PATH-fy-nder',
    simpleDefinition: "The Mars mission that carried Sojourner to the Red Planet.",
    kidAnalogy: "Like a robot's home base on Mars!",
    illustration: 'pathfinder',
  },
  blueberries: {
    term: 'Martian Blueberries',
    icon: '🫐',
    pronounce: 'MAR-shun BLUE-berries',
    simpleDefinition: "Tiny round hematite-rich rocks found by Opportunity on Mars.",
    kidAnalogy: "Little rock balls that are clues Mars once had water!",
    illustration: 'blueberries',
  },
  solar_particles: {
    term: 'Solar Particles',
    icon: '☀️',
    pronounce: 'SOH-lar PAR-ti-kulz',
    simpleDefinition: "Tiny charged particles that travel outward from the Sun.",
    kidAnalogy: "Like a stream of tiny invisible bits blowing away from the Sun!",
    illustration: 'solar_particles',
  },
  regolith: {
    term: 'Lunar Regolith',
    icon: '🌕',
    pronounce: 'REG-oh-lith',
    simpleDefinition: "The dusty ground on the Moon.",
    kidAnalogy: "Like soft grey flour!",
    illustration: 'regolith',
  },
  solar_wind: {
    term: 'Solar Wind',
    icon: '☀️',
    pronounce: 'SOH-lar wind',
    simpleDefinition: "Tiny bits that fly out from the Sun.",
    kidAnalogy: "Like a breeze from the Sun!",
    illustration: 'solar_wind',
  },
  heliopause: {
    term: 'Heliopause',
    icon: '🌟',
    pronounce: 'HEE-lee-oh-pawz',
    simpleDefinition: "The edge of the Sun's bubble.",
    kidAnalogy: "The Sun blows a giant bubble. Past it is space between the stars!",
    illustration: 'heliopause',
  },
  pulsar: {
    term: 'Pulsar',
    icon: '🚨',
    pronounce: 'PULL-sar',
    simpleDefinition: "A star that spins and blinks.",
    kidAnalogy: "Like a lighthouse in space!",
    illustration: 'pulsar',
  },
  rtg: {
    term: 'RTG (Atomic Battery)',
    icon: '🔋',
    pronounce: 'Ar-Tee-Gee',
    simpleDefinition: "A battery that makes power from heat.",
    kidAnalogy: "Like a warm thermos that powers a spacecraft!",
    illustration: 'rtg',
  },
  light_year: {
    term: 'Light-Year',
    icon: '✨',
    pronounce: 'LYTE-yeer',
    simpleDefinition: "How far light travels in one year.",
    kidAnalogy: "Very, very far! Light is super fast.",
    illustration: 'light_year',
  },
  asteroid_belt: {
    term: 'Asteroid Belt',
    icon: '🪨',
    pronounce: 'AS-ter-oyd belt',
    simpleDefinition: "A ring of space rocks between Mars and Jupiter.",
    kidAnalogy: "Like a road full of floating rocks!",
    illustration: 'regolith',
  },
  interstellar: {
    term: 'Interstellar Space',
    icon: '🌌',
    pronounce: 'in-ter-STEL-ar',
    simpleDefinition: "The space between the stars.",
    kidAnalogy: "Far, far past the Sun's bubble!",
    illustration: 'heliopause',
  },
  vicinity: {
    term: 'Vicinity',
    icon: '📍',
    pronounce: 'vih-SIN-ih-tee',
    simpleDefinition: "The area near something.",
    kidAnalogy: "Like being in your neighborhood!",
    illustration: 'orbit',
  },
  seismometer: {
    term: 'Seismometer',
    icon: '📈',
    pronounce: 'size-MOM-uh-tur',
    simpleDefinition: "A quake sensor. It feels shaking in the ground.",
    kidAnalogy: "Like a super-sensitive ear that listens to the ground!",
    illustration: 'regolith',
  },
  magnetometer: {
    term: 'Magnetometer',
    icon: '🧲',
    pronounce: 'mag-nuh-TOM-uh-tur',
    simpleDefinition: "A magnet sensor. It measures magnetic pushes and pulls.",
    kidAnalogy: "Like a compass that can feel a planet's magnet!",
    illustration: 'solar_wind',
  },
  radiometer: {
    term: 'Radiometer',
    icon: '🌡️',
    pronounce: 'ray-dee-OM-uh-tur',
    simpleDefinition: "A heat sensor. It measures how warm things are from far away.",
    kidAnalogy: "Like a thermometer that works without touching!",
    illustration: 'spectrometer',
  },
  altimeter: {
    term: 'Laser Altimeter',
    icon: '📏',
    pronounce: 'al-TIM-uh-tur',
    simpleDefinition: "A laser height-meter. It shoots light at the ground to measure how high the land is.",
    kidAnalogy: "Like a measuring tape made of light!",
    illustration: 'light_year',
  },
  basalt: {
    term: 'Basalt',
    icon: '🌋',
    pronounce: 'buh-SALT',
    simpleDefinition: "A dark rock that forms when lava cools.",
    kidAnalogy: "Like a lava cake that turned to stone!",
    illustration: 'regolith',
  },
  micrometeoroid: {
    term: 'Micrometeoroid',
    icon: '✨',
    pronounce: 'my-kro-MEE-tee-or-oyd',
    simpleDefinition: "A tiny speck of space dust that zooms very fast.",
    kidAnalogy: "Like a grain of sand moving faster than a bullet!",
    illustration: 'solar_particles',
  },
  retrorocket: {
    term: 'Braking Rocket (Retrorocket)',
    icon: '🚀',
    pronounce: 'RET-roh-rock-it',
    simpleDefinition: "A rocket that pushes backward to slow a spacecraft down.",
    kidAnalogy: "Like pressing the brakes on a bike!",
    illustration: 'orbit',
  },
  exosphere: {
    term: 'Exosphere',
    icon: '🌫️',
    pronounce: 'EX-oh-sfeer',
    simpleDefinition: "A super-thin layer of gas. It is so thin that the gas bits almost never bump into each other.",
    kidAnalogy: "Like the last whisper of air before space begins!",
    illustration: 'atmosphere',
  },
  flyby: {
    term: 'Flyby',
    icon: '💨',
    pronounce: 'FLY-by',
    simpleDefinition: "When a spacecraft zooms past a planet or moon without stopping.",
    kidAnalogy: "Like waving at a friend from a speeding train!",
    illustration: 'orbit',
  },
  gravity_assist: {
    term: 'Gravity Boost',
    icon: '🎢',
    pronounce: 'GRAV-ih-tee uh-SIST',
    simpleDefinition: "A spacecraft swings close to a planet and gets a free push from its gravity.",
    kidAnalogy: "Like a swing that flings you farther!",
    illustration: 'orbit',
  },
  mare: {
    term: 'Mare (Moon Sea)',
    icon: '🌑',
    pronounce: 'MAH-ray',
    simpleDefinition: "A big, dark, flat plain on the Moon. Long ago people thought they were seas.",
    kidAnalogy: "Dark patches that make the Man in the Moon's face!",
    illustration: 'regolith',
  },
  crater: {
    term: 'Crater',
    icon: '🕳️',
    pronounce: 'KRAY-tur',
    simpleDefinition: "A bowl-shaped hole made when something crashes into a planet or moon.",
    kidAnalogy: "Like the dent a rock makes in soft sand!",
    illustration: 'regolith',
  },
  hadley: {
    term: 'Hadley-Apennine',
    icon: '⛰️',
    pronounce: 'HAD-lee AP-uh-nine',
    simpleDefinition: "A valley on the Moon, next to tall mountains called the Apennines. A winding canyon runs through it.",
    kidAnalogy: "Like a river valley between mountains, but with no water!",
    illustration: 'regolith',
  },
  descartes: {
    term: 'Descartes Highlands',
    icon: '🏔️',
    pronounce: 'day-KART',
    simpleDefinition: "A hilly, bumpy part of the Moon, higher up than the dark flat plains.",
    kidAnalogy: "Like hilly countryside on the Moon!",
    illustration: 'regolith',
  },
  taurus_littrow: {
    term: 'Taurus-Littrow',
    icon: '🏞️',
    pronounce: 'TOR-us LIT-row',
    simpleDefinition: "A valley on the Moon surrounded by mountains. Apollo 17 landed here.",
    kidAnalogy: "Like a hidden valley with mountain walls all around!",
    illustration: 'regolith',
  },
  fra_mauro: {
    term: 'Fra Mauro',
    icon: '🪨',
    pronounce: 'frah MOW-roh',
    simpleDefinition: "Hilly ground on the Moon covered in rocks thrown out by a giant crash long ago.",
    kidAnalogy: "Like a field of boulders after a huge splash!",
    illustration: 'regolith',
  },
  tranquility_base: {
    term: 'Tranquility Base',
    icon: '🏁',
    pronounce: 'tran-KWIL-ih-tee',
    simpleDefinition: "The spot on the Moon where Apollo 11 landed in 1969.",
    kidAnalogy: "The place of the first footprints!",
    illustration: 'regolith',
  },
  sea_tranquility: {
    term: 'Sea of Tranquility',
    icon: '🌑',
    pronounce: 'sea of tran-KWIL-ih-tee',
    simpleDefinition: "A big, dark, flat plain on the Moon. Long ago people thought it was a sea.",
    kidAnalogy: "A calm gray “sea” with no water!",
    illustration: 'regolith',
  },
  ocean_storms: {
    term: 'Ocean of Storms',
    icon: '🌑',
    pronounce: 'OH-shun of stormz',
    simpleDefinition: "The biggest dark plain on the Moon. It is called an ocean, but it has no water.",
    kidAnalogy: "A giant gray plain you can see from Earth!",
    illustration: 'regolith',
  },
  mare_cognitum: {
    term: 'Mare Cognitum',
    icon: '🌑',
    pronounce: 'MAH-ray kog-NEE-tum',
    simpleDefinition: "A smooth, dark plain on the Moon. The name means “known sea.”",
    kidAnalogy: "Another gray Moon “sea” with no water!",
    illustration: 'regolith',
  },
  alphonsus: {
    term: 'Alphonsus Crater',
    icon: '🕳️',
    pronounce: 'al-FON-sus',
    simpleDefinition: "A big Moon crater, with a mountain peak in the middle.",
    kidAnalogy: "Like a giant bowl with a little hill in the center!",
    illustration: 'regolith',
  },
  copernicus: {
    term: 'Copernicus Crater',
    icon: '🕳️',
    pronounce: 'koh-PUR-nih-kus',
    simpleDefinition: "A huge Moon crater with terraced walls and bright streaks of dust spreading around it.",
    kidAnalogy: "Like a giant splash frozen in place!",
    illustration: 'regolith',
  },
  tycho: {
    term: 'Tycho Crater',
    icon: '🕳️',
    pronounce: 'TY-koh',
    simpleDefinition: "A famous Moon crater in the rugged southern highlands, with bright streaks reaching far across the Moon.",
    kidAnalogy: "Like a starburst you can see with binoculars!",
    illustration: 'regolith',
  },
  sinus_medii: {
    term: 'Sinus Medii',
    icon: '🌑',
    pronounce: 'SY-nus MEE-dee-eye',
    simpleDefinition: "A smooth, flat spot near the middle of the Moon’s face. The name means “Central Bay.”",
    kidAnalogy: "The bullseye of the Moon!",
    illustration: 'regolith',
  },
  sundman: {
    term: 'Sundman V Crater',
    icon: '🕳️',
    pronounce: 'SUND-man five',
    simpleDefinition: "A crater on the Moon, just around the edge toward the far side.",
    kidAnalogy: "A hole right at the edge of the Moon’s hidden half!",
    illustration: 'regolith',
  },
  gusev: {
    term: 'Gusev Crater',
    icon: '🕳️',
    pronounce: 'GOO-sef',
    simpleDefinition: "A huge crater on Mars that may once have held a lake.",
    kidAnalogy: "Like a giant dry bathtub!",
    illustration: 'atmosphere',
  },
  meridiani: {
    term: 'Meridiani Planum',
    icon: '🏜️',
    pronounce: 'meh-RID-ee-AH-nee PLAH-num',
    simpleDefinition: "A flat, rusty-red plain on Mars near the equator. Rocks there were made with help from water.",
    kidAnalogy: "A dusty desert with water clues hiding inside!",
    illustration: 'atmosphere',
  },
  perseverance_valley: {
    term: 'Perseverance Valley',
    icon: '🏞️',
    pronounce: 'PUR-sih-VEER-ans',
    simpleDefinition: "A shallow valley on the edge of a Mars crater. Opportunity ended its journey here.",
    kidAnalogy: "The rover’s last stop!",
    illustration: 'atmosphere',
  },
  elysium: {
    term: 'Elysium Planitia',
    icon: '🏜️',
    pronounce: 'ih-LIZH-ee-um plah-NISH-ee-uh',
    simpleDefinition: "A smooth, flat plain on Mars. InSight landed here.",
    kidAnalogy: "Like a giant, flat parking lot on Mars!",
    illustration: 'atmosphere',
  },
  utopia: {
    term: 'Utopia Planitia',
    icon: '🏜️',
    pronounce: 'yoo-TOH-pee-uh plah-NISH-ee-uh',
    simpleDefinition: "A huge, cold, flat plain in the north of Mars. Viking 2 landed here.",
    kidAnalogy: "Like a giant frosty field!",
    illustration: 'atmosphere',
  },
  jezero: {
    term: 'Jezero Crater',
    icon: '🕳️',
    pronounce: 'YEH-zeh-roh',
    simpleDefinition: "A Mars crater with the dried-up remains of an ancient river delta.",
    kidAnalogy: "A lake bed with no lake left!",
    illustration: 'atmosphere',
  },
  ares_vallis: {
    term: 'Ares Vallis',
    icon: '🌊',
    pronounce: 'AIR-eez VAL-iss',
    simpleDefinition: "An ancient flood channel on Mars. Pathfinder landed here.",
    kidAnalogy: "A giant dry riverbed carved by huge floods!",
    illustration: 'atmosphere',
  },
  europa: {
    term: 'Europa',
    icon: '🧊',
    pronounce: 'yoo-ROH-puh',
    simpleDefinition: "An icy moon of Jupiter. A salty ocean may be hiding under its ice.",
    kidAnalogy: "Like a giant snowball with an ocean inside!",
    illustration: 'atmosphere',
  },
  enceladus: {
    term: 'Enceladus',
    icon: '🧊',
    pronounce: 'en-SEL-uh-dus',
    simpleDefinition: "A small icy moon of Saturn that shoots geysers of ice into space.",
    kidAnalogy: "Like a snowball with fountains!",
    illustration: 'atmosphere',
  },
  titan: {
    term: 'Titan',
    icon: '🟠',
    pronounce: 'TY-tun',
    simpleDefinition: "Saturn's biggest moon.",
    kidAnalogy: "A giant moon wrapped in orange haze!",
    illustration: 'atmosphere',
  },
};

interface GlossaryProps {
  termKey: keyof typeof SPACE_GLOSSARY;
  displayText?: string;
  iconType?: 'star' | 'stone';
}

export const SpaceGlossaryWord: React.FC<GlossaryProps> = ({
  termKey,
  displayText,
  iconType = 'star',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<{ v: 'top' | 'bottom'; h: 'left' | 'center' | 'right' }>({
    v: 'top',
    h: 'center',
  });
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const data = SPACE_GLOSSARY[termKey];

  if (!data) return <span>{displayText || termKey}</span>;

  const shownText = displayText || data.term;


  const POPUP_HEIGHT = 480;
  const POPUP_HALF_WIDTH = 192; 

  const toggleModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const opening = !isOpen;
    if (opening && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const v: 'top' | 'bottom' = spaceAbove >= POPUP_HEIGHT || spaceAbove >= spaceBelow ? 'top' : 'bottom';

      const centerX = rect.left + rect.width / 2;
      let h: 'left' | 'center' | 'right' = 'center';
      if (centerX - POPUP_HALF_WIDTH < 12) {
        h = 'left';
      } else if (centerX + POPUP_HALF_WIDTH > window.innerWidth - 12) {
        h = 'right';
      }

      setPlacement({ v, h });
    }
    playBloop(isOpen ? 440 : 680);
    setIsOpen(opening);
  };

  const handleSpeakDefinition = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakDialogue(
      'orbit',
      `${data.term}! ${data.simpleDefinition} ${data.kidAnalogy}`,
      { skipSoundCue: false }
    );
  };

  useEffect(() => {
    const handleOutside = (e: Event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);


  const renderIllustration = () => {
    switch (data.illustration) {
      case 'ionosphere':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <ellipse cx="50" cy="70" rx="45" ry="30" fill="#38bdf8" opacity="0.35" />
            <path d="M 15 25 A 40 25 0 0 1 85 25" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
            <path d="M 25 45 L 50 25 L 75 45" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <circle cx="50" cy="25" r="4" fill="#fbbf24" />
            <text x="50" y="16" fill="#fde047" fontSize="8" textAnchor="middle" fontWeight="bold">Radio Bounce</text>
          </svg>
        );
      case 'solar_wind':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <circle cx="20" cy="30" r="14" fill="#f59e0b" />
            <path d="M 38 20 Q 65 15 90 22" stroke="#fef08a" strokeWidth="2.5" fill="none" />
            <path d="M 38 30 Q 65 30 95 30" stroke="#fdba74" strokeWidth="3" fill="none" />
            <path d="M 38 40 Q 65 45 90 38" stroke="#fef08a" strokeWidth="2.5" fill="none" />
            <circle cx="85" cy="30" r="3" fill="#38bdf8" />
          </svg>
        );
      case 'orbit':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <circle cx="50" cy="30" r="12" fill="#38bdf8" />
            <ellipse cx="50" cy="30" rx="38" ry="16" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" fill="none" transform="rotate(-15 50 30)" />
            <circle cx="82" cy="22" r="3.5" fill="#fde047" />
          </svg>
        );
      case 'hematite':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <path d="M 10 45 Q 50 35 90 48 L 90 55 L 10 55 Z" fill="#9a3412" />
            <circle cx="35" cy="38" r="6" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1.5" />
            <circle cx="52" cy="40" r="7" fill="#2563eb" stroke="#bfdbfe" strokeWidth="1.5" />
            <circle cx="68" cy="36" r="5.5" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1.5" />
          </svg>
        );
      case 'pathfinder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <rect x="8" y="38" width="84" height="14" rx="4" fill="#92400e" />
            <rect x="20" y="25" width="60" height="22" rx="3" fill="#f59e0b" />
            <rect x="29" y="30" width="14" height="10" fill="#7c2d12" />
            <circle cx="74" cy="28" r="8" fill="#38bdf8" />
            <text x="50" y="18" fill="#7c2d12" fontSize="7" textAnchor="middle" fontWeight="bold">PATHFINDER HOME</text>
          </svg>
        );
      case 'blueberries':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <path d="M 10 47 Q 50 35 90 47 L 90 55 L 10 55 Z" fill="#9a3412" />
            <circle cx="32" cy="40" r="6" fill="#2563eb" stroke="#bfdbfe" strokeWidth="1.5" />
            <circle cx="50" cy="37" r="7" fill="#1d4ed8" stroke="#dbeafe" strokeWidth="1.5" />
            <circle cx="69" cy="42" r="5.5" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="1.5" />
            <text x="50" y="14" fill="#7c2d12" fontSize="7" textAnchor="middle" fontWeight="bold">ROUND ROCKS</text>
          </svg>
        );
      case 'solar_particles':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <circle cx="18" cy="30" r="14" fill="#f59e0b" />
            <circle cx="48" cy="21" r="2.5" fill="#38bdf8" />
            <circle cx="60" cy="31" r="3" fill="#60a5fa" />
            <circle cx="74" cy="24" r="2" fill="#93c5fd" />
            <circle cx="86" cy="38" r="3" fill="#38bdf8" />
            <path d="M 36 18 Q 60 10 90 18" stroke="#fdba74" strokeWidth="2" fill="none" />
            <path d="M 36 38 Q 62 48 90 40" stroke="#fef08a" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'regolith':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <path d="M 10 40 Q 30 30 50 42 Q 70 34 90 40 L 90 55 L 10 55 Z" fill="#475569" />
            <ellipse cx="50" cy="42" rx="14" ry="4" fill="#1e293b" />
            <line x1="25" y1="46" x2="35" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />
            <line x1="60" y1="46" x2="75" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 60" className="w-full h-16 sm:h-20">
            <circle cx="50" cy="30" r="16" fill="#818cf8" opacity="0.4" />
            <text x="50" y="36" fill="#fde047" fontSize="20" textAnchor="middle">{data.icon}</text>
          </svg>
        );
    }
  };

  return (
    <span className="relative inline-flex items-center mx-1 select-none align-baseline">
    
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleModal}
        aria-label={`What does ${data.term} mean?`}
        title={`Click to learn what ${data.term} means!`}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-amber-400/60 bg-amber-950/40 hover:bg-amber-900/50 hover:border-amber-300 text-amber-200 hover:text-amber-950 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400 group"
      >
        <span className="font-extrabold underline decoration-amber-400 decoration-wavy underline-offset-4 tracking-tight text-amber-300 group-hover:text-amber-100">
          {shownText}
        </span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/30 text-[11px] group-hover:scale-125 transition-transform leading-none shadow-xs">
          {iconType === 'star' ? '⭐' : '💎'}
        </span>
      </button>

    
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={`${data.term} explanation`}
          className={`absolute z-50 w-80 sm:w-96 p-4 rounded-3xl bg-[#ffe0b8] backdrop-blur-2xl border-2 border-amber-400 shadow-[0_15px_35px_rgba(0,0,0,0.7)] text-amber-900 text-left animate-in fade-in zoom-in-95 duration-200 ${
            placement.v === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
          } ${
            placement.h === 'center'
              ? 'left-1/2 -translate-x-1/2'
              : placement.h === 'left'
              ? 'left-0'
              : 'right-0'
          }`}
        >
     
          <div
            className={`absolute w-4 h-4 bg-[#ffe0b8] border-amber-400 rotate-45 ${
              placement.v === 'top'
                ? 'top-full -mt-1.5 border-r-2 border-b-2'
                : 'bottom-full -mb-1.5 border-l-2 border-t-2'
            } ${
              placement.h === 'center'
                ? 'left-1/2 -translate-x-1/2'
                : placement.h === 'left'
                ? 'left-6'
                : 'right-6'
            }`}
          />

          <div className="flex items-center justify-between  border-b border-amber-600 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{data.icon}</span>
              <div>
                <span className="font-mono text-lg sm:text-xl font-black text-amber-350 uppercase tracking-wide block">
                  {data.term}
                </span>
                {data.pronounce && (
                  <span className="text-sm font-mono text-amber-700">
                    say it: {data.pronounce}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-base font-bold text-orange-600 hover:text-amber-950 bg-orange-100/60 hover:bg-orange-200 px-1 py-1 rounded-full cursor-pointer transition-colors"
              title="Close explanation"
            >
              ✕
            </button>
          </div>

          
          <div className="w-full bg-[#fff1dc] rounded-2xl border border-amber-300 p-1 mb-2.5 flex items-center justify-center overflow-hidden">
            {renderIllustration()}
          </div>

          

         
          <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-sm sm:text-base font-medium text-amber-200 leading-snug mb-3">
            💡  {data.kidAnalogy}
          </div>

          
          <div className="flex items-center justify-center pt-2 border-t border-amber-300/60">
            <button
              onClick={handleSpeakDefinition}
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold font-mono text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>🔊</span>
              <span>Listen to Orbit explain</span>
            </button>
            
          </div>
        </div>
      )}
    </span>
  );
};

export default SpaceGlossaryWord;