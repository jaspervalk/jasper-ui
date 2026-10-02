import type { Meta, StoryObj } from "@storybook/react-vite";

import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from "@/components/charts/sankey";
import { TooltipContent } from "@/components/charts/tooltip";

import { Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, getal } from "./gedeeld";

// Verzonnen: waar de stroom van een huis in september vandaan kwam en waar hij heen ging (kWh). Links de bronnen,
// rechts het gebruik; wat erin gaat, gaat er ook uit (570 kWh).
const stroom = {
  nodes: [
    { name: "Zonnepanelen", category: "source" as const },
    { name: "Net", category: "source" as const },
    { name: "Warmtepomp" },
    { name: "Auto" },
    { name: "Huis" },
    { name: "Terug aan het net" },
  ],
  links: [
    { source: 0, target: 2, value: 90 },
    { source: 0, target: 3, value: 60 },
    { source: 0, target: 4, value: 81 },
    { source: 0, target: 5, value: 79 },
    { source: 1, target: 2, value: 92 },
    { source: 1, target: 3, value: 80 },
    { source: 1, target: 4, value: 88 },
  ],
};

// d3-sankey vervangt de indexen in `source` en `target` door de knopen zelf; het type zegt nog `number`.
const knoopnaam = (k: unknown) =>
  typeof k === "number" ? (stroom.nodes[k]?.name ?? "") : ((k as { name?: string } | null)?.name ?? "");

const kleuren = ["var(--chart-1)", "var(--chart-3)", "var(--chart-2)", "var(--chart-2)", "var(--chart-2)", "var(--chart-4)"];

const meta = {
  title: "Bibliotheek/Bklit/Stroomdiagram (sankey)",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "sankey-chart",
          wat: "stromen van bronnen naar bestemmingen. De dikte van elke band is de hoeveelheid.",
          waarvoor:
            "laten zien waar iets vandaan komt en waar het heen gaat: stroom van zon en net naar apparaten, geld van inkomen naar potjes, bezoekers van kanalen naar pagina's.",
          beperkingen:
            "met meer dan een stuk of acht knopen wordt het een kluwen. De namen staan naast de knopen; onder ongeveer 540 px breed lopen ze door elkaar, daarom schuift deze story op een telefoon opzij (`min-w` met `overflow-x-auto`). Standaard staat er *sessions* onder elke knoop en *Sessions* en *Flow* in de tooltip: geef `formatValue` mee aan `SankeyNode` (in onze kopie toegevoegd, `sankey-node.tsx`) en eigen inhoud aan de tooltip (`nodeContent`, `linkContent`), zoals hier. Bronnen moeten `category: \"source\"` hebben, anders staat er 0 onder. De svg is `aria-hidden` en reageert alleen op de muis; zet de getallen ook als tekst of tabel in de pagina.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stroom: Story = {
  name: "Van bron naar gebruik",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Waar de stroom heen ging, september"
        uitleg="Links waar hij vandaan kwam, rechts waar hij heen ging. Wijs een band aan voor het getal."
        samenvatting="Zonnepanelen 310 kWh: 90 naar de warmtepomp, 60 naar de auto, 81 naar het huis en 79 terug aan het net. Net 260 kWh: 92 naar de warmtepomp, 80 naar de auto, 88 naar het huis."
      >
        {/* Op een telefoon is de sankey te smal voor de namen naast de knopen: daar schuift hij opzij. */}
        <div
          // biome-ignore lint/a11y/noNoninteractiveTabindex: een schuifvlak moet met het toetsenbord te bedienen zijn
          tabIndex={0}
          role="region"
          aria-label="Stroomdiagram, schuif opzij voor alles"
          className="overflow-x-auto rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <SankeyChart
            animationDuration={duur}
            data={stroom}
            aspectRatio="2 / 1"
            nodeWidth={12}
            nodePadding={20}
            className="min-w-[34rem]"
          >
            <SankeyLink getNodeColor={(_, i) => kleuren[i] ?? "var(--chart-3)"} strokeOpacity={0.35} />
            <SankeyNode getNodeColor={(_, i) => kleuren[i] ?? "var(--chart-3)"} formatValue={(v) => `${getal(v)} kWh`} />
            <SankeyTooltip
              nodeContent={({ node, index }) => (
                <TooltipContent
                  title={node.name}
                  rows={[{ color: kleuren[index] ?? "var(--chart-3)", label: "Totaal", value: `${getal(node.value ?? 0)} kWh` }]}
                />
              )}
              linkContent={({ link }) => {
                const van = knoopnaam(link.source);
                const naar = knoopnaam(link.target);
                return (
                  <TooltipContent
                    title={`${van} → ${naar}`}
                    rows={[{ color: "var(--chart-foreground-muted)", label: "Stroom", value: `${getal(link.value)} kWh` }]}
                  />
                );
              }}
            />
          </SankeyChart>
        </div>
      </Voorbeeld>
    );
  },
};
