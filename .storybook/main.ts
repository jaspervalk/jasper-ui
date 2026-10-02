import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const proeftuin = join(root, "proeftuin");
const lokaleThemas = join(root, "themes/lokaal");

// Publiek = de build voor GitHub Pages. Dan nooit de proeftuin (21st.dev verbiedt herdistributie) en nooit de lokale
// huisstijlen. Twee signalen, zodat één vergissing niet genoeg is; scripts/controleer-build.mjs controleert daarna.
const publiek = process.env.WERKBANK_PUBLIEK === "1" || process.argv.includes("build");

// Levert `virtual:werkbank-lokaal` (de lokale huisstijlen) en laat Tailwind de proeftuin scannen. Tailwind slaat
// mappen uit .gitignore over, dus zonder deze @source krijgen klassen die alleen in de proeftuin staan geen CSS.
function werkbankLokaal(): Plugin {
  const id = "virtual:werkbank-lokaal";
  return {
    name: "werkbank-lokaal",
    enforce: "pre",
    resolveId: (bron) => (bron === id ? `\0${id}` : undefined),
    load(geladen) {
      if (geladen !== `\0${id}`) return;
      const namen =
        !publiek && existsSync(lokaleThemas)
          ? readdirSync(lokaleThemas)
              .filter((f) => f.endsWith(".css"))
              .map((f) => f.slice(0, -4))
          : [];
      const imports = namen.map((n) => `import ${JSON.stringify(join(lokaleThemas, `${n}.css`))};`);
      return `${imports.join("\n")}\nexport const lokaleHuisstijlen = ${JSON.stringify(namen)};\n`;
    },
    transform(code, bestand) {
      if (publiek || !existsSync(proeftuin)) return;
      if (!bestand.split("?")[0].endsWith("/src/styles/basis.css")) return;
      return `${code}\n@source "../../proeftuin";\n`;
    },
  };
}

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../src/werkbank/*.mdx",
    "../catalogus/**/*.stories.@(ts|tsx)",
    "../lab/**/*.stories.@(ts|tsx)",
    ...(!publiek && existsSync(proeftuin) ? ["../proeftuin/**/*.stories.@(ts|tsx)"] : []),
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
  ],
  features: {
    componentsManifest: true,
    sidebarOnboardingChecklist: false,
  },
  // Favicon en de lettertypen van het frame (Inter en JetBrains Mono, OFL; licenties in public/fonts).
  staticDirs: ["./public"],
  managerHead: (head) => `${head}
    <style>
      @font-face { font-family: "Inter Variable"; font-weight: 100 900; font-display: swap;
        src: url("./fonts/inter-latin-wght-normal.woff2") format("woff2-variations"); }
      @font-face { font-family: "JetBrains Mono Variable"; font-weight: 100 800; font-display: swap;
        src: url("./fonts/jetbrains-mono-latin-wght-normal.woff2") format("woff2-variations"); }
    </style>`,
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  async viteFinal(vite) {
    // Volgorde telt: werkbankLokaal moet basis.css aanvullen voordat Tailwind hem leest (beide 'pre').
    vite.plugins = [...(vite.plugins ?? []), werkbankLokaal(), tailwindcss()];
    vite.resolve ??= {};
    vite.resolve.alias = { ...(vite.resolve.alias as Record<string, string>), "@": join(root, "src") };
    // Vooraf geoptimaliseerd, zodat een nieuwe variant met GSAP geen herlaadronde van Vite (en wankele tests) geeft.
    vite.optimizeDeps ??= {};
    vite.optimizeDeps.include = [
      ...(vite.optimizeDeps.include ?? []),
      "gsap",
      "gsap/ScrollTrigger",
      "gsap/SplitText",
      "gsap/Flip",
      "@gsap/react",
    ];
    return vite;
  },
};

export default config;
