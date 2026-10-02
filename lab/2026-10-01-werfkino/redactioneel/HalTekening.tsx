// Doorsnede van Hal 4 als lijntekening, zoals in een tijdschrift. Schaal: 60 m lang = 940 eenheden, 20 m hoog = 313.
// Inkt voor de constructie, rood alleen voor het doek en de straal van de projector. Getekend naar de tekst in
// inhoud.ts (lengte, hoogte, de drie zalen, het doek onder de kranen); geen echt gebouw.

const VLOER = 350;
const LINKS = 40;
const RECHTS = 980;
const NOK = 37;
const ONDERRAND = 71;
const RAIL = 115;

const kolommen = Array.from({ length: 11 }, (_, k) => LINKS + k * 94);
const vakwerk = Array.from({ length: 41 }, (_, k) => `${LINKS + k * 23.5},${k % 2 ? NOK : ONDERRAND}`).join(" ");

// Tribune: veertien treden van voor (bij het doek) naar achter.
const tribune = (() => {
  let d = `M 740 ${VLOER}`;
  for (let k = 1; k <= 14; k++) d += ` V ${VLOER - 9 * k} H ${740 - 29 * k}`;
  return `${d} V ${VLOER}`;
})();

// De houten mallen: spanten van een romp, van midscheeps (breed en rond) naar de boeg (smal en scherp).
const spanten = [0, 1, 2, 3, 4].map((k) => {
  const breed = 168 - k * 30;
  const diep = 118 - k * 12;
  const x = 160 - breed / 2;
  const rond = 0.62 - k * 0.11;
  return `M ${x} 94 C ${x} ${94 + diep * rond * 1.6}, ${x + breed * 0.18} ${94 + diep}, ${x + breed / 2} ${94 + diep} S ${x + breed} ${94 + diep * rond * 1.6}, ${x + breed} 94`;
});

// Water bij de helling: het oppervlak en een paar arceringen, alleen boven de helling.
const helling = (x: number) => VLOER + (x - 830) * (70 / 360);
const WATER = 372;
const arcering = [382, 392, 402, 412].map((y) => {
  const van = 830 + ((y - VLOER) * 360) / 70 + 6;
  return { y, van: Math.max(van, 976), tot: 1188 };
});

function Marker({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g className="rd-marker">
      <circle cx={x} cy={y} r={17} className="fill-(--merk-papier) stroke-(--merk-inkt)" strokeWidth={1.5} />
      <text
        x={x}
        y={y}
        dy="0.36em"
        textAnchor="middle"
        className="fill-(--merk-inkt) font-(family-name:--merk-tekst) text-[18px] font-semibold"
      >
        {n}
      </text>
    </g>
  );
}

export function HalTekening() {
  return (
    <svg
      viewBox="0 0 1200 430"
      role="img"
      aria-label="Doorsnede van Hal 4: een stalen hal van zestig meter met twee kranen, een tribune voor het doek, De Mallen onder de houten mallen en Het Dok half onder de waterlijn."
      className="block h-auto w-full text-(--merk-inkt)"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="square">
        {/* Maatlijnen */}
        <g strokeWidth={1}>
          <line x1={LINKS} y1={14} x2={RECHTS} y2={14} />
          <line x1={LINKS - 5} y1={19} x2={LINKS + 5} y2={9} />
          <line x1={RECHTS - 5} y1={19} x2={RECHTS + 5} y2={9} />
          <line x1={14} y1={NOK} x2={14} y2={VLOER} />
          <line x1={9} y1={NOK + 5} x2={19} y2={NOK - 5} />
          <line x1={9} y1={VLOER + 5} x2={19} y2={VLOER - 5} />
        </g>

        {/* Kolommen: achter de snede, dus licht; alleen de gevels in inkt */}
        <g strokeWidth={1}>
          {kolommen.map((x) => (
            <line
              key={x}
              x1={x}
              y1={ONDERRAND}
              x2={x}
              y2={x === RECHTS ? WATER : VLOER}
              className={x === LINKS || x === RECHTS ? "stroke-(--merk-inkt)" : "stroke-(--merk-lijn)"}
              strokeWidth={x === LINKS || x === RECHTS ? 1.5 : 1}
            />
          ))}
        </g>

        {/* Dak: vakwerk tussen nok en onderrand, en de kraanbaan */}
        <g strokeWidth={1.25}>
          <line x1={LINKS} y1={NOK} x2={RECHTS} y2={NOK} strokeWidth={2} />
          <line x1={LINKS} y1={ONDERRAND} x2={RECHTS} y2={ONDERRAND} />
          <polyline points={vakwerk} strokeWidth={1} />
          <line x1={LINKS} y1={RAIL} x2={RECHTS} y2={RAIL} />
          <line x1={LINKS} y1={RAIL + 6} x2={RECHTS} y2={RAIL + 6} />
        </g>

        {/* Twee kranen met hun haak */}
        <g strokeWidth={1.25}>
          <rect x={470} y={121} width={46} height={12} />
          <line x1={493} y1={133} x2={493} y2={190} />
          <path d="M 493 190 v 7 a 6 6 0 1 1 -9 5" />
          <rect x={640} y={121} width={46} height={12} />
          <line x1={663} y1={133} x2={663} y2={168} />
          <path d="M 663 168 v 7 a 6 6 0 1 1 -9 5" />
        </g>

        {/* Vloer, helling en water */}
        <g>
          <line x1={LINKS} y1={VLOER} x2={830} y2={VLOER} strokeWidth={2.5} />
          <line x1={LINKS} y1={VLOER + 7} x2={830} y2={VLOER + 7} strokeWidth={1} />
          <line x1={830} y1={VLOER} x2={1190} y2={helling(1190)} strokeWidth={2.5} />
          <line x1={976} y1={WATER} x2={1188} y2={WATER} strokeWidth={1.25} />
          {arcering.map(({ y, van, tot }) => (
            <line key={y} x1={van} y1={y} x2={tot} y2={y} strokeWidth={1} strokeDasharray="10 8" />
          ))}
        </g>

        {/* De Mallen: de houten mallen boven een kleine zaal */}
        <g strokeWidth={1.25}>
          <line x1={66} y1={94} x2={254} y2={94} />
          <line x1={80} y1={ONDERRAND} x2={80} y2={94} />
          <line x1={240} y1={ONDERRAND} x2={240} y2={94} />
          {spanten.map((d) => (
            <path key={d} d={d} />
          ))}
          <rect x={58} y={250} width={204} height={100} className="fill-(--merk-papier)" />
        </g>

        {/* Tribune en projectiecabine */}
        <g strokeWidth={1.5}>
          <path d={tribune} />
          <rect x={286} y={186} width={48} height={38} className="fill-(--merk-papier)" />
          <line x1={286} y1={224} x2={286} y2={VLOER} />
        </g>

        {/* Het Dok: half onder de waterlijn */}
        <rect x={896} y={330} width={76} height={84} strokeWidth={1.5} className="fill-(--merk-papier)" />
      </g>

      {/* Rood: het doek van veertien meter en de straal van de projector */}
      <g className="stroke-(--merk-rood)" fill="none" strokeWidth={1.25}>
        <line x1={334} y1={205} x2={796} y2={152} />
        <line x1={334} y1={205} x2={796} y2={298} />
        <line x1={799.5} y1={RAIL + 6} x2={799.5} y2={150} strokeWidth={1} />
      </g>
      <rect x={796} y={150} width={7} height={150} className="fill-(--merk-rood)" />

      {/* Maten: alleen op een breder scherm, op een telefoon zijn ze te klein */}
      <g aria-hidden="true" className="fill-(--merk-inkt) font-(family-name:--merk-tekst) text-[15px] max-sm:hidden">
        <rect x={486} y={4} width={48} height={20} className="fill-(--merk-papier)" />
        <text x={510} y={14} dy="0.35em" textAnchor="middle">
          60 m
        </text>
        <rect x={4} y={170} width={20} height={46} className="fill-(--merk-papier)" />
        <text x={14} y={193} dy="0.35em" textAnchor="middle" transform="rotate(-90 14 193)">
          20 m
        </text>
      </g>

      <Marker x={560} y={93} n={1} />
      <Marker x={160} y={300} n={2} />
      <Marker x={934} y={352} n={3} />
    </svg>
  );
}
