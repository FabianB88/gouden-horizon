# v8.7.2 — verificatie

375 gerichte controles, drie campagneprofielen en vijf endgame-combinaties vormen de regressieset. De releasecontrole gebruikt `npm test`, `npm run site:build` en `git diff --check`. De nieuwe gedragstests staan in `qa/outdoor-v872-tests.mjs`.

Resultaat op 4 oktober 2026: de volledige `npm test` is geslaagd, met 375 PASS-controles, drie gewonnen campagnes en vijf voltooide tijdproeven. Static build en whitespacecontrole slagen. Campagne-herstarts: Getij 2, Storm 1, Zon 1; alle drie eindigen op niveau 16. De vijf tijdproeven omvatten alle drie arena’s op rang 1 en Dijkbreker op rang 2 en 3.

## Uitbreidingen en fysieke doorgangen

Groene Corridor bestaat uit twee afzonderlijke 1536 × 1024-tegels op de bestaande schaal 1.75; totale wereld: 5376 × 1792. Horizonpost en Koelhof krijgen eveneens ieder een tweede 1536 × 1024-tegel, op hun bestaande schaal 1.25; totale wereld: 3840 × 1280. De oorspronkelijke tegelafmetingen en schaal zijn gecontroleerd. Elke uitbreiding gebruikt eigen nieuw artwork. Nieuwe bruggen verbinden de oude en nieuwe paden.

De toetsenbordproef loopt vanaf de oorspronkelijke ingang naar Seya, Orin of Tess, opent de deur met F, bezoekt alle drie activiteitpunten en keert terug naar NPC en oorspronkelijke ingang. Extra heen-en-terugproeven bezoeken de onbezette zijpleinen en de onderste trap in de Sintelhoven. De held beweegt met gewone acht-richtingstoetsen, botsingen en bewegingsinertie; hij wordt niet over lastige aansluitingen geteleporteerd. Routeplanning zoekt extra marge waar beschikbaar. De echte heldradius is 18 wereldpixels.

Gesloten deuren blokkeren normaal lopen en dashen naar het wilde deel. Openen verandert de huidige gebied-ID en heldpositie niet. De stad blijft veilig; in de wilde regio werken casten, echte vijandtreffers, statuses en gebiedsschade. Vijanden kunnen niet doorlopen naar de veilige stad. Projectielen gebruiken nu de werkelijke kaartgrenzen: een gerichte proef laat zowel held- als vijandprojectielen buiten het oude 1920-pixelvenster reizen en raken.

Seya’s planten vereisen dat bewakers binnen 220 wereldpixels verslagen zijn. Orins bakens vragen twee seconden stilstaan; lopen, schade, casten en dashen onderbreken afstemming. Elk van Tess’ ventielen dooft alleen zijn eigen hitteveld. De eindbeloning vereist drie voltooide punten en alle regionale vijanden verslagen. De beloningen zijn 140 / 210 / 320 schroot en één regionale uitrustingsvondst. Monster-itemdrops zijn hier 45% van hun gewone dropkans; de kwaliteitstabel per familie blijft gelden. Deuren, wonden, doden, gevonden items en betaalde beloningen worden opgeslagen. Herladen of terugkomen betaalt niets opnieuw en respawnt de groep niet.

## Moeilijkheid en LAN

Vanaf de glasgebieden groeien vijandleven en aanvalstempo per later hoofdstuk verder. De schadevloer is gebiedsgebonden en beschermt latere gebieden tegen een level-one admin-test die alleen de vroege zonecurve ontvangt. Het begin behoudt zijn eerdere schade; een delta-kruiper doet zonder verdediging nog 8 schade. In het Wolkenarchief liggen basisslagen van de geteste gewone families bij een ungelevelde reiziger ongeveer tussen 28 en 42 schade, vóór armor, elementweerstand en eventuele aanvalsmodifiers. De proef gebruikt een echte uitgevoerde aanval en laat zien dat gewone bescherming en bliksemweerstand die treffer verminderen.

De campagnebot koopt zijn uitrusting, crafting, antidoten en verband met verdiend geld. Hij weegt vanaf zone 3 bescherming en bliksemweerstand zwaarder en neemt maximaal vijf normaal gekochte verbanden mee. Hij krijgt geen extra levens, gear of schade en gebruikt maximaal twee echte checkpoint-herstarts. Dit verandert alleen de testspeler; geen vijandwaarden worden voor de bot verlaagd.

LAN deelt de fysieke deur en activiteitvoortgang. De nieuwe groepen hebben dezelfde 70% extra levens en 8% extra schade als andere co-op-gevechten, met ongeveer 30% extra gewone vijanden. De nieuwe schadevloer behoudt deze co-op-factor. De gast kan zelf een baken afstemmen. Beide spelers krijgen het schroot en elk één regionale uitrustingsvondst. Ook de bestaande echte WebSocket-, herverbindings-, controller- en opslagproeven zijn onderdeel van de controle.

## Artwork, lopen en lore

Drie klassepersonages gebruiken twee afzonderlijk getraceerde geschilderde benen. De tweede zijaanzicht-beenlaag volgt de gedeeltelijke occlusie in het oorspronkelijke aanzicht. Benen buigen afzonderlijk; voeten worden als vaste geschilderde uitsnede verplaatst en niet langer uitgerekt of met de hele scheen gedraaid. Bind-pose-broekdelen onder de heup zijn uit de romp verwijderd om dubbele benen te voorkomen. Kleine begrensde uitsneden vervangen grote volledige canvassen voor iedere beenlaag.

Native Canvas-renders gebruiken de productie-assets en rig: 24 klasse/richtingcombinaties, twaalf uitrustingscombinaties en 48 loopfasen van de Elementalist in acht richtingen. De productie-loader en renderer hebben ook zes aanzichten met NPC’s, gesloten geschilderde deuren en wilde regio’s gerenderd. Kaartvoegen en zichtbare loopvloeren zijn op de werkelijke productieposities bekeken. Artprompts staan in `assets/V872-ART-PROMPTS.json` en `assets/V872-DOOR-PROMPT.json`; de bijgewerkte rig in `assets/painted/hero-classes-v872.json`.

Loreparagrafen gebruiken donkere inkt op perkament. De doelkaart gebruikt lichte tekst op een vaste donkere achtergrond. De berekende contrastverhoudingen van de CSS-basiskleuren zijn respectievelijk 6,58:1 en 8,41:1.

## Grenzen

Native Canvas- en DOM-testmodellen controleren geen echte browserlayout, browser-FPS, hoorbare audio, tv/gamepad of twee fysieke Xboxes met Edge. Een lokale Playwrightbrowser is niet beschikbaar en dit statische project heeft geen compatibele managed browserpreview. Er wordt dus geen nieuwe gemeten browserprestatie beloofd. De lagere rig-geheugenlast volgt uit kleinere bronuitsneden; dit is geen gemeten FPS-winst.

De bot simuleert snelle keuzes en slaat leestijd over; zijn tijden zijn geen belofte over menselijke speelduur. Een menselijk vervolgtest met bestaande gear blijft waardevol voor de nieuwe late schadecurve. De bestaande ChatGPT-testsite is niet bijgewerkt. Deze release wordt als zelfstandige bron-ZIP geleverd voor de eigen publicatie van de gebruiker.
