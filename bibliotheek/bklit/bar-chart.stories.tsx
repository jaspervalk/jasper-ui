import type { Meta, StoryObj } from "@storybook/react-vite";

import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, decimaal, euro, getal, TIJDVORM } from "./gedeeld";

// Verzonnen: ontvangen dividend per maand in 2026, en het jaar ervoor ter vergelijking (euro).
const dividend = [
  { maand: "jan", ditJaar: 42, vorigJaar: 35 },
  { maand: "feb", ditJaar: 18, vorigJaar: 22 },
  { maand: "mrt", ditJaar: 236, vorigJaar: 198 },
  { maand: "apr", ditJaar: 64, vorigJaar: 51 },
  { maand: "mei", ditJaar: 31, vorigJaar: 40 },
  { maand: "jun", ditJaar: 252, vorigJaar: 221 },
  { maand: "jul", ditJaar: 48, vorigJaar: 37 },
  { maand: "aug", ditJaar: 165, vorigJaar: 140 },
  { maand: "sep", ditJaar: 212, vorigJaar: 188 },
];

// Verzonnen: bezoekers per podium op de zaterdag van een festival.
const podia = [
  { podium: "De Weide", bezoekers: 11800 },
  { podium: "De Loods", bezoekers: 6400 },
  { podium: "Bostent", bezoekers: 4100 },
  { podium: "Havenkade", bezoekers: 2900 },
  { podium: "Kleine zaal", bezoekers: 1250 },
];

// Verzonnen: rendement per jaar in procent, met twee verliesjaren. Hiermee is Bklit-issue #234 te zien.
const rendement = [
  { jaar: "2019", rendement: 18.2 },
  { jaar: "2020", rendement: 6.1 },
  { jaar: "2021", rendement: 21.4 },
  { jaar: "2022", rendement: -12.8 },
  { jaar: "2023", rendement: 14.9 },
  { jaar: "2024", rendement: 17.3 },
  { jaar: "2025", rendement: -3.6 },
  { jaar: "2026", rendement: 8.6 },
];

const meta = {
  title: "Bibliotheek/Bklit/Staafgrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "bar-chart",
          wat: "een getal per categorie of per periode, als staven naast elkaar. Verticaal of horizontaal, gegroepeerd of gestapeld.",
          waarvoor:
            "vergelijken tussen een handvol categorieën: dividend per maand, bezoekers per podium, kosten per post. Horizontaal als de namen lang zijn.",
          beperkingen:
            "**negatieve waarden gaan fout (Bklit-issue #234):** gecontroleerd op 2 oktober 2026 met de nieuwste versie uit het register van Bklit; de waardeschaal begint vast bij 0 (`domain: [0, max × 1,1]`) en elke staaf groeit vanaf de onderrand. Een negatieve staaf valt onder de onderrand en is dan niet te zien; het jaar staat er, de staaf ontbreekt. Zie de story *Negatieve waarden (fout)*. Gebruik deze grafiek dus niet voor rendementen of saldi die onder nul kunnen gaan. Verder: geen getallen op de waardeas; namen op de as van liggende staven worden na 70 px afgekapt (*Hoofdpodium* wordt *Hoofdpodi…*); de tooltip werkt alleen met de muis. De browser meldt bij negatieve waarden ook een fout in de console (`<rect> attribute height: A negative value is not valid`).",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gegroepeerd: Story = {
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Dividend per maand"
        uitleg="Twee staven per maand: dit jaar en vorig jaar. De pieken in maart, juni en september zijn de kwartaaluitkeringen."
        samenvatting={`Dit jaar ${euro(dividend.reduce((s, d) => s + d.ditJaar, 0))} dividend tot en met september, vorig jaar ${euro(dividend.reduce((s, d) => s + d.vorigJaar, 0))}.`}
      >
        <BarChart animationDuration={duur} data={dividend} xDataKey="maand" aspectRatio="" className={TIJDVORM} barGap={0.3}>
          <Grid horizontal numTicksRows={4} />
          <Bar dataKey="vorigJaar" fill="var(--chart-4)" lineCap={3} />
          <Bar dataKey="ditJaar" fill="var(--chart-1)" lineCap={3} />
          <BarXAxis showAllLabels />
          <ChartTooltip
            showDatePill={false}
            rows={(p) => [
              { color: "var(--chart-1)", label: "2026", value: euro(p.ditJaar as number) },
              { color: "var(--chart-4)", label: "2025", value: euro(p.vorigJaar as number) },
            ]}
          />
        </BarChart>
        <Sleutel
          items={[
            { label: "2026", kleur: "var(--chart-1)" },
            { label: "2025", kleur: "var(--chart-4)" },
          ]}
        />
      </Voorbeeld>
    );
  },
};

export const Horizontaal: Story = {
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Bezoekers per podium, zaterdag"
        uitleg="Liggende staven, zodat de namen van de podia leesbaar blijven, ook op een telefoon."
        samenvatting={podia.map((p) => `${p.podium} ${getal(p.bezoekers)}`).join(", ")}
      >
        <BarChart animationDuration={duur}
          data={podia}
          xDataKey="podium"
          orientation="horizontal"
          aspectRatio=""
          className="aspect-[4/3] sm:aspect-[2/1]"
          margin={{ left: 80 }}
        >
          <Grid horizontal={false} vertical numTicksColumns={4} />
          <Bar dataKey="bezoekers" fill="var(--chart-1)" lineCap={3} />
          <BarYAxis />
          <ChartTooltip
            showDatePill={false}
            rows={(p) => [{ color: "var(--chart-1)", label: "Bezoekers", value: getal(p.bezoekers as number) }]}
          />
        </BarChart>
      </Voorbeeld>
    );
  },
};

export const NegatieveWaarden: Story = {
  name: "Negatieve waarden (fout)",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Rendement per jaar: zo gaat het mis"
        uitleg={
          <>
            2022 (−12,8%) en 2025 (−3,6%) zijn verliesjaren. Bklit tekent de waardeschaal vanaf 0, dus die twee staven
            vallen weg: de jaren staan op de as, de staven niet. Bklit-issue #234; gebruik voor rendementen een tabel of
            een eigen grafiek.
          </>
        }
        samenvatting={rendement.map((r) => `${r.jaar} ${decimaal(r.rendement)}%`).join(", ")}
      >
        <BarChart animationDuration={duur} data={rendement} xDataKey="jaar" aspectRatio="" className={TIJDVORM} barGap={0.35}>
          <Grid horizontal numTicksRows={4} />
          <Bar dataKey="rendement" fill="var(--chart-1)" lineCap={3} />
          <BarXAxis showAllLabels />
          <ChartTooltip
            showDatePill={false}
            rows={(p) => [{ color: "var(--chart-1)", label: "Rendement", value: `${decimaal(p.rendement as number)}%` }]}
          />
        </BarChart>
      </Voorbeeld>
    );
  },
};
