import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Legend, LegendItem, LegendLabel, LegendMarker, LegendProgress, LegendValue } from "@/components/charts/legend";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import { RingChart } from "@/components/charts/ring-chart";

import { Voorbeeld, beschrijving, bibliotheekDecorators, euro, procent, useAnimatieduur } from "./gedeeld";

// Verzonnen: drie spaardoelen met wat er nu op staat en het doelbedrag (euro).
const doelen = [
  { label: "Buffer", value: 7530, maxValue: 10000, color: "var(--chart-1)" },
  { label: "Vakantie", value: 1650, maxValue: 2500, color: "var(--chart-2)" },
  { label: "Nieuwe fiets", value: 480, maxValue: 1400, color: "var(--chart-3)" },
];

const meta = {
  title: "Bibliotheek/Bklit/Ringgrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "ring-chart",
          wat: "per onderdeel een ring die zich vult tot een doel, in ringen om elkaar heen. Het is een voortgangsgrafiek, geen verdeling: elke ring heeft een eigen maximum.",
          waarvoor:
            "een paar doelen tegelijk volgen: spaardoelen, verkochte kaarten per dag tegen de capaciteit, zelf gebruikte zonnestroom tegen de opwek. Hooguit vier ringen; daarna wordt de binnenste te klein.",
          beperkingen:
            "de ringen zijn niet even lang: een buitenring van 50% is langer dan een binnenring van 50%, dus vergelijk op het getal, niet op het oog. Boven 100% loopt een ring niet verder. De svg is `aria-hidden` en de ringen reageren alleen op de muis; de legenda ernaast (met voortgangsbalk) draagt de getallen.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spaardoelen: Story = {
  render: function Render() {
    const [actief, setActief] = useState<number | null>(null);
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Spaardoelen"
        uitleg="Elke ring is een doel. Wijs een ring of een regel aan: het midden toont dat doel."
        samenvatting={doelen.map((d) => `${d.label} ${euro(d.value)} van ${euro(d.maxValue)}`).join(", ")}
      >
        <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,16rem)_minmax(0,20rem)] sm:gap-10">
          <div className="mx-auto w-full max-w-64">
            <RingChart
              animationDuration={duur}
              data={doelen}
              strokeWidth={12}
              ringGap={5}
              baseInnerRadius={52}
              hoveredIndex={actief}
              onHoverChange={setActief}
            >
              {doelen.map((d, i) => (
                <Ring key={d.label} index={i} showGlow={false} />
              ))}
              <RingCenter defaultLabel="gespaard" formatOptions={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }} />
            </RingChart>
          </div>
          <Legend items={doelen} hoveredIndex={actief} onHoverChange={setActief}>
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
        </div>
      </Voorbeeld>
    );
  },
};
