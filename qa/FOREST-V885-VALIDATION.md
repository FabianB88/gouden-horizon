# Groene Corridor v8.8.5 — painted routes

The v8.8.4 checks proved selected destinations were reachable, but missed parts
of visible roads. Some reference lines themselves crossed planted edges or rocks.
This revision corrects both the floor outlines and the independently drawn paths.

Changes are limited to the forest: the joining bridge and its stair landings,
the western greenhouse balcony, the crystal stair flights, the southern turn
around the crystal column, the temple approach and the foreground promenade.
Two creature spawn references now sit on paving. Art retains its original scale.
The former southern test destination [1420,943] is a planted edge; the test now
uses the visible promenade [1420,980]. The planted edge is explicitly solid.

Validation:

- Sixteen painted walking lines, tested at left/centre/right and in reverse with
  ordinary eight-direction movement. Direct segment clearance is required, then
  every movement frame must remain within ten world pixels of that segment.
  A* cannot choose another road to hide a missing stretch of paving.
- One continuous journey starts at the actual arrival point, crosses the market
  bridge, opens the physical gate with normal interaction, visits the moonseed,
  crystal stairs and southern promenade, then returns along the same roads.
  No repositioning occurs anywhere in that journey.
- Real browser WASD follows the continuous journey and additional western stairs,
  balcony and Seya forecourt in both directions. Every game update is recorded.
  Maximum allowed cross-track distance is ten native painting pixels (17.5 world
  pixels), measured against the active segment; this allows normal eight-direction
  steering within the side lanes checked above, but prohibits alternative roads.
  Trajectory overlays compare the actual footsteps with the painted road. Browser time advances in 20 ms steps through normal input/render updates to avoid automation latency holding keys too long; this is a movement test, not a real-time frame-rate benchmark.
- The final browser run recorded 7,058 movement frames with maximum cross-track
  deviation 5.35 world pixels; the trajectory overlays were visually reviewed.
  No browser errors or missing resources occurred.
- Closed/open/saved gate behavior and solid water, buildings, crystal-column
  flowerbeds, rock garden and the southern planted edge are checked explicitly.
- Nineteen focused forest checks, six walkway/preload checks, eleven outdoor
  checks, six wandering checks and ten existing navigation checks pass.
- Static build regenerates 24 navigation grids. The 20 non-forest records remain
  identical in parsed data to v8.8.4. Cache revision 38 and walkways-v885.json
  prevent cached v8.8.4 geometry from being reused.

Reproduce: `npm run test:world`, `node qa/outdoor-v872-tests.mjs`,
`node qa/wandering-tests.mjs`, `node qa/navigation-v871-tests.mjs`.
The browser check is `node qa/forest-browser-tests.mjs`, with optional
PLAYWRIGHT_MODULE, CHROMIUM_EXECUTABLE and FOREST_SHOTS environment variables.
`qa/forest-review.html?tile=1&journey` displays the reference route on the artwork;
adding `overlay` shows floor boundaries. Browser output includes actual movement
records and comparison images. Combat enemies are cleared for walking trials;
separate outdoor checks cover live creatures, activities, rewards and co-op.
