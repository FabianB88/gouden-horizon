import {OutdoorVisuals} from './outdoor-visuals.js?v=32';
import {OUTDOOR_REGIONS,outdoorPoint} from './outdoor-content.js?v=32';
import {CITY_JOIN} from './city-extension.js?v=32';
import {FeedbackVisuals} from './combat-feedback.js?v=32';
import {effectParticles,trailStep} from './frame-performance.js?v=32';
import {QuarterVisuals} from './safe-exploration.js?v=32';
import {QUARTER_POINTS} from './safe-exploration-content.js?v=32';
import {CreatureVisuals} from './creature-visuals.js?v=32';
import {drawRiggedHero} from './hero-rig.js?v=32';
import {equipmentAppearance} from './appearance.js?v=32';
import {V6Visuals} from './v6-visuals.js?v=32';
import {UNIQUE_ITEMS} from './unique-items.js?v=32';
import {worldBounds,QUAY_GATE,WORLD,ZONES,AREAS,AREA_BY_ID,SPELLS,ENEMIES,POSITIONS,START_EQUIPMENT} from './data.js?v=32';
import {clamp,distance} from './engine.js?v=32';
import {ITEM_BASES} from './loot.js?v=32';
import {ExpeditionVisuals} from './visuals.js?v=32';
import {drawAnimatedEnemy} from './enemy-motion.js?v=32';
import {drawWalkingHero,drawDirectionalHero,heroFocus} from './hero-animation.js?v=32';
import {EnemyCombatVisuals,enemyAttackMotion} from './enemy-combat.js?v=32';
import {QuestVisuals,NORA} from './quests.js?v=32';
import {arenaObstacles} from './arena-layouts.js?v=32';
import {EnemyAreaVisuals} from './enemy-area-visuals.js?v=32';
import {prepareHeroRig} from './hero-rig.js?v=32';
import {RenderCache,renderRatio,surface,freezeSurface} from './render-cache.js?v=32';
const TAU=Math.PI*2;
export class Renderer {
  constructor(canvas,minimap){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.minimap=minimap;this.mctx=minimap.getContext('2d');this.assets={};this.camera={x:0,y:0};this.shake=0;this.flash=0;this.ready=false;this.crop=null;this.time=0;this.quality=1;this.cache=new RenderCache();}
  async load(){
    const files={...Object.fromEntries(AREAS.map(z=>[z.id,'assets/painted/'+z.file])),items:'assets/items/item-atlas.webp',travel:'assets/expedition/travel-camp-atlas.webp',mineArt:'assets/expedition/magnet-mine.webp',combatEffects:'assets/expedition/combat-effects-v551.webp',nora:'assets/expedition/nora-v551.webp',enemyAnimation:'assets/expedition/enemy-animation-v55.webp',rolesV54:'assets/expedition/enemy-v54.webp',bossesV54:'assets/expedition/boss-v54.webp',newEnemies:'assets/expedition/enemy-v52.webp',extraEnemies:'assets/expedition/enemy-atlas.webp',abilities:'assets/expedition/ability-atlas.webp',...Object.fromEntries([...new Set([...ITEM_BASES,...Object.values(START_EQUIPMENT)].map(i=>i.art||i.id))].map(id=>['item-'+id,'assets/items/'+id+'.webp'])),atlas:'assets/painted/enemy-atlas.webp'};
    for(const id of ['enemies','bosses','summons','npcs'])files['v6-'+id]='assets/expedition/v6-'+id+'.webp';for(const u of Object.values(UNIQUE_ITEMS))files['item-'+u.art]='assets/items/'+u.art+'.webp';
    for(const identity of ['elementalist','builder','hunter'])files['hero-class-'+identity]='assets/painted/hero-class-'+identity+'-v871.webp';files.focusV8='assets/expedition/focus-v8.webp';files.helmetsV8='assets/expedition/helmets-v8.webp';files.enemiesV8='assets/expedition/enemies-v8.webp';files.biomeEnemies='assets/expedition/enemies-biome-v81.webp';
    files.natureCreatures='assets/expedition/nature-creatures-v83.webp';
    for(const r of Object.values(OUTDOOR_REGIONS))files[r.asset]='assets/painted/'+r.file;files.regionCauseway='assets/painted/region-causeway-v872.webp';files.outdoorDoor='assets/expedition/outdoor-door-v872.webp';for(const name of ['seya','orin','tess'])files['npc-'+name]='assets/expedition/npc-'+name+'-v872.webp';
    files.cityEast='assets/painted/vrijhaven-east-v871.webp';files.cityJoin='assets/painted/vrijhaven-join-v871.webp';
    files.quayGarden='assets/painted/canal-garden-court-v87.webp';files.quayJoin='assets/painted/quay-join-v87.webp';
    files.groundScrap='assets/expedition/ground-scrap-v86.webp';
    files.companionsV82='assets/expedition/companions-v82.webp';files.creaturesV82='assets/expedition/creatures-v82.webp';files.ritualClosed='assets/expedition/ritual-closed-v82.webp';files.ritualOpen='assets/expedition/ritual-open-v82.webp';
    files.enemyWalkV7='assets/expedition/enemy-walk-v7.webp';files.enemyAOE='assets/expedition/enemy-aoe-v561.webp';files.arenaProps='assets/expedition/arena-obstacles-v561.webp';
    const decoded=new Map();await Promise.all(Object.entries(files).map(async([id,file])=>{if(!decoded.has(file))decoded.set(file,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Asset ontbreekt: '+file));image.src=file;}));this.assets[id]=await decoded.get(file);}));
    [this.enemyAOECrop,this.arenaPropsCrop]=await Promise.all(['enemy-aoe-v561','arena-obstacles-v561'].map(name=>fetch('assets/expedition/'+name+'.json').then(r=>r.json())));
    this.outdoorNPCCrop=await fetch('assets/expedition/npcs-v872.json').then(r=>r.json());
    this.natureCrop=await fetch('assets/expedition/nature-creatures-v83.json').then(r=>r.json());
    [this.companionCrop,this.creatureCrop]=await Promise.all(['companions-v82','creatures-v82'].map(n=>fetch('assets/expedition/'+n+'.json').then(r=>r.json())));
    this.biomeEnemyCrop=await fetch('assets/expedition/enemies-biome-v81.json').then(r=>r.json());
    this.enemyWalkV7Crop=await fetch('assets/expedition/enemy-walk-v7.json').then(r=>r.json());
    this.v6Crop=await fetch('assets/expedition/v6-sprites.json').then(r=>r.json());
    this.combatEffectsCrop=await fetch('assets/expedition/combat-effects-v551.json').then(r=>r.json());this.noraCrop=await fetch('assets/expedition/nora-v551.json').then(r=>r.json());this.enemyAnimationCrop=await fetch('assets/expedition/enemy-animation-v55.json').then(r=>r.json());this.v54Crop=await fetch('assets/expedition/v54-sprites.json').then(r=>r.json());this.newEnemyCrop=await fetch('assets/expedition/enemy-v52.json').then(r=>r.json());this.expedition=await fetch('assets/expedition/sprites.json').then(r=>r.json());this.itemCrop=await fetch('assets/items/items.json').then(r=>r.json());this.crop=await fetch('assets/painted/sprites.json').then(r=>r.json());[this.heroGearCrop,this.focusV8Crop,this.helmetV8Crop,this.v8EnemyCrop]=await Promise.all(['assets/painted/hero-gear-v8.json','assets/expedition/focus-v8.json','assets/expedition/helmets-v8.json','assets/expedition/enemies-v8.json'].map(file=>fetch(file).then(r=>r.json())));this.heroDirectionalCrop=await fetch('assets/painted/hero-eight-directions.json').then(r=>r.json());this.heroClassCrop=await fetch('assets/painted/hero-classes-v872.json').then(r=>r.json());await prepareHeroRig(this);this.ready=true;
  }
  drawEquipmentPortrait(canvas,p){if(!canvas||!this.ready)return;const key=equipmentAppearance(p).key;this.portraits||=new Map();let tile=this.portraits.get(key);if(!tile){tile=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(320,420):document.createElement('canvas');tile.width=320;tile.height=420;const ctx=tile.getContext('2d'),old=this.ctx;this.ctx=ctx;ctx.save();ctx.translate(160,375);ctx.scale(2.6,2.6);drawRiggedHero(this,{...p,x:0,y:0,moving:false,walkBlend:0,visualMotionBlend:0,cast:0,poseTurn:0},0);ctx.restore();this.ctx=old;this.portraits.set(key,tile);while(this.portraits.size>12)this.portraits.delete(this.portraits.keys().next().value);}const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(tile,0,0,canvas.width,canvas.height);}
  resize(){const rect=this.canvas.getBoundingClientRect(),ratio=renderRatio(rect.width,rect.height,window.devicePixelRatio||1,this.settings?.quality)*(this.performanceScale||1);this.canvas.width=Math.round(rect.width*ratio);this.canvas.height=Math.round(rect.height*ratio);this.width=rect.width;this.height=rect.height;this.pixelRatio=ratio;this.updateZoom();this.ctx.imageSmoothingEnabled=true;this.ctx.imageSmoothingQuality=this.settings?.quality==='high'?'high':'medium';const bounds=worldBounds(this.renderArea);this.camera.x=clamp(this.camera.x,0,Math.max(0,bounds.width-this.viewWidth));this.camera.y=clamp(this.camera.y,0,Math.max(0,bounds.height-this.viewHeight));this.cache.clearViewport();this.sceneDirty=true;}
  updateZoom(){const b=worldBounds(this.renderArea),base=Math.max(this.width<=720?.78:1,this.width/WORLD.width,this.height/WORLD.height),fit=Math.max(this.width/b.width,this.height/b.height);this.zoom=Math.max(fit,base*(this.settings?.camera||1.15));this.viewWidth=this.width/this.zoom;this.viewHeight=this.height/this.zoom;}
  noteFrame(delta){if(this.settings?.quality&&this.settings.quality!=='auto')return;if(!Number.isFinite(delta)||delta<.004||delta>.1)return;this.frameSamples||=[];this.frameSamples.push(delta);if(this.frameSamples.length<90)return;const samples=this.frameSamples;this.frameSamples=[];const slow=samples.filter(d=>d>.023).length,healthy=samples.filter(d=>d<.0195).length,scale=this.performanceScale||1;let next=scale;if(slow>67){this.healthyWindows=0;next=Math.max(.65,scale*.88);}else if(healthy>80){this.healthyWindows=(this.healthyWindows||0)+1;if(this.healthyWindows>=2){next=Math.min(1,scale+.04);this.healthyWindows=0;}}else this.healthyWindows=0;if(Math.abs(next-scale)>.01){this.performanceScale=next;this.resize();}}
  reset(player,area=this.renderArea){this.renderArea=area;this.updateZoom();const bounds=worldBounds(area);this.sceneDirty=true;this.camera.x=clamp(player.x-this.viewWidth/2,0,Math.max(0,bounds.width-this.viewWidth));this.camera.y=clamp(player.y-this.viewHeight*.57,0,Math.max(0,bounds.height-this.viewHeight));}
  screenToWorld(x,y){return {x:x/this.zoom+this.camera.x,y:y/this.zoom+this.camera.y};}
  kick(amount=5){this.shake=Math.max(this.shake,amount*(this.settings?.shake??.6));}
  ellipse(x,y,rx,ry,color,stroke=null,width=1){const c=this.ctx;c.beginPath();c.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),0,0,TAU);if(color){c.fillStyle=color;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
  line(a,b,color,width=2){const c=this.ctx;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
  text(text,x,y,color='#fff3d5',size=15){const label=this.cache.label(text,color,size,Math.min(2,this.pixelRatio*this.zoom));this.ctx.drawImage(label.canvas,x-label.width/2,y-label.anchor,label.width,label.height);}
  inView(x,y,r=80,above=r,below=r){return x+r>this.camera.x-40&&x-r<this.camera.x+this.viewWidth+40&&y+below>this.camera.y-40&&y-above<this.camera.y+this.viewHeight+40;}
  render(engine,time,delta){if(!this.ready)return;const s=engine.state,p=s.player,zone=AREA_BY_ID[s.area],c=this.ctx;this.time=time;this.renderPlayer=p;if(this.renderArea!==s.area)this.reset(p,s.area);
    const bounds=worldBounds(s.area);this.bounds=bounds;const targetX=clamp(p.x-this.viewWidth*.5,0,Math.max(0,bounds.width-this.viewWidth));const targetY=clamp(p.y-this.viewHeight*.57,0,Math.max(0,bounds.height-this.viewHeight));
    const smooth=1-Math.exp(-delta*6);this.camera.x+=(targetX-this.camera.x)*smooth;this.camera.y+=(targetY-this.camera.y)*smooth;
    const shakeX=(Math.sin(time*67)*this.shake),shakeY=(Math.cos(time*83)*this.shake*.6);this.shake=Math.max(0,this.shake-delta*24);
    c.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);c.clearRect(0,0,this.width,this.height);c.save();c.scale(this.zoom,this.zoom);c.translate(-this.camera.x+shakeX,-this.camera.y+shakeY);
    if(zone.tiles){for(const [i,tile] of zone.tiles.entries())if(this.inView(tile.x+tile.width/2,tile.y+tile.height/2,tile.width/2,tile.height/2,tile.height/2))c.drawImage(tile.asset?this.assets[tile.asset]:i?this.assets.quayGarden:this.assets[zone.id],tile.x,tile.y,tile.width,tile.height);}else c.drawImage(this.assets[zone.id],0,0,bounds.width,bounds.height);if(s.area==='highway'&&this.inView(CITY_JOIN.x+CITY_JOIN.width/2,CITY_JOIN.y+CITY_JOIN.height/2,CITY_JOIN.width/2,CITY_JOIN.height/2,CITY_JOIN.height/2))c.drawImage(this.assets.cityJoin,CITY_JOIN.x,CITY_JOIN.y,CITY_JOIN.width,CITY_JOIN.height);if(s.area==='canal'&&this.inView(QUAY_GATE.x,896,100,896,896))c.drawImage(this.assets.quayJoin,QUAY_GATE.x-75,0,150,1792);for(const j of zone.joins||[])if(this.inView(j.x+j.width/2,j.y+j.height/2,j.width/2,j.height/2,j.height/2))c.drawImage(this.assets[j.asset],j.x,j.y,j.width,j.height);c.fillStyle='rgba(9,26,36,.035)';c.fillRect(0,0,bounds.width,bounds.height);
    this.visualLoad=s.effects.length+s.projectiles.length*.5+s.fields.length*3;
    this.drawHazards(s);this.drawNewThreats(s);this.drawV6Ground(s);this.drawCreatureGround(s);for(const field of s.fields)this.drawAreaField(field);if(s.world.camp)this.drawCampFloor(s.world.camp,s);this.drawTelegraphs(s);this.drawEnemyLanding(s);
    for(const relay of s.world.relays)this.drawRelay(relay,s);
    engine.syncStoryPortals();this.drawGate(s);this.drawArchive(s);this.visiblePortals=engine.portalReady()?s.world.portals:[];
    for(const pickup of s.world.pickups){if(!this.inView(pickup.x,pickup.y,65))continue;if(pickup.type==='scrap'){this.drawGroundScrap(pickup,p);continue;}this.ellipse(pickup.x,pickup.y,20,11,'#71ca9870');this.ellipse(pickup.x,pickup.y-12,8,8,'#b7f5bf','#fff4c7',2);}
    const ordered=[...this.visiblePortals.map(entity=>({kind:'portal',entity})),...(s.world.camp?.services?s.world.camp.services.map(entity=>({kind:'service',entity})):s.world.camp?[{kind:'merchant',entity:s.world.camp.merchant}]:[]),...s.world.loot.map(entity=>({kind:'loot',entity})),...s.world.enemies.filter(e=>!e.dead||e.deathVisualLife>0).map(entity=>({kind:'enemy',entity})),...(s.summons||[]).map(entity=>({kind:'companion',entity})),{kind:'player',entity:p}];
    for(const peer of s.coop?.players||[])if(peer.player){ordered.push({kind:'player',entity:peer.player});for(const u of peer.summons||[])ordered.push({kind:'companion',entity:u});}
    if(s.area==='canal')ordered.push({kind:'townGate',entity:QUAY_GATE});
    const outdoor=OUTDOOR_REGIONS[s.area];if(outdoor){const npc=engine.outdoorNPC();ordered.push({kind:'outdoorNPC',entity:npc});ordered.push({kind:'outdoorDoor',entity:outdoorPoint(s.area,outdoor.door[1])});for(const q of outdoor.points)ordered.push({kind:'outdoorPoint',entity:{...outdoorPoint(s.area,q.point),point:q}});}
    if(s.world.ritual)ordered.push({kind:'ritual',entity:s.world.ritual});
    for(const obstacle of arenaObstacles(s.area))ordered.push({kind:'obstacle',entity:obstacle});
    for(const point of QUARTER_POINTS[s.area]||[])ordered.push({kind:'discovery',entity:point});
    for(const npc of engine.questNPCs())ordered.push({kind:'quest',entity:npc});ordered.sort((a,b)=>a.entity.y-b.entity.y);
    for(const entry of ordered){const e=entry.entity,height=entry.kind==='enemy'?ENEMIES[e.type].size+(e.jumpHeight||0)+80:entry.kind==='obstacle'?e.height+40:210;if(!this.inView(e.x,e.y,180,height,70))continue;
      switch(entry.kind){
       case 'discovery':this.drawQuarterDiscovery(e,s);break;case 'ritual':this.drawRitualChest(e,s);break;case 'companion':this.drawCompanion(e,time);break;case 'obstacle':this.drawArenaObstacle(e,p);break;
       case 'townGate':c.drawImage(this.assets[s.world.gardenOpen?'ritualOpen':'ritualClosed'],e.x-78,e.y-135,156,175);this.text(s.world.gardenOpen?'TUINWIJK':'MILO OPENT DE POORT',e.x,e.y+49,'#ead8a5',12);break;
       case 'player':this.drawPlayer(e,time);if(e.name){this.ellipse(e.x,e.y-139,Math.max(43,e.name.length*4.5),13,'#10292be0');this.text(e.name+(e.downed?' · GEVALLEN':''),e.x,e.y-136,e.downed?'#ffbb9b':e.preferredSpecialization==='builder'?'#c8e7a4':e.preferredSpecialization==='hunter'?'#ffd3a3':'#b5eaf3',13);}break;
       case 'outdoorNPC':this.drawOutdoorNPC(e,s);break;case 'outdoorDoor':this.drawOutdoorDoor(s);break;case 'outdoorPoint':this.drawOutdoorPoint(e.point,s);break;case 'quest':this.drawQuestNPC(e,s);break;case 'portal':this.drawTravel(e,s);break;case 'service':this.drawService(e,s);break;case 'merchant':this.drawMerchant(s.world.camp,s);break;case 'loot':this.drawLoot(e,time,s);break;default:this.drawEnemy(e,time);
      }
    }
    for(const bolt of s.projectiles)if(this.inView(bolt.x,bolt.y-(bolt.flightHeight||0),110))this.drawProjectile(bolt);
    for(const effect of s.effects){const r=(effect.radius||80)+100;if(this.inView(effect.x,effect.y,r,r+160,r)||effect.end&&this.inView((effect.x+effect.end.x)/2,(effect.y+effect.end.y)/2,Math.abs(effect.x-effect.end.x)/2+r,Math.abs(effect.y-effect.end.y)/2+r))this.drawEffect(effect);}
    for(const number of s.numbers){c.globalAlpha=Math.min(1,number.life*3);this.text(number.text,number.x,number.y,number.color,number.size);}c.globalAlpha=1;
    this.drawWaypoint(engine);c.restore();this.drawAtmosphere(s,time);this.drawMinimap(s);this.sceneDirty=false;this.lastSceneMode=s.mode;
  }
  sprite(image,source,x,y,height,flip=false,rotation=0,alpha=1){const c=this.ctx;if(!source)return;const [sx,sy,sw,sh]=source.bounds;const width=height*sw/sh;const anchorX=(source.anchor?.[0]??.5)*width;const anchorY=(source.anchor?.[1]??1)*height,cutout=this.cache.sprite(image,source,c.filter);c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.rotate(rotation);c.globalAlpha*=alpha;if(cutout){c.filter='none';c.drawImage(cutout,-anchorX,-anchorY,width,height);}else c.drawImage(image,sx,sy,sw,sh,-anchorX,-anchorY,width,height);c.restore();}
  drawGroundScrap(pickup,player){
    const img=this.assets.groundScrap,near=distance(pickup,player)<140;
    this.ellipse(pickup.x,pickup.y+3,23,9,'#18333455');
    this.sprite(img,{bounds:[0,0,img.width,img.height],anchor:[.5,.79]},pickup.x,pickup.y,33,pickup.variant===1);
    if(near){this.ellipse(pickup.x,pickup.y,28,12,null,'#ffdf9a99',1.2);this.text('Schroot · +'+pickup.amount,pickup.x,pickup.y-34,'#ffe4af',14);}
  }
  drawPlayer(p,time){const c=this.ctx,movement=p.moving?Math.sin((p.walkPhase||0)*Math.PI*10)*(p.walkBlend??1)*2:Math.sin(time*2.4)*.3;this.ellipse(p.x,p.y+2,24,11,'rgba(14,35,39,.45)');
    const pose=(p.lookUp?4:0)+(p.moving?1+Math.floor((p.walkPhase||0)*5)%2:p.cast>0?3:0),frame=this.crop.heroFrames[pose];
    if(!this.heroClassCrop&&!this.assets.heroDirectional)for(const trail of p.trail)this.sprite(this.assets.heroAnimation,frame,trail.x,trail.y,123,p.facing<0,0,trail.life*.7);
    this.ellipse(p.x,p.y,29,13,null,p.dashTimer>0?'#c4f9f3':'#dbe6c695',1.4);
    if(p.invincible>0&&p.dashTimer>0){this.ellipse(p.x,p.y-30,40,54,'#b7efea20','#c2f7e977',1.5);}
    if(!drawDirectionalHero(this,p,time)){if(p.moving&&p.dashTimer<=0)drawWalkingHero(this,p);else this.sprite(this.assets.heroAnimation,frame,p.x,p.y+movement,123,p.facing<0,0);}
    if(p.hurt>0){c.globalCompositeOperation='screen';this.ellipse(p.x,p.y-43,25,40,'#ffe5cb70');c.globalCompositeOperation='source-over';}
    const spell=SPELLS[p.lastAbility||p.spell],focus=heroFocus(this,p,time),staffX=focus?.x??p.x+p.aim.x*30,staffY=focus?.y??p.y-38+p.aim.y*16;this.glow(staffX,staffY,p.cast>0?30:12,spell.color,.6);this.ellipse(staffX,staffY,3.5,3.5,'#fff4d5');
    if(p.venom>0){this.glow(p.x,p.y-35,38,'#a6d74f',.3);for(let i=0;i<4;i++)this.ellipse(p.x+Math.sin(time*3+i*1.8)*23,p.y-((time*20+i*17)%65),2.5,4,'#c3ed7ba0');}
    if(p.wet>0)this.ellipse(p.x,p.y+5,25,10,null,'#80e2ec',2);
  }
  drawEnemy(e,time){if(e.dead&&!(e.deathVisualLife>0))return;const corpse=e.dead;const base=ENEMIES[e.type],c=this.ctx;if(e.hidden&&e.mistStep)return;if(e.hidden){this.ellipse(e.x,e.y,25,12,'#a3765740',base.color,1);return;}this.ellipse(e.x,e.y+3,base.boss?52:base.radius+2,base.radius*.43,'rgba(20,27,25,.45)');
    if(e.elite){this.ellipse(e.x,e.y,base.radius+12,(base.radius+12)*.55,null,'#f6d899',2);this.glow(e.x,e.y-25,50,'#ecc365',.15);}
    const bob=(e.type==='drone'?Math.sin(time*3+e.anim)*5:e.move?Math.abs(Math.sin(time*8+e.anim))*-2:0)-(e.jumpHeight||0);
    const lean=e.move?Math.sin(e.anim*9)*.025:0;
    c.save();if(corpse)c.globalAlpha*=Math.min(1,e.deathVisualLife/.24);const motion=enemyAttackMotion(e);c.translate(e.x+motion.x,e.y+motion.y);c.rotate(motion.rotation);c.scale(1+motion.squash,1-motion.squash);c.translate(-e.x,-e.y);const painted=this.v54Crop?.enemies[e.type],boss=this.v54Crop?.bosses[e.type],faceLeft=e.angle>Math.PI/2||e.angle<-Math.PI/2;if(this.drawV6Enemy(e,base,time)||drawAnimatedEnemy(this,e,base,time)){}else if(painted){this.sprite(this.assets.rolesV54,painted,e.x,e.y+bob,base.size*(e.elite?1.18:1),faceLeft!==Boolean(painted.facesLeft),lean);}else if(boss){const frame=boss.frames[e.windup?1:0];this.sprite(this.assets.bossesV54,frame,e.x,e.y+bob,base.size*frame.bounds[3]/boss.scaleDenominator,faceLeft!==Boolean(boss.facesLeft),lean);}else{
    this.sprite(base.atlas==='v52'?this.assets.newEnemies:base.atlas==='expedition'?this.assets.extraEnemies:this.assets.atlas,base.atlas==='v52'?this.newEnemyCrop[base.sprite][e.windup?1:0]:base.atlas==='expedition'?this.expedition.enemies[base.sprite]:this.crop.enemies[base.sprite],e.x,e.y+bob,base.size*(e.elite?1.18:1),faceLeft,lean);}
    if(!corpse)this.drawEnemyCharge(e);c.restore();if(corpse)return;if(e.type==='stormnest'&&!painted)for(const sign of [-1,1])this.sprite(this.assets.extraEnemies,this.expedition.enemies.stormling,e.x+sign*29,e.y-52+Math.sin(time*2+sign)*5,40,sign<0,sign*.18);
    if(e.wet>0){for(let i=0;i<3;i++){const x=e.x+Math.sin(time*3+i*2)*20,y=e.y-26+Math.cos(time*3+i*2)*14;this.ellipse(x,y,3,6,'#97f0f4c0');}}
    if(e.burn>0){this.glow(e.x,e.y-22,40,'#ffb376',.4);for(let i=0;i<3;i++)this.ellipse(e.x-16+i*14,e.y-20-(time*40+i*17)%45,4,10,'#ffb76bb0');}
    if(e.stun>0)this.ellipse(e.x,e.y-base.size-10,13,7,null,'#bdc7ff',2);
    if(e.hurt>0){c.globalCompositeOperation='screen';this.glow(e.x,e.y-base.size*.45,base.size*.5,'#fff0c2',.5);c.globalCompositeOperation='source-over';}
    if(['sporecaster','toxinbeetle','chemist','seedheart'].includes(e.type)&&e.awake)this.text('GIFTIG',e.x,e.y-base.size-(base.boss?47:e.elite?40:27),'#c3ec87',12);
    if(e.awake||e.hp<e.maxHp){const w=base.boss?120:e.elite?70:48,y=e.y-base.size-12;c.fillStyle='#132225dd';c.fillRect(e.x-w/2-1,y-1,w+2,6);c.fillStyle=base.boss||e.elite?'#f1d590':'#d97c60';c.fillRect(e.x-w/2,y,w*clamp(e.hp/e.maxHp,0,1),4);if(base.boss)this.text((e.displayName||base.name)+' · '+e.phase,e.x,y-10,base.color,15);else if(e.elite)this.text(e.eliteName||'◆',e.x,y-8,'#f4db9a',14);}
  }
  glow(x,y,r,color,opacity=.4){const c=this.ctx;c.save();c.globalAlpha*=opacity;c.drawImage(this.cache.glow(color),x-r,y-r,r*2,r*2);c.restore();}
  drawRelay(relay,s){const online=relay.status==='online',defending=relay.status==='defending',color=online?'#93edcf':defending?'#efb477':'#83d5dc';this.ellipse(relay.x,relay.y,50,25,'#07232a44',color+'b0',2);this.glow(relay.x,relay.y-36,70,color,.3);
    this.sprite(this.assets.atlas,this.crop.enemies[5],relay.x,relay.y,116,false);this.text(online?'STATION '+relay.id+' · ONLINE':defending?'STATION '+relay.id+' · GOLF '+relay.wave+'/2':'MEETSTATION '+relay.id,relay.x,relay.y-125,color,13);
    if(online){for(let i=0;i<5;i++){const a=this.time*.8+i*TAU/5;this.ellipse(relay.x+Math.cos(a)*42,relay.y-18+Math.sin(a)*19,2.5,2.5,'#c8ffdd');}}
  }
  drawGate(s){if(AREA_BY_ID[s.area].side||s.zone!==3||!s.world.bossDefeated)return;const gate=s.world.gate;this.sprite(this.assets.atlas,this.crop.enemies[5],gate.x,gate.y,120);this.glow(gate.x,gate.y-45,75,'#f2d997',.4);}
  drawArchive(s){const a=s.world.archive;if(!a||a.read)return;this.ellipse(a.x,a.y,16,8,'#052c3055','#b6ded1',1);const c=this.ctx;c.save();c.translate(a.x,a.y-16);c.rotate(-.15);c.fillStyle='#173b3d';c.strokeStyle='#f4d496';c.lineWidth=1.5;c.beginPath();c.roundRect(-12,-15,24,25,3);c.fill();c.stroke();c.fillStyle='#85d3c1';c.fillRect(-7,-9,14,2);c.fillRect(-7,-3,10,2);c.restore();}
  drawLoot(loot,time,s){if(loot.quest){this.drawQuestPickup(loot,time);return;}if(loot.item){this.drawItemDrop(loot,time);return;}const color=loot.prototype?'#edc67d':'#8cdecf';this.ellipse(loot.x,loot.y,32,15,'#172f3255',color+'99',1.5);this.glow(loot.x,loot.y-18,57,color,.28);this.sprite(this.assets.items,this.itemCrop['loot-chest'],loot.x,loot.y+Math.sin(time*2)*2,65);
    if(loot.guarded&&s.world.enemies.some(e=>e.cacheGuard&&!e.dead))this.text('BEWAAKT',loot.x,loot.y-83,'#edb797',12);
    for(let i=0;i<3;i++){const a=time*.9+i*TAU/3;this.ellipse(loot.x+Math.cos(a)*23,loot.y-28+Math.sin(a)*13,1.8,1.8,'#ffe6a8');}
  }
  drawHazards(s){const c=this.ctx;for(const h of s.world.hazards){if(h.cleared)continue;const colors={water:'#51cee0',heat:'#e47742',spore:'#93c477',polarity:'#edcd72',friendlyFire:'#f7a450'};const color=colors[h.type]||'#dadcaf';const hot=h.type==='polarity'&&Math.floor(s.time/3+h.phase)%2===1;const alpha=h.type==='friendlyFire'?.16:.1;this.ellipse(h.x,h.y,h.r,h.r*.63,color+Math.round(alpha*255).toString(16).padStart(2,'0'),color+'55',1);
      if(h.type==='water'){for(let i=0;i<4;i++){const r=(this.time*14+i*23)%h.r;this.ellipse(h.x,h.y,r,r*.55,null,color+'55',1);}}
      else if(h.type==='spore'){this.areaSprite('toxin',1,h.x,h.y,Math.min(150,h.r*1.5),Math.min(.3,(h.life??1)*.4));for(let i=0;i<7;i++){const a=i*2.4;const r=20+(i*13)%h.r;this.combatSprite('toxin',i%2,h.x+Math.cos(a)*r,h.y+Math.sin(a)*r*.5-((this.time*12+i*7)%35),8,0,.45);}}
      else if(h.type==='heat'||h.type==='friendlyFire'){for(let i=0;i<6;i++){const a=i*2.8;const r=i*13;this.glow(h.x+Math.cos(a)*r,h.y+Math.sin(a)*r*.6-14,25,color,.18);}}
      else if(h.type==='polarity'){this.ellipse(h.x,h.y,h.r*.7,h.r*.42,null,hot?'#ffeab5b0':'#8cbbba77',hot?2:1);this.text(hot?'−':'+',h.x,h.y+6,hot?'#f7d682':'#b2e8de',22);}
    }}
  drawTelegraphs(s){const c=this.ctx;for(const e of s.world.enemies){if(e.dead||!e.windup||e.windup.quick)continue;const w=e.windup,progress=1-w.timer/w.total,color='#ef805f';c.save();
    if(this.drawV6Warning(e,w,progress)){c.restore();continue;}
    if(this.drawEnemyAreaWarning(e,w,progress)){c.restore();continue;}
    if(this.drawNewTelegraph(e,w,progress)){c.restore();continue;}
    if(w.mode==='charge'||w.mode==='crossfire'){const angles=w.mode==='crossfire'?[-.12,0,.12]:[0];for(const offset of angles){const angle=Math.atan2(w.dir.y,w.dir.x)+offset,length=w.mode==='charge'?238:650,end={x:e.x+Math.cos(angle)*length,y:e.y+Math.sin(angle)*length/1.15};this.line(e,end,color+'30',w.mode==='charge'?44:12);this.line(e,end,'#ffe0a1bb',2);this.line(e,{x:e.x+(end.x-e.x)*progress,y:e.y+(end.y-e.y)*progress},'#fff1bb',3);}}
    else if(w.mode==='shockwave'){this.ellipse(e.x,e.y,280,280/1.15,null,color+'80',2);this.ellipse(e.x,e.y,40+progress*40,(40+progress*40)/1.15,color+'25','#ffe4a0',3);}
    else if(w.mode==='beam'||w.mode==='snipe'){const length=e.type==='boss'?740:640;const end={x:e.x+w.dir.x*length,y:e.y+w.dir.y*length/1.15};this.line(e,end,color+'38',58);this.line(e,end,'#ffe0a1a0',2);this.line(e,{x:e.x+(end.x-e.x)*progress,y:e.y+(end.y-e.y)*progress},'#fff1bb',4);}
    else if(['leap','meteors','spores','siege'].includes(w.mode)){for(const point of w.targets||[w.target]){this.ellipse(point.x,point.y,94,59,color+'35',color+'da',2);this.ellipse(point.x,point.y,94*progress,59*progress,null,'#ffe4a0',2);this.text('!',point.x,point.y-8,'#fff1be',22);}}
    else if(w.mode==='swing'||w.mode==='bite'){c.translate(e.x,e.y);c.scale(1,.75);c.rotate(Math.atan2(w.dir.y,w.dir.x));c.beginPath();c.moveTo(0,0);c.arc(0,0,125,-1.15,1.15);c.closePath();c.fillStyle=color+'38';c.fill();c.strokeStyle='#ffc88d';c.lineWidth=2;c.stroke();}
    else{this.ellipse(e.x,e.y,e.type==='boss'?125:w.mode==='slam'?150:47,e.type==='boss'?76:w.mode==='slam'?95:28,color+'25','#f7b88d',2);this.ellipse(e.x,e.y,(e.type==='boss'?125:w.mode==='slam'?150:47)*progress,(e.type==='boss'?76:w.mode==='slam'?95:28)*progress,null,'#ffe8a8',2);}
    c.restore();}}
  drawProjectile(bolt){if(this.drawEnemyProjectile(bolt))return;if(bolt.type==='volt'){for(let i=1;i<bolt.trail.length;i+=trailStep(this.visualLoad))this.line(bolt.trail[i-1],bolt.trail[i],'#bca6ff88',3);this.combatSprite('storm',Math.floor(bolt.age*16)%2,bolt.x,bolt.y,68,Math.atan2(bolt.vy,bolt.vx));return;}if(bolt.type==='prism'){for(let i=1;i<bolt.trail.length;i+=trailStep(this.visualLoad))this.line(bolt.trail[i-1],bolt.trail[i],i%2?'#8ef2ec90':'#ffe4a990',3);this.combatSprite('solar',Math.floor(bolt.age*16)%2,bolt.x,bolt.y,48,Math.atan2(bolt.vy,bolt.vx));return;}const c=this.ctx,color=bolt.team==='enemy'?(bolt.color||'#ffc092'):SPELLS[bolt.type].color,y=bolt.y-(bolt.flightHeight||0);
    if(bolt.trail.length)for(let i=1;i<bolt.trail.length;i+=trailStep(this.visualLoad))this.line(bolt.trail[i-1],bolt.trail[i],color+Math.round(i/bolt.trail.length*150).toString(16).padStart(2,'0'),bolt.type==='frost'?4:bolt.radius*.65*i/bolt.trail.length);
    this.glow(bolt.x,y,bolt.type==='gravity'?65:bolt.radius*3,color,.55);c.save();c.translate(bolt.x,y);
    if(bolt.type==='tide'){c.rotate(Math.atan2(bolt.vy,bolt.vx));c.beginPath();c.arc(-9,0,23,-1.2,1.2);c.strokeStyle='#c5ffff';c.lineWidth=5;c.stroke();c.beginPath();c.arc(-13,0,28,-1.3,1.3);c.strokeStyle=color+'aa';c.lineWidth=8;c.stroke();}
    else if(bolt.type==='frost'){const scale=bolt.radius/SPELLS.frost.radius;c.scale(scale,scale);c.rotate(Math.atan2(bolt.vy,bolt.vx));c.beginPath();c.moveTo(25,0);c.lineTo(-15,-9);c.lineTo(-8,0);c.lineTo(-15,9);c.closePath();c.fillStyle='#e2fbff';c.fill();c.strokeStyle=color;c.lineWidth=2;c.stroke();}
    else if(bolt.type==='gale'){c.rotate(bolt.age*17);for(let i=0;i<3;i++){c.rotate(TAU/3);c.beginPath();c.arc(0,0,23,-1,1);c.strokeStyle=i?'#8ce5c1':'#e0ffdb';c.lineWidth=5;c.stroke();}this.ellipse(0,0,9,7,'#eeffe199');}
    else if(bolt.type==='gravity'){c.rotate(bolt.age*4);this.ellipse(0,0,18,18,'#251936','#f2c1ff',3);for(let i=0;i<3;i++){c.rotate(TAU/3);c.beginPath();c.ellipse(0,0,38,12,0,0,TAU);c.strokeStyle=color+'bb';c.lineWidth=2;c.stroke();}this.ellipse(0,0,6,6,'#fff6ff');}
    else{this.ellipse(0,0,bolt.radius*.8,bolt.radius*.8,bolt.type==='ember'?'#fff1a1':'#fff7dc',color,3);if(bolt.type==='ember'){for(let i=0;i<5;i++){const a=bolt.age*8+i*1.3;this.ellipse(Math.cos(a)*16,Math.sin(a)*16,4,7,'#ff9c48');}}}
    c.restore();if(bolt.flightHeight)this.ellipse(bolt.x,bolt.y+18,17,8,'#13222170');
  }
  drawEffect(e){if(e.type==='hit-spark'){this.drawHitSpark(e);return;}if(this.drawEnemyAreaEffect(e)||this.drawEnemyCombatEffect(e)||this.drawExpeditionEffect(e))return;const c=this.ctx,progress=e.age/(e.age+e.life),r=e.radius||50,color=e.color||'#e5d4a4';c.save();c.globalAlpha=clamp(e.life*3,0,1);
    if(e.type==='chain'||e.type==='beam'){
      const end=e.end;if(e.type==='beam'){this.line(e,end,color+'44',38);this.line(e,end,'#fff5d4',8);}
      else{let last={x:e.x,y:e.y};for(let i=1;i<=8;i++){const point={x:e.x+(end.x-e.x)*i/8+(i<8?Math.sin(i*13+this.time*75)*9:0),y:e.y+(end.y-e.y)*i/8+(i<8?Math.cos(i*11+this.time*91)*9:0)};this.line(last,point,color,4);last=point;}this.line(e,end,'#fff9ec',1);}
    }else if(e.type==='slash'){c.translate(e.x,e.y);c.scale(1,.7);c.rotate(Math.atan2(e.dir.y,e.dir.x));c.beginPath();c.arc(0,0,r*(.7+progress*.3),-1.1,1.1);c.strokeStyle=color;c.lineWidth=12*(1-progress);c.stroke();}
    else{
      if(['nova','relay','ultimate','heal','storm'].includes(e.type)){this.ellipse(e.x,e.y,r*progress,r*progress*.65,color+'12',color,3*(1-progress)+1);this.ellipse(e.x,e.y,r*progress*.7,r*progress*.46,null,color+'88',2);}
      this.glow(e.x,e.y-20,r*(.4+progress*.4),color,.4*(1-progress));
      for(let i=0;i<effectParticles(this.visualLoad,e.type==='ultimate');i++){const a=i*2.399;const radius=r*progress*(.5+(i%5)*.13);const x=e.x+Math.cos(a)*radius,y=e.y+Math.sin(a)*radius*.65-(e.type==='eruption'?Math.sin(progress*Math.PI)*50:0);this.ellipse(x,y,3+(1-progress)*4,3+(1-progress)*7,color+(e.type==='steam'?'60':'bb'));}
    }c.restore();}
  drawWaypoint(engine){const s=engine.state,p=s.player,target=engine.nextWaypoint();if(!target)return;
    const d=distance(p,target);if(d<100)return;const x=target.x-this.camera.x,y=target.y-this.camera.y;
    if(x>60&&x<this.viewWidth-60&&y>90&&y<this.viewHeight-160)return;
    const dir=Math.atan2(target.y-p.y,target.x-p.x),cx=clamp(x,70,this.viewWidth-70)+this.camera.x,cy=clamp(y,95,this.viewHeight-155)+this.camera.y,c=this.ctx;c.save();c.translate(cx,cy);c.rotate(dir);c.beginPath();c.moveTo(16,0);c.lineTo(-8,-9);c.lineTo(-8,9);c.closePath();c.fillStyle='#f9d98e';c.shadowColor='#132a30';c.shadowBlur=10;c.fill();c.restore();}
  drawAtmosphere(s,time){const c=this.ctx;c.save();const danger=s.player.hp<30;if(this.cache.vignette?.danger!==danger){const scale=256/this.width,canvas=surface(256,this.height*scale),ctx=canvas.getContext('2d');ctx.scale(scale,scale);const gradient=ctx.createRadialGradient(this.width*.5,this.height*.45,this.height*.25,this.width*.5,this.height*.45,this.height*.85);gradient.addColorStop(0,'#06192700');gradient.addColorStop(1,danger?'#70140e88':'#071b294f');ctx.fillStyle=gradient;ctx.fillRect(0,0,this.width,this.height);this.cache.vignette?.canvas.close?.();this.cache.vignette={canvas:freezeSurface(canvas),danger};}c.drawImage(this.cache.vignette.canvas,0,0,this.width,this.height);
    for(let i=0;i<22;i++){const x=(i*137.3+Math.sin(time*.1+i)*45)%this.width,y=(i*79.1-time*8)%this.height;c.globalAlpha=.12+(i%3)*.04;this.ellipse(x,y,1.8,2,s.zone===0?'#d3edf0':s.zone===1?'#ffd9a1':s.zone===2?'#d6efaf':'#f8e8bd');}c.restore();}
  drawMinimap(s){const c=this.mctx,w=this.minimap.width,h=this.minimap.height,scaleX=w/worldBounds(s.area).width,scaleY=h/worldBounds(s.area).height;c.clearRect(0,0,w,h);if(this.cache.mini?.area!==s.area||this.cache.mini?.canvas.width!==w||this.cache.mini?.canvas.height!==h){const canvas=surface(w,h),ctx=canvas.getContext('2d');const area=AREA_BY_ID[s.area];if(area.tiles){for(const [i,t]of area.tiles.entries())ctx.drawImage(t.asset?this.assets[t.asset]:i?this.assets.quayGarden:this.assets[s.area],t.x*scaleX,t.y*scaleY,t.width*scaleX,t.height*scaleY);}else ctx.drawImage(this.assets[s.area],0,0,w,h);if(s.area==='highway')ctx.drawImage(this.assets.cityJoin,CITY_JOIN.x*scaleX,CITY_JOIN.y*scaleY,CITY_JOIN.width*scaleX,CITY_JOIN.height*scaleY);for(const j of area.joins||[])ctx.drawImage(this.assets[j.asset],j.x*scaleX,j.y*scaleY,j.width*scaleX,j.height*scaleY);ctx.fillStyle='#071b3077';ctx.fillRect(0,0,w,h);for(const o of arenaObstacles(s.area)){ctx.beginPath();ctx.ellipse(o.x*scaleX,o.y*scaleY,o.rx*scaleX,o.ry*scaleY,0,0,TAU);ctx.fillStyle='#1c3028cc';ctx.fill();ctx.strokeStyle='#e4ca9580';ctx.lineWidth=.8;ctx.stroke();}this.cache.mini?.canvas.close?.();this.cache.mini={canvas:freezeSurface(canvas),area:s.area};}c.drawImage(this.cache.mini.canvas,0,0);
    const marker=(point,color,r=3)=>{c.beginPath();c.arc(point.x*scaleX,point.y*scaleY,r,0,TAU);c.fillStyle=color;c.fill();c.strokeStyle='#071b25';c.lineWidth=1;c.stroke();};
    for(const r of s.world.relays)marker(r,r.status==='online'?'#b9e8c2':'#e8c682',4);for(const e of s.world.enemies.filter(e=>!e.dead&&e.awake))marker(e,ENEMIES[e.type].boss?'#ffdb82':'#ed8a72',ENEMIES[e.type].boss?5:2);if(s.world.gate)marker(s.world.gate,s.world.gate.open?'#ffedba':'#8b9ca2',4);if(s.world.camp)marker(s.world.camp,'#9ddec6',5);for(const m of s.world.camp?.services||[])marker(m,'#eccc92',3);for(const portal of this.visiblePortals||[])marker(portal,'#f1d08c',4);for(const loot of s.world.loot)marker(loot,'#d8b2ef',3);if(s.area==='highway')marker(NORA,s.quests?.noodstroom?.status==='ready'?'#fff1ab':'#e7c783',4);for(const point of QUARTER_POINTS[s.area]||[])if(!s.quests?.quarters?.seen.includes(point.id))marker(point,point.required?'#fff0aa':'#b5e2c5',point.required?3:2);const outdoor=OUTDOOR_REGIONS[s.area];if(outdoor){marker(outdoorPoint(s.area,outdoor.npcPoint),'#d4f0ad',4);marker(outdoorPoint(s.area,outdoor.door[1]),s.world.outdoor?.open?'#9be5ca':'#d39964',3);if(s.world.outdoor?.open)for(const q of outdoor.points)if(!s.world.outdoor.done.includes(q.id))marker(outdoorPoint(s.area,q.point),outdoor.color,3);}marker(s.player,'#e4fbfa',4);for(const peer of s.coop?.players||[])if(peer.player)marker(peer.player,'#ffe098',4);
    c.strokeStyle='#ecedbc66';c.lineWidth=1;c.strokeRect(this.camera.x*scaleX,this.camera.y*scaleY,this.viewWidth*scaleX,this.viewHeight*scaleY);
  }
}

Object.assign(Renderer.prototype,OutdoorVisuals,V6Visuals,CreatureVisuals,ExpeditionVisuals,EnemyCombatVisuals,QuestVisuals,EnemyAreaVisuals);

Object.assign(Renderer.prototype,QuarterVisuals);

Object.assign(Renderer.prototype,FeedbackVisuals);
