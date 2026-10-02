import "@fontsource-variable/big-shoulders-display";
import "@fontsource-variable/inter";
import "./merk.css";

import { type ReactNode, useRef } from "react";

import { gsap, ScrollTrigger, SplitText, useBeweging } from "@/lib/beweging";
import { cn } from "@/lib/utils";

import { cijfers, dagen, festival, films, manifest, plek, tickets, voet } from "../inhoud";
import { HalTekening } from "./HalTekening";

// Werfkino als festivalaffiche om te scrollen: reuzenletters in één felle kleur, vlakken als drukwerk, en een
// programma dat oplicht waar je bent. Twee bewegingen, niet meer: de kop bij het laden en het programma bij het scrollen.

const secties = [
  { naam: "Programma", doel: "#affiche-programma" },
  { naam: "Hal 4", doel: "#affiche-plek" },
  { naam: "Vier dagen", doel: "#affiche-dagen" },
  { naam: "Tickets", doel: festival.cta.doel },
];

const kopletter = "font-(family-name:--merk-kop) font-black uppercase";
const label = "text-[13px] font-semibold uppercase tracking-[0.14em]";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4";

export function Pagina() {
  const wortel = useRef<HTMLDivElement>(null);
  const kop = useRef<HTMLHeadingElement>(null);
  const lijst = useRef<HTMLOListElement>(null);

  useBeweging(
    () => {
      // 1. De affichekop: de letters komen kort na elkaar omhoog uit hun masker.
      if (kop.current) {
        SplitText.create(kop.current, {
          type: "chars",
          mask: "chars",
          charsClass: "kop-letter",
          autoSplit: true,
          onSplit: (split) =>
            gsap.from(split.chars, { yPercent: 135, duration: 1.15, ease: "expo.out", stagger: 0.055, delay: 0.15 }),
        });
      }

      // 2. Het programma: de film in het midden van het scherm licht op, de rest treedt terug. Alleen zolang het
      // midden van het scherm in de lijst valt; daarbuiten staat alles in inkt.
      const ol = lijst.current;
      if (!ol) return;
      const rijen = gsap.utils.toArray<HTMLElement>(ol.children);
      ScrollTrigger.create({
        trigger: ol,
        start: "top center",
        end: "bottom center",
        onToggle: (st) => ol.toggleAttribute("data-oplichten", st.isActive),
      });
      for (const rij of rijen) {
        ScrollTrigger.create({
          trigger: rij,
          start: "top center",
          end: "bottom center",
          onToggle: (st) => rij.toggleAttribute("data-actief", st.isActive),
        });
      }
      return () => {
        ol.removeAttribute("data-oplichten");
        for (const rij of rijen) rij.removeAttribute("data-actief");
      };
    },
    { scope: wortel },
  );

  const [werf, kino] = [festival.naam.slice(0, 4), festival.naam.slice(4)];

  return (
    <div ref={wortel} data-merk="werfkino-affiche" className="bg-(--merk-grond) text-(--merk-inkt) antialiased">
      <header className="flex items-center justify-between gap-6 px-4 py-4 md:px-8 md:py-5">
        <p className={cn(kopletter, "text-[26px] tracking-[0.01em]", "leading-none")}>{festival.naam}</p>
        <nav aria-label="Secties" className="hidden md:block">
          <ul className="flex gap-8 text-[15px] font-medium">
            {secties.map((s) => (
              <li key={s.doel}>
                <a
                  href={s.doel}
                  target="_self"
                  className={cn(
                    "underline-offset-[6px] hover:underline focus-visible:outline-(--merk-inkt)",
                    focus,
                  )}
                >
                  {s.naam}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Op 375 staat de knop hier; vanaf md in de opening, met de navigatie hierboven. */}
        <Knop href={festival.cta.doel} className="md:hidden">
          {festival.cta.tekst}
        </Knop>
      </header>

      <main>
        {/* Opening: wat, wanneer, waar, en de knop. */}
        <section aria-labelledby="affiche-kop" className="@container px-4 pt-6 pb-12 md:px-8 md:pt-8 md:pb-16">
          <div
            className={cn(
              "flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 font-(family-name:--merk-kop) font-bold uppercase",
              "text-[22px] md:text-[30px]",
              "leading-none",
            )}
          >
            <p>{festival.data}</p>
            <p>{festival.plaats}</p>
          </div>

          <h1
            id="affiche-kop"
            ref={kop}
            aria-label={festival.naam}
            className={cn(
              kopletter,
              "mt-6 text-(--merk-rood) tracking-[-0.01em] md:mt-9",
              "text-[48cqi] md:text-[26.4cqi]",
              "leading-[0.8]",
            )}
          >
            <span className="block md:inline">{werf}</span>
            <span className="block md:inline">{kino}</span>
          </h1>

          <div className="mt-8 grid items-end gap-6 md:mt-10 md:grid-cols-12 md:gap-8">
            <p
              className={cn(
                "font-(family-name:--merk-kop) font-extrabold uppercase md:col-span-5",
                "text-[34px] md:text-[46px]",
                "leading-[0.95]",
              )}
            >
              {festival.ondertitel}
            </p>
            <p className="max-w-[46ch] text-[17px] leading-[1.6] md:col-span-4 md:col-start-7">{festival.intro}</p>
            <div className="hidden md:col-span-2 md:col-start-11 md:block md:justify-self-end">
              <Knop href={festival.cta.doel} groot>
                {festival.cta.tekst}
              </Knop>
            </div>
          </div>

          <ul
            aria-label="Werfkino in cijfers"
            className={cn(
              "mt-10 grid grid-cols-2 gap-x-6 gap-y-2 border-t-2 border-(--merk-inkt) pt-4 md:mt-14 md:flex md:flex-wrap md:gap-x-14",
              "font-(family-name:--merk-kop) font-extrabold uppercase text-[32px] md:text-[52px]",
              "leading-none",
            )}
          >
            {cijfers.map((c) => (
              <li key={c.label}>
                <span className="text-(--merk-rood)">{c.waarde}</span> {c.label}
              </li>
            ))}
          </ul>
        </section>

        {/* Manifest: een rood vlak, zoals een tweede drukgang. */}
        <section
          aria-labelledby="affiche-manifest"
          className="bg-(--merk-rood) px-4 py-20 text-(--merk-wit) md:px-8 md:py-32"
        >
          <p className={label}>Manifest</p>
          <div className="mt-6 grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
            <h2
              id="affiche-manifest"
              className={cn(kopletter, "max-w-[12ch] text-[64px] md:col-span-7 md:text-[clamp(96px,11.5vw,176px)]", "leading-[0.84]")}
            >
              {manifest.titel}
            </h2>
            <div className="max-w-[48ch] space-y-5 text-[19px] leading-[1.6] md:col-span-4 md:col-start-9 md:pb-2">
              {manifest.tekst.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Programma: een lijst die oplicht waar je bent. */}
        <section
          id="affiche-programma"
          aria-labelledby="affiche-programma-kop"
          className="px-4 py-20 md:grid md:grid-cols-12 md:gap-8 md:px-8 md:py-32"
        >
          <div className="md:col-span-2">
            <h2
              id="affiche-programma-kop"
              className={cn(
                kopletter,
                "text-[72px] md:text-[168px] md:[writing-mode:vertical-rl] md:rotate-180",
                "leading-[0.8] md:leading-none",
              )}
            >
              Programma
            </h2>
          </div>
          <ol ref={lijst} className="film-lijst mt-8 border-t-2 border-(--merk-inkt) md:col-span-10 md:mt-0">
            {films.map((f) => (
              <li
                key={f.nummer}
                className="film grid grid-cols-[3.25rem_1fr] gap-x-3 border-b border-(--merk-inkt) py-6 md:grid-cols-10 md:gap-x-8 md:py-9"
              >
                <p
                  className={cn(
                    "film-nr font-(family-name:--merk-kop) font-extrabold text-(--merk-rood)",
                    "text-[30px] md:text-[44px]",
                    "leading-[0.9]",
                  )}
                >
                  <span className="sr-only">Film </span>
                  {f.nummer}
                </p>
                <div className="md:col-span-6">
                  <h3 className={cn(kopletter, "film-titel text-[46px] md:text-[96px]", "leading-[0.86]")}>{f.titel}</h3>
                  <p className="film-tekst mt-3 max-w-[48ch] text-[17px] leading-[1.55] md:mt-4">{f.zin}</p>
                </div>
                <dl className="film-tekst col-start-2 mt-4 grid content-start gap-1 text-[15px] leading-snug md:col-span-3 md:col-start-8 md:mt-1">
                  <dt className="sr-only">Wanneer en waar</dt>
                  <dd className="font-semibold">
                    {f.wanneer}, {f.zaal}
                  </dd>
                  <dt className="sr-only">Regie</dt>
                  <dd>{f.regie}</dd>
                  <dt className="sr-only">Land, jaar en duur</dt>
                  <dd>
                    {f.land}, {f.jaar}, {f.duur}
                  </dd>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        {/* De plek: het inktvlak, met de hal in doorsnede. */}
        <section
          id="affiche-plek"
          aria-labelledby="affiche-plek-kop"
          className="bg-(--merk-inkt) px-4 py-20 text-(--merk-grond) md:px-8 md:py-32"
        >
          <p className={cn(label, "text-(--merk-inkt-gedempt)")}>De plek</p>
          <div className="mt-4 grid items-end gap-8 md:grid-cols-12">
            <h2
              id="affiche-plek-kop"
              className={cn(kopletter, "text-(--merk-rood) text-[160px] md:col-span-6 md:text-[300px]", "leading-[0.8]")}
            >
              {plek.titel}
            </h2>
            <p className="max-w-[52ch] text-[19px] leading-[1.6] md:col-span-5 md:col-start-8">{plek.tekst}</p>
          </div>
          <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end md:gap-8">
            <HalTekening className="block w-full md:col-span-8" />
            <dl className="grid grid-cols-3 gap-4 md:col-span-3 md:col-start-10 md:grid-cols-1 md:gap-8">
              {plek.feiten.map((f) => (
                <div key={f.label} className="flex flex-col-reverse gap-2 border-t border-(--merk-inkt-gedempt) pt-3 md:pt-4">
                  <dt className="text-[14px] leading-snug text-(--merk-inkt-gedempt) md:text-[15px]">{f.label}</dt>
                  <dd className={cn(kopletter, "text-[44px] md:text-[96px]", "leading-[0.85]")}>{f.waarde}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Vier dagen: een dienstregeling, met de datum als groot cijfer. */}
        <section
          id="affiche-dagen"
          aria-labelledby="affiche-dagen-kop"
          className="px-4 py-20 md:px-8 md:py-32"
        >
          <h2 id="affiche-dagen-kop" className={cn(kopletter, "text-[72px] md:text-[136px]", "leading-[0.8]")}>
            Vier dagen
          </h2>
          <ol className="mt-10 grid border-t-2 border-(--merk-inkt) md:mt-14 md:grid-cols-4">
            {dagen.map((d) => {
              const [weekdag, nummer, maand] = d.dag.split(" ");
              return (
                <li
                  key={d.dag}
                  className={cn(
                    "border-b border-(--merk-inkt) py-6",
                    "md:border-b-0 md:border-l md:px-6 md:pt-6 md:pb-2 md:first:border-l-0 md:first:pl-0",
                  )}
                >
                  {/* Op 375 staat het cijfer links van dag en maand; vanaf md eronder. De volgorde in de kop blijft
                      "Vrijdag 12 maart", ook voor een schermlezer. */}
                  <h3
                    className={cn(
                      "grid grid-cols-[auto_1fr] items-end gap-x-4 font-(family-name:--merk-kop) font-extrabold uppercase",
                      "text-[28px] leading-none md:block",
                    )}
                  >
                    <span className="col-start-2 row-start-1 block">{weekdag}</span>{" "}
                    <span
                      className={cn(
                        "col-start-1 row-span-2 row-start-1 block font-black text-(--merk-rood)",
                        "text-[112px] md:mt-3 md:text-[200px]",
                        "leading-[0.8]",
                      )}
                    >
                      {nummer}
                    </span>{" "}
                    <span className="col-start-2 row-start-2 block pb-1 md:mt-2 md:pb-0">{maand}</span>
                  </h3>
                  <p className="mt-4 max-w-[30ch] text-[17px] leading-[1.5] md:mt-6">{d.wat}</p>
                  <p className="mt-2 text-[15px] font-semibold tabular-nums md:mt-3">{d.tijden}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Tickets: drie kaarten zonder kaart. De passe-partout is het rode blok. */}
        <section id="tickets" aria-labelledby="affiche-tickets-kop" className="px-4 pb-20 md:px-8 md:pb-32">
          <h2 id="affiche-tickets-kop" className={cn(kopletter, "text-[72px] md:text-[136px]", "leading-[0.8]")}>
            Tickets
          </h2>
          <ul className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
            {tickets.map((t) => (
              <li
                key={t.naam}
                className={cn(
                  "flex flex-col border-t-2 px-0 pt-5 pb-2",
                  t.uitgelicht
                    ? "border-(--merk-rood) bg-(--merk-rood) px-5 pb-6 text-(--merk-wit) md:px-7"
                    : "border-(--merk-inkt)",
                )}
              >
                <h3 className="font-(family-name:--merk-kop) text-[30px] leading-none font-extrabold uppercase">
                  {t.naam}
                </h3>
                <p className={cn(kopletter, "mt-6 text-[104px] md:text-[136px]", "leading-[0.8]")}>{t.prijs}</p>
                <p className="mt-5 max-w-[34ch] grow text-[17px] leading-[1.5]">{t.wat}</p>
                <button
                  type="button"
                  className={cn(
                    "mt-8 self-start px-5 py-3 text-[15px] font-semibold uppercase tracking-[0.08em]",
                    "transition-colors duration-200 motion-reduce:transition-none",
                    focus,
                    t.uitgelicht
                      ? "bg-(--merk-wit) text-(--merk-inkt) hover:bg-(--merk-inkt) hover:text-(--merk-wit) focus-visible:outline-(--merk-wit)"
                      : "bg-(--merk-inkt) text-(--merk-grond) hover:bg-(--merk-rood) hover:text-(--merk-wit) focus-visible:outline-(--merk-inkt)",
                  )}
                >
                  Kies<span className="sr-only"> {t.naam}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-(--merk-inkt) px-4 py-12 text-(--merk-grond) md:px-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-12">
          <p className={cn(kopletter, "text-(--merk-rood) text-[64px] md:col-span-5 md:text-[88px]", "leading-[0.8]")}>
            {festival.naam}
          </p>
          <div className="space-y-1 text-[15px] leading-relaxed md:col-span-3 md:col-start-7">
            <p className="font-semibold">{festival.data}</p>
            <p>{voet.adres}</p>
          </div>
          <div className="text-[15px] leading-relaxed md:col-span-3">
            <a
              href={`mailto:${voet.contact}`}
              className={cn("underline underline-offset-4 hover:text-(--merk-wit) focus-visible:outline-(--merk-grond)", focus)}
            >
              {voet.contact}
            </a>
          </div>
        </div>
        <p className="mt-12 max-w-[70ch] border-t border-(--merk-inkt-gedempt) pt-5 text-[13px] text-(--merk-inkt-gedempt)">
          {voet.disclaimer}
        </p>
      </footer>
    </div>
  );
}

function Knop({
  href,
  groot,
  className,
  children,
}: {
  href: string;
  groot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_self"
      className={cn(
        "inline-flex items-center bg-(--merk-rood) font-semibold whitespace-nowrap text-(--merk-wit) uppercase",
        "transition-colors duration-200 hover:bg-(--merk-inkt) motion-reduce:transition-none",
        "focus-visible:outline-(--merk-inkt)",
        focus,
        groot ? "px-7 py-4 text-[17px] tracking-[0.08em]" : "px-4 py-2.5 text-[14px] tracking-[0.08em]",
        className,
      )}
    >
      {children}
    </a>
  );
}
