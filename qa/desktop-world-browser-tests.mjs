import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),main=await fs.readFile(root+'/src/main.js','utf8'),shots=process.env.WORLD_SHOTS||resolve(root,'qa/screenshots/world');await fs.mkdir(shots,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/horizon\//,'/'),file=resolve(root,'.'+(path==='/'?'/index.html':path));const data=file===resolve(root,'src','main.js')?main+'\nexport {engine,renderer,hideModal,settings,start};':await fs.readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),headless:true}),page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/assets/painted/')&&r.url().endsWith('.webp'))requests.push(r.url());});
try{
 const start=Date.now();await page.goto('http://127.0.0.1:'+server.address().port+'/horizon/');await page.waitForFunction(()=>!document.getElementById('new-game').disabled,{},{timeout:90000});await page.evaluate(async()=>{globalThis.qa=await import(document.querySelector('script[type="module"]').src);});
 const loaded=await page.evaluate(async()=>{const{AREAS}=await import(new URL('src/data.js?v=38',location.href));for(const a of AREAS)if(!qa.renderer.areaReady(a.id))throw Error('Map not ready: '+a.id);return {maps:qa.renderer.maps.entries.size,areas:AREAS.length};});assert(loaded.maps>40);console.log('PASS All '+loaded.maps+' decoded maps cover '+loaded.areas+' areas before play ('+(Date.now()-start)+'ms)');const requestCount=requests.length;
 await page.evaluate(()=>{qa.settings.lore=false;qa.start('tide',false,'elementalist');qa.engine.unlockTestMode('fabian1');qa.hideModal();});
 for(const id of ['canal','rooftops','highway','forest','vault','skybridge','metro-refuge','cooling-refuge','groenkloof','lanternwood','rain-garden','quiet-apartments','hidden-atelier']){
  await page.evaluate(id=>{const g=qa.engine;if(!g.testTravel(id))throw Error('Travel failed: '+id);qa.hideModal();if(g.state.world.outdoor){g.state.world.outdoor.open=true;g.spawnOutdoorEncounter();}if(id==='canal')Object.assign(g.state.player,{x:380,y:965});if(id==='forest')Object.assign(g.state.player,{x:3920,y:685});qa.renderer.reset(g.state.player,id);},id);
  await page.waitForTimeout(100);assert(await page.evaluate(id=>qa.renderer.areaReady(id),id));
  if(['canal','forest','metro-refuge'].includes(id))await page.screenshot({path:resolve(shots,id+'.png')});
 }
 assert.equal(requests.length,requestCount);console.log('PASS Travel through all 13 intermediate areas makes no new map requests or decode waits');
 const timings=await page.evaluate(async()=>{const{findPath}=await import(new URL('src/engine.js?v=38',location.href));const g=qa.engine;g.testTravel('forest');g.state.world.outdoor.open=true;const start={...g.state.player},target={x:3870,y:656},times=[];for(let i=0;i<5;i++){const before=performance.now(),path=findPath(start,target,'forest');if(!path.length)throw Error('No prepared forest path');times.push(performance.now()-before);}return times;});console.log('Prepared forest path milliseconds: '+timings.map(x=>x.toFixed(1)).join(', '));
 assert.deepEqual(errors,[]);console.log('PASS No browser errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}
