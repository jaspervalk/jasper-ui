import type { Meta, StoryObj } from "@storybook/react-vite";

import { Candlestick } from "@/components/charts/candlestick";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";
import { YAxis } from "@/components/charts/y-axis";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, euroCenten, toeval, TIJDVORM } from "./gedeeld";

// Verzonnen: weekkoersen van een fonds dat niet bestaat (Noordkaap Wereldaandelen), april tot en met september 2026.
// Per week een opening, hoogste, laagste en slotkoers in euro.
const kans = toeval(4207);
const weken = (() => {
  let slot = 128.4;
  return Array.from({ length: 26 }, (_, i) => {
    const open = slot;
    const close = Math.round((open * (1 + 0.006 + 0.028 * (kans() - 0.5))) * 100) / 100;
    const high = Math.round(Math.max(open, close) * (1 + 0.012 * kans()) * 100) / 100;
    const low = Math.round(Math.min(open, close) * (1 - 0.012 * kans()) * 100) / 100;
    slot = close;
    return { date: new Date(2026, 3, 3 + i * 7), open, high, low, close };
  });
})();

const meta = {
  title: "Bibliotheek/Bklit/Koersgrafiek (candlestick)",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "candlestick-chart",
          wat: "per periode de opening, de slotkoers en het bereik daartussen. Een gevulde kaars is een stijging, een andere kleur een daling.",
          waarvoor:
            "koersen van een fonds of aandeel per dag of week, als je wilt zien hoe onrustig een periode was en niet alleen waar hij eindigde. Voor de meeste dashboards is een lijn rustiger.",
          beperkingen:
            "Bklit kleurt stijgers en dalers standaard smaragdgroen en rood; geef `positiveFill` en `negativeFill` (hier `--positive` en `--negative`, gedempt). Kleur is het enige verschil tussen stijgen en dalen: zet de koers en het verschil er als tekst bij. De y-as heeft wel getallen (`YAxis`), standaard als `1k`; geef een eigen `formatValue`. Tooltip alleen met de muis.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const eerste = weken[0];
const laatste = weken[weken.length - 1];

export const Weekkoersen: Story = {
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Noordkaap Wereldaandelen, weekkoersen"
        uitleg="Een kaars per week. De lont toont de hoogste en laagste koers van die week."
        samenvatting={`Van ${euroCenten(eerste.open)} in april naar ${euroCenten(laatste.close)} eind september.`}
      >
        <CandlestickChart animationDuration={duur} data={weken} aspectRatio="" className={TIJDVORM} margin={{ left: 56 }}>
          <Grid horizontal numTicksRows={4} />
          <Candlestick positiveFill="var(--positive)" negativeFill="var(--negative)" />
          <XAxis numTicks={5} />
          <YAxis numTicks={4} formatValue={(v) => euroCenten(v).replace(/,00$/, "")} />
          <ChartTooltip
            showDatePill={false}
            rows={(p) => [
              { color: "var(--chart-3)", label: "Open", value: euroCenten(p.open as number) },
              { color: "var(--chart-3)", label: "Hoog", value: euroCenten(p.high as number) },
              { color: "var(--chart-3)", label: "Laag", value: euroCenten(p.low as number) },
              { color: "var(--chart-1)", label: "Slot", value: euroCenten(p.close as number) },
            ]}
          />
        </CandlestickChart>
        <Sleutel
          items={[
            { label: "Week omhoog", kleur: "var(--positive)" },
            { label: "Week omlaag", kleur: "var(--negative)" },
          ]}
        />
      </Voorbeeld>
    );
  },
};
