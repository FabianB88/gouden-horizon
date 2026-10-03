import {AREA_BY_ID,ENEMIES,WORLD} from './data.js?v=27';
// Chapter level is the floor. Overlevelling cannot turn repeat fights into
// trivial farms, but enemy HP is frozen at encounter creation.
export function tuneV8Enemy(e,area){
 if(!area.extension||area.safe)return e;
 const base=ENEMIES[e.type],stage=area.stage||0;
 e.level=Math.max(area.itemLevel,Math.min(area.itemLevel+2,e.level||1));
 const growth=1+stage*.085,fraction=e.maxHp?e.hp/e.maxHp:1;
 e.maxHp=Math.round(base.hp*(base.boss?2.9:4.5)*growth*(e.elite?1.5:1));e.hp=e.dead?0:e.maxHp*fraction;
 e.damageMultiplier=(1.95+stage*.13)*(e.elite?1.12:1);
 e.speedMultiplier=1.1+stage*.01;e.cooldownMultiplier=1/(1.2+stage*.04);
 e.balanceVersion=8;return e;
}
export const V8ExpeditionRules={
 createV8World(w,area){
  w.sideRound=1;w.sideDone=false;w.coreCollected=true;w.relays=[];w.archive=null;w.hazards=[];
  w.gate={x:area.exit[0]*WORLD.width,y:area.exit[1]*WORLD.height,open:false,eliteSpawned:false};
  if(area.bossArena){w.enemies=[this.placeSummon(this.makeEnemy(area.guardian,1050,620,false,false))];w.sideRound=2;}
  else this.spawnExpeditionWave(w,area);
 },
 completeV8Arena(){
  const s=this.state,a=AREA_BY_ID[s.area],w=s.world;if(!a.extension||a.safe||w.sideDone||w.enemies.some(e=>!e.dead))return false;
  if(w.sideRound<2){w.sideRound=2;this.spawnExpeditionWave(w,a);this.notice('Tweede groep · houd ruimte voor elementaanvallen');return true;}
  w.sideDone=true;w.gate.open=true;w.gate.eliteSpawned=true;s.player.scrap+=a.reward;
  if(!a.bossArena)w.loot.push({id:++this.idCounter,x:w.gate.x-90,y:w.gate.y+70,type:'loot',profile:'expedition',expeditionReward:true});
  if(a.id==='tower'){w.coreCollected=false;this.notice('Torenwachter verslagen · verbind de thermische regelaar bij de terugpoort','#ffe3a4');}
  else this.notice(a.name+' vrij · +'+a.reward+' schroot · terugpoort geopend','#ffe3a4');
  this.emit('relaydone');return true;
 }
};
