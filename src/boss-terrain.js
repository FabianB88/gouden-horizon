const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
export const BossTerrainRules={
 planTerrainAttack(e){const w=e.windup;if(!w)return;const p=w.target;
  if(w.mode==='firePatches'||w.mode==='icePatches')w.targets=[{...p},{x:p.x-w.dir.y*160,y:p.y+w.dir.x*160/1.15},{x:p.x+w.dir.y*160,y:p.y-w.dir.x*160/1.15}];
  if(e.type==='furnacegunner'&&w.mode==='firePatches')w.targets=[{...p}];
  if(w.mode==='solarBarriers')w.targets=[-1,0,1].map(i=>({x:p.x+w.dir.x*150-w.dir.y*i*150,y:p.y+(w.dir.y*150+w.dir.x*i*150)/1.15}));
 },
 executeTerrainAttack(e,damage){const w=e.windup;if(!['firePatches','icePatches','solarBarriers'].includes(w?.mode))return false;const threats=this.state.world.threats;
  const type=w.mode==='solarBarriers'?'bossBarrier':'bossPatch',element=w.mode==='icePatches'?'water':'fire';
  // A danger zone expires before the next cast of the same pattern.
  for(const old of threats.filter(t=>t.type===type&&t.source===e.id))old.life=0;
  for(const point of w.targets){const t={id:++this.idCounter,type,source:e.id,x:point.x,y:point.y,r:type==='bossBarrier'?36:e.type==='furnacegunner'?75:96,element,damage:damage*.8,age:0,arm:.8,life:type==='bossBarrier'?5.2:e.type==='furnacegunner'?3.6:6,tick:0};
   // Never grow a solid pillar over the player, a companion or the boss.
   if(type==='bossBarrier'&&[this.state.player,...this.state.world.enemies.filter(n=>!n.dead),...(this.state.summons||[])].some(n=>distance(n,t)<t.r+(n.radius||18)+14))continue;
   threats.push(t);
  }
  this.notice(w.mode==='firePatches'?'VUURZONES · verlaat de oranje cirkels':w.mode==='icePatches'?'VORSTZONES · ijs doet schade en vertraagt':'ENERGIEBLOKKADES · blijf tussen de pijlers bewegen',element==='fire'?'#ffd49b':'#b8efff');return true;
 },
 updateBossTerrain(dt){const s=this.state,p=s.player;for(const t of s.world.threats){if(t.type!=='bossPatch'||t.age<t.arm||t.life<=0)continue;t.tick-=dt;if(t.tick<=0){t.tick=.7;if(distance(p,t)<t.r){this.hurtPlayer(t.damage,t.element);if(t.element==='water')p.rootSlow=Math.max(p.rootSlow||0,.8);}}}},
 blockedByBossTerrain(x,y,radius=18,entity=null){return this.state.world?.threats.some(t=>t.type==='bossBarrier'&&t.life>0&&t.age>=t.arm&&Math.hypot(x-t.x,(y-t.y)*1.15)<t.r+radius&&(!entity||Math.hypot(x-t.x,(y-t.y)*1.15)<Math.hypot(entity.x-t.x,(entity.y-t.y)*1.15)));}
};
