import type { Meta, StoryObj } from "@storybook/react-vite";

import { storyId, VergelijkVensters } from "@/werkbank/VergelijkVensters";

const map = "Lab/2026-10-01 Werfkino";

// De drie richtingen naast elkaar, elk in een eigen venster (eigen scroll, dus ScrollTrigger werkt). Niet getest:
// in Vitest bestaat iframe.html niet, en elke variant wordt al los getest.
const meta = {
  title: "Lab/2026-10-01 Werfkino/Vergelijk",
  tags: ["!test"],
  parameters: { layout: "fullscreen", a11y: { options: { iframes: false } } },
} satisfies Meta;

export default meta;

export const Vergelijk: StoryObj<typeof meta> = {
  render: (_, { globals }) => (
    <VergelijkVensters
      globals={globals}
      vensters={[
        {
          naam: "Redactioneel",
          richting: "Een filmtijdschrift op warm papier: schreef, aftiteling, en een programma om door te bladeren.",
          storyId: storyId(`${map}/Redactioneel`, "Redactioneel"),
        },
        {
          naam: "Nacht",
          richting: "De hal 's avonds: zwart, staal en natriumoranje, met een doek dat opengaat als je scrolt.",
          storyId: storyId(`${map}/Nacht`, "Nacht"),
        },
        {
          naam: "Affiche",
          richting: "Een festivalaffiche om te scrollen: reuzenletters in rood, en een programma dat oplicht.",
          storyId: storyId(`${map}/Affiche`, "Affiche"),
        },
      ]}
    />
  ),
};
