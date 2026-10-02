# Richting: Affiche

**In één zin:** Werfkino als een festivalaffiche die je kunt scrollen: reusachtige smalle letters in één felle kleur,
vlakken als drukwerk, en een programma dat oplicht waar je bent.

**Referentie:** Huy Phan (huyml.co). We lenen de reusachtige affichekop en de lijst waarin het actieve item oplicht
terwijl de rest terugtreedt.

**Palet** (eigen merktokens in `merk.css`, AA voor alle tekst; controleer zelf):
- grond, licht drukpapier (rond `#efece6`); inkt, zwart (rond `#121212`);
- affichekleur, signaalrood (rond `#d4351c`): voor de reuzenkop en grote vlakken. Rood op de grond haalt alleen
  3:1, dus alleen voor tekst van 24 px en groter of vet 19 px; kleine tekst op rood in de grondkleur of wit (controleer).
- teruggetreden tekst in de lijst blijft leesbaar: gedempte inkt (rond `#5c5852`, minstens 4,5:1), niet lichter.
- Eén kleurschema; de pagina hoeft niet op licht/donker van de werkbank te reageren.

**Letters:** Big Shoulders Display Variable voor de affichekop en koppen
(`import "@fontsource-variable/big-shoulders-display"`, familie `"Big Shoulders Display Variable"`); Inter Variable
voor lopende tekst (`import "@fontsource-variable/inter"`).

**Beweging** (twee technieken, niet meer):
1. De reuzenkop WERFKINO: letters komen bij het laden kort na elkaar omhoog uit hun masker (SplitText op de h1,
   `type: "chars"`, met een masker).
2. Programma als lijst van zes films; de film in het midden van het scherm licht op (inkt en rood), de rest treedt
   terug naar gedempte inkt (ScrollTrigger per rij, `onToggle`). Werkt ook op 375 px.

**Niet:** geen pin, geen horizontale scroll, geen schreef, geen schaduwen, geen afgeronde kaarten met rand.
