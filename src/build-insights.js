import {spellProfile} from './spell-variants.js?v=45';
import {resistance,RESISTANCES} from './resistances.js?v=45';

// Replace one slot, rather than treating a relic as the sum of both slots.
export function projectedStats(stats,item,current){
 const out={...stats};
 for(const [key,val]of Object.entries(current?.stats||{}))out[key]=(out[key]||0)-val;
 for(const [key,val]of Object.entries(item?.stats||{}))out[key]=(out[key]||0)+val;
 out.maxHp=100+(out.hp||0);out.maxMana=110+(out.mana||0);out.moveSpeed=215*(1+(out.speed||0));out.manaRegen=13+(out.regen||0);out.dashTime=Math.max(.9,2.5*(1-Math.min(.65,out.dash||0)));
 return out;
}
export function spellDamage(p,stats,id){const s=spellProfile(p,id);if(!s||id==='summon')return null;const element=s.area||id==='volt'||id==='cryo'?s.element:id;return s.damage*(1+(stats.power||0)+(stats[element]||0));}
const roles={tide:'Snelle waaier · maakt doelen nat',storm:'Directe straal · sterker op natte doelen',ember:'Worp · explosie en brandveld',frost:'Doorborende rij · vertraagt en bevriest',gale:'Boemerang · heen- en terugtreffer',gravity:'Trekt een groep samen · eindexplosie',glacier:'Smalle barrière · schade per puls',cyclone:'Bewegende wervel · trekt vijanden mee',tempest:'Gerichte salvo’s · maximaal drie doelen',orbital:'Drie aangekondigde kraters',prism:'Groepsaanval · drie sprongen, 88% per sprong',volt:'Zware lans · door drie doelen',cryo:'Bevriezende explosie · twee naschokken',summon:'Dierengenoten · eigen leven en aanvallen'};
export function spellInsight(p,stats,id){const s=spellProfile(p,id);if(!s)return '';const damage=spellDamage(p,stats,id),v=s.variant||{};let role=roles[id]||s.description;
 if(v.id){const choices={surf:'Brede waaier · vijf waterbogen',lance:'Smalle lans · door vier doelen',fork:'Drie zwakkere bliksemstralen',needle:'Smalle bliksemstraal · door twee doelen',flash:'Snelle explosie · zonder brandveld',cluster:'Drie kleine explosies',shards:'Drie ijssplinters · één doel per splinter',longshot:'Smalle ijsnaald · groter bereik',recurve:'Korte boemerang · snel terug',wide:'Brede boemerang · later terug',anchor:'Stilstaande kern · trekt en implodeert',vortex:'Trage kern · groter trekgebied',corridor:'Lange smalle ijsstrook',gate:'Korte brede ijsstrook',runner:'Snelle smalle wervel',line:'Drie kraters langs je richtlijn'};role=choices[v.id]||role;}
 if(id==='prism'&&v.id==='relay')role='Groepsaanval · vijf sprongen, 85% per sprong';
 if(id==='prism'&&v.id==='harpoon')role='Zware lans voor één doel · geen sprongen';
 if(id==='tempest'&&v.targets)role='Gerichte salvo’s · maximaal '+v.targets+' '+(v.targets===1?'doel':'doelen');
 if(id==='orbital'&&v.strikes===1)role='Eén grote aangekondigde krater';
 if(id==='cyclone'&&v.fieldSpeed===0)role='Stilstaande wervel · trekt vijanden samen';
 const unit=['glacier','cyclone','tempest'].includes(id)?'per puls':id==='orbital'?'per krater':id==='cryo'?'eerste explosie':id==='gravity'?'eindexplosie':'eerste treffer';
 return `<span class="spell-role">${role}</span>${damage===null?'':`<span class="spell-damage">${Math.round(damage)} schade · ${unit}</span>`}`;
}
export function buildDeltas(p,stats,item,current){const next=projectedStats(stats,item,current),rows=[],add=(name,a,b,format=n=>String(Math.round(n)))=>{if(Math.abs(a-b)>.001)rows.push({name,before:format(a),after:format(b)});};
 add('Maximaal leven',stats.maxHp,next.maxHp);add('Maximale mana',stats.maxMana,next.maxMana);
 const id=p.mainAttack||'tide',a=spellDamage(p,stats,id),b=spellDamage(p,next,id);if(a!==null)add('Hoofdaanval · basisschade',a,b);
 add('Loopsnelheid · basis 100%',stats.moveSpeed,next.moveSpeed,n=>Math.round(n/215*100)+'%');add('Manaherstel',stats.manaRegen,next.manaRegen,n=>Number(n.toFixed(1))+' /s');add('Ontwijkherstel',stats.dashTime,next.dashTime,n=>Number(n.toFixed(2))+'s');
 add('Gif · volledige infectie',50*(1-resistance(stats,'poisonResist')),50*(1-resistance(next,'poisonResist')),n=>Number(n.toFixed(1))+'% leven');
 for(const [key,info]of Object.entries(RESISTANCES))if(key!=='poisonResist')add(info.name,resistance(stats,key)*100,resistance(next,key)*100,n=>Math.round(n)+'%');
 add('Kritieke kans',stats.crit,next.crit,n=>Math.round(n*100)+'%');add('Bescherming',Math.min(.55,stats.armor),Math.min(.55,next.armor),n=>Math.round(n*100)+'%');
 return rows;
}
export function buildComparison(p,stats,item,current){const rows=buildDeltas(p,stats,item,current);return rows.length?`<div class="build-impact"><strong>Gevolg voor je build</strong><dl>${rows.map(r=>`<div><dt>${r.name}</dt><dd>${r.before}<span aria-hidden="true"> → </span><b>${r.after}</b></dd></div>`).join('')}</dl><small>Schade vóór kritieke treffers, combo’s, bijzondere itemeffecten en vijandbescherming. Gif: één volledige infectie over 8 seconden. Weerstand telt tot 60%.</small></div>`:'';}
