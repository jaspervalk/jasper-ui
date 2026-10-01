import type { Meta, StoryObj } from "@storybook/react-vite";
import { curveMonotoneX } from "@visx/curve";

import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { LineChart } from "@/components/charts/line-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";

import registry from "../registry.json";

// De waarden komen rechtstreeks uit registry.json, zodat de catalogus altijd toont wat het register uitlevert.
const item = registry.items.find((i) => i.name === "chart-thema");
if (!item) throw new Error("chart-thema ontbreekt in registry.json");
const licht: Record<string, string> = item.cssVars.light;
const donker: Record<string, string> = item.cssVars.dark;

const groepen: { titel: string; namen: string[] }[] = [
  { titel: "Reeksen", namen: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  {
    titel: "Vlak, tekst en hulplijnen",
    namen: ["chart-background", "chart-foreground", "chart-foreground-muted", "chart-label", "chart-grid", "chart-crosshair"],
  },
  {
    titel: "Tooltip en markers",
    namen: [
      "chart-tooltip-background",
      "chart-tooltip-foreground",
      "chart-tooltip-muted",
      "chart-marker-background",
      "chart-marker-border",
      "chart-marker-foreground",
    ],
  },
  {
    titel: "Schaal (heatmap)",
    namen: ["chart-scale-01", "chart-scale-02", "chart-scale-03", "chart-scale-04", "chart-scale-05", "chart-scale-pattern-color"],
  },
];

function Kleurstalen({ isDonker }: { isDonker: boolean }) {
  return (
    <div className="grid max-w-4xl gap-8">
      {groepen.map((groep) => (
        <section key={groep.titel} className="grid gap-3">
          <h2 className="text-sm font-semibold">{groep.titel}</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {groep.namen.map((naam) => {
              const eigen = isDonker ? donker[naam] : licht[naam];
              return (
                <li key={naam} className="flex items-center gap-3 rounded-lg border bg-card p-2">
                  <span
                    aria-hidden
                    className="size-10 shrink-0 rounded-md border"
                    style={{ background: `var(--${naam})` }}
                  />
                  <span className="grid min-w-0 gap-0.5">
                    <code className="truncate font-mono text-xs">--{naam}</code>
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {eigen ?? `${licht[naam]} (zelfde als licht)`}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// Verzonnen voorbeelddata: twee reeksen per maand, geen echte cijfers.
const voorbeeld = [
  { date: new Date("2026-01-01"), a: 120, b: 90 },
  { date: new Date("2026-02-01"), a: 135, b: 96 },
  { date: new Date("2026-03-01"), a: 118, b: 104 },
  { date: new Date("2026-04-01"), a: 146, b: 101 },
  { date: new Date("2026-05-01"), a: 152, b: 117 },
  { date: new Date("2026-06-01"), a: 149, b: 125 },
  { date: new Date("2026-07-01"), a: 168, b: 121 },
  { date: new Date("2026-08-01"), a: 174, b: 133 },
];

const meta = {
  title: "Catalogus/chart-thema",
  parameters: {
    docs: {
      description: {
        component:
          "De CSS-variabelen van de Bklit-grafieken, licht en donker. Toevoegen met `npx shadcn@latest add @jasper/chart-thema`. Kleurwaarden uit Bklit UI (MIT, © Matt Litherland).",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kleuren: Story = {
  render: (_, { globals }) => <Kleurstalen isDonker={globals.theme === "donker"} />,
};

export const Grafiek: Story = {
  render: () => (
    <figure className="grid max-w-3xl gap-3">
      <figcaption className="text-sm text-muted-foreground">
        Bklit-lijngrafiek in deze kleuren. Voorbeelddata, verzonnen.
      </figcaption>
      <LineChart data={voorbeeld}>
        <Grid horizontal />
        <Line dataKey="a" curve={curveMonotoneX} stroke="var(--chart-line-primary)" />
        <Line dataKey="b" curve={curveMonotoneX} stroke="var(--chart-line-secondary)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </figure>
  ),
};
