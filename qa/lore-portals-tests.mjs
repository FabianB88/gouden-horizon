import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine,canStand,findPath,distance} from '../src/engine.js';
import {AREAS,AREA_BY_ID} from '../src/data.js';
import {journeyEntry,JOURNEY_SCENES,campaignAim,MEASUREMENT_AREAS} from '../src/journey-content.js';
import {JourneyLog,JOURNEY_KEY} from '../src/journey-log.js';
import {portalStyle,PORTAL_ART} from '../src/portal-art.js';
import {normalizeSettings} from '../src/settings.js';
let n=0;function test(name,fn){fn();n++;console.log('PASS '+name);}
test('Every existing destination explains its story, purpose and real action with available artwork',()=>{
 const g=new Engine();g.unlockTestMode('fabian1');assert.equal(Object.keys(JOURNEY_SCENES).length,AREAS.length);
 for(const area of AREAS){assert(g.testTravel(area.id));const entry=journeyEntry(area.id,g.state);assert(entry.text.length>90&&entry.why.length>45&&entry.goal.length>60,area.id);assert(fs.existsSync(new URL('../'+entry.image,import.meta.url)),entry.image);if(entry.measurement)assert(g.state.world.relays.length===2);if(area.bossArena||area.bounty)assert(!entry.goal.includes('meetstation'));}
 assert.equal(journeyEntry('missing',g.state),null);
});
test('Station instructions advance with actual state; later bosses never claim to have station calibration',()=>{
 const g=new Engine();g.unlockTestMode('fabian1');for(const id of MEASUREMENT_AREAS){g.testTravel(id);assert(journeyEntry(id,g.state).goal.includes('twee bewakingsgolven'));g.state.world.relays.forEach(r=>r.status='online');assert(journeyEntry(id,g.state).goal.includes('Beide metingen'));g.state.world.coreCollected=true;assert(journeyEntry(id,g.state).goal.includes('geborgen'));}
 g.testTravel('tower');g.state.world.sideDone=true;g.state.world.coreCollected=false;assert(journeyEntry('tower',g.state).goal.includes('Verbind'));assert(campaignAim({cores:[0,1]}).includes('Biosfeersleutel'));assert(campaignAim({cores:[0,1,2]}).includes('bereik Aurelia'));
});
test('Read history survives reload, remains personal and does not force scenes on farming repeats or tests',()=>{
 const storage={data:new Map(),getItem(k){return this.data.get(k);},setItem(k,v){this.data.set(k,v);}};const a=new JourneyLog(storage);a.begin(22);a.observe('ring');assert.equal(a.take(),'ring');a.observe('canal');a.take();a.observe('ring');assert.equal(a.pending,null);const b=new JourneyLog(storage);b.begin(22);b.observe('ring');assert.equal(b.pending,null);b.begin(22,'guest');b.observe('ring');assert.equal(b.pending,'ring');b.disable();b.observe('kilometer',false);assert.equal(b.pending,null);b.observe('aurelia',true,true);assert.equal(b.pending,null);assert(storage.getItem(JOURNEY_KEY));
 const blocked=new JourneyLog({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}});blocked.begin(1);blocked.observe('ring');assert.equal(blocked.take(),'ring');assert.equal(normalizeSettings({lore:false}).lore,false);assert.equal(normalizeSettings({}).lore,true);
});
test('Portal art is based on actual destination: station, combat, optional contract and safe return differ',()=>{
 for(const id of ['ring','kilometer','saltwood'])assert.equal(portalStyle({to:id,category:'generator'}).kind,'station');for(const id of ['delta','aurelia','deepwater','condensers','tower'])assert.equal(portalStyle({to:id,category:'generator'}).kind,'arena');assert.equal(portalStyle({to:'bounty-spore'}).label,'BAASCONTRACT');assert.equal(portalStyle({to:'adventure-metro'}).kind,'salvage');assert.equal(portalStyle({to:'highway',id:'story-gateway'}).kind,'return');assert.equal(portalStyle({to:'rain-garden'}).kind,'explore');assert.equal(portalStyle({to:'trial-tide'}).label,'TIJDPROEF');
 assert.equal(new Set(Object.values(PORTAL_ART).filter(a=>a.file).map(a=>a.file)).size,4);for(const a of Object.values(PORTAL_ART))if(a.file)assert(fs.existsSync(new URL('../'+a.file,import.meta.url)));
});
function walk(g,target){const p=g.state.player,route=[35,26,18].map(r=>findPath(p,target,'highway',r)).find(p=>p.length);assert(route?.length,'No path '+JSON.stringify(target));let from={x:p.x,y:p.y};for(const end of route){const count=Math.ceil(distance(from,end)/45);for(let i=1;i<=count;i++){const q={x:from.x+(end.x-from.x)*i/count,y:from.y+(end.y-from.y)*i/count};let frames=0;while(distance(p,q)>6&&frames++<500){const angle=Math.round(Math.atan2((q.y-p.y)/.78,q.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(angle)),y:Math.round(Math.sin(angle))});}assert(frames<500,'Stalled '+JSON.stringify({q,p:{x:p.x,y:p.y}}));}from=end;}assert(distance(p,target)<10);}
test('Previously clipped Vrijhaven stair and bridge landings now admit ordinary movement both ways',()=>{
 const g=new Engine('tide',882);g.unlockTestMode('fabian1');g.testTravel('highway');const start={x:g.state.player.x,y:g.state.player.y};
 for(const [east,x,y]of [[0,965,465],[0,1000,463],[0,1020,445],[0,465,321],[1,1287,307],[1,1328,281],[1,1337,255],[1,1366,613],[1,1160,746],[1,1040,442]]){const point={x:(east?2688:0)+x*1.75,y:y*1.75};assert(canStand(point.x,point.y,18,'highway'));walk(g,point);walk(g,start);}
 assert(!canStand(1100,200,18,'highway'),'Water remains solid');
});
console.log(`\n${n} journey, portal and city-walking groups passed.`);
