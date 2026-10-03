import {equipmentAppearance} from './appearance.js?v=27';
import {freezeSurface} from './render-cache.js?v=27';
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
 let cache=rasterCache.get(image);if(!cache){cache=new Map();rasterCache.set(image,cache);}if(cache.has(name))return cache.get(name);
 const [sx,sy,w,h]=frame.bounds,make=()=>{const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(w,h):document.createElement('canvas');c.width=w;c.height=h;return c.backing||c;},body=make(),lower=make(),c=body.getContext('2d');
 if(frame.clip?.length){c.beginPath();polygon(c,frame.clip);c.clip();}c.drawImage(image,sx,sy,w,h,0,0,w,h);
 const pixels=c.getImageData(0,0,w,h),coat=new Uint8Array(w*h),horizontal=new Uint8Array(w*h),coatMask=new Uint8Array(w*h),boots=lower.getContext('2d').createImageData(w,h);
 for(let i=0;i<w*h;i++){const at=i*4;coat[i]=pixels.data[at+3]>0&&pixels.data[at+1]>pixels.data[at]*1.15&&pixels.data[at+2]>pixels.data[at]*1.08?1:0;}
 // Separable dilation preserves the cloth mask with ten checks instead of 25.
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(let dx=-2;dx<=2;dx++)if(x+dx>=0&&x+dx<w&&coat[y*w+x+dx]){horizontal[y*w+x]=1;break;}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)for(let dy=-2;dy<=2;dy++)if(y+dy>=0&&y+dy<h&&horizontal[(y+dy)*w+x]){coatMask[y*w+x]=1;break;}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,cloth=!coatMask[y*w+x];
  if(cloth&&inside(x,y,leg)){boots.data.set(pixels.data.subarray(i,i+4),i);pixels.data[i+3]=0;}else if(cloth&&(inside(x,y,other)||y>h*.83))pixels.data[i+3]=0;
 }
 // Material shading is cached with the body; it never runs per frame.
 if(['heavy','filter'].includes(frame.clothStyle)){const rgb=frame.clothStyle==='heavy'?[157,123,66]:[105,132,73];for(let i=0;i<w*h;i++){const at=i*4;if(!coat[i]||!pixels.data[at+3])continue;const light=(pixels.data[at]+pixels.data[at+1]+pixels.data[at+2])/3/110;for(let k=0;k<3;k++)pixels.data[at+k]=Math.min(255,rgb[k]*light);}}
 c.putImageData(pixels,0,0);lower.getContext('2d').putImageData(boots,0,0);
 const split=rig.k[1]*h,thigh=make(),calf=make();
 for(const [canvas,rect]of [[thigh,[0,0,w,split+5]],[calf,[0,split-5,w,h]]]){const ctx=canvas.getContext('2d');ctx.beginPath();ctx.rect(...rect);ctx.clip();ctx.drawImage(lower,0,0);}
 const result={body:freezeSurface(body),thigh:freezeSurface(thigh),calf:freezeSurface(calf)};cache.set(name,result);return result;
}
const polygon=(c,points)=>{c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.closePath();};
export const WALK_CYCLE_DISTANCE=96;
export const WALK_STRIDE=18;
export const FOOT_STANCE=.375;
export function footCycle(phase){return [0,1].map(i=>{const t=((phase+i*.5)%1+1)%1;if(t<FOOT_STANCE)return {advance:1-t*2/FOOT_STANCE,lift:0,planted:true};const u=(t-FOOT_STANCE)/(1-FOOT_STANCE),s=u*u*(3-2*u);return {advance:-1+2*s,lift:Math.sin(u*Math.PI),planted:false};});}
export function heroRigPose(r,direction,p={}){const mirrored=direction>=5,index=mirrored?8-direction:direction,name=directions[index],appearance=equipmentAppearance(p),gear=r.heroGearCrop?.styles[appearance.armor],frame=gear?gear[index]:r.heroDirectionalCrop.directions[name][2],rig=frame.rig||spec[name];return {mirrored,index,name,rig,frame,appearance,scale:gear?r.heroGearCrop.scale:r.heroDirectionalCrop.scale,image:gear?r.assets['hero-'+appearance.armor]:r.assets.heroDirectional};}
export function prepareHeroRig(r){for(let d=0;d<5;d++){const {name,rig,frame,image}=heroRigPose(r,d),[,,w,h]=frame.bounds,px=q=>[q[0]*w,q[1]*h];rasterParts(r,name,frame,frame.leg||rig.leg.map(px),frame.other||rig.other.map(px),image,rig);}}
export function heroBodyMotion(p,index){const phase=(p.walkDistance||0)/WALK_CYCLE_DISTANCE,blend=p.visualMotionBlend??(p.moving?(p.walkBlend??1):0),dirX=Math.cos(index*Math.PI/4+Math.PI/2);return {x:(Math.sin(phase*Math.PI*2)*.8+dirX*1.4)*blend,y:-Math.abs(Math.sin(phase*Math.PI*2))*1.2*blend,rotation:blend*(.04*dirX+Math.sin(phase*Math.PI*2)*.025)+Math.sin(Math.min(1,(p.cast||0)/.18)*Math.PI)*.035};}
export function drawRiggedHero(r,p,direction,alpha=1){
 const {mirrored,index,name,rig,frame,scale,image,appearance}=heroRigPose(r,direction,p),c=r.ctx,[sx,sy,w,h]=frame.bounds,px=q=>[q[0]*w,q[1]*h],H=px(rig.h),K=px(rig.k),F=px(rig.f),leg=frame.leg||rig.leg.map(px),other=frame.other||rig.other.map(px),parts=rasterParts(r,name,frame,leg,other,image,rig);
 const phase=(p.walkDistance||0)/WALK_CYCLE_DISTANCE,cycle=footCycle(phase),angle=index*Math.PI/4+Math.PI/2,dir=[Math.cos(angle),Math.sin(angle)*.78],blend=p.visualMotionBlend??(p.moving?(p.walkBlend??1):0),bodyMotion=heroBodyMotion(p,index),bob=bodyMotion.y;
 const segment=(a,b,A,B,image)=>{c.save();c.translate(...A);c.rotate(Math.atan2(B[1]-A[1],B[0]-A[0]));c.scale(Math.hypot(B[0]-A[0],B[1]-A[1])/Math.hypot(b[0]-a[0],b[1]-a[1]),1);c.rotate(-Math.atan2(b[1]-a[1],b[0]-a[0]));c.translate(-a[0],-a[1]);c.drawImage(image,0,0);c.restore();};
 c.save();c.globalAlpha=alpha;c.translate(p.x,p.y);c.scale(mirrored?-scale:scale,scale);c.translate(-H[0],-frame.anchor[1]*h);
 for(const i of [1,0]){const side=(i?-1:1)*5/scale,contact=cycle[i],hip=[H[0]+side,H[1]+bob/scale],foot=[H[0]+side+(F[0]-H[0])*.28+dir[0]*contact.advance*WALK_STRIDE/scale*blend,frame.anchor[1]*h+dir[1]*contact.advance*WALK_STRIDE/scale*blend-contact.lift*4/scale*blend],joint=[hip[0]+(foot[0]-hip[0])*.48+dir[0]*contact.lift*3/scale*blend,hip[1]+(foot[1]-hip[1])*.48-contact.lift*1.5/scale*blend];c.save();if(i)c.globalAlpha*=.88;segment(H,K,hip,joint,parts.thigh);segment(K,F,joint,foot,parts.calf);c.restore();}
 c.save();c.translate(bodyMotion.x/scale,bodyMotion.y/scale);c.translate(...H);c.rotate(bodyMotion.rotation);c.translate(-H[0],-H[1]);c.drawImage(parts.body,0,0);if(frame.grip){drawEquipmentParts(r,p,index,frame,appearance,'weapon');drawWeaponHand(c,parts.body,frame);}if(frame.head)drawEquipmentParts(r,p,index,frame,appearance,'helmet');c.restore();c.restore();
}

// The staff is carried beside the body, with the painted glove over its shaft.
// Its lean and grip also drive the spell origin, including mirrored directions.
function focusTransform(r,index,frame,appearance){
 const crop=r.focusV8Crop?.[appearance.focus]?.[index];if(!frame.grip||!crop)return null;
 return {crop,grip:frame.grip,scale:310/crop.bounds[3],angle:frame.weaponLean||0};
}
function drawWeaponHand(c,body,frame){const [x,y]=frame.grip;c.save();c.beginPath();c.ellipse(x,y-3,8,12,0,0,Math.PI*2);c.clip();c.drawImage(body,0,0);c.restore();}
function drawEquipmentParts(r,p,index,frame,a,layer){
 const c=r.ctx;if(layer==='weapon'){const transform=focusTransform(r,index,frame,a);if(!transform)return;const {crop:f,grip,scale:s,angle}=transform,[x,y,w,h]=f.bounds;c.save();c.translate(...grip);c.rotate(angle);c.scale(s*.6,s);c.drawImage(r.assets.focusV8,x,y,w,h,-w*f.anchor[0],-h*f.anchor[1],w,h);if(a.legendary){c.strokeStyle='#f6d891';c.lineWidth=1.3/s;c.beginPath();c.ellipse(0,-h*.45,w*.34,7,0,0,Math.PI*2);c.stroke();}c.restore();
 }else if(a.helmet){const f=r.helmetV8Crop?.[a.helmet]?.[index];if(!f)return;const[x,y,w,h]=f.bounds,s=frame.headWidth/w;c.drawImage(r.assets.helmetsV8,x,y,w,h,frame.head[0]-w*f.anchor[0]*s,frame.head[1]-h*f.anchor[1]*s,w*s,h*s);}
}
export function gearFocusPoint(r,p,direction){const pose=heroRigPose(r,direction,p),transform=focusTransform(r,pose.index,pose.frame,pose.appearance);if(!transform)return pose.frame.focus;const {crop:f,grip,scale,angle}=transform,[,,w,h]=f.bounds,dx=(f.tip[0]-w*f.anchor[0])*scale*.6,dy=(f.tip[1]-h*f.anchor[1])*scale;return [grip[0]+dx*Math.cos(angle)-dy*Math.sin(angle),grip[1]+dx*Math.sin(angle)+dy*Math.cos(angle)];}
