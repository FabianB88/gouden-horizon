import {writeFileSync,mkdirSync} from 'node:fs';
import {findPath} from '../src/engine.js';
import {ENEMIES} from '../src/data.js?v=45';
import {WORLD_WALKWAYS} from '../src/world-walkways.js?v=45';
import {OUTDOOR_REGIONS} from '../src/outdoor-content.js?v=45';
const records=[];
for(const area of Object.keys(WORLD_WALKWAYS)){
 const radii=new Set([18]);
 for(const [type]of OUTDOOR_REGIONS[area]?.encounters||[])radii.add(ENEMIES[type].radius);
 for(const radius of radii){records.push(findPath.bake(area,radius));console.log('Prepared '+area+' · '+radius);}
}
const output=new URL('../assets/navigation/',import.meta.url);mkdirSync(output,{recursive:true});
writeFileSync(new URL('walkways-v8102.json',output),JSON.stringify(records));
console.log('Prepared '+records.length+' navigation grids.');
