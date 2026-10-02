import type { Meta, StoryObj } from "@storybook/react-vite";

import { Gauge } from "@/components/charts/gauge";

import { Voorbeeld, beschrijving, bibliotheekDecorators, getal } from "./gedeeld";

// Verzonnen: hoeveel van de opgewekte zonnestroom het huis zelf gebruikte in september, en hoeveel kaarten voor een
// festival verkocht zijn.
const zelfGebruikt = 68;
const verkocht = 8420;
const capaciteit = 10000;

const meta = {
  title: "Bibliotheek/Bklit/Meter",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "gauge-chart",
          wat: "één percentage als een boog of balk van streepjes, met het getal in het midden of ernaast.",
          waarvoor:
            "één cijfer tegen een vast maximum: zelf gebruikte zonnestroom, verkochte kaarten tegen de capaciteit, een spaardoel. Werkt als blikvanger naast een tabel; niet voor iets zonder natuurlijk maximum.",
          beperkingen:
            "alleen 0 tot 100: reken zelf om naar een percentage. Het getal in het midden is een eigen waarde (`centerValue`), dus houd die gelijk aan `value` of zeg wat het is. De svg is `aria-hidden`; het getal staat wel als tekst in de pagina. De meter heeft geen eigen kleur voor goed of slecht: dat is aan jou.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Boog: Story = {
  render: () => (
    <Voorbeeld
      titel="Zelf gebruikte zonnestroom, september"
      uitleg="Een boog van streepjes. Het getal staat in het midden; de rest van de opwek ging terug het net op."
    >
      <div className="mx-auto w-full max-w-72">
        <Gauge
          value={zelfGebruikt}
          centerValue={zelfGebruikt / 100}
          formatOptions={{ style: "percent" }}
          defaultLabel="zelf gebruikt"
          totalNotches={36}
          activeFill="var(--chart-1)"
          inactiveFill="var(--chart-5)"
        />
      </div>
    </Voorbeeld>
  ),
};

export const Balk: Story = {
  render: () => (
    <Voorbeeld
      titel="Kaartverkoop"
      uitleg="Dezelfde meter als liggende balk, met het getal erboven. Past in een smalle kolom of een rij kerncijfers."
      samenvatting={`${getal(verkocht)} van de ${getal(capaciteit)} kaarten verkocht.`}
    >
      <div className="w-full max-w-md">
        <Gauge
          orientation="linear"
          value={(verkocht / capaciteit) * 100}
          centerValue={verkocht}
          defaultLabel={`van ${getal(capaciteit)} kaarten verkocht`}
          totalNotches={40}
          labelPlacement="top"
          labelAlign="start"
          activeFill="var(--chart-1)"
          inactiveFill="var(--chart-5)"
        />
      </div>
    </Voorbeeld>
  ),
};
