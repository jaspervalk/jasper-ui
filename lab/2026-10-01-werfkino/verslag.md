# Verslag: Werfkino (1-10-2026)

Eerste run van `/lab`: een landingspagina voor een verzonnen filmfestival, in de stijl van gsap.com/showcase. Drie
agents `ui` bouwden tegelijk elk één richting met een eigen prompt (`prompts/`); een vierde agent beoordeelde de drie
zonder de prompts te kennen. Model: Claude Opus 5.5.

## De drie richtingen

| Variant | In één zin | Beweging |
| --- | --- | --- |
| Redactioneel | Een filmtijdschrift op warm papier: Instrument Serif, aftiteling, een doorsnede van Hal 4. | Kop regel voor regel; programma vastgezet, het grote nummer bladert mee. |
| Nacht | De hal 's avonds: zwart, staal en natriumoranje, Archivo smal. | Het doek gaat open bij scrollen; het programma schuift als een baan voorbij. |
| Affiche | Een festivalaffiche: reuzenletters in signaalrood, Big Shoulders. | Letters komen uit hun masker; de film waar je bent licht op. |

## Toetsen

- Typecheck groen; `npm test` 48 van 48 (landingen in neutraal licht en donker, met axe en de zichtbaarheidscheck
  onder "beweging beperken").
- `lab-beelden.mjs`: geen fouten in de console op het bewegende pad. Contrast AA overal, ook gemeten op het oranje doek
  van Nacht.
- Geen horizontale overloop op 375 px.

## Beoordeling (blind, impeccable)

| Variant | Score | Sterk | Zwak |
| --- | --- | --- | --- |
| Redactioneel | 28/40 | Hal 4 als precieze doorsnede; tickets kiezen werkt het best (prijs in de knop). | Bekende redactionele stijl, voelt literair in plaats van staal en zout; programma kost ongeveer acht schermen scrollen. |
| Nacht | 26/40 | De enige beweging met een verhaal (het doek); elke film een eigen lijntekening; de dagen op een tijdas. | Zwart met oranje gloed is een bekende bioscoopreflex; de horizontale baan neemt de scroll over; manifestkop staat ná de tekst. |
| Affiche | 25/40 | Beste eerste scherm en beste toon; beweging licht en nuttig, scroll blijft van jou. | Tickets kopen werkt niet ("Kies" doet niets); dunste beeld, prijskaarten in SaaS-stijl. |

Volgens de beoordelaar doet **Nacht** het best wat de brief vraagt. Lenen: uit Affiche de vaste koopknop op mobiel, de
grote datumcijfers en het oplichtende programma; uit Redactioneel de prijs in de knop en index-links.

## Wat deze run leerde over de werkwijze

- Eén agent per richting gaf drie echt verschillende pagina's; de gedeelde `inhoud.ts` maakte ze eerlijk vergelijkbaar.
- De voorbeeldstrook van de werkbank kost 77 px op een telefoon en duwt de koopknop daar net onder de rand. In een
  template valt die strook weg.

## Keuze van Jasper

Nog open.
