import assert from 'node:assert/strict';
import {AREAS} from '../src/data.js';
import {Engine,canStand,distance} from '../src/engine.js';
import {ARENA_PAVING_LINES} from './arena-paving-fixtures.js';
const crossTrack=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);};
let count=0,checked=0;const failures=[];
for(const area of AREAS.filter(a=>ARENA_PAVING_LINES[a.file]))try{
 // Isolate locomotion from wave spawning; campaign tests separately exercise combat.
 const g=new Engine('tide',841);g.unlockTestMode('fabian1');g.testTravel(area.id);g.state.world.enemies=[];g.state.world.hazards=[];g.state.world.pickups=[];
 const line=ARENA_PAVING_LINES[area.file];
 for(const offset of [-12,0,12]){
  const targets=line.map(([x,y],i)=>{const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);return {x:(x-dy/n*offset)*1.25,y:(y+dx/n*offset)*1.25};});
  for(let i=1;i<targets.length;i++){const a=targets[i-1],b=targets[i],steps=Math.ceil(distance(a,b)/1.25);for(let t=0;t<=steps;t++){const x=a.x+(b.x-a.x)*t/steps,y=a.y+(b.y-a.y)*t/steps;assert(canStand(x,y,18,area.id),area.id+' southern painted paving blocked at '+JSON.stringify([x*.8,y*.8]));checked++;}}
  for(const path of [targets,targets.toReversed()]){Object.assign(g.state.player,path[0],{velocity:{x:0,y:0}});for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],steps=Math.ceil(distance(a,b)/18);for(let t=1;t<=steps;t++){const goal={x:a.x+(b.x-a.x)*t/steps,y:a.y+(b.y-a.y)*t/steps};let frames=0;while(distance(g.state.player,goal)>5&&frames++<350){const p=g.state.player,angle=Math.round(Math.atan2((goal.y-p.y)/.78,goal.x-p.x)/(Math.PI/4))*Math.PI/4;g.updateActor(1/60,{x:Math.round(Math.cos(angle)),y:Math.round(Math.sin(angle))});assert(crossTrack(p,a,b)<=10,area.id+' took a detour');}assert(frames<350,area.id+' keyboard walking stalled');}}}
 }
 assert(!canStand(20,1140,18,area.id),'solid scenery must remain outside '+area.id);
 console.log('PASS actual southern paving, three lanes in both directions: '+area.id);count++;
}catch(error){failures.push(error.message);console.log('FAIL '+error.message);}
assert.deepEqual(failures,[]);console.log(count+' arena paintings/variants and '+checked+' densely sampled paving points passed.');
