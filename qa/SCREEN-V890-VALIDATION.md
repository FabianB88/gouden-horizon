# Gouden Horizon v8.9.0 — screen travel and painted paving

Five large expansions now use explicit screen-edge travel: Getijdenkade/Tuinwijk, Vrijhaven/Oostwijk, Groene Corridor/Wilde Serre, Buitenzeebrug/Stormwacht, Koelhof/Sintelhoven. Only the active painting is drawn, camera and minimap are restricted to that screen, and normal movement cannot cross the old tile seam. Arrival uses fixed verified paving. Saved coordinates and shared quest worlds stay compatible. Milo still unlocks the garden; outdoor gates still require ordinary interaction. Both LAN players must approve travel; both heroes snap to the new screen rather than interpolating across the old bridge.

Each of the 27 unique combat paintings (31 areas/variants) now has its own native outline instead of the generic zone boundary. The foreground/southern paving and stairs are included. Source artwork retains its aspect ratio.

## Validation

- `npm test` passes, including all existing groups, seven new screen-transition checks and 31 arena/variant paving checks.
- Independent southern road fixtures check 85,699 dense full-footprint positions, three lanes in both directions. Movement follows fixed lines with ordinary eight-direction inputs; reaching the destination by another route does not pass. These isolated locomotion tests exclude combat/wave progression; full campaign and trial simulations separately exercise actual damage and rewards.
- Browser keyboard control on all 31 arena areas/variants: 11,285 movement frames, maximum cross-track deviation 5.38 world pixels; no page errors or missing resources.
- Forest browser journey uses the actual edge button and physical gate, then walks the seed, crystal and southern roads and returns. Additional stairs, balcony and forecourt routes are walked both ways: 6,681 frames, maximum deviation 6.54 world pixels; no page errors or missing resources. Fifteen fixed forest roads are also tested at both sides and the centre, forward and reverse.
- Existing ordinary road checks across the intermediate areas, including Inez and the last metro, pass. Water, beds and solid scenery remain blocked.
- Actual edge-button clicks in both directions, repeated twice, for all five expansions; camera bounds and ordinary movement from each arrival checked. A genuine Android touch browser context checks portrait tapping and button placement.
- Four LAN interpolation checks, including new-screen arrival of both heroes, fourteen LAN authority/network checks and saved-progress transition checks pass.
- Three ordinary campaign simulations traverse all 24 mandatory areas and earn all eleven spells. Two defeat the final boss; the third dies there after its allowed checkpoint retries. This is accepted combat difficulty, not a navigation stall. The test requires every profile to reach the final arena and at least one to demonstrate victory. No enemy difficulty, rewards, player stats or farming rules are softened.
- Five trial/tier combinations complete with ordinary earned equipment and actual enemy attacks.
- `npm run site:build` passes. Cache revision 40 and `walkways-v890.json` invalidate the former geometry. Desktop still prepares navigation and decodes maps before play; mobile keeps its existing bounded image cache.

Browser evidence is stored privately under `work/arena-browser`, `work/forest-v89` and `work/sections-browser-final`. Source-outline contact sheets were visually reviewed against all unique paintings. These are tested routes and boundaries, not a claim that every possible movement/input sequence has been exhaustively verified.
