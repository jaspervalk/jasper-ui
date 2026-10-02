import type { Meta, StoryObj } from "@storybook/react-vite";
import { curveMonotoneX } from "@visx/curve";

import { ComposedChart } from "@/components/charts/composed-chart";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { SeriesBar } from "@/components/charts/series-bar";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, getal, TIJDVORM } from "./gedeeld";

// Verzonnen: stroomverbruik per maand in 2026 (kWh) en dezelfde maand in 2025.
const verbruik = [
  [612, 655],
  [548, 590],
  [470, 498],
  [352, 380],
  [268, 290],
  [214, 230],
  [198, 215],
  [205, 220],
  [260, 285],
].map(([ditJaar, vorigJaar], i) => ({ date: new Date(2026, i, 1), ditJaar, vorigJaar }));

const meta = {
  title: "Bibliotheek/Bklit/Gecombineerde grafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "composed-chart",
          wat: "staven, vlakken en lijnen in één grafiek, op dezelfde tijdas.",
          waarvoor:
            "een hoeveelheid naast een maatstaf: verbruik per maand met vorig jaar als lijn, inleg per maand met het doel, omzet met een gemiddelde.",
          beperkingen:
            "de tijdas is een datum (`date`), dus geen losse categorieën zoals podia. Beide reeksen delen dezelfde schaal vanaf 0; twee eenheden (euro en procent) in één grafiek kan alleen met een tweede y-as (`yAxisId`) en dat maakt het snel onduidelijk. Tooltip alleen met de muis.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StavenEnLijn: Story = {
  name: "Staven met een lijn",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Stroomverbruik per maand, tegen vorig jaar"
        uitleg="De staven zijn dit jaar, de lijn is vorig jaar. Elke maand ligt de staaf onder de lijn: het huis verbruikt minder."
        samenvatting={`Dit jaar ${getal(verbruik.reduce((s, d) => s + d.ditJaar, 0))} kWh tot en met september, vorig jaar ${getal(verbruik.reduce((s, d) => s + d.vorigJaar, 0))} kWh.`}
      >
        <ComposedChart animationDuration={duur} data={verbruik} aspectRatio="" className={TIJDVORM} maxBarSize={36}>
          <Grid horizontal numTicksRows={4} />
          <SeriesBar dataKey="ditJaar" fill="var(--chart-4)" radius={3} />
          <Line dataKey="vorigJaar" curve={curveMonotoneX} stroke="var(--chart-1)" strokeWidth={2} />
          <XAxis numTicks={5} />
          <ChartTooltip
            rows={(p) => [
              { color: "var(--chart-4)", label: "2026", value: `${getal(p.ditJaar as number)} kWh` },
              { color: "var(--chart-1)", label: "2025", value: `${getal(p.vorigJaar as number)} kWh` },
            ]}
          />
        </ComposedChart>
        <Sleutel
          items={[
            { label: "2026", kleur: "var(--chart-4)" },
            { label: "2025", kleur: "var(--chart-1)", lijn: true },
          ]}
        />
      </Voorbeeld>
    );
  },
};
