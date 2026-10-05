import assert from 'node:assert/strict';
import {sameSection,sectionIndex} from '../src/area-sections.js';
// Existing quest/service trials use the explicit travel action first, then
// normal movement inside the destination painting. Never reposition the hero.
export function enterTargetSection(g,target){if(sameSection(g.state.area,g.state.player,target))return;const index=sectionIndex(g.state.area,target),route=g.sectionTransition(index);assert(route&&!route.locked,'destination screen is still locked');assert(g.switchAreaSection(index),'normal screen-edge transition failed');}
