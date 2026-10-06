import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {translate,setLanguage,getLanguage} from '../src/localization.js';
import {normalizeSettings,SETTINGS_KEY} from '../src/settings.js';
import {Engine} from '../src/engine.js';
import {AREAS,SPELLS,ZONES} from '../src/data.js';
import {PROLOGUE} from '../src/lore.js';
import {journeyEntry} from '../src/journey-content.js';

assert.equal(normalizeSettings().language,'nl');
assert.equal(normalizeSettings({language:'fr'}).language,'nl');
assert.equal(normalizeSettings({language:'en',music:.4}).language,'en');
assert.equal(normalizeSettings({language:'en',music:.4}).music,.4);
assert.equal(SETTINGS_KEY,'gouden-horizon-settings-v6');
console.log('PASS existing preferences and Dutch default; English persists independently');

const g=new Engine(),save=g.serialize();
setLanguage('en');assert.equal(getLanguage(),'en');
for(const [nl,en]of [
 ['Start expeditie','Start expedition'],['Respawn in Koelhof','Respawn in Cooling Court'],
 ['NIV. 12 · +2','LVL. 12 · +2'],['3 verband','3 bandages'],['1 doses','1 dose'],
 ['0.22s herladen','0.22s cooldown'],['NOG 7 LEVELS','7 MORE LEVELS'],
 ['Verkoopwaarde: 75 schroot','Sell value: 75 scrap'],['Uitrusten in Focus','Equip in Focus'],
 ['25 schroot · betaalbaar','25 scrap · affordable'],['0 geselecteerd · +0 schroot','0 selected · +0 scrap'],
 ['Vanaf niveau 10 kun je het volledige Dierenverbond leren. Alleen de Natuurhoeder krijgt al op niveau 4 een eerste getijvos.','From level 10, you can learn the entire Animal Bond. Only the Nature Guardian gets a first tide fox at level 4.'],
 ['Gouden Horizon','Gouden Horizon'],['  130 / 150  ','  130 / 150  '],['   ','   ']
])assert.equal(translate(nl),en,nl);
assert.equal(translate('Je veldpak viel uit in De Rode Kilometer'),'Your field suit failed in The Red Kilometer');
assert.equal(translate('LEVEL 10 · 45 mana'),'LEVEL 10 · 45 mana');
console.log('PASS story terminology, dynamic counters, cooldowns, death menu and brand');

let count=0;const start=performance.now();
for(const text of [...PROLOGUE.map(p=>p.text),...ZONES.flatMap(z=>[z.story,z.rule,z.subtitle,z.log]),...Object.values(SPELLS).map(s=>s.description),...AREAS.flatMap(a=>{const entry=journeyEntry(a.id,g.state);return [a.story,...(entry?[entry.text,entry.why,entry.goal]:[])];})]){
 if(!text)continue;const en=translate(text);assert(!/\b(?:het|jouw|wordt|zijn|heeft|kun|kunt|vijanden|bewakers|spreuken|schroot|niveau|leven)\b/i.test(en),en);count++;
}
assert.equal(g.serialize(),save,'language selection must not mutate a save or gameplay');
assert.equal(Engine.restore(save).state.area,g.state.area);
setLanguage('nl');assert.equal(translate(PROLOGUE[0].text),PROLOGUE[0].text);
assert.equal(translate('NIV. 12 · +2'),'NIV. 12 · +2');
console.log(`PASS ${count} full story, objective and spell texts; saved gameplay unchanged (${Math.round(performance.now()-start)} ms)`);
