import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { ArrowLeft, ChevronRight, Minus, Plus, RotateCcw } from 'lucide-react';
import type { ObjectBody, VerifiedObject } from '../types/objects';
import { PENDING_OBJECT_COUNT, verifiedFor } from './objects';
import { detectBasemap, buildStyle, webglAvailable } from './basemap';
import type { BasemapInfo } from './basemap';
import { filterByYear, sortByYear, yearBounds } from './timeline';
import { ObjectPanel } from './ObjectPanel';
import OrbitersView from './OrbitersView';
import { T, useLang, useT } from '../i18n';

const LANDER_SVG =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 10a4 4 0 0 1 8 0v3H8z"/><path d="M7 21l2-8M17 21l-2-8M10 17h4"/></svg>';

const STATUS_LABEL: Record<string, string> = {
  'left-behind': 'Left behind',
  silent: 'Silent',
  'ended-by-design': 'Ended by design',
  'deliberate-impact': 'Deliberate impact',
  operating: 'Operating',
};

const STATUS_STYLE: Record<string, string> = {
  'left-behind': 'bg-[#c1440e]/25 text-[#f3a07e]',
  silent: 'bg-white/10 text-[#c9cdd3]',
  'ended-by-design': 'bg-[#7fd6e8]/15 text-[#7fd6e8]',
  'deliberate-impact': 'bg-[#f5b942]/15 text-[#f5b942]',
  operating: 'bg-emerald-400/15 text-emerald-300',
};

function shortCoord(lat: number, lon: number) {
  return `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

interface Props {
  onOpenStory?: (storyId: string) => void;
}

export default function MapView({ onOpenStory }: Props) {
  const t = useT();
  const [lang] = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const [view, setView] = useState<'landers' | 'orbiters'>('landers');
  const [body, setBody] = useState<ObjectBody>('moon');
  const [year, setYear] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [basemap, setBasemap] = useState<BasemapInfo['kind'] | null>(null);
  const webgl = useMemo(() => webglAvailable(), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ id: string; el: HTMLButtonElement; marker: maplibregl.Marker }[]>([]);
  const openerRef = useRef<Element | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => ({ moon: verifiedFor('moon').length, mars: verifiedFor('mars').length }), []);
  const all = useMemo(() => verifiedFor(body), [body]);
  const bounds = useMemo(() => yearBounds(all), [all]);
  const visible = useMemo(() => sortByYear(filterByYear(all, year)), [all, year]);
  const selected = useMemo(() => visible.find((o) => o.id === selectedId) ?? null, [visible, selectedId]);

  useEffect(() => {
    setYear(null);
    setSelectedId(null);
  }, [body]);

  useEffect(() => {
    if (!webgl) return;
    let cancelled = false;
    let map: maplibregl.Map | null = null;
    setReady(false);
    setBasemap(null);

    (async () => {
      const info = await detectBasemap(body);
      if (cancelled || !containerRef.current) return;
      setBasemap(info.kind);
      map = new maplibregl.Map({
        container: containerRef.current,
        style: buildStyle(body, info),
        center: [0, 0],
        zoom: 0.8,
        minZoom: 0,
        maxZoom: 9,
        renderWorldCopies: false,
        attributionControl: { compact: true },
      });
      map.on('error', (e: maplibregl.ErrorEvent) => console.warn('[map]', e.error?.message ?? e));
      map.once('load', () => {
        if (cancelled) return;
        mapRef.current = map;
        setReady(true);
      });
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];
      mapRef.current = null;
      map?.remove();
    };
  }, [body, webgl]);

  const select = useCallback((o: VerifiedObject) => {
    openerRef.current = document.activeElement;
    setSelectedId(o.id);
    const map = mapRef.current;
    if (map) {
      map.easeTo({ center: [o.lon, o.lat], zoom: Math.max(map.getZoom(), 2.5), duration: reducedMotion ? 0 : 600 });
    }
  }, [reducedMotion]);

  const close = useCallback(() => {
    const id = selectedId;
    setSelectedId(null);
    requestAnimationFrame(() => {
      const opener = openerRef.current as HTMLElement | null;
      if (opener && document.contains(opener)) opener.focus();
      else if (id) document.querySelector<HTMLElement>(`button[data-object-id="${id}"]`)?.focus();
    });
  }, [selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    markersRef.current.forEach((m) => m.marker.remove());
    markersRef.current = visible.map((o) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'sb-marker';
      el.dataset.body = o.body;
      el.dataset.objectId = o.id;
      const dot = document.createElement('span');
      dot.className = 'sb-pin-dot';
      dot.innerHTML = LANDER_SVG;
      const label = document.createElement('span');
      label.className = 'sb-pin-label';
      label.textContent = o.name;
      el.append(dot, label);
      el.addEventListener('click', () => select(o));
      el.addEventListener('mouseenter', () => setHoverId(o.id));
      el.addEventListener('mouseleave', () => setHoverId(null));
      const marker = new maplibregl.Marker({ element: el }).setLngLat([o.lon, o.lat]).addTo(map);
      el.setAttribute('aria-label', `${o.name}, ${o.mission}, ${o.left_behind}`);
      return { id: o.id, el, marker };
    });
  }, [ready, visible, select]);

  useEffect(() => {
    markersRef.current.forEach(({ id, el }) => {
      if (id === selectedId) el.setAttribute('aria-current', 'true');
      else el.removeAttribute('aria-current');
    });
  }, [selectedId, ready, visible]);

  useEffect(() => {
    markersRef.current.forEach(({ id, el }) => {
      if (id === hoverId) el.dataset.hover = 'true';
      else delete el.dataset.hover;
    });
  }, [hoverId, ready, visible]);

  useEffect(() => {
    if (!selectedId || window.matchMedia?.('(min-width: 1024px)').matches) return;
    panelRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [selectedId, reducedMotion]);

  const zoomBy = (dir: 1 | -1) => {
    const m = mapRef.current;
    if (!m) return;
    const opts = { duration: reducedMotion ? 0 : 250 };
    if (dir > 0) m.zoomIn(opts);
    else m.zoomOut(opts);
  };
  const resetView = () => mapRef.current?.easeTo({ center: [0, 0], zoom: 0.8, duration: reducedMotion ? 0 : 600 });

  useEffect(() => {
    if (selectedId && !selected) setSelectedId(null);
  }, [selectedId, selected]);

  useEffect(() => {
    if (view === 'landers') requestAnimationFrame(() => mapRef.current?.resize());
  }, [view]);

  const sliderValue = year ?? bounds?.max ?? 0;

  const btn = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]';
  const mapBtn = `grid h-10 w-10 place-items-center rounded-full bg-white text-[#171a26] shadow-lg hover:bg-[#ece7dc] ${btn}`;

  return (
    <section lang={lang} aria-labelledby="map-title" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="map-title" className="font-serif text-3xl text-[#ece7dc] sm:text-4xl">
            <T k="map.title" />
          </h2>
          <p className="mt-2 text-[#9aa0a6]"><T k="map.intro" /></p>
        </div>
        <div role="group" aria-label="Map section" className="flex rounded-full bg-[#1a1d2b] p-1">
          {([['landers', 'Impacted'], ['orbiters', 'Still Orbiting']] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${btn} ${view === v ? 'bg-[#c1440e] text-white' : 'text-[#b7bdc3] hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className={view === 'landers' ? '' : 'hidden'}>
        <div className="grid gap-4 rounded-3xl border border-white/5 bg-transparent p-3 shadow-2xl sm:p-4 lg:h-[80vh] lg:min-h-[640px] lg:grid-cols-[minmax(380px,460px)_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
          <div className="px-1 pt-1 lg:col-start-1 lg:row-start-1">
            <p role="status" className="text-xs text-[#8d93a6]">
              {visible.length} / {all.length}
              {PENDING_OBJECT_COUNT > 0 ? ` · ${PENDING_OBJECT_COUNT} ${t('map.pending')}` : ''}
            </p>
            <h3 className="mt-1 font-serif text-2xl text-[#ece7dc] sm:text-3xl">
              Left behind on <T k={body === 'moon' ? 'map.moon' : 'map.mars'} />
            </h3>

            <div role="group" aria-label={t('map.body')} className="mt-4 grid grid-cols-2 gap-3">
              {(['moon', 'mars'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={body === b}
                  onClick={() => setBody(b)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left ${btn} ${
                    body === b ? 'border-[#c1440e] bg-[#2b2f45]' : 'border-white/10 bg-[#202436] hover:border-white/30'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="block h-10 w-10 shrink-0 rounded-full"
                    style={{
                      background:
                        b === 'moon'
                          ? 'radial-gradient(circle at 35% 30%, #e6e8eb, #8d9299 70%)'
                          : 'radial-gradient(circle at 35% 30%, #e3855b, #a53a10 70%)',
                    }}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#ece7dc]"><T k={b === 'moon' ? 'map.moon' : 'map.mars'} /></span>
                    <span className="block text-xs text-[#8d93a6]">{counts[b]} sites</span>
                  </span>
                </button>
              ))}
            </div>

            {bounds && (
              <div className="mt-3 rounded-2xl bg-[#202436] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="map-year" className="text-sm text-[#ece7dc]">
                    <T k="map.timeline" />: <T k="map.upTo" /> <output htmlFor="map-year" className="font-semibold">{sliderValue}</output>
                  </label>
                  {year !== null && (
                    <button
                      type="button"
                      onClick={() => setYear(null)}
                      className={`rounded-full border border-white/20 px-3 py-1 text-xs text-[#ece7dc] hover:border-white/40 ${btn}`}
                    >
                      <T k="map.showAll" />
                    </button>
                  )}
                </div>
                <input
                  id="map-year"
                  type="range"
                  min={bounds.min}
                  max={bounds.max}
                  step={1}
                  value={sliderValue}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="mt-2 w-full accent-[#c1440e]"
                />
              </div>
            )}
          </div>

          <div className="relative order-2 h-[55vh] min-h-[340px] overflow-hidden rounded-2xl border border-white/10 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-auto lg:min-h-0">
            {webgl ? (
              <div ref={containerRef} role="region" aria-label={t('map.mapLabel')} className="sb-map h-full w-full" />
            ) : (
              <p role="status" className="p-4 text-sm text-[#9aa0a6]"><T k="map.noWebgl" /></p>
            )}
            {webgl && (
              <>
                <button type="button" onClick={resetView} aria-label="Reset view" className={`absolute left-3 top-3 z-10 ${mapBtn}`}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                  <button type="button" onClick={() => zoomBy(1)} aria-label="Zoom in" className={mapBtn}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => zoomBy(-1)} aria-label="Zoom out" className={mapBtn}>
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
            {webgl && basemap === 'none' && (
              <p className="absolute bottom-3 left-3 right-3 z-10 rounded-lg bg-[#171a26]/90 px-3 py-2 text-xs text-[#9aa0a6]"><T k="map.noBasemap" /></p>
            )}
          </div>

          <div className="order-3 min-h-0 [scrollbar-width:thin] lg:order-none lg:col-start-1 lg:row-start-2 lg:overflow-y-auto lg:pr-1">
            {selected && (
              <div ref={panelRef}>
                <button
                  type="button"
                  onClick={close}
                  className={`mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm text-[#ece7dc] hover:border-white/40 ${btn}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All spacecraft
                </button>
                <ObjectPanel object={selected} onClose={close} onOpenStory={(id) => onOpenStory?.(id)} />
              </div>
            )}

            <div className={selected ? 'hidden' : ''}>
              {visible.length === 0 ? (
                <p className="rounded-2xl bg-[#202436] p-4 text-sm text-[#9aa0a6]">
                  <T k={all.length === 0 ? 'map.none' : 'map.noneForYear'} />
                </p>
              ) : (
                <ul aria-label={t('map.list')} className="space-y-3">
                  {visible.map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        data-object-id={o.id}
                        aria-current={o.id === selectedId ? 'true' : undefined}
                        onClick={() => select(o)}
                        onMouseEnter={() => setHoverId(o.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onFocus={() => setHoverId(o.id)}
                        onBlur={() => setHoverId(null)}
                        className={`flex w-full items-center gap-3 rounded-2xl border border-transparent bg-[#222639] p-3 text-left hover:border-white/20 aria-[current=true]:border-[#c1440e] ${btn}`}
                      >
                        <img src={o.image} alt="" loading="lazy" className="h-20 w-24 shrink-0 self-start rounded-xl object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="min-w-0 flex-1 truncate font-semibold text-[#ece7dc]">{o.name}</span>
                            {o.status && (
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[o.status] ?? 'bg-white/10 text-[#c9cdd3]'}`}>
                                {STATUS_LABEL[o.status] ?? o.status}
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-[#9aa0a6]">{o.mission} · {o.agency}</span>

                          {o.hardware && (
                            <span className="mt-1.5 block line-clamp-2 text-xs text-[#c9cdd3]">
                              <span className="text-[#8d93a6]">Hardware: </span>{o.hardware}
                            </span>
                          )}
                          {o.current_status && (
                            <span className="mt-1 block line-clamp-2 text-xs text-[#c9cdd3]">
                              <span className="text-[#8d93a6]">Status: </span>{o.current_status}
                            </span>
                          )}
                          {o.last_known_location && (
                            <span className="mt-1 block line-clamp-2 text-xs text-[#c9cdd3]">
                              <span className="text-[#8d93a6]">Last known: </span>{o.last_known_location}
                            </span>
                          )}

                          <span className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-[#c1440e]/25 px-2 py-0.5 text-[11px] text-[#f3a07e]">{o.left_behind}</span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-[#c9cdd3]">{shortCoord(o.lat, o.lon)}</span>
                          </span>
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0 self-center text-[#8d93a6]" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {view === 'orbiters' && <OrbitersView onOpenStory={onOpenStory} />}
    </section>
  );
}