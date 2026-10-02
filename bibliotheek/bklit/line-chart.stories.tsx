import type { Meta, StoryObj } from "@storybook/react-vite";
import { curveMonotoneX, curveStepAfter } from "@visx/curve";

import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { LineChart } from "@/components/charts/line-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, decimaal, toeval, TIJDVORM } from "./gedeeld";

// Verzonnen: gemiddelde stroomprijs per maand (cent per kWh) bij een dynamisch contract, en een vast tarief dat op
// 1 januari 2026 omlaag ging. Oktober 2025 tot en met september 2026.
const kans = toeval(1001);
const prijzen = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2025, 9 + i, 1);
  const winter = Math.cos((Math.PI * 2 * date.getMonth()) / 12);
  return {
    date,
    dynamisch: Math.round((26 + 6 * winter + 5 * (kans() - 0.5)) * 10) / 10,
    vast: date.getFullYear() === 2025 ? 29.5 : 27.2,
  };
});

const meta = {
  title: "Bibliotheek/Bklit/Lijngrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "line-chart",
          wat: "hoe een waarde verandert door de tijd, voor één of meer reeksen.",
          waarvoor:
            "een verloop dat je wilt volgen of vergelijken: stroomprijs per maand, waarde van een fonds, bezoekers per dag. Al in gebruik in het portefeuille-dashboard van het lab en in de catalogus (chart-thema).",
          beperkingen:
            "de y-as begint bij positieve waarden altijd bij 0. Een portefeuille van € 180.000 die een paar procent schommelt wordt dan een platte streep bovenin; teken in dat geval een verschoven reeks en toon de echte waarde in tooltip en bijschrift (zoals `Waardeverloop` in het lab). Geen getallen op de y-as. Datums op de x-as staan zonder jaartal; loopt de reeks over meer dan een jaar, dan vallen labels met dezelfde tekst weg (*1 jan* komt maar één keer). De onthulling van links naar rechts negeert *beweging beperken*: geef `animationDuration={0}` via `useReducedMotion`. Tooltip alleen met de muis.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TweeLijnen: Story = {
  name: "Twee lijnen",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Stroomprijs: dynamisch tegen vast"
        uitleg="De dynamische prijs volgt de seizoenen; het vaste tarief is een trap die één keer per jaar verandert."
        samenvatting="Dynamisch tussen ongeveer 18 en 33 cent per kWh, hoog in de winter. Vast 29,5 cent tot en met december 2025, daarna 27,2 cent."
      >
        <LineChart animationDuration={duur} data={prijzen} aspectRatio="" className={TIJDVORM}>
          <Grid horizontal numTicksRows={4} />
          <Line dataKey="vast" curve={curveStepAfter} stroke="var(--chart-3)" strokeWidth={2} />
          <Line dataKey="dynamisch" curve={curveMonotoneX} stroke="var(--chart-1)" strokeWidth={2} />
          <XAxis numTicks={6} />
          <ChartTooltip
            rows={(p) => [
              { color: "var(--chart-1)", label: "Dynamisch", value: `${decimaal(p.dynamisch as number)} ct` },
              { color: "var(--chart-3)", label: "Vast", value: `${decimaal(p.vast as number)} ct` },
            ]}
          />
        </LineChart>
        <Sleutel
          items={[
            { label: "Dynamisch", kleur: "var(--chart-1)", lijn: true },
            { label: "Vast tarief", kleur: "var(--chart-3)", lijn: true },
          ]}
        />
      </Voorbeeld>
    );
  },
};
