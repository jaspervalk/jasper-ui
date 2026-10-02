# Richting: Nacht

**In één zin:** Werfkino als de hal zelf, 's avonds: zwart, staal en één natriumoranje lamp, met een doek dat opengaat
terwijl je scrolt.

**Referentie:** Revelatio Studio (revelatio.studio). We lenen het kader dat bij scrollen uitgroeit tot het hele scherm,
en de grote statement-zin linksonder. Hun WebGL-beeldbehandeling niet.

**Palet** (eigen merktokens in `merk.css`, AA voor alle tekst; controleer zelf):
- nacht, bijna zwart (rond `#0d0d0c`); staal, een iets lichter vlak (rond `#1a1a18`);
- tekst, gebroken wit (rond `#ebe6dc`); gedempte tekst (rond `#a29c92`, minstens 4,5:1 op de nacht);
- één signaalkleur: natriumoranje (rond `#ff9a3c`), voor de knop en het licht in het doek.
- Eén kleurschema; de pagina hoeft niet op licht/donker van de werkbank te reageren.

**Letters:** Archivo Variable met breedte-as (`import "@fontsource-variable/archivo/wdth.css"`, familie
`"Archivo Variable"`): smal en zwaar voor koppen (`font-stretch` rond 62–75%), normaal voor tekst. Eén familie.

**Beweging** (twee technieken, niet meer):
1. "Het doek gaat open": in de opening staat een klein kader (het doek, een vlak met oranje licht en de titel); bij
   scrollen groeit het via `clip-path: inset(…)` tot het hele scherm (ScrollTrigger `pin` + `scrub`). Zonder beweging
   staat het doek meteen open.
2. Programma als horizontale baan: een vastgezette sectie waarin de zes films van rechts naar links schuiven terwijl
   je naar beneden scrolt. Op 375 px geen pin: dan gewoon onder elkaar.

**Niet:** geen schreef, geen marquee, geen letters die los rondvliegen, geen neon-gloed of glow-schaduwen, geen
gradients behalve het licht in het doek.
