// Download once; desktop also decodes every map before play.
export async function downloadMaps(files,fetcher=globalThis.fetch,onProgress=()=>{}){
 const queue=[...new Set(Object.values(files))],bytes=new Map();let done=0;
 const worker=async()=>{while(queue.length){const file=queue.shift(),response=await fetcher(file,{cache:'force-cache'});if(!response.ok)throw Error('Kaart kon niet downloaden: '+file);bytes.set(file,await response.blob());onProgress(++done,Object.values(files).filter((f,i,a)=>a.indexOf(f)===i).length);}};
 await Promise.all(Array.from({length:4},worker));return bytes;
}
export function areaTextureKeys(area){
 const keys=new Set([area.id]);for(const [i,t]of (area.tiles||[]).entries())if(t.asset)keys.add(t.asset);else if(i)keys.add('quayGarden');
 for(const j of area.joins||[])keys.add(j.asset);if(area.id==='highway')keys.add('cityJoin');if(area.id==='canal')keys.add('quayJoin');return [...keys];
}
export class MapTextures{
 constructor(files,assets,load,max=6){this.files=files;this.assets=assets;this.load=load;this.max=max;this.entries=new Map();this.pending=new Map();this.tick=0;this.current=[];}
 ready(area){return areaTextureKeys(area).every(key=>!!this.assets[key]);}
 async preload(onProgress=()=>{}){
  const groups=new Map();for(const [key,file]of Object.entries(this.files)){if(!groups.has(file))groups.set(file,[]);groups.get(file).push(key);}
  this.max=Math.max(this.max,groups.size);const queue=[...groups];let done=0;
  const worker=async()=>{while(queue.length){const [file,keys]=queue.shift(),image=await this.load(file);this.entries.set(file,{image,keys:new Set(keys),used:++this.tick});for(const key of keys)this.assets[key]=image;onProgress(++done,groups.size);await new Promise(resolve=>setTimeout(resolve,0));}};
  await Promise.all(Array.from({length:2},worker));
 }
 async ensure(area){
  const keys=areaTextureKeys(area);this.current=keys;
  await Promise.all(keys.map(async key=>{
   const file=this.files[key];if(!file)throw Error('Kaart ontbreekt: '+key);
   let entry=this.entries.get(file);
   if(!entry){let promise=this.pending.get(file);if(!promise){promise=this.load(file);this.pending.set(file,promise);}
    try{const image=await promise;entry=this.entries.get(file)||{image,keys:new Set(),used:0};this.entries.set(file,entry);}finally{this.pending.delete(file);}
   }
   entry.keys.add(key);entry.used=++this.tick;this.assets[key]=entry.image;
  }));this.trim();
 }
 trim(){
  const protectedFiles=new Set(this.current.map(k=>this.files[k]));
  for(const [file,entry]of [...this.entries].sort((a,b)=>a[1].used-b[1].used)){
   if(this.entries.size<=this.max)break;if(protectedFiles.has(file))continue;
   for(const key of entry.keys)delete this.assets[key];this.entries.delete(file);
  }
 }
}
