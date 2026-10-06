// Separate ground and prop sprites. Placement uses native painting units;
// drawing and collision both project the same dimensions into world units.
export const MODULE_ASSETS={"paving":{"file":"assets/modules/forest-paving-v8102.webp","size":[400,214],"anchor":[0.5,0.5]},"planter":{"file":"assets/modules/forest-planter-v8102.webp","size":[256,193],"anchor":[0.5,0.88]},"lamp":{"file":"assets/modules/forest-lamp-v8102.webp","size":[97,320],"anchor":[0.5,0.935]}};
const pavingHeight=120*MODULE_ASSETS.paving.size[1]/MODULE_ASSETS.paving.size[0];
export const MODULE_LAYOUTS={forest:{scale:1.75,offset:1536,pieces:[
 {id:'serre-floor-a',type:'paving',point:[305,505],width:120},
 {id:'serre-floor-b',type:'paving',point:[365,505+pavingHeight/2],width:120},
 {id:'serre-planter',type:'planter',point:[180,420],width:62,rx:21,ry:10},
 {id:'serre-lamp',type:'lamp',point:[590,630],height:95,rx:8,ry:5}
]}};
const pieces=Object.fromEntries(Object.entries(MODULE_LAYOUTS).map(([area,{scale,offset,pieces}])=>[area,pieces.map(p=>{
 const asset=MODULE_ASSETS[p.type],width=(p.width||p.height*asset.size[0]/asset.size[1])*scale,height=width*asset.size[1]/asset.size[0];
 return {...p,x:(offset+p.point[0])*scale,y:p.point[1]*scale,width,height,rx:(p.rx||0)*scale,ry:(p.ry||0)*scale,asset,sceneModule:true,paintedOnly:true};
})]));
export const sceneryModules=area=>pieces[area]||[];
export function moduleFloor(piece){return [[-piece.width/2,0],[0,-piece.height/2],[piece.width/2,0],[0,piece.height/2]].map(([dx,dy])=>({x:piece.x+dx,y:piece.y+dy}));}
export function installModuleFloors(areas,world){for(const [id,items]of Object.entries(pieces))for(const piece of items)if(piece.type==='paving')areas[id].nav.push(moduleFloor(piece).map(p=>[p.x/world.width,p.y/world.height]));}
export function drawSceneryModule(renderer,piece){const image=renderer.assets['module-'+piece.type];if(!image||!renderer.inView(piece.x,piece.y,piece.width,piece.height+20,40))return;renderer.ctx.drawImage(image,piece.x-piece.asset.anchor[0]*piece.width,piece.y-piece.asset.anchor[1]*piece.height,piece.width,piece.height);}
