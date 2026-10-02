import type { Meta, StoryObj } from "@storybook/react-vite";

import { buildArcs } from "@/components/charts/sunburst";
import { SunburstCenter } from "@/components/charts/sunburst-center";
import { SunburstChart } from "@/components/charts/sunburst-chart";
import { SunburstHint } from "@/components/charts/sunburst-hint";
import { SunburstLabels } from "@/components/charts/sunburst-labels";
import { SunburstSegment } from "@/components/charts/sunburst-segment";

import { Voorbeeld, beschrijving, bibliotheekDecorators, euro } from "./gedeeld";

// Verzonnen: een portefeuille in twee lagen, eerst naar soort, dan naar fonds (euro). De fondsen bestaan niet.
const portefeuille = {
  name: "Portefeuille",
  children: [
    {
      name: "Aandelen",
      children: [
        { name: "Wereld", value: 58650 },
        { name: "Europa", value: 25920 },
        { name: "Opkomend", value: 16560 },
        { name: "Klein", value: 11020 },
      ],
    },
    {
      name: "Obligaties",
      children: [
        { name: "Staat", value: 37300 },
        { name: "Bedrijf", value: 18320 },
      ],
    },
    { name: "Vastgoed", children: [{ name: "Europa", value: 9040 }] },
    { name: "Liquiditeit", children: [{ name: "Spaar", value: 7530 }] },
  ],
};
const { arcs } = buildArcs(portefeuille);
const totaal = 58650 + 25920 + 16560 + 11020 + 37300 + 18320 + 9040 + 7530;

const meta = {
  title: "Bibliotheek/Bklit/Zonnestraal (sunburst)",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "sunburst-chart",
          wat: "een verdeling in lagen: binnen de hoofdgroepen, buiten de onderdelen daarvan. Klik op een stuk om in te zoomen.",
          waarvoor:
            "een verdeling met een tweede laag die ertoe doet: portefeuille naar soort en dan naar fonds, kosten naar post en dan naar winkel, bezoekers naar land en dan naar stad.",
          beperkingen:
            "zoomen gaat alleen door te klikken op de svg, niet met het toetsenbord. Kleine stukken krijgen geen label. De standaardhint is Engels (*Click a segment to zoom in*): geef eigen tekst mee aan `SunburstHint`, zoals hier. Lastig om precies te lezen; zet de bedragen ook in een tabel.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portefeuille: Story = {
  render: () => (
    <Voorbeeld
      titel="Portefeuille naar soort en fonds"
      uitleg="Binnen de soort, buiten het fonds. Klik op Aandelen om alleen de aandelen te zien; klik in het midden om terug te gaan."
      samenvatting={`Totaal ${euro(totaal)}. Aandelen ${euro(112150)}, obligaties ${euro(55620)}, vastgoed ${euro(9040)}, liquiditeit ${euro(7530)}.`}
    >
      <div className="mx-auto w-full max-w-sm">
        <SunburstChart data={portefeuille}>
          {arcs.map((arc) => (
            <SunburstSegment key={arc.id} index={arc.arcIndex} />
          ))}
          <SunburstCenter />
          <SunburstLabels />
          <SunburstHint>
            {({ hoveredArc, focus }) =>
              hoveredArc
                ? hoveredArc.trail.join(" › ")
                : focus.depth === 0
                  ? "Klik op een stuk om in te zoomen"
                  : "Klik in het midden om terug te gaan"
            }
          </SunburstHint>
        </SunburstChart>
      </div>
    </Voorbeeld>
  ),
};
