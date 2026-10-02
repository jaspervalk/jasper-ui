import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RadarArea } from "@/components/charts/radar-area";
import { RadarAxis } from "@/components/charts/radar-axis";
import { RadarChart } from "@/components/charts/radar-chart";
import { RadarGrid } from "@/components/charts/radar-grid";
import { RadarLabels } from "@/components/charts/radar-labels";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators } from "./gedeeld";

// Verzonnen: twee fondsen die niet bestaan, gescoord van 0 tot 100 op vijf punten (hoger is beter, ook bij kosten:
// 100 = heel goedkoop).
const punten = [
  { key: "kosten", label: "Lage kosten" },
  { key: "spreiding", label: "Spreiding" },
  { key: "duurzaam", label: "Duurzaam" },
  { key: "rendement", label: "Rendement 5 jaar" },
  { key: "rust", label: "Rustig koersverloop" },
];
const fondsen = [
  {
    label: "Noordkaap Wereld",
    color: "var(--chart-1)",
    values: { kosten: 88, spreiding: 92, duurzaam: 54, rendement: 71, rust: 66 },
  },
  {
    label: "Lindeboom Duurzaam",
    color: "var(--chart-3)",
    values: { kosten: 58, spreiding: 61, duurzaam: 94, rendement: 63, rust: 72 },
  },
];

const meta = {
  title: "Bibliotheek/Bklit/Radargrafiek",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "radar-chart",
          wat: "een profiel op vijf tot acht punten tegelijk, als een vlak in een web. Twee vlakken over elkaar laten het verschil in vorm zien.",
          waarvoor:
            "twee of drie dingen vergelijken op dezelfde punten: fondsen, locaties voor een festival, offertes. Alleen als alle punten dezelfde schaal hebben (0 tot 100) en hoger op elk punt beter is.",
          beperkingen:
            "de waarden moeten tussen 0 en 100 liggen. De oppervlakte overdrijft verschillen en hangt af van de volgorde van de punten. Labels staan buiten de cirkel en worden op een smal scherm krap. De svg reageert alleen op de muis; geef de scores ook als tabel.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TweeFondsen: Story = {
  name: "Twee fondsen",
  render: function Render() {
    const [actief, setActief] = useState<number | null>(null);
    return (
      <Voorbeeld
        titel="Twee fondsen naast elkaar"
        uitleg="Het ene fonds is goedkoop en breed gespreid, het andere duurzamer. Wijs een vlak aan om het naar voren te halen."
        samenvatting={fondsen
          .map((f) => `${f.label}: ${punten.map((p) => `${p.label} ${f.values[p.key as keyof typeof f.values]}`).join(", ")}`)
          .join(". ")}
      >
        <div className="mx-auto w-full max-w-md">
          <RadarChart data={fondsen} metrics={punten} margin={64} hoveredIndex={actief} onHoverChange={setActief}>
            <RadarGrid />
            <RadarAxis />
            <RadarLabels fontSize={11} offset={18} />
            {fondsen.map((f, i) => (
              <RadarArea key={f.label} index={i} showGlow={false} />
            ))}
          </RadarChart>
        </div>
        <Sleutel className="justify-center" items={fondsen.map((f) => ({ label: f.label, kleur: f.color }))} />
      </Voorbeeld>
    );
  },
};
