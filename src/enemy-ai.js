// Short, committed movement choices keep ranged enemies from shivering at
// their ideal distance. Collision and path finding remain owned by the engine.
export function tacticalMovement(e,dir,distance,dt,base={}){
 const flanker=e.type==='hunter'||e.type==='rimedrone'||e.type==='dustskirmisher';
 const gunner=e.type==='pressurediver'||e.type==='furnacegunner'||base.role==='ranged'||e.type==='sniper';
 if(!flanker&&!gunner)return null;
 e.tacticTime=(e.tacticTime||0)-dt;
 if(e.tacticTime<=0){e.tacticTime=1.3+(e.id%4)*.18;e.flankSide=e.flankSide|| (e.id%2?1:-1);if(flanker&&e.attacks!==e.tacticAttack){e.flankSide*=-1;e.tacticAttack=e.attacks;}}
 const close=e.type==='sniper'?340:e.type==='dustskirmisher'?270:flanker?185:Math.min(270,(base.range||420)*.65),far=e.type==='sniper'?510:e.type==='dustskirmisher'?440:flanker?340:Math.min(440,base.range||420);
 if(distance>far+25)e.approach=1;
 else if(distance<close-20)e.approach=-1;
 else if(distance>close+25&&distance<far-25)e.approach=0;
 const forward=e.approach||0,side=(flanker?.82:e.type==='sniper'?.18:.3)*e.flankSide;
 const x=dir.x*forward-dir.y*side,y=dir.y*forward+dir.x*side,length=Math.max(1,Math.hypot(x,y));
 return {x:x/length,y:y/length};
}

// Approaching melee creatures take separate short lanes around the target.
// Attack range, damage and committed aim remain unchanged.
export function engagementGoal(e,p,base){
 const d=Math.hypot(e.x-p.x,(e.y-p.y)*1.15);
 if(base.boss||!base.speed||base.range>160||d>260||d<70)return p;
 const angle=Math.atan2((e.y-p.y)*1.15,e.x-p.x)+((e.id%5)-2)*.2,r=Math.min(64,base.range*.65);
 return {x:p.x+Math.cos(angle)*r,y:p.y+Math.sin(angle)*r/1.15};
}
export class EnemyCrowd {
 constructor(enemies,cell=128){this.cell=cell;this.cells=new Map();this.maxRadius=0;for(const e of enemies){if(e.dead)continue;this.maxRadius=Math.max(this.maxRadius,e.radius||18);const key=Math.floor(e.x/cell)+','+Math.floor(e.y*1.15/cell);if(!this.cells.has(key))this.cells.set(key,[]);this.cells.get(key).push(e);}}
 near(e){const result=[],steps=Math.ceil(((e.radius||18)+this.maxRadius+12)/this.cell),x=Math.floor(e.x/this.cell),y=Math.floor(e.y*1.15/this.cell);for(let dy=-steps;dy<=steps;dy++)for(let dx=-steps;dx<=steps;dx++)for(const other of this.cells.get((x+dx)+','+(y+dy))||[])if(other!==e&&!other.dead)result.push(other);return result;}
}
export function separationVector(e,others){let x=0,y=0;for(const other of others){const dx=e.x-other.x,dy=(e.y-other.y)*1.15,d=Math.hypot(dx,dy),min=e.radius+other.radius+8;if(d>=min)continue;const strength=Math.min(1,(min-d)/Math.max(1,min))*.8,angle=d>.01?Math.atan2(dy,dx):(Math.min(e.id,other.id)*2.399+(e.id>other.id?Math.PI:0));x+=Math.cos(angle)*strength;y+=Math.sin(angle)*strength;}const length=Math.max(1,Math.hypot(x,y));return {x:x/length,y:y/length};}

export function smoothEnemyVelocity(e,x,y,dt){
 const blend=1-Math.exp(-dt*14);
 e.steerX=(e.steerX||0)+(x-(e.steerX||0))*blend;
 e.steerY=(e.steerY||0)+(y-(e.steerY||0))*blend;
 return {x:e.steerX,y:e.steerY};
}
