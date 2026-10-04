# Distinct female characters — 2026-10-04

All three female classes were redrawn with the built-in image-generation tool following the user's request for substantially different, more feminine appearances.

- Elementalist: elegant fitted blue mage coat, silver hair and crystal detailing.
- Natuurhoeder: long chestnut curls, flowers, a leaf-patterned fitted bodice and split tunic.
- Veldjager: auburn high ponytail, fitted field jacket and leather waist panel.

All use slimmer shoulders, defined waists, feminine curves and fitted leggings. Class palettes and gameplay statistics remain the same. The new art is connected to character selection, field rendering and equipment portraits. Original artwork is retained.

Final assets are in `assets/painted/`: `hero-class-elementalist-female-v883.webp`, `hero-class-builder-female-v883.webp`, `hero-class-hunter-female-v883.webp` and the matching `portrait-*-female-v883.webp` files. Exact prompts and generation mode are saved in `CHARACTER-V883-PROMPTS.json`.

New female rigs have adjusted boot-ground anchors, leg masks and staff/head attachment points. Low-colour charcoal leggings are excluded from the coat mask so they animate with the legs. All five source views retain real transparency and mirror into eight directions.

Validation: 35 motion/Android/render-budget/polish regression groups passed after the final rig changes, plus 10,240 rigid ankle/boot contact cases. Navigation/artwork suite passed during integration. All six appearances, eight directions and consecutive reversal frames were rendered; the three female appearances were additionally reviewed with staff and head gear. No browser errors. Static build and whitespace check passed. Live playtest remains useful for animation feel.

Use `/qa/female-character-review.html` for side-by-side production renders; `/qa/hero-motion-preview.html?variant=hunter-female&gear=1` also shows movement frames with equipment. QA pages are excluded from the static build.
