import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "@/components/charts/grid";
import { Scatter } from "@/components/charts/scatter";
import { ScatterChart } from "@/components/charts/scatter-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, decimaal, toeval, TIJDVORM } from "./gedeeld";

// Verzonnen: laadsessies van een elektrische auto in september, thuis en bij een snellader (kWh per sessie). Thuis
// wordt vaker en minder per keer geladen.
const kans = toeval(912);
const sessies = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2026, 8, i + 1),
  thuis: Math.round((8 + 14 * kans()) * 10) / 10,
  snellader: Math.round((28 + 22 * kans()) * 10) / 10,
}));

const meta = {
  title: "Bibliotheek/Bklit/Spreidingsgrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "scatter-chart",
          wat: "losse metingen als stippen door de tijd, zonder lijn ertussen. Je ziet de spreiding, niet een verloop.",
          waarvoor:
            "gebeurtenissen die elk een eigen waarde hebben: laadsessies, transacties, wachttijden. Twee groepen naast elkaar laten zien welke hoger en wijder ligt.",
          beperkingen:
            "de x-as is altijd een datum: een echte x-tegen-y-spreiding (rendement tegen risico) kan deze grafiek niet. Eén waarde per reeks per datum. De y-as begint bij 0 en heeft geen getallen. Tooltip alleen met de muis.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TweeGroepen: Story = {
  name: "Twee groepen",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Laadsessies in september"
        uitleg="Elke stip is een sessie. Thuis laadt de auto vaak een beetje, bij de snellader in één keer veel."
        samenvatting="Thuis 8 tot 22 kWh per sessie, bij de snellader 28 tot 50 kWh."
      >
        <ScatterChart animationDuration={duur} data={sessies} aspectRatio="" className={TIJDVORM}>
          <Grid horizontal numTicksRows={4} />
          <Scatter dataKey="thuis" fill="var(--chart-3)" radius={4} />
          <Scatter dataKey="snellader" fill="var(--chart-1)" radius={4} />
          <XAxis numTicks={5} />
          <ChartTooltip
            rows={(p) => [
              { color: "var(--chart-1)", label: "Snellader", value: `${decimaal(p.snellader as number)} kWh` },
              { color: "var(--chart-3)", label: "Thuis", value: `${decimaal(p.thuis as number)} kWh` },
            ]}
          />
        </ScatterChart>
        <Sleutel
          items={[
            { label: "Snellader", kleur: "var(--chart-1)" },
            { label: "Thuis", kleur: "var(--chart-3)" },
          ]}
        />
      </Voorbeeld>
    );
  },
};
