import { type ReactNode, useId, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Waardeverloop,
  datumKort,
  euro,
  euroMetTeken,
  koers,
  procent,
  procentMetTeken,
  punten,
  stuks,
  tekenKleur,
} from "./gedeeld";
import {
  type PeriodeId,
  type Positie,
  bijgewerkt,
  ingelegdSindsStart,
  liquiditeit,
  perioden,
  posities,
  reeksVoor,
  rendementJaar,
  rendementVandaag,
  resultaatJaar,
  resultaatSindsStart,
  resultaatVandaag,
  totaal,
  transacties,
  verdeling,
} from "./voorbeelddata";

type Kolom = "naam" | "waarde" | "weging" | "resultaatJaar" | "rendementJaar" | "vandaag";
type Filter = "Alle" | "Aandelen" | "Obligaties" | "Overig";

const filters: Filter[] = ["Alle", "Aandelen", "Obligaties", "Overig"];

/** Rendement als tekst; bij een lege selectie een streepje in plaats van NaN. */
const deel = (teller: number, noemer: number) => (noemer === 0 ? "–" : procentMetTeken(teller / noemer));

function past(p: Positie, filter: Filter) {
  if (filter === "Alle") return true;
  if (filter === "Overig") return p.soort === "Vastgoed" || p.soort === "Liquiditeit";
  return p.soort === filter;
}

const knop = cn(
  "rounded px-2 py-0.5 text-xs transition-colors duration-150",
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
);
const gekozen = "bg-primary-soft font-medium text-primary";
const vrij = "text-muted-foreground hover:text-foreground";

function Paneel({
  titel,
  rechts,
  children,
  className,
}: {
  titel: ReactNode;
  rechts?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-md border bg-card", className)}>
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b px-3 py-1.5">
        <h2 className="text-sm font-semibold">{titel}</h2>
        {rechts}
      </div>
      {children}
    </section>
  );
}

function Kerngetal({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("font-mono tabular-nums", className)}>{children}</dd>
    </div>
  );
}

// Compact: alles op één scherm voor wie wil vergelijken en sorteren. Dichte tabel, kleine panelen, kleur alleen voor
// plus, min en aandacht.
export function VariantCompact() {
  const [periode, setPeriode] = useState<PeriodeId>("dj");
  const [filter, setFilter] = useState<Filter>("Alle");
  const [sortering, setSortering] = useState<{ kolom: Kolom; oplopend: boolean }>({ kolom: "waarde", oplopend: false });
  const tabelId = useId();

  const zichtbaar = posities
    .filter((p) => past(p, filter))
    .sort((a, b) => {
      const r =
        sortering.kolom === "naam" ? a.naam.localeCompare(b.naam, "nl") : a[sortering.kolom] - b[sortering.kolom];
      return sortering.oplopend ? r : -r;
    });
  const som = (f: (p: Positie) => number) => zichtbaar.reduce((s, p) => s + f(p), 0);
  const selectie = {
    waarde: som((p) => p.waarde),
    weging: som((p) => p.weging),
    resultaat: som((p) => p.resultaatJaar),
    vandaag: som((p) => p.resultaatVandaag),
  };

  function sorteer(kolom: Kolom) {
    setSortering((s) => (s.kolom === kolom ? { kolom, oplopend: !s.oplopend } : { kolom, oplopend: kolom === "naam" }));
  }

  // Een functie, geen component: een component die binnen een render wordt gemaakt, wordt bij elke render opnieuw
  // gemonteerd en dan raakt de sorteerknop zijn focus kwijt.
  function kop(kolom: Kolom, label: string, { rechts = true, smal = true } = {}) {
    const actief = sortering.kolom === kolom;
    return (
      <th
        key={kolom}
        scope="col"
        aria-sort={actief ? (sortering.oplopend ? "ascending" : "descending") : undefined}
        className={cn(
          "px-2 py-1.5 font-medium whitespace-nowrap",
          rechts ? "text-right" : "text-left",
          !smal && "hidden sm:table-cell",
        )}
      >
        <button
          type="button"
          onClick={() => sorteer(kolom)}
          className={cn(
            "inline-flex items-center gap-0.5 rounded hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            actief && "text-foreground",
          )}
        >
          {label}
          <span aria-hidden className={cn("w-3 text-center", !actief && "invisible")}>
            {sortering.oplopend ? "↑" : "↓"}
          </span>
        </button>
      </th>
    );
  }

  return (
    <div className="bg-background font-sans text-[13px] text-foreground">
      <header className="border-b bg-card">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 px-4 py-2.5">
          <h1 className="text-base font-semibold">Portefeuille</h1>
          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <div className="flex items-baseline">
              <dt className="sr-only">Totale waarde</dt>
              <dd className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{euro(totaal)}</dd>
            </div>
            <Kerngetal label="Vandaag" className={tekenKleur(resultaatVandaag)}>
              {euroMetTeken(resultaatVandaag)} {procentMetTeken(rendementVandaag)}
            </Kerngetal>
            <Kerngetal label="Dit jaar" className={tekenKleur(resultaatJaar)}>
              {euroMetTeken(resultaatJaar)} {procentMetTeken(rendementJaar)}
            </Kerngetal>
            <Kerngetal label="Sinds start" className={tekenKleur(resultaatSindsStart)}>
              {euroMetTeken(resultaatSindsStart)}
            </Kerngetal>
            <Kerngetal label="Ingelegd">{euro(ingelegdSindsStart)}</Kerngetal>
            <Kerngetal label="Liquiditeit">{euro(liquiditeit)}</Kerngetal>
          </dl>
          <p className="text-xs text-muted-foreground xl:ml-auto">Bijgewerkt {bijgewerkt}</p>
        </div>
      </header>

      <main className="grid items-start gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid min-w-0 gap-3">
          <Paneel
            titel={`Posities (${zichtbaar.length})`}
            rechts={
              <div role="group" aria-label="Soort" className="flex gap-0.5">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                    className={cn(knop, filter === f ? gekozen : vrij)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            }
          >
            <div
              role="region"
              aria-labelledby={tabelId}
              tabIndex={0}
              className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            >
              <table className="w-full sm:min-w-[52rem]">
                <caption id={tabelId} className="sr-only">
                  Posities, sorteerbaar per kolom
                </caption>
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    {kop("naam", "Fonds", { rechts: false })}
                    <th scope="col" className="hidden px-2 py-1.5 text-left font-medium sm:table-cell">
                      Soort
                    </th>
                    <th scope="col" className="hidden px-2 py-1.5 text-right font-medium sm:table-cell">
                      Aantal
                    </th>
                    <th scope="col" className="hidden px-2 py-1.5 text-right font-medium sm:table-cell">
                      Koers
                    </th>
                    {kop("waarde", "Waarde")}
                    {kop("weging", "Weging", { smal: false })}
                    {kop("resultaatJaar", "Dit jaar €", { smal: false })}
                    {kop("rendementJaar", "Dit jaar %")}
                    {kop("vandaag", "Vandaag", { smal: false })}
                  </tr>
                </thead>
                <tbody>
                  {zichtbaar.map((p) => (
                    <tr key={p.naam} className="border-b last:border-b-0 hover:bg-muted/50">
                      <th scope="row" className="px-2 py-1.5 text-left font-normal sm:whitespace-nowrap">
                        {p.naam}
                      </th>
                      <td className="hidden px-2 py-1.5 text-muted-foreground sm:table-cell">{p.soort}</td>
                      <td className="hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell">
                        {p.aantal === null ? "–" : stuks(p.aantal)}
                      </td>
                      <td className="hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell">
                        {p.koers === null ? "–" : koers(p.koers)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono tabular-nums">{euro(p.waarde)}</td>
                      <td className="hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell">
                        {procent(p.weging)}
                      </td>
                      <td
                        className={cn(
                          "hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell",
                          tekenKleur(p.resultaatJaar),
                        )}
                      >
                        {euroMetTeken(p.resultaatJaar)}
                      </td>
                      <td className={cn("px-2 py-1.5 text-right font-mono tabular-nums", tekenKleur(p.rendementJaar))}>
                        {procentMetTeken(p.rendementJaar)}
                      </td>
                      <td
                        className={cn(
                          "hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell",
                          tekenKleur(p.vandaag),
                        )}
                      >
                        {procentMetTeken(p.vandaag)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-medium">
                    <th scope="row" className="px-2 py-1.5 text-left">
                      {filter === "Alle" ? "Totaal" : `Totaal ${filter.toLowerCase()}`}
                    </th>
                    <td className="hidden sm:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="px-2 py-1.5 text-right font-mono tabular-nums">{euro(selectie.waarde)}</td>
                    <td className="hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell">
                      {procent(selectie.weging)}
                    </td>
                    <td
                      className={cn(
                        "hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell",
                        tekenKleur(selectie.resultaat),
                      )}
                    >
                      {euroMetTeken(selectie.resultaat)}
                    </td>
                    <td className={cn("px-2 py-1.5 text-right font-mono tabular-nums", tekenKleur(selectie.resultaat))}>
                      {deel(selectie.resultaat, selectie.waarde - selectie.resultaat)}
                    </td>
                    <td
                      className={cn(
                        "hidden px-2 py-1.5 text-right font-mono tabular-nums sm:table-cell",
                        tekenKleur(selectie.vandaag),
                      )}
                    >
                      {deel(selectie.vandaag, selectie.waarde - selectie.vandaag)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Paneel>
          <Paneel titel="Recent">
            <ul>
              {transacties.map((t) => (
                <li
                  key={`${t.datum}-${t.omschrijving}`}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] gap-x-3 border-b px-3 py-1.5 last:border-b-0 sm:grid-cols-[3.5rem_5rem_minmax(0,1fr)_auto]"
                >
                  <span className="font-mono text-muted-foreground tabular-nums">{datumKort(t.datum)}</span>
                  <span className="hidden text-muted-foreground sm:block">{t.soort}</span>
                  <span className="truncate">
                    <span className="text-muted-foreground sm:hidden">{t.soort} </span>
                    {t.omschrijving}
                  </span>
                  <span className="text-right font-mono tabular-nums">{euroMetTeken(t.bedrag, true)}</span>
                </li>
              ))}
            </ul>
          </Paneel>
        </div>

        <div className="grid min-w-0 gap-3">
          <Paneel
            titel="Waardeverloop"
            rechts={
              <div role="group" aria-label="Periode" className="flex gap-0.5">
                {perioden.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={periode === p.id}
                    onClick={() => setPeriode(p.id)}
                    className={cn(knop, periode === p.id ? gekozen : vrij)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            }
          >
            <Waardeverloop reeks={reeksVoor(periode)} aspectRatio="2 / 1" className="px-1" />
          </Paneel>

          <Paneel titel="Verdeling" rechts={<span className="text-xs text-muted-foreground">grens 3 procentpunt</span>}>
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th scope="col" className="px-3 py-1.5 text-left font-medium">
                    Soort
                  </th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">
                    Nu
                  </th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">
                    Doel
                  </th>
                  <th scope="col" className="px-2 py-1.5 text-right font-medium">
                    Verschil
                  </th>
                  <th scope="col" className="px-3 py-1.5 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {verdeling.map((v) => {
                  const letOp = v.status !== "Binnen band";
                  return (
                    <tr key={v.soort} className={cn("border-b last:border-b-0", letOp && "bg-warning-soft")}>
                      <th
                        scope="row"
                        className={cn(
                          "px-3 py-1.5 text-left font-normal",
                          letOp && "shadow-[inset_2px_0_0_var(--warning)]",
                        )}
                      >
                        {v.soort}
                      </th>
                      <td className="px-2 py-1.5 text-right font-mono tabular-nums">{procent(v.nu)}</td>
                      <td
                        className={cn(
                          "px-2 py-1.5 text-right font-mono tabular-nums",
                          !letOp && "text-muted-foreground",
                        )}
                      >
                        {procent(v.doel)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono tabular-nums">{punten(v.verschil)}</td>
                      <td className={cn("px-3 py-1.5", letOp ? "font-medium" : "text-muted-foreground")}>{v.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Paneel>
        </div>
      </main>

      <footer className="px-4 pb-3 text-xs text-muted-foreground">Voorbeeld met verzonnen fondsen en bedragen.</footer>
    </div>
  );
}
