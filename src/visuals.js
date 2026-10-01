import {SPELLS,AREA_BY_ID,RARITIES} from './data.js?v=6';
const centered=source=>({...source,anchor:[.5,.5]});
const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
export const ExpeditionVisuals={
 drawTravel(portal,s){
  const locked=!s.visited.includes(portal.to)&&s.cores.filter(c=>c<3).length<(AREA_BY_ID[portal.to].unlockCore||0);
  const kind=AREA_BY_ID[portal.to].zone===2?'grove':AREA_BY_ID[portal.to].zone===1?'industrial':AREA_BY_ID[portal.to].zone===0?'maritime':'brass';
  this.ellipse(portal.x,portal.y+3,44,16,'#16353155');
  this.sprite(this.assets.travel,this.expedition.travel[kind],portal.x,portal.y,130,false,0,locked?.48:1);
  if(distance(s.player,portal)<235){
   const label=AREA_BY_ID[s.area].kind==='hub'?'TERUG NAAR HANDELSKAMP':AREA_BY_ID[portal.to].name;
   this.text(label,portal.x,portal.y-143,locked?'#c9ccb9':'#f7e4ae',13);
   this.text(locked?'GEBLOKKEERD · VOLGENDE KERN':'F · REIZEN',portal.x,portal.y+26,locked?'#d3b19a':'#d9ead5',11);
  }
 },
 drawCampFloor(camp,s){
  this.ellipse(camp.x,camp.y,camp.radius,camp.radius/1.15,null,'#dbc69155',1.4);
  if(distance(s.player,camp)<camp.radius+100)this.text('VEILIGE HANDELSPOST',camp.x,camp.y+camp.radius/1.15+18,'#f1ddb0',12);
 },
 drawMerchant(camp,s){
  const m=camp.merchant;this.ellipse(m.x,m.y,75,25,'#102a3655');
  this.sprite(this.assets.travel,this.expedition.travel.merchant,m.x,m.y,154);
  if(distance(s.player,m)<200)this.text(camp.name,m.x,m.y-164,'#f2dda5',14);
 },
 drawItemDrop(loot,time){
  const item=loot.item,color=RARITIES[item.rarity].color;
  this.ellipse(loot.x,loot.y,22,10,color+'33',color+'c0',1.4);this.glow(loot.x,loot.y-15,42,color,.35);
  const image=this.assets['item-'+(item.art||item.id)];
  this.sprite(image,{bounds:[0,0,256,256],anchor:[.5,.90]},loot.x,loot.y+Math.sin(time*2)*2,54);
  if(item.rarity==='legendary'||item.rarity==='epic')this.line({x:loot.x,y:loot.y-5},{x:loot.x,y:loot.y-77},color+'85',2);
 },
 drawAreaField(f){
  const c=this.ctx,spell=SPELLS[f.type],fade=Math.min(1,f.life*2,f.age*4+.25);
  this.ellipse(f.x,f.y,f.r,f.r*.67,spell.color+'12',spell.color+'70',1.5);
  c.save();c.globalAlpha=fade*.78;
  const pulse=1+Math.sin(f.age*5)*.055;
  this.sprite(this.assets.abilities,centered(this.expedition.abilities[f.type]),f.x,f.y-28,f.r*1.45*pulse,false,0,fade*.78);
  c.restore();
 },
 drawExpeditionEffect(e){
  const c=this.ctx,total=e.age+e.life,progress=e.age/total;
  if(e.type==='ultimate-charge'){
   const r=140*(1-progress)+40;
   this.glow(e.x,e.y-65,230,'#f5d582',.28+progress*.38);
   for(const [i,color]of ['#73e2e5','#ceb2ff','#ffbc66'].entries()){
    const a=this.time*5+i*Math.PI*2/3;this.glow(e.x+Math.cos(a)*r,e.y-70+Math.sin(a)*r*.45,30,color,.7);
   }
   this.sprite(this.assets.abilities,centered(this.expedition.abilities.ultimate),e.x,e.y-100,100+progress*95,false,progress*.25);
   return true;
  }
  if(e.type==='ultimate-wave'){
   const r=90+e.radius*Math.min(1,progress*1.8),alpha=Math.max(0,1-progress);
   this.sprite(this.assets.abilities,centered(this.expedition.abilities['ult-impact']),e.x,e.y-8,r*1.7,false,0,alpha);
   this.ellipse(e.x,e.y,r,r*.66,null,'#ffe5a8'+Math.round(alpha*200).toString(16).padStart(2,'0'),5*(1-progress)+1);
   this.ellipse(e.x,e.y,r*.82,r*.54,null,'#9fe9e2'+Math.round(alpha*160).toString(16).padStart(2,'0'),3);
   if(progress<.25)this.sprite(this.assets.abilities,centered(this.expedition.abilities.ultimate),e.x,e.y-100,130,false,0,1-progress*4);
   return true;
  }
  if(['field-open','field-pulse','orbital-strike'].includes(e.type)){
   const source=this.expedition.abilities[e.ability];
   this.sprite(this.assets.abilities,centered(source),e.x,e.y-22,e.radius*(1+progress*.5),false,0,1-progress);
   if(e.type==='orbital-strike')for(let i=0;i<3;i++){const x=e.x+(i-1)*70;this.line({x,y:e.y-240*(1-progress)},{x,y:e.y},'#ffe0a5'+Math.round((1-progress)*190).toString(16).padStart(2,'0'),9*(1-progress)+1);}
   return true;
  }
  return false;
 }
};
