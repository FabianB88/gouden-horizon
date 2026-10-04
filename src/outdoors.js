import {OUTDOOR_REGIONS,outdoorPoint,inOutdoorWild} from './outdoor-content.js?v=36';
import {ENEMIES} from './data.js?v=36';
import {tuneChapterEnemy} from './balance.js?v=36';
import {makeItem} from './loot.js?v=36';
const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
const midpoint=r=>outdoorPoint(r.id,r.door[0].map((v,i)=>(v+r.door[1][i])/2));
export const OutdoorRules={
 prepareOutdoors(w,area){if(!OUTDOOR_REGIONS[area.id])return;w.outdoor||={version:1,open:false,done:[],rewarded:false,channel:null};},
 outdoorGateBlocks(x,y,radius=18){const id=this.state.area,r=OUTDOOR_REGIONS[id],w=this.state.world;if(!r||w?.outdoor?.open)return false;return [[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]].some(([dx,dy])=>inOutdoorWild(id,{x:x+dx,y:y+dy}));},
 outdoorNPC(){const r=OUTDOOR_REGIONS[this.state.area];return r?{id:r.npc,...outdoorPoint(this.state.area,r.npcPoint),name:r.npcName,title:r.name}:null;},
 outdoorInteraction(){const id=this.state.area,r=OUTDOOR_REGIONS[id],p=this.state.player,o=this.state.world.outdoor;if(!r||!o)return null;
  const npc=this.outdoorNPC();if(distance(p,npc)<105)return {type:'outdoorNPC',entity:npc,label:r.npcName+' · '+r.goal,key:'F'};
  const door=midpoint({...r,id});if(!o.open&&distance(p,door)<145)return {type:'outdoorDoor',entity:door,label:'Open '+r.doorName+' · optioneel gevaarlijk zijgebied',key:'F'};
  if(!o.open)return null;
  const point=r.points.find(q=>!o.done.includes(q.id)&&distance(p,outdoorPoint(id,q.point))<100);
  if(point){const guarded=r.mode==='harvest'&&this.state.world.enemies.some(e=>e.outdoor&&!e.dead&&distance(e,outdoorPoint(id,point.point))<220);return {type:guarded?'outdoorGuard':'outdoorPoint',entity:point,label:guarded?'Versla de bewakers bij '+point.name:r.mode==='channel'?'Stem '+point.name+' af · 2s stilstaan':r.mode==='vent'?'Sluit '+point.name+' · doof het hitteveld':'Berg '+point.name,key:'F'};}return null;
 },
 talkOutdoorNPC(){const r=OUTDOOR_REGIONS[this.state.area],npc=this.outdoorNPC();if(!r||distance(npc,this.state.player)>=105)return false;const o=this.state.world.outdoor;this.state.mode='modal';this.state.pending={type:'archive',title:r.npcName,body:r.intro+'\n\n'+(o.rewarded?'Dank je. De route blijft open om verder rond te lopen.':r.goal+' · '+o.done.length+'/3. Advies: niveau '+r.level+' met passende uitrusting. Beloning: '+r.rewardText+'. Eén keer per expeditie.')};return true;},
 openOutdoorDoor(){const id=this.state.area,r=OUTDOOR_REGIONS[id],o=this.state.world.outdoor;if(!r||!o||o.open||distance(this.state.player,midpoint({...r,id}))>=145||this.state.mode!=='playing')return false;
  o.open=true;o.openedAt=this.state.time;this.spawnOutdoorEncounter();this.notice(r.doorName+' geopend · loop door de doorgang · '+r.goal,r.color);this.emit('relay');this.checkpoint();return true;
 },
 spawnOutdoorEncounter(){const id=this.state.area,r=OUTDOOR_REGIONS[id],w=this.state.world;if(!r||w.outdoor.spawned)return false;w.outdoor.spawned=true;
  for(const [type,x,y]of r.encounters){const point=outdoorPoint(id,[x,y]),e=this.placeSummon(this.makeEnemy(type,point.x,point.y));e.outdoor=true;
   if(r.tier)tuneChapterEnemy(e,{id:r.tier});else{e.maxHp=Math.round(e.maxHp*1.45);e.hp=e.maxHp;e.damageMultiplier*=1.5;e.cooldownMultiplier*=.85;}e.level=Math.max(e.level,r.level);w.enemies.push(e);
  }
  if(r.mode==='vent')for(const q of r.points){const point=outdoorPoint(id,q.point);w.hazards.push({id:'outdoor-heat-'+q.id,...point,r:90,type:'heat',damage:18,outdoor:true,vent:q.id,cleared:false});}return true;
 },
 inspectOutdoorPoint(id){const r=OUTDOOR_REGIONS[this.state.area],o=this.state.world.outdoor,q=r?.points.find(q=>q.id===id),p=this.state.player;if(!q||!o.open||o.done.includes(id)||this.state.mode!=='playing'||distance(p,outdoorPoint(this.state.area,q.point))>=100)return false;
  if(r.mode==='harvest'&&this.state.world.enemies.some(e=>e.outdoor&&!e.dead&&distance(e,outdoorPoint(this.state.area,q.point))<220))return false;
  if(r.mode==='channel'){if(o.channel)return false;o.channel={id,owner:p.heroId||'solo',start:{x:p.x,y:p.y},lastHurt:p.lastHurt,time:0};this.notice('Afstemmen · blijf 2s staan en houd je spreuken stil',r.color);return true;}
  o.done.push(id);if(r.mode==='vent')for(const h of this.state.world.hazards)if(h.vent===id)h.cleared=true;this.effect('relay',...Object.values(outdoorPoint(this.state.area,q.point)),{color:r.color,radius:65,life:.65});this.notice(q.name+(r.mode==='vent'?' gesloten · hitteveld gedoofd':' geborgen')+' · '+o.done.length+'/3',r.color);this.emit('relaydone');return true;
 },
 updateOutdoorActor(dt){const o=this.state.world.outdoor,c=o?.channel,p=this.state.player;if(!c||c.owner!==(p.heroId||'solo'))return;
  if(distance(p,c.start)>9||p.lastHurt>c.lastHurt||p.cast>0||p.dashTimer>0||p.hp<=0){o.channel=null;this.notice('Afstemming onderbroken · probeer opnieuw','#edd4a1');return;}
  c.time+=dt;if(c.time<2)return;o.done.push(c.id);o.channel=null;const r=OUTDOOR_REGIONS[this.state.area],q=r.points.find(q=>q.id===c.id),point=outdoorPoint(this.state.area,q.point);this.effect('relay',point.x,point.y,{color:r.color,radius:75,life:.8});this.notice(q.name+' afgestemd · '+o.done.length+'/3',r.color);this.emit('relaydone');
 },
 updateOutdoorProgress(){const r=OUTDOOR_REGIONS[this.state.area],w=this.state.world,o=w.outdoor;if(!r||!o||o.rewarded||o.done.length<3||w.enemies.some(e=>e.outdoor&&!e.dead))return;
  o.rewarded=true;this.state.player.scrap+=r.reward;const npc=this.outdoorNPC(),item=makeItem({rng:this.rng,level:r.level,profile:'expedition',uid:++this.idCounter});w.loot.push({id:++this.idCounter,x:npc.x+65,y:npc.y+28,type:'loot',item,outdoorReward:true});this.notice(r.name+' verkend · +'+r.reward+' schroot · vondst bij '+r.npcName.split(' · ')[0],r.color);this.emit('discovery',{item,found:true});this.checkpoint();
 }
};
