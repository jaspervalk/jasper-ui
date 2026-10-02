import type { Meta, StoryObj } from "@storybook/react-vite";
import { ParentSize } from "@visx/responsive";
import type { FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
// Landsgrenzen uit world-atlas (Natural Earth, publiek domein; pakket ISC), meegeleverd als devDependency. Niets
// wordt tijdens het draaien van internet geladen.
import wereldTopo from "world-atlas/countries-110m.json";

import {
  ChoroplethChart,
  type ChoroplethFeature,
  ChoroplethFeatureComponent,
  type ChoroplethFeatureProperties,
  ChoroplethTooltip,
} from "@/components/charts/choropleth";

import { Sleutel, Voorbeeld, beschrijving, bibliotheekDecorators, useAnimatieduur, getal } from "./gedeeld";

const topo = wereldTopo as unknown as Topology<{ countries: GeometryCollection<ChoroplethFeatureProperties> }>;
const wereld = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, ChoroplethFeatureProperties>;

// Verzonnen: bezoekers van de site van een festival in september, per land. Sleutel = naam in world-atlas.
const bezoekers: Record<string, { naam: string; aantal: number }> = {
  Netherlands: { naam: "Nederland", aantal: 18400 },
  Belgium: { naam: "België", aantal: 3900 },
  Germany: { naam: "Duitsland", aantal: 2700 },
  "United Kingdom": { naam: "Verenigd Koninkrijk", aantal: 1100 },
  France: { naam: "Frankrijk", aantal: 820 },
  Spain: { naam: "Spanje", aantal: 410 },
  Denmark: { naam: "Denemarken", aantal: 260 },
  Italy: { naam: "Italië", aantal: 240 },
  Switzerland: { naam: "Zwitserland", aantal: 160 },
  Poland: { naam: "Polen", aantal: 150 },
  Sweden: { naam: "Zweden", aantal: 130 },
  Austria: { naam: "Oostenrijk", aantal: 110 },
  Ireland: { naam: "Ierland", aantal: 90 },
  Norway: { naam: "Noorwegen", aantal: 70 },
  Portugal: { naam: "Portugal", aantal: 60 },
};

const STAPPEN = [
  { vanaf: 10000, kleur: "var(--chart-scale-05)", label: "10.000 of meer" },
  { vanaf: 1000, kleur: "var(--chart-scale-04)", label: "1.000 tot 10.000" },
  { vanaf: 200, kleur: "var(--chart-scale-03)", label: "200 tot 1.000" },
  { vanaf: 1, kleur: "var(--chart-scale-02)", label: "minder dan 200" },
];
const GEEN = "var(--chart-scale-01)";

const naamVan = (f: ChoroplethFeature) => String(f.properties?.name ?? "");
const kleurVan = (f: ChoroplethFeature) => {
  const aantal = bezoekers[naamVan(f)]?.aantal ?? 0;
  return STAPPEN.find((s) => aantal >= s.vanaf)?.kleur ?? GEEN;
};

const meta = {
  title: "Bibliotheek/Bklit/Kaart (choropleth)",
  tags: ["autodocs"],
  decorators: bibliotheekDecorators(),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: beschrijving({
          naam: "choropleth-chart",
          wat: "landen (of andere gebieden) gekleurd naar een getal, op een kaart.",
          waarvoor:
            "waar iets vandaan komt: bezoekers per land, kopers per regio. Alleen als de plek ertoe doet; anders is een gesorteerde lijst duidelijker.",
          beperkingen:
            "Bklit levert geen kaart mee. Hun eigen voorbeeld haalt de landsgrenzen tijdens het draaien van GitHub op; hier komen ze uit het pakket `world-atlas` (devDependency, Natural Earth, publiek domein), dus zonder internet. Kleine landen zoals Nederland zijn op een wereldkaart klein: zoom in met `center` en `scale`. Landnamen in de data zijn Engels; vertaal ze in de tooltip (`getFeatureName`). Kleuren zelf kiezen per waarde (`getFeatureColor`), anders krijgt elk land een willekeurige tint. De svg is `aria-hidden` en reageert alleen op de muis: zet de getallen ook in een lijst.",
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const lijst = Object.values(bezoekers).sort((a, b) => b.aantal - a.aantal);

export const BezoekersPerLand: Story = {
  name: "Bezoekers per land",
  render: function Render() {
    const duur = useAnimatieduur();
    return (
      <Voorbeeld
        titel="Bezoekers van de festivalsite, september"
        uitleg="Ingezoomd op Europa. Donkerder is meer bezoekers; wijs een land aan voor het getal."
        samenvatting={lijst.map((l) => `${l.naam} ${getal(l.aantal)}`).join(", ")}
      >
        <div className="w-full">
          <ParentSize debounceTime={10}>
            {({ width }) =>
              width > 0 ? (
                <ChoroplethChart animationDuration={duur}
                  data={wereld}
                  aspectRatio="4 / 3"
                  center={[10, 52]}
                  scale={width * 1.05}
                  translate={[width / 2, (width * 3) / 8]}
                >
                  <ChoroplethFeatureComponent getFeatureColor={kleurVan} stroke="var(--background)" strokeWidth={0.6} />
                  <ChoroplethTooltip
                    valueLabel="Bezoekers"
                    getFeatureName={(f) => bezoekers[naamVan(f)]?.naam ?? naamVan(f)}
                    getFeatureValue={(f) => bezoekers[naamVan(f)]?.aantal ?? 0}
                    formatValue={getal}
                  />
                </ChoroplethChart>
              ) : null
            }
          </ParentSize>
        </div>
        <Sleutel items={STAPPEN.map((s) => ({ label: s.label, kleur: s.kleur }))} />
      </Voorbeeld>
    );
  },
};
