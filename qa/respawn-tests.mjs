import assert from 'node:assert/strict';
import {Engine,canStand,copy} from '../src/engine.js';
import {CoopSession} from '../src/coop-session.js';
import {LanClient} from '../src/lan-client.js';
const dead=g=>{g.state.player.hp=0;g.state.mode='dead';};
const pairs=[['canal','ring'],['highway','kilometer'],['forest','saltwood'],['skybridge','aurelia'],['metro-refuge','deepwater'],['cooling-refuge','tower'],['groenkloof','glass-dunes'],['lanternwood','coppercrown']];
for(const [hub,arena]of pairs){
 const g=new Engine();g.unlockTestMode('fabian1');g.enterArea(hub);g.state.player.scrap=812;g.enterArea(arena);const gear=copy(g.state.player.equipment);g.state.player.scrap=900;dead(g);
 assert.equal(g.respawnHub(),hub);assert(g.respawnAtHub());assert.equal(g.state.area,hub);assert.equal(g.state.mode,'playing');assert.equal(g.state.player.hp,g.stats().maxHp);assert.equal(g.state.player.scrap,812,'same arrival checkpoint rules as retry');assert.deepEqual(g.state.player.equipment,gear);assert(g.inCamp());assert(canStand(g.state.player.x,g.state.player.y,18,hub));assert.equal(g.state.checkpoint.area,hub);assert(!g.respawnAtHub(),'cannot escape a living fight');g.lockTestMode();const saved=Engine.restore(g.serialize());assert.equal(saved.state.area,hub);assert.equal(saved.state.lastSafeArea,hub);
 console.log('PASS death recovery and saved preparation point: '+arena+' -> '+hub);
}
{
 const g=new Engine();g.unlockTestMode('fabian1');g.enterArea('forest');g.enterArea('highway');g.enterArea('ring');dead(g);assert.equal(g.respawnHub(),'highway');assert(g.respawnAtHub());assert.equal(g.state.area,'highway');console.log('PASS remembers actual latest visit, including revisited hubs');
}
{
 const g=new Engine();g.unlockTestMode('fabian1');g.enterArea('cooling-refuge');g.enterArea('tower');delete g.state.lastSafeArea;delete g.state.checkpoint.lastSafeArea;dead(g);assert(g.respawnAtHub());assert.equal(g.state.area,'cooling-refuge');console.log('PASS older saves find the regional preparation hub');
}
{
 const g=new Engine();g.unlockTestMode('fabian1');g.enterArea('skybridge');g.enterArea('trial-tide');dead(g);assert(g.respawnAtHub());assert.equal(g.state.area,'skybridge');assert(g.state.player.hp>0);assert(!g.state.world.trial);console.log('PASS dead time-trial player returns alive');
}
{
 const g=new Engine();g.unlockTestMode('fabian1');g.enterArea('ring');dead(g);g.retry();assert.equal(g.state.area,'ring');assert.equal(g.state.mode,'playing');assert(g.state.player.hp>0);console.log('PASS existing arena retry still works');
}
{
 const party=new CoopSession(183),a=party.join({token:'a'}),b=party.join({token:'b'});party.ready(a.id);party.ready(b.id);party.rpc(a.id,'unlockTestMode',['fabian1']);party.rpc(a.id,'testTravel',['ring']);party.acceptTravel(b.id);assert(!party.rpc(a.id,'respawnAtHub',[]));for(const p of party.actors){p.player.hp=0;p.mode='downed';}assert(party.rpc(a.id,'respawnAtHub',[]));assert.equal(party.engine.state.area,'canal');for(const p of party.actors){assert(p.player.hp>0);assert.equal(p.mode,'playing');}const client=new LanClient();client.connected=true;client.running=true;let request;client.socket={send:data=>request=JSON.parse(data)};client.state=copy(party.snapshot(a.id).state);assert(client.respawnAtHub());assert.equal(request.method,'respawnAtHub');console.log('PASS LAN wipe recovery restores both heroes; living fights cannot escape');
}
console.log('13 focused death-recovery checks passed.');
