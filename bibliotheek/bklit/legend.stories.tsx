import type { Meta, StoryObj } from "@storybook/react-vite";

import { Legend, LegendItem, LegendLabel, LegendMarker, LegendProgress, LegendValue } from "@/components/charts/legend";

import { Voorbeeld, beschrijving, bibliotheekDecorators, euro, procent } from "./gedeeld";

// Verzonnen: uitgaven per post in september tegen het budget (euro).
const posten = [
  { label: "Boodschappen", value: 412, maxValue: 500, color: "var(--chart-1)" },
  { label: "Energie", value: 138, maxValue: 160, color: "var(--chart-2)" },
  { label: "Vervoer", value: 96, maxValue: 200, color: "var(--chart-3)" },
  { label: "Uit eten", value: 121, maxValue: 150, color: "var(--chart-4)" },
];

const meta = {
  title: "Bibliotheek/Bklit/Legenda",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "legend",
          wat: "een lijst van reeksen met kleur, naam, waarde en eventueel een voortgangsbalk. Je bouwt elke regel zelf op uit kleine stukken (marker, label, waarde, balk).",
          waarvoor:
            "naast een taart, ring of lijn, als sleutel met getallen. Met `hoveredIndex` en `onHoverChange` licht de grafiek mee op als je een regel aanwijst. Met de voortgangsbalk ook los te gebruiken, zoals hier voor een budget.",
          beperkingen:
            "alleen `div`'s, geen lijst voor schermlezers, en aanwijzen werkt alleen met de muis. De voortgangsbalk had geen naam (axe: *aria-progressbar-name*); in onze kopie krijgt hij het label van de regel (`legend-progress.tsx`). De kleuren `--legend-…` zijn in de werkbank gekoppeld aan de huisstijl (`--card`, `--foreground`, `--muted`); Bklit levert vaste grijzen. Bij aanwijzen krijgt de regel `--muted` als achtergrond: zet waarden dan in `text-foreground`, want gedempte tekst haalt daarop geen 4,5:1.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Budget: Story = {
  name: "Met voortgangsbalk",
  render: () => (
    <Voorbeeld
      titel="Uitgaven tegen budget, september"
      uitleg="Elke regel: de post, wat er uitging, welk deel van het budget dat is, en een balk."
    >
      <Legend items={posten} className="w-full max-w-md">
        <LegendItem className="grid gap-1.5">
          <div className="flex items-center gap-3">
            <LegendMarker />
            <LegendLabel className="flex-1 text-sm" />
            <LegendValue
              className="font-mono text-sm text-foreground tabular-nums"
              formatValue={euro}
              showPercentage
              formatPercentage={(p) => procent(p / 100)}
              percentageClassName="w-10 text-right"
            />
          </div>
          <LegendProgress />
        </LegendItem>
      </Legend>
    </Voorbeeld>
  ),
};
