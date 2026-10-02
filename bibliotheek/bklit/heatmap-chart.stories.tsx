import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  HeatmapCells,
  HeatmapChart,
  type HeatmapColumn,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from "@/components/charts/heatmap";

import { Voorbeeld, beschrijving, bibliotheekDecorators, toeval } from "./gedeeld";

// Verzonnen: opgewekte zonnestroom per dag, van zondag 29 maart tot en met zaterdag 26 september 2026 (26 weken).
// De warmtekaart van Bklit kent vijf niveaus (0 tot en met 4); de dagopbrengst in kWh is daarom ingedeeld.
const NIVEAUS = ["minder dan 4 kWh", "4 tot 9 kWh", "9 tot 14 kWh", "14 tot 19 kWh", "19 kWh of meer"];
const niveau = (kwh: number) => (kwh < 4 ? 0 : kwh < 9 ? 1 : kwh < 14 ? 2 : kwh < 19 ? 3 : 4);

const kans = toeval(2603);
const weken: HeatmapColumn[] = Array.from({ length: 26 }, (_, w) => ({
  bin: w,
  bins: Array.from({ length: 7 }, (_, d) => {
    const dag = w * 7 + d;
    const date = new Date(2026, 2, 29 + dag);
    const seizoen = Math.sin((Math.PI * (dag + 20)) / 200);
    const weer = kans();
    const kwh = (6 + 16 * seizoen) * (weer < 0.2 ? 0.25 : 0.6 + 0.5 * weer);
    return { bin: d, count: niveau(kwh), date };
  }),
}));

const meta = {
  title: "Bibliotheek/Bklit/Warmtekaart (kalender)",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "heatmap-chart",
          wat: "een kalender met een vakje per dag, donkerder naarmate er meer was. Zoals de bijdragen op GitHub.",
          waarvoor:
            "ritme over weken of maanden: zonnestroom per dag, dagen met een transactie, bezoekers per dag. Je ziet seizoenen, weekenden en gaten in één blik.",
          beperkingen:
            "alleen de kalendervorm (weken als kolommen, dagen als rijen), geen vrije rijen en kolommen. Vijf vaste niveaus (0, 1, 2, 3, 4 of meer): echte waarden moet je zelf indelen, zoals hier in kWh. Maanden en dagen waren Engels; in onze kopie op nl-NL gezet (`heatmap-utils.ts`, `heatmap-x-axis.tsx`). Geef `lessLabel`, `moreLabel` en `formatLabel` mee, anders staat er *Less*, *More* en *contributions*. Hover alleen met de muis; de svg is `aria-hidden`.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Zonnestroom: Story = {
  name: "Zonnestroom per dag",
  render: () => (
    <Voorbeeld
      titel="Zonnestroom per dag, april tot en met september"
      uitleg="Elk vakje is een dag, een kolom is een week. Donkerder is meer stroom; de lichte plekken zijn bewolkte dagen."
      samenvatting="De meeste stroom in juni en juli, het minst eind maart en eind september. Verspreid bewolkte dagen met weinig opwek."
    >
      <HeatmapInteractionProvider>
        <HeatmapInteractionBoundary>
          <div
            // biome-ignore lint/a11y/noNoninteractiveTabindex: een schuifvlak moet met het toetsenbord te bedienen zijn
            tabIndex={0}
            role="region"
            aria-label="Kalender, schuif opzij voor alle weken"
            className="flex w-full flex-col items-stretch gap-3 overflow-x-auto rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <HeatmapChart data={weken} layout="fluid" weekStartDay={1} className="min-w-[30rem]">
              <HeatmapCells />
              <HeatmapXAxis />
              <HeatmapYAxis tickFilter="even" />
              <HeatmapTooltip formatLabel={(n) => NIVEAUS[Math.min(n, 4)]} />
            </HeatmapChart>
            <HeatmapLegend lessLabel="Weinig" moreLabel="Veel" />
          </div>
        </HeatmapInteractionBoundary>
      </HeatmapInteractionProvider>
    </Voorbeeld>
  ),
};
