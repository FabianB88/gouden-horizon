import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SECTION_ENTRIES} from '../src/area-sections.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),main=await fs.readFile(root+'/src/main.js','utf8'),shots=process.env.SECTION_SHOTS||resolve(root,'qa/screenshots/sections');await fs.mkdir(shots,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(path==='/'?'/index.html':path)),data=file===resolve(root,'src','main.js')?main+'\nexport {engine,renderer,hideModal,settings,start};':await fs.readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),headless:true}),page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>!document.getElementById('new-game').disabled,{},{timeout:90000});
 await page.evaluate(async()=>{globalThis.qa=await import(document.querySelector('script[type="module"]').src);qa.settings.lore=false;qa.start('tide',false,'elementalist');qa.engine.unlockTestMode('fabian1');qa.hideModal();const {sectionIndex,sectionBounds,sectionArrival}=await import('/src/area-sections.js');globalThis.sections={sectionIndex,sectionBounds,sectionArrival};});
 for(const id of Object.keys(SECTION_ENTRIES)){
  await page.evaluate(id=>{qa.engine.testTravel(id);qa.engine.state.world.enemies=[];qa.renderer.reset(qa.engine.state.player,id);},id);
  await page.waitForSelector('#section-travel:not([hidden])');
  for(let repeat=0;repeat<2;repeat++)for(const index of [1,0]){
   await page.locator('#section-travel').click();await page.waitForFunction(index=>sections.sectionIndex(qa.engine.state.area,qa.engine.state.player)===index,index);
   const result=await page.evaluate(()=>{const {engine:g,renderer:r}=qa,s=g.state,b=sections.sectionBounds(s.area,s.player),tile=g.state.area&&r.assets[b.asset||s.area];r.render(g,0,1/60);return {x:s.player.x,y:s.player.y,b,viewWidth:r.viewWidth,camera:{...r.camera},ready:r.areaReady(s.area),title:document.getElementById('zone-title').textContent};});
   assert(result.ready);assert(result.camera.x>=result.b.x-.001);assert(result.camera.x+result.viewWidth<=result.b.x+result.b.width+.001);assert.equal(result.title,result.b.name);
   await page.keyboard.down('d');await page.waitForTimeout(150);await page.keyboard.up('d');assert((await page.evaluate(()=>qa.engine.state.player.x))>result.x,'normal movement from arrival must work');
   if(repeat===0)await page.screenshot({path:resolve(shots,id+'-'+index+'.png')});
  }
  console.log('PASS real edge-button clicks, grounded arrivals and isolated camera in both directions: '+id);
 }
 const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'});
 await touch.goto('http://127.0.0.1:'+server.address().port+'/');await touch.waitForFunction(()=>!document.getElementById('new-game').disabled,{},{timeout:90000});
 await touch.evaluate(async()=>{const q=await import(document.querySelector('script[type="module"]').src);globalThis.touchQA=q;q.settings.lore=false;q.start('tide',false,'elementalist');q.engine.unlockTestMode('fabian1');q.engine.testTravel('forest');q.hideModal();});
 await touch.locator('#section-travel').tap();await touch.waitForFunction(()=>touchQA.engine.state.player.x>2688);const box=await touch.locator('#section-travel').boundingBox();assert(box.x>=0&&box.x+box.width<=390);await touch.screenshot({path:resolve(shots,'forest-mobile.png')});await touch.close();
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS portrait touch-size button and no browser errors or missing resources');
}finally{await browser.close();await new Promise(r=>server.close(r));}
