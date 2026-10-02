import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { RefObject } from "react";

// Eén plek voor GSAP in de werkbank: plugins registreren en animaties alleen opzetten als beweging mag. Globale
// instellingen (gsap.defaults, ScrollTrigger.config) alleen hier, nooit in een variant: die blijven anders tussen
// stories hangen.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip);

export { Flip, gsap, ScrollTrigger, SplitText };

/** Beweging mag. Bij `prefers-reduced-motion: reduce` blijft alles in de eindtoestand. */
export const MAG_BEWEGEN = "(prefers-reduced-motion: no-preference)";

/** Voor handlers buiten `useBeweging` (een klik met Flip): bij nee meteen de eindtoestand zetten. */
export function magBewegen() {
  return typeof window !== "undefined" && window.matchMedia(MAG_BEWEGEN).matches;
}

/**
 * Zet animaties op voor een component. `opzet` draait alleen als beweging mag; een klikhandler maak je veilig met de
 * tweede parameter (`contextSafe`). Bij unmount, of als `dependencies` veranderen, draait useGSAP alles terug:
 * tweens, ScrollTriggers en SplitText. Daarom `revertOnUpdate`, anders ontstaan dubbele ScrollTriggers.
 */
export function useBeweging(
  opzet: gsap.ContextFunc,
  { scope, dependencies = [] }: { scope: RefObject<HTMLElement | null>; dependencies?: unknown[] },
) {
  return useGSAP(
    () => {
      gsap.matchMedia().add(MAG_BEWEGEN, opzet);
      // De story wordt pas na `load` gemount; lettertypen kunnen daarna nog binnenkomen en de maten verschuiven.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
