
export type ObjectBody = 'moon' | 'mars'|'solar system';

export interface ObjectProps {
  id: string;
  name: string;
  mission: string;
  agency: string | null;
  body: ObjectBody;
  lat: number | null;
  lon: number | null;
  left_behind: number | null;
  last_contact: string | null;
  why_left: string | null;
  science_enabled: string | null;
  image: string | null;
  image_credit: string | null;
  source_url: string | null;
  dataset_id: string | null;
  verified: boolean;
  story_id?: string | null;
  image_source_url:string | null;
  coordinates_source_url: string |null;
  status:string;
  location_state:string;
  last_known_location:string;
  hardware:string;
  current_status:string;
}

export interface ObjectFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] } | null;
  properties: ObjectProps;
}

export interface ObjectCollection {
  type: 'FeatureCollection';
  features: ObjectFeature[];
}

export interface VerifiedObject extends ObjectProps {
  verified: true;
  agency: string;
  lat: number;
  lon: number;
  left_behind: number;
  last_contact: string;
  why_left: string;
  science_enabled: string;
  image: string;
  image_credit: string;
  source_url: string;
  dataset_id: string;
}

export function isVerifiedObject(p: ObjectProps): p is VerifiedObject {
  return (
    p.verified === true &&
    typeof p.lat === 'number' &&
    typeof p.lon === 'number' &&
    typeof p.left_behind === 'number' &&
    !!p.agency &&
    !!p.last_contact &&
    !!p.why_left &&
    !!p.science_enabled &&
    !!p.image &&
    !!p.image_credit &&
    !!p.source_url &&
    !!p.dataset_id
  );
}
