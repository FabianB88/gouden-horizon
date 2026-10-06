# Separate scenery assets and startup preparation — v8.10.2

The first modular kit is integrated into the Wild Conservatory forecourt. Two independent sandstone/brass floor diamonds meet along their complete shared edge. A separate planter and a separate lantern sit outside the walking road. Original backgrounds stay at their current scale. This is a first reusable kit and focused improvement, not a conversion of every existing painting.

`src/scenery-modules.js` is the common placement description. Drawing preserves each image's original aspect. Floor geometry comes from the same dimensions as the drawn floor diamond; each solid prop uses its small actual base footprint. Ground renders under characters; props sort by their base position. Normal viewport culling applies. No new per-frame masks, filters or image generation.

The three transparent game WebP assets total 74,548 bytes. Their decoded surfaces total under 0.7MB. They are generated with built-in imagegen; the exact three prompts and mode are in MODULAR-ASSET-PROMPTS-V8102.json. Original generated files remain in Codex generated_images. Compact game files and geometry metadata are under assets/modules/.

Startup downloads and decodes the complete active sprite set, these three modules, all item/ability/companion icons, all current area previews, class portraits and prologue images before enabling Start. `scripts/build-ui-artwork.mjs` maintains the UI artwork list when building; 150 menu/UI images are registered, including files that the scene renderer already loads. File deduplication prevents repeated image loads. Existing desktop preparation of 48 maps, 24 navigation grids and costume poses remains. Extra loading happens at startup. Mobile retains its bounded full-map decode cache, with map bytes already downloaded before play; the new modules and UI sprites decode before play on mobile too.

Cache revision 45 and navigation file walkways-v8102.json.

## Focused verification

- `qa/module-assets-tests.mjs`: 5,896 sampled points across the complete visible floor diamonds, with hero-foot clearance; full edge join, keyboard seam crossing, solid prop bases, uniform image scaling and compressed size budget.
- `qa/forest-navigation-tests.mjs`: all 18 existing painted-road/gate keyboard checks pass with the new modules.
- `qa/district-quests-tests.mjs`: 39 routes and nine usable optional quest givers pass.
- Edge browser: all three module images decoded before play; 48 maps and 24 prepared grids ready. No new image/JSON requests after startup during character selection for both genders, travel to the extra district, viewing the floor joint, visiting the physical gate, switching to the metro and back, opening the atlas and opening the spell menu. No page errors. Actual screenshots checked against the floor and road layout.

This verifies the new graphics do not add in-play downloads in those flows. It does not claim a particular FPS on every laptop or a complete rebuild of all old scenery.
