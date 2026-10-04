import {makeUniqueItem} from './loot.js?v=37';

// These replace one ordinary equipment drop: no additional loot pile and no
// guaranteed rare-item pity. Rates below are conditional on equipment dropping.
export const CHASE_DROPS={
 mossback:{chance:.006,pool:['glassMantle']},
 sunnewt:{chance:.008,pool:['meteorStaff','slagHeart']},
 windowl:{chance:.008,pool:['spiritAmber']},
 crownbear:{chance:.014,pool:['meteorStaff','spiritAmber']},
 prismhorn:{chance:.009,pool:['meteorStaff']},
 mistprowler:{chance:.009,pool:['spiritAmber']},
 stormtoad:{chance:.008,pool:['meteorStaff','spiritAmber']},
 glassscorpion:{chance:.006,pool:['glassMantle']},
 dustskirmisher:{chance:.005,pool:['duneBeacon']},
 slagcarrier:{chance:.008,pool:['slagHeart']},
 dunebreaker:{chance:.012,pool:['duneBeacon','glassMantle','slagHeart']},
 deepwarden:{chance:.006,pool:['duneBeacon','glassMantle']},
 towerwarden:{chance:.008,pool:['duneBeacon','slagHeart']},
 seedheart:{chance:.006,pool:['glassMantle']},
 solarKnight:{chance:.006,pool:['slagHeart']},
 tideleviathan:{chance:.006,pool:['glassMantle']},
 solararchitect:{chance:.006,pool:['slagHeart']}
};
export function rollChaseItem(enemy,rng,level,uid){const t=CHASE_DROPS[enemy.type];if(!t||level<8||rng()>=t.chance*(enemy.creatureElite?1.5:1))return null;const id=t.pool[Math.floor(rng()*t.pool.length)],item=makeUniqueItem(id,level,uid);item.chase=true;item.affixes=['Uitzonderlijke vondst'];return item;}
// Separate reproducible rolls leave ordinary gear, combat and map randomness
// untouched. Item IDs advance every drop; reloading cannot reroll a reward.
export function chaseRandom(seed,uid){let n=(seed^Math.imul(uid,0x9e3779b9)^0x6d2b79f5)>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
