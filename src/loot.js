import {EQUIPMENT,START_EQUIPMENT,RARITIES,SPELLS} from './data.js?v=36';
import {LEGENDARY_EFFECTS,effectText,effectForSlot} from './legendary.js?v=36';

import {UNIQUE_ITEMS,uniqueForSlot} from './unique-items.js?v=36';
import {normalizeVariants} from './spell-variants.js?v=36';
import {V8_ITEMS} from './v8-content.js?v=36';
import {emptyHead,emptyRelic} from './equipment-slots.js?v=36';
export const EXTRA_EQUIPMENT=[
 {id:'tidal-fork',slot:'weapon',name:'Getijdenstemvork',stats:{power:.07,tide:.10}},
 {id:'amber-prism',slot:'weapon',name:'Amberprisma',stats:{power:.08,ember:.11}},
 {id:'cobalt-coat',slot:'suit',name:'Pekelwerende Jas',stats:{hp:18,armor:.025}},
 {id:'brass-jacket',slot:'suit',name:'Messinglamellen',stats:{hp:12,armor:.06}},
 {id:'nav-astrolabe',slot:'relic',name:'Horizonastrolabium',stats:{mana:14,regen:.8}},
 {id:'seed-heart',slot:'relic',name:'Kiemhart',stats:{recovery:.35,leech:.8}},
 {id:'quickstep-boots',slot:'boots',name:'Corridorlopers',stats:{speed:.10,dash:.07}},
 {id:'ash-boots',slot:'boots',name:'Asbestendige Laarzen',stats:{speed:.05,heatGuard:.22}},
 {id:'copper-gauntlets',slot:'gloves',name:'Kopergeleiders',stats:{storm:.08,crit:.04}},
 {id:'thorn-gloves',slot:'gloves',name:'Doornweefhandschoenen',stats:{power:.04,armor:.025}},
 {id:'condenser-belt',slot:'belt',name:'Condensorgordel',stats:{mana:12,regen:.7}},
 {id:'medtech-belt',slot:'belt',name:'Veldzorggordel',stats:{hp:10,recovery:.3}},
 {id:'scrap-rod',slot:'weapon',name:'Schrootfocus',stats:{power:.06}},
 {id:'utility-coat',slot:'suit',name:'Werkveldjas',stats:{hp:14}},
 {id:'field-compass',slot:'relic',name:'Veldkompas',stats:{mana:12}},
 {id:'fork-focus',slot:'weapon',name:'Groene Stemvork',stats:{power:.10,regen:1}},
 {id:'ranger-coat',slot:'suit',name:'Isolatiemantel',stats:{hp:20,heatGuard:.2}},
 {id:'sun-compass',slot:'relic',name:'Zonnekompas',stats:{comboCharge:.15}},
 {id:'field-boots',slot:'boots',name:'Veldlaarzen',stats:{speed:.06}},
 {id:'field-gloves',slot:'gloves',name:'Werkhandschoenen',stats:{crit:.035}},
 {id:'field-belt',slot:'belt',name:'Veldgordel',stats:{hp:8,mana:8}},
 {id:'runner-boots',slot:'boots',name:'Getijdenlaarzen',stats:{speed:.12,dash:.1}},
 {id:'storm-gloves',slot:'gloves',name:'Geleidershandschoenen',stats:{crit:.06,power:.05}},
 {id:'solar-belt',slot:'belt',name:'Zonneweefgordel',stats:{armor:.05,mana:15}}
];
export const ITEM_BASES=[...EQUIPMENT,...EXTRA_EQUIPMENT,...V8_ITEMS];
export const DROP_TABLES={
 mossback:{chance:.20,weights:[0,25,53,20,2],slots:['suit','head','belt']},
 sunnewt:{chance:.18,weights:[0,20,55,23,2],slots:['weapon','gloves','belt']},
 windowl:{chance:.17,weights:[0,25,54,19,2],slots:['boots','relic','gloves']},
 prismhorn:{chance:.18,weights:[15,38,35,11,1],slots:['suit','head','relic']},
 mistprowler:{chance:.16,weights:[20,42,30,7,1],slots:['boots','weapon','gloves']},
 stormtoad:{chance:.17,weights:[15,38,35,11,1],slots:['relic','gloves','belt']},
 ritual:{chance:1,weights:[0,20,60,19,1]},
 glassscorpion:{chance:.17,weights:[0,25,56,18,1],slots:['head','boots','belt']},
 dustskirmisher:{chance:.18,weights:[0,22,56,20,2],slots:['weapon','gloves','relic']},
 slagcarrier:{chance:.23,weights:[0,15,56,26,3],slots:['suit','head','belt']},
 pressurediver:{chance:.22,weights:[0,18,56,24,2],slots:['suit','head','weapon']},
 rimedrone:{chance:.18,weights:[0,25,56,18,1],slots:['boots','relic','head']},
 furnacegunner:{chance:.24,weights:[0,12,58,27,3],slots:['gloves','suit','head']},
 eel:{chance:.14,weights:[28,43,25,4,0],slots:['gloves','relic','boots']},
 salamander:{chance:.17,weights:[14,38,36,11,1],slots:['weapon','suit','belt']},
 shieldguard:{chance:.19,weights:[13,35,39,12,1],slots:['suit','gloves','boots']},
 stormnest:{chance:.23,weights:[5,27,45,21,2],slots:['weapon','relic','belt']},
 minecrab:{chance:.15,weights:[24,43,27,6,0],slots:['boots','belt','gloves']},
 resonant:{chance:.21,weights:[8,32,43,16,1],slots:['relic','gloves','weapon']},
 brinebreaker:{chance:.25,weights:[4,24,45,25,2],slots:['suit','belt','weapon']},
 crawler:{chance:.22,weights:[70,27,3,0,0],slots:['boots','belt','weapon']},
 drone:{chance:.26,weights:[60,32,8,0,0],slots:['relic','gloves','weapon']},
 raider:{chance:.34,weights:[45,40,14,1,0],slots:['weapon','suit','boots']},
 sniper:{chance:.42,weights:[30,40,26,4,0],slots:['weapon','gloves','relic']},
 turret:{chance:.40,weights:[25,42,28,5,0],slots:['relic','belt','weapon']},
 beast:{chance:.44,weights:[25,39,30,6,0],slots:['suit','boots','relic']},
 sporecaster:{chance:.46,weights:[18,40,34,8,0],slots:['suit','relic','belt']},
 sentinel:{chance:.55,weights:[12,35,40,13,0],slots:['suit','belt','gloves']},
 stormling:{chance:.60,weights:[8,27,47,18,0],slots:['gloves','relic','weapon']},
 siege:{chance:.72,weights:[0,20,45,32,3],slots:['suit','belt','weapon']},
 elite:{chance:1,weights:[0,12,53,34,1]},
 guardian:{chance:1,weights:[0,0,55,42,3]},
 boss:{chance:1,weights:[0,0,42,50,8]},
 cache:{chance:1,weights:[45,40,14,1,0]},
 prototype:{chance:1,weights:[0,0,35,62,3]},
 station:{chance:1,weights:[0,30,54,16,0]},
 expedition:{chance:1,weights:[0,15,65,19,1]}
};
for(const id of ['crawler','drone','raider','sniper','turret','beast','sporecaster','sentinel','stormling','siege'])DROP_TABLES[id].chance=Number((DROP_TABLES[id].chance*.35).toFixed(3));
DROP_TABLES.elite.chance=.60;
const qualities=['common','uncommon','rare','epic','legendary'];
const traits={
 head:[['Veldconditie','hp',6],['Pantser','armor',.02],['Reserves','mana',8]],
 weapon:[['Afstemming','power',.035],['Precisie','crit',.025],['Getij','tide',.07],['Storm','storm',.07],['Zon','ember',.08]],
 suit:[['Veldconditie','hp',8],['Isolatie','heatGuard',.12],['Pantser','armor',.035]],
 relic:[['Reserves','mana',10],['Stroming','regen',1.2],['Terugkoppeling','comboCharge',.12]],
 boots:[['Tempo','speed',.045],['Ontwijking','dash',.06]],
 gloves:[['Precisie','crit',.025],['Afstemming','power',.04]],
 belt:[['Reserves','mana',10],['Veldconditie','hp',7],['Pantser','armor',.03]]
};
export function weighted(weights,rng){let x=rng()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<weights.length;i++){x-=weights[i];if(x<0)return i;}return weights.length-1;}
export function dropProfile(enemy){return ['crownbear','dunebreaker','deepwarden','towerwarden'].includes(enemy.type)?'boss':['boss','dredger','solarKnight','seedheart'].includes(enemy.type)?'boss':enemy.guardian?'guardian':enemy.elite?'elite':enemy.type;}
export function sellValue(item){return Math.max(2,Math.floor((item.price||((30+(item.level||1)*6)*(RARITIES[item.rarity]?.value||.7)))*.30)+(item.enhance||0)*5);}
export function salvageValue(item){return Math.max(1,Math.floor(sellValue(item)*.55));}
export function makeItem({rng,level=1,profile='cache',rarity=null,slot=null,baseId=null,uid}){
 const table=DROP_TABLES[profile]||DROP_TABLES.cache;
 const weights=[...table.weights];if(level>=5&&!['elite','guardian','boss','prototype'].includes(profile)){const shift=Math.min(weights[0],level*2);weights[0]-=shift;weights[2]+=shift;}
 rarity=rarity||qualities[weighted(weights,rng)];
 const quality=RARITIES[rarity];const favored=slot||(table.slots&&rng()<.75?table.slots[Math.floor(rng()*table.slots.length)]:null);
 const pool=ITEM_BASES.filter(i=>(!favored||i.slot===favored)&&(!i.minLevel||level>=i.minLevel)),base=baseId?ITEM_BASES.find(i=>i.id===baseId):pool[Math.floor(rng()*pool.length)];
 const factor=quality.factor*(1+(level-1)*.12),stats={};
 for(const [key,value]of Object.entries(base.stats))stats[key]=['waterproof','chain'].includes(key)?value:Number((value*factor).toFixed(key==='hp'||key==='mana'?0:3));
 const options=[...traits[base.slot]],affixes=[];if(['head','suit','boots','belt','relic','gloves'].includes(base.slot))options.push(['Gifwerend','poisonResist',.055],['Vuurwerend','fireResist',.055],['Bliksemwerend','stormResist',.055],['Waterwerend','waterResist',.055]);
 const count=quality.rank===0?0:quality.rank<3?1:2;
 for(let i=0;i<count;i++){const trait=options.splice(Math.floor(rng()*options.length),1)[0];if(!trait)break;affixes.push(trait[0]);stats[trait[1]]=Number(((stats[trait[1]]||0)+trait[2]*(trait[1].endsWith('Resist')?quality.factor*(1+Math.min(8,level-1)*.03):factor)*(.85+rng()*.3)).toFixed(trait[1]==='hp'||trait[1]==='mana'?0:3));}
 const price=Math.round((30+level*6)*quality.value);
 const item={id:base.id,art:base.id,...(base.appearance?{appearance:base.appearance}:{}),uid,slot:base.slot,name:base.name+(affixes.length?' · '+affixes.join(' & '):''),rarity,level,requiredLevel:Math.max(1,level-(level>=18?4:level>=15?3:2)),enhance:0,affixes,stats,price};
 if(rarity==='legendary'){item.effect=effectForSlot(base.slot);item.name=LEGENDARY_EFFECTS[item.effect].title;if(level>=5&&rng()<.55){const id=uniqueForSlot(base.slot,rng);if(id)Object.assign(item,makeUniqueItem(id,level,uid));}}
 item.text=statsText(item);return item;
}
const labels={poisonResist:'gifweerstand',fireResist:'vuurweerstand',stormResist:'bliksemweerstand',waterResist:'waterweerstand',power:'spreukschade',hp:'leven',mana:'mana',regen:'mana/sec',speed:'loopsnelheid',dash:'sneller ontwijken',crit:'kritieke kans',armor:'bescherming',tide:'getijdenschade',storm:'stormschade',ember:'zonneschade',wetTime:'seconden natduur',chain:'kettingdoel',comboCharge:'kernpulsopbouw',recovery:'leven/sec',leech:'leven per kill',waterproof:'waterbestendig',heatGuard:'hittebescherming',burnTime:'brandduur'};
const percentages=new Set(['poisonResist','fireResist','stormResist','waterResist','power','speed','dash','crit','armor','tide','storm','ember','comboCharge','heatGuard','burnTime']);
export function statsText(item){const stats=Object.entries(item.stats||{}).map(([key,value])=>key==='waterproof'?'Waterbestendig':(percentages.has(key)?'+'+Math.round(value*100)+'%': '+'+Number(value.toFixed(1)))+' '+(labels[key]||key)).join(' · ')||'Basisuitrusting';return stats+(effectText(item)?' ◆ '+effectText(item):'');}
export function normalizeItem(item){
 if(!item)return item;item.mark=['favorite','junk'].includes(item.mark)?item.mark:'';item.art=item.art||item.id;item.rarity=item.rarity==='field'?'common':item.rarity||'common';item.level=item.level||1;item.requiredLevel=item.requiredLevel||1;item.enhance=item.enhance||0;item.affixes=item.affixes||[];item.stats=item.stats||{};if(item.rarity==='legendary'&&!LEGENDARY_EFFECTS[item.effect])item.effect=effectForSlot(item.slot);return item;
}
export function normalizePlayer(p,nextId){
 p.skills=p.skills||['tide','storm','ember'];p.hotbar=p.hotbar||['tide','storm','ember',null,null,null];
 normalizeVariants(p);p.ultimateCooldown=Math.max(0,Number(p.ultimateCooldown)||0);
 p.antidotes=Number.isFinite(p.antidotes)?Math.max(0,Math.min(3,p.antidotes)):1;
 for(const key of ['healCooldown','antidoteCooldown','venomGuard','venom','venomDamage','venomTick'])p[key]=Math.max(0,Number(p[key])||0);
 p.companionProfile=['scout','guardian','mender'].includes(p.companionProfile)?p.companionProfile:'scout';if(p.companionProfile==='mender'&&!p.menderUnlocked)p.companionProfile='scout';p.effectCooldowns=p.effectCooldowns||{};
 p.velocity={x:0,y:0};p.walkBlend=0;p.moving=false;p.poseTurn=0;
 p.mainAttack=p.mainAttack||p.spell||p.discipline||'tide';if(!SPELLS[p.mainAttack]||!p.skills.includes(p.mainAttack))p.mainAttack=p.skills.includes(p.discipline)?p.discipline:'tide';p.spell=p.mainAttack;
 if(!SPELLS[p.rightAbility]||!p.skills.includes(p.rightAbility))p.rightAbility=p.mainAttack==='storm'?'ember':'storm';p.spellCd=p.spellCd||{};p.stats=p.stats||{};p.inventory=p.inventory||[];
 for(const [slot,initial]of Object.entries(START_EQUIPMENT)){if(!p.equipment[slot])p.equipment[slot]=JSON.parse(JSON.stringify(initial));normalizeItem(p.equipment[slot]);p.equipment[slot].uid=p.equipment[slot].uid||nextId();}
 p.equipment.head=p.equipment.head?normalizeItem(p.equipment.head):emptyHead();
 p.equipment.relic2=p.equipment.relic2?normalizeItem(p.equipment.relic2):emptyRelic();
 p.inventory.forEach(i=>{normalizeItem(i);i.uid=i.uid||nextId();});
}

DROP_TABLES.toxinbeetle={chance:.16,weights:[20,40,32,8,0],slots:['suit','belt','boots']};
DROP_TABLES.chemist={chance:.18,weights:[10,35,40,14,1],slots:['relic','gloves','belt']};

export function makeUniqueItem(id,level,uid){const u=UNIQUE_ITEMS[id];if(!u)return null;const f=1+(Math.min(14,level)-1)*.09,stats={};for(const [key,v]of Object.entries(u.stats))stats[key]=Number((v*(key.endsWith('Resist')?1:f)).toFixed(3));const i={id:u.art,art:u.art,uid,slot:u.slot,name:u.name,rarity:'legendary',level,requiredLevel:Math.max(1,level-(level>=18?4:level>=15?3:2)),enhance:0,affixes:['Uniek'],stats,price:340+level*10,effect:id,...(id==='duneBeacon'?{appearance:'crystal'}:id==='glassMantle'?{appearance:'filter'}:id==='horizonDiadem'?{appearance:'storm'}:{})};i.text=statsText(i);return i;}

Object.assign(DROP_TABLES,{bulwark:{chance:.14,weights:[35,40,20,5,0],slots:['suit','belt']},plaguewright:{chance:.16,weights:[20,43,29,8,0],slots:['suit','relic']},hunter:{chance:.12,weights:[35,40,20,5,0],slots:['boots','weapon']},repairer:{chance:.10,weights:[38,40,18,4,0],slots:['gloves','relic']}});
