# Samen spelen — gratis LAN-co-op

1. Pak de volledige ZIP uit op één computer. Installeer **Node.js 22 of nieuwer** als je dat nog niet hebt.
2. Windows: dubbelklik `start-lan.bat`. Mac/Linux: open een terminal in de map en voer `bash start-lan.sh` uit. Of gebruik `npm ci` en daarna `npm run lan`.
3. De server toont twee links: `localhost` voor jezelf en het lokale IP-adres voor je partner. Beide computers moeten op hetzelfde wifi- of LAN-netwerk zitten. De tweede computer heeft alleen een moderne browser nodig.
4. Open de link, vul een naam in, kies een speelstijl en klik **Verbind met de expeditie**. Beide spelers klikken **Klaar**.

De eerste start haalt één kleine netwerkbibliotheek op. Daarna kan LAN zonder internet. Er zijn geen accounts, cloudserver of abonnementen nodig. Als Windows om netwerktoegang vraagt, sta je eigen privénetwerk toe. Gebruik je gastwifi, dan kan dat de verbinding tussen computers blokkeren.

Iedereen heeft een eigen camera, uitrusting, rugzak en spreuken. Jullie blijven in hetzelfde actieve gebied. Een portal of kaartreis vraagt de tweede speler om **Reis mee**; na 20 seconden vervalt een onbevestigd verzoek. Vijanden hebben 70% meer leven, 8% meer schade en golven krijgen ongeveer 30% extra gewone vijanden. XP en schroot zijn gedeeld. Gewone drops worden om de beurt persoonlijk toegewezen; beide spelers krijgen een eigen baasvondst en kistkeuze.

Een menu pauzeert je partner niet en beschermt je niet tegen schade. Gebruik de veilige handelspost om rustig te bouwen. Een gevallen partner kun je met **F** dichtbij overeind helpen: één verband, twee seconden stilstaan, 25% leven en de gewone verbandcooldown. Beiden gevallen? Herstart samen vanaf de gebiedsingang; hiermee draai je ook buit van die mislukte poging terug.

De server pauzeert bij een verbroken verbinding. Vernieuw **dezelfde tab** of klik **Opnieuw verbinden** om met je sessiecode verder te gaan. Elke tien seconden en bij normaal afsluiten wordt de LAN-expeditie lokaal in `.lan-saves` opgeslagen. Herstarten hervat die expeditie zodra beide oorspronkelijke tabs verbinden. Solo-saves blijven apart in je browser.

Een nieuwe LAN-expeditie: sluit de server en verwijder de map `.lan-saves`, of start met `LAN_NEW=1 npm run lan` (Mac/Linux) / `set LAN_NEW=1` en daarna `npm run lan` (Windows). Als je beide oorspronkelijke tabs hebt gesloten en de sessiecodes kwijt bent, start je op deze manier opnieuw.

## GitHub Pages / online solo

Alle bestanden in `dist/` na `npm run site:build` zijn geschikt voor GitHub Pages. Je kunt ook de bronmap gebruiken; `.nojekyll` is aanwezig. GitHub Pages serveert het solospel. Voor LAN start je de lokale Node-server zoals hierboven. De knop **Samen spelen · LAN** op een gewone statische site legt dit uit.

## Getijdenkade v8.7

Het eerste handelsgebied is 40% groter in iedere richting en heeft een aansluitende tuinwijk. Praat met **Milo · Nevenroutes** en kies **Open de tuinpoort**. Daarna wandel je via de oostelijke weg door de poort. De tuin bevat twee kleine eenmalige schrootvondsten. De verhaalpoorten naar arena’s en meetstations behouden hun volgorde.

## Ruimere steden en desktopbeeld

**Vrijhaven**, de eerste handelsstad na de getijdenarena’s, en de **Groene Corridor** zijn nu 40% groter in iedere richting. NPC’s staan verder van marktkramen en doorgangen; verkenningspoorten blijven in de verhaalvolgorde beschikbaar. Het tegelpad naast de middentrap in de Groene Corridor is doorlopend gemaakt.

Via Instellingen → Beeldkwaliteit → **Hoog** krijg je meer renderdetail op grote schermen. Cameraafstand → **Dichterbij** toont personages en artwork 20% groter. Automatische kwaliteit past de interne tekenresolutie aan en herstelt deze na langdurig soepel spel.

**Controller/Xbox:** controllerbediening is toegevoegd voor gevechten, de zes skillslots en alle menu’s. Kies Automatisch of Controller bij Instellingen. Zie [CONTROLLER.md](CONTROLLER.md) voor de knoppen en console-teststappen. De LAN-server blijft op één computer draaien. Twee Xboxes met Edge zijn nog niet op fysieke consoles getest.
