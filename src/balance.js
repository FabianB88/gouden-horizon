import {ENEMIES} from './data.js?v=45';

// Snapshot strength when an enemy enters the encounter. Equipment changes and
// later level-ups never refill or repeatedly enlarge a living enemy's health.
export function scaleEnemy(enemy,zone,playerLevel){
 if(enemy.balanceVersion>=1)return enemy;
 const base=ENEMIES[enemy.type],level=Math.max(1,1+zone*2,playerLevel||1),growth=Math.min(10,level-1);
 const fraction=enemy.maxHp?Math.max(0,Math.min(1,enemy.hp/enemy.maxHp)):1;
 enemy.level=level+(enemy.elite?2:0);
 enemy.maxHp=Math.round(base.hp*1.10*(1+zone*.30)*(1+growth*.075)*(enemy.elite?1.7:1));
 enemy.hp=enemy.dead?0:enemy.maxHp*fraction;
 enemy.damageMultiplier=1+zone*.12+growth*.02;
 enemy.speedMultiplier=1+Math.min(.10,growth*.008+zone*.012);
 enemy.cooldownMultiplier=1/(1+zone*.03+growth*.008);
 enemy.balanceVersion=1;
 return enemy;
}

// Main-story strength follows the encounter, even when a level-one tester
// jumps there with F8. The opening stays unchanged; later gear has a purpose.
const CHAPTER_TIER={delta:1,ring:2,rooftops:3,mirrors:4,brine:5,kilometer:6,glass:7,saltwood:8,vault:9,harbor:10,clouds:11,aurelia:12};
export function tuneChapterEnemy(enemy,area){
 const tier=CHAPTER_TIER[area?.id];if(!tier||tier<7||enemy.chapterBalanceVersion===2)return enemy;
 const base=ENEMIES[enemy.type],steps=tier-6,fraction=enemy.maxHp?enemy.hp/enemy.maxHp:1;
 enemy.maxHp=Math.round(enemy.maxHp*(1+steps*.06));enemy.hp=enemy.dead?0:enemy.maxHp*fraction;
 enemy.damageMultiplier=Math.max((enemy.damageMultiplier||1)*(1+steps*.1),(18+(tier-7)*2.5)/base.damage*(enemy.partyDamage||1));
 enemy.cooldownMultiplier=(enemy.cooldownMultiplier||1)/(1+steps*.025);
 enemy.level=Math.max(enemy.level,7+steps);enemy.chapterBalanceVersion=2;return enemy;
}
