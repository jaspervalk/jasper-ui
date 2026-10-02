// Gedeelde klassen van de variant Redactioneel. Volledige klassenamen, zodat Tailwind ze ziet.

/** De kolom van de pagina: maximaal 1440 breed, met een rand die meegroeit. */
export const rand = "mx-auto w-full max-w-[90rem] px-5 sm:px-10 xl:px-16";

/** Instrument Serif, voor koppen, nummers en prijzen. */
export const kop = "font-(family-name:--merk-kop) font-normal";

/** De aftiteling: kleine hoofdletters met wat lucht, voor metadata ("Regie", "Zaal"). */
export const aftiteling = "text-xs font-semibold uppercase tracking-[0.14em]";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--merk-inkt) focus-visible:outline-solid";

/** De rode knop. Alleen voor "Koop tickets". */
export const knop = `inline-flex items-center gap-3 bg-(--merk-rood) px-6 py-3.5 text-base font-semibold text-(--merk-papier) transition-[background-color] duration-200 hover:bg-(--merk-rood-diep) ${focus}`;

/** Een gewone link met een fijne onderstreping die donker wordt bij hover. */
export const link = `underline decoration-(--merk-lijn) decoration-1 underline-offset-[0.3em] transition-[text-decoration-color] duration-200 hover:decoration-(--merk-inkt) ${focus}`;
