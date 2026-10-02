// Reuse painted cutouts and soft lighting. Canvas filters and clipping paths
// otherwise create intermediate layers on every frame, including safe hubs.
export const MAX_RENDER_PIXELS=2500000;
export function renderRatio(width,height,dpr=1){return Math.min(1.5,dpr,Math.sqrt(MAX_RENDER_PIXELS/Math.max(1,width*height)));}
export function surface(width,height){
 const canvas=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(Math.ceil(width),Math.ceil(height)):document.createElement('canvas');
 canvas.width=Math.ceil(width);canvas.height=Math.ceil(height);return canvas.backing||canvas;
}
export function freezeSurface(canvas){return canvas.transferToImageBitmap?.()||canvas;}
export class RenderCache{
 constructor(){this.sprites=new WeakMap();this.labels=new Map();this.glows=new Map();this.vignette=null;this.mini=null;}
 sprite(image,source,filter='none'){
  if(!source.clip?.length&&(!filter||filter==='none'))return null;
  let sources=this.sprites.get(image);if(!sources){sources=new WeakMap();this.sprites.set(image,sources);}
  const key=source.clip||source;let variants=sources.get(key);if(!variants){variants=new Map();sources.set(key,variants);}
  if(variants.has(filter))return variants.get(filter);
  const [sx,sy,w,h]=source.bounds,canvas=surface(w,h),c=canvas.getContext('2d');
  if(source.clip?.length){c.beginPath();for(const [i,[x,y]]of source.clip.entries())i?c.lineTo(x,y):c.moveTo(x,y);c.closePath();c.clip();}
  c.filter=filter||'none';c.drawImage(image,sx,sy,w,h,0,0,w,h);const result=freezeSurface(canvas);variants.set(filter,result);return result;
 }
 label(text,color,size,ratio=1){
  const key=[text,color,size,ratio].join('|');if(this.labels.has(key))return this.labels.get(key);
  const probe=surface(1,1).getContext('2d');probe.font=`600 ${size}px Georgia,serif`;
  const width=Math.ceil(probe.measureText(text).width+28),height=Math.ceil(size*1.7+28),canvas=surface(width*ratio,height*ratio),c=canvas.getContext('2d'),anchor=14+size;
  c.scale(ratio,ratio);c.font=probe.font;c.textAlign='center';c.shadowColor='#071522';c.shadowBlur=6;c.fillStyle='#081820';c.fillText(text,width/2+1,anchor+1);c.fillStyle=color;c.fillText(text,width/2,anchor);
  const result={canvas:freezeSurface(canvas),width,height,anchor};this.labels.set(key,result);if(this.labels.size>192){const first=this.labels.keys().next().value;this.labels.get(first).canvas.close?.();this.labels.delete(first);}return result;
 }
 glow(color){
  if(this.glows.has(color))return this.glows.get(color);
  const canvas=surface(128,128),c=canvas.getContext('2d'),g=c.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,color+'cc');g.addColorStop(.3,color+'66');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(0,0,128,128);
  const result=freezeSurface(canvas);this.glows.set(color,result);if(this.glows.size>64){const first=this.glows.keys().next().value;this.glows.get(first).close?.();this.glows.delete(first);}return result;
 }
 clearViewport(){for(const label of this.labels.values())label.canvas.close?.();this.labels.clear();this.vignette?.canvas.close?.();this.mini?.canvas.close?.();this.vignette=null;this.mini=null;}
}
