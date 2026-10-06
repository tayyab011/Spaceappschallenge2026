export interface MissionCheckpoint {
  id: string;
  x: number;
  z: number;
  radius: number;
  label: string;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  goal: string; 
  gemCount: number;
  gemPrizeThreshold: number; 
  discoveryIds: string[];
  startPosition: [number, number, number];
  oppyPosition?: [number, number, number];
  arrivalRadius?: number;
  checkpoints?: MissionCheckpoint[];
  type: 'drive' | 'scan' | 'stuck' | 'solar' | 'tracks';
  hint: string;
}


export const startPosition: [number, number, number] = [0, 0, 10];
export const oppyPosition: [number, number, number] = [0, 0, 175];
export const arrivalRadius = 5.5;
export const OPPY_REVEAL_DISTANCE = 60;


export const OPPY_TRACK_WAYPOINTS: [number, number][] = [
  [startPosition[0], startPosition[2]], 
  [7, 38],                              
  [-7, 66],                             
  [8, 94],                              
  [-7, 122],                            
  [5, 148],                             
  [oppyPosition[0], oppyPosition[2]],   
];


export function getRequiredGemsForPrize(mission: Mission): number {
  const threshold = mission.gemPrizeThreshold ?? 0.8;
  if (threshold <= 1) {
    return Math.max(1, Math.ceil(mission.gemCount * threshold));
  }
  return Math.max(1, Math.min(mission.gemCount, Math.round(threshold)));
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    number: 1,
    title: 'Learn to Drive',
    goal: 'Drive through the 3 glowing rings to reach the crater edge!',
    gemCount: 5,
    gemPrizeThreshold: 0.8,
    discoveryIds: [],
    startPosition: [0, 0, 0],
    type: 'drive',
    hint: 'Use WASD, arrow keys, or the steering buttons to roll forward!',
    checkpoints: [
      { id: 'cp-1', x: 0, z: -12, radius: 3.5, label: 'Ring 1' },
      { id: 'cp-2', x: 8, z: -25, radius: 3.5, label: 'Ring 2' },
      { id: 'cp-3', x: 16, z: -40, radius: 4.0, label: 'Crater Rim' },
    ],
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'Rock Detective',
    goal: 'Drive to the strange shiny rocks and scan them with your camera!',
    gemCount: 5,
    gemPrizeThreshold: 0.8,
    discoveryIds: ['martian-blueberries', 'insight-lander'],
    startPosition: [16, 0, -40],
    type: 'scan',
    hint: 'Drive close to the glowing beacon to scan the discovery!',
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'Stuck in the Sand!',
    goal: 'Rock gently forward and backward to wiggle free from soft soil!',
    gemCount: 5,
    gemPrizeThreshold: 0.8,
    discoveryIds: ['purgatory-ripple'],
    startPosition: [2, 0, -8],
    type: 'stuck',
    hint: "Don't just hold forward! Rock back and forth gently like a swing!",
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'Chase the Sun',
    goal: "Drive into the giant Golden Sunbeam on the hill to recharge Oppy's solar battery!",
    gemCount: 5,
    gemPrizeThreshold: 0.8,
    discoveryIds: ['solar-sun-chase', 'future-mars-base'],
    startPosition: [6, 0, 8],
    type: 'solar',
    hint: 'Look for the giant Golden Sunbeam streaming from the sky onto the hill and park inside it!',
  },
  {
    id: 'mission-5',
    number: 5,
    title: 'Find Oppy',
    goal: 'Follow the glowing golden rover tracks across the plain to find Opportunity!',
    gemCount: 5,
    gemPrizeThreshold: 0.8,
    discoveryIds: ['oppy-perseverance-valley'],
    startPosition,
    oppyPosition,
    arrivalRadius,
    type: 'tracks',
    hint: 'Keep following the tracks!',
  },
];
