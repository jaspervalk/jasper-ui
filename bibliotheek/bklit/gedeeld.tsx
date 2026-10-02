import type { Decorator } from "@storybook/react-vite";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { metVoorbeeldlabel } from "@/werkbank/Voorbeeld";

// Gedeeld door de stories van de bibliotheek: opmaak in nl-NL, het label "voorbeeld" en een vaste opzet per story.

const NL = "nl-NL";
const heel = new Intl.NumberFormat(NL, { maximumFractionDigits: 0 });
const eenDecimaal = new Intl.NumberFormat(NL, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const euroHeel = new Intl.NumberFormat(NL, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const euroCent = new Intl.NumberFormat(NL, { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

/** 12.480 */
export const getal = (v: number) => heel.format(v).replace("-", "−");
/** 1,5 */
export const decimaal = (v: number) => eenDecimaal.format(v).replace("-", "−");
/** € 12.480 */
export const euro = (v: number) => euroHeel.format(v).replace("-", "−");
/** € 48,90 */
export const euroCenten = (v: number) => euroCent.format(v).replace("-", "−");
/** 42% uit een fractie (0,42) */
export const procent = (fractie: number) => `${heel.format(fractie * 100)}%`;
/** +3,2% of −1,4% uit een fractie, met een echt minteken */
export const procentMetTeken = (fractie: number) =>
  `${fractie > 0 ? "+" : fractie < 0 ? "−" : ""}${eenDecimaal.format(Math.abs(fractie) * 100)}%`;

const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
/** "3 mrt" uit een Date (lokale tijd) */
export const datumKort = (d: Date) => `${d.getDate()} ${MAANDEN[d.getMonth()]}`;
/** "mrt" uit een Date (lokale tijd) */
export const maand = (d: Date) => MAANDEN[d.getMonth()];

/**
 * Duur van de onthulling: 0 bij "beweging beperken". `MotionConfig` dekt dat niet af, want Bklit animeert de
 * onthulling (een clip van links naar rechts) met een eigen timer. Zonder ms: de standaard van het onderdeel.
 */
export function useAnimatieduur(ms?: number) {
  return useReducedMotion() ? 0 : ms;
}

/** Vaste toevalsgenerator (mulberry32): dezelfde verzonnen reeks bij elke render, dus stabiele beelden en tests. */
export function toeval(zaad: number) {
  let a = zaad;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Decorators voor elke story in de bibliotheek:
 * - `MotionConfig reducedMotion="user"`: de animaties van Bklit (motion) volgen "beweging beperken". Zonder deze
 *   wrapper groeien staven en schuiven taartpunten ook als iemand beweging uit heeft staan.
 * - het label "voorbeeld" bovenaan, zodat de cijfers nooit als echte data lezen.
 */
export function bibliotheekDecorators(tekst = "Verzonnen cijfers, alleen om te laten zien wat dit onderdeel doet."): Decorator[] {
  return [
    (Story) => (
      <MotionConfig reducedMotion="user">
        <Story />
      </MotionConfig>
    ),
    metVoorbeeldlabel(tekst),
  ];
}

interface VoorbeeldProps {
  /** Wat je ziet, in een paar woorden. */
  titel: string;
  /** Eén of twee zinnen: wat het voorbeeld laat zien en waarom dit onderdeel daarbij past. */
  uitleg: ReactNode;
  /** Voor schermlezers: de kern van de data in een zin. Veel Bklit-grafieken zijn `aria-hidden`. */
  samenvatting?: string;
  className?: string;
  children: ReactNode;
}

// Eén voorbeeld: een kop, een korte uitleg en het onderdeel. Geen kaart eromheen; de grafiek staat op de achtergrond
// van de pagina, zoals in een dashboard.
export function Voorbeeld({ titel, uitleg, samenvatting, className, children }: VoorbeeldProps) {
  return (
    <figure className={cn("mx-auto grid w-full max-w-3xl gap-5 px-4 py-6 sm:px-8 sm:py-10", className)}>
      <figcaption className="grid gap-1">
        <span className="text-base font-semibold">{titel}</span>
        <span className="max-w-prose text-sm text-muted-foreground">{uitleg}</span>
        {samenvatting ? <span className="sr-only">{samenvatting}</span> : null}
      </figcaption>
      {children}
    </figure>
  );
}

interface SleutelItem {
  label: string;
  /** Een `var(--chart-…)` of ander token. */
  kleur: string;
  waarde?: string;
  /** Lijn in plaats van stip, voor lijnen in een grafiek. */
  lijn?: boolean;
}

// Kleursleutel onder een grafiek: welke kleur bij welke reeks hoort, met een getal erbij als dat helpt.
export function Sleutel({ items, className }: { items: SleutelItem[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-1 text-sm", className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn("shrink-0", item.lijn ? "h-0.5 w-4 rounded-full" : "size-2.5 rounded-full")}
            style={{ background: item.kleur }}
          />
          <span>{item.label}</span>
          {item.waarde ? <span className="font-mono text-muted-foreground tabular-nums">{item.waarde}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * Vorm van een tijdgrafiek: hoger op een telefoon, breder vanaf 640 px. Geef de grafiek dan `aspectRatio=""`, anders
 * wint de inline verhouding van Bklit.
 */
export const TIJDVORM = "aspect-[3/2] sm:aspect-[5/2]";

/** Vaste tekst onder elke beschrijving in de bibliotheek. */
export const BRON = "Bklit UI, MIT (ui.bklit.com).";

/** De beschrijving van een onderdeel in de docs: wat het laat zien, waarvoor, beperkingen, bron en installatie. */
export function beschrijving({
  wat,
  waarvoor,
  beperkingen,
  naam,
}: {
  wat: string;
  waarvoor: string;
  beperkingen: string;
  /** Naam in het Bklit-register, voor de installatieregel. */
  naam: string;
}) {
  return [
    `**Wat het laat zien:** ${wat}`,
    `**Waarvoor:** ${waarvoor}`,
    `**Beperkingen:** ${beperkingen}`,
    `${BRON} Toevoegen: \`npx shadcn@latest add @bklit/${naam}\`, daarna \`bklit-fix\`.`,
  ].join("\n\n");
}
