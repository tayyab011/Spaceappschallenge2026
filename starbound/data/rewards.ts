export interface GemPrize {
  id: string;
  missionId: string;
  missionNumber: number;
  name: string;
  shortName: string;
  description: string;
  kidsDescription: string;
  icon: string;
}

export interface FinalRewardTier {
  id: 'rookie' | 'intermediate' | 'pro';
  tierName: string;
  shortLabel: string;
  prizeName: string;
  minScore: number;
  badgeIcon: string;
  description: string;
  kidsDescription: string;
  encouragement: string;
  kidsEncouragement: string;
}

export const GEM_PRIZE_TEXT = {
  badgeTitle: 'Gem Prize',
  orbitCelebration: 'Wow, you found so many gems!',
  earnedHeading: 'Gem Prize Unlocked!',
  encourageTryAgain: 'Try again anytime to find them all!',
  kidsEncourageTryAgain: 'Find more gems next time!',
};

export const MISSION_GEM_PRIZES: GemPrize[] = [
  {
    id: 'gem-prize-mission-1',
    missionId: 'mission-1',
    missionNumber: 1,
    name: 'Crater Rim Crystal Prize',
    shortName: 'Crater Crystal',
    description: 'Collected bright Martian crystals while steering through the crater rings!',
    kidsDescription: 'You found bright Mars crystals! Great driving through the rings!',
    icon: '💎',
  },
  {
    id: 'gem-prize-mission-2',
    missionId: 'mission-2',
    missionNumber: 2,
    name: 'Rock Detective Gem Prize',
    shortName: 'Rock Detective Gem',
    description: 'Found sparkling gems while scanning ancient Martian rocks and landers!',
    kidsDescription: 'You found shiny rock gems! Great job scanning Mars rocks!',
    icon: '💠',
  },
  {
    id: 'gem-prize-mission-3',
    missionId: 'mission-3',
    missionNumber: 3,
    name: 'Sand Dune Hopper Prize',
    shortName: 'Dune Hopper Gem',
    description: 'Wiggled free from soft Martian sand and gathered hidden dune gems!',
    kidsDescription: 'Oppy wiggled out of sand! You found hidden dune gems!',
    icon: '✨',
  },
  {
    id: 'gem-prize-mission-4',
    missionId: 'mission-4',
    missionNumber: 4,
    name: 'Golden Sunbeam Gem Prize',
    shortName: 'Sunbeam Gem',
    description: 'Charged up on the sunny ridge and collected glowing solar gems!',
    kidsDescription: 'Sunlight charged up the rover! You found golden solar gems!',
    icon: '🌟',
  },
  {
    id: 'gem-prize-mission-5',
    missionId: 'mission-5',
    missionNumber: 5,
    name: 'Perseverance Valley Gem Prize',
    shortName: 'Valley Trail Gem',
    description: 'Followed the winding rover tracks and gathered gems on the way to Oppy!',
    kidsDescription: 'You followed the rover tracks! You found our friend Oppy!',
    icon: '👑',
  },
];

export const FINAL_REWARD_TIERS: FinalRewardTier[] = [
  {
    id: 'rookie',
    tierName: 'Rookie Explorer',
    shortLabel: 'Rookie Explorer',
    prizeName: 'Rookie Explorer Star Badge',
    minScore: 0,
    badgeIcon: '🌟',
    description:
      'You drove across rusty red hills, explored real NASA sites, and found our friend Opportunity!',
    kidsDescription: 'You drove on red hills! You found our friend Oppy!',
    encouragement: 'Every great space adventure begins with curious wheels on Mars!',
    kidsEncouragement: 'Great job driving on Mars!',
  },
  {
    id: 'intermediate',
    tierName: 'Intermediate Explorer',
    shortLabel: 'Intermediate Prize',
    prizeName: 'Intermediate Prize — Red Planet Pathfinder',
    minScore: 10,
    badgeIcon: '🏅',
    description:
      'Awesome driving! You uncovered Martian discoveries and collected a bright treasure of gems!',
    kidsDescription: 'Awesome driving on Mars today! You found lots of gems!',
    encouragement: 'Rover engineers on Earth would cheer for your steady driving!',
    kidsEncouragement: 'You are a super driver!',
  },
  {
    id: 'pro',
    tierName: 'Pro Explorer',
    shortLabel: 'Pro',
    prizeName: 'Pro Explorer Grand Trophy',
    minScore: 18,
    badgeIcon: '🏆',
    description:
      'Amazing work! You found almost every gem and scientific discovery across the Martian plains!',
    kidsDescription: 'You found almost every gem! You are a Mars star!',
    encouragement: 'You are a true Pro Explorer! Oppy would be so proud of you!',
    kidsEncouragement: 'Oppy is proud of you!',
  },
];

export function getGemPrizeForMission(missionId: string): GemPrize | undefined {
  return MISSION_GEM_PRIZES.find((prize) => prize.missionId === missionId);
}


export function getFinalRewardTier(
  totalGemsCollected: number,
  discoveriesFoundCount: number
): FinalRewardTier {
  const combinedScore = totalGemsCollected + discoveriesFoundCount * 2;
  for (let i = FINAL_REWARD_TIERS.length - 1; i >= 0; i--) {
    if (combinedScore >= FINAL_REWARD_TIERS[i].minScore) {
      return FINAL_REWARD_TIERS[i];
    }
  }
  return FINAL_REWARD_TIERS[0];
}
