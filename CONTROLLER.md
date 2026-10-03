# Controller — solo en LAN

Bij **Instellingen & controller** op het titelbeeld, of Instellingen in het pauzemenu, kies je **Automatisch**, **Controller** of **Toetsenbord & muis**. Automatisch volgt het laatst gebruikte invoerapparaat. Een aangesloten controller wordt soms pas zichtbaar nadat je een knop hebt ingedrukt. Laat de knop daarna los. De browser moet een standaard gamepadindeling aanbieden.

| Knop | Actie |
| --- | --- |
| Linker stick | Bewegen; zachte uitslag loopt langzamer |
| Rechter stick | Zelf richten; meer uitslag plaatst de cursor verder weg |
| RT / LT vasthouden | Toegewezen hoofdaanval / rechter ability |
| A | Interactie; bevestigt ook een reisverzoek van je LAN-partner |
| B | Ontwijken in je looprichting |
| X / Y | Verband / kernpuls |
| RB | Antidotum |
| D-pad omhoog / rechts / omlaag / links | Skillslot 1 / 2 / 3 / 4 |
| LB + D-pad omhoog / rechts | Skillslot 5 / 6 |
| Linker / rechter stick indrukken | Rugzak / vaardigheden |
| LB + A | Wereldkaart |
| LB + D-pad omlaag / links | Dieren een doel geven / gebiedstekst in- of uitklappen |
| Menu of LB + RB | Pauzemenu |

Slots houden dezelfde spreuken als toetsen 1–6; wijzig ze in het vaardighedenmenu. Triggers veranderen je hoofdaanval niet. Schietspreuken blijven gericht op de gekozen richting. Gebiedsspreuken gebruiken de cursorpositie. Een losgelaten richtstick behoudt de laatste richting en afstand.

**Menu’s:** D-pad of linker stick kiest een knop. A bevestigt; B gaat terug als dat menu gesloten mag worden. Links/rechts wijzigt een keuzelijst of schuif. Omhoog/omlaag gaat verder naar het volgende bedieningselement. De rechter stick scrollt. De gouden focusrand toont je selectie. Alle rugzakslots, shopselecties, forge-opties, skillbindings, quests en reiskeuzes zijn met deze bediening bereikbaar. Een lootkeuze of doodscherm sluit je via zijn actieknoppen.

De dode zone bij Instellingen voorkomt drift; standaard is deze 18%, instelbaar van 10–35%. Bij loskoppelen stopt de invoer en opent het pauzemenu. In LAN speelt je partner verder en blijft je held kwetsbaar. Na menu’s, focusverlies of opnieuw aansluiten moet je ingedrukte knoppen eerst loslaten.

## Twee Xboxes met Edge testen

1. Start `start-lan.bat` of `npm run lan` op een computer die aan blijft. Die computer host de expeditie; je hoeft er zelf niet op te spelen.
2. Open op beide Xboxes in Edge de **lokale IP-link** die de server toont, bijvoorbeeld `http://192.168.1.20:8080/?lan=1`. Iedereen moet op hetzelfde lokale netwerk zitten. `localhost` op een Xbox verwijst naar die Xbox en is dus de verkeerde link.
3. Schakel Edge van browser-/muisbediening naar **gamecontrols**. Microsoft beschrijft het ingedrukt houden van Menu om tussen muis en gamepad te wisselen. Sommige versies tonen de optie via het controllericoon. Klik vervolgens terug in de spelpagina en druk kort op een controllerknop. Gebruik in het spel **LB + RB** voor het menu en **LB + A** voor de kaart; zo ben je niet afhankelijk van de door Edge gebruikte Menu/View-knoppen.
4. Kies in het LAN-menu een **roepnaam uit de keuzelijst** en een speelstijl. Een eigen getypte naam is optioneel. Kies Verbind en daarna Klaar. Als beide roepnamen hetzelfde zijn, krijgt de tweede een nummer.
5. Controleer eerst in de veilige post: lopen/richten, rugzak en vaardigheden openen, menu’s bedienen, reiskeuze bevestigen en loskoppelen/herverbinden. Controleer daarna in de eerste arena beide triggers, slots, ontwijken en verband.

De implementatie is getest met gesimuleerde standaard gamepads en twee echte WebSocket-clients, **niet met fysieke Xboxes, controllers of een tv**. Edge-versies kunnen verschillen in gamepadtoegang, paginafocus en browserknoppen. De pagina toont een melding wanneer de browser geen standaard controller beschikbaar stelt. De lokale server gebruikt HTTP; browsers die op dit adres geen gamepadtoegang geven hebben aanvullende browser-/HTTPS-configuratie nodig. Deze download bevat geen automatische certificaatinstallatie.

Deze LAN-versie vraagt geen gameaccount, Firebase, betaalde hosting of cloudgaming-abonnement. Alleen de computer met Node.js en twee browsers communiceren over je eigen netwerk.

Bronnen voor browsergedrag: [Microsoft — Edge op Xbox](https://www.microsoft.com/en-us/edge/learning-center/how-to-use-microsoft-edge-on-xbox), [MDN — getGamepads](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getGamepads).
