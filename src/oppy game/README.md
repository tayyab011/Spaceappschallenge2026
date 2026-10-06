# Starbound 🚀 — Kids' Educational Mars Rover Game

A self-contained React + TypeScript feature folder for a kid-friendly 3D Mars rover exploration game featuring Opportunity (Oppy), procedural Mars landscapes, space discoveries, and verified NASA history.

Designed to be dropped directly into any React application without requiring complex scaffolds or external asset files.

---

## 1. Installation

Install the peer dependencies required for Three.js 3D rendering and Framer Motion UI animations:

```bash
npm install three @react-three/fiber @react-three/drei framer-motion @types/three
```

---

## 2. Tailwind CSS Configuration

Ensure Tailwind scans the files inside `starbound/`. Add the path to your Tailwind `content` array (adjust path if you place `starbound/` in a different location):

```js
// tailwind.config.js or tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/starbound/**/*.{ts,tsx}",
  ],
  // ...
};
```

*(If using Tailwind CSS v4 with `@import "tailwindcss";`, files under `src/` are scanned automatically).*

---

## 3. Usage Example (3-Line Quick Start)

Import and render `<Starbound />` directly in any React component or page:

```tsx
import React from 'react';
import Starbound from './starbound';

export default function MarsPage() {
  return <Starbound />;
}
```

---

## 4. Key Highlights & Architecture

- **Zero External Texture Assets**: All planetary surfaces, starry skies, Mars dirt, and mineral spheres are generated procedurally on demand via HTML5 Canvas and mathematical noise algorithms.
- **Self-Loading Fonts**: Dynamically injects Google Fonts (`Fraunces` for editorial serif titles and `Plus Jakarta Sans` for clean, readable body copy) via `<FontLoader />`.
- **Kid-Friendly Design**:
  - No game-over or punishing timer mechanics.
  - Gentle, encouraging tone with helper robot "Orbit" delivering timely hints.
  - First-Person View (FPV): Authentic rover mast camera perspective with driving suspension bob, turn banking tilt, viewfinder reticle, and real-time heading telemetry (toggleable to 3rd-person via `[C]` or HUD button).
  - Instant Discovery Pop-ups: Arriving at a scientific site automatically triggers an educational Discovery pop-up modal with NASA facts, photos, and 3D models (no manual scan buttons required).
  - Prominent Finish Mission Banner: Completing all mission objectives triggers an eye-catching, celebratory `FINISH MISSION` call-to-action front and center in a large, bold font.
  - Generous touch and keyboard targets (WASD / Arrows + onscreen D-pad).
  - Reduced-motion accessibility detection (`prefers-reduced-motion`).
- **Interactive 3D Sketchfab Viewers**: Integrated embeds for scientific 3D models (NASA InSight lander and conceptual Mars habitats) with full attribution and fallback handling.
- **5 Structured Missions**:
  1. *Learn to Drive* (Navigating glowing crater checkpoints)
  2. *Rock Detective* (Scanning Martian blueberries and InSight seismometer)
  3. *Stuck in the Sand!* (Wiggling free with wheel-slip feedback)
  4. *Chase the Sun* (Aligning solar panels on sunny ridges for power recharge)
  5. *Find Oppy* (Following historic rover tracks to Opportunity at Perseverance Valley)

---

## 5. Folder Hierarchy

```
starbound/
  index.ts                  // Default export <Starbound /> & types
  Starbound.tsx             // Screen state machine & providers
  config.ts                 // Palette constants, APP_TITLE, and START_LABEL
  FontLoader.tsx            // Dynamic Google Font injection
  README.md                 // Installation & usage documentation
  state/
    gameReducer.ts          // Pure reducer for time, distance, discoveries, meters
    GameContext.tsx         // React Context provider & useGame hook
  screens/
    LandingScreen.tsx       // 3D Solar system view, Fraunces title, "Be Oppy" button
    MissionIntro.tsx        // 3-second animated SVG path, Orbit wave, countdown
    MissionComplete.tsx     // Per-mission celebration card & stats recap
    FinalScreen.tsx         // Touching finale at Perseverance Valley & verified history
  three/
    SolarSystemScene.tsx    // Cream sun, concentric halos, Mars hover ring, OrbitControls
    MarsGameScene.tsx       // 3D Mars viewport, user-controlled follow camera
    Rover.tsx               // 6-wheel low-poly Oppy rover with mast & solar panels
    MarsTerrain.tsx         // Procedural noise heightmap, instanced rocks & dust
    Gems.tsx                // Collectible sparkle gems with synthesized audio chime
    DiscoveryMarkers.tsx    // Glowing beacons, checkpoints, and twin rover site
    CameraFly.tsx           // 2.5s smooth easing camera flight to Mars
  ui/
    Hud.tsx                 // Top stat bar, mission pill, meters & scan trigger
    DiscoveryJournal.tsx    // Grid of found discoveries vs "?" silhouettes
    DiscoveryCard.tsx       // Educational card with verified facts & 3D model link
    TouchControls.tsx       // Big accessible on-screen buttons for touch devices
    SketchfabViewer.tsx     // Attributed Sketchfab 3D modal with graceful fallback
  data/
    missions.ts             // 5 data-driven missions
    discoveries.ts          // Verified facts & NASA source citations
```
