import {surface,freezeSurface} from './render-cache.js?v=30';
import {advanceFeedback} from './combat-feedback.js?v=30';
export function updateEnemyMotion(e,dx,dy,dt){
 advanceFeedback(e,dt);
 const moved=Math.hypot(dx,dy/.78),walking=moved>dt*3&&!e.leap&&!e.rush&&!e.burrow;
 e.faceHold=Math.max(0,(e.faceHold||0)-dt);
 if(walking){e.walkDistance=(e.walkDistance||0)+moved;if(Math.abs(dx)>dt*12&&e.faceHold<=0){const face=dx<0?-1:1;if(face!==e.travelFacing)e.faceHold=.18;e.travelFacing=face;}}
 const target=walking?1:0;e.motionBlend=(e.motionBlend||0)+(target-(e.motionBlend||0))*(1-Math.exp(-dt*12));
 e.attackRelease=Math.max(0,(e.attackRelease||0)-dt);
}
export function enemyPose(e,time=0){
 if(e.type==='hunter'&&e.windup?.mode==='huntShots')return {frame:1,blend:0};
 if(e.type==='hunter'&&e.attackRelease>0&&e.lastAttack==='huntShots')return {frame:3,blend:0};
 if(e.windup){const elapsed=e.windup.total-e.windup.timer;if(Number.isFinite(elapsed)&&elapsed<.12)return {frame:0,next:4,blend:Math.max(0,elapsed/.12)};return {frame:4,blend:0};}
 if(e.attackRelease>0){const elapsed=.32-e.attackRelease;if(elapsed<.055)return {frame:4,next:5,blend:Math.max(0,elapsed/.055)};if(e.attackRelease<.11)return {frame:5,next:0,blend:1-e.attackRelease/.11};return {frame:5,blend:0};}
 const phase=e.type==='stormnest'?time*1.2:(e.walkDistance||0)/155*4;
 if(!(e.motionBlend>.05)&&e.type!=='stormnest')return {frame:0,blend:0};
 return {frame:Math.floor(phase)%4,blend:phase%1};
}
export function drawAnimatedEnemy(r,e,base,time,asset=r.assets.enemyAnimation,spec=r.enemyAnimationCrop?.enemies[e.type]){if(!spec)return false;
 const pose=enemyPose(e,time),{frame,blend}=pose,next=pose.next??(frame+1)%4,face=e.windup?e.windup.dir.x<0:e.motionBlend>.05?e.travelFacing<0:Math.cos(e.angle)<0;
 const scale=base.size/spec.scaleDenominator*(e.elite?1.18:1),jump=e.jumpHeight||0;
 const draw=(i,a)=>{const crop=spec.frames[i];r.sprite(asset,crop,e.x,e.y-jump,crop.bounds[3]*scale,face,0,a);};
 if(blend>.001){
  // Bake each short transition once. A tight, bounded atlas cache avoids
  // clearing/redrawing a 768x512 surface for every enemy on every frame.
  r.enemyPoseTiles||=new Map();r.enemyPosePixels||=0;
  const step=Math.round(blend*8),key=(base.v6row!==undefined?'v7:':'v5:')+e.type+':'+frame+':'+next+':'+step;let tile=r.enemyPoseTiles.get(key);
  if(!tile){const a=spec.frames[frame],b=spec.frames[next],left=Math.min(-a.anchor[0]*a.bounds[2],-b.anchor[0]*b.bounds[2]),top=Math.min(-a.anchor[1]*a.bounds[3],-b.anchor[1]*b.bounds[3]),right=Math.max((1-a.anchor[0])*a.bounds[2],(1-b.anchor[0])*b.bounds[2]),bottom=Math.max((1-a.anchor[1])*a.bounds[3],(1-b.anchor[1])*b.bounds[3]),ratio=Math.min(1,300/(bottom-top)),canvas=surface((right-left)*ratio,(bottom-top)*ratio),c=canvas.getContext('2d');c.scale(ratio,ratio);
   const pose=(crop,alpha)=>{const [x,y,w,h]=crop.bounds;c.globalAlpha=alpha;c.drawImage(asset,x,y,w,h,-crop.anchor[0]*w-left,-crop.anchor[1]*h-top,w,h);};c.globalCompositeOperation='source-over';pose(a,1-step/8);c.globalCompositeOperation='lighter';pose(b,step/8);tile={canvas:freezeSurface(canvas),left,top,width:right-left,height:bottom-top,pixels:canvas.width*canvas.height};r.enemyPoseTiles.set(key,tile);r.enemyPosePixels+=tile.pixels;
   while(r.enemyPosePixels>12000000&&r.enemyPoseTiles.size>1){const oldest=r.enemyPoseTiles.keys().next().value,old=r.enemyPoseTiles.get(oldest);old.canvas.close?.();r.enemyPosePixels-=old.pixels;r.enemyPoseTiles.delete(oldest);}
  }else{r.enemyPoseTiles.delete(key);r.enemyPoseTiles.set(key,tile);}
  const target=r.ctx;target.save();target.translate(e.x,e.y-jump);target.scale(face?-scale:scale,scale);target.drawImage(tile.canvas,tile.left,tile.top,tile.width,tile.height);target.restore();
 }else draw(frame,1);
 return true;
}
