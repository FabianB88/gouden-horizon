// Early summoning belongs to one starter specialty; full groups are late-game.
export const isNatureKeeper=p=>p.specialization==='builder'||!p.specialization&&p.preferredSpecialization==='builder';
export const summonUnlockLevel=p=>isNatureKeeper(p)?4:10;
export const summonAvailable=p=>p.level>=summonUnlockLevel(p);
export function summonSpell(p,spell){return {...spell,unlockLevel:summonUnlockLevel(p),cost:p.level<10?26:spell.cost,description:p.level<10&&isNatureKeeper(p)?'Roep één eenvoudige getijvos op. Blijft tot hij valt; 26 mana. Je volledige dierenverbond opent op niveau 10. T wijst een vijand aan.':'Roep twee getijvossen of een beschermend moszwijn op. De lichtmot verdien je bij Ilya. Kies je dier via K; T wijst een doel aan. Vanaf niveau 10 · 1 vaardigheidspunt.'};}
