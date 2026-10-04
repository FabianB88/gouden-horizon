import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAINTED_LANES} from './forest-walking-fixtures.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),main=await fs.readFile(root+'/src/main.js','utf8'),shots=process.env.FOREST_SHOTS||resolve(root,'qa/screenshots/forest');await fs.mkdir(shots,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/horizon\//,'/'),file=resolve(root,'.'+(path==='/'?'/index.html':path));const data=file===resolve(root,'src','main.js')?main+'\nexport {engine,renderer,hideModal,settings,start};':await fs.readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),headless:true}),page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
let held=[];
async function release(){for(const key of held)await page.keyboard.up(key);held=[];}
async function walk(targets,label){
 for(const goal of targets.slice(1)){
  let samples=0;
  while(samples++<300){
   const p=await page.evaluate(()=>({x:qa.engine.state.player.x,y:qa.engine.state.player.y})),dx=goal.x-p.x,dy=goal.y-p.y;
   if(Math.hypot(dx,dy*1.15)<12)break;
   const angle=Math.round(Math.atan2(dy/.78,dx)/(Math.PI/4))*Math.PI/4,x=Math.round(Math.cos(angle)),y=Math.round(Math.sin(angle)),next=[...(x<0?['a']:x>0?['d']:[]),...(y<0?['w']:y>0?['s']:[])];
   for(const key of held.filter(k=>!next.includes(k)))await page.keyboard.up(key);for(const key of next.filter(k=>!held.includes(k)))await page.keyboard.down(key);held=next;
   await page.waitForTimeout(50);
  }
  assert(samples<300,label+' actual keyboard input stalled');
 }
 await release();
}
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/horizon/');await page.waitForFunction(()=>!document.getElementById('new-game').disabled,{},{timeout:90000});
 await page.evaluate(async()=>{globalThis.qa=await import(document.querySelector('script[type="module"]').src);qa.settings.lore=false;qa.start('tide',false,'elementalist');qa.engine.unlockTestMode('fabian1');qa.engine.testTravel('forest');qa.hideModal();qa.engine.state.world.enemies=[];qa.engine.state.world.hazards=[];});
 // Open the actual physical gate with the game's normal interaction key.
 await page.evaluate(()=>{Object.assign(qa.engine.state.player,{x:(1536+440)*1.75,y:445*1.75,velocity:{x:0,y:0}});qa.renderer.reset(qa.engine.state.player,'forest');});
 await page.keyboard.press('f');assert(await page.evaluate(()=>qa.engine.state.world.outdoor.open));await page.evaluate(()=>{qa.engine.state.world.enemies=[];qa.hideModal();});
 console.log('PASS browser interaction key opens the physical conservatory gate');
 for(const index of [1,4,6,7]){
  const [name,tile,,points]=PAINTED_LANES[index],targets=points.map(([x,y])=>({x:(tile*1536+x)*1.75,y:y*1.75}));
  await page.evaluate(point=>{Object.assign(qa.engine.state.player,point,{velocity:{x:0,y:0}});qa.renderer.reset(qa.engine.state.player,'forest');},targets[0]);
  await walk(targets,name);await page.screenshot({path:resolve(shots,'lane-'+index+'.png')});await walk(targets.toReversed(),name+' reverse');
  console.log('PASS actual browser keyboard movement in both directions: '+name);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS no browser errors or missing resources');
}finally{await release();await browser.close();await new Promise(r=>server.close(r));}
