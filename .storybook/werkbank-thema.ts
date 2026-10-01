import { create } from "storybook/theming";

// Het uiterlijk van de werkbank zelf (zijbalk, werkbalk, panelen): de familie van de cockpit. Petrol als enige accent,
// licht koel getinte vlakken, Inter voor tekst en JetBrains Mono voor code. De lettertypen staan in public/fonts.
const tekst = '"Inter Variable", ui-sans-serif, system-ui, sans-serif';
const code = '"JetBrains Mono Variable", ui-monospace, Menlo, monospace';

const merk = (gedempt: string) =>
  `<span style="font-weight:600;letter-spacing:-0.01em">jasper-ui</span>` +
  `<span style="font-weight:400;color:${gedempt};margin-left:0.3em">werkbank</span>`;

export const licht = create({
  base: "light",
  brandTitle: merk("#5c646f"),
  brandUrl: "./",
  brandImage: null as unknown as string,
  fontBase: tekst,
  fontCode: code,
  colorPrimary: "#046c7f",
  colorSecondary: "#046c7f",
  appBg: "#f3f6fa",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appHoverBg: "#eaf7f9",
  appBorderColor: "#dae0e8",
  appBorderRadius: 8,
  textColor: "#1b2026",
  textInverseColor: "#ffffff",
  textMutedColor: "#5c646f",
  barBg: "#ffffff",
  barTextColor: "#5c646f",
  barHoverColor: "#046c7f",
  barSelectedColor: "#046c7f",
  buttonBg: "#ebf0f5",
  buttonBorder: "#dae0e8",
  booleanBg: "#ebf0f5",
  booleanSelectedBg: "#ffffff",
  inputBg: "#ffffff",
  inputBorder: "#dae0e8",
  inputTextColor: "#1b2026",
  inputBorderRadius: 6,
});

// In donker is het geselecteerde item in de zijbalk een dieper petrol (#1f7a89), zodat witte tekst erop 5:1 haalt;
// het lichte petrol (#5eb3c2) blijft voor tabbladen en pictogrammen in de werkbalk.
export const donker = create({
  base: "dark",
  brandTitle: merk("#9ca5b1"),
  brandUrl: "./",
  brandImage: null as unknown as string,
  fontBase: tekst,
  fontCode: code,
  colorPrimary: "#5eb3c2",
  colorSecondary: "#1f7a89",
  appBg: "#0b0f14",
  appContentBg: "#13181e",
  appPreviewBg: "#0b0f14",
  appHoverBg: "#122529",
  appBorderColor: "#2a3139",
  appBorderRadius: 8,
  textColor: "#e4e8ed",
  textInverseColor: "#0b0f14",
  textMutedColor: "#9ca5b1",
  barBg: "#13181e",
  barTextColor: "#9ca5b1",
  barHoverColor: "#5eb3c2",
  barSelectedColor: "#5eb3c2",
  buttonBg: "#1b2128",
  buttonBorder: "#2a3139",
  booleanBg: "#1b2128",
  booleanSelectedBg: "#2a3139",
  inputBg: "#0b0f14",
  inputBorder: "#2a3139",
  inputTextColor: "#e4e8ed",
  inputBorderRadius: 6,
});
