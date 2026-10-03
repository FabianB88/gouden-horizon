# v8.5.0 validation — combat, motion and browser work

This release refines the existing campaign. It introduces no new zones, rewards, enemy health/damage multipliers, drop rolls or skill prices.

## Automated checks

`npm test` runs 308 rule and menu-entrypoint regression groups, three ordinary 24-chapter campaign simulations and five endgame trial combinations. The campaign bots earn their equipment, pay for upgrades and do not receive forced kills, free healing or test-only gear. The campaign outcomes were won with 1 / 0 / 0 checkpoint retries. The five trials cleared all four waves and paid their normal rewards.

Eleven new polish groups verify active-frame telemetry, paused scene cadence, spatial neighbour queries across cell boundaries, melee approach lanes and ranged distance bands, cosmetic hit motion, once-only death rewards, actual equip totals in either relic slot, capped poison percentages, actual spell damage/variants, foot contact speed and composed alpha/cloud caching. Additional entrypoint and audio checks verify paused scene rendering, resumed gameplay, settings readout, elemental heavy hits, critical accents and rate-limited secondary damage.

The main entrypoint is tested in a DOM model (19 groups). It covers scroll-preserving selling, buying, equipment, both mouse bindings, numeric skills, variants, rune crafting and safe-area quest interactions. Source syntax and `git diff --check` pass. `npm run site:build` produces the static game.

## Native rendering and performance observations

Production WebP/JSON assets were decoded with native Canvas at 1920×1080. A sheet of 48 directional walking/casting poses and a mixed encounter with four area spells, enemy windups and four elemental hits were rendered and inspected. Ground anchors, staff alignment and fade composition are retained.

Stationary scene fixtures use 130 rendered frames, discard 20 warm-up frames and include pose motion. Native timings measure CPU-side Canvas calls, not browser animation-frame cadence, GPU work, CSS, touch or speaker output. Small differences below are not evidence of a browser FPS gain.

| Fixture | v8.4 median / p95 | v8.5 median / p95 |
| --- | --- | --- |
| Welcome, Getijdenkade | 3.31 / 4.87 ms | 3.15 / 4.25 ms |
| City, Vrijhaven | 1.69 / 3.48 ms | 1.81 / 3.78 ms |
| 24 enemies, 15 effects | 2.53 / 3.81 ms | 2.42 / 3.97 ms |

An experimental large background cache regressed these timings and was removed. The original painted background rendering remains. The reliable work reductions are zero repeated scene draws behind the cover or a steady menu, local neighbour queries, cached cloud feathering, offscreen effect/projectile culling and fewer decorative particles/trail segments under load. Beam bounding boxes retain beams whose endpoints are outside the view.

Actual requestAnimationFrame intervals are now measured in the player's browser during play. Settings shows average FPS, p95 frame duration and the share of frames above 25 ms over the last 180 active samples. Pause/cover gaps reset the interval; active stutters count. Automatic render resolution remains separate and keeps aim/world coordinates unchanged.

## Limits and balance

No manual browser layout, actual browser FPS, touch or speaker-output test was available for this release. Native renders and the DOM model do not substitute for those checks. The FPS readout makes device-specific stutter measurable during play.

Hit recoil/death fade never moves collision positions, grants stun, delays attacks or consumes RNG. Enemy positioning may change the practical fight pattern; campaign/trial completion confirms continuity, not identical human difficulty. Poison remains 50% of maximum life over 8 seconds before resistance; resistance caps at 60%. Item comparisons use percentages of maximum life and compute either relic replacement independently. Spell damage labels exclude conditional unique-item effects, critical hits, combos and enemy defences. Shop baseline numbers remain visible beside current-gear estimates.
