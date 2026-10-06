import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { X } from 'lucide-react';
import { ORBITERS } from './orbiters';
import type { Anchor, OrbiterItem } from './orbiters';

interface PlanetDef {
  key: Anchor;
  label: string;
  size: number;
  base: string;
  accents: string[];
  glow: string;
  style: 'craters' | 'blotch' | 'bands';
  rings?: boolean;
}

const PLANETS: PlanetDef[] = [
  { key: 'mercury', label: 'Mercury', size: 0.8, base: '#8b8379', accents: ['#5f5a53', '#b3aa9d'], glow: '#b3aa9d', style: 'craters' },
  { key: 'venus', label: 'Venus', size: 1.05, base: '#d8b26a', accents: ['#e9d29b', '#c48f45', '#f0dfb4'], glow: '#f0c878', style: 'bands' },
  { key: 'mars', label: 'Mars', size: 0.95, base: '#b24a22', accents: ['#6e2a14', '#d98a5a', '#8c3a1a'], glow: '#e0794a', style: 'blotch' },
  { key: 'jupiter', label: 'Jupiter', size: 1.45, base: '#c9a37a', accents: ['#8a5a3a', '#e8d3b0', '#b5835a', '#f2e6cf'], glow: '#e8c9a0', style: 'bands' },
  { key: 'saturn', label: 'Saturn', size: 1.2, base: '#d9c38f', accents: ['#b79d63', '#efe0b4', '#a58c58'], glow: '#f0dca5', style: 'bands', rings: true },
];

const kindColor = (k: OrbiterItem['kind']) => (k === 'Orbiter' ? '#7fd6e8' : '#f5b942');

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function planetTexture(p: PlanetDef): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const rand = rng([...p.key].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7));
  g.fillStyle = p.base;
  g.fillRect(0, 0, w, h);

  if (p.style === 'bands') {
    let y = 0;
    while (y < h) {
      const bh = 8 + rand() * 38;
      g.fillStyle = p.accents[Math.floor(rand() * p.accents.length)];
      g.globalAlpha = 0.3 + rand() * 0.4;
      g.fillRect(0, y, w, bh);
      y += bh * (0.6 + rand() * 0.6);
    }
  }

  const n = p.style === 'craters' ? 280 : 170;
  for (let i = 0; i < n; i++) {
    const x = rand() * w;
    const y = rand() * h;
    for (const dx of [-w, 0, w]) {
      if (p.style === 'craters') {
        const r = 3 + rand() ** 2 * 34;
        g.globalAlpha = 0.22;
        g.fillStyle = p.accents[0];
        g.beginPath();
        g.arc(x + dx, y, r, 0, Math.PI * 2);
        g.fill();
        g.globalAlpha = 0.18;
        g.strokeStyle = p.accents[1];
        g.lineWidth = 1.5;
        g.stroke();
      } else {
        g.globalAlpha = 0.07 + rand() * 0.1;
        g.fillStyle = p.accents[i % p.accents.length];
        g.beginPath();
        const stretch = p.style === 'bands' ? 3 : 1.4;
        g.ellipse(x + dx, y, (14 + rand() * 50) * stretch, 14 + rand() * 30, 0, 0, Math.PI * 2);
        g.fill();
      }
    }
  }

  if (p.key === 'mars') {
    g.globalAlpha = 0.85;
    const cap = g.createLinearGradient(0, 0, 0, 44);
    cap.addColorStop(0, '#ffffff');
    cap.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = cap;
    g.fillRect(0, 0, w, 44);
    g.save();
    g.translate(0, h);
    g.scale(1, -1);
    g.fillRect(0, 0, w, 44);
    g.restore();
  }

  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

interface Craft {
  item: OrbiterItem;
  holder: THREE.Group;
  ring: THREE.Mesh;
  line: THREE.LineLoop;
  r: number;
  angle: number;
  speed: number;
}

function Field({ label, text }: { label: string; text?: string }) {
  const value = text?.trim();
  if (!value) return null;
  return (
    <section className="mt-4 border-t border-white/10 pt-3">
      <h5 className="text-xs font-semibold text-[#9aa0a6]">{label}</h5>
      <p className="mt-1 break-words text-sm leading-relaxed text-[#ece7dc]">{value}</p>
    </section>
  );
}

interface Props {
  onOpenStory?: (storyId: string) => void;
}

export default function OrbitersView({ onOpenStory }: Props) {
  const [planetKey, setPlanetKey] = useState<Anchor>('mars');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noGl, setNoGl] = useState(false);
  // ids whose image file failed to load, so we can show a message instead of nothing
  const [badImages, setBadImages] = useState<Record<string, boolean>>({});

  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selectedRef = useRef<string | null>(null);
  const pickRef = useRef<(id: string) => void>(() => {});

  const planet = PLANETS.find((p) => p.key === planetKey)!;
  const items = useMemo(() => ORBITERS.filter((o) => o.anchor === planetKey), [planetKey]);
  const selected = items.find((o) => o.id === selectedId) ?? null;
  const counts = useMemo(() => {
    const m: Partial<Record<Anchor, number>> = {};
    ORBITERS.forEach((o) => (m[o.anchor] = (m[o.anchor] ?? 0) + 1));
    return m;
  }, []);

  selectedRef.current = selected?.id ?? null;
  pickRef.current = (id) => setSelectedId(id);

  useEffect(() => {
    if (selected) headingRef.current?.focus();
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const closePanel = () => {
    const id = selectedId;
    setSelectedId(null);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`button[data-orbiter-id="${id}"]`)?.focus());
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setNoGl(true);
      return;
    }
    setNoGl(false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(5, 2.5, 6);
    scene.add(sun);

    // stars
    const starPos = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const r = 40 + Math.random() * 40;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPos[i * 3 + 2] = r * Math.cos(ph);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.75 })));

    // planet
    const R = planet.size;
    const tex = planetTexture(planet);
    const planetGroup = new THREE.Group();
    planetGroup.rotation.set(planet.rings ? 0.5 : 0.2, 0, 0.25);
    scene.add(planetGroup);
    const planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 48),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 }),
    );
    planetGroup.add(planetMesh);
    planetGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.07, 48, 32),
        new THREE.MeshBasicMaterial({ color: planet.glow, transparent: true, opacity: 0.14, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      ),
    );
    if (planet.rings) {
      const rg = new THREE.Mesh(
        new THREE.RingGeometry(R * 1.35, R * 2.15, 96),
        new THREE.MeshBasicMaterial({ color: 0xcbb98c, side: THREE.DoubleSide, transparent: true, opacity: 0.65 }),
      );
      rg.rotation.x = Math.PI / 2;
      planetGroup.add(rg);
    }

    // spacecraft
    const baseOrbit = R * (planet.rings ? 2.7 : 1.7);
    const maxOrbit = baseOrbit + Math.max(items.length - 1, 0) * 0.4;
    const crafts: Craft[] = [];
    const hitTargets: THREE.Object3D[] = [];
    items.forEach((item, i) => {
      const r = baseOrbit + i * 0.4;
      const g = new THREE.Group();
      const flip = i % 2 === 0 ? 1 : -1;
      g.rotation.set(flip * (0.95 + (i % 3) * 0.2), flip * 0.25 * (1 + (i % 3)), 0);
      scene.add(g);

      const pts: THREE.Vector3[] = [];
      for (let k = 0; k < 129; k++) {
        const a = (k / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0));
      }
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 }),
      );
      g.add(line);

      const holder = new THREE.Group();
      holder.add(new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), new THREE.MeshBasicMaterial({ color: kindColor(item.kind) })));
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 8, 6),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      hit.userData.id = item.id;
      holder.add(hit);
      hitTargets.push(hit);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.17, 0.2, 32), new THREE.MeshBasicMaterial({ color: 0xece7dc, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
      ring.visible = false;
      holder.add(ring);
      g.add(holder);

      crafts.push({ item, holder, ring, line, r, angle: (Math.PI * 2 * i) / items.length + 0.6, speed: 0.3 / (1 + i * 0.3) });
    });

    // fit camera to content for any aspect ratio
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const ext = Math.max(maxOrbit, planet.rings ? R * 2.2 : R) * 1.12 + 0.3;
      const z = Math.max(ext / t, ext / (t * camera.aspect), R * 3.2);
      camera.position.set(0, z * 0.1, z);
      camera.lookAt(0, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // picking
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(hitTargets, false)[0];
      return hit ? (hit.object.userData.id as string) : null;
    };
    const hideTip = () => {
      if (tipRef.current) tipRef.current.style.display = 'none';
      canvas.style.cursor = 'default';
    };
    const onMove = (e: PointerEvent) => {
      const id = pick(e);
      const tip = tipRef.current;
      const stage = stageRef.current;
      if (!id || !tip || !stage) return hideTip();
      const rect = stage.getBoundingClientRect();
      tip.textContent = items.find((o) => o.id === id)?.name ?? '';
      tip.style.left = `${e.clientX - rect.left + 14}px`;
      tip.style.top = `${e.clientY - rect.top + 14}px`;
      tip.style.display = 'block';
      canvas.style.cursor = 'pointer';
    };
    const onClick = (e: MouseEvent) => {
      const id = pick(e);
      if (id) pickRef.current(id);
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', hideTip);
    canvas.addEventListener('click', onClick);

    // loop
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduced) {
        planetMesh.rotation.y += dt * 0.12;
        crafts.forEach((c) => (c.angle += c.speed * dt));
      }
      const sel = selectedRef.current;
      crafts.forEach((c) => {
        c.holder.position.set(c.r * Math.cos(c.angle), c.r * Math.sin(c.angle), 0);
        const on = c.item.id === sel;
        c.holder.scale.setScalar(on ? 1.6 : 1);
        c.ring.visible = on;
        if (on) c.ring.lookAt(camera.position);
        (c.line.material as THREE.LineBasicMaterial).opacity = on ? 0.7 : 0.22;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', hideTip);
      canvas.removeEventListener('click', onClick);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      tex.dispose();
      renderer.dispose();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, [planet, items]);

  const storyId = selected?.story?.trim();
  const imageSrc = selected?.image?.trim();

  return (
    <div className="rounded-xl border border-white/10 bg-black text-[#ece7dc]">
      <style>{`@keyframes sb-slide { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } } .sb-slide { animation: sb-slide .28s ease-out; } @media (prefers-reduced-motion: reduce) { .sb-slide { animation: none; } }`}</style>

      <div className="flex flex-col lg:flex-row">
        <ul aria-label="Planets" className="flex shrink-0 gap-3 overflow-x-auto p-4 lg:w-60 lg:flex-col lg:gap-4 lg:overflow-visible lg:p-6">
          {PLANETS.map((p) => {
            const active = p.key === planetKey;
            const n = counts[p.key] ?? 0;
            return (
              <li key={p.key} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setPlanetKey(p.key);
                    setSelectedId(null);
                  }}
                  className="flex w-full items-center gap-3 rounded-full p-1 pr-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-14 w-14 shrink-0 rounded-full ${active ? 'ring-2 ring-white/70 ring-offset-4 ring-offset-black' : 'opacity-80'}`}
                    style={{ background: `radial-gradient(circle at 35% 30%, ${p.accents[p.accents.length > 2 ? 2 : 1]}, ${p.base} 55%, #0a0a0a 120%)` }}
                  />
                  <span>
                    <span className={`block text-sm ${active ? 'font-semibold text-[#ece7dc]' : 'text-[#c9c5bb]'}`}>{p.label}</span>
                    <span className="block text-xs text-[#9aa0a6]">{n} spacecraft</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div ref={stageRef} className="relative min-w-0 flex-1">
          <div className="px-4 pt-2 lg:pointer-events-none lg:absolute lg:left-2 lg:top-6 lg:z-10 lg:px-0 lg:pt-0">
            <h3 className="font-serif text-3xl uppercase tracking-wide text-[#ece7dc] sm:text-4xl">{planet.label}</h3>
            {items.length > 0 ? (
              <ul aria-label={`Spacecraft at ${planet.label}`} className="mt-4 space-y-1.5">
                {items.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      data-orbiter-id={o.id}
                      aria-current={o.id === selectedId ? 'true' : undefined}
                      onClick={() => setSelectedId(o.id)}
                      className="pointer-events-auto flex items-center gap-2 border-l-2 border-transparent py-0.5 pl-2 text-left text-base text-[#c9c5bb] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8] aria-[current=true]:border-[#7fd6e8] aria-[current=true]:font-semibold aria-[current=true]:text-white"
                    >
                      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: kindColor(o.kind) }} />
                      {o.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-[#9aa0a6]">No spacecraft added for {planet.label} yet.</p>
            )}
          </div>

          <div className={`relative h-[360px] transition-[padding] duration-300 sm:h-[480px] lg:h-[640px] ${selected ? 'lg:pr-[344px]' : ''}`}>
            <div
              ref={mountRef}
              role="img"
              aria-label={`${planet.label} with ${items.length} spacecraft in orbit. Use the list to open one.`}
              className="h-full w-full"
            />
            <p className="pointer-events-none absolute bottom-3 left-4 right-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9aa0a6] lg:left-2 lg:right-auto">
              <span><span style={{ color: '#7fd6e8' }}>●</span> Orbiter</span>
              <span><span style={{ color: '#f5b942' }}>●</span> Flyby</span>
              <span>Not to scale</span>
            </p>
          </div>
          {noGl && <p role="status" className="px-4 pb-4 text-sm text-[#9aa0a6]">3D view needs WebGL. The list still works.</p>}
          <div ref={tipRef} className="pointer-events-none absolute z-20 hidden rounded bg-[#11151f] px-2 py-1 text-xs text-[#ece7dc] shadow" />

          {selected && (
            <aside
              aria-label={selected.name}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation();
                  closePanel();
                }
              }}
              className="sb-slide z-10 m-4 rounded-xl border border-white/10 bg-[#0c0f16] p-4 lg:absolute lg:bottom-4 lg:right-4 lg:top-4 lg:m-0 lg:w-80 lg:overflow-auto"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px]" style={{ color: kindColor(selected.kind) }}>
                  {selected.kind}
                </span>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close"
                  className="shrink-0 rounded-full border border-white/20 p-2 text-[#9aa0a6] hover:text-[#ece7dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Image block: shown when an image is set; if the file can't be loaded, say so instead of hiding it */}
              {imageSrc && !badImages[selected.id] && (
                <figure className="mt-3">
                  <img
                    key={selected.id}
                    src={imageSrc}
                    alt={selected.name}
                    loading="lazy"
                    onError={() => {
                      console.warn('OrbitersView: image failed to load:', imageSrc);
                      setBadImages((prev) => ({ ...prev, [selected.id]: true }));
                    }}
                    className="aspect-video w-full rounded-lg border border-white/10 bg-black object-cover"
                  />
                </figure>
              )}
              {imageSrc && badImages[selected.id] && (
                <p role="status" className="mt-3 rounded-lg border border-dashed border-white/20 p-3 text-xs text-[#9aa0a6]">
                  Image not found: <span className="break-all">{imageSrc}</span>
                </p>
              )}

              <h4 ref={headingRef} tabIndex={-1} className="mt-3 font-serif text-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#7fd6e8]">
                {selected.name}
              </h4>
              <dl className="mt-4 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="text-[#9aa0a6]">Kind</dt>
                <dd>{selected.kind}</dd>
                <dt className="text-[#9aa0a6]">Target</dt>
                <dd className="break-words">{selected.target}</dd>
                <dt className="text-[#9aa0a6]">Last contact</dt>
                <dd className="break-words">{selected.last_contact.trim()}</dd>
              </dl>

              <Field label="Hardware" text={selected.hardware} />
              <Field label="Current status" text={selected.current_status} />
              <Field label="Why it was left" text={selected.why_left} />
              <Field label="Science enabled" text={selected.science_enabled} />
              {storyId && (
                <button
                  type="button"
                  onClick={() => onOpenStory?.(storyId)}
                  className="mt-5 rounded-full bg-[#c1440e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d3521a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fd6e8]"
                >
                  Read the full story
                </button>
              )}
              {selected.sourceUrl && (
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-fit text-sm text-[#7fd6e8] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7fd6e8]"
                >
                  Read the NASA record (NSSDCA)
                </a>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}