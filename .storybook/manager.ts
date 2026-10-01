import { addons } from "storybook/manager-api";

import { donker, licht } from "./werkbank-thema";

// Volgt de instelling van het systeem (licht of donker) bij het openen van de werkbank.
const voorkeurDonker = window.matchMedia("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  theme: voorkeurDonker ? donker : licht,
  panelPosition: "bottom",
});
