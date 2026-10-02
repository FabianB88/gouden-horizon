import {ENEMIES} from './data.js?v=19';
export const UNIQUE_ITEMS={
 waterlens:{slot:'weapon',name:'Lens van het Stille Water',art:'unique-waterlens',text:'Een getijtreffer laat een waterlens achter. Storm ontlaadt lenzen binnen 250 voor 18 schade. Maximaal drie; geen kettingprocs.',stats:{tide:.12,mana:8}},
 furnace:{slot:'gloves',name:'Handen van de Zonneoven',art:'unique-furnace',text:'Elke derde zonnetreffer veroorzaakt een extra kleine uitbarsting voor 20 schade. Herlaadt in 5 seconden.',stats:{ember:.1,fireResist:.08}},
 capacitor:{slot:'relic',name:'Condensator van het Onweer',art:'unique-capacitor',text:'Na drie getijtreffers doet je volgende stormtreffer 35% meer schade. Verbruikt de lading; herlaadt in 3 seconden.',stats:{storm:.1,mana:10}},
 command:{slot:'gloves',name:'Hand van de Bouwmeester',art:'unique-command',text:'Constructies schieten 22% harder. Een directe treffer op hun toegewezen doel herstelt 4 constructieleven, maximaal eens per 2 seconden.',stats:{power:.035,regen:1}},
 filter:{slot:'suit',name:'Mantel van de Spoorzoeker',art:'unique-filter',text:'Een antidote geeft 6 seconden een schild dat maximaal 24 directe schade opvangt. Herlaadt in 30 seconden; gif blijft weerstand gebruiken.',stats:{hp:18,poisonResist:.12}},
 tidestep:{slot:'boots',name:'Stappers van de Lage Kade',art:'unique-tidestep',text:'Ontwijken laat één waterlens achter. Vertraagt nabije gewone vijanden gedurende 2 seconden; herlaadt in 5 seconden.',stats:{speed:.055,waterResist:.08}},
 magnet:{slot:'belt',name:'Gordel van de Magneetbouwer',art:'unique-magnet',text:'Een vijand verslaan herstelt 5 mana en verkort constructieherladen met 1 seconde. Maximaal eens per 3 seconden.',stats:{mana:12,armor:.025}},
 crystal:{slot:'weapon',name:'Kristal van de Winterboog',art:'unique-crystal',text:'Een bevroren vijand verslaan schiet twee ijssplinters af voor 14 schade. Herlaadt in 4 seconden; splinters veroorzaken geen nieuwe procs.',stats:{power:.06,crit:.025}}
};
export const uniqueForSlot=(slot,rng)=>{const pool=Object.entries(UNIQUE_ITEMS).filter(([id,u])=>u.slot===slot);return pool[Math.floor(rng()*pool.length)]?.[0];};
export const UniqueRules={
 hasUnique(id){return Object.values(this.state.player.equipment).some(i=>i.effect===id);},
 uniqueHit(e,damage,element,secondary){if(secondary)return damage;const p=this.state.player,c=p.effectCooldowns||(p.effectCooldowns={});
  if(this.hasUnique('capacitor')&&element==='tide')p.capacitorCharge=Math.min(3,(p.capacitorCharge||0)+1);
  if(this.hasUnique('capacitor')&&element==='storm'&&p.capacitorCharge===3&&!(c.capacitor>0)){p.capacitorCharge=0;c.capacitor=3;damage*=1.35;this.emit('legendaryproc',{effect:'capacitor'});}
  if(this.hasUnique('waterlens')&&element==='tide'&&!(c.waterlens>0)){c.waterlens=.6;this.addWaterLens(e.x,e.y);}
  if(element==='storm'&&this.hasUnique('waterlens')){for(const f of this.state.world.threats.filter(t=>t.type==='waterlens'&&t.life>0&&Math.hypot(t.x-e.x,t.y-e.y)<250)){f.life=0;this.effect('nova',f.x,f.y,{radius:90,color:'#a2ede7',life:.4});for(const n of this.state.world.enemies.filter(n=>!n.dead&&Math.hypot(n.x-f.x,n.y-f.y)<90))this.hitEnemy(n,18,'storm',true);}}
  if(this.hasUnique('furnace')&&element==='ember'){p.furnaceCharge=Math.min(3,(p.furnaceCharge||0)+1);if(p.furnaceCharge>=3&&!(c.furnace>0)){p.furnaceCharge=0;c.furnace=5;this.effect('eruption',e.x,e.y,{radius:85,color:'#ffbc66',life:.4});for(const n of this.state.world.enemies.filter(n=>!n.dead&&Math.hypot(n.x-e.x,n.y-e.y)<85))this.hitEnemy(n,20,'ember',true);}}
  if(this.hasUnique('command')&&p.summonTarget===e.id&&!(c.command>0)){c.command=2;for(const u of this.state.summons||[])if(u.hp>0&&u.life>0)u.hp=Math.min(u.maxHp,u.hp+4);}
  return damage;
 },
 addWaterLens(x,y){const t=this.state.world.threats;t.filter(t=>t.type==='waterlens'&&t.life>0).slice(0,-2).forEach(t=>t.life=0);t.push({id:++this.idCounter,type:'waterlens',x,y,age:0,life:4,color:'#79e9e1'});},
 uniqueDash(){const c=this.state.player.effectCooldowns;if(this.hasUnique('tidestep')&&!(c.tidestep>0)){c.tidestep=5;this.addWaterLens(this.state.player.x,this.state.player.y);for(const e of this.state.world.enemies)if(!e.dead&&!e.hidden&&!ENEMIES[e.type].boss&&Math.hypot(e.x-this.state.player.x,e.y-this.state.player.y)<130)e.slow=Math.max(e.slow||0,2);}},
 uniqueKill(e){const p=this.state.player,c=p.effectCooldowns;if(this.hasUnique('magnet')&&!(c.magnet>0)){c.magnet=3;p.mana=Math.min(this.stats().maxMana,p.mana+5);p.spellCd.summon=Math.max(0,(p.spellCd.summon||0)-1);}
  if(this.hasUnique('crystal')&&e.frozen>0&&!(c.crystal>0)){c.crystal=4;for(const d of [-.4,.4]){const a=Math.atan2(p.aim.y,p.aim.x)+d;this.state.projectiles.push({id:++this.idCounter,team:'player',type:'frost',uniqueSecondary:true,x:e.x,y:e.y-20,vx:Math.cos(a)*650,vy:Math.sin(a)*650/1.15,damage:14,radius:8,life:.65,age:0,trail:[],hitIds:[e.id]});}}
 }
};
