import assert from 'node:assert/strict';
import {statSync,readFileSync} from 'node:fs';
import {Engine,canStand,clearLine,distance,findPath} from '../src/engine.js?v=46';
import {MODULE_ASSETS,sceneryModules,moduleFloor} from '../src/scenery-modules.js?v=46';
const pieces=sceneryModules('forest'),floors=pieces.filter(p=>p.type==='paving');let samples=0,bytes=0;
for(const type of new Set(pieces.map(p=>p.type)))bytes+=statSync(new URL('../'+MODULE_ASSETS[type].file,import.meta.url)).size;assert(bytes<100000,'the placed forest kit stays below 100KB compressed');
for(const piece of pieces){assert(Math.abs(piece.width/piece.height-piece.asset.size[0]/piece.asset.size[1])<1e-9,'uniform scale never stretches artwork');if(piece.type!=='paving')assert(!canStand(piece.x,piece.y,18,'forest'),'prop base stays solid');}
for(const piece of floors){const corners=moduleFloor(piece);assert.equal(corners.length,4);for(let y=-piece.height/2;y<=piece.height/2;y+=2)for(let x=-piece.width/2;x<=piece.width/2;x+=2)if(Math.abs(x)/(piece.width/2)+Math.abs(y)/(piece.height/2)<=1){assert(canStand(piece.x+x,piece.y+y,18,'forest'),'every visible floor point includes foot clearance');samples++;}}
const a=moduleFloor(floors[0]),b=moduleFloor(floors[1]);assert(distance(a[2],b[1])<.001&&distance(a[3],b[0])<.001,'modules meet at the complete shared edge');
const g=new Engine();g.unlockTestMode('fabian1');g.testTravel('forest');g.switchAreaSection(1);g.state.world.enemies=[];
const targets=[floors[0],{x:(a[2].x+a[3].x)/2,y:(a[2].y+a[3].y)/2},floors[1]];
Object.assign(g.state.player,{x:targets[0].x,y:targets[0].y});for(const end of targets.slice(1)){assert(clearLine(g.state.player,end,'forest',18));const start={x:g.state.player.x,y:g.state.player.y},n=Math.ceil(distance(start,end)/12);for(let i=1;i<=n;i++){const goal={x:start.x+(end.x-start.x)*i/n,y:start.y+(end.y-start.y)*i/n};let frames=0;while(distance(g.state.player,goal)>5&&frames++<400){const p=g.state.player,t=Math.round(Math.atan2((goal.y-p.y)/.78,goal.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(t)),y:Math.round(Math.sin(t))});}assert(frames<400,'keyboard crossing stalled: '+JSON.stringify({mode:g.state.mode,p:[g.state.player.x,g.state.player.y],goal}));}}
const grids=JSON.parse(readFileSync(new URL('../assets/navigation/walkways-v8103.json',import.meta.url)));assert.equal(findPath.install(grids),24);
console.log(`PASS ${samples} visible floor/footprint samples, full edge join, actual keyboard seam crossing, solid props, preserved aspect and ${bytes} asset bytes`);
