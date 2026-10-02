# Richting: Redactioneel

**In één zin:** Werfkino als een filmtijdschrift op warm papier: schreef, lucht, aftiteling-typografie, en een
programma dat je film voor film doorbladert.

**Referentie:** A24 (a24.raviklaassens.com). We lenen de aftiteling (kleine kapitalen, fijne lijnen) en het grote
nummer dat meeloopt met de film waar je bent.

**Palet** (eigen merktokens in `merk.css`, AA voor alle tekst; controleer zelf):
- papier, warm gebroken wit (rond `#f2efe8`); inkt, bijna zwart (rond `#171512`);
- gedempte inkt voor metadata (rond `#5e584f`, minstens 4,5:1 op het papier);
- één accent: diep bioscooprood (rond `#9a2a1e`), alleen voor de knop "Koop tickets" en één detail per sectie.
- Eén kleurschema; de pagina hoeft niet op licht/donker van de werkbank te reageren.

**Letters:** Instrument Serif voor koppen en de grote nummers (`import "@fontsource/instrument-serif"`, ook de cursief
`@fontsource/instrument-serif/400-italic.css`); Inter Variable voor lopende tekst en kleine kapitalen
(`import "@fontsource-variable/inter"`, met `font-variant-caps: all-small-caps` of uppercase plus tracking).

**Beweging** (twee technieken, niet meer):
1. De openingskop komt regel voor regel op (SplitText op de h1, `mask: "lines"`).
2. Programma: een vastgezette sectie (ScrollTrigger `pin`) waarin per film het grote nummer (01 tot 06) en de
   aftiteling wisselen terwijl je scrolt. Op 375 px geen pin: dan een gewone lijst onder elkaar.

**Niet:** geen marquee, geen horizontale scroll, geen parallax op alles, geen donkere achtergrond, geen gradients.
