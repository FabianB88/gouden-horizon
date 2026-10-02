import {SPELLS,ENEMIES} from './data.js?v=22';
const dist=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
export const COMPANIONS={
 scout:{name:'Verkenner',text:'Twee kwetsbare drones schieten gerichte stormbouten.',count:2,hp:34,life:18,damage:8,interval:1.1},
 guardian:{name:'Wachtconstructie',text:'Eén stevige constructie onderschept projectielen en vertraagt nabije vijanden.',count:1,hp:95,life:20,damage:5,interval:1.8},
 mender:{name:'Hersteldrone',text:'Eén kwetsbare drone herstelt in totaal maximaal 24 leven. Schiet niet.',count:1,hp:42,life:16,damage:0,interval:2}
};
export const SummonRules={
 summonCompanions(){const s=this.state,p=s.player,spec=COMPANIONS[p.companionProfile||'scout'];
  if(!spec)return false;s.summons=[];p.summonTarget=null;const stats=this.stats(),scale=1+Math.min(.65,stats.power),count=spec.count+(p.companionProfile==='scout'?stats.minionCount||0:0),life=spec.life+(stats.minionLife||0),health=spec.hp*scale*(1+(stats.minionHealth||0));
  for(let i=0;i<count;i++){const unit={id:++this.idCounter,profile:p.companionProfile||'scout',x:p.x+(i?45:-45),y:p.y+35,radius:17,hp:health,maxHp:health,life,maxLife:life,cd:.5+i*.3,healed:0,attackRelease:0};this.placeSummon(unit);s.summons.push(unit);this.effect('spawn',unit.x,unit.y,{radius:45,color:'#7ceade',life:.5});}
  this.notice(spec.name+' actief · T geeft een doel aan','#a1e7de');this.emit('summon');return true;
 },
 selectCompanion(id){const p=this.state.player;if(this.challengeBuildLocked()||!COMPANIONS[id]||!p.skills.includes('summon')||id==='mender'&&!p.menderUnlocked)return false;p.companionProfile=id;return true;},
 commandCompanions(point){const s=this.state,p=s.player;if(this.inCamp()||!(s.summons?.length)||(p.commandCd||0)>0)return false;const target=s.world.enemies.filter(e=>!e.dead&&!e.hidden&&dist(e,point)<110).sort((a,b)=>dist(a,point)-dist(b,point))[0];p.summonTarget=target?.id||null;p.commandCd=.6;if(target)this.notice('Drones richten op '+ENEMIES[target.type].name,'#a1e7de');return Boolean(target);},
 updateCompanions(dt){const s=this.state,p=s.player;p.commandCd=Math.max(0,(p.commandCd||0)-dt);s.summons||=[];if(this.inCamp()){s.summons=[];return;}
  for(const u of s.summons){u.life-=dt;u.cd-=dt;u.attackRelease=Math.max(0,u.attackRelease-dt);if(u.hp<=0||u.life<=0)continue;const spec=COMPANIONS[u.profile],enemies=s.world.enemies.filter(e=>!e.dead&&!e.hidden),assigned=enemies.find(e=>e.id===p.summonTarget),target=assigned||enemies.sort((a,b)=>dist(a,u)-dist(b,u))[0];
   const desired=target&&dist(target,p)<650?{x:target.x+(u.profile==='guardian'?-90:-180),y:target.y+60}:{x:p.x+(u.id%2?65:-65),y:p.y+45},d=dist(u,desired);if(d>36){const speed=Math.min(245,d*3),n=Math.hypot(desired.x-u.x,desired.y-u.y)||1;this.moveEntity(u,(desired.x-u.x)/n*speed*dt,(desired.y-u.y)/n*speed*dt);}
   for(const bolt of s.projectiles){if(bolt.team!=='enemy'||bolt.life<=0||['enemy-carrier','enemy-lob'].includes(bolt.type))continue;if(dist({x:bolt.x,y:bolt.y+20},u)<(u.profile==='guardian'?45:23)+bolt.radius){u.hp-=bolt.damage*(1-(u.profile==='guardian'?this.stats().guardianGuard||0:0));bolt.life=0;this.effect('impact',u.x,u.y-20,{color:'#82e4db',radius:25,life:.25});}}
   for(const e of enemies)if(dist(e,u)<e.radius+24&&!e.stun)u.hp-=dt*ENEMIES[e.type].damage*.42*(1-(u.profile==='guardian'?this.stats().guardianGuard||0:0));
   if(u.profile==='guardian')for(const e of enemies)if(!ENEMIES[e.type].boss&&dist(e,u)<110)e.slow=Math.max(e.slow||0,.3);
   if(u.cd<=0){u.cd=spec.interval;u.attackRelease=.3;if(u.profile==='mender'){if(dist(u,p)<260&&u.healed<24+(this.stats().menderCap||0)&&p.hp<this.stats().maxHp){const heal=Math.min(this.stats().menderCap?4:3,24+(this.stats().menderCap||0)-u.healed,this.stats().maxHp-p.hp);u.healed+=heal;p.hp+=heal;this.effect('chain',u.x,u.y-25,{end:{x:p.x,y:p.y-25},color:'#a5e7b5',life:.25});}}
    else if(target&&dist(u,target)<480){const n=Math.hypot(target.x-u.x,(target.y-u.y)*1.15)||1,dx=(target.x-u.x)/n,dy=(target.y-u.y)*1.15/n;s.projectiles.push({id:++this.idCounter,team:'player',companion:true,type:'storm',x:u.x,y:u.y-24,vx:dx*520,vy:dy*520/1.15,damage:spec.damage*(1+Math.min(.65,this.stats().power))*(1+(this.stats().minionDamage||0))*(this.hasUnique('command')?1.22:1),radius:6,life:1.2,age:0,trail:[],hitIds:[]});}}
  }s.summons=s.summons.filter(u=>u.hp>0&&u.life>0);
 }
};
export function companionMenu(p){if(!p.skills.includes('summon'))return '';return `<h3>Constructie afstellen</h3><p class="menu-intro">T: geef je constructie een doel onder je cursor. Een nieuwe oproep vervangt de vorige groep. De afstelling geldt voor je volgende oproep.</p><div class="companion-options">${Object.entries(COMPANIONS).map(([id,c],i)=>`<button data-companion="${id}" ${id==='mender'&&!p.menderUnlocked?'disabled':''} aria-pressed="${(p.companionProfile||'scout')===id}"><img src="assets/items/companion-${id}.webp" alt=""><strong>${c.name}</strong><p>${c.text}</p><small>${id==='mender'&&!p.menderUnlocked?'BELOOND DOOR ILYA’S OPDRACHT':c.life+'s actief · '+c.hp+' basisleven'}</small></button>`).join('')}</div>`;}
