// Coordinates remain in the painted map's base world units until initialized.
// Hero/NPC artwork keeps its original size; the town itself gains walking room.
export const HUB_SCALES={canal:1.4,highway:1.4,forest:1.4};
export const hubScale=id=>HUB_SCALES[id]||1;
export function spaciousPoint(point,id){const scale=hubScale(id);return {...point,x:point.x*scale,y:point.y*scale};}
