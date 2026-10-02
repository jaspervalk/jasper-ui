import { useId } from "react";

// Hal 4 in doorsnede, als bouwtekening: 60 meter lang (1040 eenheden, dus ruim 17 per meter), het doek van 14 meter
// tussen twee loopkranen, links De Mallen onder de houten mallen, rechts Het Dok half onder de waterlijn. Het doek is
// het enige licht. Decoratief: de tekst ernaast zegt hetzelfde. De namen van de zalen staan eronder in HTML, zodat ze
// op 375 px leesbaar blijven.

const vakwerk = Array.from({ length: 26 }, (_, i) => `L${80 + i * 40} 158 L${100 + i * 40} 130`).join(" ");
const kolommen = [60, 190, 320, 450, 580, 710, 840];
// De Mallen: een romp in aanbouw die aan de kraanbaan hangt, spanten binnen de romplijn (via clipPath).
const romp = "M104 228 C106 256 120 282 150 294 L280 296 C312 292 330 264 336 228 Z";
const spanten = Array.from({ length: 14 }, (_, i) => `M${116 + i * 16} 228 V310`).join(" ");

export const zalen = [
  { naam: "De Mallen", midden: 18 },
  { naam: "Hal 4", midden: 48 },
  { naam: "Het Dok", midden: 82.5 },
];

export function HalTekening() {
  const licht = useId();
  const rompId = useId();
  return (
    <svg
      viewBox="0 0 1200 500"
      aria-hidden="true"
      className="lijnwerk block h-auto w-full"
      fill="none"
      stroke="var(--merk-gedempt)"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <radialGradient id={licht} cx="50%" cy="42%" r="70%">
          <stop offset="0" stopColor="var(--merk-oranje-heet)" />
          <stop offset="0.55" stopColor="var(--merk-oranje)" />
          <stop offset="1" stopColor="var(--merk-oranje-diep)" />
        </radialGradient>
        <clipPath id={rompId}>
          <path d={romp} />
        </clipPath>
      </defs>

      {/* Grond, kade en water */}
      <path d="M0 400 H880 M1100 400 H1120 V490" />
      <path d="M1120 430 H1200" />
      <path d="M1132 446 q10 -5 20 0 t20 0 t20 0 M1140 462 q10 -5 20 0 t20 0" stroke="var(--merk-lijn-licht)" />

      {/* Gevels, dak en vakwerkspant */}
      <path d="M60 400 V130 M1100 370 V130" />
      <path d="M36 130 L128 66 H1032 L1124 130 Z" />
      <path d={`M60 130 H1100 M60 158 H1100 M60 130 ${vakwerk}`} stroke="var(--merk-lijn-licht)" />
      <path d={kolommen.map((x) => `M${x + 130} 158 V400`).join(" ")} stroke="var(--merk-lijn)" />

      {/* Kraanbaan met twee loopkranen; het doek hangt ertussen */}
      <path d="M60 182 H1100" strokeWidth={2} />
      <rect x={398} y={172} width={54} height={18} />
      <rect x={703} y={172} width={54} height={18} />
      <path d="M425 190 L455 208 M730 190 L700 208" />
      <path d="M450 207 H705" strokeWidth={2} />
      <rect x={455} y={208} width={245} height={124} fill={`url(#${licht})`} stroke="none" />

      {/* Tribune in Hal 4: zes rijen stoelen */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${436 - i * 8} ${352 + i * 8} H${719 + i * 8}`} strokeDasharray="4 3" />
      ))}

      {/* De Mallen: de houten romp hangt boven de stoelen */}
      <path d="M140 182 V228 M300 182 V228" stroke="var(--merk-lijn-licht)" />
      <path d={spanten} clipPath={`url(#${rompId})`} />
      <path d={romp} strokeWidth={1.75} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${128 - i * 6} ${366 + i * 9} H${302 + i * 6}`} strokeDasharray="4 3" />
      ))}

      {/* Het Dok: half onder de waterlijn, met eigen doek en stoelen */}
      <rect x={880} y={370} width={220} height={120} />
      <path d="M880 430 H1120" strokeDasharray="6 6" stroke="var(--merk-lijn-licht)" />
      <path d="M906 388 H1074" strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${912 - i * 4} ${448 + i * 10} H${1068 + i * 4}`} strokeDasharray="4 3" />
      ))}
    </svg>
  );
}
