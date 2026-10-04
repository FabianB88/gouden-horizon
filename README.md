# Gouden Horizon v8.8.1 — Rechtop, automatisch richten

De volledige bronversie voor desktop en Android in de browser, online solo via GitHub Pages of Render, en gratis LAN-co-op. Upload de inhoud van `dist/` na `npm run site:build`, of publiceer deze bronmap rechtstreeks: `index.html`, `src/`, `assets/`, de drie CSS-bestanden en `.nojekyll` moeten bij elkaar blijven. Er is geen Android-app of betaalde server nodig voor solo.

## Nieuw in v8.8.1

- **Aanraakbediening:** de eenvoudige linker bewegingsstick en een grote aanvalsknop. Houd Aanval vast om vanzelf op een nabije vijand te schieten. Alle zes spreukslots en de toegewezen rechter ability werken met een tik voor automatische plaatsing, of met slepen en loslaten voor eigen richting. Ontwijken, verband, antidotum, kernpuls, kaart, dierencommando's en menu's hebben hun eigen knoppen. Lopen en casten kunnen tegelijk; mana en cooldowns blijven gelden.
- **Telefoon-UI:** compactere knoppen en menu's, ruimte voor het speelveld en een standaard ingeklapt gebiedspaneel. Rechtop is de gewone telefoonindeling, met drie spreuken links en drie rechts. Er is geen draaitip. Liggend blijft beschikbaar. Android en touch worden automatisch herkend en is ook expliciet te kiezen in Instellingen. Toetsenbord/muis en controller blijven beschikbaar.
- **Eén keer laden:** alle gebiedsbestanden downloaden vóór het spelen. Alleen de huidige kaart en enkele recente kaarten blijven uitgepakt in de grafische cache. Reizen gebruikt de al geladen bytes. Dit verlaagt het geheugen voor grote kaartbeelden zonder downloads bij iedere overgang. Vernieuwen start de laadfase opnieuw; deze versie is geen offline-app.
- **Duidelijke aankopen:** een melding boven het handelsmenu toont aantal, item, betaald schroot en voorraad of bestemming. Ook training en betaald smeden krijgen feedback. Bij LAN komt de bevestiging na betaling op de host.
- **Itemdetails:** klik een item in je rugzak voor zijn eigen stats, vereiste level, affixen, uniek effect, versterking en verkoopwaarde. Vanuit die details kun je uitrusten of naar de bestaande vergelijking gaan. Sleepbediening en behouden scrollpositie blijven beschikbaar.
- **Mannelijk/vrouwelijk:** een uiterlijkkeuze voor dezelfde Elementalist, Natuurhoeder en Veldjager, ook in LAN. Drie aanvullende geschilderde atlassen en portretten geven elke klasse beide opties. De vrouwelijke Natuurhoeder heeft een slanker silhouet en natuurlijke lichaamsvorm onder haar kleding. Uiterlijk verandert geen stats.
- **Beweging en hoofdgear:** benen bewegen als vaste geschilderde vormen in plaats van uitgerekte gewrichten. Voeten behouden hun vorm; hoofddeksels gebruiken een bevestiging per aanzicht. De bestaande romp-, mantel- en castbeweging blijft aanwezig.

Zie [ANDROID.md](ANDROID.md) voor de telefoonbediening en [qa/V881-VALIDATION.md](qa/V881-VALIDATION.md) voor controles en hun praktische grenzen. Artworkprompts staan in `assets/painted/CHARACTER-V88-PROMPTS.json`; ankers en uitsneden in `assets/painted/hero-classes-v88.json`.

## Uit v8.7.2 — De open poorten

De volledige bronversie voor online solo via GitHub Pages of Render en gratis LAN-co-op. Drie doorreisgebieden krijgen nieuwe aansluitende wijken met eigen artwork, regionale NPC’s en optioneel avontuur. Het bestaande artwork behoudt zijn formaat en schaal.

## Nieuw in deze versie

- **Groene Corridor → De Wilde Serre:** loop over de nieuwe brug naar Seya. Open de fysieke Serrepoort met F, versla de bewakers en berg drie kiemmonsters. Advies: niveau 10. Beloning: 140 schroot en één regionale vondst.
- **Horizonpost / Buitenzee → Stormwacht:** zoek Orin op het nieuwe oostelijke plein. Achter de Stormwachtpoort staan drie bakens. Blijf twee seconden stil om elk baken af te stemmen; lopen, casten of schade onderbreekt dit. Advies: niveau 13. Beloning: 210 schroot en één regionale vondst.
- **Koelhof → De Sintelhoven:** Tess wijst de werkpoort aan. Drie koelventielen doven elk een eigen hitteveld. Kies je route tussen vuurwezens, schutters en prismahoorns. Advies: niveau 19. Beloning: 320 schroot en één regionale vondst.
- **Deuren op de kaart:** de nieuwe poorten openen waar je staat. Je loopt door naar de andere kant in hetzelfde gebied. De stad en handelaren blijven veilig; verderop zijn normale gevechten mogelijk. De zijactiviteiten zijn optioneel. Vijanden, geopende deuren en vondsten blijven bewaard; terugkomen vult ze niet opnieuw aan. Beloningen gelden één keer per expeditie.
- **Nieuwe ruimte:** Corridor meet nu 5376 × 1792; Horizonpost en Koelhof elk 3840 × 1280. Brede bruggen, zijpleinen en trappen verbinden de oorspronkelijke en nieuwe kaarttegel. Iedere toevoeging heeft eigen artwork, zonder het bestaande beeld uit te rekken.
- **Lopen:** de drie klassepersonages gebruiken afzonderlijke geschilderde benen. De voeten behouden hun vorm tijdens de pas; de romp beweegt mee. Kleine gecachete uitsneden houden de animatie lichter.
- **Uitdaging:** vanaf de latere glasgebieden groeien leven, schade en aanvalstempo verder met het gebied. Ook een level-one adminreiziger krijgt in het Wolkenarchief duidelijke schade. Goede bescherming en elementweerstand blijven waardevol; de eerste gebieden behouden hun bestaande gevechtsbalans.
- **Lore en identiteit:** de verhaalopening is weer leesbaar op perkament. Drie nieuwe verkenners en regionale namen voor handelaren geven de latere posten meer eigenheid. Elementalist, Natuurhoeder en Veldjager houden hun eigen uiterlijk in het veld, de rugzak en LAN.

De bestaande Vrijhaven-uitbreiding, drie geïllustreerde lorepagina’s, adminreizen en zes zoomkeuzes blijven beschikbaar. De standaardzoom is 115%; Hoog verbetert de interne resolutie binnen het bestaande pixelbudget.

## Alle gebieden testen

Druk tijdens het spel op **F8**, of kies **Instellingen → Gebieden testen**, en voer exact **fabian1** in. Kies vervolgens een bestemming. Deze sessiemodus opent alle gebieden en de tuinpoort; gevechten en uitrustingsregels blijven actief. Reizen herstelt je leven maar geeft geen gratis levels, items of overwinningen. Bij LAN controleert de host de code en stemmen beide spelers voor reizen.

Tijdens deze modus worden normale saves niet overschreven. De ontgrendeling wordt niet opgeslagen. Sluit de modus via de knop in het testmenu om normaal verder te spelen. Het is een ontwikkelcode in een openbare browserclient, geen accountbeveiliging.

## Solo en online

Pak de ZIP uit. Met Node.js 22 of nieuwer: `npm start`, daarna **http://localhost:8080**. Alleen dubbelklikken op `index.html` werkt niet met de JavaScript-modules.

`npm run site:build` maakt `dist/` met alle statische spelbestanden. Publiceer de inhoud van die map op GitHub Pages of als statische site op Render. Hiervoor zijn geen betaalde spelserver of account nodig. De bestaande ChatGPT-testsite is deze ronde niet bijgewerkt.

## Samen spelen

Installeer Node.js 22+ op één computer en start `start-lan.bat` (Windows) of `bash start-lan.sh` (Mac/Linux). Of voer `npm ci` en `npm run lan` uit. De host toont de link die beide spelers openen. Andere apparaten hebben alleen een browser nodig. Zie [LAN-START.md](LAN-START.md).

Iedereen heeft eigen gear, spreuken, dieren, camera en een naam boven het hoofd. Samen reizen vraagt twee bevestigingen. Normale drops wisselen van eigenaar; kisten en baasvondsten geven ieder een eigen beloning. XP en schroot worden gedeeld. Co-op-vijanden krijgen 70% extra leven en 8% extra schade; gewone groepen krijgen ongeveer 30% meer vijanden, geen tweede baas. GitHub Pages kan de statische spelpagina hosten maar draait geen LAN-WebSocket-server.

Controllerinstellingen en knoppen staan in [CONTROLLER.md](CONTROLLER.md). Een Xbox hoeft geen Node.js of spelbestanden te installeren: hij opent de LAN-link van de hostcomputer. Fysieke Xbox/Edge-compatibiliteit is nog niet getest.

## Controle en artwork

`npm test` controleert gameplay, routes, menu’s, LAN, controllerlogica en volledige campagne- en endgame-runs. `npm run site:build` maakt de online versie. Nieuwe artworkprompts staan in `assets/V872-ART-PROMPTS.json` en `assets/V872-DOOR-PROMPT.json`; de bijgewerkte personage-uitsneden staan in `assets/painted/hero-classes-v872.json`. De vaste afspraak over uitbreiden staat in [ART-DIRECTION.md](ART-DIRECTION.md). Verificatieresultaten en praktische beperkingen staan in [qa/V872-VALIDATION.md](qa/V872-VALIDATION.md).

---

# Gouden Horizon — Aurelia


**v8.6.0 — Ruimte om te dwalen**

Getijdenkade en de Groene Corridor hebben nieuwe geschilderde kaarten met brede, verbonden zijpaden, tuinen en rustige pleintjes. De handelaren en kisten zijn verdeeld over die ruimtes. Milo staat aan het begin op het zijpleintje bij de kas, bereikbaar vanaf de stenen hoofdroute. Hij staat daardoor niet meer midden in de promenade.

Ook Vrijhaven, Horizonpost, Onderstation, Koelhof en Lantaarnwoud hebben extra beloopbare zijruimtes. In alle acht veilige handelsposten liggen per expeditie twee tot vier kleine hoopjes schroot. Loop eroverheen om ze op te pakken, ook met een volle rugzak. De vroege posten betalen samen maximaal 24 schroot per post; latere maximaal 28 of 36. De posities verschillen per nieuwe expeditie. Opnieuw bezoeken, laden of een checkpoint gebruiken vult gevonden hoopjes niet opnieuw aan. Vondsten geven geen gratis leven, XP of uitrusting.

Deze ZIP bevat de volledige zelfstandige bronversie, inclusief artwork, geluidscode, tests en hostingbestanden. Pak hem uit en voer `npm start` uit met Node.js; open daarna **http://localhost:8080**. Voor GitHub Pages of Render staan de stappen verderop. De bron-ZIP is v8.8.1; de bestaande testsite is deze ronde niet bijgewerkt.

Looproutes worden gecontroleerd met gewone acht-richtingstoetsen, ook terug vanaf de zijpaden. De nieuwe artprompts staan in `assets/V86-ART-PROMPTS.json`; controles staan in `qa/wandering-tests.mjs` en `qa/V86-VALIDATION.md`.

Eerder: **v8.5.0 — Gevecht & beweging gepolijst**

De held draagt zijn passen met subtielere rompbeweging, kortere vloeiende richtingswissels en een korte gewichtsverplaatsing bij het casten. Alle mantelrichtingen worden tijdens laden voorbereid, zodat draaien of omkleden geen nieuwe pixelmaskers hoeft te berekenen.

Treffers geven een korte zichtbare reactie, kleine geschilderde vonken en elementgebonden geluid. Kritieke treffers hebben een eigen accent. Vijanden vervagen kort wanneer ze vallen. Deze reacties zijn visueel: ze verschuiven geen echte posities en voegen geen gratis stun toe.

Melee-vijanden kiezen kleine aparte aanlooplijnen; schutters houden stabielere afstand. Een ruimtelijk raster verdeelt de burencontroles. Schade, levens, aanvalsklokken, consumables en droptabellen blijven gelijk. Gevaarlijke aanvalsranden hebben meer contrast; eigen wolken, ijs en wervels dekken minder van het slagveld af. Buiten beeld worden projectielen en effecten overgeslagen; bij drukte worden decoratieve deeltjes en trailsegmenten verminderd.

Rugzak én koopmenu tonen de gevolgen voor je totale build, waaronder het percentage maximaal leven dat één volledige gifinfectie kost. K en de spreukenhandel tonen de rol en basisschade met je eigen gear, inclusief spreukvarianten. Deze getallen zijn vóór kritieke treffers, combo’s en vijandbescherming; gebiedsspreuken geven schade per puls/krater aan.

Achter het titelbeeld en stilstaande menu’s tekent de wereld niet voortdurend verder. Resizen en nieuwe resultaatbeelden worden wel verwerkt. **Instellingen → Laatste spelmoment** toont je echte browser-FPS, framevertraging en aandeel trage frames. Menu’s tellen niet mee. Meetdetails en beperkingen staan in `qa/V85-VALIDATION.md`.

Eerder: **v8.4.0 — De verloren wijken**

Praat in **Vrijhaven** met **Milo (F)** en neem *De verloren wijken* aan. Drie verspreide verkenningspoorten verbinden de stad met nieuwe geschilderde locaties: **De Hangende Tuinen**, **De Stille Woningen** en **Het Verborgen Atelier**. Tuinen en woningen zijn ook onderling verbonden. Brede vloeren, zijkamers en acht onderzoekplekken bieden verhalen, een kleine voorraad en eenmalige beloningen.

Vind het **regenkompas** in de tuinen en de **bergingssleutel** in de woningen. Lever beide bij Milo in voor **100 schroot** en toegang tot runenwever **Linde**. Questvondsten staan in het logboek en gebruiken geen rugzakruimte. Schrootvondsten en quest betalen samen 205 schroot; een verbandrol verandert bij een volle voorraad in 15 schroot. Opnieuw bezoeken betaalt niets opnieuw.

Linde kan een elementzegel op je uitgeruste **mantel of hoofddeksel** weven. Mos geeft gifweerstand en herstel; sintelweefsel vuurweerstand en leven; stormknoop bliksemweerstand en mana; regendraad waterweerstand en loopsnelheid. Rangen geven 6 / 10 / 14% weerstand, kosten **280 / 800 / 1800 schroot** en vereisen niveau **5 / 10 / 16**. Eén zegel per kledingstuk; vervangen verwijdert de vorige bonussen en kost 150 extra. Gewone versterkingen blijven bestaan.

Twee vaste recepten maken sparen gericht: **Kap van de Regenkas** (650 schroot, niveau 5) en **Mantel van het Kaslicht** (2100 schroot, niveau 12). Elk recept is één keer te bouwen en komt in de rugzak; je rust het zelf uit. De veilige zijroutes leveren geen gratis levels, genezing of herhaalbare uitrusting op.

Het startscherm toont geen oude V7-laadtekst meer. De hulpknop en versievoet staan in de normale paginastroom, zodat ze bij weinig verticale ruimte kunnen doorlopen. Quest-, menu-, loop- en opslagcontroles staan in `qa/safe-exploration-tests.mjs` en `qa/V84-VALIDATION.md`. De drie oorspronkelijke artprompts staan in `assets/V84-ART-PROMPTS.json`.

Eerder: **v8.3.0 — Het Lantaarnwoud & het levende verbond**

Dierenverbond vervangt de drone-summons: alle klassen vanaf niveau 10; alleen de Natuurhoeder leert op niveau 4 één eenvoudige getijvos. Kies via K en wijs een nummer of rechts/Q toe. Volledige roedel: twee getijvossen, beschermend moszwijn of Ilya’s lichtmot. Dieren blijven tot ze vallen of je naar een veilige zone reist; oproepen kost mana, heeft een gedeelde cooldown en vervangt de bestaande groep. Gevallen dieren respawnen niet automatisch.

Bij de werkplaats koop je per dier vitaliteit, aanval/herstel en weerstand. Rangen kosten 180 / 420 / 900 schroot, met niveaugrenzen 4 / 8 / 12. Nieuwe training geldt vanaf de volgende oproep.

Drie nieuwe geschilderde wezens verschijnen vanaf de latere arenas: Prismahoorn, Mistjager en Stormpad. Hun zeldzame elites hebben elk één gevechtsregel. Optionele verbondskisten vragen drie extra bewakers voor één vondst en een bescheiden schrootbeloning. Twee uitzonderlijke legendarische vondsten veranderen je zonnebom of getijroedel met een echte mana-/cooldownafweging. De bestaande uitzonderlijke lootroll is nu ook op gewone vijandkills aangesloten.

Na **De Rode Warmtewissel (hoofdstuk 22)** opent in Koelhof een aparte poort naar **Het Lantaarnwoud**: een geschilderde tuinstad met verbonden zijpleinen, drie verspreide handelaren, twee eenmalige kisten en drie verkenningspunten. De kaart en een bericht bij terugkomst wijzen de route aan. Vanuit de stad gaat één poort naar **De Kristalwaterval**. Na deze overwinning opent een tweede poort naar het herhaalbare solobaasgevecht **De Koperen Kroon**.

Mosruggen gebruiken charges en schildslagen; zonnegekko’s snelle vuurschoten en vuurvelden; winduilen snelle windstoten en waaiers. De Kroonbeer wisselt klauwen, uitdijende kransen en drie tijdelijke amberzones af. Hij versnelt eenmaal onder half leven. Twee groepen bij de waterval betalen 180 schroot; de Kroonbeer 240, plus normale vijandopbrengsten en één gewone baasdrop. Leven en voorraad worden niet gratis aangevuld door opnieuw binnen te gaan. Vijanden houden de bij binnenkomst bepaalde sterkte; speciale legendary-rolls vervangen één drop en blijven zeldzaam.

Lopen en stoppen hebben nu zachtere overgangen, met behoud van de bestaande voetcontacten en staf in de hand. Vijandhoudingen vloeien kort over bij laden en herstellen. Dieren volgen gecachete routes rond dekking. De nieuwe gebieden gebruiken originele rustige muziek, onderscheidende aanvalsgeluiden en begrensde animatiecaches. Alle nieuwe artprompts staan in `assets/expedition/v82-art-manifest.json` en `v83-art-manifest.json`; bronuitsneden en grondankers staan naast de atlassen.

Eerder: **v8.1.0 — Groenkloof & de Glazen Duinen**

- Nieuw startscherm: **Elementalist**, **Natuurhoeder** of **Veldjager**. Je startvoordeel blijft op het bestaande niveau; de gekozen richting wordt actief op level 5. Talenten kies je zelf op 5, 8 en 11. Via K blijft de volledige aanvalstoewijzing beschikbaar.
- Na **Koelhof (hoofdstuk 21)** opent de poort naar **Groenkloof**, een groene veilige kloof met watervallen, brede zijpaden, drie verspreide handelaren en twee eenmalige kisten. Ook de doorgangen bij Onderstation en Koelhof zijn breder gemaakt op de geschilderde vloer.
- Vanuit Groenkloof bereik je de **Glazen Duinen**: twee groepen, daarna één Duinbreker. Glasschorpioenen gebruiken gifnaalden en scharen, Stofschutters snelle gerichte schoten en salvo’s, Slakdragers vuurkogels en een korte vuurveeg. De Duinbreker wisselt boorrushes, ringgolven en aangekondigde vuurkogels af en versnelt onder half leven. Er is één terugpoort, die na de laatste vijand opent.
- Herhalen kost dezelfde eigen voorraad leven, mana, verband en antidoten. Elke voltooiing betaalt **210 schroot**, plus gewone vijandopbrengsten; de baas heeft de bestaande hogere kwaliteitstabel. Encountersterkte wordt bij binnenkomst vastgelegd. De bestaande baascontracten zijn niet afgezwakt.
- Vier nieuwe geschilderde bijzondere voorwerpen: **Baken van de Duinbreker**, **Mantel van de Glasschorpioen**, **Hart van de Slakoven** en **Diadeem van de Horizon**. De eerste drie zijn uitzonderlijke drops met begrensde effecten; de Diadeem staat één keer bij de veldhandel in Groenkloof voor **8500 schroot**, bruikbaar vanaf level 16. De goedkope recepten en gewone legendary-garantie kunnen deze voorwerpen niet opleveren.
- De Duinbreker heeft **1,2%** kans op zo’n uitzonderlijk item per uitrustingsdrop. De nieuwe gewone vijanden hebben ongeveer **0,09–0,184%** per verslagen vijand vóór de bestaande vermindering bij veel grondloot. De twee eerdere baascontracten hebben **0,6%** per uitrustingsbeloning. Deze voorwerpen vervangen één drop en voegen geen extra stapel toe. Vijandfamilies hebben verschillende kansen op kwaliteit en voorkeuren voor uitrustingsslots.
- Originele zachte muziek voor de groene kloof en de droge duinen, plus stappen op steen/gras/zand, treffers, gif, antidoten en onderscheidende vijandaanvallen. Alles wordt zelf met Web Audio gemaakt, zonder externe samples. Muziek en effecten hebben aparte volumes; snelle gebeurtenissen en geluidsbuffers zijn begrensd.
- Alle nieuwe artprompts en atlasuitlijning staan in `assets/V81-ART-PROMPTS.json`. Vier vijandtypes hebben elk een eigen stilstand-, loop-, laad- en aanvalshouding. De bestaande acht looprichtingen en stafbevestiging blijven behouden.


**v8.0.1:** de staf wordt zichtbaar in de hand gedragen, met een passende helling in alle acht richtingen. De mantel bedekt de staf niet meer; de gloed volgt de werkelijke stafpunt. De rugzak gebruikt dezelfde uitrustingslagen.

Nieuw in **v8.0.0**: 24 verhaalhoofdstukken, zichtbare uitrusting en een achtste slot voor hoofdgear. De hoofdroute loopt na Aurelia verder door het Onderstation en de Koelhof, met zes nieuwe gevechtsgebieden, twee ruime handelsposten, vijf vijandfamilies en twee eigen bazen.

- **Zichtbare gear:** mantel, focus en helm veranderen meteen wanneer je ze uitrust. Vier mantelfamilies, vier focustypen en vier hoofdmodellen gebruiken dezelfde lagen in de wereld en het rugzakportret. Acht looprichtingen, een afstandsgestuurde pas en een kleine lichaamsbeweging behouden de bestaande bediening. Andere laarzen, gordels en handschoenen veranderen voorlopig alleen de stats.
- **Hoofdslot:** helmen en kappen vallen als normale randomized loot, staan bij de veldhandel en kunnen bij Inez worden versterkt. Filterkappen ondersteunen een gifbestendige build. Een Legendary-helm geeft na schade een kort schild met een eigen cooldown.
- **Act V/VI:** Drukduikers, Rijpdrones en Ovenschutters gebruiken water, vorst en vuur. De Diepwaterwacht wisselt drukbanen, ringgolven en harpoenen af. De Torenwachter gebruikt brandplekken, een turbinevolley en tijdelijke blokkades. Bazen blijven één tegenstander, met een tweede fase onder half leven. Verbind de laatste regelaar na de overwinning.
- **Progressie:** itemlevels 15–20, met levelvereisten 12–16 die aansluiten op de verdiende aankomstlevels. Latere vijanden krijgen sterkere, vastgezette encounters; uitrusten of herladen versterkt levende vijanden niet opnieuw. Onderstation-meesterwerken kosten 1950–3400 schroot, Koelhof-meesterwerken 2600–4400. Goedkope instapgear blijft beschikbaar. Water- en vuurweerstand zijn zinvolle voorbereidingen; baascontracten en nevenroutes blijven herhaalbare bronnen van schroot en loot.
- **AI en aanvallen:** jagers en Rijpdrones flankeren; zware schutters bewaren afstand. Beweging versnelt geleidelijk, met minder heen-en-weer draaien. Sommige schoten hebben alleen een korte aanvalshouding en mondingsflits, zonder vloermarkering. Ze richten één keer en vliegen zichtbaar: bewegen kan ze nog ontwijken. Grote baasaanvallen houden hun waarschuwingen. Een gewone Ovenschutter legt één kleinere vuurplek neer; de baas beheerst meerdere zones.
- **Artwork:** vier mantelsheets, een focusatlas, helmuitrusting, een vijandatlas, zestien itemiconen en vijf omgevingen zijn speciaal voor deze versie gemaakt. Legendarische hoofdgear heeft een bescheiden gouden accent. De prompts en uitsnedegegevens staan bij de assets.

Nieuw in **v7.0.1**: het gebiedspaneel linksboven sluit je met **×**; de kleine knop **Gebied** opent het weer. Je keuze blijft bij reizen en herladen bewaard.

Nieuw in **v7.0.0**: zeven uitrustingsslots rond je held, drie specialisaties, sterke betaalde spreuken, vaste winkeldoelen om voor te sparen en vier korte nevenexpedities met eigen artwork. De zestien hoofdstukken en hun arena’s blijven de hoofdroute.

- **I – Rugzak:** focus, mantel, hoofdgear, twee relikwieën, laarzen, handschoenen en gordel. Selecteer en klik het passende slot, of sleep een item daarheen. Relikwieën passen in I én II; beide leveren hun stats. Vergelijkingen tonen beide gedragen relikwieën. Het hoofdslot en tweede relikwieslot beginnen leeg. Filters, sortering, favorieten en behouden scrollpositie maken de rugzak compacter. Het portret toont je gedragen mantel, focus en hoofdgear.
- **K – Specialisatie:** kies vanaf level 5 Elementalist, Natuurhoeder of Veldjager. Op levels 5, 8 en 11 kies je één van twee talenten per rij. Elementkracht/mana, dierenkracht/bescherming en lanskracht/mobiliteit geven herkenbare builds. Talenten kosten geen gewone skillpunten. Opnieuw kiezen kost 300 schroot bij een veilige handelspost en geeft geen gratis herstel.
- **Mara – Spreuken:** Prismaboog vanaf Vrijhaven/level 5 kost 650 schroot: 70 basisschade, 18 mana, 1,2 s cooldown, drie sprongen met 12% afname. Het eerste schot moet echt raken. Donderlans vanaf de Groene Corridor/level 8 kost 1200: 90 basisschade, 24 mana, drie doorboorde doelen en stormcombinaties. Winterkroon vanaf Horizonpost/level 11 kost 1800: 95 + twee pulsen van 16 schade, 30 mana, een ijsgebied met vertraging. Koop één keer, wijs daarna zelf toe via K; bestaande bindings blijven staan.
- **Winkels:** naast negen gewone aanbiedingen per post staan zeven vaste Epic-spaarstukken, inclusief hoofddeksel. Waterlijn: 750–1050 schroot; Vrijhaven: 1150–1525; Groene Corridor: 1600–2075; Horizonpost: 2000–2875. De laatste twee posten bieden daarnaast een uniek Legendary-onderdeel van 1550/2300 schroot. Stats, levelvereiste en ontbrekend schroot staan vooraf in beeld; bijzondere voorraad vult na aankoop niet aan.
- **Milo – Nevenroutes:** druk F bij Milo, of open ze via M. De Metrowerkplaats opent na Rietdelta, Verloren Karavaan bij Vrijhaven, het Stille Laboratorium bij de Groene Corridor en de Hoogteradar bij Horizonpost. Drie bewaakte bergingspunten, zeven vijanden en één eindvondst per bezoek. Beloningen: 75/115/165/215 schroot; latere routes hebben betere rarity-kansen. Herhaalbaar, met behoud van gebruikt leven, mana en benodigdheden.
- **Contractbazen:** de Sporenregent wisselt gifbanen, ijszones en harpoenen af. De Zonnebeul gebruikt vuurzones, een draaiende zonneaanval en tijdelijke energiepijlers. Duidelijke waarschuwingen vóór impact, pijnlijke zones daarna. Vuur-/waterweerstand helpt; pijlers hinderen lopen maar verdwijnen vanzelf. Bestaande contractbeloningen en Overdruk blijven behouden.
- **Presentatie:** vier vijandrollen hebben vier nieuwe geschilderde looppassen, met gedeelde, begrensde animatiecaches. Gedeelde gebiedsart wordt één keer gedecodeerd. Vier nieuwe omgevingen en drie spreukiconen zijn geïntegreerd; prompts staan in `assets/V7-ART-PROMPTS.json`.

Eerder in **v6.0.0**: Vrijhaven met drie stadsquests, oproepbare constructies, vier nieuwe vijandrollen, twee eigen contractbazen en acht unieke onderdelen. De bossen staan nu zichtbaar bij **Sera** in de wereld: het **Sporenbassin in de Groene Corridor** vanaf hoofdstuk 9, en de **Zonneoven bij Horizonpost** na hoofdstuk 14. Loop naar haar toe en druk **F**; M blijft ook beschikbaar.

- **Vrijhaven:** verbonden tuin, markt, kade en werkplaats. Handelaren en zes poorten staan verspreid. Milo betaalt 100 schroot voor drie ontdekkingen. Ilya geeft na het bergen van het verbondsarchief 75 schroot, zeldzame handschoenen en de lichtmot. Sera geeft na één Sporencontract 150 schroot en toegang tot Inez’ acht unieke recepten.
- **Dierenverbond:** leer vanaf level 10 voor één punt in K; de Natuurhoeder leert al vanaf level 4 één eenvoudige getijvos (26 mana). Een volledige groep kost 42 mana met 18 seconden cooldown. Kies twee getijvossen, één moszwijn of Ilya’s lichtmot. Dieren hebben beperkt leven en blijven tot ze vallen; **T** wijst een doel aan. De lichtmot geneest maximaal 24 leven per oproep (36 met het talent Levenshoeder). Training en speciale uitrusting kunnen deze waarden verbeteren.
- **Baascontracten:** één baas, twee fases en drie verschillende aanvalspatronen. Kies schroot of uitrusting, en eventueel een gewenst slot. Overdruk geeft +18% baasleven, +16% schade en snellere aanvallen; +20% schroot, epic +5 en legendary +1 procentpunt. Geen gratis genezing of consumptievoorraad. Verlies betaalt niets.
- **Vijandrollen:** Bastion beschermt een buur en wordt kwetsbaar wanneer hij nat is; Gifarchitect werpt giftige boogbommen; Scherfjager wisselt een gerichte sprint af met snelle schoten; Herstelwerker repareert gewone bondgenoten maximaal drie keer. Voorbereiding en loslaten hebben afzonderlijke geschilderde poses.
- **Unieke gear:** acht onderdelen voor verschillende builds, met eigen artwork. Zeldzame Legendary-drops kunnen één van deze onderdelen zijn. Na Sera’s quest kan Inez ze ieder één keer bouwen voor **1200 schroot**, vanaf level 8. Ze gaan naar de rugzak; uitrusten blijft handmatig.
- **Instellingen:** Esc → Instellingen voor aparte muziek/effectvolumes, schermschok, automatische/hoge/lichte beeldkwaliteit en een grotere richtcursor. Vijandpose-overgangen worden begrensd gecachet; de bestaande sprite-, tekst-, belichtings- en pixelbudgetten blijven actief.

| Uniek onderdeel | Build-effect |
| --- | --- |
| Lens van het Stille Water | Getij plaatst maximaal drie lenzen; storm ontlaadt ze |
| Handen van de Zonneoven | Iedere derde zonnetreffer geeft een kleine extra uitbarsting, met cooldown |
| Condensator van het Onweer | Drie getijtreffers versterken de volgende stormtreffer |
| Hand van de Levenshoeder | Dieren vallen sterker aan; treffers op hun aangewezen doel herstellen een begrensde hoeveelheid leven |
| Mantel van de Spoorzoeker | Gifweerstand en een tijdelijk direct-schadeschild na antidotum |
| Stappers van de Lage Kade | Ontwijken plaatst een lens en vertraagt gewone vijanden |
| Gordel van de Magneetbouwer | Kills herstellen mana en verkorten constructieherladen |
| Kristal van de Winterboog | Een bevroren kill vuurt twee ijssplinters af |

Alle zes v6-artprompts staan in `assets/V6-ART-PROMPTS.json`; ankers en uitsneden in `assets/expedition/v6-sprites.json`. De nieuwe stad, NPC’s, constructies, vijanden, bazen en unieke onderdelen zijn oorspronkelijk voor dit spel gegenereerd.

Nieuw in **v5.7.0**: favorietenbescherming, verkoopwaar, 22 spreukvarianten, gerichte weerstand en twee herhaalbare baascontracten. Het richtkruis heeft een heldere rand met donkere contour en reageert op vijanden. Alle permanente verbeteringen hebben een zichtbare geschilderde illustratie. De scroll- en renderverbeteringen uit v5.6.2 blijven behouden.

- **I – Rugzak:** ★ Bewaren beschermt tegen verkopen en recyclen. Verkoopwaar selecteer je met één knop in Verkopen. Een bewaard item moet eerst expliciet worden vrijgegeven.
- **K – Spreuken:** vanaf level 8 en 10 krijgt iedere spreuk twee leerbare varianten. Een variant kost één punt; daarna wissel je vrij tussen geleerde varianten en de basis. De afstelling geldt voor die spreuk op links, rechts en 1–6. Wisselen reset de gedeelde cooldown niet. Iedere variant heeft een afweging in schade, bereik, mana of herlaadtijd.
- **Inez – Versterken:** selecteer een gedragen item en kies basisstats of +8 procentpunt gif-, vuur-, bliksem- of waterweerstand. Iedere keuze gebruikt één van de drie beschikbare versterkingen. Maximaal 24% van één weerstand op één item en 60% effectieve weerstand in totaal. De prijs wordt getoond vóór betaling; geen willekeurige craft-uitkomst.
- **M – Baascontracten:** start vanuit een veilige handelspost. Het Sporenbassin opent wanneer je hoofdstuk 9 bereikt; De Zonneoven na voltooiing van hoofdstuk 14. Iedere arena bevat één baas met twee fasen, zonder helpers. Kies vooraf uitrusting of meer schroot. De baas schaalt bij het starten mee; dezelfde levende baas wordt niet tussentijds versterkt. Leven, mana en consumptievoorraad worden niet gratis aangevuld.

| Contract | Uitrustingskeuze | Schrootkeuze | Rariteit wanneer een item valt |
|---|---|---|---|
| Sporenregent | 65 schroot + één item | 120 schroot + 25% itemkans | Uncommon 52%, Rare 36%, Epic 11%, Legendary 1% |
| Zonnebeul | 110 schroot + één item | 190 schroot + 25% itemkans | Uncommon 25%, Rare 51%, Epic 21%, Legendary 3% |

Een overwinning betaalt precies één keer. Herbetreden voor een nieuw contract geeft een nieuwe baas. Een verloren poging geeft geen beloning. Itemlevels zijn begrensd per contract (8–11 en 11–14), zodat vroegere contracten geen eindgame-uitrusting blijven produceren. Er is geen extra Legendary-garantie voor contracten.

**Gif:** alle sporenwolken en gifaanvallen veroorzaken dezelfde niet-stapelende infectie. Zonder gifweerstand: 50% maximaal leven over acht seconden, in acht tikken. Met 24% gifweerstand: 38%; met de weerstandslimiet van 60%: 20%. Algemene armor, schilden en ontwijken stoppen een bestaande infectie niet. Antidoten blijven duur en hebben hun bestaande cooldown. Herhaalde blootstelling verlengt de duur; meerdere infecties vermenigvuldigen de schade niet. Weerstandsaffixes kunnen ook op gevonden en gekochte bescherming voorkomen.

Oorspronkelijk artwork voor de nieuwe arena’s: `assets/painted/bounty-spore-v57.webp` en `assets/painted/bounty-solar-v57.webp`, gemaakt met de ingebouwde beeldgenerator. De volledige prompts staan in `assets/painted/V57-ART-PROMPTS.json`. De vloeren zijn handmatig op de illustraties afgestemd en start, baas en terugpoort zijn gecontroleerd.

Nieuw in **v5.6.2**: selecties in Verkopen werken direct in de bestaande lijst. Scrollpositie en toetsenbordfocus blijven behouden, ook bij alles selecteren en de selectie wissen. Het aantal en schroottotaal worden meteen bijgewerkt. Een winkelverversing bij verkoop, filters of aankoop houdt de huidige positie vast; een nieuwe tab begint bovenaan. Sluiten brengt de focus terug naar de knop waarmee je het menu opende.

De tekenroutine hergebruikt uitgesneden sprites, gekleurde varianten, tekst, zachte gloed, de atmosfeerlaag en het minimapbeeld. Loopuitsneden voor alle acht richtingen zijn voorbereid voordat je begint; benen hoeven niet opnieuw per frame te worden uitgesneden. Objecten buiten beeld worden overgeslagen, terwijl hun spelregels en minimapmarkeringen actief blijven. Automatische kwaliteit gebruikt maximaal circa 2,5 miljoen tekenpixels; Hoog gebruikt maximaal vier miljoen. Bij aanhoudend lage framerate wordt alleen de interne Canvas-resolutie verlaagd; camera, mikken, UI en speltempo houden dezelfde instellingen.

Gebiedsimpact is compacter en transparanter, met minder losse deeltjes. Bewegende golfaanvallen behouden hun schaderand en veilige midden. Gifwolken blijven dichter bij de grond. De gevechtsbalans, vijandstats, dropkansen, schadezones en cooldowns zijn niet gewijzigd.

**v5.6.1**: de kruising naar de optionele berging in Transportnet sluit nu over de volle breedte aan op de hoofdweg. De Getijdenkade en Transportnet hebben bredere promenades; ook de voorraadtrap in de Groene Corridor is ruimer. Alle veilige diensten, kisten, poorten en de quest-NPC zijn bereikbaar met extra lichaamsruimte.

Vijandelijke gebiedsaanvallen hebben nieuw oorspronkelijk geschilderd artwork voor watergolven, vuurpluimen, gifwolken en blikseminslagen, met een afzonderlijke voorbereiding, impact en nasleep. De waarschuwingsrand blijft op de werkelijke schaderadius. Bewegende schokgolven laten hun veilige midden open.

De Rietdelta heeft centrale pompruïnes, de Spiegelvelden twee versprongen spiegelobstakels en het Kasfront wortelgroepen met meerdere doorgangen. Vijanden zoeken routes om de obstakels; rechte projectielen en vijandelijke laserstralen stoppen op de voorzijde. Boogbommen en bovenaf gerichte gebiedsspreuken kunnen eroverheen. Obstakels vervagen wanneer ze de held afdekken. Buit van een vijand die boven een obstakel sneuvelt, landt op de dichtstbijzijnde begaanbare plek. De gewone dropkansen blijven gelijk.


![Geschilderde expeditiewereld](preview.webp)

Een zelfstandig **2.5D action RPG** in een door de Wereldbreuk ontregelde magische wereld. Volg 24 hoofdstukken, verken optionele bergingen, nevenroutes en twee baascontracten, bouw je veldpak en verbind de kalibratiekernen en regionale regelaars met Aurelia.

**Versie 5.6** herstelt de winkel-freeze bij Waterlijnhandel en de Zaadkluis. De hele handelsaanloop valt nu binnen de veilige post; de winkel en het spel kunnen niet meer ongemerkt in verschillende standen belanden. Het noordelijke terras, de zuidoostelijke tuinplaza en de zuidelijke trap in de Zonnetuinen zijn bereikbaar met gewone beweging. Op het noordelijke terras ligt een eenmalige extra veldkist.

Vier regio’s hebben een eigen assortiment: getijdenuitrusting bij Waterlijnhandel, zonne- en hitteuitrusting bij Schrootstation, herstel- en kiemuitrusting bij Veldmakers, en storm- en precisieuitrusting bij Horizonpost. Itemlevels beginnen op 1 / 4 / 7 / 10. De routekaravanen hebben daarnaast een eigen voorraad, benodigdheden en versterkingen. Bij Mara vanaf Vrijhaven kun je **Prismaboog voor 650 schroot** leren: een gericht vliegend projectiel met maximaal drie sprongen en 12% schadeafname per sprong. Je wijst haar daarna zelf toe via K. Eén legendarische focus bij Horizonpost kost **4200 schroot** en vult na aankoop niet aan.

Na Aurelia openen **Dijkbreker, Glasstorm en Nulfront** via **M → Tijdproeven** bij een veilige handelspost. Ze hebben nieuw eigen artwork, verschillende vijandgroepen, vier golven en een eindbaas. Elke arena heeft Veteraan, Expert en Meester; de volgende graad opent na een voltooiing van de vorige. Een drie-seconden start telt niet mee; de twee-seconden pauzes tussen golven wel. Pauzeren stopt de actieve speeltijd. Gear en bindings kies je vooraf; je kunt je hoofdaanval tijdens het gevecht wisselen.

Tijdproeven starten met vol leven en mana maar geven geen gratis verband of antidoten. Elke voltooiing geeft **één item**, **70 / 105 / 150 schroot** en **120 / 180 / 240 XP**. De itemkansen Rare / Epic / Legendary zijn **75 / 23 / 2%**, **60 / 36 / 4%** en **45 / 49 / 6%**. Losse proefvijanden geven geen loot, geld, XP of gezondheidsdruppels. Persoonlijke records blijven apart lokaal bewaard en bevatten je startbuild; het resultaat kun je expliciet kopiëren om zelf te delen. Er is geen mondiale ranglijst. Herladen tijdens een actieve poging begint de hele poging opnieuw, met behoud van verbruikte benodigdheden.

De loopanimatie gebruikt rustigere passen, kleinere voetlift en knieën in de looprichting, met gecorrigeerde heupen en kledinguitsneden. De acht kijkrichtingen blijven behouden. De vorige presentatie-update verbeterde het lopen met werkelijk afwisselende voetcontacten, kniebuiging, gewichtsverplaatsing en rompbeweging. De acht geschilderde kijkrichtingen blijven behouden; de animatie volgt echte verplaatsing en stopt bij obstakels. Zes vijandfamilies krijgen vier bewegingsposes plus voorbereiding en loslaten van hun aanval, met uitgelijnde ankers en vloeiende poseovergangen.

**Transportnet** heeft een bereikbaar noordelijk tuinpad, een grotere zuidelijke zijterrastuin en een westelijke markttak. De voorraadkist staat op het zijplein. **Nora**, op het noordelijke tuinpad, biedt de optionele opdracht *Noodstroom*: versla beide groepen in het Vergeten Depot, berg de meetspoel met F en breng hem terug. Kies één zeldzaam onderdeel en ontvang 80 schroot; uitrusten blijft handmatig.

Vijanden vuren herkenbare geschilderde water-, vuur-, storm-, gif-, zon- en schrootprojectielen af. Hun lichaam trekt terug, stoot uit of veert terug bij het schot. Sluipschutters schieten een echt vliegende kogel; artillerie en sporenwerpers hebben boogvluchten met zichtbare landingswaarschuwingen en vertraagde impact. Loopvoeten draaien om de heupen en blijven tijdens een standfase op de vloer. De stafgloed volgt de bewegende romp.

Nieuw zijn de **Spuitkever** en **Gifmeester**: groene projectielwaaiers, gerichte gifstralen en aangekondigde gifplassen. Sporendragers wisselen nu ook hun aanval af. Vijandgif kost 50% maximaal leven over acht seconden, zonder stapelen van schade per seconde. Verband geneest 45 leven met tien seconden cooldown. Kostbare antidoten stoppen gif met dertig seconden cooldown; de HUD toont beide timers en de actieve gifduur.

**De Schrootgetijden** en **Het Vergeten Depot** openen na de eerste kern. Ze hebben eigen artwork, twee gevechtsgroepen, een schrootbeloning en een buitkist. Nieuwe bezoeken na voltooiing beginnen een nieuwe berging met vijanden op je actuele level. De hoofdroute behoudt zijn volgorde en arena’s houden één terugpoort na volledige overwinning.

Bij **Jules → Loot loten** kies je één van zes uitrustingsslots en besteed je schroot aan een willekeurig item. De prijs en de vijf rarity-kansen staan vooraf in beeld. Het resultaat gaat in je rugzak; uitrusten blijft jouw keuze.

Alle vier veilige handelsposten hebben ruimere loopvloeren, verbonden zijpaden en verspreide vaste poorten: vijftien bestemmingen, twaalf diensten en acht verkenningskisten. Mara verkoopt focussen, Jules veldpakken en benodigdheden, Inez versterkt gedragen gear. De drie kerngebieden hebben eigen regiobazen met meerdere aanvalspatronen en fases. De laatste Gouden Wachter heeft drie fases.

## Lokaal spelen

Gebruik Node 18+:

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080). Er zijn geen npm-dependencies nodig. Gebruik de webserver voor ES-modules en assetverzoeken.

## Besturing

| Invoer | Actie |
| --- | --- |
| WASD / pijlen | Bewegen |
| Muis + links vasthouden | Richten en je gekozen hoofdaanval herhalen |
| 1 t/m 6 | Toegewezen vaardigheid direct uitvoeren; vasthouden herhaalt |
| Klik op hotbar-slot | Schietskill: laatste handmatige richting. Zon/AoE: nabij doel |
| Rechtsklik op hotbar-slot / Q-slot | De aanval voor dat specifieke slot wijzigen |
| Klik op LINKS in de HUD | De hoofdaanval kiezen |
| Q / rechtsklik | Je zelf toegewezen rechter vaardigheid |
| K / klik op level | Skills leren; eerst links, rechts of een cijfer kiezen, daarna een aanval |
| Muiswiel | Hoofdaanval wisselen tussen geleerde aanvallen |
| Spatie / E | Ontwijken; twee ladingen, kort onkwetsbaar |
| H | Verband: 45 leven, maximaal één keer per 10 seconden; stopt gif niet |
| J | Antidotum: gif verwijderen; 30 seconden cooldown |
| R | Volledig geladen kernpuls |
| F | Handelaar, portal, station, vondst, archief of console gebruiken |
| B / handelsknop | Winkel openen bij een handelaar |
| T | Dieren een doel onder de cursor geven |
| I | Rugzak, vergelijking en handmatig uitrusten |
| M | Kaart; vrijgespeelde bestemming voor de richtingpijl kiezen |
| Esc | Pauze of een vrijblijvend menu sluiten |
| Touch | Stick om te bewegen; doelknop voor vuur en automatisch richten |

Cijfers en rechtsklik veranderen je hoofdaanval **niet**. Je kunt bijvoorbeeld water op links houden, IJslans op rechts plaatsen en Stormfront op slot 4 uitvoeren.

## Wereld en voortgang

De vaste volgorde is: **Getijdenkade → Rietdelta → Verdronken Ring → Zonnetuinen → Transportnet → Spiegelvelden → Zoutcentrale → Rode Kilometer → Groene Corridor → Kasfront → Zoutwoud → Zaadkluis → Noordzeebrug → Stormhaven → Wolkenarchief → Aurelia-spits**.

Elke stap levert iets voor de volgende op: de pomp voor de meetstations, een droge routekaart, zonne-energie, een watervoorraad, kiemculturen en de laatste weermeting. De kaart toont de hoofdstukken in volgorde en blokkeert overslaan. Na gevechtschapters keer je met de enige doorgang terug naar de regionale handelspost. Diezelfde post heeft vaste, duidelijk verschillende poorten; alleen het volgende verhaaldoel en eerder bezochte doelen zijn bereikbaar. In de Zonnetuinen en Zaadkluis moet de bewaakte protocolkist worden geborgen of gerecycled voordat je verder kunt.

De vier regionale handelsgebieden zijn volledig veilig en hebben drie gespecialiseerde handelaren en eenmalige verkenningsvondsten. Zonnetuinen en Zaadkluis hebben een veilige aankomstplek, maar daarbuiten liggen routegevaren en bewakers. De drie kernarena’s hebben twee stations met elk twee golven en een unieke regiobaas. De zes andere gevechtschapters hebben twee groepen met een elitebewaker. Alle vijanden moeten worden verslagen voordat de terugdoorgang verschijnt. De laatste Wachter heeft drie fases; na de eindconsole kun je terug naar het handelskamp.

Kies met M het volgende doel voor de richtingpijl en loop naar de bijbehorende vaste poort. Vanuit een veilige handelszone kun je via M meteen naar voltooide hoofdstukken terugreizen. Vanuit een arena ga je eerst terug naar de post. Kies **Volg het verhaal** om een oude bestemming los te laten. Verslagen vijanden, geopende vondsten, winkelvoorraad en voltooide stations blijven bewaard. Voltooide verhaalgebieden genereren geen nieuwe vijanden of buit. De twee optionele bergingen zijn herhaalbaar; bij terugkeer na voltooiing starten nieuwe, op je actuele level geschaalde gevechten. Reizen geeft geen gratis leven of mana. Een voltooid station biedt één herstelbeurt.

## Vaardigheden en uitrusting

Elk nieuw level geeft **één punt**, met een duidelijke gouden melding, lichteffect en oplopend geluid. Het gepauzeerde keuzescherm toont het bereikte level, je punten en de vaardigheden die net beschikbaar zijn gekomen. Kies een nieuwe skill of een permanente verbetering, of bewaar het punt. Looptempo, schade, leven, mana en ontwijkherstel zijn build-keuzes.

| Vaardigheid | Werking | Beschikbaar |
| --- | --- | --- |
| Getijdenwaaier | Drie waterbogen; maakt doelen nat | Start |
| Boogbliksem | Directe straal; ketent via natte doelen | Start |
| Zonnebom | Gebogen worp, explosie en kort vuurveld | Start |
| IJslans | Doorboren, vertragen en natte doelen bevriezen | Level 2 |
| Windboemerang | Raakt heen en terug; duwt weg | Level 3 |
| IJsbarrière | Smalle strook dwars op je richting; vertraagt en bevriest natte doelen | Level 3 |
| Zwaartekern | Trekt samen en implodeert | Level 4 |
| Cycloon | Smalle, voortbewegende tornado die vijanden meesleept | Level 4 |
| Stormfront | Maximaal drie gerichte inslagen per salvo; wisselt doelen af en ketent via water | Level 5 |
| Zonneval | Drie afzonderlijke kraters na 0,6 / 1,35 / 2,1 seconden | Level 6 |

Nieuwe skills kosten één punt en kunnen op links, rechts/Q en alle zes cijfer-slots worden geplaatst. Het menu toont acht slotkaarten: kies eerst het slot, daarna de aanval. Een beschikbare nieuwe skill kan met één punt worden geleerd en meteen geplaatst. Een dubbel geplaatste aanval deelt zijn cooldown tussen knoppen. De standaard rechter aanval is Boogbliksem, of Zonnebom wanneer je start met storm. Getij → storm geeft +70% schade en kettingbliksem; getij → zon geeft een stoomgolf. De kernpuls bouwt een zichtbare kern op en raakt na een halve seconde meerdere doelen met een brede golf. Deze aanval laadt zichzelf niet op. De opbouw door schade, kills en combinaties is gehalveerd; overkill telt niet mee. Na gebruik geldt 40 seconden herlaadtijd, zichtbaar naast de lading in de HUD.

Je draagt **focus, mantel, twee relikwieën, laarzen, handschoenen en gordel**. Er zijn 36 buittemplates met willekeurige eigenschappen, itemlevels en vijf zeldzaamheden: **Common, Uncommon, Rare, Epic, Legendary**. Common heeft geen extra eigenschap, Uncommon en Rare één, Epic en Legendary twee. Hogere itemlevels en zeldzaamheden versterken stats. Sommige items vragen een hoger spelerslevel.

Nieuwe items gaan eerst in de rugzak van maximaal 48 onderdelen. Kies het onderdeel, vergelijk het met het passende gedragen slot en klik op **Uitrusten**, klik op het passende heldslot of sleep het erheen. Beide relikwieslots accepteren dezelfde itemcategorie; voor een relikwie zijn beide vergelijkingen en twee expliciete uitrustknoppen beschikbaar. Het vorige item blijft in je rugzak. Wisselen behoudt je HP- en mana-percentage. Recyclen en verkopen zijn expliciete, afzonderlijke acties.

## Handel en lootprogressie

Elke handelspost heeft acht gewone aanbiedingen en zes vaste Epic-spaarstukken; de laatste twee hebben ook een uniek Legendary-doel. Ze zijn verdeeld over Mara (focus, relikwie, handschoenen) en Jules (mantel, laarzen, gordel), met betere itemlevels in latere regio’s. Inez beheert de werkplaats. Kopen plaatst een item in de rugzak. In Verkopen filter je op uitrustingstype en zeldzaamheid, selecteer je meerdere items of alle zichtbare items en zie je vooraf het totaal. Eén actie verkoopt de selectie; gedragen gear kan niet worden geselecteerd. Verkopen betaalt 30% van de basisprijs plus een kleine vergoeding voor versterkingen; uitgeruste spullen moeten eerst worden gewisseld. Recyclen geeft minder schroot dan verkopen.

De smid versterkt elk gedragen onderdeel tot **+3**. Een focus krijgt schade, een mantel leven, een relikwie manaherstel, laarzen snelheid, handschoenen kritieke kans en een gordel bescherming. De prijs stijgt per versterking. Verband kost 15 schroot, met maximaal acht ladingen. Antidoten kosten 45 schroot, met twee doses voorraad per handelspost en maximaal drie in je uitrusting. Handelen kan alleen in een veilige zone.

| Vijand / vondst | Kans op een item | Common / Uncommon / Rare / Epic / Legendary bij itemlevel 1 |
| --- | --- | --- |
| Schrootschraper | 7,7% | 70 / 27 / 3 / 0 / 0 |
| Inspectiedrone | 9,1% | 60 / 32 / 8 / 0 / 0 |
| Asjager | 14,7% | 30 / 40 / 26 / 4 / 0 |
| Hitteschild | 19,3% | 12 / 35 / 40 / 13 / 0 |
| Hydraulische Breker | 25,2% | 0 / 20 / 45 / 32 / 3 |
| Boogjager | 14% | 28 / 43 / 25 / 4 / 0 |
| Asgraver | 17% | 14 / 38 / 36 / 11 / 1 |
| Schildrover | 19% | 13 / 35 / 39 / 12 / 1 |
| Stormnest | 23% | 5 / 27 / 45 / 21 / 2 |
| Spuitkever | 16% | 20 / 40 / 32 / 8 / 0 |
| Gifmeester | 18% | 10 / 35 / 40 / 14 / 1 |
| Elite | 60% | 0 / 12 / 53 / 34 / 1 |
| Kernbewaker | 100% | 0 / 0 / 55 / 42 / 3 |
| Regiobaas / eindbaas | 100% | 0 / 0 / 42 / 50 / 8 |

De kansen gelden voor een lege vloer. Naarmate er meer losse items liggen, neemt de kans verder af; bij zeven losse items vallen geen extra gewone drops. Bewakers en bazen behouden hun gegarandeerde item. Bij de achtste grote drop is een Legendary gegarandeerd als de vorige zeven grote drops er geen hadden. Opgeroepen versterking levert geen XP, schroot, items, kill-healing of kill-lading, en een nest roept maximaal drie keer versterking op. De percentages rechts gelden als er een item valt. Vanaf itemlevel 5 verschuift bij gewone vijanden een deel van Common naar Rare. Vijandfamilies hebben ook voorkeuren voor slots: schrapers laten vaker laarzen, gordels of focussen vallen; schilden en brekers vaker bescherming. De volledige tabellen staan in `src/loot.js`.

Er zijn 45 vijandtypen, inclusief tien bazen. De nieuwe Boogjager, Asgraver, Schildrover en Stormnest hebben eigen gedrag; de kerngebieden worden bewaakt door de Getijdenmaaier, Spiegelvorst en het Kiemhart. De eerdere families zijn drones, rovers, wortelwachters, geschut, schrapers, sluipschutters, schilden, sporendragers, stormkwallen, brekers, magneetkrabben, resonanten en pekelbrekers. Vastgelegde vuurlijnen, landingscirkels en opbouwende waarschuwingen geven tijd om te ontwijken. Schrapers wisselen beten af met een vast gerichte sprint. Hitteschilden wisselen hun nabijslag af met een uitdijende schokgolfrand; het midden blijft veilig. Asjagers bewaren afstand en wisselen hun precisiestraal af met drie snelle projectielen. Drones zigzaggen rond hun doel, stormkwallen cirkelen en brekers blijven op artillerieafstand.

Elke nieuwe vijandgroep legt zijn kracht vast op basis van regio en spelerslevel: meer leven en schade, iets hogere snelheid en kortere pauzes. Uitgeputte oude vijanden herstellen niet bij terugreizen of gearwissels. Oude saves behouden hun schadepercentage bij de eenmalige balansmigratie.

Legendary-effecten: een extra ijsstraal na vier directe casts, een schild van 16 na ontwijken, één extra stormsprong, een vertragend ijsspoor, een kleine explosie na een brandende kill en 12 mana na schade. Elk effect heeft een eigen cooldown of triggerdrempel; effecten kunnen zichzelf niet onbeperkt activeren.

De lootloting bij Jules kost **40 + 10 × spelerslevel** schroot per item. Kies vooraf het slot: Common 40%, Uncommon 36%, Rare 18%, Epic 5%, Legendary 1%. Het itemlevel is één onder je level, minimaal 1. Elke worp geeft één rugzakitem en slaat geld, resultaat en toevalsreeks op. Een volle rugzak of te weinig schroot kost niets.

Vijandgif tikt eenmaal per seconde gedurende acht seconden, samen 50% van je maximale HP. De directe treffer komt daar bovenop. Nieuwe treffers verversen de duur maar verhogen de schade per seconde niet. Een antidotum geeft na het genezen vijf seconden gifbescherming. Ontwijken voorkomt een nieuwe treffer; al opgelopen gif blijft tijdens een dash tikken. Terreinsporen blijven hun eerdere lichte status gebruiken en kunnen ook met een antidotum worden gestopt.

## Geluid

Het spel maakt zijn muziek en effecten zelf met Web Audio: een rustige originele harmonische cyclus, warme gefilterde klanken, zachte belnoten en ruimtelijke nagalm. Gevechten voegen een lage spanningspuls toe. Elke regio heeft een andere grondtoon. Het volume van de achtergrond blijft lager dan de effecten. Er zijn geen externe muziekopnames of samples gebruikt. Geluid begint na je eerste spelklik; de luidsprekerknop schakelt alles uit of weer in. De bron en het zelfgegenereerde geluid vallen onder de meegeleverde `LICENSE`.

## Opslag en checkpoints

Oudere saves hervatten na de laatst geborgen kern en behouden hun uitrusting en verslagen vijanden. Iedere aankomst vormt een checkpoint. Handel en versterkingen leggen eveneens een checkpoint vast, zodat aankopen en verkochte voorraad bij uitval niet worden teruggedraaid. Uitval herstart het huidige gebied vanaf dat checkpoint. Normaal terugreizen behoudt actuele voortgang.

Voortgang wordt iedere acht seconden en bij belangrijke keuzes in `localStorage` opgeslagen. V3-, V4- en V5-saves migreren automatisch, inclusief bestaande uitrusting en voortgang. V3 geeft alsnog skillpunten voor eerdere levels. Oudere bezochte gebieden blijven toegankelijk. Opslag geldt voor deze browser en dit domein.

## GitHub Pages en Render

Upload de inhoud van deze map naar je GitHub-repository. Kies bij **Settings → Pages** je branch en rootmap. Relatieve assetpaden werken ook op project-URL’s. `.nojekyll` is inbegrepen.

Voor Render: maak een **Static Site**, of gebruik `render.yaml` als blueprint.

| Instelling | Waarde |
| --- | --- |
| Build command | `npm test && npm run site:build` |
| Publish directory | `dist` |

Er is geen database, servercode of geheime configuratie nodig.

## Validatie en code

```bash
npm test
npm run site:build
```

De regeltests controleren gevechten, terrein, golven, alle verbindingen, opslag, migraties, handel, itemverdeling, versterkingen, veilige zones, gescheiden invoer, gebiedsschade en de kernpuls. Drie volledige campagnes gebruiken normale acties met alle startdisciplines: 24 verhaalhoofdstukken, skills leren, gear plaatsen, kopen/verkopen/versterken en alle baasfases. De simulator geeft geen gratis stats of unlocks en verwijdert geen vijanden. Bij verlies gebruikt hij maximaal twee normale checkpoint-herstarts; het aantal herstarts staat in het testresultaat.

De echte Canvas-renderer is met gedecodeerde art gecontroleerd: drieëntwintig gebieden, elf aanvallen, nieuwe vijandposes, buit, kampen en de kernpuls. Het echte entrypoint is daarnaast in een minimale DOM getest, inclusief menu’s, slots, rechtsklik, winkelknoppen, saves en herstarten. De nieuwe controles gebruiken echte H/J-invoer, cooldown-/gif-HUD, loterijklik en resultaat, optionele kaartknoppen en alle acht looprichtingen. Browser-layout, echte audio-uitvoer en mobiele framerate zijn niet handmatig getest. De automatische speler slaat leestijd over; zijn tijd is geen beloofde menselijke speelduur.

| Bestand | Doel |
| --- | --- |
| `src/engine.js` | Gevecht, AI, navigatie, voortgang en opslag |
| `src/safe-exploration-content.js`, `src/safe-exploration.js`, `src/safe-exploration-ui.js` | Drie veilige wijken, onderzoekplekken, Milo’s quest en Linde’s elementzegels/recepten |
| `src/expedition.js` | Handel, veilige kampen, locks, AoE en kernpuls |
| `src/hero-animation.js`, `src/hero-motion.js`, `src/hero-rig.js` | Acht geschilderde richtingen, afwisselende voetcontacten, rompbeweging en focusgloed |
| `src/gear-feedback.js` | Echte statverschillen bij vondsten en kistkeuzes |
| `src/story.js`, `src/aim.js` | Chronologische hoofdstukken en handmatig/ondersteund klikrichten |
| `src/survival.js` | Verband- en antidotumtimers, acht gifschadeticks en bescherming |
| `src/gamble.js` | Schrootloten, expliciete slotkeuze en rarity-kansen |
| `src/enemy-motion.js`, `src/toxic-enemies.js` | Vijandposes en nieuwe gifaanvalsvormen |
| `src/hub-layouts.js` | Vloeren en verspreide poorten, handelaren en kisten |
| `src/enemy-variety.js` | Mijnen, magnetische trek, sweep, pekel en zoutbarrières |
| `src/hubs.js` | Vaste hubpoorten, drie diensten en verkenningskisten |
| `src/encounters.js`, `src/encounter-visuals.js` | Nieuwe rollen, regiobazen en aanvalspatronen |
| `src/markets.js` | Regionaal assortiment en gekochte spreuken |
| `src/endgame.js` | Tijdproeven, drie graden, beloningen en lokale records |
| `src/legendary.js` | Zes unieke effecten met cooldowns |
| `src/balance.js` | Eenmalige schaling van vijanden zonder genezing |
| `src/loadout-ui.js` | Acht onafhankelijke aanvalslotkeuzes |
| `src/equipment-ui.js`, `src/equipment-slots.js` | Acht uitrustingsslots, slepen, filters en vergelijking |
| `src/specializations.js` | Drie specialisaties en talentkeuzes |
| `src/adventures.js`, `src/boss-terrain.js` | Nevenroutes en contractbaasterrein |
| `src/premium-spells.js` | Doorborende stormlans en pulserende Winterkroon |
| `src/loot.js` | Lootprofielen, rollen, itemstats en migratie |
| `src/data.js` | Gebieden, loopvloeren, skills en verhaal |
| `src/render.js`, `src/visuals.js` | Camera, sprites, effecten, portals en minimap |
| `src/main.js`, `src/shop-ui.js` | Invoer, HUD, journal, winkel en saves |
| `src/sound.js`, `src/score.js` | Originele zachte muziek, nagalm en effecten |
| `styles.css` | Responsive perkament-, leer- en messinginterface |

## Artwork en licentie

Titelart, omgevingen voor 44 gebieden, heldanimaties, vijandatlassen, items, skills, portals, handelaar, effecten en UI-texturen zijn voor dit project met AI gegenereerd. Er zijn geen assets uit Nine Parchments, Torchlight of andere spellen overgenomen. De wereld gebruikt Canvas met geschilderde 2.5D-art; het is een vaste campagne, geen volledige 3D-engine of procedureel dungeonstelsel.

Sprites zijn WebP met transparantie, eigen voetankers, schaduwen en dieptesortering. Alle runtime-art en bronatlassen worden meegeleverd; de download bevat ook alle code en controles. De twee v5.5.1-artprompts voor Nora en de 24 elementeffecten staan in `assets/expedition/V551-ART-PROMPTS.json`, met uitsneden in `combat-effects-v551.json` en `nora-v551.json`. De twee v5.6.1-artprompts staan in `assets/expedition/V561-ART-PROMPTS.json`, met uitsneden in `enemy-aoe-v561.json` en `arena-obstacles-v561.json`. De vier nieuwe v5.5-artprompts staan in `assets/expedition/V55-ART-PROMPTS.json`; de 36 vijandframes staan in `assets/expedition/enemy-animation-v55.json`. De drie v5.4-artprompts staan in `assets/expedition/V54-ART-PROMPTS.json`. De 48 hero-uitsneden staan in `assets/painted/hero-eight-directions.json`, de vijand- en baasuitsneden in `assets/expedition/v54-sprites.json`. De vier v5.2-artprompts en uitsneden staan in `assets/expedition/V52-ART-PROMPTS.json` en `V52-ART-CROPS.json`; overige prompts staan in `assets/painted/`, `assets/items/ART-PROMPTS.json` en `assets/expedition/ART-PROMPTS.json`. De nieuwe v5.6-prompts en herkomst staan in `assets/painted/V56-ART-PROMPTS.json`. Code en meegeleverde assets vallen onder `LICENSE`.

De v5.6-controle `qa/market-endgame-tests.mjs` bevat zeventien controles voor handelaargrenzen, echte toetsenbordaanlopen, voorraad, spreukaankopen, projectielbotsingen en tijdrecords. `qa/trial-run.mjs` doorloopt een volledige campagne en speelt daarna drie Veteraan-proeven plus Expert en Meester met uitsluitend verdiende gear en gewone acties. Canvas-/DOM-controles verifiëren de daadwerkelijke winkel-, bindings- en resultaatbediening; browserlayout, luidsprekers en mobiele framerate zijn niet gemeten.

`qa/terrain-tests.mjs` controleert zeven regressies voor ruime hubroutes, de bergingskruising vanuit drie aanlopen, verbonden arenavloeren, golvspawns, dekking, vijandnavigatie, bereikbare drops en hervatten van oudere testsaves.

`qa/progression-tests.mjs` bevat negentien controles voor itemmarkeringen, alle spreukvarianten, weerstand, crafting, baascontracten en de beloofde dropverdeling. `qa/ui-tests.mjs` bevat veertien controles van het echte menu-entrypoint: scroll/focus, favorieten, verkoopwaar, spell learning, crafting en het starten van contracten. Drie campagnebots gebruiken verdiende uitrusting en gifweerstand, lezen giftige waarschuwingen en besteden normaal schroot; ze krijgen geen gratis upgrades. De beeld- en DOM-controles meten geen browserlayout of mobiele framerate.

De v6-controles in `qa/v6-tests.mjs` controleren constructies, unieke effecten, vijandrollen, gifbanen, stadsquests, bereikbare contract-NPC’s, risico en instellingen. Een aanvullende Canvas-/DOM-controle heeft alle nieuwe menu’s met echte gedecodeerde art doorlopen, inclusief F-interactie, recepten en opgeslagen instellingen. Een native Canvas-vergelijking met 24 bewegende vijanden meet minder tekenwerk voor de gecachete animaties; dit is geen browser-FPS-meting.

De v7-controles in `qa/v7-tests.mjs` bevatten dertien groepen voor talenten, betaalde spreuken, vaste winkeldoelen, bergingspunten, bereikbaarheid, terreinwaarschuwingen, tijdelijke blokkades, beide relikwieslots, crafting en daadwerkelijk herstel door de lichtmot. Een aanvullende controle van het echte menu-entrypoint gebruikt gedecodeerde Canvas-art voor slepen, plaatsing in beide relikwieslots, scrollbehoud, talentkeuzes, winkelaankopen en het starten van nevenroutes. Browserlayout, luidsprekers en browser-FPS zijn niet gemeten.

De v8-controles in `qa/v8-tests.mjs` testen twaalf groepen: opeenvolgende hoofdstukken, echte toetsenbordroutes naar alle nieuwe hubdiensten, beide golven en eenmalige beloningen, de twee bossolo's, de eindconsole, vaste vijandsterkte na save, hoofdgear/crafting, betaalde winkeldoelen, gedeelde zichtbare uitrusting, snelle ontwijkbare schoten zonder vloermarker, flanknavigatie en alle assetbestanden. Native Canvas-controles gebruiken de echte gedecodeerde assets voor alle nieuwe gebieden, 32 uitrustingsaanzichten en 48 loopposes. De echte menu-entrypointtest controleert equippen, slepen, scrollbehoud en aankopen. Browser-CSS-layout, luidsprekers en browser-FPS zijn niet gemeten.

De v8.3-controles in `qa/creature-tests.mjs` en `qa/nature-tests.mjs` testen dieren vanaf4/10, echte schade en dood, betaalde training, bindings, elitepatronen, optionele kisten, bijzondere legendary-effecten, drie nieuwe gebieden, herhaling, keyboardroutes en soepele beweging. De campagne- en tijdproefspelers gebruiken hun normaal geleerde dierenverbond; zij krijgen geen gratis punten of stats. Verdere meetresultaten en beperkingen staan in `qa/V83-VALIDATION.md`.
