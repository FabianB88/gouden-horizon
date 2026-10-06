# Arrival areas and extra districts — v8.10.0

Targeted verification on 6 October 2026.

- All main-story gates in the five expanded hubs belong to the first arrival painting. Vrijhaven's Kilometer 0 and Green Corridor gates use existing first-screen paved positions. Preparation merchants stay in that arrival district.
- Garden District, East District, Wild Conservatory, Stormwatch and Cinder Courts hold the optional portals and relocated side quest givers. Their quest IDs, rewards and existing progress are preserved.
- Ravi is reachable at each first arrival. His actual interaction opens the directions menu. In Tide Quay he can unlock the Garden District; the main story remains reachable while that optional district is locked.
- `npm run test:districts`: 39 routes checked along every straight walking segment with the hero's footprint and the current screen/gate restrictions; 9 quest givers can be reached and actually spoken to. Existing quest state survives restoration. Existing screen-travel tests also verify repeated returns, resources, saved sections and LAN voting.
- Browser: all five guide menus, optional district entry and return to the main story, Dutch/English menu switching, and continued play after closing the guide. No page errors.
- Touch browser viewports: 390×844, 360×740, 844×390 and 740×360. The district button is 116 pixels wide, about 56 pixels high in portrait and 44 in landscape. Actual touch entry/return works and its rectangle does not overlap movement, combat, menu or area controls. Portrait puts it next to the area toggle; landscape puts both directions below the upper menu on the right.
- Short screen directions and the optional mission notices use the bundled English catalogue. The district explanation remains independent of the story-text preference.

This was a quest-placement and interface check. No full combat campaign, terrain sweep, navigation bake or artwork regeneration was performed. The separate painting transitions, arena floors, boss difficulty and safe-hub respawn behavior remain unchanged.
