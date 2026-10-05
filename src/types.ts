export type FrontierId = 'moon' | 'mars' | 'deep';

export interface FrontierInfo {
  id: FrontierId;
  name: string;
  subtitle: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  summary: string;
  badgeAccent: string;
}

export interface SimulationPOI {
  id: string;
  botId: string;
  title: string;
  description?: string;
  scienceTitle: string;
  scientificDiscovery: string; // The real scientific finding in simple language
  mediaType: 'image' | 'video' | null; // null = text-only fallback
  mediaUrl: string; // TODO: add verified NASA image/video URL for this discovery
  position: [number, number, number]; // [x, y, z] in 3D world
  beaconColor: string;
  landmarkLabel: string;
  radius: number;
}

export interface BotMission {
  id: string;
  frontierId: FrontierId;
  category: 'First Ever Sent' | 'The Standout' | 'Most Recent / Still Active';
  name: string;
  operator: string;
  launchYear: string;
  status: string;
  location: string;
  teaser: string;
  whatItFound: string;
  whatHappened: string;
  diaryVoice: string;
  quoteNote?: string;
  twinStory?: {
    name: string;
    subtitle: string;
    voice: string;
    discovery: string;
    fate: string;
  };
  badge: {
    id: string;
    title: string;
    icon: string;
    summary: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
  simulationPOIs: SimulationPOI[];
  simulationEnv: {
    type: 'mars' | 'moon' | 'deep_space';
    groundColor: string;
    fogColor: string;
    skyColor: string;
    vehicleName: string;
    vehicleCockpitType: 'rover_camera' | 'lrv_dash' | 'probe_hull' | 'retro_dish';
    elevationScale?: number;
    terrainDataset?: 'MOLA' | 'LOLA' | 'N/A';
    terrainRegionName?: string;
  };
}

export interface LiveArchiveBot {
  id: string;
  name: string;
  frontierId: FrontierId;
  isActive: boolean;
  activeStatusText: string;
  launchDate: string;
  operator: string;
  // TODO: replace with verified NASA source
  placeholderPhotoNote: string;
  photoCaption: string;
  keyDiscoveries: string[];
  positionType: 'surface_coordinates' | 'deep_space_vector';
  surfaceCoordinates?: {
    latitude: string;
    longitude: string;
    siteName: string;
    mapXPercent: number; // 0 to 100 for SVG flat map
    mapYPercent: number;
  };
  deepSpaceTelemetry?: {
    initialDistanceKm: number;
    speedKmPerSec: number;
    directionConstellation: string;
    speedDisplay: string;
    roundTripLightHours: string;
  };
}

export interface SimulationObstacle {
  id: string;
  name: string;
  xMeters: number;
  type: 'crater' | 'dune' | 'rock' | 'meteorite';
  title: string;
  fact: string;
  historyDate: string;
}

export interface AnatomyPart {
  id: string;
  name: string;
  role: string;
  simpleExplanation: string;
  cx: number;
  cy: number;
}

