import type { Meta, StoryObj } from "@storybook/react-vite";
import { curveMonotoneX } from "@visx/curve";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { LiveLine } from "@/components/charts/live-line";
import { LiveLineChart, type LiveLinePoint } from "@/components/charts/live-line-chart";
import { LiveXAxis } from "@/components/charts/live-x-axis";
import { LiveYAxis } from "@/components/charts/live-y-axis";

import { Voorbeeld, beschrijving, bibliotheekDecorators, getal, toeval } from "./gedeeld";

// Verzonnen: het stroomverbruik van een huis in watt, elke seconde een nieuwe meting. Een basislast met af en toe een
// waterkoker of de warmtepomp erbij.
const kans = toeval(77);
function volgende(vorige: number) {
  const piek = kans() > 0.93 ? 1400 : 0;
  const doel = 420 + piek;
  return Math.max(180, Math.round(vorige + (doel - vorige) * 0.35 + 120 * (kans() - 0.5)));
}

function useMeter(): { data: LiveLinePoint[]; waarde: number; stil: boolean } {
  const stil = useReducedMotion() ?? false;
  const [data, setData] = useState<LiveLinePoint[]>(() => {
    const nu = Date.now() / 1000;
    let w = 450;
    return Array.from({ length: 40 }, (_, i) => {
      w = volgende(w);
      return { time: nu - (39 - i), value: w };
    });
  });
  useEffect(() => {
    if (stil) return;
    const id = setInterval(() => {
      setData((oud) => {
        const laatste = oud[oud.length - 1];
        return [...oud.slice(-59), { time: Date.now() / 1000, value: volgende(laatste.value) }];
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stil]);
  return { data, waarde: data[data.length - 1].value, stil };
}

const meta = {
  title: "Bibliotheek/Bklit/Live lijngrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators("Verzonnen metingen, elke seconde een nieuwe. Geen echte meter."),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "live-line-chart",
          wat: "een meting die binnenkomt terwijl je kijkt. De lijn schuift mee, met een stip en het laatste getal aan de rechterkant.",
          waarvoor:
            "iets dat nu gebeurt en elke paar seconden verandert: stroomverbruik in watt, bezoekers op de site, een koers tijdens de handel. Niet voor data die eens per dag binnenkomt.",
          beperkingen:
            "beweegt altijd: de grafiek tekent elke frame opnieuw. Onder *beweging beperken* zet deze story hem stil (`paused`) en komen er geen nieuwe metingen bij; in een project moet je dat zelf regelen. De lijn heeft geen tooltip voor schermlezers; zet het laatste getal ook als tekst in de pagina (`aria-live` alleen als het niet te vaak verandert). Tijden op de as in nl-NL (`chart-formatters.ts`).",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stroommeter: Story = {
  render: function Render() {
    const { data, waarde, stil } = useMeter();
    return (
      <Voorbeeld
        titel="Stroomverbruik nu"
        uitleg={
          stil
            ? "Stilgezet omdat beweging beperken aan staat. Anders schuift de lijn elke seconde verder."
            : "Elke seconde een nieuwe meting. De pieken zijn de waterkoker of de warmtepomp."
        }
      >
        <p className="text-sm">
          Nu <span className="font-mono font-medium tabular-nums">{getal(waarde)} W</span>
        </p>
        <LiveLineChart
          data={data}
          value={waarde}
          window={30}
          paused={stil}
          margin={{ left: 56, right: 64 }}
          style={{ height: 260 }}
        >
          <LiveLine
            dataKey="value"
            curve={curveMonotoneX}
            stroke="var(--chart-line-primary)"
            formatValue={(v) => `${getal(v)} W`}
          />
          <LiveXAxis />
          <LiveYAxis formatValue={(v) => `${getal(v)} W`} />
        </LiveLineChart>
      </Voorbeeld>
    );
  },
};
