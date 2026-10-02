import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Legend, LegendItem, LegendLabel, LegendMarker, LegendValue } from "@/components/charts/legend";
import { PieCenter } from "@/components/charts/pie-center";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, getal, procent } from "./gedeeld";

// Verzonnen: stroomverbruik van een huishouden in september, per groep apparaten (kWh).
const stroom = [
  { label: "Warmtepomp", value: 182, color: "var(--chart-1)" },
  { label: "Overig", value: 64, color: "var(--chart-2)" },
  { label: "Wassen en drogen", value: 46, color: "var(--chart-3)" },
  { label: "Koken", value: 38, color: "var(--chart-4)" },
  { label: "Verlichting", value: 21, color: "var(--chart-5)" },
];
const stroomTotaal = stroom.reduce((s, d) => s + d.value, 0);

// Verzonnen: waar de bezoekers van de site van een festival vandaan kwamen in de week voor de kaartverkoop.
const kanalen = [
  { label: "Instagram", value: 5240, color: "var(--chart-1)" },
  { label: "Nieuwsbrief", value: 3110, color: "var(--chart-2)" },
  { label: "Direct", value: 2380, color: "var(--chart-3)" },
  { label: "Zoekmachine", value: 1460, color: "var(--chart-4)" },
];
const kanalenTotaal = kanalen.reduce((s, d) => s + d.value, 0);

const meta = {
  title: "Bibliotheek/Bklit/Taartgrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "pie-chart",
          wat: "hoe een geheel verdeeld is over een paar delen. Als volle taart of als donut met een getal in het midden.",
          waarvoor:
            "een verdeling met hooguit vijf delen die samen 100% zijn: beleggingen naar soort, stroom per apparaat, bezoekers per kanaal. Zet de getallen er als tekst of tabel naast; een taart toont verhoudingen, geen precieze waarden.",
          beperkingen:
            "vijf kleuren (`--chart-1` tot `--chart-5`); in de huisstijlen van de werkbank zijn dat grijstinten. De svg is `aria-hidden` en de punten reageren alleen op de muis, niet op het toetsenbord: de legenda of tabel ernaast draagt de informatie. Een doel of vergelijking toont de taart niet zelf (zie de portefeuille in het lab: twee ringen, nu en doel).",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Verdeling: Story = {
  name: "Verdeling (volle taart)",
  render: function Render() {
    const [actief, setActief] = useState<number | null>(null);
    return (
      <Voorbeeld
        titel="Stroomverbruik in september"
        uitleg="Een volle taart met een legenda ernaast. Wijs een punt of een regel in de legenda aan: de andere vervagen."
        samenvatting={`Totaal ${getal(stroomTotaal)} kWh. ${stroom.map((d) => `${d.label} ${getal(d.value)} kWh`).join(", ")}.`}
      >
        <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,16rem)_minmax(0,22rem)] sm:gap-10">
          <PieChart
            data={stroom}
            hoveredIndex={actief}
            onHoverChange={setActief}
            padAngle={0.02}
            className="mx-auto max-w-64"
          >
            {stroom.map((d, i) => (
              <PieSlice key={d.label} index={i} hoverEffect="grow" showGlow={false} />
            ))}
          </PieChart>
          <Legend
            items={stroom.map((d) => ({ ...d, maxValue: stroomTotaal }))}
            hoveredIndex={actief}
            onHoverChange={setActief}
          >
            <LegendItem className="flex items-center gap-3">
              <LegendMarker />
              <LegendLabel className="flex-1 text-sm" />
              <LegendValue
                className="font-mono text-sm text-foreground tabular-nums"
                formatValue={(v) => `${getal(v)} kWh`}
                showPercentage
                formatPercentage={(p) => procent(p / 100)}
                percentageClassName="w-10 text-right"
              />
            </LegendItem>
          </Legend>
        </div>
      </Voorbeeld>
    );
  },
};

export const Donut: Story = {
  name: "Donut met totaal",
  render: () => (
    <Voorbeeld
      titel="Bezoekers per kanaal, week voor de kaartverkoop"
      uitleg="Met een gat in het midden komt er ruimte voor één getal. Wijs een stuk aan en het midden toont dat kanaal."
      samenvatting={`${getal(kanalenTotaal)} bezoekers. ${kanalen.map((d) => `${d.label} ${getal(d.value)}`).join(", ")}.`}
    >
      <div className="mx-auto w-full max-w-72">
        <PieChart data={kanalen} innerRadius={78} padAngle={0.03} cornerRadius={4}>
          {kanalen.map((d, i) => (
            <PieSlice key={d.label} index={i} showGlow={false} />
          ))}
          <PieCenter defaultLabel="bezoekers" />
        </PieChart>
      </div>
      <Sleutel
        className="justify-center"
        items={kanalen.map((d) => ({ label: d.label, kleur: d.color, waarde: getal(d.value) }))}
      />
    </Voorbeeld>
  ),
};
