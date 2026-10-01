# Portefeuille-dashboard

- **Datum:** 1 oktober 2026
- **Model:** Claude Opus 5.5 (`claude-opus-5-5`), als subagent `ui`
- **Prompt:** "Het eerste experiment in het lab van de werkbank. Onderwerp: dashboard voor een persoonlijke
  beleggingsportefeuille. Maak drie varianten als volledige pagina, elk in een eigen richting: 1. Rustig,
  2. Uitgesproken, 3. Compact."

## Bronnen

- Skill `ui` (stap 0 tot en met 4, werkwijze van het lab in `lab.md`) en het gedeelde geheugen
  (`~/.claude/agent-memory/ui/MEMORY.md`): getinte vlakken in twee of drie niveaus, één accent, één groot kerncijfer
  per pagina, gedempt groen en rood, status als tekst, aandachtsrijen met zachte tint en smalle zijstreep.
- impeccable, register *product*: rust, voorspelbare rasters, geen landingspagina-effecten.
- Componenten: de Bklit-lijngrafiek uit `src/components/charts/` (`LineChart`, `Line`, `Grid`, `XAxis`,
  `ChartTooltip`) en `Vergelijk` uit `@/werkbank/Vergelijk`. Geen 21st.dev (openbare repo), geen nieuwe
  Bklit-grafieken: staven en verdeling zijn gewone HTML, zodat ze tekst en tabelsemantiek houden.
- Structuur en tokens van de cockpit (`invest_helper/web`) bekeken, geen data.

## Voorbeelddata

Alles in `voorbeelddata.ts` is verzonnen: acht fondsen die niet bestaan (Noordkaap, Lindeboom, Polder, Heidebrand,
Zilverreiger, Kustlicht, Duinroos, plus een spaarrekening), bedragen die optellen tot € 184.320 en een waardereeks
uit een vaste toevalsgenerator. Totalen, rendementen en aandachtspunten worden uit die posities berekend, zodat de
drie varianten dezelfde getallen tonen.

## Scène

Een particuliere belegger kijkt op zondagochtend op zijn laptop of zijn portefeuille nog op koers ligt en of er iets
te doen valt. Hij beslist hooguit een paar keer per jaar. Licht en donker komen uit de werkbank; elke variant moet in
beide werken, in elke huisstijl.

## Varianten

| Variant | Richting in één zin |
| --- | --- |
| Rustig | Eén groot kerncijfer, veel lucht en één accent: je ziet in drie seconden of het goed gaat en wat aandacht vraagt. |
| Uitgesproken | Het accent draagt de bovenkant van de pagina en elke sectie opent met een zin, met staven die laten zien wat het rendement maakte. |
| Compact | Alles op één scherm voor wie wil vergelijken en sorteren: dichte tabel, kleine panelen, kleur alleen voor plus, min en aandacht. |

### Rustig

- Kleur: *restrained*. Accent (`primary`) alleen voor de grafieklijn en de gekozen periode. Plus en min in
  `positive` en `negative`. Aandacht: `warning-soft` met een zijstreep van 2 px in `warning`.
- Vlakken: pagina `background`, grafiek op `card`, balkjes op `muted`.
- Type: kerncijfer `font-mono` 48 px; paginatitel 20 px; sectiekoppen 16 px; tabel 14 px met tabulaire cijfers.

```
Portefeuille                                      Bijgewerkt do 1 okt 2026, 17:35
Totale waarde
€ 184.320
Dit jaar +€ 7.922 (+4,5%)   Vandaag −€ 574 (−0,3%)   Aandacht 2 soorten buiten doel
┌ Waardeverloop ──────────────────────────── Dit jaar · 1 jaar · 3 jaar ┐
│ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │
│ Laagste € 167.122 (12 feb 2026)   Hoogste € 185.717 (17 sep 2026)       │
└────────────────────────────────────────────────────────────────────────┘
Aandacht                         Verdeling
▌Aandelen boven doel             Aandelen    ███████▌░░  60,8%  55%  +5,8
▌Obligaties onder doel           Obligaties  ████▌░░░░░  30,2%  35%  −4,8
                                 Vastgoed / Liquiditeit …
Posities (tabel, totaalrij)
Recent (vijf regels)
```

### Uitgesproken

- Kleur: *committed*. `primary` vult de bovenband (zin, kerncijfer, grafiek in `primary-foreground`). Daaronder
  wisselen `background` en `muted` per sectie. Bijdrage per fonds als staven in `positive` en `negative`; verdeling
  als twee gestapelde balken (nu en doel) in `chart-1…4`.
- Type: `font-display` voor kerncijfer (96 px) en zinnen (24 tot 36 px), tabulaire cijfers. Tabel blijft sans.

```
████████████████████████████████████████████████████████████ primary
█ Portefeuille                     Bijgewerkt do 1 okt 2026  █
█ € 184.320                                                   █
█ +4,5% dit jaar: € 7.922 rendement, € 4.500 ingelegd.        █
█ ~~~~~~~~~~~~~~~~~~~ lijn ~~~~~~~~~~~~~~~~~  Dit jaar 1 jaar 3 jaar
████████████████████████████████████████████████████████████
Wat het rendement maakte
Noordkaap        |██████████████  +€ 6.002
Polder        ███|                −€ 654
Verdeling (muted)
Nu    [████████ Aandelen ████████|███ Obligaties ███|█|█]
Doel  [██████ Aandelen ██████|████ Obligaties ████|█|█]
01  Aandelen staan 5,8 procentpunt boven doel.
02  Obligaties staan 4,8 procentpunt onder doel.
Posities                          Recent
```

### Compact

- Kleur: *restrained*, nog stiller. Accent voor gekozen periode, filter en sortering. Aandacht als getinte rij met
  zijstreep in de verdelingstabel.
- Vlakken: `background`, panelen op `card` met haarlijn. Kopregels bewust niet op `muted`: gedempte tekst op
  `muted` haalt in neutraal licht geen AA (4,3:1).
- Type: basis 13 px, labels 12 px, paneelkoppen 14 px, paginatitel 16 px, kerncijfer `font-mono` 24 px. Alles
  tabulair. Sorteren per kolom (`aria-sort`), filter per soort met een totaal van de selectie.

```
Portefeuille  € 184.320  Vandaag −€ 574 −0,3%  Dit jaar +€ 7.922 +4,5%  Sinds start …  Ingelegd …  Liquiditeit …
┌ Posities (8)    Alle · Aandelen · Obligaties · Overig ┐ ┌ Waardeverloop  Dit jaar 1 jaar 3 j ┐
│ Fonds Soort Aantal Koers Waarde↓ Weging Resultaat …    │ │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │
│ Totaal (of totaal van de selectie)                      │ ├ Verdeling      grens 3 procentpunt ┤
├ Recent ─────────────────────────────────────────────────┤ │▌Aandelen 60,8 55,0 +5,8 Boven doel│
│ 28 sep  Dividend  Lindeboom Duurzaam Europa  +€ 212,00 │ │ …                                 │
└─────────────────────────────────────────────────────────┘ └───────────────────────────────────┘
```

## Gemeenschappelijk

- `voorbeelddata.ts`: de verzonnen data en alle afgeleide getallen.
- `gedeeld.tsx`: opmaak (nl-NL, echt minteken) en `Waardeverloop`, de Bklit-lijngrafiek met een verschoven reeks
  (Bklit begint de y-as anders bij 0), een bijschrift met laagste en hoogste punt, en geen onthulling bij
  `prefers-reduced-motion`.
- `src/components/charts/chart-formatters.ts` staat op `nl-NL`, zodat de as "1 okt" zegt in plaats van "Oct 1".

## Na de critique (zelfde dag)

Hersteld omdat het fout of inconsistent was, niet omdat het smaak is:

- Standaardperiode van de grafiek is nu "Dit jaar" (sinds 1 januari), zodat de lijn bij het kerncijfer past.
- Rustig: onder het kerncijfer een verwijzing "2 soorten buiten doel" naar Aandacht, en een lagere grafiek op brede
  schermen (4:1), zodat Aandacht hoger komt.
- Compact: geen NaN meer bij een lege selectie; kolommen heten "Dit jaar €" en "Dit jaar %"; op mobiel alleen Fonds,
  Waarde en Dit jaar %, de rest vanaf 640 px; koppen 16 en 14 px voor meer hiërarchie.

## Keuze van Jasper

Nog open.
