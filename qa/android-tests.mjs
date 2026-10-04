import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TouchInput,touchVector,touchTarget,touchCombatTarget,detectTouchDevice,bindTouchControl} from '../src/touch-input.js';
import {MapTextures,areaTextureKeys,downloadMaps} from '../src/map-textures.js';
import {paintedLegMotion,helmetTransform,heroRigPose} from '../src/hero-rig.js';
import {equipmentAppearance} from '../src/appearance.js';
import {Engine} from '../src/engine.js';
import {CoopSession} from '../src/coop-session.js';
import {LanClient} from '../src/lan-client.js';
import {CITY_NPCS} from '../src/city.js';
import {normalizeSettings} from '../src/settings.js';
let n=0;async function test(name,run){await run();n++;console.log('PASS '+name);}
const center={x:100,y:100};
await test('Independent fingers can move, auto-attack and drag-cast without cancelling each other',()=>{
 const input=new TouchInput();assert(input.begin('move',1,125,100,center,36));assert(input.begin('fire',2,100,64,center,36));assert(input.shooting);assert(input.movement.x>0);assert(!input.begin('move',3,100,100,center,36));
 for(let slot=0;slot<6;slot++){assert(input.begin('cast:'+slot,3,300,100,{x:300,y:100},58));input.move(3,340,100);assert(input.preview.dragged);assert(input.aiming.x>0);assert.equal(input.end(3).binding,String(slot));assert(input.shooting);assert(input.movement.x>0);}
 input.end(2);assert(!input.shooting);assert(input.movement.x>0);input.end(1);assert.deepEqual(input.movement,{x:0,y:0});
});
await test('Android selects touch automatically; attack and taps assist while only spell drags aim manually',()=>{
 assert(detectTouchDevice({navigator:{userAgent:'Mozilla/5.0 (Linux; Android 14) Chrome Mobile'},matchMedia:()=>({matches:false})}));assert(detectTouchDevice({navigator:{userAgent:'Desktop'},matchMedia:()=>({matches:true})}));assert(!detectTouchDevice({navigator:{userAgent:'Windows NT 10.0'},matchMedia:()=>({matches:false})}));
 const p={x:300,y:300,aim:{x:-1,y:0}},enemies=[{x:450,y:300,dead:false},{x:150,y:300,dead:true}];assert.deepEqual(touchCombatTarget(p,enemies),{x:450,y:294});assert(touchCombatTarget(p,enemies,{x:-1,y:0}).x<p.x);
 const input=new TouchInput();input.begin('fire',1,100,100,center,36);input.move(1,30,100);assert(input.shooting);assert.equal(input.aiming,null);assert.equal(input.lastAim,null);input.begin('cast:0',2,200,100,{x:200,y:100},58);input.move(2,150,100);assert(input.aiming.x<0);const cast=input.end(2);assert(cast.aim.x<0);assert.equal(input.aiming,null);assert.deepEqual(touchCombatTarget(p,enemies,input.aiming),{x:450,y:294});
});
await test('Cancelled gestures never cast, and menus/focus loss clear all held controls',()=>{
 const i=new TouchInput();i.begin('cast:right',1,100,100,center,58);assert.equal(i.end(1,true),null);i.begin('move',1,136,100,center,36);i.begin('fire',2,136,100,center,36);i.reset();assert.equal(i.contacts.size,0);assert(!i.shooting);assert.equal(i.lastAim,null);
 const v=touchVector(100,100,36);assert(Math.abs(Math.hypot(v.x,v.y)-1)<1e-10);assert.deepEqual(touchVector(2,2,36),{x:0,y:0});assert.equal(normalizeSettings({controls:'touch'}).controls,'touch');
});
await test('Pointer capture routes release once and never clears a different finger',()=>{
 const events={},el={getBoundingClientRect:()=>({left:0,top:0,width:100,height:100}),classList:{add(){},remove(){}},setPointerCapture(){},addEventListener(k,fn){(events[k]??=[]).push(fn);}},i=new TouchInput();let casts=0;
 bindTouchControl(el,i,'cast:2',{enabled:()=>true,onCast:()=>casts++});const send=(type,id,x=50)=>events[type]?.forEach(fn=>fn({pointerId:id,pointerType:'touch',clientX:x,clientY:50,preventDefault(){},stopImmediatePropagation(){}}));
 send('pointerdown',4);send('pointerup',5);assert(i.contacts.has(4));send('pointermove',4,100);send('pointerup',4,100);send('lostpointercapture',4);assert.equal(casts,1);send('pointerdown',6);send('pointercancel',6);send('pointerup',6);assert.equal(casts,1);
});
await test('All map bytes download before play, duplicate files share bytes and decode requests share work',async()=>{
 const fetched=[],files={a:'a.webp',b:'b.webp',alias:'a.webp'};let active=0,peak=0;
 const bytes=await downloadMaps(files,async f=>{active++;peak=Math.max(peak,active);fetched.push(f);await Promise.resolve();active--;return {ok:true,blob:async()=>({file:f})};});assert.equal(bytes.size,2);assert.equal(fetched.length,2);assert(peak<=4);
 const assets={},cache=new MapTextures(files,assets,async f=>({file:f}),1);await Promise.all([cache.ensure({id:'a'}),cache.ensure({id:'alias'})]);assert.equal(assets.a,assets.alias);await cache.ensure({id:'b'});assert.equal(cache.entries.size,1);assert(!assets.a);assert(cache.ready({id:'b'}));await cache.ensure({id:'a'});assert(cache.ready({id:'a'}));
 await assert.rejects(()=>downloadMaps({a:'bad'},async()=>({ok:false})));assert.deepEqual(areaTextureKeys({id:'highway',tiles:[{}, {asset:'cityEast'}],joins:[{asset:'join'}]}),['highway','cityEast','join','cityJoin']);
});
await test('Rigid leg steps bound rotation and retain foot shape instead of stretching knees',()=>{
 for(let d=0;d<8;d++)for(let phase=0;phase<20;phase++){const v=paintedLegMotion([212,295],[207,451],{advance:Math.cos(phase),lift:Math.max(0,Math.sin(phase))},[Math.cos(d*Math.PI/4),Math.sin(d*Math.PI/4)*.78],1,.27);assert(Math.abs(v.angle)<.32);assert(Number.isFinite(v.footX+v.footY));assert(Math.abs(v.footX)<=12/.27);assert(Math.abs(v.depth)<48);}
 const still=paintedLegMotion([212,295],[207,451],{advance:1,lift:1},[1,0],0,.27);for(const value of Object.values(still))assert(Math.abs(value)<1e-9);
});
await test('Each class has both appearances, stable equipment attachment and the same gameplay stats',()=>{
 const atlas=JSON.parse(fs.readFileSync(new URL('../assets/painted/hero-classes-v88.json',import.meta.url))),r={heroClassCrop:atlas,assets:{}};
 const g=new Engine(),before=g.stats();for(const id of ['elementalist','builder','hunter'])for(const gender of ['male','female']){
  const p={...g.state.player,characterClass:id,heroGender:gender};const appearance=equipmentAppearance(p);assert(appearance.key.includes(gender));assert.equal(appearance.identity,id);
  for(let d=0;d<8;d++){const pose=heroRigPose(r,d,p),t=helmetTransform(pose.frame,{bounds:[0,0,142,140]},pose.index);assert(t.width>80&&t.width<100);assert(Number.isFinite(t.x+t.y));}
  g.state.player.heroGender=gender;assert.deepEqual(g.stats(),before);
 }
 assert.equal(Engine.restore(g.serialize()).state.player.heroGender,'female');
 const session=new CoopSession(88);const a=session.join({name:'A',build:'builder',gender:'female'}),b=session.join({name:'B',build:'hunter',gender:'male'});session.ready(a.id);session.ready(b.id);assert.equal(session.actor(a.id).player.heroGender,'female');assert.equal(session.actor(b.id).player.heroGender,'male');
});
await test('Purchase confirmations only emit after payment succeeds and stay personal in LAN',()=>{
 const g=new Engine();g.state.player.scrap=100;g.state.player.potions=3;g.takeEvents();assert(g.buySupply());const event=g.takeEvents().find(e=>e.type==='purchase');assert.equal(event.quantity,1);assert.equal(event.name,'verband');assert.equal(event.cost,15);assert.equal(g.state.player.potions,4);g.state.player.scrap=0;assert(!g.buySupply());assert(!g.takeEvents().some(e=>e.type==='purchase'));
 const s=new CoopSession(89),a=s.join({name:'A'}),b=s.join({name:'B'});s.ready(a.id);s.ready(b.id);const actor=s.actor(a.id);actor.player.scrap=100;const service=s.engine.state.world.camp.services.find(n=>n.id==='outfitter');Object.assign(actor.player,{x:service.x,y:service.y});s.snapshot(a.id);s.snapshot(b.id);assert(s.rpc(a.id,'buySupply',[]));assert(s.snapshot(a.id).events.some(e=>e.type==='purchase'));assert(!s.snapshot(b.id).events.some(e=>e.type==='purchase'));
});
await test('Free quest rewards never show a paid purchase, and LAN purchases wait for the host',()=>{
 const g=new Engine();g.state.area='highway';g.state.mode='playing';g.state.quests={ilya:{status:'ready',seen:[]}};const npc=CITY_NPCS.find(n=>n.id==='ilya');Object.assign(g.state.player,{x:npc.x,y:npc.y});const scrap=g.state.player.scrap;g.takeEvents();assert(g.claimCityQuest('ilya'));assert.equal(g.state.player.scrap,scrap+75);assert(!g.takeEvents().some(e=>e.type==='purchase'));
 const client=new LanClient(),sent=[];client.connected=true;client.running=true;client.socket={send:s=>sent.push(JSON.parse(s))};client.state.player.scrap=100;client.state.player.potions=3;client.takeEvents();assert(client.buySupply());assert.equal(client.state.player.scrap,100);assert.equal(client.state.player.potions,3);assert(!client.takeEvents().some(e=>e.type==='purchase'));assert.equal(sent[0].method,'buySupply');assert.equal(client.requests.get(sent[0].request),'buySupply');
});
console.log(`\n${n} Android, appearance and purchase regression groups passed.`);
