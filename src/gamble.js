import {makeItem,weighted} from './loot.js?v=37';
import {START_EQUIPMENT} from './data.js?v=37';
export const GAMBLE_WEIGHTS=[40,36,18,5,1];
export const GambleRules={
 gambleCost(){return 40+10*this.state.player.level;},
 gambleLoot(slot){
  const p=this.state.player;if(!this.canTrade()||this.currentService()?.id!=='outfitter'||(!Object.hasOwn(START_EQUIPMENT,slot)&&slot!=='head')||p.scrap<this.gambleCost()||p.inventory.length>=48)return false;
  const cost=this.gambleCost(),rarity=['common','uncommon','rare','epic','legendary'][weighted(GAMBLE_WEIGHTS,this.rng)];
  const item=makeItem({rng:this.rng,slot,rarity,level:Math.max(1,p.level-1),uid:++this.idCounter});p.scrap-=cost;p.inventory.push(item);this.state.world.shop.lastRoll=item;this.emit('purchase',{name:item.name,cost,item,detail:'Uit de loting · in je rugzak'});
  this.emit('discovery',{item,collected:true});this.emit('trade');this.checkpoint();return item.uid;
 }
};
