import { type CSSProperties, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Waardeverloop,
  datumKort,
  euro,
  euroMetTeken,
  procent,
  procentMetTeken,
  procentpunt,
  punten,
  tekenKleur,
} from "./gedeeld";
import {
  type PeriodeId,
  aandacht,
  bijgewerkt,
  ingelegdDitJaar,
  perioden,
  posities,
  reeksVoor,
  rendementJaar,
  rendementVandaag,
  resultaatJaar,
  totaal,
  transacties,
  verdeling,
} from "./voorbeelddata";

// Op de band van het accent krijgt de grafiek de voorgrondkleur van die band: labels, raster en draadkruis. Alleen
// bestaande tokens, zodat de band in elke huisstijl en in donker meeschakelt.
const opBand = {
  "--chart-label": "var(--primary-foreground)",
  "--chart-grid": "color-mix(in oklab, var(--primary-foreground) 22%, transparent)",
  "--chart-crosshair": "var(--primary-foreground)",
} as CSSProperties;

const segmentKleur = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

const bijdragen = [...posities].sort((a, b) => b.resultaatJaar - a.resultaatJaar);
const maxPlus = Math.max(0, ...bijdragen.map((p) => p.resultaatJaar));
const maxMin = Math.max(0, ...bijdragen.map((p) => -p.resultaatJaar));
const bereik = maxPlus + maxMin;
const nulpunt = (maxMin / bereik) * 100;
const grootste = bijdragen[0];

// Uitgesproken: het accent draagt de bovenkant van de pagina en elke sectie opent met een zin. Staven laten zien
// wat het rendement maakte; de verdeling staat als twee balken onder elkaar, nu en doel.
export function VariantUitgesproken() {
  const [periode, setPeriode] = useState<PeriodeId>("dj");

  return (
    <div className="bg-background font-sans text-foreground">
      <main>
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm">
              <h1 className="font-semibold">Portefeuille</h1>
              <p>Bijgewerkt {bijgewerkt}</p>
            </div>

            <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-16">
              <div>
                <p className="sr-only">Totale waarde</p>
                <p className="font-display text-6xl font-semibold tracking-tight tabular-nums sm:text-8xl">
                  {euro(totaal)}
                </p>
                <p className="mt-5 max-w-md font-display text-xl leading-snug sm:text-2xl">
                  {procentMetTeken(rendementJaar)} dit jaar: {euro(resultaatJaar)} rendement en {euro(ingelegdDitJaar)}{" "}
                  ingelegd. Vandaag {procentMetTeken(rendementVandaag)}.
                </p>
              </div>

              <div>
                <div role="group" aria-label="Periode" className="flex gap-2">
                  {perioden.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={periode === p.id}
                      onClick={() => setPeriode(p.id)}
                      className={cn(
                        "rounded-full px-3.5 py-1 text-sm font-medium ring-1 transition-colors duration-150",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground",
                        periode === p.id
                          ? "bg-primary-foreground text-primary ring-primary-foreground"
                          : "ring-primary-foreground/40 hover:ring-primary-foreground",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <Waardeverloop
                  reeks={reeksVoor(periode)}
                  kleur="var(--primary-foreground)"
                  aspectRatio="5 / 2"
                  rasterlijnen={false}
                  className="mt-4"
                  style={opBand}
                  bijschriftKlasse=""
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-10 sm:py-20">
          <h2 className="max-w-3xl font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            {grootste.naam} leverde {Math.round((grootste.resultaatJaar / resultaatJaar) * 100)}% van het rendement.
          </h2>
          <p className="mt-3 text-muted-foreground">Resultaat per fonds sinds 1 januari.</p>

          <ol className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_6.5rem] sm:gap-y-3">
            {bijdragen.map((p) => (
              <li key={p.naam} className="grid grid-cols-subgrid items-center gap-y-1.5 sm:col-span-3">
                <span className="flex items-baseline justify-between gap-4 sm:block">
                  <span className="truncate">{p.naam}</span>
                  <span className={cn("font-mono tabular-nums sm:hidden", tekenKleur(p.resultaatJaar))}>
                    {euroMetTeken(p.resultaatJaar)}
                  </span>
                </span>
                <span aria-hidden className="relative h-7">
                  <span className="absolute inset-y-0 w-px bg-foreground/30" style={{ left: `${nulpunt}%` }} />
                  <span
                    className={cn(
                      "absolute inset-y-1 rounded-sm",
                      p.resultaatJaar >= 0 ? "bg-positive" : "bg-negative",
                    )}
                    style={{
                      left: `${p.resultaatJaar >= 0 ? nulpunt : nulpunt - (-p.resultaatJaar / bereik) * 100}%`,
                      width: `${(Math.abs(p.resultaatJaar) / bereik) * 100}%`,
                    }}
                  />
                </span>
                <span className={cn("hidden text-right font-mono tabular-nums sm:block", tekenKleur(p.resultaatJaar))}>
                  {euroMetTeken(p.resultaatJaar)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-muted">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-10 sm:py-20">
            <h2 className="max-w-3xl font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {aandacht.length === 0
                ? "De verdeling ligt op koers."
                : `${aandacht.length === 2 ? "Twee soorten wijken" : "Eén soort wijkt"} meer dan 3 procentpunt af van het doel.`}
            </h2>

            <div className="mt-10 grid gap-3">
              {(
                [
                  ["Nu", "nu", "h-14"],
                  ["Doel", "doel", "h-6"],
                ] as const
              ).map(([label, sleutel, hoogte]) => (
                <div key={label} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-4">
                  <span className="text-sm font-medium">{label}</span>
                  <div aria-hidden className={cn("flex gap-0.5 overflow-hidden rounded-md", hoogte)}>
                    {verdeling.map((v, i) => (
                      <span key={v.soort} style={{ width: `${v[sleutel] * 100}%`, background: segmentKleur[i] }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <table className="mt-8 w-full max-w-3xl text-sm">
              <thead>
                <tr className="text-left text-xs">
                  <th scope="col" className="py-2 font-medium">
                    Soort
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Nu
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Doel
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Verschil
                  </th>
                  <th scope="col" className="hidden py-2 pl-6 font-medium sm:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {verdeling.map((v, i) => (
                  <tr key={v.soort} className="border-t border-foreground/15">
                    <th scope="row" className="py-2.5 text-left font-normal">
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden className="size-3 rounded-sm" style={{ background: segmentKleur[i] }} />
                        {v.soort}
                      </span>
                    </th>
                    <td className="py-2.5 text-right font-mono tabular-nums">{procent(v.nu)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{procent(v.doel)}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{punten(v.verschil)}</td>
                    <td
                      className={cn("hidden py-2.5 pl-6 sm:table-cell", v.status !== "Binnen band" && "font-semibold")}
                    >
                      {v.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {aandacht.length > 0 ? (
              <ol className="mt-12 grid gap-8 md:grid-cols-2">
                {aandacht.map((v, i) => (
                  <li key={v.soort} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5">
                    <span aria-hidden className="font-mono text-3xl font-semibold text-warning tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-xl leading-snug font-semibold">
                        {v.soort} staan {procentpunt(v.verschil)} procentpunt {v.verschil > 0 ? "boven" : "onder"} het
                        doel.
                      </p>
                      <p className="mt-1.5">
                        {procent(v.nu)} nu, {procent(v.doel)} doel.{" "}
                        {v.verschil > 0
                          ? "Bijsturen kan door nieuwe inleg elders te beleggen."
                          : "Bijsturen kan door nieuwe inleg hier te beleggen."}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-4 py-14 sm:px-10 sm:py-20 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Posities</h2>
            <table className="mt-4 w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th scope="col" className="py-2 font-medium">
                    Fonds
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Waarde
                  </th>
                  <th scope="col" className="hidden py-2 text-right font-medium sm:table-cell">
                    Weging
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Dit jaar
                  </th>
                </tr>
              </thead>
              <tbody>
                {posities.map((p) => (
                  <tr key={p.naam} className="border-t">
                    <th scope="row" className="py-3 pr-4 text-left font-normal">
                      <span className="block">{p.naam}</span>
                      <span className="block text-xs text-muted-foreground">{p.soort}</span>
                    </th>
                    <td className="py-3 text-right font-mono text-sm tabular-nums">{euro(p.waarde)}</td>
                    <td className="hidden py-3 text-right font-mono text-sm tabular-nums sm:table-cell">
                      {procent(p.weging)}
                    </td>
                    <td
                      className={cn("py-3 pl-4 text-right font-mono text-sm tabular-nums", tekenKleur(p.rendementJaar))}
                    >
                      {procentMetTeken(p.rendementJaar)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-foreground font-semibold">
                  <th scope="row" className="py-3 text-left">
                    Totaal
                  </th>
                  <td className="py-3 text-right font-mono text-sm tabular-nums">{euro(totaal)}</td>
                  <td className="hidden py-3 text-right font-mono text-sm tabular-nums sm:table-cell">{procent(1)}</td>
                  <td className={cn("py-3 text-right font-mono text-sm tabular-nums", tekenKleur(rendementJaar))}>
                    {procentMetTeken(rendementJaar)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Recent</h2>
            <ol className="mt-4 grid gap-5">
              {transacties.map((t) => (
                <li key={`${t.datum}-${t.omschrijving}`} className="grid gap-0.5">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-medium">{t.soort}</span>
                    <span className="font-mono text-sm tabular-nums">{euroMetTeken(t.bedrag, true)}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {datumKort(t.datum)} · {t.omschrijving}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 sm:px-10">
        <p className="border-t pt-4 text-xs text-muted-foreground">Voorbeeld met verzonnen fondsen en bedragen.</p>
      </footer>
    </div>
  );
}
