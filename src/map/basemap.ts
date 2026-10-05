import * as maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import type { StyleSpecification } from 'maplibre-gl';
import type { ObjectBody } from '../types/objects';
maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
export type BasemapInfo =
  | { kind: 'pmtiles'; url: string }
  | { kind: 'image'; url: string }
  | { kind: 'none' };

let protocolRegistered = false;
export function registerPmtiles() {
  if (protocolRegistered) return;
  const protocol = new Protocol({ metadata: true });
  maplibregl.addProtocol('pmtiles', protocol.tilev4 as never);
  protocolRegistered = true;
}

async function looksLikePmtiles(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-6' }, cache: 'no-store' });
    if (!res.ok || !res.body) return false;
    const reader = res.body.getReader();
    const { value } = await reader.read();
    void reader.cancel();
    if (!value || value.length < 7) return false;
    return new TextDecoder().decode(value.slice(0, 7)) === 'PMTiles';
  } catch {
    return false;
  }
}

function imageLoads(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export async function detectBasemap(body: ObjectBody): Promise<BasemapInfo> {
  registerPmtiles();
  // Prefer the plain image: it needs no range requests, which the browser cache can block.
  const img = `/tiles/${body}-mercator.jpg`;
  if (await imageLoads(img)) return { kind: 'image', url: img };
  const pm = `${window.location.origin}/tiles/${body}.pmtiles`;
  if (await looksLikePmtiles(pm)) return { kind: 'pmtiles', url: pm };
  return { kind: 'none' };
}

type LineFeature = {
  type: 'Feature';
  properties: { major: boolean };
  geometry: { type: 'LineString'; coordinates: number[][] };
};

function graticule(stepDeg = 30) {
  const features: LineFeature[] = [];
  for (let lon = -180; lon <= 180; lon += stepDeg) {
    features.push({ type: 'Feature', properties: { major: lon === 0 }, geometry: { type: 'LineString', coordinates: [[lon, -85], [lon, 85]] } });
  }
  for (let lat = -60; lat <= 60; lat += stepDeg) {
    features.push({ type: 'Feature', properties: { major: lat === 0 }, geometry: { type: 'LineString', coordinates: [[-180, lat], [180, lat]] } });
  }
  return { type: 'FeatureCollection' as const, features };
}

export function buildStyle(body: ObjectBody, info: BasemapInfo): StyleSpecification {
  const bg = body === 'moon' ? '#15171c' : '#1d1310';
  const style: StyleSpecification = {
    version: 8,
    sources: { graticule: { type: 'geojson', data: graticule() } },
    layers: [{ id: 'bg', type: 'background', paint: { 'background-color': bg } }],
  };
  if (info.kind === 'pmtiles') {
    style.sources.basemap = { type: 'raster', url: `pmtiles://${info.url}`, tileSize: 256 };
    style.layers.push({ id: 'basemap', type: 'raster', source: 'basemap' });
  } else if (info.kind === 'image') {
    style.sources.basemap = {
      type: 'image',
      url: info.url,
      coordinates: [[-180, 85.0511], [180, 85.0511], [180, -85.0511], [-180, -85.0511]],
    };
    style.layers.push({ id: 'basemap', type: 'raster', source: 'basemap' });
  }
  style.layers.push({
    id: 'graticule',
    type: 'line',
    source: 'graticule',
    paint: {
      'line-color': ['case', ['get', 'major'], '#9aa0a6', '#4a4f57'],
      'line-width': ['case', ['get', 'major'], 1.2, 0.6],
      'line-opacity': info.kind === 'none' ? 0.9 : 0.35,
    },
  });
  return style;
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}