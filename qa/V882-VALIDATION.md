# v8.8.2 — Verhaal, poorten, Android en looproutes

Controle op 4 oktober 2026. Deze versie voegt bestemmingverhalen en herkenbare poorten toe, corrigeert Android-ontwijkbediening en herstelt enkele vloergrenzen. Schade, dropkansen, prijzen, mana en cooldowns zijn niet gewijzigd.

## Verhaal en bestemming

Alle 42 huidige bestemmingen hebben een eigen introductie, een reden voor het bezoek en een doel dat aansluit op de echte spelregels. Alleen de Verdronken Ring, Rode Kilometer en het Zoutwoud gebruiken de twee meetstations. Latere baasgebieden tonen hun eigen gevechtsdoel. Het doel verandert na kalibratie, baaswinst, berging of het claimen van een sleutel.

Verhaalpagina's sluiten met ×, Escape of Op pad. Instellingen → Verhaal onderweg → Uit wordt bewaard en verbergt automatische pagina's en herleesknoppen. De gewone missiedoelen blijven beschikbaar. Eerste-bezoekgeschiedenis blijft persoonlijk per browser/speler; herhaalbare bergingen tonen geen herhaalde introductie. Adminreizen toont geen automatische introducties. Solo pauzeert tijdens het lezen. LAN laat de partner doorspelen en toont in gevaarlijke gebieden eerst een niet-blokkerende kaart.

## Touch en artwork

De normale Android-herkenning, aanval met automatisch richten, zes spreukslots en éénmalig handmatig richten door slepen blijven werken. Bewegingsstick en aanval staan hoger op gelijke hoogte; vijf actieknoppen staan apart onderaan. Ontwijken, verband en antidotum reageren op touch-down terwijl de bewegingsvinger ingedrukt blijft. Ontwijking is ook gecontroleerd met één seconde vasthouden: één lading, zonder tweede activatie bij loslaten.

Vier afzonderlijke geschilderde poorten worden daadwerkelijk geladen en met de productierenderer getekend: arena, meetstation, berging/baascontract en terugkeer. De stadsbrug en regionale oversteek hebben zichtbare trappen; hun bestaande canvasmaat blijft behouden. Exacte prompts en referentierollen staan in `assets/expedition/v882-art-manifest.json`.

## Uitgevoerde controles

- De volledige `npm test`-run slaagt: 391 regressiegroepen voor gameplay, uitrusting, economie, menu's, navigatie, uiterlijk, dieren, controller, Android en LAN.
- Drie gesimuleerde campagneruns voltooien alle 24 hoofdgebieden met verschillende seeds en disciplines. Zij kopen, verkopen, smeden, ontvangen echte schade en bereiken alle baasfases. De runs eindigen op niveau 16, in 1254, 980 en 1001 spelseconden; respectievelijk één, nul en één checkpoint-herkansing. Dit is een regressiecontrole met geautomatiseerde spelers, geen voorspelling van de moeilijkheid voor een menselijke speler.
- Vijf endgameproeven voltooien hun golven en beloning: alle drie arena's op tier 1, plus Dijkbreker op tier 2 en tier 3. Alle vijf records worden opgeslagen.
- De 5 nieuwe verhaal-/poort-/stadsgroepen controleren alle bestemmingen, actuele doelen, opgeslagen leesgeschiedenis en tien eerder afgeknipte trappen/bruglandingen in Vrijhaven. De held loopt heen en terug met gewone acht-richtingstoetsen. De zuidelijke brugbocht is opnieuw getraceerd nadat een echte teruglooptest daar vastliep.
- De bestaande stadstest controleert dat alle beloopbare cellen aangesloten zijn, terwijl water, plantenbakken en gebouwen geblokkeerd blijven. De regionale tests lopen naar NPC's, openen fysieke deuren, bezoeken activiteiten en keren terug. Navigatie voor dieren en vijanden houdt rekening met gesloten deuren.
- 21 echte Chromium-browsertestgroepen onder het subpad `/horizon/`, met Android-user-agent, touch en schermdichtheid 3. Portret: 320 × 568, 360 × 640 en 390 × 844. Liggend: 640 × 360 en 844 × 390. Alle bediening past binnen het scherm, is minstens 44 pixels en overlapt niet.
- Browser-pointerevents controleren gelijktijdig lopen, ontwijken, verband, antidotum en alle zes spreuken; automatisch aanvallen, drag-to-aim, rotatie en annuleren. Ook verhaalcontrast, doeltekst, veilig pauzeren, sluiten, aankoopmelding, itemdetails, desktopherstel en hergebruik van vooraf geladen kaarten zijn gecontroleerd. Geen JavaScript-pageerrors. Screenshots zijn visueel bekeken.
- `npm run site:build` slaagt en bevat de nieuwe CSS, modules en artwork. Syntaxcontrole slaagt voor 129 JS/MJS-bestanden; alle 460 relatieve moduleverwijzingen en index-assets bestaan.

## Praktische grens

De telefooncontrole gebruikt echte Chromium-touchsimulatie, geen fysiek Android-toestel. Handgevoel, browserbalken, apparaat-FPS en hoorbare audio op een telefoon zijn niet gemeten. Xbox/Edge is niet op hardware getest. Looptests controleren de beschreven routes en verbonden vloercellen; ze bewijzen niet dat ieder geschilderd detail op iedere kaart perfect aansluit.

De ZIP bevat de volledige zelfstandige bron voor de eigen GitHub Pages of Render en gratis LAN via een hostcomputer. De oude ChatGPT-testsite is niet bijgewerkt.
