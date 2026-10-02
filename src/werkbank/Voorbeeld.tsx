import type { Decorator } from "@storybook/react-vite";

// Een strook boven een lab-story die zegt dat de data verzonnen is. Zonder deze strook leest een dashboard met
// bedragen als echte cijfers. Hoort bij de werkbank, niet bij het ontwerp: daarom als decorator, buiten de variant.
export function metVoorbeeldlabel(tekst: string): Decorator {
  return (Story) => (
    <>
      <div className="border-b bg-warning-soft px-4 py-2 text-sm text-foreground">
        <p>
          <strong className="font-semibold">Voorbeeld.</strong> {tekst}
        </p>
      </div>
      <Story />
    </>
  );
}
