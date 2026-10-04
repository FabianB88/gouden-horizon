import {drawAnimatedEnemy} from './enemy-motion.js?v=34';
import {NATURE_LANDMARKS} from './nature-content.js?v=34';
export const CreatureVisuals={
 drawAnimalCompanion(u,time){const f=this.companionCrop?.[u.profile];if(!f)return false;const size=u.profile==='guardian'?92:u.profile==='mender'?65:u.spirit?84:u.early?53:65,bob=u.profile==='mender'?Math.sin(time*3+u.id)*2-14:0;
  this.ellipse(u.x,u.y+3,u.profile==='guardian'?28:18,u.profile==='guardian'?12:8,'#092c3455','#96e4d044',1);
  const spec={frames:[f.frames[0],f.frames[1],f.frames[0],f.frames[2],f.frames[0],f.frames[3]],scaleDenominator:f.bodyHeight},pose={...u,type:'companion-'+u.profile,y:u.y+bob};
  if(u.profile==='mender'){pose.motionBlend=1;pose.walkDistance=time*105;}
  if(u.spirit){this.glow(u.x,u.y-27,38,'#ffe4a1',.18);this.ellipse(u.x,u.y,27,12,null,'#ffdda188',1.5);}
  drawAnimatedEnemy(this,pose,{size},time,this.assets.companionsV82,spec);
  if(u.profile==='guardian')this.ellipse(u.x,u.y,47,31,null,'#b7da9450',1.5);
  const c=this.ctx,y=u.y-size-15;c.fillStyle='#15353c';c.fillRect(u.x-20,y,40,4);c.fillStyle='#a2e5c8';c.fillRect(u.x-20,y,40*Math.max(0,u.hp/u.maxHp),3);if(!u.persistent&&u.life<5)this.text(Math.ceil(u.life)+'s',u.x,y-11,'#d5f1d4',12);if(u.profile==='mender'&&u.healed>=24+(this.renderPlayer?.specializationTalents?.includes('support')?12:0)+(u.training?.potency||0)*4)this.text('Herstel verbruikt',u.x,y-12,'#dce8cb',12);return true;
 },
 drawCreatureGround(s){if(s.area==='lanternwood')for(const point of NATURE_LANDMARKS){if(s.natureDiscoveries?.includes(point.id))continue;this.ellipse(point.x,point.y,24,14,null,'#ffe2acaa',1.5);this.combatSprite('solar',0,point.x,point.y-22,22,0,.7);if(Math.hypot(s.player.x-point.x,s.player.y-point.y)<220)this.text(point.name,point.x,point.y-53,'#ffe4ba',14);}for(const e of s.world.enemies){if(e.dead)continue;if(e.mistStep){const u=e.mistStep.age/.55;this.ellipse(e.mistStep.x,e.mistStep.y,55,35,null,'#9eeae6aa',2);this.ellipse(e.mistStep.x,e.mistStep.y,55*u,35*u,null,'#f2ffeccc',2);this.combatSprite('water',0,e.mistStep.x,e.mistStep.y-15,36,0,.6);}if(e.type==='prismhorn'&&e.creatureElite&&!e.windup&&!e.rush&&e.wet<=0){const a=e.angle||0,r=42,c=this.ctx;c.beginPath();c.ellipse(e.x,e.y-30,r,r*.8,0,a-.85,a+.85);c.strokeStyle='#ffe3a1cc';c.lineWidth=4;c.stroke();}}
  for(const t of s.world.threats){if(t.type!=='creatureDischarge'||t.hit)continue;this.areaWarning(t.x,t.y,t.r,Math.min(1,t.age/t.arm),'storm');for(let i=0;i<4;i++){const a=i*Math.PI/2;this.combatSprite('storm',0,t.x+Math.cos(a)*t.r*.7,t.y+Math.sin(a)*t.r*.7/1.15,25,0,.55);}}
 },
 drawRitualChest(r,s){const open=r.status==='open',img=this.assets[open?'ritualOpen':'ritualClosed'],height=open?102:91;if(!img)return;this.ellipse(r.x,r.y,44,18,'#0b262650');this.sprite(img,{bounds:[0,0,img.width,img.height],anchor:[.5,.95]},r.x,r.y,height);if(r.status==='sealed'){this.glow(r.x,r.y-35,40,'#e4d89b',.17);if(Math.hypot(r.x-s.player.x,r.y-s.player.y)<310){this.text('Verbondskist · optioneel',r.x,r.y-110,'#ffe0a1',14);this.text(s.world.enemies.some(e=>!e.dead)?'Na het gevecht':'F · 3 bewakers voor één vondst',r.x,r.y+26,'#c5e3d1',12);}}else if(r.status==='active')this.text('Versla de drie bewakers',r.x,r.y-115,'#ffe0a1',14);
 },
 drawCreatureWarning(e,w,progress){
  if(['newtLob','amberRoots'].includes(w.mode)){for(const p of w.targets)this.areaWarning(p.x,p.y,70,progress,w.mode==='newtLob'?'fire':'solar');return true;}
  if(w.mode==='shellSlam'){this.areaWarning(e.x,e.y,140,progress,'metal');return true;}
  if(w.mode==='crownRing'){this.ellipse(e.x,e.y,65,65/1.15,null,'#ffdf8aaa',3);this.ellipse(e.x,e.y,65+progress*40,(65+progress*40)/1.15,null,'#ffdf8a66',2);return true;}
  if(w.mode==='crownClaw'){const c=this.ctx,a=Math.atan2(w.dir.y,w.dir.x);c.save();c.translate(e.x,e.y);c.scale(1,1/1.15);c.beginPath();c.moveTo(0,0);c.arc(0,0,155,a-1.42,a+1.42);c.closePath();c.strokeStyle='#ffe0a199';c.lineWidth=2;c.stroke();c.restore();return true;}
  if(!['antlerFan','antlerRush','mistPounce','shellRush','owlFan'].includes(w.mode))return false;const color=['mistprowler','windowl'].includes(e.type)?'#9ae8e8':'#ffe0a1',length=['antlerFan','owlFan'].includes(w.mode)?430:w.mode==='mistPounce'?205:235;if(['antlerFan','owlFan'].includes(w.mode))for(const offset of [-.24,0,.24]){const a=Math.atan2(w.dir.y,w.dir.x)+offset;this.line(e,{x:e.x+Math.cos(a)*length,y:e.y+Math.sin(a)*length/1.15},color+'66',1.5);}else this.line(e,{x:e.x+w.dir.x*length,y:e.y+w.dir.y*length/1.15},color+'99',2);return true;
 }
};
