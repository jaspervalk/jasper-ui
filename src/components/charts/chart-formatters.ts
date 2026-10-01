// Aangepast na `shadcn add @bklit/…`: nl-NL in plaats van en-US, want de werkbank en de projecten zijn
// Nederlandstalig. Een nieuwe `add` van een Bklit-grafiek overschrijft dit bestand; zet het dan terug.
export const shortDateFmt = new Intl.DateTimeFormat("nl-NL", {
  month: "short",
  day: "numeric",
});

export const weekdayDateFmt = new Intl.DateTimeFormat("nl-NL", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const hmsTimeFmt = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// `Intl.NumberFormat.prototype.format` is a bound getter — safe to extract.
export const intFmt = new Intl.NumberFormat("nl-NL").format;
