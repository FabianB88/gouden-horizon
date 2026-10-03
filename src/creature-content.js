// Living creatures adapted to the changed world. No machine summons or undead.
export const CREATURE_ENEMIES={
 prismhorn:{name:'Prismahoorn',creatureArt:true,hp:180,damage:16,speed:100,radius:28,size:138,range:400,xp:24,color:'#ffe0a1',role:'tank',element:'solar'},
 mistprowler:{name:'Mistjager',creatureArt:true,hp:145,damage:14,speed:151,radius:24,size:103,range:290,xp:21,color:'#89e9df',role:'hunter',element:'water'},
 stormtoad:{name:'Stormpad',creatureArt:true,hp:155,damage:14,speed:100,radius:27,size:105,range:490,xp:22,color:'#c7abff',role:'ranged',element:'storm'}
};
export const CREATURE_ELITES={prismhorn:{name:'Spiegelhoorn',rule:'Flank de borstplaat. Water of een aanval van opzij breekt de spiegel.'},mistprowler:{name:'Nevelsluiper',rule:'Verdwijnt op 70% en 35% leven. Houd afstand van de oplichtende landingsplek.'},stormtoad:{name:'Onweersbuik',rule:'Ontlaadt na de dood. Stap uit de paarse cirkel.'}};
