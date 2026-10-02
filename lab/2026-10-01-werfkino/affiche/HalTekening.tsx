// Hal 4 in doorsnede, als drukwerk: de gevel in rood, met vakwerkspant, kraanbaan en het doek. Schaal: 20 eenheden
// per meter. Alleen de maten uit de tekst staan erbij (20 m hoog, doek 14 m breed); de rest is tekening, geen data.
// Decoratief (aria-hidden): dezelfde feiten staan als tekst naast de tekening.

const GROND = 470;
const NOK = GROND - 20 * 20; // 20 m
const GOOT = 170;
const LINKS = 130;
const RECHTS = 870;
const MIDDEN = 500;
const ONDERRAND_SPANT = 196;

/** Hoogte van de dakrand op plek x. */
function dak(x: number) {
  const helling = (GOOT - NOK) / (MIDDEN - LINKS);
  return x <= MIDDEN ? GOOT - (x - LINKS) * helling : NOK + (x - MIDDEN) * helling;
}

// Vakwerk: een zigzag tussen onderrand en dak, in acht vakken.
const vakken = 8;
const vakwerk = Array.from({ length: vakken + 1 }, (_, i) => {
  const x = LINKS + 18 + (i * (RECHTS - LINKS - 36)) / vakken;
  return `${x},${i % 2 === 0 ? ONDERRAND_SPANT : dak(x) + 8}`;
}).join(" ");

export function HalTekening({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ fontFamily: "var(--merk-kop)" }}
    >
      {/* De gevel */}
      <path d={`M${LINKS} ${GROND} V${GOOT} L${MIDDEN} ${NOK} L${RECHTS} ${GOOT} V${GROND} Z`} fill="var(--merk-rood)" />

      <g stroke="var(--merk-inkt)" fill="none" strokeLinejoin="miter">
        {/* Spant: onderrand en vakwerk */}
        <line x1={LINKS} y1={ONDERRAND_SPANT} x2={RECHTS} y2={ONDERRAND_SPANT} strokeWidth="6" />
        <polyline points={vakwerk} strokeWidth="4" />
        {/* Kolommen langs de wanden */}
        <line x1={LINKS + 18} y1={ONDERRAND_SPANT} x2={LINKS + 18} y2={GROND} strokeWidth="8" />
        <line x1={RECHTS - 18} y1={ONDERRAND_SPANT} x2={RECHTS - 18} y2={GROND} strokeWidth="8" />
        {/* Kabels van de loopkat naar het doek */}
        <line x1="372" y1="252" x2="372" y2="272" strokeWidth="3" />
        <line x1="628" y1="252" x2="628" y2="272" strokeWidth="3" />
      </g>

      {/* Kraanbaan met loopkat */}
      <rect x={LINKS + 18} y="226" width={RECHTS - LINKS - 36} height="14" fill="var(--merk-inkt)" />
      <rect x="460" y="240" width="80" height="12" fill="var(--merk-inkt)" />

      {/* Het doek, met zijn maat */}
      <rect x="360" y="272" width="280" height="117" fill="var(--merk-grond)" />
      <g stroke="var(--merk-inkt)" strokeWidth="3">
        <line x1="378" y1="352" x2="622" y2="352" />
        <line x1="378" y1="342" x2="378" y2="362" />
        <line x1="622" y1="342" x2="622" y2="362" />
      </g>
      <text x={MIDDEN} y="334" textAnchor="middle" fontSize="40" fontWeight="800" fill="var(--merk-inkt)">
        14 M
      </text>

      {/* Stoelen */}
      <g fill="var(--merk-inkt)">
        {[414, 432, 450].map((y, rij) => {
          const aantal = 12 + rij * 2;
          const breedte = 300 + rij * 70;
          const stap = breedte / aantal;
          return Array.from({ length: aantal }, (_, i) => (
            <rect key={`${y}-${i}`} x={MIDDEN - breedte / 2 + i * stap + 3} y={y} width={stap - 6} height="7" />
          ));
        })}
      </g>

      {/* Grondlijn en hoogtemaat */}
      <g stroke="var(--merk-grond)" strokeWidth="2">
        <line x1="20" y1={GROND} x2="980" y2={GROND} />
        <line x1={MIDDEN + 4} y1={NOK} x2="932" y2={NOK} strokeDasharray="3 7" />
        <line x1="920" y1={NOK} x2="920" y2={GROND} />
        <line x1="908" y1={NOK} x2="932" y2={NOK} />
        <line x1="908" y1={GROND} x2="932" y2={GROND} />
      </g>
      <text x="940" y={(NOK + GROND) / 2 + 10} fontSize="28" fontWeight="800" fill="var(--merk-grond)">
        20 M
      </text>
    </svg>
  );
}
