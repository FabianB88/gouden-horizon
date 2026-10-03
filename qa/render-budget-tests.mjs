import assert from 'node:assert/strict';
import {RenderCache,renderRatio,MAX_RENDER_PIXELS,HIGH_RENDER_PIXELS} from '../src/render-cache.js';
import {Renderer} from '../src/render.js';
import {worldBounds} from '../src/data.js';
let n=0;function test(name,run){run();n++;console.log('PASS '+name);}
class Canvas{
 constructor(w,h){this.width=w;this.height=h;this.calls=[];this.ctx={font:'',imageSmoothingEnabled:true,beginPath:()=>this.calls.push('path'),moveTo:()=>{},lineTo:()=>{},closePath:()=>{},clip:()=>this.calls.push('clip'),drawImage:(...args)=>this.calls.push(['image',...args]),scale:()=>{},fillText:()=>{},measureText:t=>({width:String(t).length*9}),createRadialGradient:()=>({addColorStop(){}}),fillRect:()=>{}};}
 getContext(){return this.ctx;}getBoundingClientRect(){return {width:1280,height:800};}
}
globalThis.OffscreenCanvas=Canvas;globalThis.window={devicePixelRatio:2};
test('Large/retina screens respect the pixel budget while small screens stay sharp',()=>{
 for(const [w,h,dpr]of [[1280,800,1],[1920,1080,2],[3440,1440,2],[3840,2160,2],[390,844,3]]){const ratio=renderRatio(w,h,dpr);assert(w*h*ratio*ratio<=MAX_RENDER_PIXELS+1);assert(ratio<=dpr);}
 assert.equal(renderRatio(1280,800,1),1);assert.equal(renderRatio(390,844,3),1.5);
});
test('Slow frames lower resolution; stable 60Hz restores it without reacting to one stall',()=>{
 const r=new Renderer(new Canvas(1280,800),new Canvas(190,125));r.resize();const ratio=r.pixelRatio;
 r.noteFrame(.8);for(let i=0;i<90;i++)r.noteFrame(1/60);assert.equal(r.pixelRatio,ratio);
 for(let i=0;i<90;i++)r.noteFrame(1/30);assert(r.pixelRatio<ratio);const reduced=r.pixelRatio;
 for(let i=0;i<90;i++)r.noteFrame(1/60);assert.equal(r.pixelRatio,reduced,'Recovery needs sustained headroom');
 for(let i=0;i<90;i++)r.noteFrame(1/60);assert(r.pixelRatio>reduced);
 for(let i=0;i<180*12;i++)r.noteFrame(1/60);assert.equal(r.performanceScale,1);
 for(let i=0;i<90*12;i++)r.noteFrame(1/30);assert(r.performanceScale>=.65);
});
test('High detail offers a larger bounded desktop budget; closer framing preserves mouse aim',()=>{
 const desktop=renderRatio(2560,1440,2,'high');assert(desktop>renderRatio(2560,1440,2));assert(2560*1440*desktop*desktop<=HIGH_RENDER_PIXELS+1);
 const r=new Renderer(new Canvas(1280,800),new Canvas(190,125));r.settings={quality:'high',camera:1.2};r.resize();r.camera={x:180,y:120};
 const point=r.screenToWorld(960,600);assert.equal(point.x,r.camera.x+960/r.zoom);assert.equal(point.y,r.camera.y+600/r.zoom);
 const view=r.viewWidth;r.performanceScale=.7;r.resize();assert.equal(r.viewWidth,view);assert.deepEqual(r.screenToWorld(960,600),point);
 const ratio=r.pixelRatio;for(let i=0;i<180;i++)r.noteFrame(1/30);assert.equal(r.pixelRatio,ratio,'High stays under explicit player control');
});
test('Rendering quality changes preserve aim coordinates and the camera view',()=>{
 const r=new Renderer(new Canvas(1280,800),new Canvas(190,125));r.resize();r.camera={x:225,y:140};const aim=r.screenToWorld(900,450),view=[r.viewWidth,r.viewHeight,r.zoom];
 r.performanceScale=.65;r.resize();assert.deepEqual(r.screenToWorld(900,450),aim);assert.deepEqual([r.viewWidth,r.viewHeight,r.zoom],view);
 assert(r.inView(300,100,70,180,70));assert(!r.inView(-500,-500,20));
});
test('Area changes and camera-distance changes keep the viewport inside the new map',()=>{
 const r=new Renderer(new Canvas(1280,800),new Canvas(190,125));r.resize();r.reset({x:5000,y:1600},'canal');assert(r.camera.x>1920);
 r.reset({x:1750,y:1150},'delta');const bounds=worldBounds('delta');assert.equal(r.renderArea,'delta');assert(r.camera.x<=bounds.width-r.viewWidth);assert(r.camera.y<=bounds.height-r.viewHeight);
 r.settings={camera:1.2};r.resize();r.reset({x:1800,y:1200},'delta');r.settings={camera:1};r.resize();assert(r.camera.x<=bounds.width-r.viewWidth);assert(r.camera.y<=bounds.height-r.viewHeight);
});
test('Painted cutouts are clipped once and filtered variants are cached separately',()=>{
 const cache=new RenderCache(),image={},source={bounds:[20,40,100,200],clip:[[0,0],[100,0],[50,200]]};
 const normal=cache.sprite(image,source,'none');assert.equal(normal.width,100);assert.equal(normal.height,200);assert.equal(normal.calls.filter(x=>x==='clip').length,1);
 assert.equal(cache.sprite(image,source,'none'),normal);assert.equal(cache.sprite(image,{...source,anchor:[.5,.5]},'none'),normal);
 const tinted=cache.sprite(image,source,'hue-rotate(155deg)');assert.notEqual(tinted,normal);assert.equal(cache.sprite(image,source,'hue-rotate(155deg)'),tinted);
 assert.equal(cache.sprite(image,{bounds:[0,0,100,100]},'none'),null);
});
test('Label/lighting caches stay bounded and resizing invalidates viewport surfaces',()=>{
 const cache=new RenderCache(),light=cache.glow('#91d99c');assert.equal(cache.glow('#91d99c'),light);assert.equal(cache.label('ARENA','#ffe0aa',14,1.5),cache.label('ARENA','#ffe0aa',14,1.5));
 for(let i=0;i<350;i++)cache.label(String(i),'#ffffff',14);assert(cache.labels.size<=192);
 for(let i=0;i<200;i++)cache.glow('#'+i.toString(16).padStart(6,'0'));assert(cache.glows.size<=64);
 cache.mini={canvas:new Canvas(190,125),area:'canal'};cache.vignette={canvas:new Canvas(256,160),danger:false};cache.clearViewport();assert.equal(cache.labels.size,0);assert.equal(cache.mini,null);assert.equal(cache.vignette,null);
});
console.log(`\n${n} rendering budget, cache and aim-coordinate checks passed.`);
