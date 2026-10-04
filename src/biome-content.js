// Optional places have their own visual language, creature silhouettes and rules.
// Floor polygons follow the connected paving in the original environment art.
const native=points=>points.map(([x,y])=>[x/1536,y/1024]);
const world=([x,y])=>[x*1.25,y*1.25];
export const BIOME_AREAS=[
 {id:'groenkloof',name:'Groenkloof · De Verborgen Wadi',file:'groenkloof-v81.webp',zone:5,kind:'route',safe:true,optional:true,biomeRegion:true,unlockChapter:'cooling-refuge',spawn:[.25,.76],exit:[.78,.34],pocket:[.5,.6],nav:[native([[250,285],[565,190],[1010,200],[1340,325],[1360,630],[1170,830],[550,910],[230,790],[175,550]])],links:['cooling-refuge','glass-dunes'],map:[70,72],story:'Een verborgen groene kloof: volg de waterranden, wandel langs de oude koelgoten en verken de zijpaden. De droge vallei achter de hoge doorgang heeft eigen bewakers.'},
 {id:'glass-dunes',name:'De Glazen Duinen',file:'glass-dunes-v81.webp',zone:5,kind:'hub',side:true,optional:true,biomeRegion:true,biomeArena:true,unlockChapter:'cooling-refuge',returnHub:'groenkloof',spawn:[.25,.75],exit:[.80,.38],nav:[native([[230,310],[490,225],[1020,215],[1320,320],[1400,540],[1320,785],[1010,910],[540,920],[230,770],[180,540]])],links:['groenkloof'],map:[85,72],itemLevel:18,reward:210,enemies:['glassscorpion','dustskirmisher','slagcarrier'],guardian:'dunebreaker',story:'Amber schorpioenen, stofschutters en slakdragers bewaken het drooggevallen pompveld. Twee groepen en een Duinbreker: kies je doel, gebruik dekking en bereid gif- en vuurweerstand voor.'}
];
export const BIOME_ENEMIES={
 glassscorpion:{name:'Glasschorpioen',sprite:'glassscorpion',biomeArt:true,hp:190,damage:18,speed:145,radius:26,size:108,range:300,xp:70,color:'#bedb64',role:'hunter',element:'toxin'},
 dustskirmisher:{name:'Stofschutter',sprite:'dustskirmisher',biomeArt:true,hp:175,damage:16,speed:141,radius:23,size:123,range:550,xp:65,color:'#e9bd77',role:'ranged',element:'metal'},
 slagcarrier:{name:'Slakdrager',sprite:'slagcarrier',biomeArt:true,hp:335,damage:23,speed:76,radius:34,size:150,range:510,xp:110,color:'#ff9e60',role:'tank',element:'fire'},
 dunebreaker:{name:'De Duinbreker',sprite:'dunebreaker',biomeArt:true,boss:true,hp:2250,damage:27,speed:77,radius:47,size:231,range:680,xp:320,color:'#eac48e',role:'tank',element:'metal'}
};
export const BIOME_HUB_LAYOUTS={groenkloof:{spawn:[.25,.76],floors:[],nav:[],services:{smith:world([1110,340]),outfitter:world([450,470]),workshop:world([980,760])},cache:world([1120,580]),supply:world([485,760]),portals:{'cooling-refuge':world([355,785]),'glass-dunes':world([1160,365])}}};
const greenFloor=[
 [[430,340],[690,340],[865,335],[1050,380],[1170,460],[1100,610],[915,670],[795,630],[680,680],[550,680],[425,580],[400,450]],
 [[260,290],[350,255],[455,285],[490,355],[465,410],[340,410],[250,365],[220,320]],
 [[470,215],[625,230],[725,255],[705,305],[585,345],[450,365],[395,310]],
 [[835,378],[930,330],[1060,280],[1165,190],[1325,145],[1390,200],[1375,250],[1275,350],[1135,420],[1010,450],[870,450]],
 [[1040,375],[1200,350],[1310,380],[1380,450],[1365,490],[1240,545],[1130,525],[1010,465]],
 [[660,580],[815,615],[960,650],[1090,710],[1095,785],[1045,840],[840,840],[750,750],[680,670]],
 [[500,560],[645,630],[540,720],[465,825],[380,920],[315,1024],[240,1024],[230,960],[290,855],[370,720],[395,640]]
];
BIOME_AREAS[0].nav=greenFloor.map(native);
Object.assign(BIOME_HUB_LAYOUTS.groenkloof,{nav:greenFloor,services:{smith:world([990,415]),outfitter:world([385,365]),workshop:world([880,770])},cache:world([1260,470]),supply:world([545,275]),portals:{'cooling-refuge':world([360,840]),'glass-dunes':world([1240,270])}});
