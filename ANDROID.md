# Android in de browser — v8.8.1

Publiceer dezelfde spelmap op GitHub Pages. Je telefoon opent de HTTPS-link. Android wordt meteen herkend, voordat je iets aanraakt; je hoeft geen besturing te kiezen of iets te installeren. `npm run site:build` verzamelt alle benodigde bestanden in `dist/`. Publiceer de inhoud van die map. Relatieve paden werken ook bij een repository-URL zoals `/gouden-horizon/`.

## Bediening

| Knop | Actie |
| --- | --- |
| Linker stick | Bewegen; verder van het midden is sneller |
| Aanvalsknop rechtsonder | Vasthouden schiet je toegewezen hoofdaanval en richt vanzelf op een nabije vijand |
| Zes spreukslots, drie links en drie rechts | Tik voor één automatisch gerichte cast, of sleep vanaf het slot en laat los om zelf te richten |
| Rechter ability naast de richtstick | De spreuk die je als rechter aanval hebt ingesteld; ook met slepen te richten |
| Ontwijken | Gebruikt één van je twee bestaande ontwijkladingen |
| Verband / antidotum | Dezelfde voorraad en cooldowns als op desktop |
| Kernpuls | Alleen beschikbaar met volle lading en zonder cooldown |
| Interactie in het veld | De aangegeven NPC, doorgang, kalibratie of vondst gebruiken |
| Kaart / spreuken / rugzak / pauze | Dezelfde menu's als desktop |
| Dierenknop | Geef levende dieren een doel in je huidige schietrichting |
| Volledig scherm | Verbergt browserbalken als de browser dit ondersteunt |

Je kunt de bewegingsstick blijven vasthouden terwijl een tweede vinger een aanval richt. Een geannuleerde aanraking cast niets. Het openen van een menu, draaien van de telefoon of verlaten van het tabblad laat alle vastgehouden besturing los.

Een tik op een spreuk gebruikt de bestaande mobiele hulp bij richten op nabije vijanden. Houd de grote aanvalsknop vast voor je automatisch gerichte hoofdaanval. Je hoeft geen rechter stick te bedienen.

Sleep vanaf een spreukslot om die ene cast zelf te richten. Tijdens het slepen verschijnt het richtpunt; loslaten cast één keer. De volgende tik richt weer automatisch. Slepen op de gewone aanvalsknop verandert het automatische richten niet. Mana, cooldowns en veilige zones blijven gelden.

Wijs links, rechts en de zes slots toe in het spreukenmenu bovenaan. Een leeg slot opent dat menu. Leer nieuwe aanvallen met je levelpunten of bij de spreukenhandelaar. De toegewezen hoofdaanval blijft onafhankelijk van een gecast slot.

## Scherm en laden

Rechtop is de gewone telefoonindeling: drie spreuken langs de linkerrand en drie langs de rechterrand, met het midden vrij voor de held. Liggend blijven de knoppen en menu's ook beschikbaar. Het spel vraagt niet om je telefoon te draaien. Het gebiedspaneel begint klein en is uit te klappen. In Instellingen kun je Aanraakbediening kiezen als automatische herkenning niet passend is. Muis of toetsenbord schakelt bij Automatisch terug naar desktop; een controller behoudt zijn eigen bediening.

Bij openen worden alle gebiedsbestanden geladen. Hun compacte bytes blijven beschikbaar; alleen de huidige en enkele recente kaarten worden uitgepakt voor tekenen. De laadstatus toont de voortgang. Bij reizen kan even “Gebied laden” verschijnen tijdens het uitpakken; er wordt dan geen nieuwe kaart gedownload. Wacht bij de eerste start tot de knop Naar de horizon beschikbaar is. Houd het tabblad open om de geladen campagne te bewaren. Opslaan gebruikt de browseropslag van die site.

Dit is een browsergame, geen offline-installatie. De eerste download vraagt een verbinding. Andere browsertabbladen en een andere site-URL delen je solo-save niet.

## LAN

Een telefoon kan ook de LAN-link van de hostcomputer openen. Alleen de hostcomputer draait Node.js. Beide spelers hebben eigen camera en uitrusting; de vijanden schalen mee. GitHub Pages zelf biedt geen LAN-server. Zie LAN-START.md.

## Controle

Layout, echte browser-pointerevents, gelijktijdig bewegen/casten, alle zes spellslots, aankoopmelding en itemdetails zijn gecontroleerd in Chromium met Android-achtige viewport, hoge schermdichtheid en touchsimulatie. Er was geen fysiek Android-apparaat beschikbaar om apparaat-FPS, browserbalken of audio via speakers te meten. Zie qa/V881-VALIDATION.md.
