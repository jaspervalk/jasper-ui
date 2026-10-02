import "@fontsource-variable/archivo/wdth.css";
import "./merk.css";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger, useBeweging } from "@/lib/beweging";

import { cijfers, dagen, festival, films, manifest, plek, tickets, voet } from "./inhoud";
import { HalTekening, zalen } from "./HalTekening";
import { Still } from "./Still";

// Template "landing-nacht" (jasper-ui), gegroeid uit het lab-experiment Werfkino, variant Nacht. Een donkere
// landingspagina met twee bewegingen, niet meer:
//   1. Het doek gaat open: een klein kader met oranje licht groeit bij scrollen tot het hele scherm (clip-path, pin
//      en scrub). Zonder beweging staat het doek meteen open.
//   2. Het programma licht op waar je bent: de film in het midden van het scherm staat in volle kleur, de rest treedt
//      terug. Alleen kleur verandert; de scroll blijft van de lezer. Zonder beweging staat alles in volle kleur.
// Teksten en data staan in inhoud.ts; kleuren en lettertype in merk.css. Vervang ze door die van je eigen merk.

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--merk-oranje)";

const navigatie = [
  { naar: "#programma", tekst: "Programma" },
  { naar: "#plek", tekst: "De plek" },
  { naar: "#dagen", tekst: "Vier dagen" },
];

// Het kader van het gesloten doek, als clip-path. Het midden ligt op 40 % hoogte, net als de titel en het licht.
const KADER_BREED = "inset(20% 32% 40% 32% round 3px)";
const KADER_SMAL = "inset(27% 5% 47% 5% round 3px)";
const OPEN = "inset(0% 0% 0% 0% round 0px)";

// Openingstijden als uren op één as van 10:00 tot 02:00, voor de balk "wanneer brandt de lamp".
const AS = { van: 10, tot: 26 };
function uren(tijden: string) {
  const [van, tot] = tijden.split("–").map((t) => {
    const [u, m] = t.trim().split(":").map(Number);
    return u + m / 60;
  });
  return { van, tot: tot <= van ? tot + 24 : tot };
}
const procent = (uur: number) => ((uur - AS.van) / (AS.tot - AS.van)) * 100;
// Dag, wat, lampbalk, tijden: dezelfde kolommen voor de as erboven en voor elke rij.
const dagKolommen = "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_9rem] md:gap-x-10";

const aantalFilms = cijfers.find((c) => c.label === "films")?.waarde;

export function LandingNacht() {
  const wortel = useRef<HTMLDivElement>(null);
  const [keuze, setKeuze] = useState(tickets.find((t) => t.uitgelicht)?.naam ?? tickets[0].naam);
  const [melding, setMelding] = useState("");

  useBeweging(
    () => {
      const q = gsap.utils.selector(wortel);
      gsap.matchMedia().add({ breed: "(min-width: 48rem)", smal: "(max-width: 47.99rem)" }, (ctx) => {
        const breed = Boolean(ctx.conditions?.breed);

        // 1. Het doek gaat open. De titel groeit mee, zodat hij in het kleine kader al heel leesbaar is.
        const [opening] = q<HTMLElement>(".opening");
        const [titel] = q<HTMLElement>(".doek-titel");
        const kaderBreedte = breed ? 0.36 : 0.9;
        const kaderHoogte = breed ? 0.4 : 0.26;
        const schaal = () =>
          Math.min(
            (opening.clientWidth * kaderBreedte * 0.82) / titel.offsetWidth,
            (opening.clientHeight * kaderHoogte * 0.62) / titel.offsetHeight,
          );
        gsap
          .timeline({
            scrollTrigger: {
              trigger: opening,
              start: "top top",
              end: "+=110%",
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(".doek", { clipPath: breed ? KADER_BREED : KADER_SMAL }, { clipPath: OPEN, ease: "power2.inOut" }, 0)
          .fromTo(titel, { scale: schaal }, { scale: 1, ease: "power2.inOut" }, 0)
          .to({}, { duration: 0.2 }); // even open laten staan voordat de pin loslaat
      });

      // 2. Het programma licht op waar je bent, op elke breedte. Alleen zolang het midden van het scherm in de lijst
      // valt; daarbuiten, en zonder beweging, staat alles in volle kleur.
      const [lijst] = q<HTMLElement>(".filmlijst");
      const rijen = q<HTMLElement>(".film");
      ScrollTrigger.create({
        trigger: lijst,
        start: "top center",
        end: "bottom center",
        onToggle: (st) => lijst.toggleAttribute("data-oplichten", st.isActive),
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
        lijst.removeAttribute("data-oplichten");
        for (const rij of rijen) rij.removeAttribute("data-actief");
      };
    },
    { scope: wortel },
  );

  // Op een telefoon staat "Koop tickets" vast onderin, behalve als het ticketformulier zelf in beeld is.
  const ticketsRef = useRef<HTMLElement>(null);
  const [bijTickets, setBijTickets] = useState(false);
  useEffect(() => {
    const sectie = ticketsRef.current;
    if (!sectie) return;
    const waarnemer = new IntersectionObserver(([e]) => setBijTickets(e.isIntersecting), { threshold: 0.15 });
    waarnemer.observe(sectie);
    return () => waarnemer.disconnect();
  }, []);

  function koop(e: FormEvent) {
    e.preventDefault();
    const kaart = tickets.find((t) => t.naam === keuze);
    if (kaart) setMelding(`${kaart.naam}, ${kaart.prijs}. ${voet.disclaimer}`);
  }

  return (
    <div ref={wortel} data-merk="landing-nacht" className="bg-(--merk-nacht) text-(--merk-tekst)">
      {/* Opening: navigatie, het doek met de titel, en de statementzin linksonder */}
      <header className="opening relative isolate flex min-h-svh flex-col justify-between overflow-hidden">
        <div className="doek doek-licht absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-[40%] flex -translate-y-1/2 justify-center">
            <h1 className="doek-titel smal text-[clamp(5rem,21vw,19rem)] leading-[0.8] font-black tracking-[-0.01em] text-(--merk-nacht) uppercase">
              {festival.naam}
            </h1>
          </div>
        </div>

        <nav aria-label="Hoofdmenu" className="flex items-center justify-between gap-6 px-5 py-5 md:px-12 md:py-7">
          <p className="smal text-xl font-extrabold tracking-wide uppercase">{festival.naam}</p>
          <ul className="flex items-center gap-7 text-[0.95rem]">
            {navigatie.map((n) => (
              <li key={n.naar} className="hidden md:block">
                <a href={n.naar} target="_self" className={`hover:text-(--merk-oranje) ${focus}`}>
                  {n.tekst}
                </a>
              </li>
            ))}
            <li>
              <a href={festival.cta.doel} target="_self" className={`hover:text-(--merk-oranje) ${focus}`}>
                Tickets
              </a>
            </li>
          </ul>
        </nav>

        {/* Op een telefoon ruimte onderin voor de vaste koopknop (h-14 plus marge) */}
        <div className="grid items-end gap-7 px-5 pb-24 md:grid-cols-[1fr_auto] md:gap-12 md:px-12 md:pb-12">
          <div>
            <p className="half max-w-[13ch] text-[clamp(2.4rem,6vw,5.75rem)] leading-[0.92] font-bold tracking-[-0.01em] text-balance">
              {festival.ondertitel}
            </p>
            <p className="mt-5 flex flex-col gap-x-3 text-lg md:flex-row md:text-xl">
              <span>{festival.data}</span>
              <span aria-hidden="true" className="hidden text-(--merk-gedempt) md:inline">
                ·
              </span>
              <span>{festival.plaats}</span>
            </p>
          </div>
          <a
            href={festival.cta.doel}
            target="_self"
            className={`half hidden h-16 items-center justify-self-start bg-(--merk-oranje) px-10 text-lg font-bold tracking-wide text-(--merk-nacht) uppercase transition-colors hover:bg-(--merk-oranje-heet) md:inline-flex ${focus}`}
          >
            {festival.cta.tekst}
          </a>
        </div>
      </header>

      <main>
        {/* Manifest: de kop eerst (ook voor schermlezers en op een telefoon); breed staat de tekst rechtsboven en de
            grote zin linksonder */}
        <section aria-labelledby="manifest-kop" className="px-5 pt-28 pb-20 md:px-12 md:pt-40 md:pb-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-x-10">
            <h2
              id="manifest-kop"
              className="smal text-[clamp(3.25rem,9vw,9rem)] leading-[0.86] font-extrabold tracking-[-0.01em] text-balance md:col-span-9 md:row-start-2 md:mt-16"
            >
              {manifest.titel}
            </h2>
            <div className="space-y-5 text-lg leading-[1.65] md:col-span-5 md:col-start-8 md:row-start-1 md:text-xl">
              {manifest.tekst.map((alinea) => (
                <p key={alinea.slice(0, 16)}>{alinea}</p>
              ))}
            </div>
          </div>
          <ul className="half mt-16 flex flex-wrap gap-x-10 gap-y-2 border-t border-(--merk-lijn) pt-6 text-[clamp(1.75rem,3.4vw,3rem)] leading-tight font-bold md:mt-24">
            {cijfers.map((c) => (
              <li key={c.label}>
                {c.waarde} <span className="text-(--merk-gedempt)">{c.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Programma: een lijst onder elkaar; de film in het midden van het scherm licht op (merk.css) */}
        <section
          id="programma"
          aria-labelledby="programma-kop"
          className="bg-(--merk-staal) px-5 pt-24 pb-24 md:px-12 md:pt-36 md:pb-36"
        >
          <div className="grid gap-8 md:grid-cols-12 md:gap-x-10">
            <h2
              id="programma-kop"
              className="smal text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.86] font-extrabold uppercase md:col-span-7"
            >
              Programma
            </h2>
            <div className="max-w-[40ch] space-y-4 self-end md:col-span-5">
              <p className="text-lg leading-[1.65] md:text-xl">{festival.intro}</p>
              <p className="text-(--merk-gedempt)">
                {films.length} van de {aantalFilms} films
              </p>
            </div>
          </div>
          <ol className="filmlijst mt-16 border-t border-(--merk-lijn) md:mt-24">
            {films.map((f) => (
              <li
                key={f.nummer}
                className="film grid gap-6 border-b border-(--merk-lijn) py-10 md:grid-cols-12 md:items-start md:gap-x-10 md:py-14"
              >
                <p className="flex justify-between gap-4 text-(--merk-gedempt) tabular-nums md:col-span-2 md:flex-col md:gap-1">
                  <span>{f.nummer}</span>
                  <span>{f.wanneer}</span>
                </p>
                <div className="film-beeld md:col-span-4">
                  <Still nummer={f.nummer} />
                </div>
                <div className="grid content-start gap-4 md:col-span-6">
                  <h3 className="film-titel smal text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-extrabold uppercase">
                    {f.titel}
                  </h3>
                  <p className="film-tekst max-w-[48ch] text-lg leading-[1.55]">{f.zin}</p>
                  <p className="flex flex-wrap gap-x-2 text-(--merk-gedempt)">
                    {[f.regie, f.land, f.jaar, f.duur, f.zaal].map((deel, i) => (
                      <span key={deel} className="whitespace-nowrap">
                        {i > 0 && <span aria-hidden="true">· </span>}
                        {deel}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* De plek: Hal 4 als bouwtekening, met de zalen eronder en de feiten */}
        <section id="plek" aria-labelledby="plek-kop" className="px-5 pt-28 pb-24 md:px-12 md:pt-40 md:pb-32">
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-10">
            <h2 id="plek-kop" className="smal text-[clamp(4.5rem,14vw,13rem)] leading-[0.8] font-black uppercase md:col-span-6">
              {plek.titel}
            </h2>
            <p className="max-w-[46ch] self-end text-lg leading-[1.65] md:col-span-5 md:col-start-8 md:text-xl">{plek.tekst}</p>
          </div>
          <figure className="mt-16 md:mt-24">
            <HalTekening />
            <figcaption className="relative mt-3 h-6 text-sm text-(--merk-gedempt) md:text-base">
              {zalen.map((z) => (
                <span key={z.naam} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${z.midden}%` }}>
                  {z.naam}
                </span>
              ))}
            </figcaption>
          </figure>
          <dl className="mt-16 grid grid-cols-3 gap-x-4 gap-y-8 md:mt-20 md:gap-x-10">
            {plek.feiten.map((f) => (
              <div key={f.label} className="flex flex-col-reverse gap-2 border-t border-(--merk-lijn) pt-5">
                <dt className="text-sm text-(--merk-gedempt) md:text-base">{f.label}</dt>
                <dd className="smal text-[clamp(2.25rem,6vw,5.5rem)] leading-none font-extrabold tabular-nums">{f.waarde}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Vier dagen: een dienstregeling, met per dag de uren dat de lamp brandt */}
        <section id="dagen" aria-labelledby="dagen-kop" className="px-5 pb-28 md:px-12 md:pb-40">
          <h2 id="dagen-kop" className="smal text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.86] font-extrabold uppercase">
            Vier dagen
          </h2>
          <div aria-hidden="true" className={`mt-12 hidden text-sm text-(--merk-gedempt) tabular-nums md:grid ${dagKolommen}`}>
            <div className="relative col-start-3 h-5">
              {[12, 18, 24].map((u) => (
                <span key={u} className="absolute -translate-x-1/2" style={{ left: `${procent(u)}%` }}>
                  {String(u % 24).padStart(2, "0")}:00
                </span>
              ))}
            </div>
          </div>
          <ol className="mt-10 border-t border-(--merk-lijn) md:mt-3">
            {dagen.map((d) => {
              const { van, tot } = uren(d.tijden);
              return (
                <li
                  key={d.dag}
                  className={`grid gap-y-3 border-b border-(--merk-lijn) py-7 md:items-center ${dagKolommen}`}
                >
                  <h3 className="smal text-[clamp(1.9rem,2.8vw,2.75rem)] leading-none font-extrabold uppercase">{d.dag}</h3>
                  <p className="text-lg leading-[1.5]">{d.wat}</p>
                  <div aria-hidden="true" className="relative h-1 bg-(--merk-lijn) md:order-none">
                    <div
                      className="absolute inset-y-0 bg-(--merk-oranje)"
                      style={{ left: `${procent(van)}%`, width: `${procent(tot) - procent(van)}%` }}
                    />
                  </div>
                  <p className="text-lg tabular-nums md:text-right">{d.tijden}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Tickets: drie kaarten, één knop */}
        <section
          ref={ticketsRef}
          id="tickets"
          aria-labelledby="tickets-kop"
          className="bg-(--merk-staal) px-5 py-24 md:px-12 md:py-36"
        >
          <div className="grid gap-12 md:grid-cols-12 md:gap-x-10">
            <h2
              id="tickets-kop"
              className="smal text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.86] font-extrabold uppercase md:col-span-4"
            >
              Tickets
            </h2>
            <form onSubmit={koop} className="md:col-span-8">
              <fieldset>
                <legend className="sr-only">Kies je kaart</legend>
                <div className="grid gap-3">
                  {tickets.map((t) => (
                    <label
                      key={t.naam}
                      className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border border-(--merk-lijn) px-5 py-5 transition-colors hover:border-(--merk-gedempt) has-[:checked]:border-(--merk-oranje) has-[:checked]:bg-(--merk-nacht) md:px-8 md:py-6"
                    >
                      <input
                        type="radio"
                        name="kaart"
                        value={t.naam}
                        checked={keuze === t.naam}
                        onChange={() => setKeuze(t.naam)}
                        className={`row-span-2 size-5 accent-(--merk-oranje) ${focus}`}
                      />
                      <span className="smal text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-extrabold uppercase">
                        {t.naam}
                      </span>
                      <span className="smal row-span-2 text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-extrabold tabular-nums">
                        {t.prijs}
                      </span>
                      <span className="text-(--merk-gedempt)">{t.wat}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <button
                  type="submit"
                  className={`half inline-flex h-14 items-center bg-(--merk-oranje) px-8 text-lg font-bold tracking-wide text-(--merk-nacht) uppercase transition-colors hover:bg-(--merk-oranje-heet) md:h-16 md:px-10 ${focus}`}
                >
                  {festival.cta.tekst}
                </button>
                <p role="status" className="max-w-[48ch] text-(--merk-gedempt)">
                  {melding}
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="grid gap-6 px-5 pt-12 pb-28 md:grid-cols-12 md:gap-x-10 md:px-12 md:py-16">
        <p className="smal text-3xl font-extrabold uppercase md:col-span-3">{festival.naam}</p>
        <address className="not-italic md:col-span-3">
          <p>{voet.adres}</p>
          <a href={`mailto:${voet.contact}`} className={`underline underline-offset-4 hover:text-(--merk-oranje) ${focus}`}>
            {voet.contact}
          </a>
        </address>
        <p className="max-w-[48ch] text-(--merk-gedempt) md:col-span-5 md:col-start-8">{voet.disclaimer}</p>
      </footer>

      <a
        href={festival.cta.doel}
        target="_self"
        className={`half fixed inset-x-4 bottom-4 z-30 h-14 items-center justify-center bg-(--merk-oranje) text-lg font-bold tracking-wide text-(--merk-nacht) uppercase md:hidden ${bijTickets ? "hidden" : "flex"} ${focus}`}
      >
        {festival.cta.tekst}
      </a>
    </div>
  );
}
