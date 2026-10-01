import { curveMonotoneX } from "@visx/curve";
import { useReducedMotion } from "motion/react";
import { type CSSProperties, useMemo } from "react";

import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { LineChart } from "@/components/charts/line-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";
import { cn } from "@/lib/utils";

import type { Punt } from "./voorbeelddata";

// Opmaak zoals in de cockpit: nl-NL, een echt minteken (−) en een plus bij winst.
const NL = "nl-NL";
const euroHeel = new Intl.NumberFormat(NL, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const euroCent = new Intl.NumberFormat(NL, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const getal1 = new Intl.NumberFormat(NL, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const getal2 = new Intl.NumberFormat(NL, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const heel = new Intl.NumberFormat(NL, { maximumFractionDigits: 0 });
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

const teken = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "");

export const euro = (v: number, cent = false) => (cent ? euroCent : euroHeel).format(v).replace("-", "−");
export const euroMetTeken = (v: number, cent = false) =>
  `${teken(v)}${(cent ? euroCent : euroHeel).format(Math.abs(v))}`;
export const procent = (fractie: number) => `${getal1.format(fractie * 100)}%`;
export const procentMetTeken = (fractie: number) => `${teken(fractie)}${getal1.format(Math.abs(fractie) * 100)}%`;
/** Procentpunt met teken, zonder eenheid: +5,8 */
export const punten = (fractie: number) => `${teken(fractie)}${getal1.format(Math.abs(fractie) * 100)}`;
/** Procentpunt zonder teken: 5,8 */
export const procentpunt = (fractie: number) => getal1.format(Math.abs(fractie) * 100);
export const koers = (v: number) => getal2.format(v);
export const stuks = (v: number) => heel.format(v);

/** "28 sep" uit een ISO-datum. */
export function datumKort(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MAANDEN[m - 1]}`;
}

/** "2 okt 2025" uit een Date (UTC, zoals de reeks). */
export function datumLang(datum: Date) {
  return `${datum.getUTCDate()} ${MAANDEN[datum.getUTCMonth()]} ${datum.getUTCFullYear()}`;
}

/** Kleur op teken: gedempt groen boven nul, gedempt rood onder nul. */
export const tekenKleur = (v: number) => (v > 0 ? "text-positive" : v < 0 ? "text-negative" : "");

interface WaardeverloopProps {
  reeks: Punt[];
  /** Kleur van de lijn. Default: het accent van de huisstijl. */
  kleur?: string;
  aspectRatio?: string;
  /** Klassen voor de grafiek zelf, bijvoorbeeld een andere verhouding per breakpoint. Overschrijft `aspectRatio`. */
  grafiekKlasse?: string;
  rasterlijnen?: boolean;
  className?: string;
  /** Om grafiekvariabelen lokaal om te zetten, bijvoorbeeld op een gekleurde band. */
  style?: CSSProperties;
  /** Klassen voor het bijschrift met laagste en hoogste punt. Default: gedempte tekst. */
  bijschriftKlasse?: string;
}

// De Bklit-lijngrafiek met de waarde per week. Bklit laat de y-as bij positieve data altijd bij 0 beginnen; dan is
// een schommeling van een paar procent een platte streep bovenin. Daarom tekent de lijn `hoogte` (de waarde min een
// basis net onder het laagste punt) en toont de tooltip de echte waarde. Er staan geen getallen op de y-as, dus de
// verschuiving is nergens zichtbaar als getal; het bijschrift noemt het laagste en hoogste punt, zodat je de schaal
// kent. Met prefers-reduced-motion geen onthulanimatie: de lijn zelf
// respecteert die instelling al, de onthulling van links naar rechts niet.
export function Waardeverloop({
  reeks,
  kleur = "var(--primary)",
  aspectRatio = "3 / 1",
  grafiekKlasse,
  rasterlijnen = true,
  className,
  style,
  bijschriftKlasse = "text-muted-foreground",
}: WaardeverloopProps) {
  const rustig = useReducedMotion();
  const data = useMemo(() => {
    const waarden = reeks.map((p) => p.waarde);
    const laag = Math.min(...waarden);
    const basis = laag - (Math.max(...waarden) - laag) * 0.2;
    return reeks.map((p) => ({ ...p, hoogte: p.waarde - basis }));
  }, [reeks]);
  const eerste = reeks[0];
  const laatste = reeks[reeks.length - 1];
  const laagste = reeks.reduce((a, b) => (b.waarde < a.waarde ? b : a));
  const hoogste = reeks.reduce((a, b) => (b.waarde > a.waarde ? b : a));
  return (
    <figure className={className} style={style}>
      <LineChart
        data={data as unknown as Record<string, unknown>[]}
        aspectRatio={grafiekKlasse ? "" : aspectRatio}
        className={grafiekKlasse}
        animationDuration={rustig ? 0 : 700}
        margin={{ top: 12, right: 24, bottom: 36, left: 24 }}
      >
        {rasterlijnen ? <Grid horizontal numTicksRows={4} /> : null}
        <Line dataKey="hoogte" curve={curveMonotoneX} stroke={kleur} strokeWidth={2} fadeEdges={false} />
        <XAxis numTicks={6} />
        <ChartTooltip rows={(p) => [{ color: kleur, label: "Waarde", value: euro(p.waarde as number) }]} />
      </LineChart>
      <figcaption className={cn("flex flex-wrap gap-x-4 gap-y-0.5 px-1 pb-1 text-xs", bijschriftKlasse)}>
        <span className="sr-only">
          Waarde per week, van {euro(eerste.waarde)} op {datumLang(eerste.date)} tot {euro(laatste.waarde)} op{" "}
          {datumLang(laatste.date)}.
        </span>
        <span>
          Laagste <span className="font-mono tabular-nums">{euro(laagste.waarde)}</span> ({datumLang(laagste.date)})
        </span>
        <span>
          Hoogste <span className="font-mono tabular-nums">{euro(hoogste.waarde)}</span> ({datumLang(hoogste.date)})
        </span>
      </figcaption>
    </figure>
  );
}
