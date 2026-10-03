// Original slow modal harmony, written for Gouden Horizon. No sampled music.
export function scoreStep(zone,step,tension=0,area=null){
 const green=['groenkloof','lanternwood','crystalfalls'].includes(area),crown=area==='coppercrown',dry=area==='glass-dunes',roots=[146.83,130.81,164.81,174.61,138.59,155.56],root=crown?146.83:green?164.81:dry?130.81:roots[Math.max(0,Math.min(5,zone))],notes=[];
 const chords=green?[[1,1.25,1.5],[4/3,5/3,2],[1.5,1.875,2.25],[1,1.25,1.5]]:dry?[[1,1.2,1.5],[.8,1,1.2],[4/3,1.6,2],[1,1.2,1.5]]:[[1,1.2,1.5],[4/3,1.6,2],[1.2,1.5,1.8],[1,1.25,1.5]],chord=chords[Math.floor(step/8)%4];
 if(step%8===0)for(const ratio of chord)notes.push({frequency:root*ratio,duration:7.8,kind:'pad',volume:.035});
 const melody=green?[2,0,2.5,0,3,0,0,0,2.5,0,2,0,1.5,0,0,0,1.25,0,1.5,0,2,0,0,0,1.5,0,1.25,0,1,0,0,0]:dry?[1.5,0,0,0,1.2,0,1,0,1.6,0,0,0,1.5,0,1.2,0,2,0,0,0,1.8,0,1.5,0,1.2,0,0,0,1,0,0,0]:[2,0,1.5,0,1.8,0,1.5,0,1.6,0,2,0,2.4,0,2,0,1.8,0,1.5,0,1.2,0,1.5,0,2,0,1.5,0,1.25,0,1,0];
 if(melody[step%32])notes.push({frequency:root*melody[step%32],duration:green?4.5:3.6,kind:green?'flute':'bell',volume:.027});
 if(step%8===0)notes.push({frequency:root*.5,duration:7.2,kind:'pad',volume:.026});
 if(tension>.15&&step%2===0)notes.push({frequency:root*.25,duration:.55,kind:'pulse',volume:.018*Math.min(1,tension)});
 return notes;
}
