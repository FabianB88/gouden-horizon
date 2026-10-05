import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {AREAS} from '../src/data.js';
import {ARENA_PAVING_LINES} from './arena-paving-fixtures.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),main=await fs.readFile(root+'/src/main.js','utf8'),shots=process.env.ARENA_SHOTS||resolve(root,'qa/screenshots/arenas');await fs.mkdir(shots,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml'};
// Ten native painting pixels allow ordinary eight-direction keyboard steering.
// This is the same side lane whose full collision footprint is checked by the
// engine tests; measure against the active segment, never the whole itinerary.
const pathTolerance=10;
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/horizon\//,'/'),file=resolve(root,'.'+(path==='/'?'/index.html':path));const data=file===resolve(root,'src','main.js')?main+'\nexport {engine,renderer,hideModal,settings,start};':await fs.readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),headless:true}),page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
let held=[];
async function release(){for(const key of held)await page.keyboard.up(key);held=[];}
async function walk(targets,label){
 const start=await page.evaluate(()=>({x:qa.engine.state.player.x,y:qa.engine.state.player.y}));
 const reference=[start,...targets];
 await page.evaluate(({points,label})=>{globalThis.qaExpected={points,label};globalThis.qaDeviation=null;}, {points:reference,label});
 for(let i=1;i<reference.length;i++){
 const a=reference[i-1],b=reference[i];
 await page.evaluate(({points,label})=>{globalThis.qaExpected={points,label};},{points:[a,b],label});
 const steps=Math.ceil(Math.hypot(b.x-a.x,(b.y-a.y)*1.15)/20);
 for(let step=1;step<=steps;step++){
 const goal={x:a.x+(b.x-a.x)*step/steps,y:a.y+(b.y-a.y)*step/steps};
  let samples=0;
  while(samples++<300){
   const p=await page.evaluate(()=>({x:qa.engine.state.player.x,y:qa.engine.state.player.y})),dx=goal.x-p.x,dy=goal.y-p.y;
   if(Math.hypot(dx,dy*1.15)<5)break;
   const angle=Math.round(Math.atan2(dy/.78,dx)/(Math.PI/4))*Math.PI/4,x=Math.round(Math.cos(angle)),y=Math.round(Math.sin(angle)),next=[...(x<0?['a']:x>0?['d']:[]),...(y<0?['w']:y>0?['s']:[])];
   for(const key of held.filter(k=>!next.includes(k)))await page.keyboard.up(key);for(const key of next.filter(k=>!held.includes(k)))await page.keyboard.down(key);held=next;
   await page.clock.runFor(20);
  }
  assert(samples<300,label+' actual keyboard input stalled');
  const deviation=await page.evaluate(()=>qaDeviation);assert.equal(deviation,null,label+' used a detour: '+JSON.stringify(deviation));
 }
 }
 await release();await page.evaluate(()=>{globalThis.qaExpected=null;});
}
try{
 await page.clock.install();
 await page.goto('http://127.0.0.1:'+server.address().port+'/horizon/');await page.waitForFunction(()=>!document.getElementById('new-game').disabled,{},{timeout:90000});
 await page.evaluate(async()=>{globalThis.qa=await import(document.querySelector('script[type="module"]').src);qa.settings.lore=false;qa.start('tide',false,'elementalist');qa.engine.unlockTestMode('fabian1');qa.hideModal();qa.engine.updateWorldProgress=()=>{};qa.engine.updateChallengeCountdown=()=>false;});
 // Record every game update, not just whether the next destination is reached.
 await page.evaluate(pathTolerance=>{globalThis.qaExpected=null;globalThis.qaDeviation=null;globalThis.qaTrace=[];const update=qa.engine.update;qa.engine.update=function(...args){const value=update.apply(this,args),p=this.state.player,expected=globalThis.qaExpected;if(expected){let closest=Infinity;for(let i=1;i<expected.points.length;i++){const a=expected.points[i-1],b=expected.points[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));closest=Math.min(closest,Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy));}if(closest>pathTolerance&&!globalThis.qaDeviation)globalThis.qaDeviation={label:expected.label,x:p.x,y:p.y,deviation:closest};globalThis.qaTrace.push({label:expected.label,x:p.x,y:p.y,deviation:closest});}return value;};},pathTolerance);
 // Advance normal rendering/input updates with a controlled browser clock so
 // slow automation commands cannot accidentally hold a direction for extra frames.
 await page.clock.pauseAt(new Date(Date.now()+100));
 for(const area of AREAS.filter(a=>ARENA_PAVING_LINES[a.file])){
  const points=ARENA_PAVING_LINES[area.file].map(([x,y])=>({x:x*1.25,y:y*1.25}));
  await page.evaluate(({id,start})=>{const g=qa.engine;g.testTravel(id);g.state.world.enemies=[];g.state.world.hazards=[];g.state.world.loot=[];g.state.world.pickups=[];g.state.player.xp=0;Object.assign(g.state.player,start,{velocity:{x:0,y:0}});qa.hideModal();qa.renderer.reset(g.state.player,id);},{id:area.id,start:points[0]});
  await walk(points,area.id+' southern pavement');
  await page.screenshot({path:resolve(shots,area.id+'.png')});
  console.log('PASS actual browser keyboard movement on southern pavement: '+area.id);
 }
 const trace=await page.evaluate(()=>qaTrace);await fs.writeFile(resolve(shots,'actual-trajectory.json'),JSON.stringify(trace));
 console.log('Recorded '+trace.length+' actual movement frames; maximum path deviation '+trace.reduce((max,r)=>Math.max(max,r.deviation),0).toFixed(2)+' world pixels');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS no browser errors or missing resources');
}finally{await release();await browser.close();await new Promise(r=>server.close(r));}
