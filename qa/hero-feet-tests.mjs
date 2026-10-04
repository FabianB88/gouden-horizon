import assert from 'node:assert/strict';
import fs from 'node:fs';
import {paintedLegMotion,footCycle,WALK_STRIDE,WALK_CYCLE_DISTANCE} from '../src/hero-rig.js';
const classes=JSON.parse(fs.readFileSync(new URL('../assets/painted/hero-classes-v88.json',import.meta.url))).classes;
let cases=0;
for(const frames of Object.values(classes))for(const frame of frames)for(const limb of frame.legs)for(let d=0;d<8;d++)for(let step=0;step<16;step++){
 const hip=limb.h,ankle=[limb.k[0],limb.f[1]-42],dir=[Math.cos(d*Math.PI/4),Math.sin(d*Math.PI/4)*.78],contact=footCycle(step/16)[0];
 const m=paintedLegMotion(hip,ankle,contact,dir,1,frame.scale),dx=ankle[0]-hip[0],dy=ankle[1]-hip[1];
 assert(Math.abs(dx*Math.cos(m.angle)-dy*Math.sin(m.angle)-dx-m.footX)<1e-8,'boot detached horizontally');
 assert(Math.abs(dx*Math.sin(m.angle)+dy*Math.cos(m.angle)-dy+m.depth-m.footY)<1e-8,'boot detached vertically');
 assert(Math.abs(m.footX*frame.scale)<=WALK_STRIDE+1e-8);cases++;
}
for(let d=0;d<8;d++){
 const dir=[Math.cos(d*Math.PI/4),Math.sin(d*Math.PI/4)*.78];
 const world=phase=>{const m=paintedLegMotion([212,295],[207,451],footCycle(phase)[0],dir,1,.27);return [dir[0]*phase*WALK_CYCLE_DISTANCE+m.footX*.27,dir[1]*phase*WALK_CYCLE_DISTANCE+m.footY*.27];};
 const a=world(.02),b=world(.20);assert(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-8,'planted boot slides');
}
console.log(`PASS ${cases} rigid ankle/boot contacts across all character variants; planted feet match actual travel.`);
