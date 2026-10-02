import type { Meta, StoryObj } from "@storybook/react-vite";

import { LandingNacht } from "@/templates/landing-nacht/LandingNacht";
import { metVoorbeeldlabel } from "@/werkbank/Voorbeeld";

const meta = {
  title: "Catalogus/landing-nacht",
  tags: ["merk", "beweging"],
  decorators: [
    metVoorbeeldlabel(
      "Template met de inhoud van een verzonnen festival. Na het installeren vervang je inhoud.ts en merk.css door die van je eigen merk.",
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Donkere landingspagina met een doek dat opengaat bij scrollen en een programma dat oplicht waar je bent. Uit het lab Werfkino (variant Nacht). Installeren: `npx shadcn@latest add @jasper/landing-nacht`.",
      },
    },
  },
} satisfies Meta;

export default meta;

export const Pagina: StoryObj<typeof meta> = { render: () => <LandingNacht /> };
