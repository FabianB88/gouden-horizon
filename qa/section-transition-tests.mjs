import assert from 'node:assert/strict';
import {Engine,canStand} from '../src/engine.js';
import {SECTION_ENTRIES,sectionArrival,sectionIndex,sectionBounds,insideSection} from '../src/area-sections.js';
import {CoopSession} from '../src/coop-session.js';
let n=0;
for(const id of Object.keys(SECTION_ENTRIES)){
 const g=new Engine('tide',489);g.unlockTestMode('fabian1');g.testTravel(id);const world=g.state.world;g.state.player.hp=73;g.state.player.scrap=412;
 if(id==='canal')world.gardenOpen=true;
 for(let i=0;i<3;i++)for(const index of [1,0]){const arrival=sectionArrival(id,index);assert(g.switchAreaSection(index));assert.equal(g.state.world,world);assert.equal(sectionIndex(id,g.state.player),index);assert.deepEqual({x:g.state.player.x,y:g.state.player.y},arrival);assert(canStand(arrival.x,arrival.y,18,id));assert(!g.outdoorGateBlocks(arrival.x,arrival.y,18));assert.equal(g.state.player.hp,73);assert.equal(g.state.player.scrap,412);assert.deepEqual(g.state.player.velocity,{x:0,y:0});assert(!g.state.player.dashTimer);assert.equal(g.sectionTransition().index,1-index);}
 const b=sectionBounds(id,g.state.player);assert(!insideSection(id,g.state.player,b.x+b.width+1,g.state.player.y));assert.deepEqual(g.findWalkingPath(g.state.player,sectionArrival(id,1)),[],'walking cannot replace the explicit transition');
 g.switchAreaSection(1);g.lockTestMode();const restored=Engine.restore(g.serialize());assert.equal(sectionIndex(id,restored.state.player),1);assert.equal(restored.state.player.scrap,412);
 console.log('PASS stable arrivals, isolated screens, repeated return and saved progress: '+id);n++;
}
{
 const g=new Engine();assert(g.sectionTransition().locked);assert(!g.switchAreaSection(1));g.state.mode='modal';g.state.pending={type:'archive',npc:'routes'};assert(g.openQuayGarden());assert(g.switchAreaSection(1));console.log('PASS Milo unlock still gates the garden screen');n++;
}
{
 const party=new CoopSession(951),a=party.join({token:'a'}),b=party.join({token:'b'});party.ready(a.id);party.ready(b.id);party.rpc(a.id,'unlockTestMode',['fabian1']);party.rpc(a.id,'testTravel',['forest']);party.rpc(b.id,'acceptTravel',[]);
 const g=party.engine,world=g.state.world;assert(party.rpc(a.id,'switchAreaSection',[1]));assert.equal(sectionIndex('forest',a.player),0);assert.equal(party.snapshot(b.id).state.coop.travel.name,'De Wilde Serre');assert(party.rpc(b.id,'acceptTravel',[]));assert.equal(sectionIndex('forest',a.player),1);assert.equal(sectionIndex('forest',b.player),1);assert.equal(g.state.world,world);assert(canStand(b.player.x,b.player.y,18,'forest'));assert(!party.rpc(a.id,'switchAreaSection',[999]));console.log('PASS LAN requires both votes and retains the same shared quest world');n++;
}
console.log(n+' section-transition checks passed.');
