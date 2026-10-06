import {AREA_BY_ID,ENEMIES} from './data.js?v=46';
import {CREATURE_ENEMIES,CREATURE_ELITES} from './creature-content.js?v=46';
import {chaseRandom} from './chase-loot.js?v=46';
import {makeItem} from './loot.js?v=46';
const dist=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
const unit=(x,y)=>{const n=Math.hypot(x,y)||1;return {x:x/n,y:y/n};};
const faunaAreas=new Set(['brine','kilometer','glass','saltwood','harbor','clouds','sluice','railworks','deepwater','heatworks','condensers']);
export const CreatureRules={
 addCreatureEncounter(w,area,group=w.enemies){
  if(!faunaAreas.has(area.id)||area.safe||area.bounty||area.endgame)return;
  const pool=group.filter(e=>!e.dead&&!e.faunaChanged&&!e.guardian&&!e.cacheGuard&&!e.elite&&!ENEMIES[e.type].boss);
  if(!pool.length||group.some(e=>!e.dead&&e.faunaChanged))return;
  const rng=chaseRandom(this.state.seed^0x82fa, pool[0].id),e=pool[Math.floor(rng()*pool.length)];
  const types=area.zone===2?['mistprowler','prismhorn','stormtoad']:area.zone===3?['stormtoad','prismhorn']:area.zone>=4?['mistprowler','stormtoad','prismhorn']:['prismhorn','mistprowler'];
  const type=types[Math.floor(rng()*types.length)],old=ENEMIES[e.type],base=ENEMIES[type],ratio=Math.max(.85,Math.min(1.15,base.hp/old.hp));
  e.type=type;e.radius=base.radius;e.faunaChanged=true;e.maxHp=Math.round(e.maxHp*ratio);e.hp=e.maxHp;this.placeSummon(e);
  // One possible rare elite per group. Existing elites and bosses remain intact.
  if(!group.some(n=>n!==e&&!n.dead&&n.elite)&&rng()<.22){e.elite=true;e.creatureElite=true;e.maxHp=Math.round(e.maxHp*1.35);e.hp=e.maxHp;e.eliteName=CREATURE_ELITES[type].name;}
 },
 prepareCreatureWorld(w,area){this.addCreatureEncounter(w,area);if(!faunaAreas.has(area.id)||area.kind!=='hub'||area.bossArena)return;
  const rng=chaseRandom(this.state.seed^0xcace,w.enemies[0]?.id||1);if(rng()>=.28)return;
  const point=this.placeSummon({x:720,y:790,radius:35});w.ritual={x:point.x,y:point.y,status:'sealed',rewarded:false};
 },
 creatureInteraction(){const s=this.state,r=s.world.ritual;if(!r||r.status!=='sealed'||dist(s.player,r)>105||!this.arenaCleared())return null;return {type:'ritual',entity:r,label:'Open verbondskist · optioneel · 3 bewakers',key:'F'};},
 startCreatureRitual(){const s=this.state,r=s.world.ritual;if(!r||r.status!=='sealed'||dist(s.player,r)>105||!this.arenaCleared()||s.mode!=='playing')return false;
  r.status='active';for(const [i,type]of Object.keys(CREATURE_ENEMIES).entries()){const a=i*Math.PI*2/3,e=this.placeSummon(this.makeEnemy(type,r.x+Math.cos(a)*160,r.y+Math.sin(a)*120,false,true));e.ritualGuard=true;e.noReward=true;e.cd=1.4+i*.2;s.world.enemies.push(e);this.effect('spawn',e.x,e.y,{element:ENEMIES[type].element,color:ENEMIES[type].color,radius:55,life:.5});}
  this.notice('Verbondskist · versla de drie bewakers voor één vondst','#a1e9d5');return true;
 },
 updateCreatureRitual(){const s=this.state,r=s.world.ritual;if(!r||r.status!=='active'||r.rewarded||s.world.enemies.some(e=>e.ritualGuard&&!e.dead))return;
  r.status='open';r.rewarded=true;const level=AREA_BY_ID[s.area].itemLevel||Math.max(5,1+s.zone*2),item=makeItem({rng:this.rng,level,profile:'ritual',uid:++this.idCounter});s.player.scrap+=35+s.zone*10;s.world.loot.push({id:++this.idCounter,x:r.x+65,y:r.y+40,type:'loot',item});
  this.effect('loot-reveal',r.x,r.y,{rarity:item.rarity,radius:70,life:1});this.notice('Verbondskist geopend · één vondst + schroot','#ffe0a1');this.emit('discovery',{item,found:true});
 },
 planCreatureAttack(e){if(!CREATURE_ENEMIES[e.type])return false;const p=this.enemyTarget(e),target={x:p.x,y:p.y},dir=unit(target.x-e.x,(target.y-e.y)*1.15);e.attacks=(e.attacks||0)+1;
  const mode=e.type==='prismhorn'?(e.attacks%2?'antlerFan':'antlerRush'):e.type==='mistprowler'?'mistPounce':'stormSpit',total=mode==='stormSpit'?.38:mode==='mistPounce'?.62:.85;
  e.windup={mode,target,dir,total,timer:total,quick:mode==='stormSpit'};this.emit('windup',{type:e.type});return true;
 },
 executeCreatureAttack(e){if(!CREATURE_ENEMIES[e.type]||!e.windup)return false;if(this.inCamp())return true;const s=this.state,w=e.windup,base=ENEMIES[e.type],damage=base.damage*(e.damageMultiplier||1)*(e.creatureElite?1.12:1);
  if(w.mode==='antlerRush'||w.mode==='mistPounce'){e.rush={dir:w.dir,life:w.mode==='mistPounce'?.29:.32,damage,hit:false,element:base.element};this.effect('slash',e.x,e.y,{dir:w.dir,element:base.element,color:base.color,radius:w.mode==='mistPounce'?90:125,life:.35});}
  else{const n=w.mode==='antlerFan'?3:e.creatureElite?3:2,spread=w.mode==='antlerFan'?.24:.16;for(let i=0;i<n;i++){const a=Math.atan2(w.dir.y,w.dir.x)+(i-(n-1)/2)*spread,speed=w.mode==='stormSpit'?590:350;s.projectiles.push({id:++this.idCounter,team:'enemy',type:'creature-bolt',x:e.x,y:e.y-35,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed/1.15,radius:7,damage:damage*(w.mode==='stormSpit'?.85:1),element:base.element,life:2.2,age:0,trail:[]});}}
  this.emit('enemyattack',{enemy:e.type,mode:w.mode});return true;
 },
 updateCreatureEnemy(e,dt){if(!CREATURE_ENEMIES[e.type])return false;e.mirrorCd=Math.max(0,(e.mirrorCd||0)-dt);
  if(e.creatureElite&&!e.eliteIntroduced&&e.awake){e.eliteIntroduced=true;this.notice(e.eliteName+' · '+CREATURE_ELITES[e.type].rule,ENEMIES[e.type].color);}
  if(e.mistStep){const step=e.mistStep;step.age+=dt;if(step.age<.55)return true;e.hidden=false;e.x=step.x;e.y=step.y;e.mistStep=null;e.cd=.55;this.effect('element-impact',e.x,e.y,{element:'water',radius:70,life:.45});return false;}
  if(e.creatureElite&&e.type==='mistprowler'&&e.hp/e.maxHp<(e.mistSteps? .35:.7)&&(e.mistSteps||0)<2){const p=this.state.player,a=Math.atan2(e.y-p.y,e.x-p.x)+1.8,spot=this.placeSummon({x:p.x+Math.cos(a)*195,y:p.y+Math.sin(a)*160,radius:e.radius});e.mistStep={x:spot.x,y:spot.y,age:0};e.mistSteps=(e.mistSteps||0)+1;e.hidden=true;e.windup=null;e.rush=null;this.effect('steam',e.x,e.y-20,{color:'#a6eeec',radius:75,life:.45});return true;}
  return false;
 },
 creatureProtection(e,damage,secondary){if(e.type!=='prismhorn'||!e.creatureElite||e.windup||e.rush||e.wet>0||e.stun>0)return damage;const p=this.state.player,n=unit(p.x-e.x,(p.y-e.y)*1.15);if(n.x*Math.cos(e.angle)+n.y*Math.sin(e.angle)<.4)return damage;
  if(!secondary&&!(e.mirrorCd>0)){e.mirrorCd=1.8;this.state.projectiles.push({id:++this.idCounter,team:'enemy',type:'mirror-bolt',x:e.x,y:e.y-45,vx:n.x*380,vy:n.y*380/1.15,radius:8,damage:Math.min(damage*.18,this.stats().maxHp*.04),element:'solar',damageType:'solar',life:1.5,age:0,trail:[]});this.effect('element-impact',e.x,e.y-45,{element:'solar',radius:45,life:.3});}return damage*.55;
 },
 creatureDeath(e){if(e.type!=='stormtoad'||!e.creatureElite||this.inCamp())return;this.state.world.threats.push({id:++this.idCounter,type:'creatureDischarge',x:e.x,y:e.y,r:145,arm:1.1,age:0,life:1.5,damage:ENEMIES[e.type].damage*(e.damageMultiplier||1)*1.1,element:'storm',hit:false});this.notice('Onweersbuik · stap uit de paarse cirkel','#d3baff');},
 updateCreatureThreats(dt){for(const t of this.state.world.threats){if(t.type!=='creatureDischarge'||t.hit||t.age<t.arm)continue;t.hit=true;this.hurtCompanions(t,t.r,t.damage);if(dist(this.state.player,t)<t.r)this.hurtPlayer(t.damage,'electric');this.effect('element-impact',t.x,t.y,{element:'storm',radius:t.r,life:.4});}}
};
