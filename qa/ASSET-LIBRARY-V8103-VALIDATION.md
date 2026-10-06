# Reusable scenery library — v8.10.3

Nine full transparent static assets are registered in `assets/modules/catalog-v1.json`: the original sandstone paving, planter and lantern, plus bench, tree, crate, pillar, fountain and slate paving. The six new sprites are built-in imagegen outputs; exact generation and final transparency-edit prompts are in `ASSET-LIBRARY-PROMPTS-V8103.json`. Compact WebP files are under assets/modules. The original generated images remain in Codex generated_images. Production preparation only crops transparent outer margins, uniformly downsizes and encodes WebP, preserving generated alpha.

The complete library is 250,902 compressed bytes (245 KiB), with nine unique image files. Repeated placement refers to the same catalogue entry and renderer image; no copy of an image is made per instance. Original three assets are reused by their original filenames.

The JSON register is the authoring source. `scripts/build-scenery-catalog.mjs` validates it and generates the synchronous browser module `src/scenery-catalog.js`. Entries record stable ID, Dutch/English name, category, environment tags, image dimensions, anchor, default placement size, normalized base footprint, compressed bytes and prompt provenance. The existing renderer iterates the catalogue, so all nine images download and explicitly decode before Start becomes available on desktop and mobile. Desktop also prepares 48 full maps and 24 navigation grids; mobile keeps its bounded decoded-map cache after prefetching map bytes.

`placeSceneryModule` preserves image aspect and applies the same placement scale to collision radii. Flat diamond floors are walkable; props use ground-base ellipses. The reserve assets are not placed in any existing area yet. Their footprints are starting placement geometry; every future placement must check the visible lane and foot clearance. The current forest paving and two prop placements retain their exact positions and base radii. Extra catalogue metadata changes the navigation fingerprint even though geometry is unchanged: the four forest records were refreshed, with all twenty other records retained.

`asset-library.html` provides NL/EN names, search, floor/prop and environment filters, a visible footprint overlay, image sizes, usage state, copyable placement data and downloadable JSON. A link in the unlocked F8 admin menu follows the game language. It works on mobile without horizontal overflow. No editor or placement operation runs during ordinary gameplay.

## Focused checks

- `qa/asset-catalog-tests.mjs`: nine unique entries/files; register agrees with generated source; shared asset identity across placements; preserved aspect and scaled footprints; original prop radii unchanged; reserve assets do not create obstacles; size budget.
- `qa/module-assets-tests.mjs`: 5,896 visible paving samples with foot clearance; joined edge; actual keyboard seam crossing; solid existing bases.
- `qa/navigation-preload-tests.mjs`: all 24 prepared records accepted.
- Static build includes the library and catalogue.
- Fresh Edge browser: nine catalogue previews; name search, category/environment filters, empty search results, NL/EN, footprint toggle and 390px layout all pass. All nine scenery images are prepared before play; 48 decoded desktop maps and 24 navigation grids ready. Actual F8 link follows Dutch/English. No image/JSON requests after readiness during F8 previews, forest/metro travel, atlas or spell menu; no page errors. Screenshots visually checked for complete silhouettes and transparent surroundings.

This is a reusable library for future placement, not a rebuild of all areas or an FPS guarantee.
