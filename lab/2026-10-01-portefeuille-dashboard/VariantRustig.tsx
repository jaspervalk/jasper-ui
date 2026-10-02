import { useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { cn } from "@/lib/utils";

import { Waardeverloop, datumKort, euro, euroMetTeken, procent, procentMetTeken, punten, tekenKleur } from "./gedeeld";
import {
  type PeriodeId,
  aandacht,
  bijgewerkt,
  perioden,
  posities,
  reeksVoor,
  rendementJaar,
  rendementVandaag,
  resultaatJaar,
  resultaatVandaag,
  totaal,
  transacties,
  verdeling,
} from "./voorbeelddata";

// Verdeling als twee ringen om elkaar heen: buiten nu, binnen het doel. Zo zie je in één blik welke soort groter of
// kleiner is dan bedoeld. Vier tinten van één kleur, gemengd uit het accent en de achtergrond van de huisstijl: petrol
// in de cockpit, grijs in neutraal. Geen eigen kleur per soort (die zou niets betekenen) en in donker geen fel wit
// (--chart-1 is in neutraal donker wit en trekt dan meer aandacht dan het kerncijfer). Dezelfde tint staat als stip
// voor de soort in de tabel. De getallen staan in de tabel; de ringen zijn aria-hidden.
const KLEUREN = [80, 60, 42, 26].map((p) => `color-mix(in oklab, var(--primary) ${p}%, var(--background))`);
const ringNu = verdeling.map((v, i) => ({ label: v.soort, value: v.nu, color: KLEUREN[i] }));
const ringDoel = verdeling.map((v, i) => ({ label: v.soort, value: v.doel, color: KLEUREN[i] }));

function VerdelingRingen({ className }: { className?: string }) {
  const stil = useReducedMotion() ?? false;
  const [actief, setActief] = useState<number | null>(null);
  return (
    <figure className={cn("flex items-center gap-5", className)}>
      <div className="relative size-44 shrink-0">
        <PieChart
          data={ringNu}
          size={176}
          innerRadius={64}
          padAngle={0.012}
          hoverOffset={0}
          hoveredIndex={actief}
          onHoverChange={setActief}
        >
          {ringNu.map((d, i) => (
            <PieSlice key={d.label} index={i} animate={!stil} hoverEffect="none" showGlow={false} />
          ))}
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <PieChart
            data={ringDoel}
            size={112}
            innerRadius={46}
            padAngle={0.012}
            hoverOffset={0}
            hoveredIndex={actief}
            onHoverChange={setActief}
          >
            {ringDoel.map((d, i) => (
              <PieSlice key={d.label} index={i} animate={!stil} hoverEffect="none" showGlow={false} />
            ))}
          </PieChart>
        </div>
      </div>
      <figcaption className="grid gap-1 text-sm text-muted-foreground">
        <span>Buitenring: nu</span>
        <span>Binnenring: doel</span>
      </figcaption>
    </figure>
  );
}

// Rustig: één groot kerncijfer, veel lucht en één accent. Je ziet in drie seconden of het goed gaat en wat aandacht
// vraagt; de details staan eronder, in de volgorde waarin je ze nodig hebt.
export function VariantRustig() {
  const [periode, setPeriode] = useState<PeriodeId>("dj");
  const aandachtId = useId();

  return (
    <div className="bg-background font-sans text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight">Portefeuille</h1>
          <p className="text-sm text-muted-foreground">Bijgewerkt {bijgewerkt}</p>
        </header>

        <main className="mt-10 grid gap-14">
          <section>
            <h2 className="text-sm text-muted-foreground">Totale waarde</h2>
            <p className="mt-1 font-mono text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
              {euro(totaal)}
            </p>
            <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <dt className="text-muted-foreground">Dit jaar</dt>
                <dd className={cn("font-mono tabular-nums", tekenKleur(resultaatJaar))}>
                  {euroMetTeken(resultaatJaar)} ({procentMetTeken(rendementJaar)})
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-muted-foreground">Vandaag</dt>
                <dd className={cn("font-mono tabular-nums", tekenKleur(resultaatVandaag))}>
                  {euroMetTeken(resultaatVandaag)} ({procentMetTeken(rendementVandaag)})
                </dd>
              </div>
              {aandacht.length > 0 ? (
                <div className="flex items-baseline gap-2">
                  <dt className="text-muted-foreground">Aandacht</dt>
                  <dd>
                    <a
                      href={`#${aandachtId}`}
                      className="font-medium underline decoration-warning decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {aandacht.length === 1 ? "1 soort" : `${aandacht.length} soorten`} buiten doel
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-8 rounded-lg border bg-card px-4 pt-4 pb-2 sm:px-6 sm:pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-medium">Waardeverloop</h3>
                <div role="group" aria-label="Periode" className="flex gap-1">
                  {perioden.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={periode === p.id}
                      onClick={() => setPeriode(p.id)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-sm transition-colors duration-150",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        periode === p.id
                          ? "bg-primary-soft font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <Waardeverloop
                reeks={reeksVoor(periode)}
                grafiekKlasse="aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4/1]"
                className="mt-2"
              />
            </div>
          </section>

          <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <section>
              <h2 id={aandachtId} className="scroll-mt-6 text-base font-semibold">
                Aandacht
              </h2>
              {aandacht.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Alles ligt binnen 3 procentpunt van het doel.</p>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {aandacht.map((v) => (
                    <li key={v.soort} className="rounded-r-md border-l-2 border-warning bg-warning-soft px-4 py-3">
                      <p className="font-medium">
                        {v.soort} {v.status.toLowerCase()}
                      </p>
                      <p className="mt-0.5 text-sm">
                        {procent(v.nu)} van de portefeuille, doel {procent(v.doel)}.
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-base font-semibold">Verdeling</h2>
              <div className="mt-4 grid gap-4">
                <VerdelingRingen />
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th scope="col" className="py-2 font-medium">
                        Soort
                      </th>
                      <th scope="col" className="hidden w-2/5 py-2 sm:table-cell">
                        <span className="sr-only">Balk</span>
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
                    </tr>
                  </thead>
                  <tbody>
                    {verdeling.map((v, i) => (
                      <tr key={v.soort} className="border-t">
                        <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                          <span className="flex items-center gap-2">
                            <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: KLEUREN[i] }} />
                            {v.soort}
                          </span>
                        </th>
                        <td className="hidden py-2.5 pr-4 sm:table-cell" aria-hidden>
                          <div className="relative h-1.5 rounded-full bg-muted">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground"
                              style={{ width: `${v.nu * 100}%` }}
                            />
                            <div
                              className="absolute -inset-y-1 w-0.5 bg-foreground"
                              style={{ left: `${v.doel * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{procent(v.nu)}</td>
                        <td className="py-2.5 text-right font-mono text-muted-foreground tabular-nums">
                          {procent(v.doel)}
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums">{punten(v.verschil)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Verschil in procentpunt. Het streepje is het doel.</p>
            </section>
          </div>

          <section>
            <h2 className="text-base font-semibold">Posities</h2>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th scope="col" className="py-2 font-medium">
                    Fonds
                  </th>
                  <th scope="col" className="hidden py-2 font-medium md:table-cell">
                    Soort
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
                  <th scope="col" className="hidden py-2 text-right font-medium md:table-cell">
                    Vandaag
                  </th>
                </tr>
              </thead>
              <tbody>
                {posities.map((p) => (
                  <tr key={p.naam} className="border-t">
                    <th scope="row" className="py-3 pr-4 text-left font-normal">
                      {p.naam}
                    </th>
                    <td className="hidden py-3 pr-4 text-muted-foreground md:table-cell">{p.soort}</td>
                    <td className="py-3 text-right font-mono tabular-nums">{euro(p.waarde)}</td>
                    <td className="hidden py-3 text-right font-mono tabular-nums sm:table-cell">{procent(p.weging)}</td>
                    <td className={cn("py-3 pl-4 text-right font-mono tabular-nums", tekenKleur(p.rendementJaar))}>
                      {procentMetTeken(p.rendementJaar)}
                    </td>
                    <td
                      className={cn(
                        "hidden py-3 pl-4 text-right font-mono tabular-nums md:table-cell",
                        tekenKleur(p.vandaag),
                      )}
                    >
                      {procentMetTeken(p.vandaag)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-foreground/20 font-medium">
                  <th scope="row" className="py-3 text-left">
                    Totaal
                  </th>
                  <td className="hidden md:table-cell" />
                  <td className="py-3 text-right font-mono tabular-nums">{euro(totaal)}</td>
                  <td className="hidden py-3 text-right font-mono tabular-nums sm:table-cell">{procent(1)}</td>
                  <td className={cn("py-3 text-right font-mono tabular-nums", tekenKleur(rendementJaar))}>
                    {procentMetTeken(rendementJaar)}
                  </td>
                  <td
                    className={cn(
                      "hidden py-3 text-right font-mono tabular-nums md:table-cell",
                      tekenKleur(rendementVandaag),
                    )}
                  >
                    {procentMetTeken(rendementVandaag)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section>
            <h2 className="text-base font-semibold">Recent</h2>
            <ul className="mt-3 text-sm">
              {transacties.map((t) => (
                <li
                  key={`${t.datum}-${t.omschrijving}`}
                  className="grid grid-cols-[4rem_minmax(0,1fr)_auto] gap-x-4 border-t py-2.5 sm:grid-cols-[4rem_6rem_minmax(0,1fr)_auto]"
                >
                  <span className="font-mono text-muted-foreground tabular-nums">{datumKort(t.datum)}</span>
                  <span className="hidden text-muted-foreground sm:block">{t.soort}</span>
                  <span className="truncate">
                    <span className="sm:hidden">{t.soort}: </span>
                    {t.omschrijving}
                  </span>
                  <span className="text-right font-mono tabular-nums">{euroMetTeken(t.bedrag, true)}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="mt-14 border-t pt-4 text-xs text-muted-foreground">
          Voorbeeld met verzonnen fondsen en bedragen.
        </footer>
      </div>
    </div>
  );
}
