import { type MouseEvent, useRef } from "react";

import { gsap, ScrollTrigger, useBeweging } from "@/lib/beweging";

import { cijfers, type Film, films } from "../inhoud";
import { aftiteling, kop, rand } from "./stijl";

// Vastzetten alleen als er ruimte is: breed én hoog genoeg. Op 375 px en onder "beweging beperken" blijft het een
// gewone lijst onder elkaar.
const VASTZETTEN = "(min-width: 900px) and (min-height: 640px)";

const totaalFilms = cijfers.find((c) => c.label === "films")?.waarde;

function aftitelingVan(film: Film): [string, string][] {
  return [
    ["Regie", film.regie],
    ["Land", film.land],
    ["Jaar", String(film.jaar)],
    ["Duur", film.duur],
    ["Wanneer", film.wanneer],
    ["Zaal", film.zaal],
  ];
}

export function Programma() {
  const ref = useRef<HTMLElement>(null);
  const pin = useRef<ScrollTrigger | null>(null);

  useBeweging(
    () => {
      const sectie = ref.current;
      if (!sectie) return;

      gsap.matchMedia().add(VASTZETTEN, () => {
        const lijst = gsap.utils.toArray<HTMLElement>("[data-film]", sectie);
        const nummers = lijst.map((film) => film.querySelector<HTMLElement>("[data-cijfer]")!);
        const regels = lijst.map((film) => gsap.utils.toArray<HTMLElement>("[data-regel]", film));
        const index = gsap.utils.toArray<HTMLElement>("[data-index]", sectie);
        const alles = [...nummers, ...regels.flat()];

        // Eerst de vaste stand (films op elkaar), dan pas meten.
        sectie.setAttribute("data-gepind", "");
        let actief = 0;
        const markeer = (i: number) =>
          index.forEach((el, j) => (j === i ? el.setAttribute("aria-current", "true") : el.removeAttribute("aria-current")));

        lijst.forEach((_, i) => {
          if (!i) return;
          gsap.set(nummers[i], { yPercent: 100 });
          gsap.set(regels[i], { opacity: 0 });
        });
        markeer(0);

        // Het nummer rolt als een teller door zijn masker (oud en nieuw tegelijk); de aftiteling wisselt regel voor
        // regel, met zo min mogelijk tijd waarin er niets staat.
        const toon = (nieuw: number) => {
          if (nieuw === actief) return;
          const r = nieuw > actief ? 1 : -1;
          lijst.forEach((_, i) => {
            if (i === nieuw || i === actief) return;
            gsap.killTweensOf([nummers[i], ...regels[i]]);
            gsap.set(nummers[i], { yPercent: 100 });
            gsap.set(regels[i], { opacity: 0 });
          });
          gsap.to(nummers[actief], { yPercent: -100 * r, duration: 0.8, ease: "power3.inOut", overwrite: true });
          gsap.fromTo(
            nummers[nieuw],
            { yPercent: 100 * r },
            { yPercent: 0, duration: 0.8, ease: "power3.inOut", overwrite: true },
          );
          gsap.to(regels[actief], { opacity: 0, y: -10 * r, duration: 0.2, ease: "power2.in", stagger: 0.01, overwrite: true });
          gsap.fromTo(
            regels[nieuw],
            { opacity: 0, y: 16 * r },
            { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", delay: 0.22, stagger: 0.04, overwrite: true },
          );
          actief = nieuw;
          markeer(nieuw);
        };

        pin.current = ScrollTrigger.create({
          trigger: sectie,
          start: "top top",
          end: () => `+=${Math.round(innerHeight * 0.75 * lijst.length)}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => toon(Math.min(lijst.length - 1, Math.floor(self.progress * lijst.length))),
        });

        return () => {
          pin.current = null;
          gsap.killTweensOf(alles);
          gsap.set(alles, { clearProps: "opacity,transform" });
          index.forEach((el) => el.removeAttribute("aria-current"));
          sectie.removeAttribute("data-gepind");
        };
      });
    },
    { scope: ref },
  );

  // In de vaste stand liggen alle films op één plek; een klik in de index scrolt dan naar het stuk van die film.
  const springNaar = (i: number) => (e: MouseEvent) => {
    const st = pin.current;
    if (!st) return;
    e.preventDefault();
    window.scrollTo({ top: st.start + ((i + 0.5) / films.length) * (st.end - st.start), behavior: "smooth" });
  };

  return (
    <section ref={ref} id="programma" aria-labelledby="rd-programma" className="py-[clamp(4rem,9vw,8rem)]">
      <div className={`rd-binnen ${rand}`}>
        <div className="rd-programma-kopregel flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-5">
          <h2
            id="rd-programma"
            className={`rd-programma-kop ${kop} text-[clamp(3rem,7vw,7rem)] leading-[0.95] tracking-[-0.01em]`}
          >
            Programma
          </h2>
          <p className={`${aftiteling} text-(--merk-gedempt)`}>
            Zes van de {totaalFilms} films
          </p>
        </div>

        <div className="rd-films">
          {films.map((film) => (
            <article
              key={film.nummer}
              id={`film-${film.nummer}`}
              data-film
              aria-labelledby={`rd-film-${film.nummer}`}
              className="rd-film grid grid-cols-12 gap-x-6 gap-y-4 border-t border-(--merk-inkt) py-8 md:py-12"
            >
              <div className="col-span-12 overflow-clip md:col-span-4 lg:col-span-5">
                <p
                  data-cijfer
                  className={`rd-cijfer ${kop} block text-[clamp(5.5rem,13vw,10rem)] leading-[0.86] tracking-[-0.03em]`}
                >
                  {film.nummer}
                </p>
              </div>
              <div className="col-span-12 flex flex-col justify-end md:col-span-8 lg:col-span-7">
                <h3
                  id={`rd-film-${film.nummer}`}
                  data-regel
                  className={`${kop} text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[-0.01em]`}
                >
                  {film.titel}
                </h3>
                <p data-regel className={`${kop} mt-3 max-w-[34ch] text-[clamp(1.3rem,1.9vw,1.75rem)] leading-snug italic`}>
                  {film.zin}
                </p>
                <div data-regel aria-hidden="true" className="mt-7 h-px bg-(--merk-inkt)" />
                <dl className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
                  {aftitelingVan(film).map(([label, waarde]) => (
                    <div
                      key={label}
                      data-regel
                      className="grid gap-0.5 border-b border-(--merk-lijn) py-2.5 sm:grid-cols-[6.5rem_1fr] sm:items-baseline sm:gap-4"
                    >
                      <dt className={`${aftiteling} text-(--merk-gedempt)`}>{label}</dt>
                      <dd className="text-base">{waarde}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>

        <nav aria-label="Films in het programma" className="rd-index mt-6">
          <ol className="grid grid-cols-6 gap-x-5">
            {films.map((film, i) => (
              <li key={film.nummer}>
                <a
                  data-index
                  href={`#film-${film.nummer}`}
                  target="_self"
                  onClick={springNaar(i)}
                  className="group block border-t-2 border-(--merk-lijn) pt-3 text-sm text-(--merk-gedempt) transition-[color,border-color] duration-300 hover:text-(--merk-inkt) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--merk-inkt) focus-visible:outline-solid aria-[current=true]:border-(--merk-rood) aria-[current=true]:text-(--merk-inkt)"
                >
                  <span className="mr-2 tabular-nums group-aria-[current=true]:text-(--merk-rood)">{film.nummer}</span>
                  {film.titel}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
