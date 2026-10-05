import {enterTargetSection} from './walk-section.js';
import assert from 'node:assert/strict';
import {Engine,canStand,findPath,distance} from '../src/engine.js';
import {worldBounds} from '../src/data.js';
import {STORY_ORDER} from '../src/story.js';
let n=0;const test=(name,fn)=>{fn();n++;console.log('PASS '+name);};
function town(id){const g=new Engine();g.state.cores=[0,1,2,3];g.state.storyPassed=[...STORY_ORDER];assert(g.enterArea(id));return g;}
function walk(g,target){enterTargetSection(g,target);const p=g.state.player,path=findPath(p,target,g.state.area,35);assert(path.length);let from={x:p.x,y:p.y};const dense=[];for(const end of path){const count=Math.ceil(distance(from,end)/60);for(let i=1;i<=count;i++)dense.push({x:from.x+(end.x-from.x)*i/count,y:from.y+(end.y-from.y)*i/count});from=end;}for(const goal of dense){let frames=0;while(distance(p,goal)>6&&frames++<500){const a=Math.round(Math.atan2((goal.y-p.y)/.78,goal.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(a)),y:Math.round(Math.sin(a))});}assert(frames<500,'Blocked ordinary walking route');}assert(distance(p,target)<9);}
test('Vrijhaven and Groene Corridor have room beyond the old viewport and separated NPC interactions',()=>{
 for(const id of ['highway','forest']){const g=town(id);assert.deepEqual(worldBounds(id),{width:5376,height:1792});const objects=[...g.questNPCs(),...g.hubMerchants(),...g.state.world.portals,...g.state.world.loot];for(const npc of g.questNPCs()){
  assert(canStand(npc.x,npc.y,35,id),npc.name+' cramped footing');for(const other of objects)if(npc!==other)assert(distance(npc,other)>225,npc.name+' crowds '+(other.name||other.to||'a chest'));
  const start={x:g.state.player.x,y:g.state.player.y};walk(g,npc);assert.equal(g.interaction().type,'quest');assert.equal(g.interaction().entity.id,npc.id);assert(g.interact());g.closeModal();walk(g,start);
 }}
});
test('Exploration gates in the enlarged city remain individually reachable and preserve progression locks',()=>{
 const g=town('highway');for(const to of ['rain-garden','quiet-apartments','hidden-atelier']){const gate=g.state.world.portals.find(p=>p.to===to);walk(g,gate);assert.equal(g.interaction().entity.to,to);if(to==='hidden-atelier'){assert(gate.locked);assert(!g.interact());}else assert(!gate.locked);}
});
console.log(`\n${n} town spacing and real walking checks passed.`);
