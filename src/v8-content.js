// Act V/VI: fixed encounter strength, earned equipment and elemental defence.
const court=[[.12,.30],[.32,.19],[.68,.19],[.88,.32],[.92,.55],[.79,.78],[.52,.86],[.25,.79],[.08,.58]];
export const V8_STORY=['metro-refuge','sluice','railworks','deepwater','cooling-refuge','heatworks','condensers','tower'];
export const V8_AREAS=[
 {id:'metro-refuge',name:'Onderstation · De Laatste Metro',file:'metro-hub-v8.webp',zone:4,kind:'route',safe:true,spawn:[.28,.66],exit:[.79,.40],pocket:[.46,.62],nav:[court],links:['skybridge','sluice','railworks','deepwater'],map:[17,91],extension:true,story:'Aurelia werkt, maar twee regionale regelaars antwoorden niet. Koop drukbestendige uitrusting en zoek de onderwaterverbinding.'},
 {id:'sluice',name:'De Verdronken Sluis',file:'flood-tunnel-v8.webp',zone:4,kind:'hub',side:true,extension:true,nav:[court],spawn:[.24,.65],exit:[.76,.31],links:['metro-refuge'],map:[30,92],stage:0,itemLevel:15,reward:150,enemies:['pressurediver','rimedrone','hunter'],guardian:'pressurediver',story:'Drukduikers vuren zware watervolleyen. Zoek dekking en breek eerst de koude drones.'},
 {id:'railworks',name:'Het Verzonken Spoornet',file:'flood-tunnel-v8.webp',zone:4,kind:'hub',side:true,extension:true,nav:[court],spawn:[.24,.65],exit:[.76,.31],links:['metro-refuge'],map:[43,92],stage:1,itemLevel:16,reward:180,enemies:['pressurediver','rimedrone','repairer','bulwark'],guardian:'pressurediver',story:'Onder druk en vorst blijft weinig ruimte. Doorbreek de bewaking van het diepe pompnet.'},
 {id:'deepwater',name:'De Diepwaterkamer',file:'metro-boss-v8.webp',zone:4,kind:'hub',side:true,extension:true,bossArena:true,nav:[court],spawn:[.24,.65],exit:[.76,.31],links:['metro-refuge'],map:[55,92],stage:2,itemLevel:17,reward:260,enemies:['deepwarden'],guardian:'deepwarden',story:'De Diepwaterwacht bewaakt de oceaanregelaar. Wijk uit voor druklijnen en de ringgolf; waterweerstand helpt.'},
 {id:'cooling-refuge',name:'Koelhof · De Koperen Wijk',file:'cooling-hub-v8.webp',zone:5,kind:'route',safe:true,spawn:[.28,.66],exit:[.79,.40],pocket:[.46,.62],nav:[court],links:['metro-refuge','heatworks','condensers','tower'],map:[66,91],extension:true,story:'De Koelhof bouwt uitrusting voor de laatste oversteek. Spaar voor hun meesterwerk en kies vuur- of stormweerstand.'},
 {id:'heatworks',name:'De Rode Warmtewissel',file:'cooling-battle-v8.webp',zone:5,kind:'hub',side:true,extension:true,nav:[court],spawn:[.24,.65],exit:[.76,.31],links:['cooling-refuge'],map:[76,90],stage:3,itemLevel:18,reward:190,enemies:['furnacegunner','rimedrone','pressurediver'],guardian:'furnacegunner',story:'Vuurspuwers blokkeren een route met brandplekken. Blijf bewegen en kies zelf waar je de volgende groep bevecht.'},
 {id:'condensers',name:'Het Condensatorveld',file:'cooling-battle-v8.webp',zone:5,kind:'hub',side:true,extension:true,nav:[court],spawn:[.24,.65],exit:[.76,.31],links:['cooling-refuge'],map:[84,88],stage:4,itemLevel:19,reward:220,enemies:['furnacegunner','rimedrone','resonant','plaguewright'],guardian:'furnacegunner',story:'Hitte, bliksem en gif delen één veld. Schakel gevaarlijke schutters gericht uit; weerstand vervangt ontwijken niet.'},
 {id:'tower',name:'De Laatste Koeltoren',file:'cooling-battle-v8.webp',zone:5,kind:'hub',side:true,extension:true,bossArena:true,nav:[court],spawn:[.24,.65],exit:[.76,.31],links:['cooling-refuge'],map:[93,86],stage:5,itemLevel:20,reward:340,enemies:['towerwarden'],guardian:'towerwarden',story:'De Torenwachter zet stukken grond in brand en sluit vuurlijnen af. Lees zijn turbine, bewaar je dash en verbreek de laatste beveiliging.'}
];
export const V8_ZONES=[
 {id:'metro',name:'Het Onderstation',subtitle:'Diepnet · beneden de vloedlijn',accent:'#83dbe4',ambient:[22,55,66],core:'Oceaanregelaar',rule:'Druklijnen en vorst vragen om waterweerstand en ruimte om te ontwijken.',hazard:'water',enemies:['pressurediver','rimedrone','hunter'],log:'Een mondiale correctie kan niet zonder lokale regelaars. Het diepe pompnet bewaakt de waterbalans van de kust.'},
 {id:'cooling',name:'De Koeltoren',subtitle:'Brandland · het verlaten koelnet',accent:'#edbd8e',ambient:[65,42,31],core:'Thermische regelaar',rule:'Brandplekken en stoomvolleyen: bereid vuurweerstand voor en blijf uit de waarschuwingen.',hazard:'heat',enemies:['furnacegunner','rimedrone','resonant'],log:'De thermische regelaar begrenst de ingreep. Nu zijn meting, terugkoppeling en de noodstop op alle knooppunten verbonden.'}
];
export const V8_ENEMIES={
 pressurediver:{name:'Drukduiker',sprite:'pressurediver',v8row:0,hp:245,damage:21,speed:93,radius:27,size:125,range:530,xp:160,color:'#7ed8e9',role:'ranged',element:'water'},
 rimedrone:{name:'Rijpdrone',sprite:'rimedrone',v8row:1,hp:165,damage:17,speed:147,radius:23,size:98,range:560,xp:120,color:'#bdedff',role:'orbit',element:'frost'},
 furnacegunner:{name:'Ovenschutter',sprite:'furnacegunner',v8row:2,hp:275,damage:23,speed:107,radius:26,size:120,range:480,xp:180,color:'#f4a16d',role:'ranged',element:'solar'},
 deepwarden:{name:'De Diepwaterwacht',sprite:'deepwarden',v8row:3,boss:true,hp:2450,damage:25,speed:66,radius:45,size:220,range:690,xp:800,color:'#91e5ef',role:'tank',element:'water'},
 towerwarden:{name:'De Torenwachter',sprite:'towerwarden',v8row:4,boss:true,hp:2900,damage:28,speed:72,radius:44,size:225,range:690,xp:1100,color:'#ffbd89',role:'tank',element:'solar'}
};
export const V8_ITEMS=[
 {id:'field-cap',slot:'head',name:'Expeditiekap',appearance:'field',stats:{hp:7,armor:.01}},
 {id:'sentinel-helm',slot:'head',name:'Bastionhelm',appearance:'heavy',stats:{hp:9,armor:.025}},
 {id:'filter-hood',slot:'head',name:'Filterkap',appearance:'filter',stats:{hp:6,poisonResist:.045}},
 {id:'storm-crown',slot:'head',name:'Stormdiadeem',appearance:'storm',stats:{mana:8,stormResist:.045}},
 {id:'pressure-focus',slot:'weapon',name:'Diepwaterstemvork',appearance:'tidal',minLevel:15,stats:{power:.1,tide:.12}},
 {id:'thermal-prism',slot:'weapon',name:'Thermisch Prisma',appearance:'solar',minLevel:18,stats:{power:.1,ember:.14}},
 {id:'pressure-suit',slot:'suit',name:'Drukpantser',appearance:'heavy',minLevel:15,stats:{hp:23,armor:.055,waterResist:.045}},
 {id:'cooling-jacket',slot:'suit',name:'Koeltorenmantel',appearance:'storm',minLevel:18,stats:{hp:22,armor:.04,fireResist:.055}},
 {id:'rime-boots',slot:'boots',name:'Rijplopers',minLevel:15,stats:{speed:.08,dash:.07,waterResist:.04}},
 {id:'thermal-boots',slot:'boots',name:'Sintellopers',minLevel:18,stats:{speed:.09,dash:.07,fireResist:.04}},
 {id:'pressure-gloves',slot:'gloves',name:'Drukgeleiders',minLevel:15,stats:{power:.045,crit:.04,waterResist:.035}},
 {id:'thermal-gloves',slot:'gloves',name:'Thermische Geleiders',minLevel:18,stats:{power:.045,crit:.04,fireResist:.035}},
 {id:'turbine-heart',slot:'relic',name:'Turbinehart',minLevel:15,stats:{mana:15,regen:1.6}},
 {id:'cooling-core',slot:'relic',name:'Koelnetkern',minLevel:18,stats:{mana:14,regen:1.6,recovery:.3}},
 {id:'pressure-belt',slot:'belt',name:'Druknetgordel',minLevel:15,stats:{hp:9,mana:8,waterResist:.035}},
 {id:'valve-belt',slot:'belt',name:'Ventielgordel',minLevel:18,stats:{hp:10,armor:.025,fireResist:.035}}
];

// Traced arena floors stop feet, drops and spawns at the painted railings.
const native=points=>points.map(([x,y])=>[x/1536,y/1024]);
const arenaFloors={
 'flood-tunnel-v8.webp':[[180,355],[420,275],[650,245],[890,270],[1120,270],[1290,355],[1430,565],[1290,655],[1070,790],[740,800],[380,750],[270,625],[145,550]],
 'metro-boss-v8.webp':[[125,420],[265,335],[485,288],[765,278],[1030,307],[1280,390],[1420,510],[1450,600],[1350,695],[1100,775],[790,800],[460,758],[235,670],[130,575]],
 'cooling-battle-v8.webp':[[170,430],[360,330],[570,285],[915,288],[1140,340],[1390,440],[1430,540],[1220,660],[1025,787],[770,790],[485,735],[290,660],[155,545]]
};
for(const a of V8_AREAS)if(!a.safe){a.nav=[native(arenaFloors[a.file])];a.spawn=[.30,.62];if(a.file==='flood-tunnel-v8.webp')a.exit=[.74,.35];if(a.zone===5)a.exit=[.66,.37];if(a.id==='deepwater')a.exit=[.67,.36];}
