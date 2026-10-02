import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChartStatFlow } from "@/components/charts/chart-stat-flow";
import { cn } from "@/lib/utils";

import { Voorbeeld, beschrijving, bibliotheekDecorators } from "./gedeeld";

// Verzonnen: bezoekers van de site van een festival in drie perioden.
const perioden = [
  { id: "dag", label: "Vandaag", waarde: 1284, uitleg: "bezoekers vandaag" },
  { id: "week", label: "Deze week", waarde: 9310, uitleg: "bezoekers deze week" },
  { id: "maand", label: "September", waarde: 41875, uitleg: "bezoekers in september" },
] as const;

const meta = {
  title: "Bibliotheek/Bklit/Kerncijfer (stat-flow)",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "chart-stat-flow",
          wat: "één groot getal met een label eronder. Als het getal verandert, rollen de cijfers naar de nieuwe waarde (NumberFlow).",
          waarvoor:
            "het kerncijfer boven een grafiek of in het midden van een taart en ring (Bklit gebruikt het daar zelf). Met knoppen voor de periode zie je het getal wisselen zonder dat de pagina springt.",
          beperkingen:
            "het rollen laat even cijfers zien die nooit bestonden. Voor bedragen met een bron (de cockpit) liever zonder animatie. NumberFlow volgt *beweging beperken* zelf. Getallen in onze kopie op nl-NL gezet (`chart-stat-flow.tsx`); het origineel volgt de taal van de browser.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetPeriode: Story = {
  name: "Met keuze voor de periode",
  render: function Render() {
    const [id, setId] = useState<(typeof perioden)[number]["id"]>("week");
    const periode = perioden.find((p) => p.id === id) ?? perioden[1];
    return (
      <Voorbeeld
        titel="Bezoekers van de festivalsite"
        uitleg="Kies een periode: het getal rolt naar de nieuwe waarde, de rest van de pagina blijft staan."
      >
        <div role="group" aria-label="Periode" className="flex gap-1">
          {perioden.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={id === p.id}
              onClick={() => setId(p.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-sm transition-[background-color,color] duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                id === p.id ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <ChartStatFlow
            value={periode.waarde}
            label={periode.uitleg}
            valueClassName="font-mono text-4xl font-medium tracking-tight"
            labelClassName="text-sm text-muted-foreground"
          />
        </div>
      </Voorbeeld>
    );
  },
};
