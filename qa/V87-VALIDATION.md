# v8.7.0 — verificatie

`npm test` is voltooid met **352 gerichte controles**, drie complete campagne-runs en vijf endgame-combinaties. `npm run site:build` en `git diff --check` slagen. De runtime-dependency-audit meldt geen bekende kwetsbaarheden.

## Campagne en uitdaging

De bot gebruikt gewone beweging, casts, ontwijkingen, betaalde winkel-/forge-acties en verdiende gear. Hij krijgt geen extra stats, gratis aankopen of gedwongen kills. Hij maakt bewuste buildkeuzes en leest waarschuwingen; dit is een regressiecontrole en voorspelt niet hoe makkelijk een beginnende speler het vindt.

| Run | Alle 24 hoofdstukken | Speltijd | Checkpoint-herstarts |
| --- | --- | --- | --- |
| Getij, seed 48 | Voltooid | 822 s | 0 |
| Storm, seed 209 | Voltooid | 972 s | 1 |
| Zon, seed 815 | Voltooid | 1024 s | 2 |

De drie endgame-arena’s op tier 1 en Dijkbreker op tiers 2 en 3 zijn voltooid. Hun aanvallen werken, beloningen worden betaald en kills geven geen reguliere loot. De gewone campagnebalans en zeldzame dropkansen zijn niet verlaagd. Vaste winkelmeesterwerken zijn sterker én duurder gemaakt.

## Loopruimte en kaart

- Getijdenkade heeft twee aansluitende geschilderde kaartdelen. Milo opent een fysieke poort; lopen en dashen blokkeren vóór opening en passeren na opening. De tuin blijft toegankelijk na opslaan en herstellen. Schrootvondsten zijn eenmalig.
- Vrijhaven en de Groene Corridor meten 2688 × 1792, 40% groter in beide richtingen. NPC’s staan meer dan 225 wereldpixels van de andere NPC’s, handelaren, poorten en kisten in deze twee steden. Alle NPC’s zijn met gewone acht-richtingenbeweging benaderd, met F geopend en weer verlaten.
- De drie verkenningspoorten van Vrijhaven zijn apart bereikbaar; het atelier behoudt zijn questslot.
- De zichtbare ramp, traplandingen en noordwestelijke terrasroute van de Groene Corridor zijn in beide richtingen belopen. Water en bloembedden behouden hun blokkade.
- Acht handelsgebieden zijn op hun verbonden loopvloer gecontroleerd. Onderstation heeft drie kleine geïsoleerde rastercellen aan een rand, geen afgesloten hoofdroute of NPC-plein.
- Productierenders met het echte artwork zijn op 1920 × 1280 gecontroleerd, inclusief de tuinpoort, de tuin en de grotere steden. Dit zijn native Canvas-renders, geen browser-/console-screenshots.

## LAN en controller

Veertien LAN-controles dekken twee eigen helden, schaling, persoonlijke loot, gedeelde XP/schroot, beide reistemmen, schade tijdens menu’s, reanimatie, checkpoints, reconnect, endgame en de finale. Twee echte WebSocket-clients verbinden met de HTTP-server en ontvangen afzonderlijke snapshots. Shutdown schrijft een volledig checkpoint via tijdelijke file + atomische vervanging; een nieuwe server herstelt beide helden. Netwerkinvoer kan geen positie of schade verzinnen. Skillslots zijn begrensd en hun gewone cooldowns blijven gelden.

Drie controles dekken interpolatie zonder lokale gevechtssimulatie. Acht controllercontroles dekken beide triggers, zes slots, analoge beweging, dode zones, gericht mikken, knopherhaling, veilige release na focus-/menuwissel en een menu-alternatief voor Xbox. De echte `main.js`-invoerloop is daarnaast in een DOM-model getest voor beweging, schieten, rugzak, sellselectie, instellingen en loskoppelen. De LAN-lobby en Milo’s poort zijn ook via die echte menu-entrypoints bediend.

## Beeld en grenzen

Zeven rendercontroles dekken pixelbudgetten, cachebegrenzing, herstel van automatische kwaliteit bij stabiele 60 Hz, hogere desktopkwaliteit, cameraafstand, mikcoördinaten en camera-overgangen van grote kaarten naar kleinere arena’s.

**Nog handmatig testen:** fysieke gamepad en tv, twee Xboxes met Edge, twee afzonderlijke computers op een thuisnetwerk, werkelijke browser-FPS/latency en hoorbaar geluid. Er is hier geen browsermeting die een bepaalde FPS of consolecompatibiliteit bewijst. Audio is op zijn graph en scheduling gecontroleerd. Zie `CONTROLLER.md` en `LAN-START.md` voor de praktische teststappen.
