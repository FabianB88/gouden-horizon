const colors={tide:'#82e9ec',water:'#82e9ec',storm:'#c8b5ff',volt:'#c8b5ff',frost:'#bcf2ff',cryo:'#bcf2ff',ember:'#ffc275',solar:'#ffc275',gale:'#b8e9b3',gravity:'#dcaffe',prism:'#ffdf93'};
export function registerHit(e,p,damage,element,crit,secondary,boss=false){const dx=e.x-p.x,dy=(e.y-p.y)*1.15,length=Math.hypot(dx,dy)||1;e.impact={age:0,life:.15,x:dx/length,y:dy/length,strength:(boss?.7:damage>=60?2.7:1.7)*(crit?1.3:1)*(secondary?.6:1),element,crit};}
export function impactMotion(e){const hit=e.impact;if(!hit||hit.age>=hit.life)return {x:0,y:0,rotation:0};const force=hit.strength*Math.exp(-hit.age*25);return {x:hit.x*force,y:hit.y*force/1.15,rotation:hit.x*force*.008};}
export function advanceFeedback(e,dt){if(e.impact)e.impact.age+=dt;e.deathVisualLife=Math.max(0,(e.deathVisualLife||0)-dt);}
export const FeedbackVisuals={
 drawHitSpark(e){const u=Math.min(1,e.age/(e.age+e.life)),color=colors[e.element]||'#f2e6c4',fade=(1-u)*(e.secondary?.65:1),angle=Math.atan2(e.dir?.y||0,e.dir?.x||1),element={tide:'water',volt:'storm',cryo:'water',frost:'water',physical:'metal',ember:'solar',prism:'solar',gravity:'storm',gale:'water'}[e.element]||e.element;
  this.combatSprite(element,2,e.x,e.y,((e.crit?39:26)+u*8),angle,fade*.8);this.glow(e.x,e.y,17,color,fade*.16);
  for(let i=0;i<(e.crit?4:2);i++){const a=angle+(i%2?1:-1)*(.8+Math.floor(i/2)*.4),r=7+u*(e.crit?23:13);this.line({x:e.x+Math.cos(a)*r,y:e.y+Math.sin(a)*r*.75},{x:e.x+Math.cos(a)*(r+5),y:e.y+Math.sin(a)*(r+5)*.75},color+Math.round(fade*200).toString(16).padStart(2,'0'),e.crit?2:1.5);}
 }
};
