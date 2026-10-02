import type { Meta, StoryObj } from "@storybook/react-vite";
import { curveMonotoneX } from "@visx/curve";

import { Area } from "@/components/charts/area";
import { AreaChart } from "@/components/charts/area-chart";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, getal, toeval, TIJDVORM } from "./gedeeld";

// Verzonnen: opgewekte zonnestroom en verbruik per week in 2026 (kWh), van de eerste week van januari tot eind
// september. Een sinus voor de seizoenen en een vaste toevalsgenerator voor het weer.
const kans = toeval(2026_09);
const weken = Array.from({ length: 39 }, (_, i) => {
  const date = new Date(2026, 0, 5 + i * 7);
  const seizoen = Math.sin((Math.PI * (i + 3)) / 50);
  const opgewekt = Math.round(18 + 92 * seizoen * (0.7 + 0.3 * kans()));
  const verbruikt = Math.round(150 - 85 * seizoen + 14 * (kans() - 0.5));
  return { date, opgewekt, verbruikt };
});
const totaalOpgewekt = weken.reduce((s, w) => s + w.opgewekt, 0);

const meta = {
  title: "Bibliotheek/Bklit/Vlakgrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "area-chart",
          wat: "een hoeveelheid door de tijd, met het vlak onder de lijn ingekleurd. Het vlak maakt het volume zichtbaar.",
          waarvoor:
            "hoeveelheden die zich opstapelen: opgewekte stroom per week, bezoekers per dag, inleg per maand. Twee vlakken over elkaar laten zien waar de een de ander inhaalt.",
          beperkingen:
            "de y-as begint altijd bij 0, en Bklit tekent geen getallen op de y-as (zet het bereik in een bijschrift of gebruik de tooltip). Voor een waarde die schommelt rond een hoog niveau, zoals een portefeuille, wordt het een platte strook: gebruik dan de lijngrafiek met een verschoven reeks. De tooltip werkt alleen met de muis of aanraking.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EenReeks: Story = {
  name: "Eén reeks",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Opgewekte zonnestroom per week"
        uitleg="Eén vlak met een zachte kleurverloop. Wijs een week aan voor het getal."
        samenvatting={`${getal(totaalOpgewekt)} kWh opgewekt in 39 weken; het meest rond juni.`}
      >
        <AreaChart animationDuration={duur} data={weken} aspectRatio="" className={TIJDVORM}>
          <Grid horizontal numTicksRows={4} />
          <Area dataKey="opgewekt" curve={curveMonotoneX} fill="var(--chart-line-primary)" fillOpacity={0.3} />
          <XAxis numTicks={5} />
          <ChartTooltip rows={(p) => [{ color: "var(--chart-line-primary)", label: "Opgewekt", value: `${getal(p.opgewekt as number)} kWh` }]} />
        </AreaChart>
      </Voorbeeld>
    );
  },
};

export const TweeReeksen: Story = {
  name: "Twee reeksen",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Opgewekt en verbruikt per week"
        uitleg="Twee vlakken over elkaar. In de zomer wekt het huis meer op dan het verbruikt; daar kruisen de lijnen."
        samenvatting="Van januari tot april is het verbruik hoger dan de opwek, van mei tot augustus is de opwek hoger."
      >
        <AreaChart animationDuration={duur} data={weken} aspectRatio="" className={TIJDVORM}>
          <Grid horizontal numTicksRows={4} />
          <Area dataKey="verbruikt" curve={curveMonotoneX} fill="var(--chart-3)" fillOpacity={0.25} />
          <Area dataKey="opgewekt" curve={curveMonotoneX} fill="var(--chart-1)" fillOpacity={0.3} />
          <XAxis numTicks={5} />
          <ChartTooltip
            rows={(p) => [
              { color: "var(--chart-1)", label: "Opgewekt", value: `${getal(p.opgewekt as number)} kWh` },
              { color: "var(--chart-3)", label: "Verbruikt", value: `${getal(p.verbruikt as number)} kWh` },
            ]}
          />
        </AreaChart>
        <Sleutel
          items={[
            { label: "Opgewekt", kleur: "var(--chart-1)", lijn: true },
            { label: "Verbruikt", kleur: "var(--chart-3)", lijn: true },
          ]}
        />
      </Voorbeeld>
    );
  },
};
