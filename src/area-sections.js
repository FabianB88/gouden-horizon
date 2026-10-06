import {AREA_BY_ID,worldBounds} from './data.js?v=46';

// Pieces share their saved quests/world state, but each painting is a separate
// screen. Coordinates remain stable so existing saves and NPCs keep their place.
export const SECTION_ENTRIES={
 canal:{names:['De Getijdenkade','De Tuinwijk'],arrival:[450,400]},
 highway:{names:['Vrijhaven','De Oostwijk'],arrival:[300,650]},
 forest:{names:['De Groene Corridor','De Wilde Serre'],arrival:[205,505]},
 skybridge:{names:['De Buitenzeebrug','Stormwacht'],arrival:[350,310]},
 'cooling-refuge':{names:['Koelhof','De Sintelhoven'],arrival:[280,400]},
};
export function sectionIndex(id,point){const a=AREA_BY_ID[id];if(!SECTION_ENTRIES[id]||!a?.tiles)return 0;return point?.x>=a.tiles[1].x?1:0;}
export function sectionBounds(id,point){const a=AREA_BY_ID[id],index=sectionIndex(id,point);if(SECTION_ENTRIES[id]&&a?.tiles)return {...a.tiles[index],index,name:SECTION_ENTRIES[id].names[index]};return {x:0,y:0,...worldBounds(id),index:0,name:a?.name};}
export function sameSection(id,a,b){return sectionIndex(id,a)===sectionIndex(id,b);}
export function insideSection(id,origin,x,y,radius=0){const b=sectionBounds(id,origin);return x-radius>=b.x&&x+radius<=b.x+b.width&&y-radius>=b.y&&y+radius<=b.y+b.height;}
export function sectionArrival(id,index){const a=AREA_BY_ID[id],t=a?.tiles?.[index];if(!t||!SECTION_ENTRIES[id])return null;const p=index?SECTION_ENTRIES[id].arrival:[a.spawn[0]*1920/t.width*1536,a.spawn[1]*1280/t.height*1024];return {x:t.x+p[0]*t.width/1536,y:t.y+p[1]*t.height/1024};}
