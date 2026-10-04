# Groene Corridor v8.8.4

The published v8.8.3 navigation (commit `755f93e`) still clipped visible paving
at the gate, the moonseed stairs, the crystal stairs, and the southern promenade.
Connecting a few centre lines did not make the rest of those paths walkable.

`forest-navigation.js` now supplies complete painted floor outlines for both
native forest tiles and their joining causeway. Adjacent steps and landings
overlap with room for the hero's collision footprint. Two western scrap drops
were moved from terrace edges onto clear paving. No artwork was stretched or
replaced, and the physical gate still blocks the wilderness until opened.

Validation:

- Nine independently traced walking lines, each tested at the centre and both
  sides, forward and backward, using normal eight-direction movement. These
  cover the western terrace/stairs/ramp, gate and moonseed landing, central
  garden and eastern bridge, crystal stairs, temple porch and southern exit.
- 3,585 sampled points across those painted lanes: 421 were blocked by the
  published v8.8.3 floor geometry; all pass with the new floor geometry.
- Real desktop browser key presses traverse the western stairs, moonseed
  route, crystal stairs and southern promenade in both directions. The normal
  interaction key opens the gate. No browser errors or missing resources.
- Gate collision before opening, passage and return after opening, and saved
  open-gate state. Painted water and greenhouse walls remain blocked.
- Existing outdoor exploration (11), wandering (6), navigation (10), and
  world-walkway/preload (6) checks pass, alongside 11 focused forest checks.
- Static build succeeds. All 24 prepared navigation grids are regenerated;
  the 20 grids outside the forest are byte-for-byte equivalent in parsed data
  to the published v8.8.3 records. Browser module revision 37 and the new
  navigation filename avoid reusing stale forest code and grids.

Reproduce focused checks with `npm run test:world` and the existing
`qa/outdoor-v872-tests.mjs`, `qa/wandering-tests.mjs`, and
`qa/navigation-v871-tests.mjs` scripts. `qa/forest-browser-tests.mjs` uses
Playwright, with optional `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE` and
`FOREST_SHOTS` environment variables. `qa/forest-review.html` overlays the
actual floors on each painted tile for visual review.
