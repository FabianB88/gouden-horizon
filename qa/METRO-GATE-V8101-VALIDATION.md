# Metro, conservatory gate and startup — v8.10.1

The last metro now has a painted staircase connecting its station platform to the main square. The spawn is clear of the canopy post; the arrival lane follows the platform exit, the stair treads and the upper landing. Station posts, the flowerbed and water remain blocked. The old broad diagonal shortcut has been replaced. Existing saves in a newly solid footprint are reconciled onto nearby connected paving.

The Wild Conservatory gate lane crosses the actual aperture before turning along the road behind the wall. Permanent footprints follow both posts and the wall/flowerbed; opening the gate never removes those footprints. The closed gate also blocks its own aperture. Old test lines that crossed the wall/flowerbed have been replaced with independently traced roads. Milo and Sera stand at separate positions on the compact forecourt around Seya.

F8 area selection shows the selected area's type, a preview, story description and whether an extra district exists. Type is also visible beside each area name. New descriptions support Dutch and English.

Startup explicitly decodes the non-map images as well as maps. Desktop prepares all class/gender/suit bind poses and retains the four materials per image. The loading screen reports this preparation. Navigation fingerprints round insignificant floating precision to one millionth of a world pixel: Node/browser trigonometry previously caused nine of the 24 grids to be rejected. This changes only cache identity, not floor geometry or movement. The bake script uses the same versioned dependencies as the browser. Cache revision is 44; the updated grid file is walkways-v8101.json.

## Focused verification

- `node qa/metro-gate-tests.mjs`: actual metro spawn, both directions and both sides of the visible stair lane; old-save recovery; closed aperture, open aperture, solid wall and NPC separation.
- `node qa/forest-navigation-tests.mjs`: 18 focused checks including continuous keyboard walking, physical gate opening, reverse walking and dense clearance on both sides of the painted paths.
- `node qa/district-quests-tests.mjs`: 39 paths and nine actual extra quest-giver interactions; saved quest progress preserved.
- `node qa/navigation-preload-tests.mjs`: insignificant numeric differences preserve cache identity, real geometry changes invalidate it, all 24 prepared grids accepted.
- `node qa/language-tests.mjs`: 209 full text checks and saved-game invariance.
- `node qa/render-budget-tests.mjs`: seven rendering/cache/aim checks.
- Edge browser: all 24/24 prepared grids accepted, 48 decoded maps ready, actual F8 selection/detail/preview and travel, English labels, gate collision. Background route overlays were inspected against the actual artwork. No page errors.

Device-specific sustained FPS is not guaranteed by preload. Existing automatic quality still adjusts the render resolution when frames stay slow.

## Metro artwork provenance and prompt

Mode: built-in imagegen, edit of `assets/painted/metro-hub-v8.webp`.
Saved game asset: `assets/painted/metro-hub-v8101.webp` (1536 × 1024); preview: `assets/painted/previews/metro-hub-v8101.webp`. Original retained.

Prompt:
> Edit this existing game background very locally. Preserve the 1536x1024 canvas, identical camera, painterly isometric style, every shop, all water, lighting, the glass metro canopy and the whole rest of the map. Add a clearly usable stone stair/ramp connection from the lower-left metro arrival platform at approximately pixel (435,765) northeast up to the central plaza at (535,625). The ONLY modified area should be approximately x400..600,y590..810: remove the short obstructing stone wall/railing segment where the stairs meet the plaza. Show continuous broad visible paving/steps, about 70px wide, so a character can walk out from under the rightmost glass station arch onto the stairs and onto the plaza without walking through a wall or water. Maintain old brass trim, warm pale cobblestone colors and teal river. No characters, labels, arrows or new buildings. Absolutely preserve alignment of everything elsewhere; this is a gameplay path repair, not a redesigned scene.
