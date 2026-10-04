export const JOURNEY_KEY='gouden-horizon-journey-v882';
// UI-only read history: never mutates a LAN snapshot or pauses another player.
export class JourneyLog{
 constructor(storage){try{storage??=globalThis.localStorage;}catch{}this.storage=storage;this.runs={};try{const saved=JSON.parse(storage?.getItem(JOURNEY_KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))this.runs=saved;}catch{}this.pending=null;this.area=null;this.run=null;this.seen=new Set();}
 begin(seed,identity='solo'){this.run=identity+':'+seed;this.seen=new Set(Array.isArray(this.runs[this.run])?this.runs[this.run].filter(v=>typeof v==='string'):[]);this.pending=null;this.area=null;}
 mark(id){this.seen.add(id);this.runs[this.run]=[...this.seen];const keys=Object.keys(this.runs);while(keys.length>12)delete this.runs[keys.shift()];try{this.storage?.setItem(JOURNEY_KEY,JSON.stringify(this.runs));}catch{}}
 observe(id,enabled=true,testing=false){if(this.area===id)return;this.area=id;this.pending=enabled&&!testing&&!this.seen.has(id)?id:null;}
 take(){const id=this.pending;this.pending=null;if(id)this.mark(id);return id;}
 disable(){this.pending=null;}
}
