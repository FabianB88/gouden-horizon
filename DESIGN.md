# Gouden Horizon v5

Een klimaatveldwerker zoekt drie kalibratiekernen voor Aurelia. Het verhaal koppelt herstel aan meting, terugkoppeling en de mogelijkheid om een ingreep weer te stoppen. De vaste campagne bestaat uit tien gebieden en twee optionele prototypevondsten.

## Gebiedsflow

De Getijdenkade start als transitgebied met veilige aankomst en handelaar. Alleen de Verdronken Ring is vanaf het begin beschikbaar. Een geborgen kern brengt de speler terug naar het regionale kamp en opent de volgende verbindingen. Daarna volgen het Transportnet met de Rode Kilometer, de Groene Corridor met Zoutwoud en Zaadkluis, en de Noordzeebrug met Aurelia.

Een arena toont geen reisportal zolang er nog vijanden leven of stations onvoltooid zijn. Na alle golven, de bewaker en overige vijanden verschijnt één terugportal. Bij de laatste arena blijft ook de eindconsole beschikbaar. De kaart stelt een bestemming voor de richtingpijl in; de speler reist zelf via F. Oude gebieden, verslagen vijanden, caches en voorraad blijven behouden. Terugreizen herstelt geen HP of mana en genereert geen nieuwe loot.

Zes verbindingsroutes hebben veilige aankomstzones. Hun overige routegedeelten bevatten vijanden, terrein en vondsten. Handelaar en portals staan op aparte, bereikbare plekken. De loopruimte is een union van vloerpolygonen langs geschilderde bruggen en platforms; een navigatielattice helpt vijanden om scenery heen.

## Build en itemprogressie

Links behoudt een vaste hoofdaanval: getij, storm of zon. De speler deelt geleerde vaardigheden in over zes cijfer-slots en een onafhankelijke rechter/Q-slot. Cijfers en rechtsklik voeren direct uit zonder links te veranderen. Nieuwe skills vragen een levelpunt en komen beschikbaar op levels 2 tot 6; punten kunnen worden bewaard. Loopsnelheid, schade, leven, mana en ontwijkherstel blijven aparte permanente keuzes.

Tien aanvallen verschillen in vorm: waaier, kettingstraal, geworpen bom, ijslans, terugkerende boemerang, implosiekern, ijsveld, cycloon, stormfront en drie vertraagde zonne-inslagen. De kernpuls heeft een opbouwfase en brede geschilderde schokgolf. Zijn eigen damage en kills geven geen nieuwe charge.

Zes gedragen slots gebruiken 24 loottemplates en vijf zeldzaamheden. Common heeft geen extra affix, Uncommon/Rare één en Epic/Legendary twee. Itemlevel schaalt stats en stelt een spelerslevelvereiste. Vijandfamilies hebben eigen dropkansen, zeldzaamheidsverdelingen en favoriete slots. Elites, kernbewakers en de eindbaas garanderen een item met betere verdelingen; een sterke vijand garandeert geen Legendary.

Alle vondsten gaan eerst in de rugzak. Vergelijking toont winst en verlies; uitrusten is expliciet. Het vorige onderdeel blijft bewaard. HP- en mana-percentages blijven bij wisselen en versterken behouden. De rugzak heeft 48 plaatsen. Verkopen en recyclen kunnen alleen een concreet, bestaand rugzakitem verwijderen.

## Handel en checkpoint

Elke post heeft acht blijvende aanbiedingen; latere regio’s verkopen hogere itemlevels. De speler koopt, verkoopt of versterkt gedragen gear tot +3. Verkoop is waardevoller dan recyclen. Versterkingen geven slotgebonden bonussen en stijgende kosten. Verband is geprijsd en begrensd tot acht ladingen.

Kampen beschermen tegen vijanden, terrein en projectielen; casten is daar geblokkeerd. Aankomst en succesvolle handel leggen een checkpoint vast. Dit voorkomt het herstellen van verkochte voorraad of geld via retry. Oude V3/V4-saves behouden bestaande gear en voortgang en krijgen de nieuwe slots, instellingen en winkelvoorraad.

## Art en interface

Geschilderde sprites gebruiken transparantie, voetankers, grondschaduwen en dieptesortering. Nieuwe eigen atlassen bevatten zes vijandfamilies, vier portalvarianten, handelaar, smid, twaalf items en zes gebieds-/kernpulseffecten. Itembeelden worden gedeeld door wereldbuit, rugzak, slots en vergelijking. Zeldzaamheid heeft zowel kleur als geschreven label.

Het veldjournaal gebruikt warm perkament, verweerd teal leer en messing randen. Koop-, verkoop- en versterktabs delen dezelfde itemkaarten en expliciete prijsactie. De hoofdaanval en rechter binding hebben een afzonderlijk paneel in het skillmenu. Smalle schermen gebruiken één winkelkolom en een compacter kaartrooster.

## Validatiegrens

38 regeltests plus drie complete campagnes controleren normale voortgang, itemization, economie, invoerscheiding, arena-locks en alle baasfases. Canvas-frames met de echte art tonen tien gebieden, tien aanvallen, de nieuwe vijanden, rarity-buit, camp, portal en ultimate. Een minimale DOM voert het echte entrypoint uit en controleert invoer, winkelknoppen, modal/save-overgangen en retries.

Deze checks bewijzen geen uiteindelijke browser-layout, echte audio-uitvoer of mobiele framerate. De automatische speler slaat lezen en menselijke reactietijd over; diens tijd is geen beloofde speelduur.
