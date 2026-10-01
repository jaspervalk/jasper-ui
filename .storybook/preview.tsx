import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react-vite";
import { lokaleHuisstijlen } from "virtual:werkbank-lokaal";

import { donker, licht } from "./werkbank-thema";

import "../src/styles/basis.css";
import "../themes/neutraal.css";
import "../themes/cockpit.css";

// Zet de huisstijl en de donkere modus op <html>: data-huisstijl voor de thema's, .dark voor Tailwind en shadcn.
// data-theme komt van withThemeByDataAttribute, zodat ook code die daarop schakelt (de cockpit) meedoet.
const metHuisstijl: Decorator = (Story, { globals }) => {
  const html = document.documentElement;
  html.dataset.huisstijl = globals.huisstijl ?? "neutraal";
  html.classList.toggle("dark", globals.theme === "donker");
  return <Story />;
};

const naam = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const preview: Preview = {
  globalTypes: {
    huisstijl: {
      description: "Huisstijl",
      toolbar: {
        title: "Huisstijl",
        icon: "paintbrush",
        items: ["neutraal", "cockpit", ...lokaleHuisstijlen].map((value) => ({ value, title: naam(value) })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    huisstijl: "neutraal",
  },
  decorators: [
    metHuisstijl,
    withThemeByDataAttribute({
      themes: { licht: "light", donker: "dark" },
      defaultTheme: "licht",
      attributeName: "data-theme",
    }),
  ],
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    viewport: {
      options: {
        mobiel: { name: "Mobiel (375)", styles: { width: "375px", height: "812px" }, type: "mobile" },
        tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
        desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
      },
    },
    // Elke story faalt in `npm test` bij een overtreding van axe, ook bij te weinig contrast (color-contrast).
    a11y: { test: "error" },
    controls: { expanded: true },
    options: {
      // Wat hier niet staat, komt erna op alfabet. Noem lokale mappen hier niet: dit bestand gaat mee in de build.
      storySort: { order: ["Welkom", "Catalogus", "Lab"] },
    },
    // Docs-pagina's (zoals Welkom) volgen, net als het frame, de systeeminstelling.
    docs: { theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? donker : licht },
  },
};

export default preview;
