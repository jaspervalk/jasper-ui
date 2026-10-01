// Voorbeelddata voor het lab, volledig verzonnen: de fondsen bestaan niet en de bedragen zijn bedacht. De repo is
// openbaar, dus hier komen nooit echte portefeuille- of klantgegevens in. Totalen, rendementen en aandachtspunten
// worden uit de posities berekend, zodat elke variant dezelfde getallen toont.

export type Soort = "Aandelen" | "Obligaties" | "Vastgoed" | "Liquiditeit";

export interface Positie {
  naam: string;
  soort: Soort;
  /** Aantal stuks; null voor liquiditeit. */
  aantal: number | null;
  /** Koers in euro; null voor liquiditeit. */
  koers: number | null;
  waarde: number;
  /** Rendement sinds 1 januari als fractie (0,114 = +11,4%). */
  rendementJaar: number;
  /** Koersverandering vandaag als fractie. */
  vandaag: number;
  /** Resultaat sinds 1 januari in euro. */
  resultaatJaar: number;
  /** Resultaat vandaag in euro. */
  resultaatVandaag: number;
  /** Aandeel in de totale waarde, als fractie. */
  weging: number;
}

const ruw: Omit<Positie, "waarde" | "resultaatJaar" | "resultaatVandaag" | "weging">[] = [
  {
    naam: "Noordkaap Wereldaandelen",
    soort: "Aandelen",
    aantal: 412,
    koers: 142.35,
    rendementJaar: 0.114,
    vandaag: -0.006,
  },
  {
    naam: "Lindeboom Duurzaam Europa",
    soort: "Aandelen",
    aantal: 530,
    koers: 48.9,
    rendementJaar: 0.062,
    vandaag: -0.002,
  },
  {
    naam: "Polder Opkomende Markten",
    soort: "Aandelen",
    aantal: 610,
    koers: 27.15,
    rendementJaar: -0.038,
    vandaag: -0.011,
  },
  {
    naam: "Heidebrand Kleine Bedrijven",
    soort: "Aandelen",
    aantal: 180,
    koers: 61.2,
    rendementJaar: 0.021,
    vandaag: 0.003,
  },
  {
    naam: "Zilverreiger Staatsobligaties",
    soort: "Obligaties",
    aantal: 720,
    koers: 51.8,
    rendementJaar: 0.016,
    vandaag: 0.001,
  },
  {
    naam: "Kustlicht Bedrijfsobligaties",
    soort: "Obligaties",
    aantal: 190,
    koers: 96.4,
    rendementJaar: 0.034,
    vandaag: 0,
  },
  {
    naam: "Duinroos Europees Vastgoed",
    soort: "Vastgoed",
    aantal: 260,
    koers: 34.75,
    rendementJaar: -0.052,
    vandaag: -0.006,
  },
  { naam: "Spaarrekening", soort: "Liquiditeit", aantal: null, koers: null, rendementJaar: 0.019, vandaag: 0 },
];

const SPAARSALDO = 7530.3;
const centen = (n: number) => Math.round(n * 100) / 100;

const metWaarde = ruw.map((p) => {
  const waarde = p.aantal !== null && p.koers !== null ? centen(p.aantal * p.koers) : SPAARSALDO;
  return {
    ...p,
    waarde,
    resultaatJaar: waarde - waarde / (1 + p.rendementJaar),
    resultaatVandaag: waarde - waarde / (1 + p.vandaag),
  };
});

export const totaal = metWaarde.reduce((s, p) => s + p.waarde, 0);
export const posities: Positie[] = metWaarde.map((p) => ({ ...p, weging: p.waarde / totaal }));

export const resultaatJaar = posities.reduce((s, p) => s + p.resultaatJaar, 0);
export const rendementJaar = resultaatJaar / (totaal - resultaatJaar);
export const resultaatVandaag = posities.reduce((s, p) => s + p.resultaatVandaag, 0);
export const rendementVandaag = resultaatVandaag / (totaal - resultaatVandaag);

/** Maandelijkse inleg; sinds de start in oktober 2023 elke maand, dit jaar negen keer. */
export const INLEG_PER_MAAND = 500;
export const ingelegdDitJaar = 9 * INLEG_PER_MAAND;
const STARTWAARDE = 140000;
export const ingelegdSindsStart = STARTWAARDE + 36 * INLEG_PER_MAAND;
export const resultaatSindsStart = totaal - ingelegdSindsStart;
export const liquiditeit = posities.filter((p) => p.soort === "Liquiditeit").reduce((s, p) => s + p.waarde, 0);

export const bijgewerkt = "do 1 okt 2026, 17:35";

// Verdeling naar soort, met het doel en een band van 3 procentpunt: daarbuiten vraagt een soort aandacht.
export const soorten: Soort[] = ["Aandelen", "Obligaties", "Vastgoed", "Liquiditeit"];
export const doelen: Record<Soort, number> = { Aandelen: 0.55, Obligaties: 0.35, Vastgoed: 0.05, Liquiditeit: 0.05 };
export const BAND = 0.03;

export interface Verdeling {
  soort: Soort;
  waarde: number;
  nu: number;
  doel: number;
  /** Nu min doel, als fractie (0,058 = 5,8 procentpunt). */
  verschil: number;
  status: "Boven doel" | "Onder doel" | "Binnen band";
}

export const verdeling: Verdeling[] = soorten.map((soort) => {
  const waarde = posities.filter((p) => p.soort === soort).reduce((s, p) => s + p.waarde, 0);
  const nu = waarde / totaal;
  const doel = doelen[soort];
  const verschil = nu - doel;
  const status = verschil > BAND ? "Boven doel" : verschil < -BAND ? "Onder doel" : "Binnen band";
  return { soort, waarde, nu, doel, verschil, status };
});

export const aandacht = verdeling.filter((v) => v.status !== "Binnen band");

export interface Transactie {
  /** ISO-datum. */
  datum: string;
  soort: "Dividend" | "Aankoop" | "Storting" | "Rente";
  omschrijving: string;
  /** Effect op de liquiditeit: plus is erbij, min is eraf. */
  bedrag: number;
}

export const transacties: Transactie[] = [
  { datum: "2026-09-28", soort: "Dividend", omschrijving: "Lindeboom Duurzaam Europa", bedrag: 212 },
  { datum: "2026-09-15", soort: "Aankoop", omschrijving: "Zilverreiger Staatsobligaties, 40 stuks", bedrag: -2068 },
  { datum: "2026-09-01", soort: "Storting", omschrijving: "Maandelijkse inleg", bedrag: INLEG_PER_MAAND },
  { datum: "2026-08-31", soort: "Rente", omschrijving: "Spaarrekening", bedrag: 11.84 },
  { datum: "2026-08-20", soort: "Dividend", omschrijving: "Noordkaap Wereldaandelen", bedrag: 164.8 },
];

// Waardereeks: elke donderdag van 5 oktober 2023 tot en met 1 oktober 2026 (157 punten). Een vaste toevalsgenerator
// geeft de schommelingen; daarna wordt de reeks per stuk zo gebogen dat hij begint op de startwaarde, op 1 januari
// uitkomt op de waarde van toen en eindigt op het totaal van vandaag. Rond april 2025 zit een verzonnen dip.
export interface Punt {
  date: Date;
  waarde: number;
}

function generator(zaad: number) {
  let a = zaad;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAG = 86_400_000;
const EIND = Date.UTC(2026, 9, 1);
const WEKEN = 156;
const JANUARI = WEKEN - 39; // 1 januari 2026 ligt precies 39 weken voor 1 oktober 2026
const DIP = Date.UTC(2025, 3, 10);

function maakReeks(): Punt[] {
  const toeval = generator(20261001);
  const normaal = () => Math.sqrt(-2 * Math.log(1 - toeval())) * Math.cos(2 * Math.PI * toeval());
  const log: number[] = [0];
  for (let i = 1; i <= WEKEN; i++) log.push(log[i - 1] + 0.0016 + 0.012 * normaal());
  const datums = log.map((_, i) => EIND - (WEKEN - i) * 7 * DAG);
  const metDip = log.map((l, i) => l - 0.1 * Math.exp(-(((datums[i] - DIP) / (5 * 7 * DAG)) ** 2)));

  const beginJaar = totaal - resultaatJaar - ingelegdDitJaar;
  const ankers: [number, number][] = [
    [0, STARTWAARDE],
    [JANUARI, beginJaar],
    [WEKEN, totaal],
  ];
  return metDip.map((l, i) => {
    const s = i <= JANUARI ? 0 : 1;
    const [i0, v0] = ankers[s];
    const [i1, v1] = ankers[s + 1];
    const correctie0 = Math.log(v0) - metDip[i0];
    const correctie1 = Math.log(v1) - metDip[i1];
    const f = (i - i0) / (i1 - i0);
    return { date: new Date(datums[i]), waarde: centen(Math.exp(l + correctie0 + (correctie1 - correctie0) * f)) };
  });
}

export const waardereeks = maakReeks();

export const perioden = [
  { id: "dj", label: "Dit jaar", lang: "sinds 1 januari", weken: WEKEN - JANUARI },
  { id: "1j", label: "1 jaar", lang: "een jaar", weken: 52 },
  { id: "3j", label: "3 jaar", lang: "drie jaar", weken: WEKEN },
] as const;

export type PeriodeId = (typeof perioden)[number]["id"];

export function reeksVoor(id: PeriodeId): Punt[] {
  const periode = perioden.find((p) => p.id === id) ?? perioden[1];
  return waardereeks.slice(-(periode.weken + 1));
}
