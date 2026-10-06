import {sideDistrictPoint,EXTRA_DISTRICT_PLACEMENTS} from './district-content.js?v=44';
import {cityExtensionPoint} from './city-extension.js?v=44';
import {UNIQUE_ITEMS} from './unique-items.js?v=44';
import {AREA_BY_ID} from './data.js?v=44';
import {makeItem,makeUniqueItem} from './loot.js?v=44';
import {spaciousPoint} from './hub-space.js?v=44';
export const CITY_NPCS=[
 {id:'ilya',name:'Ilya · Levenshoeder',title:'Het levende verbond',x:1560,y:540,art:0},
 {id:'milo',name:'Milo · Cartograaf',title:'Kaarten van Vrijhaven',x:350,y:290,art:1},
 {id:'sera',name:'Sera · Expeditiekapitein',title:'Het Sporencontract',x:1160,y:830,art:2}
];
export const CITY_LANDMARKS=[{id:'garden',name:'Daktuin',x:500,y:285},{id:'harbor',name:'Watermeter',x:150,y:685},{id:'workshop',name:'Werkplaatsarchief',x:1250,y:540}];
export const CONTRACT_NPCS={forest:{id:'contract-spore',name:'Sera · Baascontracten',title:'Sporenbassin · herhaalbare baas',x:740,y:605,art:2,bounty:'bounty-spore'},skybridge:{id:'contract-solar',name:'Sera · Baascontracten',title:'Zonneoven · herhaalbare baas',x:895,y:610,art:2,bounty:'bounty-solar'}};
Object.assign(CONTRACT_NPCS.forest,{x:1217.5,y:687.5});
Object.assign(CONTRACT_NPCS.skybridge,{x:1162.5,y:837.5});
Object.assign(CITY_NPCS.find(n=>n.id==='milo'),{x:300,y:150});
Object.assign(CITY_NPCS.find(n=>n.id==='sera'),{x:1280,y:920});
for(const point of [...CITY_NPCS,...CITY_LANDMARKS])Object.assign(point,spaciousPoint(point,'highway'));
for(const [id,point]of Object.entries({milo:[180*1.75,210*1.75],ilya:cityExtensionPoint([1330,440]),sera:cityExtensionPoint([970,800])})){const npc=CITY_NPCS.find(n=>n.id===id);[npc.x,npc.y]=point;}
for(const [id,point]of Object.entries({garden:[400,228],harbor:[220,573],workshop:[970,500]})){const landmark=CITY_LANDMARKS.find(n=>n.id===id);[landmark.x,landmark.y]=point.map(v=>v*1.75);}
for(const id of Object.keys(CONTRACT_NPCS))CONTRACT_NPCS[id]=spaciousPoint(CONTRACT_NPCS[id],id);
for(const id of ['milo','ilya']){const npc=CITY_NPCS.find(n=>n.id===id);[npc.x,npc.y]=sideDistrictPoint('highway',EXTRA_DISTRICT_PLACEMENTS.highway[id]);}
for(const landmark of CITY_LANDMARKS)[landmark.x,landmark.y]=sideDistrictPoint('highway',EXTRA_DISTRICT_PLACEMENTS.highway[landmark.id]);
for(const [id,npc]of Object.entries(CONTRACT_NPCS))[npc.x,npc.y]=sideDistrictPoint(id,EXTRA_DISTRICT_PLACEMENTS[id].contract);
const near=(a,b,r=110)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15)<r;
export const CityRules={
 cityNPCs(){return this.state.area==='highway'?CITY_NPCS:CONTRACT_NPCS[this.state.area]?[CONTRACT_NPCS[this.state.area]]:[];},
 cityQuest(id){return this.state.quests?.[id];},
 acceptCityQuest(id){if(!CITY_NPCS.some(n=>n.id===id)||!this.cityNPCs().some(n=>n.id===id&&near(n,this.state.player))||this.cityQuest(id))return false;this.state.quests||={};this.state.quests[id]={status:'active',seen:[]};this.checkpoint();return true;},
 updateCityQuests(){const s=this.state,q=s.quests;s.bountyIntroduced||=[];const npc=CONTRACT_NPCS[s.area];if(npc&&this.isUnlocked(npc.bounty)&&!s.bountyIntroduced.includes(npc.bounty)){s.bountyIntroduced.push(npc.bounty);this.emit('contractunlocked',{id:npc.bounty});}if(!q)return;
  if(s.area==='highway'&&q.milo?.status==='active'){for(const l of CITY_LANDMARKS)if(near(s.player,l,85)&&!q.milo.seen.includes(l.id)){q.milo.seen.push(l.id);this.notice('Kaart bijgewerkt · '+l.name+' · '+q.milo.seen.length+'/3');this.emit('questcomplete');}if(q.milo.seen.length===3)q.milo.status='ready';}
  if(q.ilya?.status==='active'&&s.area==='workshop-v6'&&s.world.sideDone&&!s.world.loot.some(l=>l.quest==='ilya')){s.world.loot.push({id:++this.idCounter,x:1400,y:410,type:'quest',quest:'ilya'});this.notice('Verbondsarchief gevonden · berg het met F');}
  if(q.sera?.status==='active'&&(s.bountyVictories?.['bounty-spore']||0)>0)q.sera.status='ready';
 },
 collectCityRecovery(l){const q=this.cityQuest(l.quest);if(l.quest!=='ilya'||q?.status!=='active'||!this.state.world.loot.some(i=>i.id===l.id))return false;q.status='ready';this.state.world.loot=this.state.world.loot.filter(i=>i.id!==l.id);this.notice('Protocol geborgen · breng het naar Ilya in de Oostwijk');return true;},
 claimCityQuest(id){const q=this.cityQuest(id),p=this.state.player;if(q?.status!=='ready'||!this.cityNPCs().some(n=>n.id===id&&near(n,p))||id==='ilya'&&p.inventory.length>=48)return false;
  q.status='completed';p.scrap+=id==='milo'?100:id==='ilya'?75:150;
  if(id==='ilya'){p.menderUnlocked=true;const item=makeItem({rng:this.rng,level:Math.max(5,Math.min(8,p.level)),rarity:'rare',slot:'gloves',uid:++this.idCounter});p.inventory.push(item);this.emit('discovery',{item,collected:true});}
  if(id==='sera')p.uniqueBlueprints=true;this.notice(id==='ilya'?'Lichtmot en zeldzame handschoenen vrijgespeeld':id==='sera'?'Unieke recepten beschikbaar bij Inez · +150 schroot':'Drie wijken in kaart · +100 schroot');this.emit('questcomplete');this.checkpoint();return true;
 },
 buyUniqueRecipe(id){if(UNIQUE_ITEMS[id]?.chase)return false;const p=this.state.player;if(!this.canTrade()||this.service()!=='workshop'||!p.uniqueBlueprints||p.level<8||p.inventory.length>=48||p.scrap<1200||(p.uniquePurchased||[]).includes(id))return false;const item=makeUniqueItem(id,Math.max(8,Math.min(14,p.level)),++this.idCounter);if(!item)return false;p.scrap-=1200;p.uniquePurchased||=[];p.uniquePurchased.push(id);p.inventory.push(item);this.emit('purchase',{name:item.name,cost:1200,item,detail:'Gebouwd · in je rugzak'});this.emit('discovery',{item,collected:true});this.emit('trade');this.checkpoint();return true;}
};
export const CITY_DIALOGUES={
 milo:{title:'Kaarten van Vrijhaven',intro:'Onze oude routekaarten kloppen niet meer. Bekijk de watermeter, de daktuin en het werkplaatsarchief hier in de Oostwijk. Dan hebben reizigers eindelijk een betrouwbare kaart.',active:'Bezoek de drie gemarkeerde plekken. Je tekent ze automatisch in wanneer je dichtbij komt.',ready:'Alle drie verbonden. Nu kunnen mensen door Vrijhaven reizen zonder weer op een doodlopend pad uit te komen.',reward:'100 schroot · drie ontdekkingen in de stad'},
 ilya:{title:'Het levende verbond',intro:'In de afgesloten werkplaats ligt een oud verbondsarchief. De bewakingsmachines zijn nog actief. Versla beide groepen en breng het protocol terug; dan leer ik je een lichtmot op te roepen.',active:'De Afgesloten Werkplaats ligt hier in de Oostwijk. Versla de bewakers en berg het protocol met F.',ready:'Dat is het protocol. Met dit verbond kun je een lichtmot oproepen. Haar licht heelt je wonden. Ze is kwetsbaar, dus houd haar uit de vuurlinie.',reward:'75 schroot · zeldzame handschoenen · lichtmot'},
 sera:{title:'Het Sporencontract',intro:'De Sporenregent bewaakt een bassin langs de Groene Corridor. Bereik die handelspost en versla hem via het baascontract. Je kiest daar zelf schroot of uitrusting. Dan geef ik je toegang tot onze unieke recepten.',active:'Sera’s contractbord staat in de Wilde Serre, de extra wijk van de Groene Corridor. Bereikbaar vanaf hoofdstuk 9. Een overwinning telt ook als je de baas eerder al verslagen hebt.',ready:'De route ligt vrij. Inez mag je nu onderdelen uit onze bijzondere voorraad bouwen. Spaar ervoor: elk recept kost 1200 schroot.',reward:'150 schroot · toegang tot acht unieke recepten bij Inez'}
};
