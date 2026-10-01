// Controleert de publieke build: niets uit de proeftuin (21st.dev verbiedt herdistributie) en niets van de lokale
// huisstijlen mag in docs/ staan. Vindt hij iets, dan verwijdert hij docs/storybook, zodat het niet per ongeluk
// gecommit wordt, en stopt met een fout.
import { readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const docs = fileURLToPath(new URL("../docs", import.meta.url));
const VERBODEN = /proeftuin|inklaretaal|themes\/lokaal/i;
const TEKST = /\.(html|js|mjs|cjs|css|json|map|txt|md|svg)$/;

function* bestanden(map) {
  for (const e of readdirSync(map, { withFileTypes: true })) {
    const pad = join(map, e.name);
    if (e.isDirectory()) yield* bestanden(pad);
    else if (TEKST.test(e.name)) yield pad;
  }
}

const treffers = [];
for (const pad of bestanden(docs)) {
  const tekst = readFileSync(pad, "utf8");
  const m = tekst.match(VERBODEN);
  if (m) {
    const i = m.index ?? 0;
    treffers.push(`${pad.slice(docs.length + 1)}: …${tekst.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, " ")}…`);
  }
}

if (treffers.length) {
  console.error("De build bevat lokale inhoud. docs/storybook is verwijderd; niet publiceren.\n");
  for (const t of treffers) console.error(`  ${t}`);
  rmSync(join(docs, "storybook"), { recursive: true, force: true });
  process.exit(1);
}
console.log("Build gecontroleerd: geen proeftuin en geen lokale huisstijlen in docs/.");
