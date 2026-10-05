import type { AppView } from './components/Navbar';
import type { DestinationChoice } from './landing-story/types';

export const PATH_BY_VIEW: Partial<Record<AppView, string>> = {
  entry: '/',
  coldopen: '/starbound',
  'oppy-story': '/starbound-kids',
  'kids-game': '/play-game',
  meetmyparts: '/meet-rover',
  'abandoned-stories': '/stories',
  simulation: '/simulation',
  anatomy: '/anatomy',
  recovery: '/recovery',
  admin: '/admin',
  map: '/map',
};

const VIEW_BY_PATH: Record<string, { view: AppView; mode: 'kids' | 'adult' }> = {
  '/': { view: 'entry', mode: 'kids' },
  '/starbound': { view: 'coldopen', mode: 'adult' },
  '/starbound-kids': { view: 'oppy-story', mode: 'kids' },
  '/play-game': { view: 'kids-game', mode: 'kids' },
  '/meet-rover': { view: 'meetmyparts', mode: 'kids' },
  '/stories': { view: 'abandoned-stories', mode: 'adult' },
  '/simulation': { view: 'simulation', mode: 'adult' },
  '/anatomy': { view: 'anatomy', mode: 'adult' },
  '/recovery': { view: 'recovery', mode: 'adult' },
  '/admin': { view: 'admin', mode: 'adult' }, 
  '/map': { view: 'map', mode: 'adult' },
};

export function routeFromPathname(pathname: string): { view: AppView; mode: 'kids' | 'adult' } | null {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return VIEW_BY_PATH[normalized] ?? null;
}

export function pathForView(view: AppView): string | null {
  return PATH_BY_VIEW[view] ?? null;
}

export function destinationFromHash(hash: string): DestinationChoice | null {
  const key = hash.replace(/^#/, '').toLowerCase();
  if (key === 'mars') return 'mars';
  if (key === 'moon') return 'moon';
  if (key === 'space') return 'deep_space';
  return null;
}

export function hashForDestination(dest: DestinationChoice): string {
  return dest === 'deep_space' ? '#space' : `#${dest}`;
}

/** Story links: /stories#opportunity opens that book in Abandoned Stories. */
export function pathForStory(storyId: string): string {
  return `/stories#${encodeURIComponent(storyId)}`;
}

export function storyIdFromHash(hash: string): string | null {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  return id || null;
}