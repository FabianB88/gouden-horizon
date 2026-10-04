# v8.8.0 — verificatie

Controle op 4 oktober 2026. De bestaande regressieset van 375 gerichte controles is geslaagd, inclusief drie gewonnen campagnes en vijf voltooide endgame-runs. De acht nieuwe Android-, uiterlijk- en aankoopgroepen slagen ook: samen 383 gerichte controles. Na de laatste aankoopwijzigingen zijn menu-, crafting-, dieren-, LAN- en aankoopscontroles opnieuw uitgevoerd. `npm run site:build` slaagt.

## Touch in een echte browser

`qa/android-browser-tests.mjs` serveert de productiebron onder `/horizon/`, met alleen QA-exports aan main.js toegevoegd tijdens die test. Dat controleert relatieve GitHub Pages-paden; die exports staan niet in de geleverde main.js.

Chromium is gestart met een Android-achtige context: touch ingeschakeld, mobiele viewport en devicePixelRatio 3. De proef gebruikt echte browser-pointerevents via het Chrome DevTools Protocol, met afzonderlijke vingers en pointer capture. Playwright `.tap()` wordt gebruikt voor menu's; muisklikken schakelen Automatisch terecht terug naar desktop.

Geslaagd:

- 844 × 390 en 640 × 360 liggend, 390 × 844 en 360 × 640 staand: beide sticks, zes spreukslots en vijf actieknoppen blijven binnen het scherm, zijn minstens 44 × 44 CSS-pixels en overlappen elkaar niet.
- De zes verschillende spreuken casten met tik of sleepsignaal terwijl de bewegingsstick ingedrukt blijft. Het loslaten van een spellvinger stopt de bewegingsvinger niet.
- De hoofdaanval richt handmatig; de toegewezen rechter ability heeft een eigen sleepsignaal. Annuleren laat controles los en cast niets.
- Iedere campagne- en nevengebiedtexture is aanwezig in de vooraf geladen kaartlijst. Reizen naar een arena en terug veroorzaakt geen nieuwe kaartdownload.
- Nieuwe expeditie met vrouwelijke Natuurhoeder, drie lorepagina's, aankoop van één verband, melding boven het shopmenu en correcte voorraad/betaling.
- Rugzakitem opent zijn eigen stats. Vergelijken & plaatsen opent de bestaande vergelijking; schakelen naar toetsenbord herstelt de desktop-UI.
- Geen JavaScript-pageerrors tijdens deze browserproef.

De test verwacht een geïnstalleerde Playwright en Chromium. Standaard gebruikt hij `playwright`; optioneel wijzen `PLAYWRIGHT_MODULE` en `CHROMIUM_EXECUTABLE` naar bestaande installaties. `ANDROID_SHOTS` bepaalt de screenshotmap. Deze optionele browsertest is geen runtime-afhankelijkheid en draait niet binnen `npm test`.

## Laden en geheugen

Alle unieke kaartbestanden worden vóór het spelen als compacte Blob-bytes opgehaald, met maximaal vier gelijktijdige verzoeken. Duplicaten delen dezelfde download. `MapTextures` deelt lopende decodes, beschermt de actieve kaart en beperkt de uitgepakte cache tot zes bestanden. Object-URL's worden na decode ingetrokken. Terug naar een geëvictte kaart decodeert dezelfde bewaarde bytes. De unitproef controleert deduplicatie, cacheverdringing en fouten; de browserproef controleert reizen zonder nieuwe HTTP-kaartverzoeken.

Kaartartwork behoudt zijn oorspronkelijke resolutie en wereldschaal. Menukaarten gebruiken aparte 512-pixel-thumbnails. Het aantal uitgepakte kaartbeelden is begrensd; het totale RAM- of FPS-verschil op een echte telefoon is niet gemeten. Sprites, rig- en rendercaches behouden hun bestaande begrenzingen.

## Uiterlijk, beweging en aankopen

Alle drie klassen hebben beide uiterlijken. Tests controleren dezelfde gameplaystats, opslag van de keuze en twee verschillende keuzes in een LAN-party. Native Canvas-renders tonen 48 klasse/uiterlijk/richting-combinaties met hoofdgear en een reeks front- en zijlooppassen. Voeten worden als vaste geschilderde uitsnede verplaatst; bovenbenen draaien beperkt zonder kniestrekking. De loopcyclus blijft gekoppeld aan afgelegde afstand. Dit is een gepolijste rig op geschilderde poses, geen nieuwe volledig handgetekende animatieset.

Aankoop-events ontstaan na geslaagde betaling, blijven persoonlijk in LAN en ontstaan niet bij onvoldoende geld. Betaalde LAN-acties wachten op de host; lokale voorspelling geeft geen dubbele koopmelding. Gratis questbeloningen geven geen betaalmelding. Training, smeden, spell- en itemaankopen behouden hun bestaande prijs- en levelregels.

## Grenzen

Er was geen fysiek Android-toestel beschikbaar. Apparaat-FPS, thermische belasting, browserbalken/rotatie op hardware en geluid via speakers zijn niet gemeten. De bestaande fysieke Xbox/Edge-test is ook niet uitgevoerd. De desktop- en netwerkregressies slagen, maar een menselijke vervolgronde op jouw eigen telefoon blijft nodig.

Deze release wordt als volledige bron-ZIP geleverd. De bestaande ChatGPT-testsite is niet gewijzigd; publiceer de bestanden op je eigen GitHub Pages.
