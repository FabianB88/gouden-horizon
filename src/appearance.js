// Visual families are independent of random affixes and stat rolls.
export const ARMOR_STYLES=['light','heavy','filter','storm'];
export const FOCUS_STYLES=['tidal','solar','storm','crystal'];
export const HELMET_STYLES=['field','heavy','filter','storm'];
const armor={
 'field-coat':'light','tide-coat':'light','cobalt-coat':'light','utility-coat':'light',
 'brass-jacket':'heavy','brass-coat':'heavy','pressure-suit':'heavy','cinder-coat':'heavy',
 'bloom-coat':'filter','ranger-coat':'filter','unique-filter':'filter',
 'cooling-jacket':'storm','unique-storm':'storm'
};
const focus={
 'field-staff':'tidal','tide-staff':'tidal','tidal-fork':'tidal','fork-focus':'tidal','pressure-focus':'tidal',
 'sun-staff':'solar','amber-prism':'solar','thermal-prism':'solar','unique-sun':'solar',
 'storm-staff':'storm','scrap-rod':'storm','unique-storm':'storm',
 'prism':'crystal','unique-crystal':'crystal'
};
export function equipmentAppearance(p){
 const suit=p.equipment?.suit,weapon=p.equipment?.weapon,head=p.equipment?.head;
 const armorStyle=suit?.appearance||armor[suit?.art||suit?.id]||((suit?.stats?.poisonResist||0)>=.14?'filter':(suit?.stats?.stormResist||0)>=.14?'storm':'light');
 const focusStyle=weapon?.appearance||focus[weapon?.art||weapon?.id]||(weapon?.stats?.ember?'solar':weapon?.stats?.storm?'storm':'tidal');
 const helmetStyle=head&&!head.empty?(head.appearance||({ 'field-cap':'field','sentinel-helm':'heavy','filter-hood':'filter','storm-crown':'storm'}[head.id])||'field'):null;
 const legendary=suit?.rarity==='legendary'||weapon?.rarity==='legendary'||head?.rarity==='legendary';
 return {armor:armorStyle,focus:focusStyle,helmet:helmetStyle,legendary,key:[armorStyle,focusStyle,helmetStyle||'bare',legendary?1:0].join(':')};
}
