import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/inter";
import "./merk.css";

import { useRef } from "react";

import { gsap, SplitText, useBeweging } from "@/lib/beweging";

import { cijfers, dagen, festival, films, manifest, plek, voet } from "../inhoud";
import { HalTekening } from "./HalTekening";
import { Programma } from "./Programma";
import { aftiteling, knop, kop, link, rand } from "./stijl";
import { TicketKeuze } from "./TicketKeuze";

// Werfkino als filmtijdschrift op warm papier. Twee bewegingen, niet meer: de openingskop komt regel voor regel op,
// en het programma staat vast terwijl de films voorbijkomen (zie Programma.tsx).

const secties = [
  { naam: "Programma", doel: "#programma" },
  { naam: "De plek", doel: "#plek" },
  { naam: "Vier dagen", doel: "#dagen" },
  { naam: "Tickets", doel: "#tickets" },
];

// "Vier dagen film in de oude scheepswerf": het tweede deel in cursief.
const knip = festival.ondertitel.indexOf(" in ");
const kopVoor = knip > 0 ? festival.ondertitel.slice(0, knip) : festival.ondertitel;
const kopNa = knip > 0 ? festival.ondertitel.slice(knip + 1) : "";

// De zalen in de volgorde waarin het programma ze noemt: Hal 4, De Mallen, Het Dok.
const zalen = [...new Set(films.map((f) => f.zaal))];

export function Pagina() {
  const ref = useRef<HTMLElement>(null);

  useBeweging(
    () => {
      SplitText.create(".rd-kop", {
        type: "lines",
        mask: "lines",
        linesClass: "rd-kopregel",
        autoSplit: true,
        onSplit: (s) =>
          gsap.from(s.lines, { yPercent: 110, duration: 1.2, stagger: 0.12, delay: 0.15, ease: "expo.out" }),
      });
    },
    { scope: ref },
  );

  return (
    <main ref={ref} data-merk="werfkino-redactioneel" className="overflow-x-clip">
      {/* Kop van het tijdschrift */}
      <header className={rand}>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-5 pb-6 sm:pt-6">
          <nav aria-label="Secties">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:gap-x-7">
              {secties.map((s) => (
                <li key={s.doel}>
                  <a href={s.doel} target="_self" className={link}>
                    {s.naam}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={festival.cta.doel}
            target="_self"
            className="border border-(--merk-inkt) px-4 py-2 text-sm font-semibold transition-[background-color,color] duration-200 hover:bg-(--merk-inkt) hover:text-(--merk-papier) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--merk-inkt) focus-visible:outline-solid max-sm:hidden"
          >
            {festival.cta.tekst}
          </a>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 pb-4">
          <p className={`${kop} text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.8] tracking-[-0.02em]`}>{festival.naam}</p>
          <p className={`${aftiteling} flex flex-wrap gap-x-5 gap-y-1 pb-1`}>
            <span>{festival.data}</span>
            <span className="text-(--merk-gedempt)">{festival.plaats}</span>
          </p>
        </div>
        <div aria-hidden="true" className="h-[7px] border-t-[3px] border-b border-(--merk-inkt)" />
      </header>

      {/* Opening */}
      <section aria-labelledby="rd-kop" className={`${rand} pt-[clamp(2.5rem,6vw,5.5rem)]`}>
        <h1
          id="rd-kop"
          className={`rd-kop ${kop} text-[clamp(3.6rem,11.4vw,10.5rem)] leading-[0.9] tracking-[-0.02em]`}
        >
          {kopVoor}
          {kopNa ? (
            <>
              <br /> <em className="italic">{kopNa}</em>
            </>
          ) : null}
        </h1>

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid grid-cols-12 gap-x-6 gap-y-10 border-t border-(--merk-inkt) pt-6 pb-[clamp(4rem,8vw,7rem)]">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="max-w-[46ch] text-lg leading-relaxed">{festival.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href={festival.cta.doel} target="_self" className={knop}>
                {festival.cta.tekst}
              </a>
              <a href="#programma" target="_self" className={`${link} text-base font-medium`}>
                Bekijk het programma
              </a>
            </div>
          </div>
          <ul
            aria-label="Het festival in getallen"
            className={`${kop} col-span-12 flex flex-wrap gap-x-[0.6em] gap-y-1 self-end text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] md:col-span-6 md:justify-end lg:col-span-6 lg:col-start-7`}
          >
            {cijfers.map((c, i) => (
              <li key={c.label}>
                <em className="italic">{c.waarde}</em> {c.label}
                {i < cijfers.length - 1 ? "," : "."}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Manifest */}
      <section aria-labelledby="rd-manifest" className={rand}>
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-(--merk-inkt) pt-[clamp(3rem,7vw,6rem)] pb-[clamp(1rem,3vw,2.5rem)]">
          <h2
            id="rd-manifest"
            className={`${kop} col-span-12 text-[clamp(2.9rem,7.4vw,7.25rem)] leading-[0.95] tracking-[-0.015em] text-balance lg:col-span-10`}
          >
            {manifest.titel}
          </h2>
          <div className="col-span-12 space-y-6 text-lg leading-relaxed md:col-span-8 md:col-start-5 md:text-xl md:leading-relaxed lg:col-span-6 lg:col-start-6">
            {manifest.tekst.map((alinea, i) => (
              <p key={alinea} className={i === 0 ? "rd-initiaal" : undefined}>
                {alinea}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Programma />

      {/* De plek */}
      <section id="plek" aria-labelledby="rd-plek" className={rand}>
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 border-t border-(--merk-inkt) pt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(4rem,9vw,8rem)]">
          <h2
            id="rd-plek"
            className={`${kop} col-span-12 text-[clamp(5rem,15vw,14rem)] leading-[0.78] tracking-[-0.03em] md:col-span-6`}
          >
            {plek.titel}
          </h2>
          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed">{plek.tekst}</p>
            <dl className="mt-8 border-t border-(--merk-inkt)">
              {plek.feiten.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-(--merk-lijn) py-3"
                >
                  <dt className="order-2 text-base">{f.label}</dt>
                  <dd className={`${kop} order-1 text-[2.5rem] leading-none tabular-nums`}>{f.waarde}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="col-span-12 mt-[clamp(1rem,4vw,3.5rem)]">
            <HalTekening />
            <figcaption className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-(--merk-inkt) pt-4 text-sm">
              <span className={`${aftiteling} text-(--merk-gedempt) max-sm:w-full`}>Doorsnede, 60 bij 20 meter</span>
              <ol className="contents">
                {zalen.map((zaal, i) => (
                  <li key={zaal} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="grid size-6 place-items-center rounded-full border border-(--merk-inkt) text-xs font-semibold tabular-nums"
                    >
                      {i + 1}
                    </span>
                    {zaal}
                  </li>
                ))}
              </ol>
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-1.5 bg-(--merk-rood)" />
                Het doek van 14 meter
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Vier dagen */}
      <section id="dagen" aria-labelledby="rd-dagen" className={rand}>
        <div className="border-t border-(--merk-inkt) pt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(4rem,9vw,8rem)]">
          <h2 id="rd-dagen" className={`${kop} text-[clamp(3rem,7vw,7rem)] leading-[0.95] tracking-[-0.01em]`}>
            Vier dagen
          </h2>
          <ol className="mt-[clamp(2rem,4vw,3.5rem)] border-t border-(--merk-inkt)">
            {dagen.map((d) => {
              const [naam, ...datum] = d.dag.split(" ");
              return (
                <li
                  key={d.dag}
                  className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 border-b border-(--merk-lijn) py-5 md:py-7"
                >
                  <p className="col-span-12 flex items-baseline gap-3 md:col-span-4">
                    <span className={`${kop} text-[clamp(2.4rem,4vw,3.75rem)] leading-none`}>{naam}</span>
                    <span className={`${aftiteling} text-(--merk-gedempt)`}>{datum.join(" ")}</span>
                  </p>
                  <p className="col-span-12 text-lg md:col-span-5">{d.wat}</p>
                  <p className="col-span-12 text-base tabular-nums md:col-span-3 md:text-right md:text-lg">{d.tijden}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" aria-labelledby="rd-tickets" className="bg-(--merk-papier-2)">
        <div className={`${rand} grid grid-cols-12 gap-x-6 gap-y-10 py-[clamp(4rem,9vw,8rem)]`}>
          <div className="col-span-12 md:col-span-4">
            <h2 id="rd-tickets" className={`${kop} text-[clamp(3rem,7vw,7rem)] leading-[0.9] tracking-[-0.01em]`}>
              Tickets
            </h2>
            <p className={`${aftiteling} mt-5 flex flex-col gap-1`}>
              <span>{festival.data}</span>
              <span className="text-(--merk-gedempt)">{festival.plaats}</span>
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <TicketKeuze />
          </div>
        </div>
      </section>

      {/* Voet: de naamplaat over de hele breedte, en het colofon */}
      <footer className={`${rand} pt-[clamp(3rem,7vw,6rem)] pb-10`}>
        <p aria-hidden="true" className={`${kop} text-[30.7vw] leading-[0.74] tracking-[-0.02em] min-[90rem]:text-[27.6rem]`}>
          {festival.naam}
        </p>
        <div className="mt-6 grid grid-cols-12 gap-x-6 gap-y-3 border-t-[3px] border-(--merk-inkt) pt-5 text-sm">
          <p className="col-span-12 sm:col-span-6 lg:col-span-3">{voet.adres}</p>
          <p className="col-span-12 sm:col-span-6 lg:col-span-3">
            <a href={`mailto:${voet.contact}`} target="_self" className={link}>
              {voet.contact}
            </a>
          </p>
          <p className="col-span-12 text-(--merk-gedempt) lg:col-span-6 lg:text-right">{voet.disclaimer}</p>
        </div>
      </footer>
    </main>
  );
}
