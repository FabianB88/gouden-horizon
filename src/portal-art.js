import {AREA_BY_ID} from './data.js?v=43';
import {SAFE_HUBS} from './hubs.js?v=43';
import {MEASUREMENT_AREAS} from './journey-content.js?v=43';
export const PORTAL_ART={
 station:{asset:'portal-station-v882',file:'assets/expedition/portal-station-v882.webp',label:'MEETSTATIONS',color:'#b1e7fa',height:156},
 arena:{asset:'portal-arena-v882',file:'assets/expedition/portal-arena-v882.webp',label:'ARENA',color:'#ffd39b',height:132},
 salvage:{asset:'portal-salvage-v882',file:'assets/expedition/portal-salvage-v882.webp',label:'OPTIONELE BERGING',color:'#f3d39c',height:134},
 return:{asset:'portal-return-v882',file:'assets/expedition/portal-return-v882.webp',label:'HANDELSPOST',color:'#bce7d0',height:136},
 explore:{label:'VERKENNING',color:'#c9dfb7',height:95},
 route:{label:'DOORREIS',color:'#f8d991',height:130}
};
export function portalStyle(portal){
 const area=AREA_BY_ID[portal.to];if(!area)return {...PORTAL_ART.route,kind:'route'};
 let kind;
 // Destination rules take precedence over the old generic 'generator' category.
 if(SAFE_HUBS.includes(area.id)||/return/.test(portal.id||''))kind='return';
 else if(MEASUREMENT_AREAS.has(area.id))kind='station';
 else if(area.safeExplore)kind='explore';
 else if(area.optional&&!area.endgame)kind='salvage';
 else if(area.side||area.endgame||area.id==='aurelia')kind='arena';
 else kind='route';
 return {...PORTAL_ART[kind],kind,...(area.bounty?{label:'BAASCONTRACT'}:area.endgame?{label:'TIJDPROEF'}:{})};
}
