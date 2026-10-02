import {AREA_BY_ID} from './data.js?v=19';
import {makeItem,makeUniqueItem} from './loot.js?v=19';
export const CITY_NPCS=[
 {id:'ilya',name:'Ilya · Constructiebouwer',title:'Een tweede paar handen',x:1560,y:540,art:0},
 {id:'milo',name:'Milo · Cartograaf',title:'Kaarten van Vrijhaven',x:350,y:290,art:1},
 {id:'sera',name:'Sera · Expeditiekapitein',title:'Het Sporencontract',x:1160,y:830,art:2}
];
export const CITY_LANDMARKS=[{id:'garden',name:'Daktuin',x:500,y:285},{id:'harbor',name:'Watermeter',x:150,y:685},{id:'workshop',name:'Werkplaatsarchief',x:1250,y:540}];
export const CONTRACT_NPCS={forest:{id:'contract-spore',name:'Sera · Baascontracten',title:'Sporenbassin · herhaalbare baas',x:740,y:605,art:2,bounty:'bounty-spore'},skybridge:{id:'contract-solar',name:'Sera · Baascontracten',title:'Zonneoven · herhaalbare baas',x:895,y:610,art:2,bounty:'bounty-solar'}};
const near=(a,b,r=110)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15)<r;
export const CityRules={
 cityNPCs(){return this.state.area==='highway'?CITY_NPCS:CONTRACT_NPCS[this.state.area]?[CONTRACT_NPCS[this.state.area]]:[];},
 cityQuest(id){return this.state.quests?.[id];},
 acceptCityQuest(id){if(!CITY_NPCS.some(n=>n.id===id)||!this.cityNPCs().some(n=>n.id===id&&near(n,this.state.player))||this.cityQuest(id))return false;this.state.quests||={};this.state.quests[id]={status:'active',seen:[]};this.checkpoint();return true;},
 updateCityQuests(){const s=this.state,q=s.quests;s.bountyIntroduced||=[];const npc=CONTRACT_NPCS[s.area];if(npc&&this.isUnlocked(npc.bounty)&&!s.bountyIntroduced.includes(npc.bounty)){s.bountyIntroduced.push(npc.bounty);this.emit('contractunlocked',{id:npc.bounty});}if(!q)return;
  if(s.area==='highway'&&q.milo?.status==='active'){for(const l of CITY_LANDMARKS)if(near(s.player,l,85)&&!q.milo.seen.includes(l.id)){q.milo.seen.push(l.id);this.notice('Kaart bijgewerkt · '+l.name+' · '+q.milo.seen.length+'/3');this.emit('questcomplete');}if(q.milo.seen.length===3)q.milo.status='ready';}
  if(q.ilya?.status==='active'&&s.area==='workshop-v6'&&s.world.sideDone&&!s.world.loot.some(l=>l.quest==='ilya')){s.world.loot.push({id:++this.idCounter,x:1400,y:410,type:'quest',quest:'ilya'});this.notice('Constructieprotocol gevonden · berg het met F');}
  if(q.sera?.status==='active'&&(s.bountyVictories?.['bounty-spore']||0)>0)q.sera.status='ready';
 },
 collectCityRecovery(l){const q=this.cityQuest(l.quest);if(l.quest!=='ilya'||q?.status!=='active'||!this.state.world.loot.some(i=>i.id===l.id))return false;q.status='ready';this.state.world.loot=this.state.world.loot.filter(i=>i.id!==l.id);this.notice('Protocol geborgen · breng het naar Ilya in Vrijhaven');return true;},
 claimCityQuest(id){const q=this.cityQuest(id),p=this.state.player;if(q?.status!=='ready'||!this.cityNPCs().some(n=>n.id===id&&near(n,p))||id==='ilya'&&p.inventory.length>=48)return false;
  q.status='completed';p.scrap+=id==='milo'?100:id==='ilya'?75:150;
  if(id==='ilya'){p.menderUnlocked=true;const item=makeItem({rng:this.rng,level:Math.max(5,Math.min(8,p.level)),rarity:'rare',slot:'gloves',uid:++this.idCounter});p.inventory.push(item);this.emit('discovery',{item,collected:true});}
  if(id==='sera')p.uniqueBlueprints=true;this.notice(id==='ilya'?'Hersteldrone-afstelling en zeldzame handschoenen vrijgespeeld':id==='sera'?'Unieke recepten beschikbaar bij Inez · +150 schroot':'Drie wijken in kaart · +100 schroot');this.emit('questcomplete');this.checkpoint();return true;
 },
 buyUniqueRecipe(id){const p=this.state.player;if(!this.canTrade()||this.service()!=='workshop'||!p.uniqueBlueprints||p.level<8||p.inventory.length>=48||p.scrap<1200||(p.uniquePurchased||[]).includes(id))return false;const item=makeUniqueItem(id,Math.max(8,Math.min(14,p.level)),++this.idCounter);if(!item)return false;p.scrap-=1200;p.uniquePurchased||=[];p.uniquePurchased.push(id);p.inventory.push(item);this.emit('discovery',{item,collected:true});this.emit('trade');this.checkpoint();return true;}
};
export const CITY_DIALOGUES={
 milo:{title:'Kaarten van Vrijhaven',intro:'Onze oude routekaarten kloppen niet meer. Bekijk de watermeter aan de kade, de daktuin en het archief bij de werkplaats. Dan hebben reizigers eindelijk een betrouwbare kaart.',active:'Bezoek de drie gemarkeerde plekken. Je tekent ze automatisch in wanneer je dichtbij komt.',ready:'Alle drie verbonden. Nu kunnen mensen door Vrijhaven reizen zonder weer op een doodlopend pad uit te komen.',reward:'100 schroot · drie ontdekkingen in de stad'},
 ilya:{title:'Een tweede paar handen',intro:'In de afgesloten werkplaats ligt een oud constructieprotocol. De bewakingsmachines zijn nog actief. Versla beide groepen en breng het protocol terug; dan bouw ik een hersteldrone-afstelling voor je.',active:'De Afgesloten Werkplaats ligt bij de oostelijke ingang. Versla de bewakers en berg het protocol met F.',ready:'Dat is het protocol. Je constructie kan nu ook voorzichtig wonden behandelen. Hij is kwetsbaar, dus houd hem uit de vuurlinie.',reward:'75 schroot · zeldzame handschoenen · hersteldrone-afstelling'},
 sera:{title:'Het Sporencontract',intro:'De Sporenregent bewaakt een bassin langs de Groene Corridor. Bereik die handelspost en versla hem via het baascontract. Je kiest daar zelf schroot of uitrusting. Dan geef ik je toegang tot onze unieke recepten.',active:'Sera’s contractbord staat in de Groene Corridor. Bereikbaar vanaf hoofdstuk 9. Een overwinning telt ook als je de baas eerder al verslagen hebt.',ready:'De route ligt vrij. Inez mag je nu onderdelen uit onze bijzondere voorraad bouwen. Spaar ervoor: elk recept kost 1200 schroot.',reward:'150 schroot · toegang tot acht unieke recepten bij Inez'}
};
