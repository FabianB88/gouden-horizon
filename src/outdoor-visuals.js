import {OUTDOOR_REGIONS,outdoorPoint} from './outdoor-content.js?v=33';
const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.15);
export const OutdoorVisuals={
 drawOutdoorNPC(npc,s){const r=OUTDOOR_REGIONS[s.area];this.ellipse(npc.x,npc.y,23,10,'#152b3455');this.sprite(this.assets['npc-'+r.npc],this.outdoorNPCCrop[r.npc],npc.x,npc.y,137);if(distance(s.player,npc)<330){this.text(npc.name,npc.x,npc.y-151,'#f5e1ad',14);this.text(r.name,npc.x,npc.y+23,r.color,12);}},
 drawOutdoorDoor(s){const r=OUTDOOR_REGIONS[s.area],o=s.world.outdoor;if(!r||!o)return;const a=outdoorPoint(s.area,r.door[0]),b=outdoorPoint(s.area,r.door[1]);if(!this.inView((a.x+b.x)/2,(a.y+b.y)/2,160))return;
  const c=this.ctx,open=o.open?Math.min(1,Math.max(0,(s.time-(o.openedAt??s.time-1))/.65)):0,height=88*r.scale,lift=open*height;
  // Two traced foot anchors fit the painted panel to each existing arch.
  // It lifts in place; the actual floor and door coordinates never move.
  if(open<1){const vertical=height/710;c.save();c.globalAlpha*=1-open;c.translate(a.x,a.y-lift);c.transform((b.x-a.x)/988,(b.y-a.y-462*vertical)/988,0,vertical,0,0);c.drawImage(this.assets.outdoorDoor,-86,-848);c.restore();}
  const x=(a.x+b.x)/2,y=(a.y+b.y)/2;if(!o.open&&distance(s.player,{x,y})<250)this.text('F · '+r.doorName,x,y+28,'#f4d392',14);
 },
 drawOutdoorPoint(q,s){const r=OUTDOOR_REGIONS[s.area],o=s.world.outdoor,point=outdoorPoint(s.area,q.point),done=o.done.includes(q.id);if(!o.open||!this.inView(point.x,point.y,100))return;
  const c=this.ctx,x=point.x,y=point.y;this.ellipse(x,y,23,11,done?'#52745555':'#293e4755',done?'#95c596':'#bfa36b',1.5);
  if(r.mode==='harvest'){this.sprite(this.assets['item-seed-heart'],{bounds:[0,0,256,256],anchor:[.5,.85]},x,y,38,false,0,done?.45:1);
  }else if(r.mode==='vent'){this.ellipse(x,y-17,15,15,'#405e61','#d4ac65',3);for(let i=0;i<4;i++){const a=i*Math.PI/2;this.line({x:x+Math.cos(a)*4,y:y-17+Math.sin(a)*4},{x:x+Math.cos(a)*18,y:y-17+Math.sin(a)*18},'#ead1a0',3);}this.ellipse(x,y-17,4,4,done?'#9ee3b5':'#f69a59');
  }else{this.line({x,y},{x,y:y-41},'#a99053',7);c.save();c.translate(x,y-47);c.beginPath();c.moveTo(0,-18);c.lineTo(10,0);c.lineTo(0,14);c.lineTo(-10,0);c.closePath();c.fillStyle=done?'#adf4ea':'#92b7c9';c.fill();c.strokeStyle='#eed496';c.lineWidth=2;c.stroke();c.restore();if(o.channel?.id===q.id){const t=Math.min(1,o.channel.time/2);c.beginPath();c.ellipse(x,y,27,13,-Math.PI/2,0,Math.PI*2*t);c.strokeStyle='#baf7f0';c.lineWidth=3;c.stroke();}}
  if(distance(s.player,point)<170)this.text(done?'✓ '+q.name:q.name,x,y+28,done?'#b5d5a4':'#f4e0b7',13);
 }
};
