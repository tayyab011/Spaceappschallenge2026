import { prefersReducedMotion } from './a11y';

/** True when the site was opened with ?offline=1 (demo mode: no network calls on purpose). */
export function isOfflineMode(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('offline') === '1';
  } catch {
    return false;
  }
}

const offlineNow = () => isOfflineMode() || navigator.onLine === false;

const THIRD_PARTY = ['sketchfab.com', 'youtube.com', 'youtube-nocookie.com', 'youtu.be'];
const PLACEHOLDER_IMG = '/assets/offline-image.svg';

function hostOf(src: string): string {
  try {
    return new URL(src, window.location.href).hostname;
  } catch {
    return '';
  }
}
const isExternalHost = (src: string) => {
  const h = hostOf(src);
  return h !== '' && h !== window.location.hostname;
};
const isThirdPartyEmbed = (src: string) => {
  const h = hostOf(src);
  return THIRD_PARTY.some((t) => h === t || h.endsWith(`.${t}`));
};

function embedLabel(src: string): string {
  const h = hostOf(src);
  if (h.includes('sketchfab')) return 'Third-party 3D viewer (Sketchfab)';
  if (h.includes('youtube') || h === 'youtu.be') return 'Third-party video (YouTube)';
  return 'Third-party embed';
}

// iframe -> the local fallback box that stands in for it. The iframe stays in the DOM (hidden)
// so React can still remove it; the box is a sibling and is cleaned up when the iframe goes away.
const boxes = new WeakMap<HTMLIFrameElement, HTMLElement>();

function hideEmbed(f: HTMLIFrameElement) {
  const original = f.dataset.sbSrc ?? f.getAttribute('src') ?? '';
  if (!original || original === 'about:blank' || boxes.has(f)) return;
  f.dataset.sbSrc = original;
  const label = embedLabel(original);
  const box = document.createElement('div');
  box.className = f.className;
  box.style.cssText = f.style.cssText;
  const w = f.getAttribute('width');
  const h = f.getAttribute('height');
  if (w) box.style.width = /^\d+$/.test(w) ? `${w}px` : w;
  if (h) box.style.height = /^\d+$/.test(h) ? `${h}px` : h;
  box.style.minHeight = box.style.minHeight || '160px';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.textAlign = 'center';
  box.style.padding = '1rem';
  box.style.background = '#11151f';
  box.style.color = '#9aa0a6';
  box.style.border = '1px dashed rgba(255,255,255,0.25)';
  box.style.font = '14px system-ui, sans-serif';
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', `${label}: not available offline`);
  box.textContent = `${label} is not available offline.`;
  f.setAttribute('src', 'about:blank');
  f.hidden = true;
  f.insertAdjacentElement('afterend', box);
  boxes.set(f, box);
}

function restoreEmbed(f: HTMLIFrameElement) {
  const box = boxes.get(f);
  if (!box) return;
  box.remove();
  boxes.delete(f);
  f.hidden = false;
  if (f.dataset.sbSrc) f.setAttribute('src', f.dataset.sbSrc);
}

function calmEmbed(f: HTMLIFrameElement) {
  // Reduced motion: stop Sketchfab embeds from auto-starting and auto-spinning.
  const src = f.getAttribute('src') ?? '';
  if (!src.includes('sketchfab.com') || f.dataset.sbCalm) return;
  try {
    const u = new URL(src, window.location.href);
    if (!u.searchParams.has('autostart') && !u.searchParams.has('autospin')) return;
    u.searchParams.delete('autostart');
    u.searchParams.delete('autospin');
    f.dataset.sbCalm = '1';
    f.setAttribute('src', u.toString());
  } catch {
    /* leave as is */
  }
}

function handleIframe(f: HTMLIFrameElement) {
  const src = f.dataset.sbSrc ?? f.getAttribute('src') ?? '';
  if (!src || src === 'about:blank' || !isThirdPartyEmbed(src)) return;
  if (!f.title) f.title = embedLabel(src);
  if (offlineNow()) hideEmbed(f);
  else if (prefersReducedMotion()) calmEmbed(f);
}

function scan(root: ParentNode) {
  root.querySelectorAll('iframe').forEach((f) => handleIframe(f as HTMLIFrameElement));
}

/**
 * Safety net for offline use. It does not change what online visitors see, apart from giving
 * third-party iframes a title. Hosted images that fail get a local placeholder; third-party
 * embeds get a local fallback box while offline (or with ?offline=1).
 * The real fix for hosted images is to self-host them: see scripts/localize-assets.mjs.
 */
export function installOfflineGuards() {
  document.addEventListener(
    'error',
    (e) => {
      const t = e.target;
      if (!(t instanceof HTMLImageElement) || t.dataset.sbFallback) return;
      const src = t.currentSrc || t.src;
      if (!src || !isExternalHost(src)) return;
      t.dataset.sbFallback = '1';
      t.removeAttribute('srcset');
      t.src = PLACEHOLDER_IMG;
    },
    true,
  );

  const start = () => {
    scan(document);
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'attributes') {
          if (r.target instanceof HTMLIFrameElement) handleIframe(r.target);
          continue;
        }
        r.addedNodes.forEach((n) => {
          if (n instanceof HTMLIFrameElement) handleIframe(n);
          else if (n instanceof HTMLElement) scan(n);
        });
        r.removedNodes.forEach((n) => {
          const frames = n instanceof HTMLIFrameElement ? [n] : n instanceof HTMLElement ? Array.from(n.querySelectorAll('iframe')) : [];
          frames.forEach((f) => {
            boxes.get(f)?.remove();
            boxes.delete(f);
          });
        });
      }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.addEventListener('offline', () => scan(document));
  window.addEventListener('online', () => {
    if (isOfflineMode()) return;
    document.querySelectorAll('iframe').forEach((f) => restoreEmbed(f as HTMLIFrameElement));
  });
}

/**
 * prefers-reduced-motion: block audio that starts without a recent user gesture (autoplay).
 * Sounds the visitor asks for by clicking still play. Covers Web Audio, speech synthesis and media elements.
 */
export function installMotionGuards() {
  const activation = () => (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation?.isActive === true;
  const blocked = () => prefersReducedMotion() && !activation();

  const node = (window as unknown as { AudioScheduledSourceNode?: { prototype: { start: (...a: unknown[]) => void } } }).AudioScheduledSourceNode;
  if (node?.prototype?.start) {
    const orig = node.prototype.start;
    node.prototype.start = function (this: unknown, ...args: unknown[]) {
      if (blocked()) return;
      return orig.apply(this, args);
    };
  }
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const orig = synth.speak.bind(synth);
    synth.speak = (u: SpeechSynthesisUtterance) => {
      if (blocked()) return;
      orig(u);
    };
  }
  const media = HTMLMediaElement.prototype;
  const origPlay = media.play;
  media.play = function (this: HTMLMediaElement) {
    if (blocked()) return Promise.resolve();
    return origPlay.call(this);
  };
}

/** Production only. The worker (public/sw.js) is filled with the build's file list by vite.config.ts. */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('[sw] registration failed', err));
  });
}
