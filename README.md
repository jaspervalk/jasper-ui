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
2. `npm run build` schrijft de JSON naar `docs/r/`.
3. Commit en push. GitHub Pages serveert `docs/` vanaf de branch `main`.

## Herkomst

De kleurwaarden van `chart-thema` komen uit Bklit UI (MIT, © Matt Litherland).
