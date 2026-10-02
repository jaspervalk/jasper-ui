// Beelden en video van lab-stories, voor de beoordeling. Schrijft naar een map buiten de repo (de scratchpad).
//
//   node scripts/lab-beelden.mjs <uitmap> <filter> [--huisstijlen neutraal,cockpit] [--url http://localhost:6006]
//
// <filter> kiest stories op id of titel (bijvoorbeeld "2026-10-02-koffie"). Per story:
//   - een still op 1440 en 375 px, licht en donker, onder "beweging beperken" (de eindtoestand, hele pagina);
//   - bij tag `beweging`: een video van een rustige scroll van boven naar onder, mét beweging (1440 × 900).
// Stories met tag `merk` krijgen alleen de huisstijl neutraal; de story Vergelijk wordt overgeslagen.
// Faalt (exitcode 1) bij een fout of console.error op een pagina, zodat ook het bewegende pad getoetst is.
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const optie = (naam, standaard) => {
  const i = args.indexOf(`--${naam}`);
  return i >= 0 ? args[i + 1] : standaard;
};
const [uit, filter] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!uit || !filter) {
  console.error("Gebruik: node scripts/lab-beelden.mjs <uitmap> <filter> [--huisstijlen neutraal,cockpit] [--url …]");
  process.exit(1);
}
const basis = optie("url", "http://localhost:6006");
const huisstijlen = optie("huisstijlen", "neutraal,cockpit").split(",");
mkdirSync(uit, { recursive: true });

const index = await (await fetch(`${basis}/index.json`)).json();
const stories = Object.values(index.entries).filter(
  (e) => e.type === "story" && e.name !== "Vergelijk" && (e.id.includes(filter) || e.title.includes(filter)),
);
if (!stories.length) {
  console.error(`Geen stories gevonden voor "${filter}".`);
  process.exit(1);
}

const browser = await chromium.launch();
const fouten = [];
const url = (id, globals) => `${basis}/iframe.html?viewMode=story&id=${id}&globals=${globals}`;

async function open(context, adres, label) {
  const page = await context.newPage();
  page.on("pageerror", (e) => fouten.push(`${label}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && fouten.push(`${label}: ${m.text()}`));
  await page.goto(adres, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

for (const story of stories) {
  const tags = story.tags ?? [];
  for (const huisstijl of tags.includes("merk") ? ["neutraal"] : huisstijlen) {
    for (const theme of ["licht", "donker"]) {
      for (const breedte of [1440, 375]) {
        const naam = `${story.id}-${huisstijl}-${theme}-${breedte}`;
        const context = await browser.newContext({
          viewport: { width: breedte, height: breedte === 375 ? 812 : 900 },
          deviceScaleFactor: 2,
          reducedMotion: "reduce",
        });
        const page = await open(context, url(story.id, `huisstijl:${huisstijl};theme:${theme}`), naam);
        await page.waitForTimeout(800);
        await page.screenshot({ path: join(uit, `${naam}.png`), fullPage: true });
        await context.close();
        console.log("beeld", naam);
      }
    }
  }

  if (tags.includes("beweging")) {
    const naam = `${story.id}-beweging`;
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
    // De opname start vóór het laden, anders mist de video de openingsanimatie.
    const page = await context.newPage();
    page.on("pageerror", (e) => fouten.push(`${naam}: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && fouten.push(`${naam}: ${m.text()}`));
    await page.screencast.start({ path: join(uit, `${naam}.webm`), size: { width: 1440, height: 900 } });
    await page.goto(url(story.id, "huisstijl:neutraal;theme:licht"), { waitUntil: "networkidle" });
    await page.waitForTimeout(2500); // de opening
    // Rustig scrollen met ongeveer 500 px per seconde, zoals iemand die leest; onderaan even stilstaan.
    await page.evaluate(
      () =>
        new Promise((klaar) => {
          const doel = () => document.documentElement.scrollHeight - innerHeight;
          let vorige = performance.now();
          const stap = (nu) => {
            scrollBy(0, ((nu - vorige) / 1000) * 500);
            vorige = nu;
            if (scrollY < doel() - 1) requestAnimationFrame(stap);
            else klaar();
          };
          requestAnimationFrame(stap);
        }),
    );
    await page.waitForTimeout(1500);
    await page.screencast.stop();
    await context.close();
    // Ook als mp4, want QuickTime en het snelle voorbeeld van de Finder spelen geen webm. Alleen als ffmpeg er is.
    const mp4 = spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-i", join(uit, `${naam}.webm`), "-c:v", "libx264",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(uit, `${naam}.mp4`)]);
    console.log("video", naam, mp4.status === 0 ? "(webm en mp4)" : "(webm)");
  }
}

await browser.close();
if (fouten.length) {
  console.error(`\n${fouten.length} fout(en) op de pagina's:`);
  for (const f of fouten) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\nKlaar: ${stories.length} stories, beelden in ${uit}`);
