# Local map basemaps


## Files

| File | Status | Format | Size |
| --- | --- | --- | --- |
| `moon.pmtiles` | Built | PMTiles v3, JPEG tiles, zoom 0-4 | about 4.3 MB |
| `mars.pmtiles` | Built | PMTiles v3, JPEG tiles, zoom 0-4 | about 2.9 MB |
| `moon-mercator.jpg` | Not used | Fallback single image | - |
| `mars-mercator.jpg` | Not used | Fallback single image | - |

The Map view reads a `.pmtiles` file if it exists. Otherwise it falls back to the
`-mercator.jpg` image. With neither file, it shows a lat/lon grid and the note
"No local basemap installed".

## Projection and extent

Both files are Web Mercator (EPSG:3857) and cover -180 to 180 longitude and
-85.0511 to 85.0511 latitude. This is the extent produced by step 3 in
`docs/BASEMAPS.md`.

- `moon.pmtiles` covers the full longitude range, -180 to 180.
- `mars.pmtiles` extends to 179.56 longitude on the east edge, not 180. This is
  about one tile column short. It is minor, but check the eastern edge at zoom 4
  when reviewing the map.

## Sources

| Body | Product | Credit line |
| --- | --- | --- |
| Moon | LRO WAC Global Mosaic 303ppd v02 | NASA/GSFC/Arizona State University |
| Mars | **To confirm** (see `docs/BASEMAPS.md`: Viking MDIM 2.1 Grayscale 232 m) | USGS Astrogeology Science Center; NASA Viking mission |

**Open:** the Moon source above does not match `docs/BASEMAPS.md`, which
selects the LROC WAC Global Morphology Mosaic 100 m. Confirm which product was
used and update one of the two documents so they agree.

## Attribution

The PMTiles metadata contains only `name`, `description`, `format`, `minzoom`,
`maxzoom`, `type` and `version`. It has no attribution field, so the credit
lines above must also appear in the README table and in `src/map/copy.ts`.
**Do not ship a basemap without its credit line.**

## Checking a new file

Replace a file only after checking it:

1. Run `pmtiles show public/tiles/<body>.pmtiles` and confirm the bounds and zoom range.
2. Run `npm run dev`, open `/map`, and confirm the note is gone and the credit shows.
3. Check the poles and the 180-degree seam for distortion.