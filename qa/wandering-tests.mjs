import {enterTargetSection} from './walk-section.js';
import assert from 'node:assert/strict';
import {statSync} from 'node:fs';
import {Engine,canStand,clearLine,findPath,distance,copy} from '../src/engine.js';
import {AREA_BY_ID,WORLD} from '../src/data.js';
import {WANDERING_SPOTS,wanderingScrap} from '../src/hub-wandering-content.js';
import {hubScale} from '../src/hub-space.js';
import {STORY_ORDER} from '../src/story.js';
import {ADVENTURE_NPCS} from '../src/adventures.js';
let n=0;const test=(name,fn)=>{fn();console.log('PASS '+name);n++;};
function game(seed=860){const g=new Engine('tide',seed);g.state.cores=[0,1,2,3];g.state.storyPassed=[...STORY_ORDER];g.state.natureVictories={crystalfalls:1};return g;}
function walk(g,target){enterTargetSection(g,target);
 const p=g.state.player,id=g.state.area,route=findPath(p,target,id,35);assert(route.length,id+' unreachable '+JSON.stringify(target));
 const path=[];let from={x:p.x,y:p.y};for(const end of route){const count=Math.ceil(distance(from,end)/70);for(let i=1;i<=count;i++)path.push({x:from.x+(end.x-from.x)*i/count,y:from.y+(end.y-from.y)*i/count});from=end;}
 for(const point of path){let frames=0;while(distance(p,point)>5&&frames++<1800){const a=Math.round(Math.atan2((point.y-p.y)/.78,point.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(a)),y:Math.round(Math.sin(a))});}assert(frames<1800,id+' blocked keyboard route');}
 assert(distance(p,target)<8,id+' did not arrive');
}
test('Every ground-scrap corner and early hub service has generous walkable routes in both directions',()=>{
 for(const [id,points]of Object.entries(WANDERING_SPOTS)){
  const g=game();assert(g.enterArea(id));const start={x:g.state.player.x,y:g.state.player.y};
  assert.equal(g.state.world.enemies.length,0);assert.equal(g.state.world.hazards.length,0);assert(g.inCamp());
  const targets=points.map(([x,y])=>({x:x*1.25*hubScale(id),y:y*1.25*hubScale(id)}));
  if(['canal','forest'].includes(id))targets.push(...g.state.world.portals,...g.state.world.camp.services,...g.state.world.loot,ADVENTURE_NPCS[id]);
  for(const point of targets){assert(canStand(point.x,point.y,35,id),id+' cramped corner '+JSON.stringify(point));walk(g,point);walk(g,start);}
 }
});
test('Sparse finds vary between expeditions, respect regional caps and preserve combat RNG',()=>{
 const signatures=new Set();for(let seed=1;seed<=60;seed++)for(const id of Object.keys(WANDERING_SPOTS)){
  const area=AREA_BY_ID[id],drops=wanderingScrap(seed,area);assert.deepEqual(drops,wanderingScrap(seed,area));assert(drops.length>=2&&drops.length<=4);assert.equal(new Set(drops.map(d=>d.id)).size,drops.length);
  assert(drops.every(d=>d.type==='scrap'&&d.amount>=3&&d.amount<=9));assert(drops.reduce((sum,d)=>sum+d.amount,0)<=(area.zone<2?24:area.zone<4?28:36));
  if(id==='canal')signatures.add(JSON.stringify(drops));
 }assert(signatures.size>30);
 const g=game(),w=g.state.world;delete w.wanderingVersion;w.pickups=[];const rng=g.rng.getState(),counter=g.idCounter;g.prepareHub(w,AREA_BY_ID.canal);assert.equal(g.rng.getState(),rng);assert.equal(g.idCounter,counter);
 g.enterArea('delta');assert(!g.state.world.pickups.some(p=>p.type==='scrap'));assert(!g.state.world.wanderingVersion);
});
test('Walking over scrap pays once with a full backpack, without health magnet, healing or XP',()=>{
 const g=game(),p=g.state.player,w=g.state.world,drop=w.pickups.find(d=>d.type==='scrap'),start=copy(drop),scrap=p.scrap;
 Object.assign(p,{x:drop.x+60,y:drop.y,velocity:{x:0,y:0}});g.update(.001);assert.equal(p.scrap,scrap);assert.equal(drop.x,start.x);assert.equal(drop.y,start.y);
 p.inventory=Array.from({length:48},(_,i)=>({uid:9000+i,stats:{}}));Object.assign(p,{x:drop.x,y:drop.y,hp:41,lastHurt:g.state.time,velocity:{x:0,y:0}});const xp=p.xp;g.takeEvents();g.update(.001);
 assert.equal(p.scrap,scrap+drop.amount);assert.equal(p.hp,41);assert.equal(p.xp,xp);assert.equal(p.inventory.length,48);assert.equal(g.takeEvents().filter(e=>e.type==='scrappickup').length,1);assert(!w.pickups.some(d=>d.id===drop.id));g.update(.001);assert.equal(p.scrap,scrap+drop.amount);
});
test('Found scrap stays gone through revisits, reload and checkpoint retry; fresh expeditions reset it',()=>{
 const g=game(),p=g.state.player,initial=copy(g.state.world.pickups),drop=initial.find(d=>d.type==='scrap');Object.assign(p,{x:drop.x,y:drop.y,velocity:{x:0,y:0}});g.update(.001);const scrap=p.scrap;
 g.enterArea('highway');g.enterArea('canal');assert.equal(p.scrap,scrap);assert(!g.state.world.pickups.some(d=>d.id===drop.id));
 const r=Engine.restore(g.serialize());assert.equal(r.state.player.scrap,scrap);assert(!r.state.world.pickups.some(d=>d.id===drop.id));r.checkpoint();r.state.world.pickups=[];r.state.player.scrap=9999;r.retry();assert.equal(r.state.player.scrap,scrap);assert.equal(r.state.world.pickups.length,initial.length-1);assert(!r.state.world.pickups.some(d=>d.id===drop.id));
 const fresh=game();assert(fresh.state.world.pickups.some(d=>d.id===drop.id));assert.equal(fresh.state.player.scrap,0);
 for(const file of ['painted/canal-route-wandering-v86.webp','painted/forest-route-wandering-v86.webp','expedition/ground-scrap-v86.webp'])assert(statSync(new URL('../assets/'+file,import.meta.url)).size>1000);
});
test('Starting Milo is beside the greenhouse, off the main promenade and reachable with normal keys',()=>{
 const g=game(),npc=ADVENTURE_NPCS.canal;assert(canStand(npc.x,npc.y,35,'canal'));
 for(let t=0;t<=1;t+=.025){const point={x:(.22+.56*t)*WORLD.width*1.4,y:(.62-.39*t)*WORLD.height*1.4};assert(distance(npc,point)>180,'Milo crowds the promenade');}
 for(const service of g.state.world.camp.services)assert(distance(npc,service)>165,'Milo crowds a merchant');
 for(const gate of g.state.world.portals)assert(distance(npc,gate)>165,'Milo masks a portal');
 walk(g,npc);assert.equal(g.interaction().type,'quest');assert.equal(g.interaction().entity.id,'routes');assert(g.interact());assert.equal(g.state.pending.type,'quest');assert.equal(g.state.pending.npc,'routes');
});
test('Groene Corridor follows the visible ramp and stair landings directly, without invisible detours',()=>{
 const g=game();g.enterArea('forest');
 const routes=[
  [[956,550],[995,578],[1039,628],[1097,681],[1160,725],[1210,775]],
  [[210,157],[241,205],[282,250],[327,309],[365,362],[425,418],[505,476],[550,507]],
  [[760,536],[810,561],[840,614],[882,663],[925,701],[975,727]],
  [[75,103],[151,127],[211,155]],
 ];
 for(const native of routes){const points=native.map(([x,y])=>({x:x*1.75,y:y*1.75}));for(const route of [points,[...points].reverse()]){
  Object.assign(g.state.player,route[0],{velocity:{x:0,y:0}});
  for(const [i,target]of route.entries()){assert(canStand(target.x,target.y,35,'forest'),'Cramped stair landing');if(!i)continue;
   assert(clearLine(route[i-1],target,'forest',35),'A visible tiled route requires an unnecessary detour: '+JSON.stringify([native[i-1],native[i]]));
   let frames=0;while(distance(g.state.player,target)>6&&frames++<180){const p=g.state.player,a=Math.round(Math.atan2((target.y-p.y)/.78,target.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(a)),y:Math.round(Math.sin(a))});}assert(frames<180,'Ordinary keys hit an invisible wall');
  }
 }}
 for(const [x,y]of [[730,330],[960,450],[1240,560]])assert(!canStand(x*1.75,y*1.75,18,'forest'),'Canal or planting becomes walkable');
});
console.log(`\n${n} wandering, navigation and economy checks passed.`);
