# v8.8.1 — automatische Android-bediening en portretstand

Controle op 4 oktober 2026. Deze correctie herstelt de eenvoudige mobiele aanvalsknop en behoudt het slepen vanaf spreukslots. De gevechtsregels, prijzen, mana, cooldowns en dropkansen zijn niet aangepast.

## Gedrag

- Android wordt direct herkend aan de user-agent; daarnaast blijft herkenning via de primaire coarse pointer beschikbaar. Automatisch is de standaard instelling. Expliciete toetsenbord- of controllerkeuzes blijven mogelijk.
- Aanval vasthouden gebruikt hetzelfde nabijste-vijanddoel als de eerdere mobiele versie. De knop is geen richtstick. Slepen op deze knop verandert het richten niet.
- Een tik op een spreukslot of rechter ability gebruikt automatische plaatsing. Slepen vanaf die knop toont een richtpunt; loslaten cast die ene spreuk handmatig. De volgende tik gebruikt weer automatisch richten.
- Rechtop staan slots 1–3 links en 4–6 rechts, met de held in het midden. De draaiaanwijzing is verwijderd. Liggend blijven twee aparte groepen bereikbaar.
- Iedere vinger behoudt zijn eigen control. Rotatie laat ingedrukte besturing los zodat er geen oude stickrichting blijft hangen. Lang indrukken op touch-spreuken opent geen desktop-rechtsklikmenu.

## Uitgevoerde controles

De 9 Android-/uiterlijk-/aankoopgroepen, 24 echte menu-entrypointgroepen in het DOM-model, 8 controllergroepen en 14 verhaal-/richtgroepen slagen: 55 gerichte checks. De automatische vijandkeuze geldt alleen voor mobiele bediening; de bestaande muis- en hotbar-richtregels worden door de verhaalchecks bevestigd. Static build slaagt.

De optionele `qa/android-browser-tests.mjs` draait de productiebron in Chromium onder `/horizon/`, met Android-user-agent, touch en schermdichtheid 3. Hij controleert automatische herkenning vóór de eerste aanraking, 390 × 844, 360 × 640 en 320 × 568 in portretstand en 640 × 360 en 844 × 390 liggend. Bewegingsstick, aanval en spell/actieknoppen passen binnen het scherm, zijn minstens 44 pixels en overlappen elkaar niet.

Met echte browser-pointerevents worden gelijktijdig lopen en alle zes spreuken, de rechter ability, automatisch aanvallen zonder richtstick, een handmatige spell-drag gevolgd door een automatisch gerichte tap, annuleren en rotatie gecontroleerd. De proef controleert ook een aankoopmelding, klikbare itemstats, terugkeer naar desktop en reizen zonder nieuwe kaartdownload. Geen JavaScript-pageerrors tijdens deze proef. Screenshots zijn bekeken op leesbaarheid en verdeling van de knoppen.

De vooraf geladen gebieden, hoofdgear/loopverbeteringen en man/vrouw-keuze uit v8.8.0 blijven opgenomen. De uitgebreide vorige regressieset en campagne-/endgame-runs staan in V88-VALIDATION.md; die zijn voor deze input/layoutcorrectie niet opnieuw gesimuleerd.

## Praktische grens

Dit is echte Chromium-touchsimulatie, geen meting op een fysiek Android-toestel. Apparaat-FPS, browserbalken en hoorbare audio op de telefoon zijn niet opnieuw gemeten. De bron-ZIP is bedoeld voor publicatie op de eigen GitHub Pages; de oude ChatGPT-testsite is niet gewijzigd.
