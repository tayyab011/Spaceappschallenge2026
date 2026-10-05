# Offline mode and accessibility notes

## `?offline=1`

Open any page with `?offline=1` (for example `/map?offline=1`). In this mode:

- Firebase is never initialised, so no Firestore or Auth calls are made
  (`src/components/lib/firebase.ts`). The Recovery page falls back to its local-only behaviour.
- Third-party iframes (Sketchfab, YouTube) are replaced by a labelled local box
  (`src/offline.ts`). The same happens automatically when the browser reports it is offline.
- Source links in the Map panel are shown as text, not links.

The flag applies per page load: keep `?offline=1` on the URL you open.

## Service worker

`public/sw.js` is registered in production builds only. `vite.config.ts` fills in the
app-shell file list at build time.

- App shell (HTML, JS, CSS, SVG) is precached on first visit.
- Images, models, fonts and `public/tiles/*` are cached the first time they are used.
  `.pmtiles` files are stored whole and served as range responses.
- Firebase and Google API hosts are never cached.
- Anything not visited once while online is not available offline. **Before a demo, open
  each page you plan to show while online, then switch to offline.**

To test: `npm run build && npx vite preview`, load the pages, then use DevTools > Network > Offline.
This has **not** been tested in a browser yet.

## Fonts

Fonts are bundled from `@fontsource/*` (`src/fonts.ts`); no Google Fonts requests remain.
Newsreader, Plus Jakarta Sans, Space Mono, Fraunces and Noto Sans Bengali are all OFL-licensed.

## Hosted images: still TODO

63 image URLs in `src/` still point at NASA, Wikimedia and one imgur host.
They could not be downloaded where this was built. On a machine with internet run:

```bash
node scripts/localize-assets.mjs              # dry run: lists every URL
node scripts/localize-assets.mjs --download   # saves to public/assets/objects/ + manifest.json
node scripts/localize-assets.mjs --write      # also rewrites the URLs in src/
```

Then fill in the credit for each file in `public/assets/objects/manifest.json`, and check the
licence of the non-NASA images the script lists (imgur and Wikimedia files carry their own licences).
Until then, a hosted image that fails to load is swapped for `public/assets/offline-image.svg`.

## Third-party embeds

Sketchfab and YouTube embeds are replaced offline. Online they still load from the third party.
Labelling them visibly online would mean editing existing pages (`ColdOpen`, `Mars`,
`SketchfabViewer`, `DiscoveryCard`), so it was left for the team to decide. They get an accessible `title`.
Local `.glb` models (`public/models/`) are unaffected.

## Terrain labelling

The 3D console terrain is procedural noise, not MOLA or LOLA data. The HUD label, the
terrain metadata strings and code comments now say "illustrative terrain".
The file name `molaLroTerrain.ts` and the `terrainDataset` type in `src/types.ts` still carry the old
names; renaming them would touch existing code for no visible gain. To show real terrain, replace it
with a DEM exported from NASA Moon/Mars Trek and record the dataset id in the README.

## Accessibility

- Map view: real `<button>` markers with labels, keyboard-reachable list of the same objects,
  panel takes focus on open, Escape closes it and focus returns to what opened it, visible focus rings.
- Motion: with `prefers-reduced-motion`, 3D auto-rotate is off, framer-motion animations are
  reduced (`MotionConfig`), map easing is instant, Sketchfab autostart/autospin is removed,
  and sound, speech or video that starts without a click is blocked.
- Not done: a full keyboard/screen-reader audit of the existing pages. Check 360 px width in a browser.
