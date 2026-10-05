// Each finger owns one control. Releasing a spell never releases the move stick.
import {assistedTarget} from './aim.js?v=40';
export function detectTouchDevice(environment=globalThis){
 return /Android|iPhone|iPad/i.test(environment.navigator?.userAgent||'')||Boolean(environment.matchMedia?.('(pointer: coarse)')?.matches);
}
export function touchVector(dx,dy,radius,deadzone=.12){
 const length=Math.hypot(dx,dy),size=Math.min(1,length/Math.max(1,radius));
 if(!Number.isFinite(length)||size<=deadzone)return {x:0,y:0};
 const strength=(size-deadzone)/(1-deadzone);return {x:dx/length*strength,y:dy/length*strength};
}
export function touchTarget(player,vector){
 const v=vector||player.aim||{x:1,y:0},len=Math.hypot(v.x,v.y)||1;
 const reach=vector?150+370*Math.min(1,len):Math.max(150,Math.min(520,player.aimRange||400));
 return {x:player.x+v.x/len*reach,y:player.y+v.y/len*reach/1.15};
}
// The attack button and spell taps keep the original mobile assistance.
// Only an explicitly dragged spell overrides it with a manual direction.
export function touchCombatTarget(player,enemies,vector=null){return vector?touchTarget(player,vector):assistedTarget(player,enemies);}
export class TouchInput{
 constructor(){this.contacts=new Map();this.lastAim=null;}
 begin(role,id,x,y,center,radius){
  if(this.contacts.has(id)||[...this.contacts.values()].some(c=>c.role===role)||role.startsWith('cast:')&&this.preview)return false;
  this.contacts.set(id,{role,center,radius,start:{x,y},vector:{x:0,y:0},dragged:false});this.move(id,x,y);return true;
 }
 move(id,x,y){
  const c=this.contacts.get(id);if(!c)return false;
  const casting=c.role.startsWith('cast:'),dx=x-(casting?c.start.x:c.center.x),dy=y-(casting?c.start.y:c.center.y);
  c.vector=touchVector(dx,dy,c.radius);if(casting&&Math.hypot(dx,dy)>12)c.dragged=true;
  if(casting&&c.dragged&&Math.hypot(c.vector.x,c.vector.y)>.01)this.lastAim={...c.vector};return true;
 }
 end(id,cancel=false){
  const c=this.contacts.get(id);if(!c)return null;this.contacts.delete(id);
  return !cancel&&c.role.startsWith('cast:')?{binding:c.role.slice(5),aim:c.dragged?{...(Math.hypot(c.vector.x,c.vector.y)>.01?c.vector:this.lastAim)}:null}:null;
 }
 get movement(){return [...this.contacts.values()].find(c=>c.role==='move')?.vector||{x:0,y:0};}
 get shooting(){return [...this.contacts.values()].some(c=>c.role==='fire');}
 get preview(){return [...this.contacts.values()].find(c=>c.role.startsWith('cast:'))||null;}
 get aiming(){const preview=this.preview;return preview?.dragged?(Math.hypot(preview.vector.x,preview.vector.y)>.01?preview.vector:this.lastAim):null;}
 reset(){this.contacts.clear();this.lastAim=null;}
}
export function bindTouchControl(element,input,role,{enabled,onStart=()=>{},onCast=()=>{},onChange=()=>{}}){
 const update=e=>{if(input.move(e.pointerId,e.clientX,e.clientY))onChange();};
 element.addEventListener('pointerdown',e=>{
  if(!enabled()||e.pointerType==='mouse'&&e.button!==0)return;
  const rect=element.getBoundingClientRect(),radius=role.startsWith('cast:')?58:rect.width*.32;
  if(!input.begin(role,e.pointerId,e.clientX,e.clientY,{x:rect.left+rect.width/2,y:rect.top+rect.height/2},radius))return;
  e.preventDefault();element.setPointerCapture(e.pointerId);element.classList.add('touch-held');onStart();onChange();
 });
 element.addEventListener('pointermove',update);
 element.addEventListener('contextmenu',e=>{if(enabled())e.preventDefault();});
 const release=(e,cancel)=>{if(input.contacts.get(e.pointerId)?.role!==role)return;const result=input.end(e.pointerId,cancel);element.classList.remove('touch-held');onChange();if(result)onCast(result);};
 element.addEventListener('pointerup',e=>{update(e);release(e,false);});
 for(const event of ['pointercancel','lostpointercapture'])element.addEventListener(event,e=>release(e,true));
 // Touch casts happen on release; suppress the compatibility click to avoid a double cast.
 element.addEventListener('click',e=>{if(enabled()){e.preventDefault();e.stopImmediatePropagation();}});
}
