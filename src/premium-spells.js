export const PremiumSpellRules={
 castPremium(id,spell){const s=this.state,p=s.player,stats=this.stats(),damage=spell.damage*(1+stats.power+(stats[spell.element]||0));
  if(id==='volt'){const d=p.aim;s.projectiles.push({id:++this.idCounter,team:'player',type:'volt',element:'storm',x:p.x+d.x*32,y:p.y-18+d.y*24,vx:d.x*spell.speed,vy:d.y*spell.speed/1.15,damage,radius:spell.radius,pierce:3,life:1.1,age:0,trail:[],hitIds:[]});this.emit('cast',{spell:id});return true;}
  if(id==='cryo'){const range=Math.min(480,p.aimRange||300),point={x:p.x+p.aim.x*range,y:p.y+p.aim.y*range/1.15};s.fields.push({id:++this.idCounter,type:'cryo',x:point.x,y:point.y,r:spell.radius,damage,age:0,life:1.8,pulse:0,detonated:false,echoes:0});this.emit('cast',{spell:id});return true;}
  return false;
 },
 updatePremiumField(f){const s=this.state;if(!f.detonated&&f.age>=.3){f.detonated=true;this.effect('nova',f.x,f.y,{radius:f.r,color:'#c1f1ff',element:'frost',life:.65});for(const e of s.world.enemies.filter(e=>!e.dead&&Math.hypot(e.x-f.x,(e.y-f.y)*1.15)<f.r+e.radius))this.hitEnemy(e,f.damage,'frost',true);}
  if(f.detonated&&f.echoes<2&&f.age>=.8+f.echoes*.5){f.echoes++;for(const e of s.world.enemies.filter(e=>!e.dead&&Math.hypot(e.x-f.x,(e.y-f.y)*1.15)<f.r+e.radius)){this.hitEnemy(e,f.damage*16/95,'frost',true);this.effect('impact',e.x,e.y-25,{radius:32,color:'#c1f1ff',life:.3});}}return true;
 }
};
