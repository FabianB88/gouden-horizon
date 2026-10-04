import {AREA_BY_ID,POSITIONS,SPELLS,START_EQUIPMENT} from './data.js?v=37';
import {SAFE_HUBS} from './hubs.js?v=37';
import {makeItem,weighted} from './loot.js?v=37';
import {rollChaseItem,chaseRandom} from './chase-loot.js?v=37';
export const BOUNTIES={
 'bounty-spore':{boss:'tideleviathan',name:'De Sporenregent',hp:2.4,damage:1.08,scrap:65,cash:120,xp:75,level:8,weights:[0,52,36,11,1]},
 'bounty-solar':{boss:'solararchitect',name:'De Zonnebeul',hp:2.3,damage:1.12,scrap:110,cash:190,xp:105,level:11,weights:[0,25,51,21,3]}
};
export const BountyRules={
 startBounty(id,mode='loot',risk=false,slot=null){const s=this.state;if(!BOUNTIES[id]||!['loot','scrap'].includes(mode)||!SAFE_HUBS.includes(s.area)||!this.isUnlocked(id)||s.player.inventory.length>=48||slot&&!START_EQUIPMENT[slot]&&slot!=='head'||s.world.trial&&!s.world.trial.done)return false;s.bountyRequest={id,mode,risk:risk===true,slot};delete s.areas[id];return this.enterArea(id);},
 createBountyWorld(w,area){const spec=BOUNTIES[area.id],request=this.state.bountyRequest;this.state.bountyRequest=null;w.bounty={id:area.id,mode:request?.id===area.id?request.mode:'loot',risk:request?.risk===true,slot:request?.slot||null,paid:false};w.coreCollected=true;w.sideDone=false;w.sideRound=1;w.gate={...POSITIONS.exit,open:false,eliteSpawned:true};w.relays=[];w.hazards=[];w.loot=[];w.pickups=[];const e=this.makeEnemy(spec.boss,1080,570,false,true);e.bountyBoss=true;e.noReward=true;e.displayName=spec.name;e.maxHp=Math.round(e.maxHp*spec.hp*(w.bounty.risk?1.18:1));e.hp=e.maxHp;e.damageMultiplier*=spec.damage*(w.bounty.risk?1.16:1);e.cd=2;e.cooldownMultiplier*=w.bounty.risk?.86:.95;w.enemies=[e];return w;},
 updateBounty(){const s=this.state,w=s.world,b=w.bounty;if(s.mode!=='playing'||!b||b.paid||w.enemies.some(e=>!e.dead))return false;const spec=BOUNTIES[b.id],cash=b.mode==='scrap',reward=Math.round((cash?spec.cash:spec.scrap)*(b.risk?1.2:1));b.paid=true;w.sideDone=true;w.gate.open=true;s.player.scrap+=reward;s.player.xp+=spec.xp;
  const weights=[...spec.weights];if(b.risk){weights[1]-=6;weights[3]+=5;weights[4]+=1;}
  if(!cash||this.rng()<.25){const rarity=['common','uncommon','rare','epic','legendary'][weighted(weights,this.rng)],uid=++this.idCounter,level=Math.max(spec.level,Math.min(spec.level+3,s.player.level)),special=rollChaseItem({type:spec.boss},chaseRandom(s.seed,uid),level,uid),item=special&&(!b.slot||special.slot===b.slot)?special:makeItem({rng:this.rng,level,slot:b.slot,rarity,uid});w.loot.push({id:++this.idCounter,x:POSITIONS.exit.x-110,y:POSITIONS.exit.y+65,type:'loot',item,expeditionReward:true});this.emit('discovery',{item,found:true});}
  s.bountyVictories||={};s.bountyVictories[b.id]=(s.bountyVictories[b.id]||0)+1;s.kills++;this.notice(spec.name+' verslagen · +'+reward+' schroot · terugpoort open','#ffe3a0');this.emit('bossdead');return true;
 }
};
