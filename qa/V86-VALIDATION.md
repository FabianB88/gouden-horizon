# v8.6.0 — Ruimte om te dwalen

Validated 3 October 2026. This source ZIP is not a new production deployment.

## Result

313 focused regression groups passed. The subsequent three normal-action campaign simulations all completed 24 chapters; all five timed arena / tier combinations cleared. `npm run site:build` and `git diff --check` passed.

| Seed | Discipline | Chapters | Result | Checkpoint retries |
| --- | --- | --- | --- | --- |
| 48 | tide | 24 | won | 0 |
| 209 | storm | 24 | won | 2 |
| 815 | ember | 24 | won | 2 |

The initial ember simulation lost at the final boss. The test autopilot now uses its existing, earned bandages below 68% health when an awake boss is present, anticipating clustered hits during the existing 10-second cooldown. Normal enemy fights retain the 52% threshold. All three campaign and timed-trial simulations were rerun after this test-only change. Actual game healing, damage, enemy clocks, HP, loot quality and drop probabilities were not weakened. No simulation grants gear, health or mana or forces kills; checkpoint retries use the ordinary game action.

## Navigation

`wandering-tests.mjs` walks every one of the 48 possible scrap positions across eight safe hubs, in both directions, using ordinary eight-direction keyboard input and routes planned with 35 world units of clearance. It also walks all early-hub services, gates, crates and Milo. Compact routes are subdivided into steering targets at most 70 world units apart; tests do not teleport along them.

Milo at Getijdenkade stands on the greenhouse terrace, clear of the main promenade and other interactions. The existing upgrades tests cover gate destinations, merchant and crate access, stairs and main-road clearance.

## Economy and persistence

Each safe hub selects 2–4 off-route finds from six positions using a separate deterministic seed; combat RNG and numeric entity IDs are unchanged by this selection. Each find pays 3–9 scrap. Regional totals cap at 24 / 28 / 36. Tests cover 60 seeds per hub, variety, a full backpack, absence of the health-pickup magnet, no healing or XP, one payment, revisits, saved games and checkpoint retry. Combat arenas do not generate these finds.

## Artwork and limits

Two 1536 × 1024 generated map edits and a transparent painted ground-scrap asset are included. Prompts are preserved in `assets/V86-ART-PROMPTS.json`. Actual production Renderer output was inspected with native Canvas for both early hubs and Milo's terrace; all production assets decoded. This is visual asset/placement QA, not browser-layout or measured browser-FPS testing. Existing DOM-model menu tests and rendering-budget checks passed.
