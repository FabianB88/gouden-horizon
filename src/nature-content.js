const native=points=>points.map(([x,y])=>[x/1536,y/1024]);
const broad=native([[150,310],[370,225],[1180,225],[1390,350],[1440,780],[1200,950],[320,950],[130,770]]);
export const NATURE_AREAS=[
 {id:'lanternwood',name:'Het Lantaarnwoud',file:'lanternwood-v83.webp',zone:5,kind:'route',safe:true,optional:true,biomeRegion:true,natureRegion:true,unlockChapter:'heatworks',spawn:[.22,.78],exit:[.76,.34],pocket:[.5,.6],nav:[broad],links:['cooling-refuge','crystalfalls','coppercrown'],map:[63,83],story:'Een verlaten tuinstad leeft tussen wortels en lagunes. Verken de verbonden pleinen en oude kassen. De Kristalwaterval opent de route naar de Kroonbeer.'},
 {id:'crystalfalls',name:'De Kristalwaterval',file:'crystalfalls-v83.webp',zone:5,kind:'hub',side:true,optional:true,biomeRegion:true,natureRegion:true,natureArena:true,unlockChapter:'heatworks',returnHub:'lanternwood',spawn:[.24,.78],exit:[.79,.35],nav:[broad],links:['lanternwood'],map:[75,82],itemLevel:20,reward:180,enemies:['mossback','sunnewt','windowl'],story:'Mosruggen, zonnegekko’s en winduilen bewaken het oude waterkrachtveld. Twee groepen, met vuur, snelle windschoten en zware charges. Water- en vuurweerstand helpen.'},
 {id:'coppercrown',name:'De Koperen Kroon',file:'coppercrown-v83.webp',zone:5,kind:'hub',side:true,optional:true,biomeRegion:true,natureRegion:true,natureArena:true,natureBoss:true,unlockChapter:'heatworks',unlockArena:'crystalfalls',returnHub:'lanternwood',spawn:[.24,.78],exit:[.78,.36],nav:[broad],links:['lanternwood'],map:[85,84],itemLevel:21,reward:240,guardian:'crownbear',story:'Een herhaalbaar solobaasgevecht: de Kroonbeer. Ontwijk de klauw, stap over de uitdijende krans en verlaat de amberzones vóór de wortels losbarsten.'}
];
export const NATURE_ENEMIES={
 mossback:{name:'Mosrug',natureArt:true,hp:230,damage:20,speed:88,radius:29,size:122,range:310,xp:75,color:'#b7d68e',role:'tank',element:'metal'},
 sunnewt:{name:'Zonnegekko',natureArt:true,hp:175,damage:19,speed:137,radius:24,size:113,range:510,xp:70,color:'#ffb475',role:'ranged',element:'fire'},
 windowl:{name:'Winduil',natureArt:true,hp:160,damage:16,speed:152,radius:23,size:116,range:450,xp:70,color:'#a1e4d3',role:'orbit',element:'water'},
 crownbear:{name:'De Kroonbeer',natureArt:true,boss:true,hp:2250,damage:27,speed:90,radius:44,size:230,range:590,xp:340,color:'#ffdd8d',role:'tank',element:'solar'}
};
export const NATURE_LANDMARKS=[{id:'oldglass',name:'De oude kas',x:1240,y:440},{id:'terrace',name:'Lagunezicht',x:380,y:450},{id:'canopy',name:'Het lichtplein',x:1250,y:970}];
export const NATURE_HUB_LAYOUT={spawn:[.22,.78],services:{smith:[1130,570],outfitter:[540,580],workshop:[1160,955]},cache:[1540,745],supply:[610,960],portals:{'cooling-refuge':[395,965],crystalfalls:[1400,460],coppercrown:[1440,990]}};

// Floors follow the actual painted paving; broad connectors overlap courtyards.
const cityFloors=[
 [[105,725],[220,660],[440,670],[535,795],[475,895],[325,945],[125,850]],
 [[330,895],[445,880],[500,970],[510,1024],[385,1024],[350,955]],
 [[180,670],[240,540],[370,490],[440,575],[390,710],[245,745]],
 [[240,385],[360,360],[425,425],[535,480],[630,470],[650,560],[560,620],[425,600],[290,500],[205,435]],
 [[470,445],[585,425],[810,390],[940,435],[1045,530],[920,660],[735,725],[525,635],[470,545]],
 [[750,635],[885,650],[980,785],[1110,870],[1180,970],[1160,1024],[950,1024],[880,920],[770,810]],
 [[1020,650],[1160,565],[1315,580],[1390,650],[1480,715],[1475,870],[1330,925],[1190,890],[1100,805]],
 [[1155,860],[1335,920],[1310,1024],[1170,1024],[1120,945]],
 [[860,440],[990,400],[1120,375],[1240,365],[1280,470],[1170,525],[1070,570],[945,600]],
 [[1175,330],[1270,295],[1410,325],[1490,425],[1440,510],[1300,545],[1170,470],[1120,400]],
 [[755,425],[805,345],[850,270],[895,235],[945,235],[955,280],[910,330],[880,380],[845,465]],
 [[885,195],[940,155],[1040,145],[1130,190],[1135,240],[1060,285],[950,285],[865,250]],
 [[190,350],[350,330],[455,265],[505,195],[650,180],[725,220],[740,290],[635,340],[495,355],[390,425],[270,425]],
 [[45,335],[180,335],[230,390],[160,460],[55,415]]
];
NATURE_AREAS[0].nav=cityFloors.map(native);NATURE_AREAS[0].spawn=[.28,.84];
Object.assign(NATURE_HUB_LAYOUT,{spawn:NATURE_AREAS[0].spawn,services:{smith:[800*1.25,590*1.25],outfitter:[260*1.25,810*1.25],workshop:[1230*1.25,875*1.25]},cache:[1350*1.25,490*1.25],supply:[650*1.25,300*1.25],portals:{'cooling-refuge':[430*1.25,970*1.25],crystalfalls:[1090*1.25,230*1.25],coppercrown:[1430*1.25,780*1.25]}});
NATURE_LANDMARKS[0].x=505*1.25;NATURE_LANDMARKS[0].y=275*1.25;NATURE_LANDMARKS[1].x=1210*1.25;NATURE_LANDMARKS[1].y=450*1.25;NATURE_LANDMARKS[2].x=340*1.25;NATURE_LANDMARKS[2].y=850*1.25;
NATURE_AREAS[1].nav=[native([[145,280],[360,300],[570,350],[780,435],[1040,400],[1250,340],[1400,350],[1500,545],[1460,815],[1270,935],[1040,945],[990,1024],[630,1024],[520,955],[275,915],[125,780],[65,590],[70,420]])];NATURE_AREAS[1].exit=[.875,.405];
NATURE_AREAS[2].nav=[native([[130,410],[385,310],[685,285],[980,275],[1245,330],[1410,445],[1500,650],[1400,850],[1240,930],[850,940],[430,900],[180,765],[90,590]])];NATURE_AREAS[2].exit=[.70,.35];
