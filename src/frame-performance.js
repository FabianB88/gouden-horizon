// Record actual animation-frame intervals only while playing. CPU phase timings
// help find work spikes; they are not GPU timings or a synthetic FPS score.
export class FrameTelemetry {
 constructor(limit=180){this.limit=limit;this.frames=[];this.previous=null;this.phases={};}
 begin(now,active){if(!active){this.previous=null;return;}if(this.previous!==null){const ms=now-this.previous;if(ms>0&&ms<5000)this.frames.push({ms,...this.phases});if(this.frames.length>this.limit)this.frames.shift();}this.previous=now;this.phases={};}
 measure(name,run){const clock=globalThis.performance?.now?.bind(globalThis.performance)||Date.now,t=clock();try{return run();}finally{this.phases[name]=(this.phases[name]||0)+clock()-t;}}
 report(){if(this.frames.length<30)return null;const sorted=this.frames.map(f=>f.ms).sort((a,b)=>a-b),average=sorted.reduce((a,b)=>a+b,0)/sorted.length;return {fps:Math.round(1000/average),medianMs:+sorted[Math.floor(sorted.length*.5)].toFixed(1),p95Ms:+sorted[Math.floor(sorted.length*.95)].toFixed(1),slowPercent:Math.round(sorted.filter(ms=>ms>25).length/sorted.length*100),samples:sorted.length,cpu:Object.fromEntries(['update','render','hud'].map(k=>[k,+(this.frames.reduce((n,f)=>n+(f[k]||0),0)/sorted.length).toFixed(2)]))};}
}
export function needsSceneFrame(started,playing,renderer,mode){return Boolean(started&&(playing||renderer.sceneDirty||renderer.lastSceneMode!==mode));}
export function effectParticles(load,important=false){return important?load>40?12:20:load>40?4:load>18?6:8;}
export function trailStep(load){return load>35?2:1;}
