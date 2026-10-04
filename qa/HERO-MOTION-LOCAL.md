# Local walking and turn correction — 2026-10-04

User reported imperfect feet/walking when turning around in recovered v8.8.2.

Turns now advance through adjacent painted views with one opaque silhouette. The old full-character crossfade drew two sets of boots during a reversal. Spell origin uses the same visible pose. Dashes still face their travel direction immediately.

Painted leg rotation and boot translation now share a calculated ankle position. Foot contacts use the gait's actual stride distance, including diagonal travel and collision deflection, rather than the old smaller leg swing. The original leg and boot artwork remains rigid. LAN prediction keeps the local visual pose between snapshots.

Validation: 50 existing/new regression groups across presentation, Android, polish, survival and LAN client suites passed; 7,680 ankle/boot contact cases passed across all six character variants. Eight directions and consecutive reversal frames were rendered and visually checked for all six appearances with no browser errors. Static build and whitespace check passed. The localhost game was refreshed and the saved expedition resumed.

Run `npm run test:hero` for the motion checks. Open `/qa/hero-motion-preview.html` for a frame review; its `variant` query accepts the six class/gender combinations. This QA page is excluded from the published static build.

The character still uses eight painted views; this patch does not create a continuously rotating 3D model. Live movement feel remains subject to the user's playtest.
