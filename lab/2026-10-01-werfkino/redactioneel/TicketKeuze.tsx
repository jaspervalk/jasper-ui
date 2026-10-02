import { type FormEvent, useState } from "react";

import { festival, tickets, voet } from "../inhoud";
import { aftiteling, knop, kop } from "./stijl";

// Tickets als prijslijst: kies een rij, de knop noemt de prijs. Er wordt niets verkocht; een klik zegt dat eerlijk.
export function TicketKeuze() {
  const [keuze, setKeuze] = useState(tickets.find((t) => t.uitgelicht)?.naam ?? tickets[0].naam);
  const [melding, setMelding] = useState("");
  const gekozen = tickets.find((t) => t.naam === keuze) ?? tickets[0];

  const koop = (e: FormEvent) => {
    e.preventDefault();
    setMelding(voet.disclaimer);
  };

  return (
    <form onSubmit={koop}>
      <fieldset>
        <legend className="sr-only">Kies een ticket</legend>
        <div className="border-t border-(--merk-inkt)">
          {tickets.map((t) => (
            <label
              key={t.naam}
              className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-baseline gap-x-4 border-b border-(--merk-inkt) px-3 py-5 transition-[background-color] duration-200 has-checked:bg-(--merk-papier) has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--merk-inkt) has-focus-visible:outline-solid sm:gap-x-6 sm:px-5 sm:py-6"
            >
              <input
                type="radio"
                name="rd-ticket"
                value={t.naam}
                checked={keuze === t.naam}
                onChange={() => {
                  setKeuze(t.naam);
                  setMelding("");
                }}
                className="size-[1.125rem] translate-y-[0.1em] cursor-pointer appearance-none rounded-full border-[1.5px] border-(--merk-inkt) checked:bg-(--merk-inkt) checked:shadow-[inset_0_0_0_3.5px_var(--merk-papier)] focus-visible:outline-none"
              />
              <span>
                <span className={`${kop} block text-[clamp(1.9rem,3.2vw,2.75rem)] leading-none`}>{t.naam}</span>
                <span className="mt-2 block text-base text-(--merk-gedempt)">{t.wat}</span>
                {t.uitgelicht ? <span className={`${aftiteling} mt-3 block`}>Aanbevolen</span> : null}
              </span>
              <span className={`${kop} text-[clamp(1.9rem,3.2vw,2.75rem)] leading-none tabular-nums`}>{t.prijs}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="submit" className={knop}>
          {festival.cta.tekst}
          <span aria-hidden="true" className="h-4 w-px bg-(--merk-papier)/50" />
          <span className="tabular-nums">{gekozen.prijs}</span>
        </button>
        <p aria-live="polite" className="max-w-[44ch] text-sm">
          {melding}
        </p>
      </div>
    </form>
  );
}
