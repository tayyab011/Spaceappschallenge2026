# AI use

This file states plainly what AI tools did in this project.

## Tools

| Tool | Used for |
| --- | --- |
| Claude (Anthropic) | Repo hygiene, data schema and validator, map view, i18n, offline/accessibility work (Phases 1-5 below). Also basemap documentation, PMTiles inspection, and fixes to the Storybook landing page |
| Google AI Studios | audio & 3D assets |
| ChatGPT (OpenAI) | Generic paragraph to json files for interview chats, story books  & rover anatomy|

## What AI did

Work done with *Claude* in the Phase 1-4 session:

- Phase 1: `LICENSE` (Apache-2.0 text)
- Phase 2: `data/objects.geojson` skeleton, `src/types/objects.ts`, `scripts/validate-objects.mjs`. **AI did not supply coordinates, dates or mission facts.**
- Phase 3: i18n scaffolding (`src/i18n/`).
- Phase 4: service worker, offline mode, accessibility fixes, relabelling procedural terrain, asset-localizing script.

Exact files per phase are listed in the hand-off notes for each phase.

- **Storybook landing page (`landing-story`):** AI rewrote speech-engine and
  auto-voice code, and replace the synthesized
  scene music with an MP3.

Work done with *ChatGPT*:

- converting paragraphs to json and geojson files 
- converting stories to `BOOKS` array for abandoned stories
- converting paragraphs to interview chats

Work done with *Google AI Studio*:

- creating `starbound` game simulation for kids
- creating `3D simulation` in archive
- basic structure of `landing story`



## What we did ourselves

The team :
- wrote the stories , after fact checking from NASA's sources.
- did mission searches and verified every information before implementing
- Built and checked basemap tiles
- Built and checked `Recovery` functionalities
- Built and checked `Rover` data
all against real NASA sources as cited in the site.

## Rules we follow

- AI-written data is never marked `"verified": true`. Only a person who has
  checked the value against the cited source (NSSDCA, PDS, NTRS, etc.) flips it.
- Third-party media keeps its credit line.
- AI-looked-up dataset names and credit lines are checked against the source
  catalogue before they are written into a README or credit line.