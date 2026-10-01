import {WORLD,SPELLS,AREAS,AREA_BY_ID,ENEMIES,START_EQUIPMENT,RARITIES} from './data.js?v=6';
import {makeItem,normalizePlayer,normalizeItem,DROP_TABLES,dropProfile,sellValue,salvageValue} from './loot.js?v=6';
const dist=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
const clone=value=>JSON.parse(JSON.stringify(value));
const unit=(x,y)=>{const n=Math.hypot(x,y)||1;return {x:x/n,y:y/n};};
export const REGION_CAMPS=['canal','highway','forest','skybridge'];
export const ExpeditionRules={
 isUnlocked(id){const area=AREA_BY_ID[id];return Boolean(area&&(this.state.visited.includes(id)||this.state.cores.filter(c=>c<3).length>=(area.unlockCore||0)));},
 arenaCleared(){const w=this.state.world;return !w.enemies.some(e=>!e.dead)&&w.relays.every(r=>r.status==='online')&&(this.state.zone===3?w.bossDefeated:w.gate?.eliteSpawned);},
 inCamp(point=this.state.player){const camp=this.state.world?.camp;return Boolean(camp&&dist(camp,point)<camp.radius);},
 canTrade(){return this.inCamp()&&['playing','modal'].includes(this.state.mode)&&(!this.state.pending||this.state.pending.type==='shop');},
 campFor(area){if(area.kind!=='route')return null;return {x:area.spawn[0]*WORLD.width+55,y:area.spawn[1]*WORLD.height-37,radius:180,merchant:{x:area.spawn[0]*WORLD.width+190,y:area.spawn[1]*WORLD.height-110},name:['Waterlijnhandel','Schrootstation','Veldmakers','Horizonpost'][area.zone]};},
 makeStock(zone){const stock=[],level=1+zone*2,slots=['weapon','suit','relic','boots','gloves','belt'];
  for(let i=0;i<8;i++)stock.push(makeItem({rng:this.rng,level:level+(i>5?1:0),rarity:i<2?'common':i<6?'uncommon':i===6?'rare':zone>=2?'epic':'rare',slot:slots[i%6],uid:++this.idCounter}));
  return stock;
 },
 buyItem(uid){if(!this.canTrade())return false;const w=this.state.world,p=this.state.player,index=w.shop.stock.findIndex(i=>i.uid===uid);if(index<0)return false;const item=w.shop.stock[index];if(p.scrap<item.price||p.inventory.length>=48)return false;
  p.scrap-=item.price;w.shop.stock.splice(index,1);p.inventory.push(item);this.notice(item.name+' gekocht · in rugzak');this.emit('loot');this.checkpoint();return item.uid;
 },
 sellItem(uid){if(!this.canTrade())return false;const p=this.state.player,index=p.inventory.findIndex(i=>i.uid===uid);if(index<0)return false;const item=p.inventory.splice(index,1)[0];const price=sellValue(item);p.scrap+=price;this.notice('Verkocht · +'+price+' schroot');this.emit('trade');this.checkpoint();return true;},
 forgeCost(item){return 18+(item.level||1)*5+(item.enhance||0)*17;},
 reinforce(slot){if(!this.canTrade())return false;const p=this.state.player,item=p.equipment[slot],cost=item&&this.forgeCost(item);if(!item||item.enhance>=3||p.scrap<cost)return false;
  const before=this.stats(),hp=p.hp/before.maxHp,mana=p.mana/before.maxMana;p.scrap-=cost;item.enhance=(item.enhance||0)+1;
  const bonus={weapon:{power:.06},suit:{hp:10},relic:{regen:1.4},boots:{speed:.045},gloves:{crit:.03},belt:{armor:.035}}[slot];
  for(const [key,value]of Object.entries(bonus))item.stats[key]=Number(((item.stats[key]||0)+value).toFixed(3));
  p.hp=this.stats().maxHp*hp;p.mana=this.stats().maxMana*mana;this.notice(item.name+' versterkt · +'+item.enhance);this.emit('level');this.checkpoint();return true;
 },
 buySupply(){if(!this.canTrade()||this.state.player.scrap<15||this.state.player.potions>=8)return false;this.state.player.scrap-=15;this.state.player.potions++;this.checkpoint();return true;},
 collectDrop(loot){const p=this.state.player;if(!loot.item)return false;if(p.inventory.length>=48){this.notice('Rugzak vol · verkoop of recycle uitrusting');return false;}p.inventory.push(loot.item);this.state.world.loot=this.state.world.loot.filter(i=>i.id!==loot.id);this.notice(RARITIES[loot.item.rarity].name+' · '+loot.item.name+' → rugzak',RARITIES[loot.item.rarity].color);this.emit('loot');return loot.item.uid;},
 setMainAttack(id){if(!['tide','storm','ember'].includes(id)||!this.state.player.skills.includes(id))return false;this.state.player.mainAttack=id;this.state.player.spell=id;this.emit('switch',{spell:id});return true;},
 assignRight(id){if(id!=='element'&&!this.state.player.skills.includes(id))return false;this.state.player.rightAbility=id;this.notice(id==='element'?'Elementvaardigheid op rechts':SPELLS[id].name+' op rechts');return true;},
 castRight(target){const p=this.state.player;return p.rightAbility==='element'?this.special(target):this.cast(p.rightAbility,target);},
 castArea(id,target){const s=this.state,p=s.player,spell=SPELLS[id],point=target||{x:p.x+p.aim.x*300,y:p.y+p.aim.y*220},range=dist(p,point),t=Math.min(1,520/Math.max(1,range));
  const x=p.x+(point.x-p.x)*t,y=p.y+(point.y-p.y)*t,dir=unit(x-p.x,(y-p.y)*1.15);
  const stats=this.stats();s.fields.push({id:++this.idCounter,type:id,x,y,r:spell.radius,damage:spell.damage*(1+stats.power+(stats[spell.element]||0)),life:spell.duration,age:0,pulse:id==='orbital'?.6:0,vx:id==='cyclone'?dir.x*105:0,vy:id==='cyclone'?dir.y*82:0});
  this.effect('field-open',x,y,{ability:id,color:spell.color,radius:spell.radius,life:.65});return true;
 },
 updateFields(dt){const s=this.state;
  for(const f of s.fields){f.age+=dt;f.life-=dt;f.x+=(f.vx||0)*dt;f.y+=(f.vy||0)*dt;f.pulse-=dt;
   if(f.type==='cyclone')for(const e of s.world.enemies.filter(e=>!e.dead&&e.type!=='boss'&&dist(e,f)<f.r)){const n=unit(f.x-e.x,f.y-e.y);this.moveEntity(e,n.x*130*dt,n.y*100*dt);}
   if(f.pulse<=0){f.pulse+=f.type==='orbital'?.75:.5;const spell=SPELLS[f.type];
    this.effect(f.type==='orbital'?'orbital-strike':'field-pulse',f.x,f.y,{ability:f.type,color:spell.color,radius:f.r,life:.55});
    for(const e of s.world.enemies.filter(e=>!e.dead&&dist(e,f)<f.r+e.radius))this.hitEnemy(e,f.damage,spell.element,true);
    if(f.type==='orbital')for(const h of s.world.hazards)if(h.type==='spore'&&dist(h,f)<h.r+f.r)h.cleared=true;
   }
  }s.fields=s.fields.filter(f=>f.life>0);
  if(s.ultimateWave){const wave=s.ultimateWave;wave.delay-=dt;if(wave.delay<=0){
    this.executingUltimate=true;for(const e of s.world.enemies.filter(e=>!e.dead&&dist(e,wave)<520)){e.wet=4;this.hitEnemy(e,150*(1+this.stats().power),'storm',true);e.stun=e.type==='boss'?.55:1.6;}
    this.executingUltimate=false;this.effect('ultimate-wave',wave.x,wave.y,{color:'#f6df91',radius:520,life:1.8});this.emit('ultimpact');s.ultimateWave=null;
  }}
 },
 migrateExpedition(){
  const s=this.state;normalizePlayer(s.player,()=>++this.idCounter);s.fields=s.fields||[];s.ultimateWave=s.ultimateWave||null;
  for(const [id,w]of Object.entries(s.areas)){const area=AREA_BY_ID[id];if(!area)continue;w.portals=this.portalDefinitions(id);w.camp=this.campFor(area);if(w.camp&&!w.shop)w.shop={stock:this.makeStock(area.zone)};w.enemies.forEach(e=>e.level=e.level||1+area.zone*2+(e.elite?2:0));}
  if(s.checkpoint?.player){normalizePlayer(s.checkpoint.player,()=>++this.idCounter);for(const [id,w]of Object.entries(s.checkpoint.areas||{})){const area=AREA_BY_ID[id];if(!area)continue;w.portals=this.portalDefinitions(id);w.camp=this.campFor(area);if(w.camp&&!w.shop)w.shop=clone(s.areas[id]?.shop||{stock:this.makeStock(area.zone)});}}
  if(s.pending?.type==='camp'){s.pending=null;s.mode='playing';this.enterArea(REGION_CAMPS[Math.min(3,s.zone+1)]);}
  s.version=5;
 }
};
