const native=points=>points.map(([x,y])=>[x/1536,y/1024]);
const floor=native([[180,280],[430,160],[1130,160],[1370,340],[1390,780],[1170,940],[350,940],[140,760]]);
export const QUARTER_AREAS=[
 {id:'rain-garden',name:'De Hangende Tuinen',file:'rooftop-garden-v84.webp',zone:1,kind:'explore',safe:true,safeExplore:true,optional:true,unlockChapter:'highway',spawn:[.5,.72],exit:[.5,.90],nav:[floor],links:['highway','quiet-apartments'],map:[23,29],story:'Volg de brede terrassen naar de oude regenkas. Het regenkompas is een spoor naar een vergeten ambachtsvrouw.'},
 {id:'quiet-apartments',name:'De Stille Woningen',file:'abandoned-apartments-v84.webp',zone:1,kind:'explore',safe:true,safeExplore:true,optional:true,unlockChapter:'highway',spawn:[.5,.72],exit:[.5,.90],nav:[floor],links:['highway','rain-garden'],map:[35,34],story:'Doorzoek de open woningen, lees wat bewoners achterlieten en vind de sleutel van het atelier onder Vrijhaven.'},
 {id:'hidden-atelier',name:'Het Verborgen Atelier',file:'hidden-workshop-v84.webp',zone:1,kind:'explore',safe:true,safeExplore:true,optional:true,unlockChapter:'highway',spawn:[.5,.72],exit:[.5,.90],nav:[floor],links:['highway'],map:[41,40],story:'Linde weeft een elementzegel in je mantel of hoofddeksel. Verken haar archief en spaar voor een sterkere afstemming.'}
];
export const QUARTER_GATES={
 highway:{'rain-garden':[810,480],'quiet-apartments':[120,690],'hidden-atelier':[880,920]},
 'rain-garden':{highway:[960,1125],'quiet-apartments':[1580,710]},
 'quiet-apartments':{highway:[960,1125],'rain-garden':[370,700]},
 'hidden-atelier':{highway:[960,1125]}
};
export const LINDE={id:'linde',name:'Linde · Runenwever',title:'Elementzegels & bijzondere uitrusting',x:1230,y:660,art:2,specialist:true};
export const QUARTER_POINTS={
 'rain-garden':[
  {id:'rain-compass',name:'Het regenkompas',x:700,y:380,art:'nav-astrolabe',required:true,body:'De glazen schaal bewaart geen voorspelling, maar een precieze afstelling. Tussen de krassen staat de route naar een atelier onder het marktplein. Milo herkent het werk van Linde.'},
  {id:'garden-letter',name:'Brief tussen de planten',x:400,y:700,art:'seed-heart',body:'“De stad is niet leeg. Iedere ochtend horen we beneden de markt. Als de waterstand weer stijgt, nemen we de zaailingen mee naar het volgende dak.” Een droge gereedschapsrol ligt onder de brief.',scrap:30},
  {id:'garden-reserve',name:'De veldvoorraad',x:1320,y:650,art:'medtech-belt',body:'Een tuinwachter liet hier een afgesloten verbandrol achter voor wie de lange route neemt.',bandage:true}
 ],
 'quiet-apartments':[
  {id:'atelier-key',name:'De bergingssleutel',x:1350,y:500,art:'field-compass',required:true,body:'Een koperen sleutel zit achter een los paneel. Op het bijbehorende kaartje: “Linde — atelier onder het marktplein. Breng het regenkompas; zonder de afstelling blijft de weefbank stil.”'},
  {id:'family-ledger',name:'Het laatste kasboek',x:500,y:420,art:'sun-compass',body:'De laatste bladzijden tellen geen geld, maar droge bedden en gedeelde maaltijden. Een klein kistje met bruikbare onderdelen staat tussen de papieren.',scrap:40},
  {id:'old-route',name:'De kaart achter de muur',x:1260,y:920,art:'nav-astrolabe',body:'Oude voetpaden lopen boven de waterlijn van woning naar tuin. Het atelier ligt onder het grote marktplein. De twee vondsten kun je bij Milo inleveren.'}
 ],
 'hidden-atelier':[
  {id:'rune-notes',name:'Lindes proefboek',x:470,y:470,art:'seed-heart',body:'Een zegel is een keuze, geen gratis pantserlaag. Mos neemt gif op, sintels verdelen hitte, koper leidt bliksem en regendraad houdt water buiten. Eén zegel past per kledingstuk; sterkere weefsels vragen ervaring.'},
  {id:'atelier-reserve',name:'De oude onderdelenlade',x:650,y:920,art:'copper-gauntlets',body:'Linde heeft de bruikbare reststukken voor de volgende reiziger klaargelegd. Het zijn er weinig, maar ieder stukje kan opnieuw gebruikt worden.',scrap:35}
 ]
};
export const QUARTER_REQUIRED=['rain-compass','atelier-key'];
export const RUNE_RANKS=[{level:5,price:280,resist:.06,secondary:1},{level:10,price:800,resist:.10,secondary:2},{level:16,price:1800,resist:.14,secondary:3}];
export const ELEMENT_RUNES={
 moss:{name:'Moszegel',art:'seed-heart',resist:'poisonResist',secondary:'recovery',step:.25,text:'Gifweerstand en herstel na vijf seconden zonder schade.'},
 cinder:{name:'Sintelweefsel',art:'ash-boots',resist:'fireResist',secondary:'hp',step:6,text:'Vuurweerstand en extra maximaal leven.'},
 copper:{name:'Stormknoop',art:'copper-gauntlets',resist:'stormResist',secondary:'mana',step:8,text:'Bliksemweerstand en extra maximaal mana.'},
 rain:{name:'Regendraad',art:'tide-coat',resist:'waterResist',secondary:'speed',step:.01,text:'Waterweerstand en iets meer loopsnelheid.'}
};
export const ATELIER_RECIPES={
 'rain-hood':{name:'Kap van de Regenkas',slot:'head',art:'filter-hood',rarity:'rare',level:6,requiredLevel:5,price:650,stats:{hp:20,poisonResist:.12,regen:1},text:'Een gerichte keuze tegen gif: +20 leven, +12% gifweerstand en +1 mana/sec.'},
 'glass-mantle':{name:'Mantel van het Kaslicht',slot:'suit',art:'ranger-coat',rarity:'epic',level:13,requiredLevel:12,price:2100,stats:{hp:40,armor:.05,waterResist:.12,regen:1.5},text:'+40 leven, +5% bescherming, +12% waterweerstand en +1,5 mana/sec. Eén keer te bouwen.'}
};

// Floors traced against1536×1024 artwork. Courtyards overlap generously.
const paintedFloors={
 'rain-garden':[
  [[640,445],[810,390],[1010,450],[1070,560],[990,695],[870,765],[690,760],[580,650],[540,560]],
  [[635,735],[910,735],[920,1024],[620,1024]],
  [[625,150],[740,115],[890,125],[975,180],[920,310],[795,320],[650,280],[590,225]],
  [[630,275],[785,265],[910,335],[980,390],[935,495],[805,480],[705,375],[590,340]],
  [[160,365],[225,325],[390,335],[520,375],[545,465],[465,535],[255,510],[140,450]],
  [[410,450],[560,420],[665,485],[690,575],[585,625],[465,555],[390,510]],
  [[1030,490],[1090,530],[1230,535],[1370,530],[1430,570],[1360,635],[1270,655],[1110,640],[980,560]]
 ],
 'quiet-apartments':[
  [[945,390],[1055,380],[1135,445],[1190,485],[1175,585],[1080,615],[990,550],[930,465]],
  [[510,345],[665,315],[815,330],[975,345],[1130,450],[1080,600],[975,700],[885,785],[700,810],[545,670],[400,505],[455,395]],
  [[130,260],[330,210],[460,245],[470,340],[545,420],[465,495],[340,420],[180,365],[110,320]],
  [[570,230],[650,175],[820,150],[930,190],[1050,265],[1020,340],[810,350],[690,320]],
  [[1030,345],[1190,265],[1320,275],[1450,370],[1390,485],[1200,535],[1090,500]],
  [[170,525],[310,475],[430,495],[540,620],[520,700],[440,720],[250,670],[135,590]],
  [[990,595],[1070,535],[1220,530],[1380,580],[1340,700],[1170,780],[1070,730],[1010,690]],
  [[650,770],[880,770],[920,1024],[615,1024]]
 ],
 'hidden-atelier':[
  [[450,450],[650,350],[925,370],[1080,490],[1110,585],[945,750],[710,795],[530,725],[420,605]],
  [[425,245],[550,185],[670,160],[865,180],[1040,260],[1030,350],[875,425],[695,430],[560,350]],
  [[150,445],[250,390],[385,420],[510,485],[535,560],[430,590],[240,545],[130,490]],
  [[980,400],[1120,365],[1320,400],[1420,475],[1380,575],[1200,645],[1050,590]],
  [[650,720],[880,720],[875,1024],[620,1024]]
 ]
};
for(const area of QUARTER_AREAS)area.nav=paintedFloors[area.id].map(native);
const place=(point,x,y)=>Object.assign(point,{x:x*1.25,y:y*1.25});
place(QUARTER_POINTS['rain-garden'][0],790,230);place(QUARTER_POINTS['rain-garden'][1],290,420);place(QUARTER_POINTS['rain-garden'][2],1220,590);
place(QUARTER_POINTS['quiet-apartments'][0],1230,385);place(QUARTER_POINTS['quiet-apartments'][1],290,310);place(QUARTER_POINTS['quiet-apartments'][2],1170,650);
place(QUARTER_POINTS['hidden-atelier'][0],590,295);place(QUARTER_POINTS['hidden-atelier'][1],520,570);place(LINDE,1120,475);
QUARTER_GATES['rain-garden']['quiet-apartments']=[1130*1.25,580*1.25];
QUARTER_GATES['quiet-apartments']['rain-garden']=[480*1.25,580*1.25];
