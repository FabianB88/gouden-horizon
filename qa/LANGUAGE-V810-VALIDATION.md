# Nederlands / English — v8.10.0

Language coverage verified on 5 October 2026, with the added district directions checked on 6 October 2026.

- `npm run test:language`: preference validation, Dutch default, counters/cooldowns, item and shop actions, brand preservation, 209 complete story/objective/spell texts, unchanged serialized gameplay, and Dutch restoration pass.
- Browser: language selectors on the title and settings screens; English class choice and prologue; 44 journey screens; skills, equipment, world map, codex, side routes, trials, city quests, item details, unlocked atelier, merchant stock, selling and forge.
- English/Nederlands switching restores the original Dutch help text exactly. Existing save bytes remain unchanged when switching. English selection and Continue persist after reloading.
- Player-entered names are preserved. Labels in the canvas use the same catalogue as menus. Numbers, keys, IDs and input values remain stable.
- Desktop 1280×800 and mobile 390×844 inspected. The title language selector and settings fit the available width. No page errors. The paused English screen produced 34 DOM changes in the idle observation, including the test element; localization does not rewrite the HUD continuously.
- The catalogue is bundled locally. No runtime translation API, account or key is required.

No combat campaign, pathing, arena or artwork regression sweep was repeated for this language update. No navigation bake or artwork generation was needed. Gameplay difficulty and the v8.9.1 death-recovery behavior are unchanged.
