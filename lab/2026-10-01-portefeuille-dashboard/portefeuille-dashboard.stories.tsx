import type { Meta, StoryObj } from "@storybook/react-vite";

import { Vergelijk as VergelijkVarianten } from "@/werkbank/Vergelijk";
import { metVoorbeeldlabel } from "@/werkbank/Voorbeeld";

import { VariantCompact } from "./VariantCompact";
import { VariantRustig } from "./VariantRustig";
import { VariantUitgesproken } from "./VariantUitgesproken";

const meta = {
  title: "Lab/2026-10-01 Portefeuille-dashboard",
  decorators: [
    metVoorbeeldlabel(
      "Fondsen en bedragen zijn verzonnen; dit is niet je echte portefeuille. Een proef om te zien hoe de agent een dashboard ontwerpt, in drie richtingen.",
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Drie richtingen voor het dashboard van een persoonlijke beleggingsportefeuille. Prompt, bronnen en plan staan in `prompt.md`. Alle fondsen en bedragen zijn verzonnen.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rustig: Story = {
  render: () => <VariantRustig />,
};

export const Uitgesproken: Story = {
  render: () => <VariantUitgesproken />,
};

export const Compact: Story = {
  render: () => <VariantCompact />,
};

export const Vergelijk: Story = {
  parameters: {
    // Drie volledige pagina's naast elkaar: elke pagina heeft een eigen <main> en dezelfde secties, en elke pagina
    // staat in een <section aria-label> van Vergelijk. Alleen de regels over dubbele en geneste landmarks staan uit;
    // de losse stories hierboven toetsen ze wel.
    a11y: {
      config: {
        rules: [
          { id: "landmark-no-duplicate-main", enabled: false },
          { id: "landmark-main-is-top-level", enabled: false },
          { id: "landmark-unique", enabled: false },
        ],
      },
    },
  },
  render: () => (
    <VergelijkVarianten
      varianten={[
        {
          naam: "Rustig",
          richting: "Eén groot kerncijfer, veel lucht en één accent.",
          element: <VariantRustig />,
        },
        {
          naam: "Uitgesproken",
          richting: "Het accent draagt de bovenkant; elke sectie opent met een zin.",
          element: <VariantUitgesproken />,
        },
        {
          naam: "Compact",
          richting: "Alles op één scherm: dichte tabel, sorteren en filteren.",
          element: <VariantCompact />,
        },
      ]}
    />
  ),
};
