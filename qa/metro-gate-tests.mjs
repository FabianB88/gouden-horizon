import assert from 'node:assert/strict';
import {Engine,canStand,distance} from '../src/engine.js?v=44';
import {outdoorPoint} from '../src/outdoor-content.js?v=44';
const g=new Engine();g.unlockTestMode('fabian1');g.testTravel('metro-refuge');
const native=p=>({x:p[0]*1.25,y:p[1]*1.25});
const route=[[340,755],[345,720],[370,690],[413,675],[470,690],[515,671],[555,632],[600,592],[650,553],[700,520]];
const cross=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);};
const walk=(points)=>{const p=g.state.player;for(const [i,b]of points.slice(1).entries()){const a={...p},n=Math.ceil(distance(a,b)/12);for(let j=1;j<=n;j++){const end={x:a.x+(b.x-a.x)*j/n,y:a.y+(b.y-a.y)*j/n};let frames=0;while(distance(p,end)>4&&frames++<250){const t=Math.round(Math.atan2((end.y-p.y)/.78,end.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(t)),y:Math.round(Math.sin(t))});assert(cross(p,points[i],b)<10,'stays on painted stair/platform lane');}assert(frames<250,'stalled at native '+JSON.stringify([p.x/1.25,p.y/1.25]));}}};
assert(distance(g.state.player,native(route[0]))<1,'actual arrival spawn on the station floor');
for(const offset of [-8,0,8]){const points=route.map((v,i)=>{const a=route[Math.max(0,i-1)],b=route[Math.min(route.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);return native([v[0]-dy/n*offset,v[1]+dx/n*offset]);});Object.assign(g.state.player,points[0]);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.ceil(distance(a,b));for(let j=0;j<=n;j++)assert(canStand(a.x+(b.x-a.x)*j/n,a.y+(b.y-a.y)*j/n,18,'metro-refuge'),'full-width metro stair at '+JSON.stringify([a.x/1.25,a.y/1.25]));}walk(points);walk(points.toReversed());}
for(const p of [[382,758],[433,745],[441,640],[600,760]]){const q=native(p);assert(!canStand(q.x,q.y,18,'metro-refuge'),'station pillars, flowers and water stay solid');}
console.log('PASS actual metro arrival and visible staircase in both directions and both side lanes');
g.lockTestMode();Object.assign(g.state.player,native([391.68,762.88]));const progress=g.state.player.level,restored=Engine.restore(g.serialize());assert(canStand(restored.state.player.x,restored.state.player.y,18,'metro-refuge'));assert.equal(restored.state.player.level,progress);assert(restored.findWalkingPath(restored.state.player,native([700,520])).length,'old metro position recovers onto connected paving');g.unlockTestMode('fabian1');
console.log('PASS old metro saves recover onto connected floor without losing progress');

g.testTravel('forest');assert(g.switchAreaSection(1));
const gate=outdoorPoint('forest',[475,425]);assert(g.outdoorGateBlocks(gate.x,gate.y,18),'closed gate blocks its real aperture');g.state.world.outdoor.open=true;assert(!g.outdoorGateBlocks(gate.x,gate.y,18));assert(canStand(gate.x,gate.y,18,'forest'));
for(const p of [[507,447],[528,460],[570,487],[612,513],[653,539]]){const q=outdoorPoint('forest',p);assert(!canStand(q.x,q.y,18,'forest'),'painted wall stays solid after opening');}
for(const npc of g.questNPCs().filter(n=>n.id!=='district-guide'))assert(distance(npc,g.outdoorNPC())>120,'quest givers spread around Seya without stealing interactions');
console.log('PASS closed physical gate, open aperture, solid wall and spaced quest givers');
