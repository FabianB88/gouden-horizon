import {readFileSync,statSync,writeFileSync} from 'node:fs';
const catalogue=JSON.parse(readFileSync(new URL('../assets/modules/catalog-v1.json',import.meta.url),'utf8'));
const ids=new Set(),files=new Set();
for(const a of catalogue.assets){
 if(ids.has(a.id)||files.has(a.file))throw Error('Duplicate scenery asset: '+a.id);
 ids.add(a.id);files.add(a.file);statSync(new URL('../'+a.file,import.meta.url));
 if(a.size.length!==2||a.size.some(n=>!(n>0))||a.anchor.length!==2||a.anchor.some(n=>n<0||n>1))throw Error('Invalid dimensions: '+a.id);
 if(!['floor','prop'].includes(a.category)||a.footprint.shape!==(a.category==='floor'?'diamond':'ellipse'))throw Error('Invalid footprint: '+a.id);
 if(!a.defaultPlacement||!!a.defaultPlacement.width===!!a.defaultPlacement.height||!((a.defaultPlacement.width||a.defaultPlacement.height)>0))throw Error('Invalid placement size: '+a.id);
 if(a.category==='prop'&&(!(a.footprint.rx>0)||!(a.footprint.ry>0)))throw Error('Missing solid base: '+a.id);
}
writeFileSync(new URL('../src/scenery-catalog.js',import.meta.url),'// Generated from assets/modules/catalog-v1.json. One file per reusable asset.\nexport const SCENERY_CATALOG='+JSON.stringify(catalogue)+';\nexport const MODULE_ASSETS=Object.fromEntries(SCENERY_CATALOG.assets.map(a=>[a.id,a]));\n');
console.log('Prepared '+ids.size+' reusable scenery assets.');
