import assert from 'node:assert/strict';
import {Engine,canStand,clearLine} from '../src/engine.js';
import {SECTION_ENTRIES,sectionArrival,sectionIndex} from '../src/area-sections.js';
import {DISTRICT_GUIDES,MAIN_DISTRICT_EXPLANATION,EXTRA_DISTRICT_EXPLANATION} from '../src/district-content.js';
import {STORY_ORDER} from '../src/story.js';
import {translate,setLanguage} from '../src/localization.js';

const travel=id=>{const g=new Engine('tide',821);g.unlockTestMode('fabian1');g.testTravel(id);return g;};
let routes=0,npcs=0;
function walk(g,from,to){
 assert(canStand(to.x,to.y,18,g.state.area));assert(!g.outdoorGateBlocks(to.x,to.y,18));
 const path=g.findWalkingPath(from,to);assert(path.length,'walkable route to '+(to.id||to.to));
 let previous=from;for(const step of path){assert(clearLine(previous,step,g.state.area,18,g.navigationBlocker(from)),'every step remains on this painting and its open floor');previous=step;}
 assert(Math.hypot(previous.x-to.x,previous.y-to.y)<1);routes++;
}
for(const id of Object.keys(SECTION_ENTRIES)){
 const g=travel(id),first=sectionArrival(id,0),guide=DISTRICT_GUIDES[id];if(id==='canal')g.state.world.gardenOpen=false;
 const main=g.portalDefinitions(id).filter(p=>STORY_ORDER.includes(p.to));assert(main.length);
 for(const gate of main){assert.equal(sectionIndex(id,gate),0,'main-story gate stays in arrival painting: '+gate.to);walk(g,first,gate);}
 assert.equal(sectionIndex(id,guide),0);walk(g,first,guide);Object.assign(g.state.player,guide);assert.equal(g.interaction()?.entity.id,'district-guide');assert(g.interact());
 if(id==='canal'){assert(g.sectionTransition(1).locked);assert(g.openQuayGarden(),'the first-screen guide unlocks the garden');}else g.closeModal();
 assert(g.switchAreaSection(1));const arrival={x:g.state.player.x,y:g.state.player.y};
 for(const npc of g.questNPCs().filter(n=>n.id!=='district-guide')){
  assert.equal(sectionIndex(id,npc),1,'extra quest giver belongs to extra district: '+npc.id);walk(g,arrival,npc);
  Object.assign(g.state.player,npc);assert.equal(g.interaction()?.entity.id,npc.id,'the quest giver can actually be spoken to');npcs++;
 }
 for(const gate of g.portalDefinitions(id).filter(p=>!STORY_ORDER.includes(p.to))){assert.equal(sectionIndex(id,gate),1,'optional gate belongs to extra district: '+gate.to);walk(g,arrival,gate);}
 assert(g.switchAreaSection(0));for(const gate of main)assert.equal(sectionIndex(id,gate),0);
 console.log('PASS main-story gates, arrival guide and reachable extra quests: '+id);
}
{
 const g=travel('highway');g.lockTestMode();g.state.quests={milo:{status:'active',seen:['garden']},noodstroom:{status:'ready',choices:[]}};g.state.world.camp.services.find(n=>n.id==='outfitter').x=4000;
 const restored=Engine.restore(g.serialize());assert.deepEqual(restored.state.quests,g.state.quests);assert.equal(sectionIndex('highway',restored.hubMerchants().find(n=>n.id==='outfitter')),0);
 assert(restored.acceptCityQuest('milo')===false,'moving a quest giver cannot duplicate an active quest');
 assert.equal(sectionIndex('highway',restored.portalDefinitions('highway').find(p=>p.to==='kilometer')),0);
 console.log('PASS existing quest progress and merchants survive the layout update');
}
setLanguage('en');for(const text of [MAIN_DISTRICT_EXPLANATION,EXTRA_DISTRICT_EXPLANATION,'Ravi · Wegwijzer','Hoofdroute of extra missies?']){assert.notEqual(translate(text),text);assert(!/\b(?:missies|hoofdroute|aankomstgebied|wijkknop)\b/i.test(translate(text)));}setLanguage('nl');
console.log(`PASS ${routes} traced walking routes, ${npcs} usable extra quest givers and English directions`);
