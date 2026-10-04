// Standard Gamepad mapping: Xbox, and other pads mapped by the browser.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function stickVector(x=0,y=0,deadzone=.18){
 x=Number.isFinite(x)?clamp(x,-1,1):0;y=Number.isFinite(y)?clamp(y,-1,1):0;
 const length=Math.hypot(x,y);if(length<=deadzone)return {x:0,y:0};
 const size=clamp((length-deadzone)/(1-deadzone),0,1);return {x:x/length*size,y:y/length*size};
}
const blank=()=>({connected:false,active:false,lost:false,move:{x:0,y:0},aim:null,shoot:false,right:false,slots:[],actions:[],nav:null,accept:false,back:false,pause:false,scroll:0});
export class ControllerInput{
 constructor(){this.active=false;this.index=null;this.previous=[];this.blocked=true;this.context=null;this.navDirection=null;this.repeatAt=0;this.focused=true;this.available=false;}
 mouse(){this.active=false;}
 suspend(){this.focused=false;this.blocked=true;this.previous=[];}
 resume(){this.focused=true;this.blocked=true;}
 poll(navigator,{controls='auto',deadzone=.18,context='game',hidden=false}={},now=0){
  const result=blank(),wasActive=this.active,wasAvailable=this.available;let pads=[];
  try{pads=Array.from(navigator?.getGamepads?.()||[]);}catch{result.reason='Browser geeft geen controllertoegang';}
  const candidates=pads.filter(p=>p?.connected!==false&&p?.mapping==='standard'&&p.axes?.length>=4&&p.buttons?.length>=16);
  const pad=candidates.find(p=>p.index===this.index)||candidates[0];this.available=!!pad;
  if(!pad||controls==='keyboard'){
   result.lost=wasAvailable&&wasActive&&!pad;this.index=null;this.previous=[];this.active=false;this.blocked=true;this.navDirection=null;
   result.reason||=pads.some(Boolean)?'Controller heeft geen standaard knopindeling':'Druk op een controllerknop om te verbinden';return result;
  }
  result.connected=true;
  if(this.index!==pad.index){this.index=pad.index;this.previous=[];this.blocked=true;}
  const buttons=pad.buttons.map(b=>b?.pressed===true||Number(b?.value)>.5),held=i=>!!buttons[i],edge=i=>held(i)&&!this.previous[i];
  const move=stickVector(pad.axes[0],pad.axes[1],deadzone),aim=stickVector(pad.axes[2],pad.axes[3],deadzone);
  if(controls==='controller'||buttons.some(Boolean)||Math.hypot(move.x,move.y)>0||Math.hypot(aim.x,aim.y)>0)this.active=true;
  result.active=this.active;
  if(context!==this.context){this.context=context;this.blocked=true;this.navDirection=null;}
  if(hidden||!this.focused){this.blocked=true;this.previous=buttons;return result;}
  if(this.blocked){if(!buttons.some(Boolean))this.blocked=false;this.previous=buttons;return result;}
  if(!this.active){this.previous=buttons;return result;}
  const menuChord=held(4)&&held(5)&&(edge(4)||edge(5));result.pause=edge(9)||menuChord;
  if(context==='game'){
   result.move=move;result.aim=Math.hypot(aim.x,aim.y)>.01?aim:null;result.shoot=held(7);result.right=held(6);
   const slots=held(4)?[[12,4],[15,5]]:[[12,0],[15,1],[13,2],[14,3]];for(const [button,slot]of slots)if(held(button))result.slots.push(slot);
   if(edge(0))result.actions.push(held(4)?'map':'interact');if(edge(1))result.actions.push('dash');if(edge(2))result.actions.push('heal');if(edge(3))result.actions.push('ultimate');
   if(edge(5)&&!held(4))result.actions.push('antidote');if(edge(10))result.actions.push('equipment');if(edge(11))result.actions.push('skills');if(edge(8))result.actions.push('map');
   if(held(4)&&edge(13))result.actions.push('command');if(held(4)&&edge(14))result.actions.push('quest');
  }else{
   result.accept=edge(0);result.back=edge(1);result.scroll=aim.y;
   let nav=held(12)?'up':held(13)?'down':held(14)?'left':held(15)?'right':null;
   if(!nav&&Math.hypot(move.x,move.y)>.55)nav=Math.abs(move.y)>=Math.abs(move.x)?move.y<0?'up':'down':move.x<0?'left':'right';
   if(nav!==this.navDirection){this.navDirection=nav;this.repeatAt=now+320;result.nav=nav;}else if(nav&&now>=this.repeatAt){result.nav=nav;this.repeatAt=now+170;}
  }
  this.previous=buttons;return result;
 }
}

function visible(node,root){if(node.disabled)return false;for(let n=node;n;n=n.parentElement||n.parent){if(n.hidden||n.getAttribute?.('aria-hidden')==='true')return false;if(n===root)break;}return true;}
export function menuControls(root){return [...root.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href]')].filter(n=>visible(n,root));}
export function focusMenu(root,document,direction){
 const items=menuControls(root);if(!items.length)return;const current=document.activeElement,index=items.indexOf(current);
 if(index<0){items[0].focus();return items[0];}
 // Selects and sliders are edited with left/right; up/down leaves the control.
 if(['left','right'].includes(direction)&&['SELECT','INPUT'].includes(current.tagName)){
  const delta=direction==='left'?-1:1;
  if(current.tagName==='SELECT'){
   const options=[...current.querySelectorAll('option')].filter(o=>!o.disabled),at=options.findIndex(o=>o.value===current.value);const option=options[clamp(at+delta,0,options.length-1)];if(option&&option.value!==current.value){current.value=option.value;current.dispatchEvent(new Event('change',{bubbles:true}));}return current;
  }
  if(['range','number'].includes(current.type)){const min=Number(current.getAttribute('min')||0),max=Number(current.getAttribute('max')||100),step=Number(current.getAttribute('step')||1);current.value=String(clamp(Number(current.value)+delta*step,min,max));current.dispatchEvent(new Event('input',{bubbles:true}));current.dispatchEvent(new Event('change',{bubbles:true}));return current;}
 }
 // DOM order follows the menu's reading order, including long shop inventories.
 const next=items[(index+(['up','left'].includes(direction)?-1:1)+items.length)%items.length];next.focus();next.scrollIntoView?.({block:'nearest',inline:'nearest'});return next;
}
export function confirmMenu(root,document){const items=menuControls(root),current=document.activeElement;if(!items.includes(current)){items[0]?.focus();return;}if(current.tagName==='SELECT')return;current.click?.();}
export function controllerTarget(player,aim,lastAim=player.aim||{x:1,y:0}){
 const vector=aim||lastAim,length=Math.hypot(vector.x,vector.y)||1,reach=aim?240+280*Math.min(1,length):clamp(player.aimRange||400,240,520);
 return {x:player.x+vector.x/length*reach,y:player.y+vector.y/length*reach/1.15};
}
