import type { Meta, StoryObj } from "@storybook/react-vite";

import { FunnelChart } from "@/components/charts/funnel-chart";

import { Voorbeeld, beschrijving, bibliotheekDecorators, getal, procent } from "./gedeeld";

// Verzonnen: de kaartverkoop van een festival in de eerste week, van bezoek aan de site tot betaalde bestelling.
const stappen = [
  { label: "Op de site", value: 24800 },
  { label: "Programma", value: 11200 },
  { label: "In winkelmand", value: 3900 },
  { label: "Betaald", value: 2150 },
];

const meta = {
  title: "Bibliotheek/Bklit/Trechter",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "funnel-chart",
          wat: "hoeveel er overblijft na elke stap van een proces, met het aantal en het percentage van de eerste stap.",
          waarvoor:
            "een reeks stappen waar steeds mensen afvallen: van bezoek naar bestelling, van aanmelding naar eerste inleg. Je ziet in één blik waar de grootste val zit.",
          beperkingen:
            "alleen een rij stappen die steeds kleiner wordt; geen vertakkingen (daarvoor is de sankey). Getallen en namen staan wel als tekst in de pagina, de vlakken zijn `aria-hidden`. Bij vier of meer stappen wordt het op 375 px krap: gebruik dan `orientation=\"vertical\"`. Hover alleen met de muis.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kaartverkoop: Story = {
  render: () => (
    <Voorbeeld
      titel="Kaartverkoop, eerste week"
      uitleg="Van iedereen die op de site kwam, betaalde 9%. De grootste val zit tussen programma en winkelmand."
    >
      <FunnelChart
        data={stappen}
        color="var(--chart-1)"
        formatValue={getal}
        formatPercentage={(p) => procent(p / 100)}
        className="hidden sm:block"
      />
      <FunnelChart
        data={stappen}
        orientation="vertical"
        color="var(--chart-1)"
        formatValue={getal}
        formatPercentage={(p) => procent(p / 100)}
        className="sm:hidden"
      />
    </Voorbeeld>
  ),
};
