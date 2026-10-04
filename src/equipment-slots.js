import {SLOT_NAMES} from './data.js?v=36';

// Item categories stay unchanged: both relic sockets accept the same loot.
export const EQUIPMENT_SLOT_NAMES={...SLOT_NAMES,relic:'Relikwie I',relic2:'Relikwie II'};
export const emptyHead=()=>({id:'field-cap',art:'field-cap',uid:-2,slot:'head',name:'Vrij hoofdslot',empty:true,rarity:'common',level:1,requiredLevel:1,enhance:0,mark:'',affixes:[],stats:{},price:0});
export const emptyRelic=()=>({id:'field-compass',art:'field-compass',uid:-1,slot:'relic',name:'Vrij relikwieslot',empty:true,rarity:'common',level:1,requiredLevel:1,enhance:0,mark:'',affixes:[],stats:{},price:0});
export const itemFitsSlot=(item,slot)=>Boolean(item&&Object.hasOwn(EQUIPMENT_SLOT_NAMES,slot)&&item.slot===(slot==='relic2'?'relic':slot));
export const comparisonSlot=(p,item)=>item.slot==='relic'&&p.equipment.relic2?.empty?'relic2':item.slot;
