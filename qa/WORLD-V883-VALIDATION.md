# Gouden Horizon v8.8.3 — world walking and preload

Reviewed against the actual painted backgrounds, then tested with ordinary keyboard movement in both directions:

| Area | Checked connections |
| --- | --- |
| Getijdenkade | Inez's paved approach, stair bends, vendors, garden courts |
| Zonnetuinen | North/south stairs, eastern terrace, solid southern planter |
| Vrijhaven | Workshop approach, dock connection, city bridge, both districts |
| Groene Corridor | Garden stairs, serre gate, upper/lower wilderness branches |
| Zaadkluis | Additional painted side paths, stairs and the southern walk |
| Buitenzeebrug | Terrace stairs, Stormwacht branches, solid planted court |
| Laatste Metro | Platform connection, central concourse and vendor approaches |
| Koelhof | District stairs, gate and Sintelhoven branches |
| Groenkloof | Entry, northern path and southern terrace |
| Lantaarnwoud | Upper staircase and connected courts |
| Hangende Tuinen | Court connection and greenhouse approach |
| Stille Woningen | Side-room connections and upper room |
| Verborgen Atelier | Workshop and side-room approaches |

Navigation now checks an eight-direction footprint at two radii, with a direct circle-clearance fast path inside roomy courts. Wider route clearances also include the actual 18-pixel hero footprint, avoiding routes which passed a larger five-point check but trapped the player. A spatial floor index, heap search, cached edges and logarithmic lookahead replace repeated map scans and path sorting. Enemy visibility checks are staggered; each enemy update computes at most one new route.

`scripts/bake-navigation.mjs` prepares 24 grids covering the 13 intermediate areas and their outdoor creature sizes. The loader verifies each grid against the floor, obstacle and bounds fingerprint. Desktop prepares these graphs and decodes all 48 unique map images before enabling play. Android downloads all map bytes and retains its limited decoded-image cache.

Measured on this PC, same forest start/goal and radius, compared with the repository's previous v8.8.2 engine:

| Route request | Before | After prepared loading |
| --- | --- | --- |
| First request | 1,040.6 ms | 64.9 ms |
| Repeated requests | 830.3–833.2 ms | 20.3–30.1 ms |

This measures route calculation, not a promised laptop frame rate.

All 49 campaign/extension tile placements preserve the artwork aspect ratio. The city joining bridge now uses 420×280 native destination units for its 1536×1024 asset, rather than 500×280. Expansions remain adjoining independent tiles. No existing map was enlarged further in this change.

Validation: existing regression groups, all previously failing navigation/placement groups rerun after repair, three complete campaign simulations, five endgame trial simulations, six new world/preload checks, desktop browser travel through all 13 intermediate areas without additional map requests/decode waits, and the Android browser checks. Browser checks reported no page errors. Older saves on a newly solid edge are moved onto nearby paving while preserving health, currency and purchases.

The exploration test tries its former generous clearance first, then the actual hero radius for narrow painted passages. It still walks every gate/discovery/specialist using real keyboard movement; it no longer requires a 100-pixel-wide footprint where the real hero is 36 pixels wide.
