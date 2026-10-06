// Native painting coordinates: extra quests live on the separate second screen.
// These positions use existing paths; quest IDs and saved progress do not change.
export function sideDistrictPoint(id,[x,y]){const scale=['skybridge','cooling-refuge'].includes(id)?1.25:1.75;return [1536*scale+x*scale,y*scale];}
export const DISTRICT_GUIDES=Object.fromEntries(Object.entries({canal:[780,1130],highway:[1390,1070],forest:[750,1030],skybridge:[610,690],'cooling-refuge':[485,1030]}).map(([id,[x,y]])=>[id,{id:'district-guide',name:'Ravi · Wegwijzer',title:'Hoofdroute & extra missies',art:1,x,y,specialist:true}]));
export const EXTRA_DISTRICT_PLACEMENTS={
 canal:{board:[600,480],salvage:[1010,470]},
 highway:{milo:[320,665],nora:[490,555],ilya:[1220,490],garden:[390,220],harbor:[920,780],workshop:[1320,455],depot:[650,460],'workshop-v6':[1330,440],'rain-garden':[430,220],'hidden-atelier':[950,480]},
 forest:{board:[250,495],contract:[330,445]},
 skybridge:{board:[300,280],contract:[300,525]},
 'cooling-refuge':{groenkloof:[300,450],lanternwood:[460,435]},
};
export const MAIN_DISTRICT_EXPLANATION='Alle hoofdmissies vertrekken vanuit dit aankomstgebied. Volg hier de gouden pijl en de hoofdroutepoorten.';
export const EXTRA_DISTRICT_EXPLANATION='Wil je extra missies doen? Ga naar de andere wijk met de wijkknop aan de schermrand. Daar vind je optionele opdrachten, verkenning en extra beloningen. Je hoeft die wijk niet te bezoeken om het hoofdverhaal te volgen.';
