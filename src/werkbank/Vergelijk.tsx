import { type ReactNode, useEffect, useRef, useState } from "react";

export interface Variant {
  naam: string;
  /** Eén zin: de richting van deze variant. */
  richting?: string;
  element: ReactNode;
}

interface VergelijkProps {
  varianten: Variant[];
  /** Breedte waarop elke variant wordt getekend voordat hij wordt geschaald. Default: 1440. */
  breedte?: number;
}

// Toont varianten van een hele pagina naast elkaar: elke variant wordt op `breedte` getekend en geschaald tot hij in
// zijn kolom past. Bedoeld voor het lab; de varianten zelf staan ook als losse story op ware grootte.
export function Vergelijk({ varianten, breedte = 1440 }: VergelijkProps) {
  return (
    <div
      className="grid gap-6 p-6"
      style={{ gridTemplateColumns: `repeat(${varianten.length}, minmax(0, 1fr))` }}
    >
      {varianten.map((v) => (
        <section key={v.naam} aria-label={v.naam} className="grid content-start gap-2">
          <header className="grid gap-0.5">
            <h2 className="text-sm font-semibold">{v.naam}</h2>
            {v.richting ? <p className="text-xs text-muted-foreground">{v.richting}</p> : null}
          </header>
          <Geschaald breedte={breedte}>{v.element}</Geschaald>
        </section>
      ))}
    </div>
  );
}

function Geschaald({ breedte, children }: { breedte: number; children: ReactNode }) {
  const kader = useRef<HTMLDivElement>(null);
  const inhoud = useRef<HTMLDivElement>(null);
  const [maat, setMaat] = useState({ schaal: 0.3, hoogte: 0 });

  useEffect(() => {
    const k = kader.current;
    const i = inhoud.current;
    if (!k || !i) return;
    const meet = () => setMaat({ schaal: k.clientWidth / breedte, hoogte: i.scrollHeight });
    meet();
    const waarnemer = new ResizeObserver(meet);
    waarnemer.observe(k);
    waarnemer.observe(i);
    return () => waarnemer.disconnect();
  }, [breedte]);

  return (
    <div
      ref={kader}
      className="overflow-hidden rounded-lg border bg-background"
      style={{ height: maat.hoogte * maat.schaal || undefined }}
    >
      <div ref={inhoud} style={{ width: breedte, transform: `scale(${maat.schaal})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}
