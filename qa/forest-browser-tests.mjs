import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAINTED_LANES,PAINTED_JOURNEY} from './forest-walking-fixtures.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),main=await fs.readFile(root+'/src/main.js','utf8'),shots=process.env.FOREST_SHOTS||resolve(root,'qa/screenshots/forest');await fs.mkdir(shots,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml'};
// Ten native painting pixels allow ordinary eight-direction keyboard steering.
// This is the same side lane whose full collision footprint is checked by the
// engine tests; measure against the active segment, never the whole itinerary.
const pathTolerance=10*1.75;
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
 await page.evaluate(async()=>{globalThis.qa=await import(document.querySelector('script[type="module"]').src);qa.settings.lore=false;qa.start('tide',false,'elementalist');qa.engine.unlockTestMode('fabian1');qa.engine.testTravel('forest');qa.hideModal();qa.engine.state.world.enemies=[];qa.engine.state.world.hazards=[];});
 // Record every game update, not just whether the next destination is reached.
 await page.evaluate(pathTolerance=>{globalThis.qaExpected=null;globalThis.qaDeviation=null;globalThis.qaTrace=[];const update=qa.engine.update;qa.engine.update=function(...args){const value=update.apply(this,args),p=this.state.player,expected=globalThis.qaExpected;if(expected){let closest=Infinity;for(let i=1;i<expected.points.length;i++){const a=expected.points[i-1],b=expected.points[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));closest=Math.min(closest,Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy));}if(closest>pathTolerance&&!globalThis.qaDeviation)globalThis.qaDeviation={label:expected.label,x:p.x,y:p.y,deviation:closest};globalThis.qaTrace.push({label:expected.label,x:p.x,y:p.y,deviation:closest});}return value;};},pathTolerance);
 // Advance normal rendering/input updates with a controlled browser clock so
 // slow automation commands cannot accidentally hold a direction for extra frames.
 await page.clock.pauseAt(new Date(Date.now()+100));
 const before=PAINTED_JOURNEY.beforeGate.map(([x,y])=>({x:x*1.75,y:y*1.75})),after=PAINTED_JOURNEY.afterGate.map(([x,y])=>({x:x*1.75,y:y*1.75}));
 // Walk from the real arrival point along the painted market bridge. The gate
 // remains closed until the normal interaction key is pressed there.
 assert(!(await page.evaluate(()=>qa.engine.state.world.outdoor.open)));
 await walk(before,'market to closed gate');
 await page.keyboard.press('f');assert(await page.evaluate(()=>qa.engine.state.world.outdoor.open));await page.evaluate(()=>{qa.engine.state.world.enemies=[];qa.hideModal();});
 console.log('PASS actual keyboard route from arrival across the painted bridge to the physical gate, without teleportation or detours');
 await walk(after,'seed, crystal and southern roads');await page.screenshot({path:resolve(shots,'southern-journey.png')});
 await walk([...before,...after].toReversed(),'same complete roads in reverse');
 console.log('PASS complete browser journey to the seed/crystal routes and southern exit, and back along the same roads');
 for(const index of [1,12,14]){
  const [name,tile,,points]=PAINTED_LANES[index],targets=points.map(([x,y])=>({x:(tile*1536+x)*1.75,y:y*1.75}));
  await page.evaluate(point=>{Object.assign(qa.engine.state.player,point,{velocity:{x:0,y:0}});qa.renderer.reset(qa.engine.state.player,'forest');},targets[0]);
  await walk(targets,name);await page.screenshot({path:resolve(shots,'lane-'+index+'.png')});await walk(targets.toReversed(),name+' reverse');
  console.log('PASS actual browser keyboard movement in both directions: '+name);
 }
 const trace=await page.evaluate(()=>qaTrace);await fs.writeFile(resolve(shots,'actual-trajectory.json'),JSON.stringify(trace));
 console.log('Recorded '+trace.length+' actual movement frames; maximum path deviation '+trace.reduce((max,r)=>Math.max(max,r.deviation),0).toFixed(2)+' world pixels');
 await page.setViewportSize({width:1536,height:1024});
 const journeyTrace=trace.filter(r=>['market to closed gate','seed, crystal and southern roads','same complete roads in reverse'].includes(r.label));
 for(const tile of [0,1]){await page.goto('http://127.0.0.1:'+server.address().port+'/horizon/qa/forest-review.html?tile='+tile+'&journey');await page.waitForSelector('body[data-ready="true"]');await page.evaluate(trace=>drawActualTrace(trace),journeyTrace);await page.locator('canvas').screenshot({path:resolve(shots,'painted-versus-walked-'+tile+'.png')});}
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS no browser errors or missing resources');
}finally{await release();await browser.close();await new Promise(r=>server.close(r));}
