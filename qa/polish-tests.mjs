import assert from 'node:assert/strict';
import {Engine} from '../src/engine.js';
import {FrameTelemetry,needsSceneFrame,effectParticles} from '../src/frame-performance.js';
import {EnemyCrowd,separationVector,engagementGoal,tacticalMovement} from '../src/enemy-ai.js';
import {registerHit,impactMotion,advanceFeedback} from '../src/combat-feedback.js';
import {projectedStats,buildDeltas,spellDamage,spellInsight} from '../src/build-insights.js';
import {footCycle,heroBodyMotion,WALK_CYCLE_DISTANCE,WALK_STRIDE,FOOT_STANCE} from '../src/hero-rig.js';
import {RenderCache} from '../src/render-cache.js';
import {Renderer} from '../src/render.js';
import {spellProfile} from '../src/spell-variants.js';
let count=0;const test=(name,run)=>{run();count++;console.log('PASS '+name);};
test('Real frame telemetry excludes inactive gaps but includes active stutters',()=>{
 const t=new FrameTelemetry(60);for(let i=0;i<61;i++)t.begin(i*1000/60,true);assert.equal(t.report().fps,60);assert.equal(t.report().samples,60);
 t.begin(2000,false);t.begin(60000,true);t.begin(60000+1000/60,true);assert.equal(t.report().fps,60);
 t.begin(60350,true);assert(t.report().fps<60);assert(t.report().slowPercent>0);
 const slow=new FrameTelemetry();for(let i=0;i<40;i++)slow.begin(i*1000/30,true);assert.equal(slow.report().fps,30);assert.equal(slow.report().slowPercent,100);
});
test('Cover and steady menus do no scene work; resize and a result transition redraw once',()=>{
 const r={sceneDirty:true,lastSceneMode:'playing'};assert(!needsSceneFrame(false,false,r,'playing'));assert(needsSceneFrame(true,false,r,'playing'));r.sceneDirty=false;assert(!needsSceneFrame(true,false,r,'playing'));assert(needsSceneFrame(true,true,r,'playing'));assert(needsSceneFrame(true,false,r,'dead'));r.lastSceneMode='dead';assert(!needsSceneFrame(true,false,r,'dead'));
});
test('Spatial queries include overlap across cells and discard distant crowds',()=>{
 const enemies=Array.from({length:160},(_,id)=>({id,x:id%16*100,y:Math.floor(id/16)*100,radius:22})),a={id:200,x:127,y:112,radius:30},b={id:201,x:132,y:115,radius:30};enemies.push(a,b);const grid=new EnemyCrowd(enemies),near=grid.near(a);assert(near.includes(b));assert(near.length<enemies.length/5);
 for(const e of enemies)for(const other of enemies)if(other!==e&&Math.hypot(e.x-other.x,(e.y-other.y)*1.15)<e.radius+other.radius+8)assert(grid.near(e).includes(other));
 const v=separationVector(a,[b]),w=separationVector(b,[a]);assert(v.x<0&&w.x>0);assert.deepEqual(separationVector(a,[]),{x:0,y:0});
});
test('Melee approaches use different lanes; ranged choices keep their distance band',()=>{
 const p={x:500,y:500},a={id:1,x:350,y:500},b={...a,id:4},base={speed:90,range:120};assert.notDeepEqual(engagementGoal(a,p,base),engagementGoal(b,p,base));assert.equal(engagementGoal(a,p,{...base,boss:true}),p);
 const e={id:2,type:'sniper'};const retreat=tacticalMovement(e,{x:1,y:0},200,.016,{role:'ranged',range:700});assert(retreat.x<0);const hold=tacticalMovement(e,{x:1,y:0},440,.016,{role:'ranged',range:700});assert.equal(hold.x,0);assert(tacticalMovement(e,{x:1,y:0},600,.016,{role:'ranged',range:700}).x>0);
});
test('Hit motion never changes enemy position, damage or attack clocks and expires',()=>{
 const e={x:130,y:160,hp:200,stun:0,cd:1};registerHit(e,{x:0,y:0},80,'storm',true,false);assert(impactMotion(e).x>0);assert.deepEqual({x:e.x,y:e.y,hp:e.hp,stun:e.stun,cd:e.cd},{x:130,y:160,hp:200,stun:0,cd:1});advanceFeedback(e,.2);assert.deepEqual(impactMotion(e),{x:0,y:0,rotation:0});
});
test('A fading corpse pays rewards once and stops occupying the crowd grid',()=>{
 const g=new Engine('tide',852),e=g.makeEnemy('raider',600,600);g.state.world.enemies=[e];g.killEnemy(e);const paid=[g.state.kills,g.state.player.scrap,g.state.player.xp];g.killEnemy(e);assert.deepEqual([g.state.kills,g.state.player.scrap,g.state.player.xp],paid);assert(e.deathVisualLife>0);assert.equal(new EnemyCrowd([e]).cells.size,0);advanceFeedback(e,.3);assert.equal(e.deathVisualLife,0);
});
test('Projected totals equal actually equipping an item into either relic slot',()=>{
 for(const slot of ['weapon','boots','head','relic','relic2']){const g=new Engine('tide',852),p=g.state.player,item={uid:9999,id:'test',slot:slot.startsWith('relic')?'relic':slot,stats:{power:.2,hp:25,mana:12,speed:.1,dash:.12,poisonResist:.3},name:'Test'};p.inventory.push(item);const expected=projectedStats(g.stats(),item,p.equipment[slot]);assert(g.equipItem(item.uid,slot));assert.deepEqual(expected,g.stats());}
});
test('Resistance explanations use capped percent of maximum health, including losing an affix',()=>{
 const g=new Engine(),p=g.state.player,before=g.stats();const rows=buildDeltas(p,before,{stats:{poisonResist:.08}},null),poison=rows.find(r=>r.name.startsWith('Gif'));assert.equal(poison.before,'50% leven');assert.equal(poison.after,'46% leven');
 const capped=buildDeltas(p,{...before,poisonResist:.6},{stats:{poisonResist:.4}},null);assert(!capped.some(r=>r.name.startsWith('Gif')));
 const lose=buildDeltas(p,{...before,poisonResist:.3},{stats:{}},{stats:{poisonResist:.3}}).find(r=>r.name.startsWith('Gif'));assert.equal(lose.after,'50% leven');
});
test('Displayed spell damage matches actual casts, including variants and elemental area stats',()=>{
 const g=new Engine('tide',852),p=g.state.player;p.level=15;p.skills=['tide','prism','volt','cryo','tempest'];p.stats={power:.2,storm:.3,prism:.15};g.state.cores=[0,1,2];g.enterArea('ring');
 for(const id of ['tide','prism','volt','cryo','tempest']){p.mana=1000;g.state.projectiles=[];g.state.fields=[];p.spellCd[id]=0;assert(g.cast(id));const entity=g.state.projectiles[0]||g.state.fields[0];assert.equal(entity.damage,spellDamage(p,g.stats(),id));}
 p.learnedVariants=['prism:harpoon'];p.spellVariants.prism='harpoon';const damage=spellDamage(p,g.stats(),'prism');assert.equal(damage,spellProfile(p,'prism').damage*(1+g.stats().power+g.stats().prism));assert(spellInsight(p,g.stats(),'prism').includes('geen sprongen'));
});
test('Planted foot speed remains matched to travel, and body/cast motion settles cleanly',()=>{
 assert.equal(2*WALK_STRIDE/FOOT_STANCE,WALK_CYCLE_DISTANCE);assert(footCycle(0)[0].planted);assert(!footCycle(.5)[0].planted);const idle={walkDistance:0,visualMotionBlend:0,cast:0};const still=heroBodyMotion(idle,0);assert(Math.abs(still.x)+Math.abs(still.y)+Math.abs(still.rotation)<1e-9);const cast=heroBodyMotion({...idle,cast:.09},2);assert(cast.x>0);const end=heroBodyMotion({...idle,cast:0},2);assert.equal(end.x,0);
});
test('Cloud feathering rasterizes once and sprite opacity composes with its parent',()=>{
 class Canvas{constructor(w,h){this.width=w;this.height=h;this.calls=[];this.ctx={globalAlpha:1,drawImage:(...a)=>this.calls.push(a),save(){this.saved=this.globalAlpha;},restore(){this.globalAlpha=this.saved;},translate(){},scale(){},rotate(){}};}getContext(){return this.ctx;}}
 globalThis.OffscreenCanvas=Canvas;const cache=new RenderCache(),img={},source={bounds:[0,0,200,100]};const first=cache.cloud(img,source);assert.equal(cache.cloud(img,source),first);const calls=first.calls.length;cache.cloud(img,source);assert.equal(first.calls.length,calls);
 const canvas=new Canvas(200,100),r={ctx:canvas.ctx,cache};canvas.ctx.globalAlpha=.4;let seen;canvas.ctx.drawImage=()=>{seen=canvas.ctx.globalAlpha;};Renderer.prototype.sprite.call(r,img,source,20,20,100,false,0,.5);assert.equal(seen,.2);assert.equal(canvas.ctx.globalAlpha,.4);
 assert(effectParticles(50)<effectParticles(0));assert(effectParticles(50,true)>effectParticles(50));
});
console.log(`\n${count} polish regression groups passed.`);
