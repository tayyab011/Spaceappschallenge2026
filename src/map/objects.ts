import raw from '../../data/objects.geojson?raw';
import { isVerifiedObject } from '../types/objects';
import type { ObjectCollection, ObjectBody, VerifiedObject } from '../types/objects';

const collection = JSON.parse(raw) as ObjectCollection;


export const VERIFIED_OBJECTS: VerifiedObject[] = collection.features
  .map((f) => f.properties)
  .filter(isVerifiedObject);

export const TOTAL_OBJECT_COUNT = collection.features.length;
export const PENDING_OBJECT_COUNT = TOTAL_OBJECT_COUNT - VERIFIED_OBJECTS.length;

export function verifiedFor(body: ObjectBody): VerifiedObject[] {
  return VERIFIED_OBJECTS.filter((o) => o.body === body);
}
