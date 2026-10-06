export type DestinationChoice = 'mars' | 'moon' | 'deep_space';

export interface ChapterItem {
  id: string;
  title: string;
  shortLabel: string;
  pageNumber: number;
  pageStr: string; // e.g. "P.1", "P.4"
  destination?: DestinationChoice;
  soundScene?: 'space' | 'earth' | 'sputnik' | 'mars' | 'opportunity_climax' | 'opportunity_hope' | 'moon' | 'deep_space' | 'finale';
  autoSpeakText?: string;
}

export interface SpacecraftItem {
  id: string;
  name: string;
  nickname?: string;
  launchYear: string;
  tagline: string;
  kidDescription: string;
  funFact: string;
  placeholderLabel: string;
  iconType: 'rover' | 'probe' | 'telescope' | 'copter';
}

export interface PageSectionProps {
  id?: string;
  onNavigateToNext?: () => void;
  playSound?: (type: 'bloop' | 'whoosh' | 'chirp' | 'cheer') => void;
}
