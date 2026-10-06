// Independently traced walking lines on the paintings. Exercise both sides of
// each path as well as its centre, rather than letting A* dodge missing paving.
export const PAINTED_LANES=[
 ['western upper terrace',0,12,[[320,135],[420,163],[550,195],[680,220],[765,244],[806,282],[850,315],[925,307]]],
 ['western stair flights',0,12,[[240,177],[258,227],[282,270],[328,318],[374,370],[443,417],[514,460],[548,481]]],
 ['market stairs',0,12,[[764,553],[799,591],[840,632],[876,671],[917,705],[970,741]]],
 ['eastern market ramp',0,12,[[984,565],[1017,608],[1074,660],[1135,710],[1215,781]]],
 ['gate and moonseed landing',1,12,[[475,425],[493,409],[530,405],[570,405],[627,381],[674,372],[697,394],[719,424],[750,455],[775,468]]],
 ['central garden and eastern bridge',1,14,[[710,550],[764,585],[835,573],[905,548],[977,522],[1042,515],[1118,490],[1194,446],[1288,410],[1373,384],[1460,376],[1511,396]]],
 ['crystal terrace zigzag stairs',1,10,[[1043,515],[1075,500],[1125,456],[1190,400],[1195,383],[1158,336],[1110,305],[1070,280],[1040,263],[1020,240],[1097,198],[1160,149]]],
 ['southern garden and exit promenade',1,12,[[916,620],[990,652],[1058,691],[1060,709],[1030,738],[1000,767],[1058,806],[1143,857],[1252,914],[1358,973],[1456,990],[1488,1001]]],
 ['temple approach and open porch',1,10,[[1075,832],[1130,809],[1172,789],[1220,784],[1262,766],[1272,744]]],
 ['western main promenade',0,12,[[330,620],[450,563],[580,496],[740,415],[880,352],[1000,294],[1170,206],[1312,125]]],
 ['western southern promenade',0,10,[[350,625],[470,619],[540,635],[610,670],[698,714],[765,760],[812,780],[925,785],[1005,775]]],
 ['western garden stair approach',0,10,[[710,455],[755,487],[799,516],[815,567]]],
 ['western greenhouse balcony',0,10,[[1180,770],[1225,795],[1257,813],[1248,834],[1215,824]]],
 ['conservatory entry stairs',1,12,[[35,244],[90,271],[135,318],[220,369],[315,414],[400,450],[455,460]]],
 ['Seya forecourt loop',1,12,[[50,586],[140,536],[205,505],[285,534],[380,551],[466,579],[525,569],[475,534],[400,505],[365,480],[365,448],[400,440],[455,460]]],

];
// Independent legs within each screen; travel between them uses the edge button.
// The physical conservatory gate still opens through the usual interaction.
const east=points=>points.map(([x,y])=>[x+1536,y]);
const crystal=PAINTED_LANES[6][3].slice(0,10);
export const PAINTED_JOURNEY={
 market:PAINTED_LANES[9][3],
 beforeGate:east([[205,505],[285,534],[380,551],[400,505],[365,480],[365,448],[400,440],[455,460]]),
 afterGate:east([
  [455,460],[465,442],...PAINTED_LANES[4][3],
  [800,515],[835,573],[905,548],[977,522],
  ...crystal,[1020,235],...crystal.toReversed(),
  [977,522],[905,548],[835,573],...PAINTED_LANES[7][3],
 ]),
};
