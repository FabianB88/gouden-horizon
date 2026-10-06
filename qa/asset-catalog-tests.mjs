import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {SCENERY_CATALOG,MODULE_ASSETS} from '../src/scenery-catalog.js?v=46';
import {placeSceneryModule,sceneryModules} from '../src/scenery-modules.js?v=46';
const source=JSON.parse(readFileSync(new URL('../assets/modules/catalog-v1.json',import.meta.url),'utf8'));
assert.deepEqual(SCENERY_CATALOG,source,'generated catalogue must agree with authoritative database');
assert.equal(source.assets.length,9);assert.equal(new Set(source.assets.map(a=>a.file)).size,9,'reuse assets without duplicate files');
let bytes=0;
for(const a of source.assets){const size=statSync(new URL('../'+a.file,import.meta.url)).size;assert.equal(a.bytes,size);bytes+=size;assert(a.label.nl&&a.label.en&&a.tags.length&&a.biomes.length);assert(a.anchor.every(n=>n>=0&&n<=1));
 const first=placeSceneryModule({id:'first',type:a.id,point:[100,200]}),second=placeSceneryModule({id:'second',type:a.id,point:[300,400]},{scale:1.75,offset:1536});
 assert.equal(first.asset,second.asset,'instances share the same source asset');assert.equal(first.asset,MODULE_ASSETS[a.id]);
 assert.equal(second.x,(1536+300)*1.75);assert.equal(second.y,400*1.75);
 assert(Math.abs(first.width/first.height-a.size[0]/a.size[1])<1e-9);assert(Math.abs(second.width/second.height-first.width/first.height)<1e-9);
 if(a.category==='floor'){assert(first.floor);assert.equal(first.rx,0);assert.equal(first.ry,0);}else{assert(!first.floor);assert(first.rx>0&&first.ry>0);assert(Math.abs(second.rx-first.rx*1.75)<1e-9);}
}
assert(bytes<300000,'whole reusable library stays below 300KB');
assert.equal(sceneryModules('forest').length,4,'reserve assets do not silently add obstacles to existing areas');
const [floorA,floorB,planter,lamp]=sceneryModules('forest');assert.equal(planter.rx,21*1.75);assert.equal(planter.ry,10*1.75);assert(Math.abs(lamp.rx-8*1.75)<1e-9);assert(Math.abs(lamp.ry-5*1.75)<1e-9);
console.log('PASS nine catalogue entries, shared image identity, placement/footprint scaling, old prop bases retained, no reserve obstacles, '+bytes+' bytes');
