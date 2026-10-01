import {SLOT_NAMES,RARITIES} from './data.js?v=6';
import {sellValue,statsText} from './loot.js?v=6';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const art=i=>'<img class="painted-item" src="assets/items/'+(i.art||i.id)+'.webp" alt="" draggable="false">';
export function shopBody(engine,tab,selected){
 const p=engine.state.player,w=engine.state.world,items=tab==='buy'?w.shop.stock:tab==='sell'?p.inventory:Object.entries(p.equipment).map(([slot,i])=>({...i,equippedSlot:slot}));
 let html='<div class="shop-intro"><img src="assets/expedition/merchant.webp" alt="Handelaar"><div><strong>'+p.scrap+' SCHROOT</strong><p>Koop voor je volgende expeditie, verkoop vondsten of versterk je gedragen uitrusting tot +3.</p><small>Voorraad blijft bewaard. Uitgeruste items verkoop je pas nadat je ze hebt gewisseld.</small></div></div>';
 html+='<div class="shop-tabs">'+[['buy','Kopen'],['sell','Verkopen'],['forge','Versterken']].map(([id,label])=>'<button data-shop-tab="'+id+'" class="'+(tab===id?'selected':'')+'">'+label+'</button>').join('')+'</div>';
 html+='<div class="shop-grid">'+items.map(item=>'<button class="shop-item '+(item.uid===selected?.uid?'selected':'')+'" data-shop-item="'+item.uid+'" data-rarity="'+item.rarity+'"><span>'+art(item)+'</span><div><small>'+RARITIES[item.rarity].name+' · NIV. '+(item.level||1)+' · '+SLOT_NAMES[item.slot]+'</small><strong>'+escape(item.name)+(item.enhance?' +'+item.enhance:'')+'</strong>'+((item.requiredLevel||1)>p.level?'<small class="level-requirement">Vereist spelersniveau '+item.requiredLevel+'</small>':'')+'<p>'+escape(statsText(item))+'</p><b>'+ (tab==='buy'?item.price+' schroot':tab==='sell'?'Verkoop: '+sellValue(item)+' schroot':item.enhance>=3?'MAX. VERSTERKT':engine.forgeCost(item)+' schroot → +'+((item.enhance||0)+1))+'</b></div></button>').join('')+'</div>';
 if(!items.length)html+='<p class="empty-bag">'+(tab==='buy'?'Voorraad uitverkocht. De volgende handelspost heeft nieuwe spullen.':'Je rugzak is leeg.')+'</p>';
 return html;
}
