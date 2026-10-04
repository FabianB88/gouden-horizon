import {equipmentAppearance} from './appearance.js?v=36';
import {freezeSurface} from './render-cache.js?v=36';
// Painted bind poses retain the eight camera directions. Both legs are driven
// by opposite foot contacts. Traced cloth masks remove the bind-pose legs,
// while preserving the coat. Short, forward knee paths avoid lateral IK bends.
const spec={
 south:{h:[.45,.65],k:[.45,.81],f:[.46,.98],leg:[[.32,.60],[.54,.63],[.54,.79],[.53,1],[.34,1],[.32,.80]],other:[[.53,.63],[.68,.65],[.68,.86],[.53,.87],[.50,.77]]},
 southwest:{h:[.48,.64],k:[.41,.80],f:[.30,.97],leg:[[.32,.61],[.54,.65],[.50,.82],[.44,.92],[.38,1],[.18,1],[.16,.91],[.30,.82]],other:[[.53,.64],[.72,.68],[.75,.89],[.58,.90],[.53,.79]]},
 west:{h:[.48,.65],k:[.45,.81],f:[.34,.97],leg:[[.36,.61],[.56,.65],[.52,.83],[.46,.94],[.42,1],[.27,1],[.24,.93],[.36,.82]],other:[[.55,.64],[.74,.68],[.78,.89],[.59,.90],[.53,.80]]},
 northwest:{h:[.42,.70],k:[.44,.83],f:[.48,.98],leg:[[.32,.67],[.53,.71],[.57,1],[.38,1],[.29,.91],[.30,.78]],other:[[.57,.72],[.75,.75],[.77,.92],[.61,.94],[.54,.82]]},
 north:{h:[.49,.73],k:[.49,.86],f:[.50,.98],leg:[[.38,.69],[.62,.73],[.63,1],[.39,1],[.34,.87]],other:[[.28,.69],[.43,.70],[.46,.87],[.35,.90],[.26,.81]]}
};
const directions=['south','southwest','west','northwest','north','northeast','east','southeast'];
const rasterCache=new WeakMap();
function inside(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
function rasterParts(r,name,frame,leg,other,image=r.assets.heroDirectional,rig=spec[name]){
 let cache=rasterCache.get(image);if(!cache){cache=new Map();rasterCache.set(image,cache);}const cacheKey=name+':'+(frame.clothStyle||'base');if(cache.has(cacheKey))return cache.get(cacheKey);
 const [sx,sy,w,h]=frame.bounds,make=()=>{const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(w,h):document.createElement('canvas');c.width=w;c.height=h;return c.backing||c;},body=make(),lower=make(),c=body.getContext('2d');
 if(frame.clip?.length){c.beginPath();polygon(c,frame.clip);c.clip();}c.drawImage(image,sx,sy,w,h,0,0,w,h);
 const pixels=c.getImageData(0,0,w,h),coat=new Uint8Array(w*h),horizontal=new Uint8Array(w*h),coatMask=new Uint8Array(w*h),boots=lower.getContext('2d').createImageData(w,h);
 for(let i=0;i<w*h;i++){const at=i*4;coat[i]=pixels.data[at+3]>0&&(frame.classBaseStyle?(pixels.data[at+2]>pixels.data[at]*1.12&&pixels.data[at+1]>pixels.data[at]*.8||pixels.data[at+1]>pixels.data[at]*1.05&&pixels.data[at+2]>pixels.data[at]*.8):pixels.data[at+1]>pixels.data[at]*1.15&&pixels.data[at+2]>pixels.data[at]*1.08)?1:0;}
 // Charcoal fitted leggings must move with the legs, rather than being
 // mistaken for blue coat cloth and left behind as a second static limb.
 if(frame.tailoredCloth)for(let i=0;i<w*h;i++){const at=i*4;if(pixels.data[at+2]-pixels.data[at]<12&&pixels.data[at+1]-pixels.data[at]<12)coat[i]=0;}
 // Separable dilation preserves the cloth mask with ten checks instead of 25.
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(let dx=-2;dx<=2;dx++)if(x+dx>=0&&x+dx<w&&coat[y*w+x+dx]){horizontal[y*w+x]=1;break;}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(let dy=-2;dy<=2;dy++)if(y+dy>=0&&y+dy<h&&horizontal[(y+dy)*w+x]){coatMask[y*w+x]=1;break;}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,cloth=!coatMask[y*w+x];
  if(cloth&&inside(x,y,leg)){boots.data.set(pixels.data.subarray(i,i+4),i);if(y>=(frame.bodyCut||0))pixels.data[i+3]=0;}else if(cloth&&(inside(x,y,other)||y>h*.83)&&y>=(frame.bodyCut||0))pixels.data[i+3]=0;
 }
 // Material shading is cached with the body; it never runs per frame.
 if(frame.classBaseStyle?frame.clothStyle!==frame.classBaseStyle:['heavy','filter'].includes(frame.clothStyle)){const rgb=({light:[83,133,135],heavy:[157,123,66],filter:[105,132,73],storm:[77,112,157]})[frame.clothStyle];for(let i=0;i<w*h;i++){const at=i*4;if(!coat[i]||!pixels.data[at+3])continue;const light=(pixels.data[at]+pixels.data[at+1]+pixels.data[at+2])/3/110;for(let k=0;k<3;k++)pixels.data[at+k]=Math.min(255,rgb[k]*light);}}
 c.putImageData(pixels,0,0);lower.getContext('2d').putImageData(boots,0,0);
 const result={body};
 if(!frame.classBaseStyle){const split=rig.k[1]*h,thigh=make(),calf=make();for(const [canvas,rect]of [[thigh,[0,0,w,split+5]],[calf,[0,split-5,w,h]]]){const ctx=canvas.getContext('2d');ctx.beginPath();ctx.rect(...rect);ctx.clip();ctx.drawImage(lower,0,0);}result.thigh=freezeSurface(thigh);result.calf=freezeSurface(calf);}
 if(frame.classBaseStyle){
  // Each painted leg keeps its own anatomy. The boot sole is a rigid piece,
  // so a bent shin can never stretch or turn a foot into a sideways paddle.
  const original=make(),oc=original.getContext('2d');oc.drawImage(image,sx,sy,w,h,0,0,w,h);const source=oc.getImageData(0,0,w,h),cut=frame.limbRig.h[1]+10;
  const bodyPixels=c.getImageData(0,0,w,h);for(let y=cut;y<h;y++)for(let x=0;x<w;x++)if(!coatMask[y*w+x]&&(inside(x,y,leg)||inside(x,y,other)||y>h*.83))bodyPixels.data[(y*w+x)*4+3]=0;c.putImageData(bodyPixels,0,0);result.body=freezeSurface(body);
  result.legs=frame.legs.map((limb,i)=>{const lc=make(),ctx=lc.getContext('2d'),data=ctx.createImageData(w,h),poly=limb.copy?leg:i?other:leg;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!coatMask[y*w+x]&&inside(x,y,poly)){const at=(y*w+x)*4;data.data.set(source.data.subarray(at,at+4),at);}ctx.putImageData(data,0,0);
   const ankle=limb.f[1]-42,x=Math.floor(Math.min(...poly.map(p=>p[0])))-2,width=Math.ceil(Math.max(...poly.map(p=>p[0])))-x+2,minY=Math.floor(Math.min(...poly.map(p=>p[1]))),maxY=Math.ceil(Math.max(...poly.map(p=>p[1]))),ranges=[[minY,ankle+6],[ankle-3,maxY+2]],layers=ranges.map(([y,end])=>{const part=make();part.width=width;part.height=Math.max(1,Math.ceil(end-y));part.getContext('2d').drawImage(lc,x,y,width,part.height,0,0,width,part.height);return {image:freezeSurface(part),x,y};});return {rig:limb,ankle:[limb.k[0],ankle],upper:layers[0],foot:layers[1]};
  });
 }
 if(!frame.classBaseStyle)result.body=freezeSurface(body);
 cache.set(cacheKey,result);while(cache.size>10){const key=cache.keys().next().value,old=cache.get(key);for(const value of Object.values(old))value.close?.();for(const limb of old.legs||[])for(const key of ['upper','foot'])limb[key].image.close?.();cache.delete(key);}return result;
}
const polygon=(c,points)=>{c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.closePath();};
export const WALK_CYCLE_DISTANCE=96;
export const WALK_STRIDE=12;
export const FOOT_STANCE=.25;
export function footCycle(phase){return [0,1].map(i=>{const t=((phase+i*.5)%1+1)%1;if(t<FOOT_STANCE)return {advance:1-t*2/FOOT_STANCE,lift:0,planted:true};const u=(t-FOOT_STANCE)/(1-FOOT_STANCE),s=u*u*(3-2*u);return {advance:-1+2*s,lift:Math.sin(u*Math.PI),planted:false};});}
export function heroRigPose(r,direction,p={}){const mirrored=direction>=5,index=mirrored?8-direction:direction,name=directions[index],appearance=equipmentAppearance(p),classes=r.heroClassCrop?.classes[appearance.visualKey]||r.heroClassCrop?.classes[appearance.identity],gear=r.heroGearCrop?.styles[appearance.armor],frame=classes?{...classes[index],clothStyle:appearance.armor}:gear?gear[index]:r.heroDirectionalCrop.directions[name][2],rig=frame.rig||spec[name];return {mirrored,index,name,rig,frame,appearance,scale:frame.scale||(gear?r.heroGearCrop.scale:r.heroDirectionalCrop.scale),image:classes?(r.assets['hero-class-'+appearance.visualKey]||r.assets['hero-class-'+appearance.identity]):gear?r.assets['hero-'+appearance.armor]:r.assets.heroDirectional};}
export async function prepareHeroRig(r){
 const costumes=r.heroClassCrop?Object.entries({elementalist:'storm',builder:'filter',hunter:'light'}).flatMap(([id,armor])=>['male','female'].map(gender=>[id,armor,gender])):['light','heavy','filter','storm'].map(a=>[null,a,null]);
 for(const [characterClass,armor,heroGender]of costumes){for(let d=0;d<5;d++){const {name,rig,frame,image}=heroRigPose(r,d,{characterClass,heroGender,equipment:{suit:{appearance:armor}}}),[,,w,h]=frame.bounds,px=q=>[q[0]*w,q[1]*h];rasterParts(r,name,frame,frame.leg||rig.leg.map(px),frame.other||rig.other.map(px),image,rig);}await new Promise(resolve=>setTimeout(resolve,0));}
}
export function heroBodyMotion(p,index){
 const phase=(p.walkDistance||0)/WALK_CYCLE_DISTANCE*2*Math.PI,blend=p.visualMotionBlend??(p.moving?(p.walkBlend??1):0),angle=index*Math.PI/4+Math.PI/2,dx=Math.cos(angle),dy=Math.sin(angle)*.78;
 // Alternating foot contacts carry the hips; shoulders counter the step.
 // A cast briefly shifts weight away from the staff, then settles. Feet stay
 // on the same planted cycle, including while moving and casting together.
 const cast=Math.min(1,(p.cast||0)/.18),recoil=Math.sin(cast*Math.PI)*1.8;
 return {x:(Math.sin(phase)*.65+dx*.9)*blend-dx*recoil,y:-Math.abs(Math.sin(phase))*1.05*blend-dy*recoil*.4,rotation:blend*(dx*.025-Math.sin(phase)*.018)-dx*recoil*.012};
}
export function drawRiggedHero(r,p,direction,alpha=1){
 const {mirrored,index,name,rig,frame,scale,image,appearance}=heroRigPose(r,direction,p),c=r.ctx,[sx,sy,w,h]=frame.bounds,px=q=>[q[0]*w,q[1]*h],H=px(rig.h),K=px(rig.k),F=px(rig.f),leg=frame.leg||rig.leg.map(px),other=frame.other||rig.other.map(px),parts=rasterParts(r,name,frame,leg,other,image,rig);
 const phase=(p.walkDistance||0)/WALK_CYCLE_DISTANCE,cycle=footCycle(phase),angle=index*Math.PI/4+Math.PI/2,dir=p.moving&&p.motionVelocity?[(mirrored?-1:1)*p.motionVelocity.x,p.motionVelocity.y]:[Math.cos(angle),Math.sin(angle)*.78],blend=p.visualMotionBlend??(p.moving?(p.walkBlend??1):0),bodyMotion=heroBodyMotion(p,index),bob=bodyMotion.y;
 const stamp=image=>image.image?c.drawImage(image.image,image.x,image.y):c.drawImage(image,0,0),segment=(a,b,A,B,image)=>{c.save();c.translate(...A);c.rotate(Math.atan2(B[1]-A[1],B[0]-A[0]));c.scale(Math.hypot(B[0]-A[0],B[1]-A[1])/Math.hypot(b[0]-a[0],b[1]-a[1]),1);c.rotate(-Math.atan2(b[1]-a[1],b[0]-a[0]));c.translate(-a[0],-a[1]);stamp(image);c.restore();};
 c.save();c.globalAlpha*=alpha;c.translate(p.x,p.y);c.scale(mirrored?-scale:scale,scale);c.translate(-H[0],-frame.anchor[1]*h);
 for(const i of [1,0]){
  const contact=cycle[i];
  if(parts.legs){
   // A single rigid painted leg replaces the stretchy knee/shin transforms.
   // Small depth shifts tuck under the coat; boot soles never rotate or scale.
   const limb=parts.legs[i],lr=limb.rig,offset=lr.offset||[0,0],motion=paintedLegMotion(lr.h,limb.ankle,contact,dir,blend,scale);
   c.save();if(i)c.globalAlpha*=.96;c.translate(offset[0],offset[1]+motion.depth);c.translate(...lr.h);c.rotate(motion.angle);c.translate(-lr.h[0],-lr.h[1]);stamp(limb.upper);c.restore();
   c.save();if(i)c.globalAlpha*=.96;c.translate(offset[0]+motion.footX,offset[1]+motion.footY);stamp(limb.foot);c.restore();
  }else{const side=(i?-1:1)*5/scale,hip=[H[0]+side,H[1]+bob/scale],foot=[H[0]+side+(F[0]-H[0])*.28+dir[0]*contact.advance*WALK_STRIDE/scale*blend,frame.anchor[1]*h+dir[1]*contact.advance*WALK_STRIDE/scale*blend-contact.lift*3/scale*blend],joint=[hip[0]+(foot[0]-hip[0])*.48+dir[0]*contact.lift*3/scale*blend,hip[1]+(foot[1]-hip[1])*.48-contact.lift*1.5/scale*blend];c.save();if(i)c.globalAlpha*=.88;segment(frame.limbRig?.h||H,frame.limbRig?.k||K,hip,joint,parts.thigh);segment(frame.limbRig?.k||K,frame.limbRig?.f||F,joint,foot,parts.calf);c.restore();}
 }
 c.save();c.translate(bodyMotion.x/scale,bodyMotion.y/scale);c.translate(...H);c.rotate(bodyMotion.rotation);c.translate(-H[0],-H[1]);c.drawImage(parts.body,0,0);if(frame.grip){drawEquipmentParts(r,p,index,frame,appearance,'weapon');drawWeaponHand(c,parts.body,frame);}if(frame.head)drawEquipmentParts(r,p,index,frame,appearance,'helmet');c.restore();c.restore();
}

// The staff is carried beside the body, with the painted glove over its shaft.
// Its lean and grip also drive the spell origin, including mirrored directions.
function focusTransform(r,index,frame,appearance){
 const crop=r.focusV8Crop?.[appearance.focus]?.[index];if(!frame.grip||!crop)return null;
 return {crop,grip:frame.grip,scale:118.42/(frame.scale||r.heroGearCrop?.scale||.382)/crop.bounds[3],angle:frame.weaponLean||0};
}
function drawWeaponHand(c,body,frame){const [x,y]=frame.grip;c.save();c.beginPath();c.ellipse(x,y-3,8,12,0,0,Math.PI*2);c.clip();c.drawImage(body,0,0);c.restore();}
export function paintedLegMotion(hip,ankle,contact,dir,blend,scale){
 const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1],length=Math.hypot(dx,dy),footX=dir[0]*contact.advance*WALK_STRIDE/scale*blend;
 // Drive the rigid leg from the same travel-matched foot contact as the gait.
 // Its ankle and rigid boot share a position, including diagonal movement.
 const angle=Math.asin(Math.max(-.95,Math.min(.95,dx/length)))-Math.asin(Math.max(-.95,Math.min(.95,(dx+footX)/length)));
 const footY=(dir[1]*contact.advance*WALK_STRIDE-contact.lift*3)/scale*blend;
 const depth=footY-(dx*Math.sin(angle)+dy*Math.cos(angle)-dy);
 return {angle,depth,footX,footY};
}
export function helmetTransform(frame,crop,index){
 const [,,w,h]=crop.bounds,scale=frame.headWidth*1.32/w,anchorX=[.5,.59,.63,.53,.5][index];
 return {x:frame.head[0]-w*anchorX*scale,y:frame.head[1]+36-h*.58*scale,width:w*scale,height:h*scale};
}
function drawEquipmentParts(r,p,index,frame,a,layer){
 const c=r.ctx;if(layer==='weapon'){const transform=focusTransform(r,index,frame,a);if(!transform)return;const {crop:f,grip,scale:s,angle}=transform,[x,y,w,h]=f.bounds;c.save();c.translate(...grip);c.rotate(angle);c.scale(s*.6,s);c.drawImage(r.assets.focusV8,x,y,w,h,-w*f.anchor[0],-h*f.anchor[1],w,h);if(a.legendary){c.strokeStyle='#f6d891';c.lineWidth=1.3/s;c.beginPath();c.ellipse(0,-h*.45,w*.34,7,0,0,Math.PI*2);c.stroke();}c.restore();
 }else if(a.helmet){const f=r.helmetV8Crop?.[a.helmet]?.[index];if(!f)return;const[x,y,w,h]=f.bounds,t=helmetTransform(frame,f,index);c.drawImage(r.assets.helmetsV8,x,y,w,h,t.x,t.y,t.width,t.height);}
}
export function gearFocusPoint(r,p,direction){const pose=heroRigPose(r,direction,p),transform=focusTransform(r,pose.index,pose.frame,pose.appearance);if(!transform)return pose.frame.focus;const {crop:f,grip,scale,angle}=transform,[,,w,h]=f.bounds,dx=(f.tip[0]-w*f.anchor[0])*scale*.6,dy=(f.tip[1]-h*f.anchor[1])*scale;return [grip[0]+dx*Math.cos(angle)-dy*Math.sin(angle),grip[1]+dx*Math.sin(angle)+dy*Math.cos(angle)];}
