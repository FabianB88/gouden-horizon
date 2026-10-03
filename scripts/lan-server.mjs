import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile,rename} from 'node:fs/promises';
import {dirname,extname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {networkInterfaces} from 'node:os';
import {randomUUID} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {WebSocketServer} from 'ws';
import {CoopSession} from '../src/coop-session.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ogg':'audio/ogg','.mp3':'audio/mpeg','.wav':'audio/wav'};
export function createLanServer({port=Number(process.env.PORT||8080),host='0.0.0.0',persist=true,savePath=resolve(root,'.lan-saves/last-expedition.json')}={}){
 const session=new CoopSession(),peers=new Map();let dirty=false,closed=false;
 const server=createServer(async(req,res)=>{try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/lan/info'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({lan:true,version:'8.7.0',players:session.actors.length}));return;}
  if(pathname.split('/').some(p=>p.startsWith('.'))||pathname.startsWith('/node_modules')||pathname.startsWith('/scripts')||pathname.startsWith('/qa')){res.writeHead(403);res.end('Forbidden');return;}
  if(pathname.endsWith('/'))pathname+='index.html';const filename=resolve(root,'.'+pathname);if(!filename.startsWith(root+sep)||!(await stat(filename)).isFile()){res.writeHead(404);res.end('Not found');return;}
  const file=await readFile(filename);res.writeHead(200,{'Content-Type':types[extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:file);
 }catch{res.writeHead(404);res.end('Not found');}});
 const wss=new WebSocketServer({noServer:true,maxPayload:8192,perMessageDeflate:false});
 server.on('upgrade',(req,socket,head)=>{if(req.url!=='/lan/ws'||(req.headers.origin&&req.headers.origin!=='http://'+req.headers.host&&req.headers.origin!=='https://'+req.headers.host)){socket.destroy();return;}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));});
 const send=(ws,data)=>{if(ws.readyState===1&&ws.bufferedAmount<512*1024)ws.send(JSON.stringify(data));};
 wss.on('connection',ws=>{let id=null,count=0,windowStart=performance.now();ws.alive=true;ws.on('pong',()=>ws.alive=true);const joinTimer=setTimeout(()=>{if(!id)ws.close(1008,'Join timeout');},10000);joinTimer.unref();ws.on('error',()=>{});
  ws.on('message',raw=>{try{const now=performance.now();if(now-windowStart>1000){windowStart=now;count=0;}if(++count>100){ws.close(1008,'Too many messages');return;}const m=JSON.parse(raw.toString());if(!m||typeof m!=='object')return;
   if(m.type==='join'&&!id){const token=typeof m.token==='string'&&m.token.length<=60?m.token:randomUUID(),a=session.join({token,name:m.name,build:m.build});id=a.id;clearTimeout(joinTimer);const old=peers.get(id);if(old&&old!==ws)old.close(1000,'Reconnected in another tab');peers.set(id,ws);send(ws,{type:'joined',id,token:a.token});}
   else if(!id)return;else if(m.type==='ready')session.ready(id);else if(m.type==='input')session.input(id,m.input);else if(m.type==='rpc'){let result=false;try{result=session.rpc(id,m.method,m.args);}catch{result=false;}send(ws,{type:'result',request:m.request,result:result??true,...session.snapshot(id)});dirty=true;}
  }catch(error){send(ws,{type:'error',message:error.message==='Unexpected end of JSON input'?'Ongeldig bericht':String(error.message).slice(0,180)});}});
  ws.on('close',()=>{clearTimeout(joinTimer);if(id&&peers.get(id)===ws){peers.delete(id);session.leave(id);dirty=true;}});
 });
 let previous=performance.now(),accumulator=0,ticks=0;const timer=setInterval(()=>{const now=performance.now();accumulator+=Math.min(.1,(now-previous)/1000);previous=now;try{let steps=0;while(accumulator>=1/60&&steps++<6){session.tick(1/60);accumulator-=1/60;}if(++ticks%3===0){for(const [id,ws]of peers)send(ws,{type:'snapshot',...session.snapshot(id)});}}catch(error){console.error('LAN simulation:',error);for(const ws of peers.values())send(ws,{type:'error',message:'De lokale simulatie is gestopt. Herstart de LAN-server.'});clearInterval(timer);}},1000/60);
 const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.alive){ws.terminate();continue;}ws.alive=false;ws.ping();}},10000);heartbeat.unref();
 let saving=Promise.resolve();function save(){if(!persist||!session.started)return saving;const checkpoint=JSON.stringify(session.exportSave());saving=saving.then(async()=>{await mkdir(dirname(savePath),{recursive:true});await writeFile(savePath+'.tmp',checkpoint);await rename(savePath+'.tmp',savePath);}).catch(error=>console.error('LAN checkpoint kon niet worden opgeslagen:',error.message));return saving;}
 const saver=setInterval(()=>{if(session.started){dirty=false;save();}},10000);saver.unref();
 const close=async()=>{if(closed)return;closed=true;clearInterval(timer);clearInterval(heartbeat);clearInterval(saver);await save();for(const ws of wss.clients)ws.close();await new Promise(r=>server.close(r));wss.close();};
 const listening=(async()=>{if(persist&&process.env.LAN_NEW!=='1')try{const saved=JSON.parse(await readFile(savePath,'utf8'));session.restoreSave(saved);}catch{}return new Promise(r=>server.listen(port,host,()=>r(server.address())));})();return {server,session,listening,close};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const app=createLanServer();const address=await app.listening;console.log(`\nGouden Horizon · gratis LAN-co-op\nOpen op deze computer: http://localhost:${address.port}/?lan=1`);for(const list of Object.values(networkInterfaces()))for(const a of list||[])if(a.family==='IPv4'&&!a.internal)console.log(`Tweede speler op hetzelfde netwerk: http://${a.address}:${address.port}/?lan=1`);console.log('Beide spelers kiezen een naam en speelstijl, daarna Klaar. Ctrl+C sluit de server.\n');for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.close();process.exit(0);});}
