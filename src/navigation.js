// Static edges are shared by actors; closed doors remain a live constraint.
export function createNavigator(canStand,clearLine,bounds,fingerprint=()=>0){
 const caches=new Map(),baked=new Map(),cell=24,steps=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
 const prepare=(area,radius=18)=>{
  const cacheKey=area+':'+radius;let grid=caches.get(cacheKey);
  if(!grid){grid=new Map();const size=bounds(area),record=baked.get(cacheKey);for(let y=1;y<size.height/cell;y++)for(let x=1;x<size.width/cell;x++)if(record?record.cells[x+y*record.cols]&256:canStand(x*cell,y*cell,radius+2,area))grid.set(x+','+y,{x:x*cell,y:y*cell,gx:x,gy:y,edges:null});
   if(record)for(const node of grid.values()){node.edges=[];const flags=record.cells[node.gx+node.gy*record.cols];for(const [i,[dx,dy]]of steps.entries())if(flags&(1<<i)){const key=(node.gx+dx)+','+(node.gy+dy),v=grid.get(key);if(v)node.edges.push({key,node:v,cost:Math.hypot(dx,dy)*cell});}}
   caches.set(cacheKey,grid);}
  return grid;
 };
 const findPath=function(a,b,area=0,radius=18,allowed=null){
  const line=(p,q,r=radius)=>clearLine(p,q,area,r,allowed);
  if(!canStand(a.x,a.y,radius,area)||!canStand(b.x,b.y,radius,area)||allowed&&(!allowed(a.x,a.y,radius)||!allowed(b.x,b.y,radius)))return [];
  if(line(a,b))return [{x:b.x,y:b.y}];
  const grid=prepare(area,radius);
  const nearest=p=>{
   const candidates=[],cx=Math.round(p.x/cell),cy=Math.round(p.y/cell);
   for(let y=cy-4;y<=cy+4;y++)for(let x=cx-4;x<=cx+4;x++){const key=x+','+y,v=grid.get(key);if(v)candidates.push({key,v,d:Math.hypot(p.x-v.x,p.y-v.y)});}
   candidates.sort((a,b)=>a.d-b.d);for(const {key,v}of candidates)if(line(p,v))return key;
   return null;
  };
  const start=nearest(a),goal=nearest(b);if(!start||!goal)return [];
  const heap=[],push=item=>{heap.push(item);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].f<=item.f)break;heap[i]=heap[p];i=p;}heap[i]=item;},pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let child=i*2+1;if(child+1<heap.length&&heap[child+1].f<heap[child].f)child++;if(last.f<=heap[child].f)break;heap[i]=heap[child];i=child;}heap[i]=last;}return first;};
  const g=new Map([[start,0]]),prev=new Map(),done=new Set(),target=grid.get(goal),h=v=>Math.hypot(v.x-target.x,v.y-target.y);push({key:start,f:h(grid.get(start)),score:0});
  while(heap.length){const current=pop(),key=current.key;if(done.has(key)||current.score!==g.get(key))continue;
   if(key===goal){const path=[{x:b.x,y:b.y}];let k=goal;while(k!==start){const v=grid.get(k);path.unshift({x:v.x,y:v.y});k=prev.get(k);}const v=grid.get(start);path.unshift({x:v.x,y:v.y});const compact=[];let anchor=a,index=0;while(index<path.length){let best=index,span=1,failed=path.length;while(index+span<path.length){const probe=index+span;if(!line(anchor,path[probe],radius+2)){failed=probe;break;}best=probe;span*=2;}if(failed===path.length&&best!==path.length-1&&line(anchor,path[path.length-1],radius+2))best=path.length-1;else{let low=best+1,high=Math.min(failed-1,path.length-1);while(low<=high){const mid=(low+high)>>1;if(line(anchor,path[mid],radius+2)){best=mid;low=mid+1;}else high=mid-1;}}compact.push(path[best]);anchor=path[best];index=best+1;}return compact;}
   done.add(key);const node=grid.get(key);
   if(!node.edges){node.edges=[];for(const [dx,dy]of steps){const next=(node.gx+dx)+','+(node.gy+dy),v=grid.get(next);if(v&&clearLine(node,v,area,radius+2))node.edges.push({key:next,node:v,cost:Math.hypot(dx,dy)*cell});}}
   for(const edge of node.edges){if(done.has(edge.key)||allowed&&!line(node,edge.node,radius+2))continue;const score=current.score+edge.cost;if(score<(g.get(edge.key)??Infinity)){g.set(edge.key,score);prev.set(edge.key,key);push({key:edge.key,score,f:score+h(edge.node)});}}
  }return [];
 };
 findPath.prepare=prepare;
 findPath.install=records=>{let installed=0;for(const r of records)if(r.fingerprint===fingerprint(r.area)){installed++;baked.set(r.area+':'+r.radius,r);caches.delete(r.area+':'+r.radius);}return installed;};
 findPath.bake=(area,radius=18)=>{
  const size=bounds(area),cols=Math.ceil(size.width/cell),rows=Math.ceil(size.height/cell),cells=new Array(cols*rows).fill(0);
  for(let y=1;y<rows;y++)for(let x=1;x<cols;x++)if(canStand(x*cell,y*cell,radius+2,area))cells[x+y*cols]=256;
  for(let y=1;y<rows;y++)for(let x=1;x<cols;x++)if(cells[x+y*cols]&256)for(const [i,[dx,dy]]of steps.entries()){const xx=x+dx,yy=y+dy;if(xx>0&&xx<cols&&yy>0&&yy<rows&&(cells[xx+yy*cols]&256)&&clearLine({x:x*cell,y:y*cell},{x:xx*cell,y:yy*cell},area,radius+2))cells[x+y*cols]|=1<<i;}
  return {area,radius,cols,rows,cells,fingerprint:fingerprint(area)};
 };
 return findPath;
}
