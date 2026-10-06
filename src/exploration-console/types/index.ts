export type MissionType = 'surface_rover' | 'orbital_flyby';

export type EnvironmentType = 'mars' | 'moon' | 'jupiter_system' | 'saturn_system' | 'interplanetary';

export interface ScientificInstrument {
  id: string;
  name: string;
  acronym: string;
  type: 'spectrometer' | 'camera' | 'drill_abrasion' | 'particle_detector' | 'magnetometer' | 'radiometer';
  description: string;
  purpose: string;
  sampleTestName: string;
  targetElementsOrPhenomena: string[];
  dataUnit: string;
  referenceSpectra: {
    label: string;
    xLabel: string;
    yLabel: string;
    points: { x: number; y: number; label?: string }[];
  };
}

export interface MineralProportion {
  name: string;
  formula: string;
  percentage: number;
  color: string;
  simpleExplanation: string;
}

export interface ScienceSite {
  id: string;
  name: string;
  subTitle: string;
  coordinates: [number, number, number]; 
  radius: number;
  beaconColor: string;
  historicalDate: string;
  geologicFeature: string;
  primaryInstrumentId: string;

 media?: {
  type: 'photo' | 'video';
  url: string;
  caption?: string;
};
  plainEnglishTitle?: string;
  plainEnglishDiscovery?: string;
  purityScore?: number; 
  radiationLevelUsSv?: number; 
  densityCurve?: {
    min: number;
    current: number;
    max: number;
    unit: string;
    points: number[];
  };
  mineralRatio?: MineralProportion[];
  wireframeLayers?: string[];
  
  observations: {
    summary: string;
    empiricalPoints: string[];
  };
  measurementMethod: {
    summary: string;
    instrumentsUsed: string[];
    testProtocol: string[];
  };
  scientificDeterminations: {
    summary: string;
    keyConclusions: string[];
    chemicalFormulasOrModels?: string[];
  };
  whyItMatters: {
    summary: string;
    impactOnScience: string[];
  };
  
  nasaSources: {
    title: string;
    citation: string;
    url?: string;
  }[];
}

export interface NasaMission {
  id: string;
  number: number;
  name: string;
  missionFormalName: string;
  agency: string;
  launchDate: string;
  encounterOrArrivalDate: string;
  missionDuration: string;
  targetDestination: string;
  landingOrFlybyLocation: string;
  missionType: MissionType;
  envType: EnvironmentType;
  
  specs: {
    vehicleMassKg: number;
    powerSource: string;
    powerOutputWatts: number;
    communications: string;
    mobilityOrPropulsion: string;
  };

  environment: {
    gravityMps2: number;
    atmosphereDescription: string;
    ambientTempKelvin: string;
    dayLength: string;
    skyColorHex: string;
    fogColorHex: string;
    groundColorHex: string;
    sunIntensity: number;
    sunColorHex: string;
  };

  briefing: string;
  instruments: ScientificInstrument[];
  sites: ScienceSite[];
  nasaPrimarySource: string;
  historicalSignificance: string;
}

export interface TelemetryData {
  x: number;
  y: number;
  z: number;
  speed: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  distanceTraveledMeters: number;
  powerWatts: number;
  slopeGradePercent: number;
  inclineStatus: 'nominal' | 'steep_warning' | 'critical_tilt';
  tractionSlip: number;
}
