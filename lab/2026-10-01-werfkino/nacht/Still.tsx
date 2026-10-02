import type { ReactNode } from "react";

// Een still per film, als lijntekening: staal en mist in grijs, en in elk beeld precies één natriumlamp. Decoratief
// (aria-hidden): titel en zin van de film staan ernaast als tekst.

const lamp = "var(--merk-oranje)";

const motieven: Record<string, ReactNode> = {
  // Laag water: wad bij eb, een bootje op het slik, een baken met licht.
  "01": (
    <>
      <path d="M0 92 H320" />
      <path d="M24 124 H296 M64 138 H256 M108 151 H212" />
      <path d="M140 122 L190 122 L182 131 L150 131 Z" />
      <path d="M232 124 V58 M224 70 H240" />
      <circle cx={232} cy={52} r={4.5} fill={lamp} stroke="none" />
    </>
  ),
  // Ijzer en zout: platen staal met klinknagels, één laspunt.
  "02": (
    <>
      <rect x={36} y={34} width={128} height={92} />
      <rect x={128} y={58} width={150} height={88} />
      {[48, 72, 96, 120, 144].map((x) => (
        <circle key={x} cx={x} cy={44} r={1.6} />
      ))}
      {[140, 164, 188, 212, 236, 260].map((x) => (
        <circle key={x} cx={x} cy={136} r={1.6} />
      ))}
      <path d="M166 92 l-14 -10 M168 88 l-4 -16 M172 92 l12 -12" />
      <circle cx={168} cy={96} r={4} fill={lamp} stroke="none" />
    </>
  ),
  // Kraanmeisje: een havenkraan boven containers, in de cabine brandt licht.
  "03": (
    <>
      <path d="M0 160 H320" />
      <path d="M92 160 V30 M100 160 V30" />
      <path d="M92 150 L100 136 L92 122 L100 108 L92 94 L100 80 L92 66 L100 52 L92 38" />
      <path d="M56 30 H292 M56 22 H96 M96 12 L292 30 M96 12 L56 22" />
      <rect x={48} y={22} width={14} height={14} />
      <path d="M248 30 V108 M244 108 h8 v6 a4 4 0 1 1 -8 0" />
      <rect x={196} y={136} width={64} height={24} />
      <rect x={148} y={146} width={44} height={14} />
      <rect x={102} y={34} width={18} height={12} />
      <rect x={106} y={37} width={10} height={6} fill={lamp} stroke="none" />
    </>
  ),
  // Nachtploeg: de veerboot in het donker, één verlicht raam.
  "04": (
    <>
      <path d="M0 130 H320" />
      <path d="M0 142 h24 M52 142 h40 M128 142 h28 M200 142 h56 M284 142 h36" />
      <path d="M56 130 L264 130 L246 112 L72 112 Z" />
      <rect x={96} y={88} width={120} height={24} />
      <rect x={168} y={70} width={40} height={18} />
      <rect x={124} y={68} width={14} height={20} />
      {[106, 124, 142, 160, 196].map((x) => (
        <rect key={x} x={x} y={96} width={10} height={7} />
      ))}
      <rect x={176} y={75} width={12} height={7} fill={lamp} stroke="none" />
    </>
  ),
  // Wat de rivier meenam: de rivier buiten haar oevers, een stoel en een kist drijven mee, een huis staat half onder.
  "05": (
    <>
      <path d="M0 58 C70 40 110 104 190 86 S290 112 320 104" />
      <path d="M0 98 C70 80 110 144 190 126 S290 152 320 144" />
      <path d="M86 96 v-14 h12 v14 M86 89 h12 M98 96 v6 M86 96 v6" />
      <rect x={156} y={104} width={20} height={12} transform="rotate(-12 166 110)" />
      <path d="M232 40 L262 16 L292 40 M238 40 V66 M286 40 V66" />
      <rect x={254} y={30} width={12} height={9} fill={lamp} stroke="none" />
    </>
  ),
  // Stil sein: een vuurtoren in de mist, de lamp brandt.
  "06": (
    <>
      <path d="M68 164 L88 62 L108 62 L128 164 Z" />
      <path d="M82 62 H114 M90 62 V44 H106 V62 M88 44 L98 36 L108 44" />
      <path d="M110 52 L320 24 M110 54 L320 84" strokeDasharray="2 6" />
      <path d="M0 112 h60 M140 112 h120 M0 128 h40 M150 128 h170 M24 144 h44 M136 144 h150" strokeDasharray="10 8" />
      <circle cx={98} cy={52} r={4.5} fill={lamp} stroke="none" />
    </>
  ),
};

export function Still({ nummer }: { nummer: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      aria-hidden="true"
      className="lijnwerk block aspect-video w-full bg-(--merk-nacht)"
      fill="none"
      stroke="var(--merk-gedempt)"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {motieven[nummer]}
    </svg>
  );
}
