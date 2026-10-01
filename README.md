# jasper-ui

Een eigen [shadcn-register](https://ui.shadcn.com/docs/registry): componenten en thema's die je in meerdere projecten
gebruikt. Elk project krijgt een eigen kopie van de broncode, die je daar mag aanpassen.

## Gebruiken in een project

Het project heeft Tailwind 4 en een `components.json` nodig (`npx shadcn@latest init`). Zet het register erin:

```json
"registries": {
  "@jasper": "https://jaspervalk.github.io/jasper-ui/r/{name}.json"
}
```

Voeg daarna een onderdeel toe:

```bash
npx shadcn@latest add @jasper/chart-thema
```

Een nieuwere versie ophalen: dezelfde opdracht nog eens, en kies bij een bestaand bestand voor overschrijven.

## Wat erin zit

| Naam | Soort | Wat |
| --- | --- | --- |
| `chart-thema` | thema | De kleuren van de [Bklit-grafieken](https://github.com/bklit/bklit-ui), licht en donker, met een kloppende koppeling naar Tailwind 4. Het register van Bklit zelf schrijft `var(----chart-…)` met vier streepjes, waardoor de kleuren leeg blijven. Voeg dit toe na een Bklit-grafiek. |

Donkere kleuren komen, zoals altijd bij shadcn, onder `.dark`. Schakelt een project met iets anders (de cockpit van het
beleggingsregister gebruikt `data-theme="dark"`), zet het blok dan onder die selector.

## Een onderdeel toevoegen

1. Zet de bestanden in `registry/<naam>/` en voeg een item toe aan `registry.json`
   ([schema](https://ui.shadcn.com/docs/registry/registry-json)). Gebruik bij voorkeur de standaardtokens van shadcn
   (`bg-card`, `text-muted-foreground`, `border-border`), zodat het onderdeel in elk project in de eigen kleuren valt.
2. Maak een story in `catalogus/<naam>.stories.tsx`.
3. `npm test`, daarna `npm run build`: de JSON gaat naar `docs/r/`, de werkbank naar `docs/storybook/`.
4. Commit en push. GitHub Pages serveert `docs/` vanaf de branch `main`.

## Werkbank

Een [Storybook](https://storybook.js.org/) om UI te bekijken en te testen, openbaar op
[jaspervalk.github.io/jasper-ui/storybook/](https://jaspervalk.github.io/jasper-ui/storybook/).

| Opdracht | Wat |
| --- | --- |
| `npm run dev` | Storybook op poort 6006, met de MCP-server op `/mcp` (zie `.mcp.json`). |
| `npm test` | Elke story in elke huisstijl, licht en donker, in Chromium, met axe (ook contrast). |
| `npm run typecheck` | TypeScript. |
| `npm run build` | Register naar `docs/r/`, werkbank naar `docs/storybook/`, en een controle dat er niets lokaals in staat. |

| Map | Wat |
| --- | --- |
| `catalogus/` | Een story per onderdeel van het register. |
| `lab/<datum>-<onderwerp>/` | Hele pagina's in twee of drie richtingen, met de prompt erbij en een story die ze naast elkaar zet. |
| `themes/` | Huisstijlen in de tokennamen van shadcn: `neutraal` (standaard van shadcn) en `cockpit`. |
| `src/styles/basis.css` | Tailwind 4 en de koppeling van de tokens. |
| `src/components/charts/` | Bklit-grafieken (MIT), toegevoegd met `shadcn add @bklit/…`. |

Wissel in de werkbalk van huisstijl, van licht naar donker, en van viewport (375, 768, 1440).

Twee mappen zijn alleen lokaal en staan in `.gitignore`: `proeftuin/` (componenten van Bklit of 21st.dev uitproberen
voordat ze een project in gaan; 21st.dev verbiedt herdistributie) en `themes/lokaal/` (huisstijlen die niet openbaar
zijn). Ze verschijnen bij `npm run dev` en `npm test`, nooit in de build.

## Herkomst

De kleurwaarden van `chart-thema` en de grafieken in `src/components/charts/` komen uit
[Bklit UI](https://github.com/bklit/bklit-ui) (MIT, © Matt Litherland). De licentietekst staat in
`src/components/charts/LICENSE`.
