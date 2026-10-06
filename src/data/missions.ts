import { FrontierInfo, BotMission, SimulationObstacle, AnatomyPart, LiveArchiveBot } from '../types';

export const FRONTIERS: Record<string, FrontierInfo> = {
  moon: {
    id: 'moon',
    name: 'The Moon',
    subtitle: 'Our Nearest Neighbor · 384,400 km',
    accentColor: '#9aa0a6',
    borderColor: 'border-[#9aa0a6]/30',
    glowColor: 'shadow-[#9aa0a6]/10',
    summary: 'We send brave robots to the Moon to touch another world for the very first time and leave mirrors that help us measure the cosmic distance to home!',
    badgeAccent: 'text-[#d0d5dd] border-[#9aa0a6]/40 bg-[#9aa0a6]/10',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    subtitle: 'The Rust Planet · 225 Million km Avg',
    accentColor: '#c1440e',
    borderColor: 'border-[#c1440e]/40',
    glowColor: 'shadow-[#c1440e]/15',
    summary: 'We send robots to Mars to follow the trail of ancient rivers and discover if tiny life ever lived beneath the red sands!',
    badgeAccent: 'text-[#ff8a65] border-[#c1440e]/40 bg-[#c1440e]/10',
  },
  deep: {
    id: 'deep',
    name: 'Deep Space',
    subtitle: 'The Endless Void · Billions of Kilometers',
    accentColor: '#4f46e5',
    borderColor: 'border-[#4f46e5]/40',
    glowColor: 'shadow-[#4f46e5]/15',
    summary: 'We send robots into Deep Space to fly past giant planets, explore icy worlds, and carry friendly greetings to the stars!',
    badgeAccent: 'text-[#a5b4fc] border-[#4f46e5]/40 bg-[#4f46e5]/10',
  },
};

export const BOT_MISSIONS: BotMission[] = [
  

  {
    id: 'luna-9',
    frontierId: 'moon',
    category: 'First Ever Sent',
    name: 'Luna 9',
    operator: 'Soviet Space Program',
    launchYear: '1966',
    status: 'Resting in Oceanus Procellarum',
    location: 'Ocean of Storms (Moon)',
    teaser: 'The first robot to make a gentle landing on the Moon and take the very first close-up photos of lunar dirt!',
    whatItFound:
      'Before Luna 9 landed, some people worried the Moon was covered in deep quicksand that would swallow spaceships whole! Luna 9 proved the ground is solid rock and dust, safe for astronauts to walk on. It even snapped the first close-up pictures of Moon pebbles and craters.',
    whatHappened:
      'After sending signals and pictures back to Earth for over 8 hours, its chemical batteries ran out of juice. Luna 9 is resting peacefully in the Ocean of Storms under millions of stars, forever remembered as the brave pioneer who proved the Moon has solid ground beneath our feet!',
    diaryVoice:
      'My petals opened to a world of quiet wonder! I felt the ground hold me firm and showed my creators that there was solid ground beneath the dark. Now I am resting under millions of stars, proud that I opened the way for all who followed!',
    metrics: [
      { label: 'Surface Time', value: '70+ Hours' },
      { label: 'Landing Mass', value: '99.8 kg' },
      { label: 'Signal Travel Time', value: '1.28 Seconds' },
    ],
    badge: {
      id: 'badge-luna9',
      title: 'Solid Ground Confirmed',
      icon: 'Footprints',
      summary: 'Proved the Moon was solid stone and safe for future astronauts.',
    },
    simulationEnv: {
      type: 'moon',
      groundColor: '#4b515d',
      fogColor: '#0b0d12',
      skyColor: '#000000',
      vehicleName: 'Luna 9 Panoramic Lander',
      vehicleCockpitType: 'rover_camera',
    },
    simulationPOIs: [
      {
        id: 'luna9-poi-1',
        botId: 'luna-9',
        title: 'Firm Basalt Bedrock',
        description:
          'Luna 9 proved the lunar surface is solid rock and compressed dust, not a bottomless quicksand swamp as theorists once feared.',
        scienceTitle: 'The Floor of Oceanus Procellarum',
        scientificDiscovery:
          'Luna 9 proved the lunar surface is solid rock and compressed dust, not a bottomless quicksand swamp as theorists once feared.',
        mediaType: null,
        mediaUrl: '/assests/objects/luna9.jpg',
        position: [0, 0, -22],
        beaconColor: '#cbd5e1',
        landmarkLabel: 'Touchdown Spot',
        radius: 5,
      },
      {
        id: 'luna9-poi-2',
        botId: 'luna-9',
        title: 'First Planetary Panorama',
        description:
          'Its rotating television eye beamed back the first clear close-up images of millimeter-sized lunar pebbles and shallow crater rims.',
        scienceTitle: 'First Photo of Another World',
        scientificDiscovery:
          'Its rotating television eye beamed back the first clear close-up images of millimeter-sized lunar pebbles and shallow crater rims.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/luna9.jpg',
        position: [-16, 0, -45],
        beaconColor: '#94a3b8',
        landmarkLabel: 'Pebble Field',
        radius: 5.5,
      },
      {
        id: 'luna9-poi-3',
        botId: 'luna-9',
        title: 'Solar Radiation Sensor',
        description:
          'Measured cosmic ray dosages directly on the lunar surface, showing future Apollo astronauts would not receive lethal bursts on short visits.',
        scienceTitle: 'Unshielded Space Environment',
        scientificDiscovery:
          'Measured cosmic ray dosages directly on the lunar surface, showing future Apollo astronauts would not receive lethal bursts on short visits.',
        mediaType: null,
        mediaUrl: '',
        position: [18, 0, -65],
        beaconColor: '#38bdf8',
        landmarkLabel: 'Radiation Sensor',
        radius: 5.5,
      },
    ],
  },
  {
    id: 'apollo-lrv',
    frontierId: 'moon',
    category: 'The Standout',
    name: 'Apollo Lunar Roving Vehicle',
    operator: 'NASA (Apollo 15, 16 & 17)',
    launchYear: '1971',
    status: 'Parked in Taurus-Littrow & Hadley Rille',
    location: 'Three lunar landing sites',
    teaser: 'An electric space moon buggy that helped astronauts drive across gigantic lunar mountains and crater rims!',
    whatItFound:
      'Astronauts drove this awesome open-air rover across 35 kilometers of Moon hills! It helped them find the famous 4-billion-year-old "Genesis Rock," a super-old piece of the Moon\'s original crust that revealed how the young Moon formed. It also sent live color TV videos of astronauts blasting back into space!',
    whatHappened:
      'When the astronauts were ready to fly home, they parked the moon buggy a short distance away and pointed its TV camera at their spaceship to film the liftoff. All three Apollo buggies are still parked neatly where they were left, waiting quietly on the Moon!',
    diaryVoice:
      'I carried two astronauts across mountains older than Earth\'s oceans! I watched them lift into the sky on a pillar of golden light. My key was turned off, but my woven-wire tires are still parked safely on the Moon, watching the Earth rise!',
    metrics: [
      { label: 'Top Lunar Speed', value: '18 km/h' },
      { label: 'Total Distance', value: '35.9 km' },
      { label: 'Tire Material', value: 'Woven Zinc-Coated Steel Wire' },
    ],
    badge: {
      id: 'badge-lrv',
      title: 'Cosmic Road-Tripper',
      icon: 'Compass',
      summary: 'Climbed lunar mountain ridges and hauled back the 4-billion-year-old Genesis Rock.',
    },
    simulationEnv: {
      type: 'moon',
      groundColor: '#3d434e',
      fogColor: '#0b0d12',
      skyColor: '#000000',
      vehicleName: 'Apollo Lunar Roving Vehicle (LRV-001)',
      vehicleCockpitType: 'lrv_dash',
    },
    simulationPOIs: [
      {
        id: 'lrv-poi-1',
        botId: 'apollo-lrv',
        title: 'The Genesis Rock Ridge',
        description:
          'Astronauts drove the rover up Spur Crater to scoop up Sample 15415: an anorthosite white rock that cooled when the young Moon was still an ocean of molten magma.',
        scienceTitle: '4-Billion-Year-Old Primordial Crust',
        scientificDiscovery:
          'Astronauts drove the rover up Spur Crater to scoop up Sample 15415: an anorthosite white rock that cooled when the young Moon was still an ocean of molten magma.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Genesis-Rock-6787450c.jpg',
        position: [-14, 0, -25],
        beaconColor: '#f1f5f9',
        landmarkLabel: 'Spur Crater Ridge',
        radius: 5,
      },
      {
        id: 'lrv-poi-2',
        botId: 'apollo-lrv',
        title: 'Hadley Rille Canyon Rim',
        description:
          'The rover parked right at the edge of a sheer 300-meter-deep canyon, revealing layered basalt flows from ancient lunar volcanic eruptions.',
        scienceTitle: 'Ancient Volcanic Lava Channel',
        scientificDiscovery:
          'The rover parked right at the edge of a sheer 300-meter-deep canyon, revealing layered basalt flows from ancient lunar volcanic eruptions.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Hadley-Rille-Apollo-15-6fe71e58.jpg',
        position: [18, 0, -50],
        beaconColor: '#94a3b8',
        landmarkLabel: 'Hadley Rille Gorge',
        radius: 5.5,
      },
      {
        id: 'lrv-poi-3',
        botId: 'apollo-lrv',
        title: 'Final Parking Spot Station 10',
        description:
          'Positioned 100 meters away with its color TV antenna aimed back at the Apollo Lunar Module, broadcasting the golden blast of liftoff straight to Earth living rooms.',
        scienceTitle: 'The Lift-Off Observation Post',
        scientificDiscovery:
          'Positioned 100 meters away with its color TV antenna aimed back at the Apollo Lunar Module, broadcasting the golden blast of liftoff straight to Earth living rooms.',
        mediaType: null,
        mediaUrl: '',
        position: [0, 0, -80],
        beaconColor: '#fbbf24',
        landmarkLabel: 'Station 10 Overlook',
        radius: 6,
      },
    ],
  },
  {
    id: 'lunar-retroreflectors',
    frontierId: 'moon',
    category: 'Most Recent / Still Active',
    name: 'Lunar Laser Retroreflectors',
    operator: 'International Science Community',
    launchYear: '1969 - Present',
    status: 'Actively Reflecting Earth Lasers Every Week',
    location: 'Tranquility Base, Fra Mauro, Hadley & Lunokhod sites',
    teaser: 'Special glass prism mirrors placed by astronauts that scientists still bounce lasers off five decades later!',
    whatItFound:
      'Scientists on Earth shoot laser beams from giant telescopes straight at these mirrors and time how long they take to bounce back. This revealed that the Moon is slowly drifting away from Earth by about 3.8 centimeters (1.5 inches) every year, and proved Einstein\'s rules of gravity are right on target!',
    whatHappened:
      'Because these mirrors contain no moving parts, no batteries, and no microchips, they never run out of fuel and never overheat! More than fifty years after humans placed them on the Moon, observatories still fire green laser beams at them on clear nights.',
    diaryVoice:
      "I'm not a rover — I'm small mirrors astronauts left on the Moon over 50 years ago!\nHere's the cool part: scientists on Earth still bounce laser beams off me today to measure exactly how far away the Moon is.\nI've been 'resting' in the quiet since 1969, but I'm still helping Earth do science every single year!",
    metrics: [
      { label: 'Measurement Accuracy', value: '±1 Millimeter' },
      { label: 'Yearly Moon Drift', value: '+3.8 cm/year' },
      { label: 'Operational Span', value: '55+ Years' },
    ],
    badge: {
      id: 'badge-reflectors',
      title: 'Perpetual Mirror Beacon',
      icon: 'Sparkles',
      summary: 'Still measuring planetary drift with lasers without needing a single drop of fuel.',
    },
    simulationEnv: {
      type: 'moon',
      groundColor: '#363c46',
      fogColor: '#0b0d12',
      skyColor: '#000000',
      vehicleName: 'Laser Retroreflector Optical Surveyor',
      vehicleCockpitType: 'retro_dish',
    },
    simulationPOIs: [
      {
        id: 'reflector-poi-1',
        botId: 'lunar-retroreflectors',
        title: 'Corner-Cube Quartz Array',
        description:
          'When green laser pulses from Earth strike these 100 quartz prisms, they bounce back directly along their exact incoming path with sub-millimeter precision.',
        scienceTitle: 'The 2.5-Second Laser Bounce',
        scientificDiscovery:
          'When green laser pulses from Earth strike these 100 quartz prisms, they bounce back directly along their exact incoming path with sub-millimeter precision.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Apollo-11-Lunar-Laser-Ranging-Retroreflect-097e23b9.jpg',
        position: [0, 0, -22],
        beaconColor: '#22c55e',
        landmarkLabel: 'Apollo 11 Retro-Array',
        radius: 5,
      },
      {
        id: 'reflector-poi-2',
        botId: 'lunar-retroreflectors',
        title: 'Planetary Drift Measurement',
        description:
          'Decades of return laser bounces proved that tidal friction is steadily accelerating the Moon outward, causing our Moon to slowly spiral away from Earth.',
        scienceTitle: '3.8 Centimeters Per Year',
        scientificDiscovery:
          'Decades of return laser bounces proved that tidal friction is steadily accelerating the Moon outward, causing our Moon to slowly spiral away from Earth.',
        mediaType: null,
        mediaUrl: '',
        position: [-16, 0, -48],
        beaconColor: '#10b981',
        landmarkLabel: 'Tidal Drift Outpost',
        radius: 5.5,
      },
      {
        id: 'reflector-poi-3',
        botId: 'lunar-retroreflectors',
        title: 'Einstein Gravitational Test',
        description:
          'Proved the Earth and Moon fall toward the Sun at the exact same gravitational rate, confirming Einstein’s theory of general relativity to unprecedented accuracy.',
        scienceTitle: 'Equivalence Principle Confirmed',
        scientificDiscovery:
          'Proved the Earth and Moon fall toward the Sun at the exact same gravitational rate, confirming Einstein’s theory of general relativity to unprecedented accuracy.',
        mediaType: null,
        mediaUrl: '',
        position: [15, 0, -75],
        beaconColor: '#4ade80',
        landmarkLabel: 'General Relativity Point',
        radius: 6,
      },
    ],
  },

 


  {
    id: 'mars-3',
    frontierId: 'mars',
    category: 'First Ever Sent',
    name: 'Mars 3',
    operator: 'Soviet Space Program',
    launchYear: '1971',
    status: 'Resting in Ptolemaeus Crater',
    location: 'Terra Sirenum (Mars)',
    teaser: 'The first robot to touch down softly on Mars during a giant dust storm and send back the first signal from the red surface!',
    whatItFound:
      'Mars 3 showed that a spacecraft could parachute down through the thin Martian atmosphere and land safely with rocket thrusters. It even carried Prop-M, a super-cool tiny robot on twin skis designed to walk on the red sand while attached to a tether wire!',
    whatHappened:
      'It landed right into a giant planet-wide dust storm with howling winds. The storm cut its radio link after 14.5 seconds, but Mars 3 showed that landing on Mars was really possible. In 2013, NASA cameras spotted its parachute and lander resting together in Ptolemaeus Crater. Mars 3 will always be honored as our very first soft touchdown on Mars!',
    diaryVoice:
      'I was the first to touch the red sands of Mars! Even though a huge red dust storm swept across my radio, I opened the door for every rover that came after me.',
    metrics: [
      { label: 'Touchdown Time', value: '14.5 Seconds' },
      { label: 'Parachute Diameter', value: '11 Meters' },
      { label: 'Current Distance', value: '200+ Million km' },
    ],
    badge: {
      id: 'badge-mars3',
      title: 'First Touch of Rust',
      icon: 'Flag',
      summary: 'Survive the first descent through Martian skies amidst a global dust hurricane.',
    },
    simulationEnv: {
      type: 'mars',
      groundColor: '#78280f',
      fogColor: '#2b1008',
      skyColor: '#1c0904',
      vehicleName: 'Mars 3 Descent Lander & Prop-M Rover',
      vehicleCockpitType: 'rover_camera',
    },
    simulationPOIs: [
      {
        id: 'mars3-poi-1',
        botId: 'mars-3',
        title: 'Supersonic Parachute Canopy',
        description:
          'Proved a spacecraft could decelerate from orbital speed through Mars\' paper-thin carbon dioxide atmosphere using a drogue parachute and braking rockets.',
        scienceTitle: 'Atmospheric Entry Verification',
        scientificDiscovery:
          'Proved a spacecraft could decelerate from orbital speed through Mars\' paper-thin carbon dioxide atmosphere using a drogue parachute and braking rockets.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Mars-3-lander-and-parachute-64d844a3.jpg',
        position: [-12, 0, -20],
        beaconColor: '#ea580c',
        landmarkLabel: 'Discarded Parachute',
        radius: 5,
      },
      {
        id: 'mars3-poi-2',
        botId: 'mars-3',
        title: 'Ptolemaeus Dust Storm Vortex',
        description:
          'Transmitted seventy lines of raster television signal through a planet-encircling dust storm with winds over 100 meters per second.',
        scienceTitle: 'The 14.5-Second Broadcast',
        scientificDiscovery:
          'Transmitted seventy lines of raster television signal through a planet-encircling dust storm with winds over 100 meters per second.',
        mediaType: null,
        mediaUrl: '',
        position: [14, 0, -45],
        beaconColor: '#f97316',
        landmarkLabel: 'Storm Touchdown Site',
        radius: 5.5,
      },
      {
        id: 'mars3-poi-3',
        botId: 'mars-3',
        title: 'Prop-M Tethered Walking Rover',
        description:
          'Carried a tiny 4.5-kilogram rover on dual skis designed to measure soil density with a mechanical penetrometer while tethered to the main lander.',
        scienceTitle: 'The First Ski-Walking Rover',
        scientificDiscovery:
          'Carried a tiny 4.5-kilogram rover on dual skis designed to measure soil density with a mechanical penetrometer while tethered to the main lander.',
        mediaType: null,
        mediaUrl: '',
        position: [0, 0, -70],
        beaconColor: '#fb923c',
        landmarkLabel: 'Prop-M Ski Platform',
        radius: 5.5,
      },
    ],
  },
  {
    id: 'opportunity',
    frontierId: 'mars',
    category: 'The Standout',
    name: 'Opportunity Rover (Oppy)',
    operator: 'NASA Jet Propulsion Laboratory',
    launchYear: '2003 (Landed 2004)',
    status: 'Resting in Perseverance Valley',
    location: 'Endeavour Crater Rim',
    teaser: 'A solar-powered robot built for 90 days that rolled across Mars for nearly 15 years, discovering ancient signs of water with its twin Spirit!',
    whatItFound:
      'Opportunity discovered microscopic hematite mineral spheres—famously nicknamed "Martian blueberries"—that formed inside calm, standing bodies of liquid water billions of years ago! Along with its twin sister rover Spirit, they proved that ancient Mars was once warm, wet, and had the right conditions where tiny living things could have thrived.',
    whatHappened:
      'Opportunity worked for 15 years — 60 times longer than planned! In June 2018, a giant planet-wide dust storm covered the midday sun over Perseverance Valley. Opportunity safely entered low-power sleep mode to protect its computer core. Its last message reminded everyone how much it gave us, and it now rests like a champion under the Martian stars.',
    quoteNote:
      'Opportunity worked for 15 years — 60 times longer than planned! Its last message reminded everyone how much it gave us.',
    diaryVoice:
      "I'm Opportunity! They gave me ninety days, and together we gave them fifteen years! My twin sister Spirit and I showed the world that Mars once had lakes and hot springs. I climbed out of sand traps, drove a whole marathon, and left tracks across 45 kilometers of red desert. Now I am resting peacefully under the winter sun!",
    twinStory: {
      name: 'Spirit (MER-A)',
      subtitle: "Opportunity's Twin Sister Rover",
      voice:
        "I'm Spirit, Opportunity's twin! I climbed a whole mountain — with one wheel stuck the entire time.\n\nGuess what? That stuck wheel accidentally dug up something amazing: signs of ancient hot springs, which could mean Mars was once a place where tiny life might have lived!\n\nLater, I got stuck in soft sand and couldn't drive anymore. But I kept working from right where I sat, sending science home for months.",
      discovery:
        'Discovered white silica deposits at Home Plate in Gusev Crater, proving ancient Mars had volcanic hot springs and steam vents!',
      fate:
        'After driving 7.7 km and climbing Husband Hill, Spirit became stuck in soft sand at Troy. It kept doing science as a stationary solar observatory until going to sleep in 2010.',
    },
    metrics: [
      { label: 'Planned Lifetime', value: '90 Days' },
      { label: 'Actual Lifetime', value: '5,352 Sols (~15 Years)' },
      { label: 'Distance Traveled', value: '45.16 km (28.06 mi)' },
    ],
    badge: {
      id: 'badge-oppy',
      title: 'Martian Blueberries',
      icon: 'Sun',
      summary: 'Discovered ancient water-formed minerals and drove an interplanetary marathon.',
    },
    simulationEnv: {
      type: 'mars',
      groundColor: '#8a2b0e',
      fogColor: '#301309',
      skyColor: '#1f0d06',
      vehicleName: 'Opportunity Mars Exploration Rover (MER-B)',
      vehicleCockpitType: 'rover_camera',
    },
    simulationPOIs: [
      {
        id: 'oppy-poi-1',
        botId: 'opportunity',
        title: "Hematite 'Blueberries' Found",
        description:
          'Discovered tiny millimeter-sized grey spheres of hematite mineral ("blueberries") embedded in rock that could only precipitate inside calm standing water.',
        scienceTitle: 'Hematite Concretions from Liquid Water',
        scientificDiscovery:
          'Discovered tiny millimeter-sized grey spheres of hematite mineral ("blueberries") embedded in rock that could only precipitate inside calm standing water.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Opportunity-blueberries-abdefa5d.jpg',
        position: [-10, 0, -22],
        beaconColor: '#c1440e',
        landmarkLabel: 'Hematite Blueberry Bed',
        radius: 5,
      },
      {
        id: 'oppy-poi-2',
        botId: 'opportunity',
        title: 'The Soft Sand Dune of "Troy"',
        description:
          'Got wheels buried hub-deep in fluffy sulfate powder sand; engineers backward-engineered the slip physics in Earth testbeds to navigate out safely.',
        scienceTitle: 'Rocker-Bogie Traction Mechanics',
        scientificDiscovery:
          'Got wheels buried hub-deep in fluffy sulfate powder sand; engineers backward-engineered the slip physics in Earth testbeds to navigate out safely.',
        mediaType: null,
        mediaUrl: '',
        position: [16, 0, -48],
        beaconColor: '#f59e0b',
        landmarkLabel: 'Troy Sand Trap',
        radius: 5.5,
      },
      {
        id: 'oppy-poi-3',
        botId: 'opportunity',
        title: 'Endeavour Crater Clay Rim',
        description:
          'Discovered neutral pH smectite clays at Matijevic Hill, proving Mars once harbored drinkable, non-acidic freshwater lakes.',
        scienceTitle: 'Smectite Clays in Drinkable Water',
        scientificDiscovery:
          'Discovered neutral pH smectite clays at Matijevic Hill, proving Mars once harbored drinkable, non-acidic freshwater lakes.',
        mediaType: null,
        mediaUrl: '',
        position: [0, 0, -78],
        beaconColor: '#ff8a65',
        landmarkLabel: 'Endeavour Ancient Lakebed',
        radius: 6,
      },
    ],
  },
  {
    id: 'perseverance',
    frontierId: 'mars',
    category: 'Most Recent / Still Active',
    name: 'Perseverance & Ingenuity',
    operator: 'NASA Jet Propulsion Laboratory',
    launchYear: '2020 (Landed 2021)',
    status: 'Actively Exploring Jezero Crater Rim',
    location: 'Jezero Ancient River Delta',
    teaser: 'A high-tech car-sized rover drilling rock samples in an ancient river delta, teamed up with the first helicopter to ever fly on another planet!',
    whatItFound:
      'Perseverance discovered ancient clay layers in Jezero Crater where a deep river once flowed into a prehistoric lake billions of years ago. It has already drilled dozens of rock cores and sealed them inside sterile titanium tubes for future astronauts to bring home! Meanwhile, its companion scout Ingenuity proved that powered flight is possible in Mars\' ultra-thin air.',
    whatHappened:
      'Both robots exceeded every dream! Little helicopter Ingenuity flew 72 times—fourteen times more than planned—before retiring its blades to become a stationary weather station. Perseverance is still rolling forward right now, exploring the ancient lake rim and collecting discoveries for Earth!',
    diaryVoice:
      'We came to collect gifts for Earth! Every rock core I drill is sealed in titanium and laid on the desert floor like a letter left in a bottle, waiting for future human explorers to come fetch them!',
    metrics: [
      { label: 'Helicopter Flights', value: '72 Successful Flights' },
      { label: 'Cores Collected', value: '25+ Sealed Tubes' },
      { label: 'Power Source', value: 'Nuclear MMRTG' },
    ],
    badge: {
      id: 'badge-percy',
      title: 'Ancient Delta Cache',
      icon: 'Rocket',
      summary: 'Cached sealed rock cores in an ancient riverbed for future astronauts.',
    },
    simulationEnv: {
      type: 'mars',
      groundColor: '#75240c',
      fogColor: '#270e06',
      skyColor: '#170803',
      vehicleName: 'Perseverance Mars 2020 Laboratory',
      vehicleCockpitType: 'rover_camera',
    },
    simulationPOIs: [
      {
        id: 'percy-poi-1',
        botId: 'perseverance',
        title: 'Jezero Ancient River Delta',
        description:
          'Identified layered fine-grained mudstones formed billions of years ago where river water slowed upon entering a prehistoric crater lake.',
        scienceTitle: 'Mudstone Sedimentary Layers',
        scientificDiscovery:
          'Identified layered fine-grained mudstones formed billions of years ago where river water slowed upon entering a prehistoric crater lake.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/jezero.jpg',
        position: [-14, 0, -24],
        beaconColor: '#ef4444',
        landmarkLabel: 'River Delta Bed',
        radius: 5,
      },
      {
        id: 'percy-poi-2',
        botId: 'perseverance',
        title: 'Three Forks Sample Depot',
        description:
          'Deposited ten hermetically sealed titanium sample tubes on the flat ground to serve as a backup cache for future Earth retrieval.',
        scienceTitle: 'Hermetically Sealed Titanium Rock Cores',
        scientificDiscovery:
          'Deposited ten hermetically sealed titanium sample tubes on the flat ground to serve as a backup cache for future Earth retrieval.',
        mediaType: null,
        mediaUrl: '',
        position: [16, 0, -50],
        beaconColor: '#f97316',
        landmarkLabel: 'Three Forks Core Depot',
        radius: 5.5,
      },
      {
        id: 'percy-poi-3',
        botId: 'perseverance',
        title: 'Ingenuity Airfield Wright Brothers Field',
        description:
          'Ingenuity demonstrated that counter-rotating carbon fiber blades spinning at 2,400 RPM generate sufficient lift in air that is 99% thinner than Earth’s.',
        scienceTitle: 'First Aerodynamic Planetary Flight',
        scientificDiscovery:
          'Ingenuity demonstrated that counter-rotating carbon fiber blades spinning at 2,400 RPM generate sufficient lift in air that is 99% thinner than Earth’s.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Ingenuity-Flight-24-4305698c.jpg',
        position: [0, 0, -78],
        beaconColor: '#e11d48',
        landmarkLabel: 'Ingenuity Landing Pad',
        radius: 6,
      },
    ],
  },

  

  {
    id: 'pioneer-10',
    frontierId: 'deep',
    category: 'First Ever Sent',
    name: 'Pioneer 10',
    operator: 'NASA Ames Research Center',
    launchYear: '1972',
    status: 'Sailing Peacefully toward Aldebaran',
    location: '12+ Billion Kilometers from Earth',
    teaser: 'The first spacecraft to travel through the Asteroid Belt and capture close-up portraits of gas giant Jupiter!',
    whatItFound:
      'Before Pioneer 10, nobody knew whether the dense Asteroid Belt between Mars and Jupiter was full of space rocks that would shred a spacecraft. Pioneer 10 sailed straight through without a scratch, revealed that Jupiter is mostly an immense spinning sphere of liquid hydrogen, and became the very first vessel to fly past the orbit of Neptune!',
    whatHappened:
      'Its tiny nuclear power source gently cooled down over thirty-one years of travel. On January 23, 2003, from over 12 billion kilometers away, its final whisper reached radio antennas in Spain. On its side is an engraved golden plaque showing friendly humans waving hello, peacefully drifting toward the bright star Aldebaran!',
    diaryVoice:
      'I was the very first spacecraft to sail past the outer planets! When I looked back, the Sun was just a bright morning star. On my chest is a golden drawing of friendly humans waving in greeting, sailing forever through the stars!',
    metrics: [
      { label: 'Last Signal Distance', value: '12.2 Billion km' },
      { label: 'Speed', value: '43,000 km/h' },
      { label: 'Destination', value: 'Aldebaran (~2 Million Years)' },
    ],
    badge: {
      id: 'badge-pioneer',
      title: 'The Great Belt Crossing',
      icon: 'Shield',
      summary: 'Braved the asteroid belt and took the first close-up portrait of Jupiter.',
    },
    simulationEnv: {
      type: 'deep_space',
      groundColor: '#070714',
      fogColor: '#050510',
      skyColor: '#000008',
      vehicleName: 'Pioneer 10 Interstellar Probe',
      vehicleCockpitType: 'probe_hull',
    },
    simulationPOIs: [
      {
        id: 'pioneer-poi-1',
        botId: 'pioneer-10',
        title: 'Main Asteroid Belt Clearance',
        description:
          'Proved the asteroid belt is mostly empty space rather than an impenetrable debris storm, clearing the route for all future outer solar system probes.',
        scienceTitle: 'The Safe Passage Through Debris',
        scientificDiscovery:
          'Proved the asteroid belt is mostly empty space rather than an impenetrable debris storm, clearing the route for all future outer solar system probes.',
        mediaType: null,
        mediaUrl: '',
        position: [-16, 0, -26],
        beaconColor: '#6366f1',
        landmarkLabel: 'Asteroid Belt Crossing',
        radius: 6,
      },
      {
        id: 'pioneer-poi-2',
        botId: 'pioneer-10',
        title: 'Jupiter Magnetosphere Bow Shock',
        description:
          'Discovered Jupiter’s magnetic field is over twenty times stronger than Earth’s and that its intense trapped radiation belts would fry unshielded electronics.',
        scienceTitle: 'Enormous Radiation Belts Mapped',
        scientificDiscovery:
          'Discovered Jupiter’s magnetic field is over twenty times stronger than Earth’s and that its intense trapped radiation belts would fry unshielded electronics.',
        mediaType: null,
        mediaUrl: '',
        position: [18, 0, -55],
        beaconColor: '#818cf8',
        landmarkLabel: 'Jupiter Magnetic Shock',
        radius: 6.5,
      },
      {
        id: 'pioneer-poi-3',
        botId: 'pioneer-10',
        title: 'Beyond Neptune Orbit',
        description:
          'On June 13, 1983, crossed the orbit of Neptune to become the first human-built craft to venture into the deep cosmic sea beyond the planets.',
        scienceTitle: 'First Vessel to Leave All Planets Behind',
        scientificDiscovery:
          'On June 13, 1983, crossed the orbit of Neptune to become the first human-built craft to venture into the deep cosmic sea beyond the planets.',
        mediaType: null,
        mediaUrl: '',
        position: [0, 0, -85],
        beaconColor: '#a5b4fc',
        landmarkLabel: 'Trans-Neptunian Perimeter',
        radius: 7,
      },
    ],
  },
  {
    id: 'voyager-1',
    frontierId: 'deep',
    category: 'The Standout',
    name: 'Voyager 1',
    operator: 'NASA Jet Propulsion Laboratory',
    launchYear: '1977',
    status: 'Actively Transmitting from Interstellar Space',
    location: '24+ Billion Kilometers (Outside Solar System)',
    teaser: 'The farthest human-made object in history, flying beyond our solar system with a golden record of Earth music and greetings!',
    whatItFound:
      'Voyager 1 discovered active sulfur volcanoes on Jupiter\'s moon Io and intricate rings around Saturn. In August 2012, it made history by crossing the boundary of our solar system into interstellar space, measuring the true cosmic rays between the stars for the first time!',
    whatHappened:
      'Even when a single memory chip had a hiccup in late 2023, NASA engineers fixed it from 24 billion kilometers away! It carries a copper Golden Record packed with whale songs, Mozart, and greetings in 55 languages that will survive for billions of years.',
    diaryVoice:
      'I have flown farther than any machine ever built! Behind me, Earth is a tiny pale blue dot floating in a sunbeam. On my hull is a Golden Record playing songs, greetings in 55 languages, and whale calls. I am humanity\'s friendly greeting to the cosmos!',
    metrics: [
      { label: 'Distance from Earth', value: '24.4+ Billion km' },
      { label: 'Round-Trip Light Time', value: '45+ Hours' },
      { label: 'Speed', value: '61,000 km/h' },
    ],
    badge: {
      id: 'badge-voyager',
      title: 'Golden Record Bearer',
      icon: 'Disc',
      summary: 'Crossed into interstellar space carrying Earth music, greetings, and whale songs.',
    },
    simulationEnv: {
      type: 'deep_space',
      groundColor: '#050512',
      fogColor: '#04040e',
      skyColor: '#000008',
      vehicleName: 'Voyager 1 Interstellar Mission',
      vehicleCockpitType: 'probe_hull',
    },
    simulationPOIs: [
      {
        id: 'voyager-poi-1',
        botId: 'voyager-1',
        title: 'Io Volcanic Sulfur Plumes',
        description:
          'Discovered 300-kilometer-high umbrella fountains of molten sulfur on Jupiter’s moon Io, proving planetary moons can generate intense internal tidal heat.',
        scienceTitle: 'First Extraterrestrial Active Volcanoes',
        scientificDiscovery:
          'Discovered 300-kilometer-high umbrella fountains of molten sulfur on Jupiter’s moon Io, proving planetary moons can generate intense internal tidal heat.',
        mediaType: null,
        mediaUrl: '',
        position: [-16, 0, -25],
        beaconColor: '#eab308',
        landmarkLabel: 'Io Sulfur Plume',
        radius: 6,
      },
      {
        id: 'voyager-poi-2',
        botId: 'voyager-1',
        title: 'The Heliopause Boundary',
        description:
          'On August 25, 2012, recorded solar particles plunging to zero as interstellar galactic cosmic rays surged, proving it had entered interstellar space.',
        scienceTitle: 'Exit from the Sun’s Magnetic Bubble',
        scientificDiscovery:
          'On August 25, 2012, recorded solar particles plunging to zero as interstellar galactic cosmic rays surged, proving it had entered interstellar space.',
        mediaType: null,
        mediaUrl: '',
        position: [18, 0, -58],
        beaconColor: '#818cf8',
        landmarkLabel: 'Heliopause Magnetic Border',
        radius: 6.5,
      },
      {
        id: 'voyager-poi-3',
        botId: 'voyager-1',
        title: 'The Golden Record & Pale Blue Dot',
        description:
          'Took the iconic portrait of Earth from 6 billion km as a solitary speck in a sunbeam, carrying greetings in 55 languages into deep galactic time.',
        scienceTitle: 'Humanity’s Interstellar Time Capsule',
        scientificDiscovery:
          'Took the iconic portrait of Earth from 6 billion km as a solitary speck in a sunbeam, carrying greetings in 55 languages into deep galactic time.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Pale-Blue-Dot-1496b6e2.png',
        position: [0, 0, -88],
        beaconColor: '#c084fc',
        landmarkLabel: 'Pale Blue Dot Vector',
        radius: 7,
      },
    ],
  },
  {
    id: 'new-horizons',
    frontierId: 'deep',
    category: 'Most Recent / Still Active',
    name: 'New Horizons',
    operator: 'NASA / Johns Hopkins APL',
    launchYear: '2006',
    status: 'Active in the Distant Kuiper Belt',
    location: '8.8 Billion Kilometers from Earth',
    teaser: 'The speedy probe that zoomed to distant Pluto and discovered it has giant ice mountains and a big frozen heart!',
    whatItFound:
      'New Horizons showed us that Pluto is not a dead ball of rock, but an active, magical world with a bright heart-shaped glacier made of nitrogen ice, tall mountains made of frozen water, and blue skies! Later, it flew past Arrokoth, teaching us how planets gently grew at the dawn of time.',
    whatHappened:
      'New Horizons is healthy, happy, and cruising deeper into the Kuiper Belt at the edge of our solar system. Its batteries have plenty of power to keep sending exciting discoveries back to Earth well into the 2040s!',
    diaryVoice:
      'They thought the edge of our system was cold and quiet. I found a giant beating heart carved in bright ice! I am still zooming outward into the cosmic deep, exploring where the sunlight gives way to the stars!',
    metrics: [
      { label: 'Launch Speed', value: '58,536 km/h' },
      { label: 'Pluto Distance', value: '12,500 km at closest flyby' },
      { label: 'Power Reserve', value: 'Active through 2040s' },
    ],
    badge: {
      id: 'badge-horizons',
      title: 'The Frozen Heart',
      icon: 'Eye',
      summary: 'Revealed active glaciers and towering ice mountains at the edge of the solar system.',
    },
    simulationEnv: {
      type: 'deep_space',
      groundColor: '#0a0b16',
      fogColor: '#070814',
      skyColor: '#000008',
      vehicleName: 'New Horizons Kuiper Belt Scout',
      vehicleCockpitType: 'probe_hull',
    },
    simulationPOIs: [
      {
        id: 'horizons-poi-1',
        botId: 'new-horizons',
        title: 'Sputnik Planitia Nitrogen Heart',
        description:
          'Revealed that Pluto\'s giant heart-shaped basin is a churning sea of solid nitrogen ice that bubbles up like a slow lava lamp, proving Pluto is geologically alive.',
        scienceTitle: 'Active Convective Nitrogen Ice Glaciers',
        scientificDiscovery:
          'Revealed that Pluto\'s giant heart-shaped basin is a churning sea of solid nitrogen ice that bubbles up like a slow lava lamp, proving Pluto is geologically alive.',
        mediaType: 'image',
        mediaUrl:
          '/assets/objects/800px-Pluto-in-True-Color-High-Res-af03f8ae.jpg',
        position: [-15, 0, -25],
        beaconColor: '#38bdf8',
        landmarkLabel: 'Sputnik Planitia Ice Heart',
        radius: 6,
      },
      {
        id: 'horizons-poi-2',
        botId: 'new-horizons',
        title: 'Hillary Montes Water-Ice Peaks',
        description:
          'Photographed jagged 3.5-kilometer-high mountain chains composed of water ice that is as hard as granite at minus 230 degrees Celsius.',
        scienceTitle: '3,500-Meter-High Bedrock of Frozen Water',
        scientificDiscovery:
          'Photographed jagged 3.5-kilometer-high mountain chains composed of water ice that is as hard as granite at minus 230 degrees Celsius.',
        mediaType: null,
        mediaUrl: '',
        position: [18, 0, -55],
        beaconColor: '#67e8f9',
        landmarkLabel: 'Montes Hillary Peaks',
        radius: 6.5,
      },
      {
        id: 'horizons-poi-3',
        botId: 'new-horizons',
        title: 'Arrokoth Primordial Contact Binary',
        description:
          'Encountered the most distant primitive world ever explored, proving planets formed through gentle low-speed pebble mergers rather than violent shattering collisions.',
        scienceTitle: 'Gentle Planetary Assembly Building Block',
        scientificDiscovery:
          'Encountered the most distant primitive world ever explored, proving planets formed through gentle low-speed pebble mergers rather than violent shattering collisions.',
        mediaType: null,
        mediaUrl: '',
        position: [0, 0, -86],
        beaconColor: '#06b6d4',
        landmarkLabel: 'Arrokoth Primitive Object',
        radius: 7,
      },
    ],
  },
];

export const LIVE_ARCHIVE_BOTS: LiveArchiveBot[] = [
  
  {
    id: 'live-luna9',
    name: 'Luna 9',
    frontierId: 'moon',
    isActive: false,
    activeStatusText: 'Concluded · Silent in Lunar Basalt',
    launchDate: 'Jan 31, 1966',
    operator: 'Lavochkin / Soviet Space Program',
   
    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA NSSDC ID: 1966-006A / Lavochkin Museum Photo)',
    photoCaption: 'Spherical lander with unfolded petal covers in Oceanus Procellarum',
    keyDiscoveries: [
      'Proved lunar surface is solid rock and compressed regolith (not quicksand)',
      'Captured first panoramic photography of extraterrestrial rocks and craters',
      'Measured ambient radiation levels directly on lunar soil',
    ],
    positionType: 'surface_coordinates',
    surfaceCoordinates: {
      latitude: '7.08° N',
      longitude: '64.37° W',
      siteName: 'Oceanus Procellarum (Ocean of Storms)',
      mapXPercent: 22,
      mapYPercent: 44,
    },
  },
  {
    id: 'live-lrv',
    name: 'Apollo Lunar Roving Vehicles (LRV-1, 2 & 3)',
    frontierId: 'moon',
    isActive: false,
    activeStatusText: 'Concluded · Parked at Apollo Landing Sites',
    launchDate: '1971 - 1972',
    operator: 'NASA Marshall Space Flight Center / Boeing',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA Apollo 15 Photo AS15-88-11901)',
    photoCaption: 'LRV-1 parked against the backdrop of Mount Hadley Delta',
    keyDiscoveries: [
      'Enabled exploration across 35 km of lunar highlands and canyon slopes',
      'Recovered the 4-billion-year-old Genesis Rock (Sample 15415)',
      'High-gain antenna broadcast first live color television of lunar ascent module launch',
    ],
    positionType: 'surface_coordinates',
    surfaceCoordinates: {
      latitude: '26.13° N',
      longitude: '3.63° E',
      siteName: 'Hadley-Apennine Base (Apollo 15)',
      mapXPercent: 52,
      mapYPercent: 32,
    },
  },
  {
    id: 'live-retroreflectors',
    name: 'Lunar Laser Ranging Retroreflectors',
    frontierId: 'moon',
    isActive: true,
    activeStatusText: 'ACTIVE TODAY · Weekly Laser Measurements',
    launchDate: 'July 21, 1969 - Present',
    operator: 'NASA / Observatoire de la Côte d’Azur / McDonald Obs',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA Apollo 11 Photo AS11-40-5952)',
    photoCaption: 'Buzz Aldrin placing the 100-prism silica retroreflector array on Mare Tranquillitatis',
    keyDiscoveries: [
      'Measures Earth-Moon distance to within 1 millimeter accuracy via laser timing',
      'Proved the Moon is receding from Earth at exactly 3.82 cm/year due to tidal drag',
      'Confirmed Einstein’s strong equivalence principle with no variation down to parts per trillion',
    ],
    positionType: 'surface_coordinates',
    surfaceCoordinates: {
      latitude: '0.67° N',
      longitude: '23.47° E',
      siteName: 'Tranquility Base (Sea of Tranquility)',
      mapXPercent: 62,
      mapYPercent: 48,
    },
  },


  {
    id: 'live-mars3',
    name: 'Mars 3 Lander',
    frontierId: 'mars',
    isActive: false,
    activeStatusText: 'Concluded · Silent in Ptolemaeus Crater',
    launchDate: 'May 28, 1971',
    operator: 'Soviet Space Program',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA HiRISE Orbiter Image ESP_031069_1350)',
    photoCaption: 'HiRISE satellite reconnaissance showing Mars 3 parachute and lander hardware in 2013',
    keyDiscoveries: [
      'First spacecraft to survive atmospheric entry and soft-land on Mars',
      'Recorded initial atmospheric temperature and pressure during planetary dust storm',
      'Demonstrated supersonic drogue parachute deployment in CO2 atmosphere',
    ],
    positionType: 'surface_coordinates',
    surfaceCoordinates: {
      latitude: '45.00° S',
      longitude: '158.00° W',
      siteName: 'Ptolemaeus Crater (Terra Sirenum)',
      mapXPercent: 28,
      mapYPercent: 72,
    },
  },
  {
    id: 'live-opportunity',
    name: 'Opportunity Rover (MER-B)',
    frontierId: 'mars',
    isActive: false,
    activeStatusText: 'Concluded · Preserved in Perseverance Valley',
    launchDate: 'July 7, 2003 (Landed Jan 25, 2004)',
    operator: 'NASA Jet Propulsion Laboratory',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA/JPL-Caltech/Cornell/ASU PIA10214)',
    photoCaption: 'Opportunity Pancam panoramic selfie showing solar arrays over Victoria Crater',
    keyDiscoveries: [
      'Discovered hematite blueberries confirming ancient standing liquid water',
      'Drove 45.16 kilometers (28.06 miles), the off-world driving marathon record',
      'Discovered first iron-nickel meteorite ever found on another world',
    ],
    positionType: 'surface_coordinates',
    surfaceCoordinates: {
      latitude: '1.95° S',
      longitude: '5.53° W',
      siteName: 'Endeavour Crater Rim (Perseverance Valley)',
      mapXPercent: 48,
      mapYPercent: 52,
    },
  },
  {
    id: 'live-perseverance',
    name: 'Perseverance Rover & Ingenuity',
    frontierId: 'mars',
    isActive: true,
    activeStatusText: 'ACTIVE TODAY · Drilling Ancient River Delta',
    launchDate: 'July 30, 2020 (Landed Feb 18, 2021)',
    operator: 'NASA Jet Propulsion Laboratory',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA/JPL-Caltech/MSSS PIA24424)',
    photoCaption: 'Perseverance high-resolution Mastcam-Z portrait with Ingenuity nearby at Wright Brothers Field',
    keyDiscoveries: [
      'Identified clay minerals and organic carbon molecules in Jezero ancient river delta',
      'Cached 25+ hermetically sealed titanium rock cores for Mars Sample Return',
      'Ingenuity completed 72 powered flights in Mars atmosphere (first off-world aircraft)',
    ],
    positionType: 'surface_coordinates',
    surfaceCoordinates: {
      latitude: '18.38° N',
      longitude: '77.58° E',
      siteName: 'Jezero Crater (Ancient Lake Fan)',
      mapXPercent: 71,
      mapYPercent: 41,
    },
  },


  {
    id: 'live-pioneer10',
    name: 'Pioneer 10',
    frontierId: 'deep',
    isActive: false,
    activeStatusText: 'Concluded · Silent Interstellar Drift',
    launchDate: 'March 2, 1972',
    operator: 'NASA Ames Research Center',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA Ames Image P-12443 Plaque Engraving)',
    photoCaption: 'Gold-anodized aluminum pictorial greeting plaque mounted to probe antenna struts',
    keyDiscoveries: [
      'First spacecraft to successfully navigate the Asteroid Belt safely',
      'Captured first close-up photography of Jupiter and discovered intense radiation belts',
      'First human spacecraft to venture past all major planetary orbits (Neptune)',
    ],
    positionType: 'deep_space_vector',
    deepSpaceTelemetry: {
      initialDistanceKm: 13620000000,
      speedKmPerSec: 11.9,
      directionConstellation: 'Taurus (Heading toward Aldebaran)',
      speedDisplay: '42,840 km/h (11.9 km/s)',
      roundTripLightHours: '25.2 Hours',
    },
  },
  {
    id: 'live-voyager1',
    name: 'Voyager 1',
    frontierId: 'deep',
    isActive: true,
    activeStatusText: 'ACTIVE TODAY · Transmitting from Interstellar Void',
    launchDate: 'Sept 5, 1977',
    operator: 'NASA Jet Propulsion Laboratory',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA JPL Image P-22998 Voyager Craft & Golden Record)',
    photoCaption: 'Voyager Golden Record cover showing interstellar pulsars and Earth address diagrams',
    keyDiscoveries: [
      'Discovered active sulfur volcanoes on Jupiter’s moon Io and intricate rings at Saturn',
      'First spacecraft to cross the heliopause into true interstellar galactic space (Aug 25, 2012)',
      'Captured the legendary Pale Blue Dot portrait of Earth across 6 billion kilometers',
    ],
    positionType: 'deep_space_vector',
    deepSpaceTelemetry: {
      initialDistanceKm: 24480000000,
      speedKmPerSec: 16.9,
      directionConstellation: 'Ophiuchus (North of Celestial Equator)',
      speedDisplay: '60,840 km/h (16.9 km/s)',
      roundTripLightHours: '45.3 Hours',
    },
  },
  {
    id: 'live-newhorizons',
    name: 'New Horizons',
    frontierId: 'deep',
    isActive: true,
    activeStatusText: 'ACTIVE TODAY · Mapping Deep Kuiper Belt Dust',
    launchDate: 'Jan 19, 2006',
    operator: 'NASA / Johns Hopkins Applied Physics Laboratory',

    placeholderPhotoNote: '// TODO: replace with verified NASA source (NASA/JHUAPL/SwRI PIA19952 Pluto Heart Portrait)',
    photoCaption: 'High-resolution true color view of Pluto showing Sputnik Planitia nitrogen glacier heart',
    keyDiscoveries: [
      'Discovered Pluto’s beating heart: convective nitrogen ice glaciers in Sputnik Planitia',
      'Discovered 3.5 km high mountains composed of granite-hard bedrock water ice',
      'Explored Arrokoth, revealing primitive contact binary formation at solar system genesis',
    ],
    positionType: 'deep_space_vector',
    deepSpaceTelemetry: {
      initialDistanceKm: 8870000000,
      speedKmPerSec: 13.7,
      directionConstellation: 'Sagittarius (Heading toward galactic center)',
      speedDisplay: '49,320 km/h (13.7 km/s)',
      roundTripLightHours: '16.4 Hours',
    },
  },
];

export const SIMULATION_OBSTACLES: SimulationObstacle[] = [
  {
    id: 'eagle-crater',
    name: 'Eagle Crater Rim',
    xMeters: 140,
    type: 'crater',
    title: 'The Hole-in-One Landing',
    fact: 'Opportunity made an astonishing "hole-in-one" landing on January 25, 2004, bouncing inside its protective airbags and rolling directly into the center of this small 22-meter impact crater!',
    historyDate: 'Sol 1 · Jan 2004',
  },
  {
    id: 'troy-sand',
    name: 'Soft Sand of "Troy"',
    xMeters: 380,
    type: 'dune',
    title: 'Trapped in Powder Sand',
    fact: 'Opportunity and its sister Spirit frequently fought treacherous soft sand called "Troy". Opportunity once spun its wheels in place for over five weeks before JPL engineers safely guided it out using a replica rover in an Earth sandbox!',
    historyDate: 'Sol 446 · May 2005',
  },
  {
    id: 'heat-shield-rock',
    name: 'Heat Shield Meteorite',
    xMeters: 660,
    type: 'meteorite',
    title: 'The First Extraterrestrial Meteorite',
    fact: 'While examining the wreckage of its own discarded heat shield, Opportunity spotted a basketball-sized black rock. Chemical analysis proved it was an iron-nickel meteorite—the first meteorite ever identified on another planet!',
    historyDate: 'Sol 345 · Jan 2005',
  },
  {
    id: 'victoria-edge',
    name: 'Endurance & Victoria Cliff Edge',
    xMeters: 920,
    type: 'rock',
    title: 'Peering into Ancient Bedrock',
    fact: 'Opportunity braved steep 30-degree slopes to drive down into gigantic impact craters. By studying exposed cliff faces, it revealed distinct mineral layers left behind by ancient evaporative lakes.',
    historyDate: 'Sol 1,300+ · 2007',
  },
];

export const ROVER_ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'mast',
    name: 'Panoramic Camera Mast (Pancam)',
    role: 'The Eyes on High',
    simpleExplanation:
      'Stands at human eye height (1.5 meters) so the rover can look around in full 360-degree color, spot dangerous rocks ahead, and navigate safely across the dunes.',
    cx: 260,
    cy: 70,
  },
  {
    id: 'solar',
    name: 'Solar Panel Wings',
    role: 'Solar Power Collector',
    simpleExplanation:
      'Gathers sunlight to recharge the rover\'s lithium batteries. When Martian dust storms block the sky, these panels struggle to produce even enough power to light a single lightbulb.',
    cx: 410,
    cy: 165,
  },
  {
    id: 'antenna',
    name: 'High-Gain Dish Antenna',
    role: 'The Long-Distance Voice',
    simpleExplanation:
      'Steers itself precisely toward Earth to beam science pictures and sensor data straight to giant NASA Deep Space Network receiver dishes back home.',
    cx: 510,
    cy: 110,
  },
  {
    id: 'wheels',
    name: 'Rocker-Bogie 6-Wheel Drive',
    role: 'All-Terrain Suspension',
    simpleExplanation:
      'A clever mechanical balance system with six independent motorized aluminum wheels that allows the rover to climb over rocks bigger than the wheel itself without tipping over.',
    cx: 320,
    cy: 310,
  },
  {
    id: 'arm',
    name: 'Instrument Deployment Arm (IDD)',
    role: 'The Robotic Hand & Geologist',
    simpleExplanation:
      'A flexible robotic limb holding a microscopic imager, rock abrasion drill, and alpha particle spectrometer to press directly against rocks and read their chemistry.',
    cx: 140,
    cy: 250,
  },
];
