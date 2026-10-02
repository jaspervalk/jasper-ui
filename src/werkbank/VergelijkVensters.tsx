import { type ReactNode, useEffect, useRef, useState } from "react";
import { storyNameFromExport, toId } from "storybook/internal/csf";

export interface Venster {
  naam: string;
  /** Eén zin: de richting van deze variant. */
  richting?: string;
  /** Het id van de story op ware grootte; maak het met `storyId(titel, exportnaam)`. */
  storyId: string;
}

interface VergelijkVenstersProps {
  vensters: Venster[];
  /** De globals van de Vergelijk-story (huisstijl, theme), zodat elk venster hetzelfde toont. */
  globals: Record<string, unknown>;
  /** Afmeting van elk venster voordat het wordt geschaald. Default: 1440 × 900. */
  breedte?: number;
  hoogte?: number;
}

/** Het id van een story, zoals Storybook het maakt uit de titel van het bestand en de naam van de export. */
export function storyId(titel: string, exportnaam: string) {
  return toId(titel, storyNameFromExport(exportnaam));
}

// Zet varianten naast elkaar als echte vensters (iframes) op een vaste viewport. Elk venster scrollt zelf, zodat
// ScrollTrigger en vastgezette secties werken zoals op de echte pagina. Voor landingspagina's met beweging; voor
// statische pagina's is `Vergelijk` lichter. Deze story krijgt tags ['!test']: in Vitest bestaat iframe.html niet,
// en elke variant wordt al los getest.
export function VergelijkVensters({ vensters, globals, breedte = 1440, hoogte = 900 }: VergelijkVenstersProps) {
  const [samen, setSamen] = useState(true);
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const query = Object.entries(globals)
    .filter(([, waarde]) => typeof waarde === "string" && /^[a-zA-Z0-9 _-]+$/.test(waarde))
    .map(([sleutel, waarde]) => `${sleutel}:${waarde}`)
    .join(";");

  // Samen scrollen: scrolt één venster, dan gaan de andere naar hetzelfde deel van hun pagina (verhoudingsgewijs,
  // want de pagina's zijn niet even lang). Een venster dat wij zelf verschuiven, negeert de scroll die daaruit volgt.
  useEffect(() => {
    if (!samen) return;
    const wij = new Set<Window>();
    const opruimen: (() => void)[] = [];
    const koppel = () => {
      for (const f of frames.current) {
        const w = f?.contentWindow;
        if (!w) continue;
        const bijScroll = () => {
          if (wij.has(w)) return void wij.delete(w);
          const bron = w.document.scrollingElement;
          if (!bron) return;
          const deel = w.scrollY / Math.max(1, bron.scrollHeight - w.innerHeight);
          for (const ander of frames.current) {
            const a = ander?.contentWindow;
            const doel = a?.document.scrollingElement;
            if (!a || a === w || !doel) continue;
            const y = deel * Math.max(0, doel.scrollHeight - a.innerHeight);
            if (Math.abs(a.scrollY - y) < 1) continue;
            wij.add(a);
            a.scrollTo(0, y);
          }
        };
        w.addEventListener("scroll", bijScroll, { passive: true });
        opruimen.push(() => w.removeEventListener("scroll", bijScroll));
      }
    };
    // Pas koppelen als de vensters geladen zijn; bij herladen (andere huisstijl) opnieuw.
    const bijLaden = () => {
      opruimen.splice(0).forEach((f) => f());
      koppel();
    };
    for (const f of frames.current) f?.addEventListener("load", bijLaden);
    koppel();
    return () => {
      opruimen.forEach((f) => f());
      for (const f of frames.current) f?.removeEventListener("load", bijLaden);
    };
  }, [samen, query]);

  return (
    <div className="grid gap-4 p-6">
      <label className="flex w-fit items-center gap-2 text-sm">
        <input type="checkbox" checked={samen} onChange={(e) => setSamen(e.target.checked)} className="size-4" />
        Samen scrollen
      </label>
      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${vensters.length}, minmax(0, 1fr))` }}>
        {vensters.map((v, i) => (
          <section key={v.storyId} aria-label={v.naam} className="grid content-start gap-2">
            <header className="flex items-baseline justify-between gap-3">
              <div className="grid gap-0.5">
                <h2 className="text-sm font-semibold">{v.naam}</h2>
                {v.richting ? <p className="text-xs text-muted-foreground">{v.richting}</p> : null}
              </div>
              <a
                href={`./?path=/story/${v.storyId}`}
                target="_top"
                className="shrink-0 text-xs text-primary underline underline-offset-2"
              >
                Ware grootte
              </a>
            </header>
            <Geschaald breedte={breedte} hoogte={hoogte}>
              <iframe
                ref={(el) => {
                  frames.current[i] = el;
                }}
                title={`${v.naam} (variant ${i + 1})`}
                src={`iframe.html?id=${v.storyId}&viewMode=story${query ? `&globals=${query}` : ""}`}
                width={breedte}
                height={hoogte}
                className="block border-0 bg-background"
              />
            </Geschaald>
          </section>
        ))}
      </div>
    </div>
  );
}

function Geschaald({ breedte, hoogte, children }: { breedte: number; hoogte: number; children: ReactNode }) {
  const kader = useRef<HTMLDivElement>(null);
  const [schaal, setSchaal] = useState(0.3);

  useEffect(() => {
    const k = kader.current;
    if (!k) return;
    const meet = () => setSchaal(k.clientWidth / breedte);
    meet();
    const waarnemer = new ResizeObserver(meet);
    waarnemer.observe(k);
    return () => waarnemer.disconnect();
  }, [breedte]);

  return (
    <div ref={kader} className="overflow-hidden rounded-lg border" style={{ height: hoogte * schaal }}>
      <div style={{ width: breedte, height: hoogte, transform: `scale(${schaal})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}
