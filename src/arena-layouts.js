import {sceneryModules} from './scenery-modules.js?v=45';
import {OUTDOOR_REGIONS,outdoorPoint} from './outdoor-content.js?v=45';
// Each footprint is the solid ground base of its painted prop, in world pixels.
// Open courts stay open elsewhere; these three chapters have distinct lanes.
export const ARENA_LAYOUTS={
 delta:[
  {id:'pump-island',art:'pump',frame:0,x:940,y:640,rx:110,ry:65,height:245},
  {id:'broken-pipe',art:'pump',frame:1,x:1180,y:545,rx:66,ry:42,height:160}
 ],
 mirrors:[
  {id:'north-mirror',art:'mirror',frame:0,x:880,y:505,rx:105,ry:65,height:235},
  {id:'south-mirror',art:'mirror',frame:1,x:1130,y:780,rx:100,ry:60,height:210}
 ],
 glass:[
  {id:'west-roots',art:'roots',frame:0,x:800,y:595,rx:95,ry:65,height:230},
  {id:'east-roots',art:'roots',frame:0,x:1170,y:620,rx:105,ry:70,height:250},
  {id:'lower-roots',art:'roots',frame:1,x:1030,y:865,rx:70,ry:45,height:150}
 ]
};
// These props are already painted into the environment, so only their bases
// participate in collision. A walking character never passes through a pump.
for(const id of ['heatworks','condensers','tower'])ARENA_LAYOUTS[id]=[
 {id:'west-exchanger',paintedOnly:true,x:250,y:603,rx:130,ry:85,height:180},
 {id:'east-exchanger',paintedOnly:true,x:1630,y:654,rx:156,ry:95,height:180},
 {id:'north-exchanger',paintedOnly:true,x:978,y:343,rx:140,ry:75,height:160}
];
// The second visit to the rail complex uses two salvage barriers and lanes.
ARENA_LAYOUTS.railworks=[{id:'rail-pump',art:'pump',frame:1,x:955,y:640,rx:73,ry:45,height:155},{id:'rail-valve',art:'pump',frame:0,x:1175,y:820,rx:85,ry:50,height:190}];
export const arenaObstacles=area=>ARENA_LAYOUTS[area]||[];
ARENA_LAYOUTS['glass-dunes']=[
 {id:'glass-outcrop',paintedOnly:true,x:750,y:581,rx:119,ry:63,height:170},
 {id:'buried-pump',paintedOnly:true,x:1275,y:450,rx:131,ry:69,height:150},
 {id:'salt-mass',paintedOnly:true,x:1156,y:819,rx:106,ry:63,height:160}
];
export function blockedByObstacle(x,y,radius=0,area){return arenaObstacles(area).some(o=>((x-o.x)/(o.rx+radius))**2+((y-o.y)/(o.ry+radius))**2<=1);}
// Swept ellipse collision stops fast bolts at the front face, never after
// hitting an enemy behind the cover. Lobs and overhead spells fly over it.
export function coverHit(a,b,area,radius=0){
 let hit=null,best=Infinity;
 for(const o of arenaObstacles(area)){
  const rx=o.rx+radius,ry=o.ry+radius,x=(a.x-o.x)/rx,y=(a.y-o.y)/ry,dx=(b.x-a.x)/rx,dy=(b.y-a.y)/ry;
  const c=x*x+y*y-1;if(c<=0){if(best>0){best=0;hit={x:a.x,y:a.y,obstacle:o};}continue;}
  const aa=dx*dx+dy*dy,bb=2*(x*dx+y*dy),d=bb*bb-4*aa*c;if(aa===0||d<0)continue;
  const t=(-bb-Math.sqrt(d))/(2*aa);if(t>=0&&t<=1&&t<best){best=t;hit={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,obstacle:o};}
 }return hit;
}

ARENA_LAYOUTS.crystalfalls=[{id:'west-basalt',paintedOnly:true,x:410*1.25,y:505*1.25,rx:125*1.25,ry:73*1.25,height:175},{id:'east-basalt',paintedOnly:true,x:1175*1.25,y:646*1.25,rx:142*1.25,ry:70*1.25,height:195}];
ARENA_LAYOUTS.coppercrown=[{id:'left-masonry',paintedOnly:true,x:355*1.25,y:431*1.25,rx:84*1.25,ry:42*1.25,height:150},{id:'lower-masonry',paintedOnly:true,x:620*1.25,y:788*1.25,rx:110*1.25,ry:57*1.25,height:160},{id:'right-masonry',paintedOnly:true,x:1315*1.25,y:610*1.25,rx:95*1.25,ry:52*1.25,height:155},{id:'observatory',paintedOnly:true,x:800*1.25,y:547*1.25,rx:113*1.25,ry:60*1.25,height:90}];

for(const [id,r]of Object.entries(OUTDOOR_REGIONS))for(const o of r.solids){(ARENA_LAYOUTS[id]||=[]).push({...o,...outdoorPoint(id,[o.x,o.y]),id:'outdoor-planter',rx:o.rx*r.scale,ry:o.ry*r.scale,paintedOnly:true,height:55*r.scale});}

ARENA_LAYOUTS.rooftops=[{id:'south-planter',paintedOnly:true,x:635,y:1170,rx:16,ry:18,height:55}];

// Station canopy pillars and the flowerbed beside its mouth stay solid.
ARENA_LAYOUTS['metro-refuge']=[[382,758,12,9],[441,640,12,9],[433,745,21,13]].map(([x,y,rx,ry])=>({id:'metro-column',paintedOnly:true,x:x*1.25,y:y*1.25,rx:rx*1.25,ry:ry*1.25,height:110}));

for(const id of ['forest'])for(const piece of sceneryModules(id))if(piece.type!=='paving')(ARENA_LAYOUTS[id]||=[]).push(piece);
