import assert from 'node:assert/strict';
import {LanClient} from '../src/lan-client.js';
import {CoopSession} from '../src/coop-session.js';
import {copy} from '../src/engine.js';
let n=0;const test=(name,fn)=>{fn();n++;console.log('PASS '+name);};
function setup(){const party=new CoopSession(881);party.join({token:'a',name:'Mila'});party.join({token:'b',name:'Raf'});party.ready('hero-1');party.ready('hero-2');const client=new LanClient();client.connected=true;client.socket={send(){}};const snapshot=()=>copy(party.snapshot('hero-1').state);client.applySnapshot(snapshot(),[]);return {party,client,snapshot};}
test('LAN enemy and projectile movement interpolates between snapshots without simulating damage',()=>{
 const {party,client,snapshot}=setup(),g=party.engine;
 g.state.world.enemies=[{id:991,type:'raider',x:950,y:650,hp:100,maxHp:100,dead:false,walkDistance:0,jumpHeight:0}];
 g.state.projectiles=[{id:992,x:900,y:500,vx:800,vy:0,damage:100,team:'enemy',life:1}];client.applySnapshot(snapshot(),[]);
 Object.assign(g.state.world.enemies[0],{x:995,walkDistance:45,jumpHeight:25});g.state.projectiles[0].x=940;const hp=client.state.player.hp;client.applySnapshot(snapshot(),[]);
 assert.equal(client.state.world.enemies[0].x,950);assert.equal(client.state.projectiles[0].x,900);client.update(1/60,{paused:true});
 const e=client.state.world.enemies[0];assert(e.x>950&&e.x<995);assert(e.walkDistance>0&&e.walkDistance<45);assert(e.jumpHeight>0&&e.jumpHeight<25);assert(client.state.projectiles[0].x>900&&client.state.projectiles[0].x<940);
 assert.equal(client.state.player.hp,hp);assert.equal(g.state.world.enemies[0].x,995);assert.equal(g.state.world.enemies[0].hp,100);
});
test('Removed entities leave no interpolation cache; teleports snap and paused LAN freezes visuals',()=>{
 const {party,client,snapshot}=setup(),g=party.engine;g.state.world.enemies=[{id:991,x:900,y:500,hp:100,dead:false}];client.applySnapshot(snapshot(),[]);g.state.world.enemies[0].x=930;client.applySnapshot(snapshot(),[]);assert(client.visualTargets.size);
 party.leave('hero-2');client.applySnapshot(snapshot(),[]);const x=client.state.world.enemies[0].x;client.update(1/60);assert.equal(client.state.world.enemies[0].x,x);
 party.join({token:'b'});g.state.world.enemies[0].x=1350;client.applySnapshot(snapshot(),[]);assert.equal(client.state.world.enemies[0].x,1350);g.state.world.enemies=[];client.applySnapshot(snapshot(),[]);assert.equal(client.visualTargets.size,0);
});
test('Changing areas resets visual positions rather than dragging old coordinates across maps',()=>{
 const {party,client,snapshot}=setup();party.rpc('hero-1','enterArea',['delta']);party.acceptTravel('hero-2');const next=snapshot();client.applySnapshot(next,[]);assert.equal(client.state.area,'delta');assert.equal(client.visualTargets.size,0);assert.deepEqual(client.correction,{x:0,y:0});
});
console.log(`\n${n} LAN visual interpolation checks passed.`);
