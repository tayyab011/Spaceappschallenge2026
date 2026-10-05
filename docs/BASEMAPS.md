# Map basemaps (Moon and Mars)

The Map view (`src/map/`) only loads files from this site. It looks for, per body:

1. `public/tiles/<body>.pmtiles` - raster tiles in Web Mercator (preferred)
2. `public/tiles/<body>-mercator.jpg` - one image that is **already** in Web Mercator (fallback)
3. Neither - a plain lat/lon grid, with a visible "No local basemap installed" note

`<body>` is `moon` or `mars`. The repo ships **no basemap files**: they were not built
in the environment where this code was written (no GDAL, no access to NASA Trek).
The commands below are the intended recipe and have **not been run yet**. Run them,
look at the result, and fix anything that differs on your GDAL version.

## Why reprojection is required

NASA Trek layers and global mosaics are usually **equirectangular** (plate carree):
latitude is linear. MapLibre tiles are **Web Mercator**. If you cut equirectangular
imagery into tiles as-is, markers land in the wrong place, most visibly near the poles.
Reproject first.

## Steps (per body)

Tools: GDAL (`gdal_translate`, `gdalwarp`, `gdaladdo`) and the `pmtiles` CLI.

1. Get a global equirectangular mosaic for the body from NASA Trek or the PDS.
   Record the layer name, dataset id and credit line. **TODO: choose layers and
   fill `docs/BASEMAPS.md` and the README data-sources table.**
2. Tell GDAL the image covers the whole globe. Angular coordinates are all that
   matter for the tile pyramid, so label the grid as plain lat/lon (EPSG:4326):

   ```bash
   gdal_translate -a_srs EPSG:4326 -a_ullr -180 90 180 -90 moon-global.tif moon-geo.tif
   ```

   Check the mosaic's own longitude range first. If it runs 0-360, shift it
   before this step, and confirm the longitude convention (east positive) matches
   what you enter in `data/objects.geojson`.

3. Reproject to Web Mercator, clipped to the Mercator latitude limit:

   ```bash
   gdalwarp -s_srs EPSG:4326 -t_srs EPSG:3857 \
     -te_srs EPSG:4326 -te -180 -85.0511 180 85.0511 \
     -r bilinear -multi -wo NUM_THREADS=ALL \
     moon-geo.tif moon-3857.tif
   ```

   (EPSG:3857 is used only as a spherical Mercator grid. The planet's radius does not
   matter because tiles are addressed in normalized coordinates.)

4. Cut tiles into MBTiles and add overviews:

   ```bash
   gdal_translate -of MBTILES -co TILE_FORMAT=JPEG -co QUALITY=80 moon-3857.tif moon.mbtiles
   gdaladdo -r average moon.mbtiles 2 4 8 16 32 64 128
   ```

5. Convert to PMTiles and drop it into `public/tiles/`:

   ```bash
   pmtiles convert moon.mbtiles public/tiles/moon.pmtiles
   ```

6. Put the credit in the archive metadata so the map shows it automatically
   (the app reads PMTiles metadata for attribution). If your tooling cannot set
   an `attribution` metadata field, add the credit to the README table and to
   `src/map/copy.ts` instead. **Never ship a basemap without its credit line.**

Repeat for `mars`.

## Image fallback

If PMTiles is not an option, export step 3's output as JPEG and save it as
`public/tiles/<body>-mercator.jpg`. It must be Web Mercator, spanning
-180..180 longitude and about -85.0511..85.0511 latitude. An equirectangular
image will be drawn distorted. Keep it under a few MB for phones.

## Size and offline

- `.pmtiles` files are read with HTTP range requests. The service worker
  (Phase 5, see `docs/OFFLINE.md`) stores the whole file once so the map works offline.
- Keep each file to a size you are happy to have cached on a phone. A lower max
  zoom (step 4 overviews and `gdal_translate` options) shrinks it a lot.

## Checking it worked

1. `npm run dev`, open `/map`, and confirm the "No local basemap installed" note is gone.
2. Once a verified object exists, check that its marker sits on the feature its
   source describes (for example, on the landing site in the source imagery).
3. Look near the poles and the 180-degree seam. Distortion or a shifted image means
   step 2 or 3 used the wrong extent.
