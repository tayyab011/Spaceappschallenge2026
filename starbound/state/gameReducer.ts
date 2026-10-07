import { MISSIONS, getRequiredGemsForPrize } from '../data/missions';
import { DISCOVERIES, Discovery } from '../data/discoveries';
import { GEM_PRIZE_TEXT, getGemPrizeForMission } from '../data/rewards';

export type ScreenState = 'landing' | 'zooming' | 'intro' | 'playing' | 'complete' | 'final';

export interface GameState {
  screen: ScreenState;
  currentMissionIndex: number;
  missionAttempt: number;
  missionTimeSeconds: number;
  totalTimeSeconds: number;
  distanceMeters: number;
  gemsCollected: number;
  totalGemsCollected: number;
  earnedGemPrizeIds: string[];
  showGemPrizeCelebration: boolean;
  discoveredIds: string[];
  activeDiscovery: Discovery | null;
  isJournalOpen: boolean;
  passedCheckpoints: string[];
  wheelSlip: number; 
  rockCounter: number; 
  isFreedFromSand: boolean;
  batteryLevel: number; 
  isChargingSolar: boolean;
  showOrbitHint: boolean;
  orbitHintText: string;
  roverPosition: [number, number, number];
  roverHeading: number; 
  nearScanTargetId: string | null;
  cameraMode: 'fpv' | 'third';
  ambientSoundEnabled: boolean;
  roverSoundEnabled: boolean;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'FINISH_ZOOM' }
  | { type: 'START_MISSION' }
  | { type: 'RESTART_MISSION' }
  | { type: 'END_GAME' }
  | { type: 'RETURN_TO_MENU' }
  | { type: 'TICK_TIME' }
  | { type: 'ADD_DISTANCE'; meters: number }
  | { type: 'COLLECT_GEM' }
  | { type: 'DISMISS_GEM_PRIZE_CELEBRATION' }
  | { type: 'PASS_CHECKPOINT'; id: string }
  | { type: 'TRIGGER_SCAN'; discoveryId: string }
  | { type: 'SET_NEAR_SCAN_TARGET'; targetId: string | null }
  | { type: 'CLOSE_DISCOVERY' }
  | { type: 'OPEN_JOURNAL' }
  | { type: 'CLOSE_JOURNAL' }
  | { type: 'VIEW_DISCOVERY'; discoveryId: string }
  | { type: 'ROCK_ROVER'; direction: 'forward' | 'backward' }
  | { type: 'SPIN_TIRES' }
  | { type: 'UPDATE_BATTERY'; amount: number }
  | { type: 'SET_CHARGING_SOLAR'; isCharging: boolean }
  | { type: 'SHOW_HINT'; message?: string }
  | { type: 'DISMISS_HINT' }
  | { type: 'COMPLETE_MISSION' }
  | { type: 'NEXT_MISSION' }
  | { type: 'SELECT_MISSION'; missionIndex: number; skipIntro?: boolean }
  | { type: 'TOGGLE_CAMERA_MODE' }
  | { type: 'SET_CAMERA_MODE'; mode: 'fpv' | 'third' }
  | { type: 'TOGGLE_AMBIENT_SOUND' }
  | { type: 'TOGGLE_ROVER_SOUND' }
  | { type: 'RESTART_GAME' }
  | { type: 'UPDATE_ROVER_TRANSFORM'; position: [number, number, number]; heading: number };

export const initialGameState: GameState = {
  screen: 'landing',
  currentMissionIndex: 0,
  missionAttempt: 0,
  missionTimeSeconds: 0,
  totalTimeSeconds: 0,
  distanceMeters: 0,
  gemsCollected: 0,
  totalGemsCollected: 0,
  earnedGemPrizeIds: [],
  showGemPrizeCelebration: false,
  discoveredIds: [],
  activeDiscovery: null,
  isJournalOpen: false,
  passedCheckpoints: [],
  wheelSlip: 35,
  rockCounter: 0,
  isFreedFromSand: false,
  batteryLevel: 25,
  isChargingSolar: false,
  showOrbitHint: false,
  orbitHintText: '',
  roverPosition: [0, 0, 0],
  roverHeading: 0,
  nearScanTargetId: null,
  cameraMode: 'third',
  ambientSoundEnabled: true,
  roverSoundEnabled: true,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        screen: 'zooming',
      };

    case 'FINISH_ZOOM':
      return {
        ...state,
        screen: 'intro',
        roverPosition: [...MISSIONS[0].startPosition],
        missionTimeSeconds: 0,
        gemsCollected: 0,
        showGemPrizeCelebration: false,
        passedCheckpoints: [],
      };

    case 'START_MISSION': {
      const current = MISSIONS[state.currentMissionIndex];
      return {
        ...state,
        screen: 'playing',
        roverPosition: current ? [...current.startPosition] : [0, 0, 0],
        roverHeading: 0,
        missionTimeSeconds: 0,
        gemsCollected: 0,
        showGemPrizeCelebration: false,
        passedCheckpoints: [],
        wheelSlip: current?.type === 'stuck' ? 40 : 0,
        rockCounter: 0,
        isFreedFromSand: current?.type !== 'stuck',
        batteryLevel: current?.type === 'solar' ? 20 : 100,
        isChargingSolar: false,
        showOrbitHint: false,
        nearScanTargetId: null,
      };
    }

    case 'RESTART_MISSION': {
      const current = MISSIONS[state.currentMissionIndex];
      const missionDiscoveryIds = current?.discoveryIds ?? [];
      const filteredDiscoveredIds = state.discoveredIds.filter(
        (id) => !missionDiscoveryIds.includes(id)
      );
      return {
        ...state,
        screen: 'playing',
        missionAttempt: state.missionAttempt + 1,
        roverPosition: current ? [...current.startPosition] : [0, 0, 0],
        roverHeading: 0,
        missionTimeSeconds: 0,
        totalGemsCollected: Math.max(0, state.totalGemsCollected - state.gemsCollected),
        gemsCollected: 0,
        discoveredIds: filteredDiscoveredIds,
        activeDiscovery: null,
        isJournalOpen: false,
        showGemPrizeCelebration: false,
        passedCheckpoints: [],
        wheelSlip: current?.type === 'stuck' ? 40 : 0,
        rockCounter: 0,
        isFreedFromSand: current?.type !== 'stuck',
        batteryLevel: current?.type === 'solar' ? 20 : 100,
        isChargingSolar: false,
        showOrbitHint: false,
        nearScanTargetId: null,
      };
    }

    case 'END_GAME':
      return {
        ...state,
        screen: 'final',
        activeDiscovery: null,
        isJournalOpen: false,
        showOrbitHint: false,
        showGemPrizeCelebration: false,
      };

    case 'RETURN_TO_MENU':
      return {
        ...initialGameState,
        screen: 'landing',
        missionAttempt: state.missionAttempt + 1,
        ambientSoundEnabled: state.ambientSoundEnabled,
        roverSoundEnabled: state.roverSoundEnabled,
      };

    case 'TICK_TIME':
      if (state.screen !== 'playing') return state;
      return {
        ...state,
        missionTimeSeconds: state.missionTimeSeconds + 1,
        totalTimeSeconds: state.totalTimeSeconds + 1,
      };

    case 'ADD_DISTANCE':
      return {
        ...state,
        distanceMeters: Math.round((state.distanceMeters + action.meters) * 10) / 10,
      };

    case 'COLLECT_GEM': {
      const currentMission = MISSIONS[state.currentMissionIndex];
      const nextGemsCollected = state.gemsCollected + 1;
      const nextTotalGems = state.totalGemsCollected + 1;

      if (!currentMission) {
        return {
          ...state,
          gemsCollected: nextGemsCollected,
          totalGemsCollected: nextTotalGems,
        };
      }

      const requiredForPrize = getRequiredGemsForPrize(currentMission);
      const missionPrize = getGemPrizeForMission(currentMission.id);
      const alreadyEarned = missionPrize
        ? state.earnedGemPrizeIds.includes(missionPrize.id)
        : false;
      const justUnlocked =
        Boolean(missionPrize) && !alreadyEarned && nextGemsCollected >= requiredForPrize;

      const nextEarnedIds =
        justUnlocked && missionPrize
          ? [...state.earnedGemPrizeIds, missionPrize.id]
          : state.earnedGemPrizeIds;

      return {
        ...state,
        gemsCollected: nextGemsCollected,
        totalGemsCollected: nextTotalGems,
        earnedGemPrizeIds: nextEarnedIds,
        showGemPrizeCelebration: justUnlocked ? true : state.showGemPrizeCelebration,
        showOrbitHint: justUnlocked ? true : state.showOrbitHint,
        orbitHintText: justUnlocked ? GEM_PRIZE_TEXT.orbitCelebration : state.orbitHintText,
      };
    }

    case 'DISMISS_GEM_PRIZE_CELEBRATION':
      return {
        ...state,
        showGemPrizeCelebration: false,
      };

    case 'PASS_CHECKPOINT': {
      if (state.passedCheckpoints.includes(action.id)) return state;
      const nextPassed = [...state.passedCheckpoints, action.id];
      const currentMission = MISSIONS[state.currentMissionIndex];
      const allPassed =
        currentMission?.checkpoints &&
        currentMission.checkpoints.every((cp) => nextPassed.includes(cp.id));

      return {
        ...state,
        passedCheckpoints: nextPassed,
        showOrbitHint: true,
        orbitHintText: allPassed
          ? 'Great driving! You reached the crater rim!'
          : 'Ring cleared! Keep rolling to the next glowing ring!',
      };
    }

    case 'SET_NEAR_SCAN_TARGET':
      if (state.nearScanTargetId === action.targetId) return state;
      return {
        ...state,
        nearScanTargetId: action.targetId,
      };

    case 'TRIGGER_SCAN': {
      const disc = DISCOVERIES.find((d) => d.id === action.discoveryId);
      if (!disc) return state;
      const alreadyFound = state.discoveredIds.includes(action.discoveryId);
      const nextFound = alreadyFound
        ? state.discoveredIds
        : [...state.discoveredIds, action.discoveryId];

      return {
        ...state,
        discoveredIds: nextFound,
        activeDiscovery: disc,
        showOrbitHint: false,
      };
    }

    case 'CLOSE_DISCOVERY':
      return {
        ...state,
        activeDiscovery: null,
      };

    case 'OPEN_JOURNAL':
      return {
        ...state,
        isJournalOpen: true,
      };

    case 'CLOSE_JOURNAL':
      return {
        ...state,
        isJournalOpen: false,
      };

    case 'VIEW_DISCOVERY': {
      const d = DISCOVERIES.find((item) => item.id === action.discoveryId);
      return {
        ...state,
        activeDiscovery: d || null,
      };
    }

    case 'ROCK_ROVER': {
      if (state.isFreedFromSand) return state;
      const nextRockCount = state.rockCounter + 1;
      const freed = nextRockCount >= 6;
      const nextSlip = freed ? 0 : Math.max(10, 80 - nextRockCount * 12);

      return {
        ...state,
        rockCounter: nextRockCount,
        wheelSlip: nextSlip,
        isFreedFromSand: freed,
        showOrbitHint: true,
        orbitHintText: freed
          ? 'Hooray! Oppy wiggled free from the soft dune!'
          : action.direction === 'forward'
          ? 'Nice! Now gently reverse backward to build momentum!'
          : 'Great rhythm! Now nudge forward again!',
      };
    }

    case 'SPIN_TIRES': {
      const wobbleSlip = Math.min(95, state.wheelSlip + 8);
      return {
        ...state,
        wheelSlip: wobbleSlip,
        showOrbitHint: true,
        orbitHintText:
          'Careful! Spinning too fast slips the sand. Try rocking back and forth gently!',
      };
    }

    case 'UPDATE_BATTERY': {
      const nextBat = Math.min(100, Math.max(0, state.batteryLevel + action.amount));
      return {
        ...state,
        batteryLevel: Math.round(nextBat),
      };
    }

    case 'SET_CHARGING_SOLAR': {
      if (state.isChargingSolar === action.isCharging) return state;
      return {
        ...state,
        isChargingSolar: action.isCharging,
      };
    }

    case 'SHOW_HINT': {
      const current = MISSIONS[state.currentMissionIndex];
      return {
        ...state,
        showOrbitHint: true,
        orbitHintText: action.message || current?.hint || "Keep exploring! You're doing great!",
      };
    }

    case 'DISMISS_HINT':
      return {
        ...state,
        showOrbitHint: false,
      };

    case 'COMPLETE_MISSION':
      return {
        ...state,
        screen: 'complete',
        showGemPrizeCelebration: false,
      };

    case 'NEXT_MISSION': {
      const nextIdx = state.currentMissionIndex + 1;
      if (nextIdx >= MISSIONS.length) {
        return {
          ...state,
          screen: 'final',
        };
      }
      const nextMission = MISSIONS[nextIdx];
      return {
        ...state,
        currentMissionIndex: nextIdx,
        screen: 'intro',
        roverPosition: nextMission ? [...nextMission.startPosition] : [0, 0, 0],
        roverHeading: 0,
        passedCheckpoints: [],
        gemsCollected: 0,
        showGemPrizeCelebration: false,
        missionTimeSeconds: 0,
        nearScanTargetId: null,
      };
    }

    case 'SELECT_MISSION': {
      const missionIdx = Math.max(0, Math.min(MISSIONS.length - 1, action.missionIndex));
      const selectedMission = MISSIONS[missionIdx];
      const targetScreen = action.skipIntro ? 'playing' : 'intro';

      return {
        ...state,
        currentMissionIndex: missionIdx,
        missionAttempt: state.missionAttempt + 1,
        screen: targetScreen,
        roverPosition: selectedMission ? [...selectedMission.startPosition] : [0, 0, 0],
        roverHeading: 0,
        missionTimeSeconds: 0,
        gemsCollected: 0,
        showGemPrizeCelebration: false,
        passedCheckpoints: [],
        wheelSlip: selectedMission?.type === 'stuck' ? 40 : 0,
        rockCounter: 0,
        isFreedFromSand: selectedMission?.type !== 'stuck',
        batteryLevel: selectedMission?.type === 'solar' ? 20 : 100,
        isChargingSolar: false,
        showOrbitHint: false,
        nearScanTargetId: null,
        isJournalOpen: false,
        activeDiscovery: null,
      };
    }

    case 'TOGGLE_CAMERA_MODE':
      return {
        ...state,
        cameraMode: state.cameraMode === 'fpv' ? 'third' : 'fpv',
      };

    case 'SET_CAMERA_MODE':
      return {
        ...state,
        cameraMode: action.mode,
      };

    case 'TOGGLE_AMBIENT_SOUND':
      return {
        ...state,
        ambientSoundEnabled: !state.ambientSoundEnabled,
      };

    case 'TOGGLE_ROVER_SOUND':
      return {
        ...state,
        roverSoundEnabled: !state.roverSoundEnabled,
      };

    case 'RESTART_GAME':
      return {
        ...initialGameState,
        screen: 'intro',
        currentMissionIndex: 0,
        missionAttempt: state.missionAttempt + 1,
        roverPosition: [...MISSIONS[0].startPosition],
        ambientSoundEnabled: state.ambientSoundEnabled,
        roverSoundEnabled: state.roverSoundEnabled,
      };

    case 'UPDATE_ROVER_TRANSFORM':
      return {
        ...state,
        roverPosition: action.position,
        roverHeading: action.heading,
      };

    default:
      return state;
  }
}
