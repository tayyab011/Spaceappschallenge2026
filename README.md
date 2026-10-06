# StarBound 🚀

### Abandoned, but not forgotten.

NASA Space Apps Challenge 2026 entry for **Challenge 1: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars."**

**StarBound** is an interactive space experience that tells the stories of robotic explorers that once ventured across the *Moon, Mars, and our Solar system*. Explore their missions, discoveries, final moments, and the science they left behind through an immersive, kid-friendly that turns spacecraft history into stories and games worth remembering. It also contains a deeper archive that reveals a complete legacy of these missions through storybooks, simulations and mapping. Finally, it will create a community of curious students who can work on recovering, servicing and preserving these abandoned space objects by sharing their ideas and coming up with new innovations.

## What it does

* **Kids Mode (default):** illustrated story, a rover game and rover anatomy with a 3D rover.
* **Adult Mode:** abandoned-equipment stories, a 3D simulation console, rover anatomy, Moon/Mars map of abandoned objects with a timeline and a recovery-ideas page.
## Run it

```bash
npm install
cp .env.example .env     # optional; every value can stay empty
npm run dev              # http://localhost:5173 (or the port Vite prints)
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run validate` | Validates `data/objects.geojson` (runs automatically before `build`) |
| `npm run lint` | Type-check (`tsc --noEmit`) |
| `npm run build` | Validate, then production build into `dist/` |

Offline demo: open the site with `?offline=1` (for example `/stories?offline=1`). This disables Firebase and replaces third-party embeds with local fallbacks. See `docs/OFFLINE.md` for offline setup.

## NASA data sources


| Dataset | Id | URL | Used for | Status |
| --- | --- | --- | --- | --- |
| NASA/JPL Photojournal images | PIA00379, PIA00660, PIA01133, PIA01484, PIA01551, PIA02864, PIA03240, PIA03478, PIA05476, PIA05508, PIA05634, PIA07104, PIA07997, PIA11758, PIA15689, PIA19952, PIA20027, PIA22518, PIA22876, PIA23047, PIA24308, PIA24424, PIA25328 | https://photojournal.jpl.nasa.gov/ | Story and mission-dossier imagery (ids taken from image URLs and captions in code) | Used |
| NASA Image and Video Library | per-image ids (for example `S71-37963`) | https://images.nasa.gov/ | Story imagery in Abandoned Stories | Used|
| NASA/JPL Perseverance 3D model | `25042_Perseverance.glb` (file name only) | https://www.jpl.nasa.gov/ | Rover Anatomy, Meet my parts | Used|
| NASA models on Sketchfab (Moon, InSight) | see `src/components/Mars.tsx`, `ColdOpen.tsx` | https://sketchfab.com/nasa | Third-party 3D embeds | Used online only; replaced by a local fallback offline |
| NSSDCA Master Catalog | per object | https://nssdc.gsfc.nasa.gov/nmc/ | `data/objects.geojson` (identity, dates) | Used |
| Planetary Data System (PDS) | per object | https://pds.nasa.gov/ | `data/objects.geojson` (coordinates) | Used |
| NASA Trek (Moon) | LRO_WAC_Mosaic_Global_303ppd_v02 | https://trek.nasa.gov/moon/ | Map basemap (`public/tiles/moon.pmtiles`) | Used; credit "NASA/GSFC/Arizona State University" |
| NASA Trek (Mars) | Mars_Viking_MDIM21_ClrMosaic_global_232m | https://trek.nasa.gov/mars/ | Map basemap (`public/tiles/mars.pmtiles`) | Used; credit "NASA/Viking/USGS" |terrain" | See Phase 5 notes in `docs/OFFLINE.md` |
| HiRISE (Mars Reconnaissance Orbiter) | per image | https://www.uahirise.org/ | Used: Co-ordinates | Used |
## Community ideas (Firebase, optional)

The Recovery page can store community ideas in Firebase when the `VITE_FIREBASE_*` variables are set. It is **not** part of the demo path; without the variables (or with `?offline=1`) the app makes no Firebase calls.

## Built with

React, TypeScript, Vite, Tailwind CSS, Three.js / react-three-fiber, framer-motion, MapLibre GL + PMTiles.


## AI use

See [`docs/AI_USE.md`](docs/AI_USE.md).

## License

Apache-2.0. See [`LICENSE`](LICENSE). Third-party media keeps its own credit lines (NASA/JPL-Caltech etc.).

---

## 🌌 What is StarBound?

StarBound transforms spacecraft and rover missions into an interactive experience where users can:

* Explore historic robotic explorers
* Learn about their missions and discoveries
* Discover how they collected scientific evidence
* Read about what happened to each explorer
* Interact with rover/spacecraft stories
* Explore their final known locations and mission status
* Share ideas about what could be done with abandoned explorers

## 🛰️ Explorers

StarBound features explorers from different parts of the Solar System, including:

* 🌙 Lunar explorers
* 🔴 Mars rovers
* 🪐 Deep-space spacecraft
* 🚀 Historic planetary missions

Each explorer has its own story, mission history, scientific discoveries, and ending.

## 💡 Community Ideas

StarBound also gives users a place to share ideas about abandoned spacecraft and rovers.

Users can submit:

* Their idea
* Expected impact
* Possible drawbacks
* Their name or an anonymous submission

Community ideas are displayed separately so visitors can explore different possibilities for the future of these explorers.

## 🎨 Design

StarBound uses an immersive space-themed interface designed to make spacecraft history accessible and engaging, especially for younger audiences.

The experience combines:

* Interactive cards
* Mission timelines
* Illustrations
* Space imagery
* Story-driven content
* Interactive rover conversations
* Community submissions

## 🌠 Why StarBound?

Space exploration is often remembered through launches, discoveries, and successful missions.

StarBound focuses on what remains afterward.

The explorers that stopped responding, ran out of power, became stranded, or simply reached the end of their missions still contributed valuable science to humanity.

**Their missions ended. Their stories didn't.**