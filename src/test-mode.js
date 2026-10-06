import {AREA_BY_ID} from './data.js?v=46';

// A convenience code for development builds, never account authentication.
export const TestModeRules={
 testModeEnabled(){return this.adminUnlocked===true||this.isLan===true&&this.state.testMode===true;},
 unlockTestMode(code){if(code!=='fabian1')return false;this.adminUnlocked=true;return true;},
 lockTestMode(){this.adminUnlocked=false;return true;},
 testTravel(id){
  if(!this.testModeEnabled()||!AREA_BY_ID[id])return false;
  this.state.destination=null;this.state.player.hp=this.stats().maxHp;
  if(!this.enterArea(id))return false;
  if(id==='canal'&&this.state.area===id)this.state.world.gardenOpen=true;
  return true;
 }
};
