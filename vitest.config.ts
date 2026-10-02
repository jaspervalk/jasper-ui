import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const root = dirname(fileURLToPath(import.meta.url));
const lokaal = join(root, "themes/lokaal");

// Elke story draait in elke huisstijl, licht en donker, met axe (a11y.test = "error" in preview.tsx). Zo valt een
// contrastfout op in de combinatie waar hij zit, niet alleen in het standaardthema.
const huisstijlen = [
  "neutraal",
  "cockpit",
  ...(existsSync(lokaal) ? readdirSync(lokaal).filter((f) => f.endsWith(".css")).map((f) => f.slice(0, -4)) : []),
];
const combinaties = huisstijlen.flatMap((huisstijl) => (["licht", "donker"] as const).map((theme) => ({ huisstijl, theme })));

// Start Storybook zelf Vitest (testknop in de UI, of test-run via de MCP), dan draait er één project: Storybook
// hernoemt elk project naar "storybook:<configDir>" en twee projecten met dezelfde config botsen dan. Dat ene project
// gebruikt het standaardthema; `npm test` draait de hele matrix.
const binnenStorybook = process.env.VITEST_STORYBOOK === "true";

// Stories met tag `merk` (landingspagina's van een verzonnen merk) hebben eigen kleuren en reageren niet op de
// huisstijl. Die draaien alleen in neutraal, licht en donker; dat scheelt dubbele runs.
const tags = (huisstijl: string) => ({ include: ["test"], exclude: huisstijl === "neutraal" ? [] : ["merk"] });

export default defineConfig({
  test: {
    projects: (binnenStorybook ? [{ huisstijl: "neutraal", theme: "licht" }] : combinaties).map(({ huisstijl, theme }) => ({
      extends: true,
      plugins: [
        storybookTest({ configDir: join(root, ".storybook"), initialGlobals: { huisstijl, theme }, tags: tags(huisstijl) }),
      ],
      test: {
        name: binnenStorybook ? "storybook" : `${huisstijl}-${theme}`,
        browser: {
          enabled: true,
          headless: true,
          // Tests zien de pagina zoals iemand met "beweging beperken": GSAP zet dan niets op, axe toetst de
          // eindtoestand, en de check in preview.tsx ziet tekst die onzichtbaar blijft. Het bewegende pad toetst
          // scripts/lab-beelden.mjs (fouten in de console laten dat script falen).
          provider: playwright({ contextOptions: { reducedMotion: "reduce" } }),
          instances: [{ browser: "chromium" }],
        },
      },
    })),
  },
});
