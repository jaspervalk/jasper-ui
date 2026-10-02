// Vindt tekst die er wel staat maar niet te zien is: opacity 0 of visibility hidden (ook van een voorouder), nul van
// grootte, of helemaal weggeknipt door een voorouder met overflow hidden. Onder "beweging beperken" hoort alle tekst in
// de eindtoestand te staan; blijft iets zo, dan wachtte het op een animatie die nooit komt.
export function onzichtbareTekst(wortel: HTMLElement): string[] {
  const treffers: string[] = [];
  for (const el of wortel.querySelectorAll<HTMLElement>("*")) {
    if (!heeftEigenTekst(el) || bedoeldVerborgen(el)) continue;
    if (!el.checkVisibility()) continue; // display: none en dergelijke: niet gerenderd, dus niet ons probleem
    const reden =
      (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && "opacity of visibility") ||
      (nulVanGrootte(el) && "geen afmeting") ||
      (weggeknipt(el, wortel) && "weggeknipt");
    if (reden) treffers.push(`"${el.textContent?.trim().slice(0, 40)}" (${reden})`);
  }
  return treffers;
}

function heeftEigenTekst(el: HTMLElement) {
  return [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
}

// Bewust verborgen: alleen voor schermlezers, of decoratief (een herhaalde marquee is aria-hidden).
function bedoeldVerborgen(el: HTMLElement) {
  return Boolean(el.closest(".sr-only, [hidden], [inert], [aria-hidden='true']"));
}

function nulVanGrootte(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.width < 1 || r.height < 1;
}

function weggeknipt(el: HTMLElement, wortel: HTMLElement) {
  const r = el.getBoundingClientRect();
  let { left, top, right, bottom } = r;
  for (let p = el.parentElement; p && p !== wortel.parentElement; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (s.overflowX === "visible" && s.overflowY === "visible") continue;
    const k = p.getBoundingClientRect();
    left = Math.max(left, k.left);
    top = Math.max(top, k.top);
    right = Math.min(right, k.right);
    bottom = Math.min(bottom, k.bottom);
    if (right - left < 1 || bottom - top < 1) return true;
  }
  return false;
}
