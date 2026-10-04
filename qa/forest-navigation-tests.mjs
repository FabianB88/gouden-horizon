import assert from 'node:assert/strict';
import {Engine,canStand,clearLine,distance} from '../src/engine.js';
import {OUTDOOR_REGIONS,outdoorPoint,inOutdoorWild} from '../src/outdoor-content.js';

import {PAINTED_LANES} from './forest-walking-fixtures.js';

const point=(tile,[x,y])=>({x:(tile*1536+x)*1.75,y:y*1.75});
function lane(tile,points,offset){
 return points.map((p,i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy);return point(tile,[p[0]-dy/n*offset,p[1]+dx/n*offset]);});
}
function game(){const g=new Engine();g.unlockTestMode('fabian1');g.testTravel('forest');g.state.world.enemies=[];g.state.world.hazards=[];return g;}
function walk(g,targets,label){
 const p=g.state.player;Object.assign(p,targets[0],{velocity:{x:0,y:0}});
 for(const end of targets.slice(1)){
  if(!clearLine(p,end,'forest',18)){const steps=Math.ceil(distance(p,end));for(let i=0;i<=steps;i++){const x=p.x+(end.x-p.x)*i/steps,y=p.y+(end.y-p.y)*i/steps;assert(canStand(x,y,18,'forest'),label+' has a hole in visible paving at native '+JSON.stringify([x/1.75,y/1.75]));}}
  const from={x:p.x,y:p.y},steps=Math.ceil(distance(from,end)/18);
  for(let i=1;i<=steps;i++){
   const goal={x:from.x+(end.x-from.x)*i/steps,y:from.y+(end.y-from.y)*i/steps};let frames=0;
   while(distance(p,goal)>5&&frames++<350){const angle=Math.round(Math.atan2((goal.y-p.y)/.78,goal.x-p.x)/(Math.PI/4))*Math.PI/4;g.update(1/60,{x:Math.round(Math.cos(angle)),y:Math.round(Math.sin(angle))});}
   assert(frames<350,label+' keyboard movement stalled at '+JSON.stringify([p.x/1.75,p.y/1.75])+' toward '+JSON.stringify([goal.x/1.75,goal.y/1.75]));assert(canStand(p.x,p.y,18,'forest'));
  }
 }
}
let count=0;
for(const [name,tile,width,points]of PAINTED_LANES){
 const g=game();g.state.world.outdoor.open=true;
 for(const offset of [-width,0,width]){const targets=lane(tile,points,offset);walk(g,targets,name+' offset '+offset);walk(g,targets.toReversed(),name+' reverse offset '+offset);}
 console.log('PASS full-width keyboard walking: '+name);count++;
}
{
 const g=game(),r=OUTDOOR_REGIONS.forest,mid=r.door[0].map((v,i)=>(v+r.door[1][i])/2),p=g.state.player;
 Object.assign(p,outdoorPoint('forest',[mid[0]-45,mid[1]+20]),{velocity:{x:0,y:0}});
 for(let i=0;i<90;i++)g.moveEntity(p,(outdoorPoint('forest',mid).x-p.x)*.15,(outdoorPoint('forest',mid).y-p.y)*.15);
 assert(!inOutdoorWild('forest',p));assert(!g.state.world.outdoor.open);
 Object.assign(p,outdoorPoint('forest',[mid[0]-45,mid[1]+20]));assert.equal(g.interaction().type,'outdoorDoor');assert(g.interact());assert(g.state.world.outdoor.open);
 const crossing=[[440,445],[485,445],[530,432],[580,408]].map(p=>point(1,p));walk(g,crossing,'opened gate');walk(g,crossing.toReversed(),'opened gate return');
 const reopened=Engine.restore(g.serialize()||(()=>{g.lockTestMode();return g.serialize();})());assert(reopened.state.world.outdoor.open);
 console.log('PASS physical gate blocks before opening and permits movement and saves afterwards');count++;
}
for(const [tile,x,y]of [[0,450,320],[0,1050,420],[1,800,365],[1,950,385],[1,850,780],[1,1390,600]])assert(!canStand(point(tile,[x,y]).x,point(tile,[x,y]).y,18,'forest'),'water or greenhouse wall became walkable');
console.log('PASS painted water and buildings stay solid');
console.log((count+1)+' focused forest navigation checks passed.');
