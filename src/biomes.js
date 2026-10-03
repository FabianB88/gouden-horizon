import {AREA_BY_ID,ENEMIES,WORLD} from './data.js?v=30';
import {BIOME_ENEMIES} from './biome-content.js?v=30';
import {launchEnemyLob} from './enemy-combat.js?v=30';
const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
const unit=(x,y)=>{const n=Math.hypot(x,y)||1;return {x:x/n,y:y/n};};
export function tuneBiomeEnemy(e,area,playerLevel){
 if(!area?.biomeArena)return e;
 const base=ENEMIES[e.type],growth=1+Math.min(6,Math.max(0,playerLevel-14))*.075;
 e.level=area.itemLevel;e.maxHp=Math.round(base.hp*(base.boss?2.8:4.1)*growth);e.hp=e.maxHp;
 e.damageMultiplier=2.15*Math.sqrt(growth);e.speedMultiplier=1.08;e.cooldownMultiplier=.78;
 e.balanceVersion=81;return e;
}
export const BiomeRules={
 createBiomeWorld(w,area){
  w.biome={wave:1,paid:false};w.sideRound=1;w.sideDone=false;w.coreCollected=true;w.relays=[];w.archive=null;w.hazards=[];w.loot=[];
  w.gate={x:area.exit[0]*WORLD.width,y:area.exit[1]*WORLD.height,open:false,eliteSpawned:false};
  this.spawnBiomeWave(w,area);
 },
 spawnBiomeWave(w,area){
  const types=w.biome.wave===3?['dunebreaker']:w.biome.wave===1?['glassscorpion','dustskirmisher','slagcarrier','glassscorpion','dustskirmisher']:['dustskirmisher','glassscorpion','slagcarrier','dustskirmisher','glassscorpion','slagcarrier'];
  const positions=[[960,650],[1280,590],[1180,870],[700,550],[1100,420],[1370,780]];
  for(const [i,type]of types.entries()){const [x,y]=positions[i],e=this.placeSummon(this.makeEnemy(type,x,y,false,w.biome.wave>1));e.biomeEnemy=true;if(type==='dunebreaker')e.guardian=true;w.enemies.push(e);}
 },
 completeBiomeArena(){const s=this.state,w=s.world,a=AREA_BY_ID[s.area];if(!w.biome||w.biome.paid||s.mode!=='playing'||w.enemies.some(e=>!e.dead))return false;
  if(w.biome.wave<3){w.biome.wave++;w.sideRound=w.biome.wave;this.spawnBiomeWave(w,a);this.notice(w.biome.wave===3?'De Duinbreker ontwaakt · houd je dash klaar':'Nieuwe bewakers · schakel gifdragers eerst uit',w.biome.wave===3?'#ffe0a1':'#bedb64');return true;}
  w.biome.paid=true;w.sideDone=true;w.gate.open=true;w.gate.eliteSpawned=true;s.player.scrap+=a.reward;
  s.biomeVictories||={};s.biomeVictories[s.area]=(s.biomeVictories[s.area]||0)+1;
  this.notice('Duinen vrij · +'+a.reward+' schroot · de terugpoort naar Groenkloof is open','#ffe0a1');this.emit('relaydone');return true;
 },
 planBiomeAttack(e){if(!BIOME_ENEMIES[e.type])return false;const p=this.enemyTarget(e),dir=unit(p.x-e.x,(p.y-e.y)*1.15);e.attacks=(e.attacks||0)+1;
  const sets={glassscorpion:['stingVolley','pincer'],dustskirmisher:['sandShot','sandBurst'],slagcarrier:['slagLob','cinderSweep'],dunebreaker:['drillRush','duneRing','cinderLob']};
  const mode=sets[e.type][(e.attacks-1)%sets[e.type].length],quick=mode==='sandShot',total=quick?.34:mode==='pincer'?.6:mode==='stingVolley'?.85:mode==='drillRush'?1.1:1.25;
  const target={x:p.x,y:p.y};e.windup={mode,dir,target,total,timer:total,quick};
  if(['slagLob','cinderLob'].includes(mode))e.windup.targets=mode==='slagLob'?[target]:[target,{x:p.x-dir.y*170,y:p.y+dir.x*170/1.15}];
  this.emit('windup',{type:e.type});return true;
 },
 executeBiomeAttack(e){if(!BIOME_ENEMIES[e.type]||!e.windup)return false;if(this.inCamp())return true;
  const s=this.state,w=e.windup,base=ENEMIES[e.type],damage=base.damage*(e.damageMultiplier||1),fan=(n,spread,speed,venom=false)=>{for(let i=0;i<n;i++){const angle=Math.atan2(w.dir.y,w.dir.x)+(i-(n-1)/2)*spread;s.projectiles.push({id:++this.idCounter,team:'enemy',type:'sand-bolt',x:e.x,y:e.y-30,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed/1.15,radius:venom?7:6,damage,venom,age:0,life:2.5,trail:[]});}};
  if(w.mode==='stingVolley')fan(3,.22,360,true);
  if(w.mode==='sandShot')fan(1,0,670);
  if(w.mode==='sandBurst')fan(3,.13,510);
  if(w.mode==='pincer'){const n=unit(s.player.x-e.x,(s.player.y-e.y)*1.15);if(distance(e,s.player)<128&&n.x*w.dir.x+n.y*w.dir.y>.45)this.hurtPlayer(damage);this.effect('slash',e.x,e.y,{dir:w.dir,radius:110,color:base.color,life:.28});}
  if(w.mode==='drillRush'){e.rush={dir:w.dir,life:e.phase===2?.5:.4,damage,hit:false};this.effect('slash',e.x,e.y,{dir:w.dir,radius:150,color:base.color,life:.32});}
  if(w.mode==='duneRing')s.world.threats.push({id:++this.idCounter,type:'ring',source:e.id,x:e.x,y:e.y,r:45,width:23,speed:e.phase===2?310:245,damage:damage*.85,element:'metal',color:base.color,age:0,life:1.7,hit:false});
  if(w.mode==='cinderSweep')s.world.threats.push({id:++this.idCounter,type:'sweep',source:e.id,x:e.x,y:e.y,angle:Math.atan2(w.dir.y,w.dir.x)-.5,length:320,damage:damage*.6,element:'fire',color:'#ff9e60',age:0,life:.9,tick:0});
  if(['slagLob','cinderLob'].includes(w.mode)){for(const target of w.targets)launchEnemyLob(this,e,target,{duration:.75,damage,radius:85,element:'fire'});for(const t of s.world.threats.filter(t=>t.source===e.id&&t.type==='bossPatch'))t.life=0;for(const target of w.targets)s.world.threats.push({id:++this.idCounter,type:'bossPatch',source:e.id,...target,r:85,damage:damage*.45,element:'fire',color:'#ff9e60',age:0,arm:.85,life:3.5,tick:.7});}
  this.emit('enemyattack',{enemy:e.type,mode:w.mode});return true;
 },
 updateBiomeEnemy(e){if(e.type==='dunebreaker'&&e.phase===1&&e.hp<e.maxHp*.5){e.phase=2;e.cd=Math.min(e.cd,.6);e.cooldownMultiplier*=.88;this.notice('Duinbreker · de reactor staat open','#a5e9dd');this.effect('nova',e.x,e.y,{element:'metal',radius:120,color:'#e9bd77',life:.5});this.emit('bossphase',{enemy:e.type,phase:2});}}
};
