import type { Meta, StoryObj } from "@storybook/react-vite";

import { metVoorbeeldlabel } from "@/werkbank/Voorbeeld";

import { Pagina } from "./Pagina";

const meta = {
  title: "Lab/2026-10-01 Werfkino/Redactioneel",
  tags: ["merk", "beweging"],
  decorators: [
    metVoorbeeldlabel("Werfkino bestaat niet: een verzonnen festival, om te zien hoe de agent een landingspagina ontwerpt."),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Redactioneel: StoryObj<typeof meta> = { render: () => <Pagina /> };
