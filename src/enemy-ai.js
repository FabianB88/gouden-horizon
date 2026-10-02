// Short, committed movement choices keep ranged enemies from shivering at
// their ideal distance. Collision and path finding remain owned by the engine.
export function tacticalMovement(e,dir,distance,dt){
 const flanker=e.type==='hunter'||e.type==='rimedrone';
 const gunner=e.type==='pressurediver'||e.type==='furnacegunner';
 if(!flanker&&!gunner)return null;
 e.tacticTime=(e.tacticTime||0)-dt;
 if(e.tacticTime<=0){e.tacticTime=1.3+(e.id%4)*.18;e.flankSide=e.flankSide|| (e.id%2?1:-1);if(flanker&&e.attacks!==e.tacticAttack){e.flankSide*=-1;e.tacticAttack=e.attacks;}}
 const close=flanker?185:270,far=flanker?340:420;
 if(distance>far+25)e.approach=1;
 else if(distance<close-20)e.approach=-1;
 else if(distance>close+25&&distance<far-25)e.approach=0;
 const forward=e.approach||0,side=(flanker?.82:.35)*e.flankSide;
 const x=dir.x*forward-dir.y*side,y=dir.y*forward+dir.x*side,length=Math.max(1,Math.hypot(x,y));
 return {x:x/length,y:y/length};
}

export function smoothEnemyVelocity(e,x,y,dt){
 const blend=1-Math.exp(-dt*14);
 e.steerX=(e.steerX||0)+(x-(e.steerX||0))*blend;
 e.steerY=(e.steerY||0)+(y-(e.steerY||0))*blend;
 return {x:e.steerX,y:e.steerY};
}
