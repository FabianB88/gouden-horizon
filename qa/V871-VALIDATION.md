# v8.7.1 — verificatie

De regressieset bevat 364 gerichte controles, drie volledige campagneprofielen en vijf endgame-combinaties. De nieuwe controles staan in `qa/navigation-v871-tests.mjs`; de echte menu-invoer in `qa/ui-tests.mjs` test ook proloog en adminreizen. De eindcontrole wordt uitgevoerd met `npm test`, `npm run site:build` en `git diff --check`.

## Gebieden en lopen

Vrijhaven bestaat uit twee afzonderlijke 1536 × 1024-artworktegels op dezelfde bestaande schaal 1.75. De wereld is 5376 × 1792. De bronafmetingen en plaatsing van de oorspronkelijke tegel blijven gelijk. Een transparant geschilderde stenen brug verbindt het oude zuidoostelijke pad met het nieuwe westelijke plein. Beide tegels en de brug zijn op hun echte productieposities visueel gecontroleerd.

NPC’s, alle handelsdiensten, poorten, kisten en schrootvondsten hebben geteste routes. De body-clearancecontrole gebruikt 35 wereldpixels. De nieuwe proef loopt ook met gewone acht-richtingstoetsen heen en terug naar de uiteinden van de Zonnetuinen en de pleinen van beide stadsdelen. De daadwerkelijke held heeft een radius van 18. Water, planten, gebouwen en de decoratieve groene leiding blijven geblokkeerd. Langere testlooproutes hebben korte tussenpunten, zodat acht toetsrichtingen geen brede bocht afsnijden.

De nieuwe voorraadkist staat op het westelijke plein van het nieuwe stadsdeel. Het centrale plein van de oude stad, de noordelijke tuin en de zijroutes van Zonnetuinen zijn aan de zichtbare bestrating gekoppeld. De ontbrekende middenstrook in Koelhof sluit aan op zijn bestaande route. Schrootvondsten blijven eenmalig en beperkt tot de bestaande regionale caps.

## Personages en beeld

Drie oorspronkelijke transparante atlassen leveren elk vijf geschilderde aanzichten; de drie andere richtingen worden gespiegeld. De echte productierig is met gedecodeerde assets gerenderd voor 24 personage/richting-combinaties en twaalf combinaties met mantel, focus en helm. Gezicht, haar, silhouet en kleuraccenten blijven herkenbaar. De focus volgt het handanker en de spell-origin; de helm volgt het hoofdanker. Het veld, de rugzak en LAN gebruiken dezelfde identiteit.

Loopafstand stuurt de passen, met afwisselend voetcontact, rompbeweging en korte gewichtsoverdracht bij casten. Uitrustingsvarianten gebruiken begrensde caches; oude ongebruikte heldatlassen worden niet meer gedecodeerd bij laden.

Alle zes camera-instellingen zijn gecontroleerd op kaartgrenzen en juiste muiscoördinaten. De standaard is 115%. Hoog tekent op een desktop met pixelratio 1 op ratio 1.25 wanneer het pixelbudget dit toestaat. Het hoge budget blijft maximaal vier miljoen pixels; de automatische kwaliteitsaanpassing behoudt haar bestaande regels.

## Admin en lore

Alleen exact `fabian1` opent sessiereizen; lege, fout gespelde en aangevulde codes worden geweigerd. Alle bestemmingen zijn getest zonder extra levels, uitrusting of gedwongen gevechtswinst. Reizen herstelt leven. Tijdens testmodus worden normale saves niet overschreven en wordt de ontgrendeling niet opgeslagen. De LAN-host controleert de code; ook in testmodus zijn twee reistemmen nodig. Een neergevallen partner kan mee naar een testbestemming.

Nieuwe solo-expedities tonen drie geïllustreerde lorepagina’s. Escape, de sluitknop en het pauzemenu omzeilen deze opening niet. De laatste pagina noemt de eerste echte bestemming en opdracht. De voortgang van de opening wordt opgeslagen. Poorten hebben een kort doel, en belangrijke eerste aankomsten geven context over de Wereldbreuk. Expliciete Nederlandse locaties zijn vervangen door wereldnamen.

## Gameplay en LAN

Gevechtsschade, vijandleven, lootkansen, shopprijzen, gifschade en consumabletimers zijn niet verlaagd voor deze update. De campagnebot gebruikt gewone beweging, mana, casts, genezing, betaalde crafting en verdiende uitrusting, met maximaal twee checkpoint-herstarts. Zijn vuurprofiel gebruikt geleerde gebiedsspreuken ook tegen een losse baas; de andere profielen bewaren mana voor hun getij/bliksemcombinatie. Dit verandert alleen het gedrag van de testspeler.

De LAN-controles verbinden twee echte WebSocket-clients met de lokale HTTP-server, controleren eigen helden en loot, schaling, reizen, herverbinden en checkpointopslag. De menucontrole bedient de echte startlobby en Milo’s tuinpoort. Controllerlogica wordt gecontroleerd voor beide triggers, zes slots, menu’s, loskoppelen en veilige knoprelease.

## Grenzen

Native Canvas-renders en het DOM-testmodel controleren geen daadwerkelijke browserlayout, browser-FPS, tv/gamepad, twee fysieke Xboxes met Edge of geluid uit luidsprekers. Audio is gecontroleerd op graph en scheduling. De bot slaat leestijd over; zijn gesimuleerde tijd is geen belofte over menselijke speelduur. De bestaande testsite is niet gepubliceerd met deze ZIP.
